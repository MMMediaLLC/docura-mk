// ==============================================================
// firebaseService.ts
// Central service for all Firestore + subscription interactions.
// ==============================================================
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  increment,
  updateDoc,
  deleteDoc,
  getDocFromServer,
  getCountFromServer
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { AnalysisResult } from '../types/analysis';
import { User, UserStatus, UserPlan, createDefaultUser } from '../types/user';
import { getPlanLimit } from '../config/plans';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ============================================================
// Subscription helpers — self-contained, reusable
// ============================================================

/**
 * Called before any analysis. Checks if the usage reset
 * period has passed and automatically resets if needed.
 * Returns the (possibly updated) reset updates to apply.
 */
function buildResetIfNeeded(user: User): Partial<User> | null {
  if (!user.usageResetDate) {
    // No reset date → initialize it to now + 30 days
    const newReset = new Date();
    newReset.setDate(newReset.getDate() + 30);
    return {
      usageCount: 0,
      usageResetDate: newReset.toISOString(),
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: newReset.toISOString(),
    };
  }

  const now = new Date();
  const resetDate = new Date(user.usageResetDate);

  if (now > resetDate) {
    // Period has ended → reset usage and roll next period
    const newReset = new Date();
    newReset.setDate(newReset.getDate() + 30);
    return {
      usageCount: 0,
      usageResetDate: newReset.toISOString(),
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: newReset.toISOString(),
    };
  }

  return null;
}

/**
 * Pure check — can this user run another analysis?
 */
function canAnalyze(user: User): boolean {
  const limit = getPlanLimit(user.plan);
  // Guard against corrupted usageCount
  const safeUsage = typeof user.usageCount === 'number' && !isNaN(user.usageCount) 
    ? user.usageCount 
    : 0;
  return safeUsage < limit;
}

// ============================================================
// Main service object
// ============================================================
export const firebaseService = {

  // ── Subscription Helpers ─────────────────────────────────

  getPlanLimit(plan: UserPlan): number {
    return getPlanLimit(plan);
  },

  canAnalyze(user: User): boolean {
    return canAnalyze(user);
  },

  // ── User Profile ─────────────────────────────────────────

  async getUserStatus(userId: string): Promise<UserStatus> {
    const path = `users/${userId}`;
    try {
      const snap = await getDoc(doc(db, path));

      if (!snap.exists()) {
        // First login — provision free account
        const newUser = createDefaultUser(userId, auth.currentUser?.email || '');
        await setDoc(doc(db, path), newUser);
        return {
          plan: 'free',
          usageCount: 0,
          usageLimit: 1,
          remaining: 1,
          isLimitReached: false,
          usageResetDate: newUser.usageResetDate,
        };
      }

      let data = snap.data() as User;

      // Migrate legacy `true_docura` plan to `free`
      if ((data.plan as string) === 'true_docura') {
        await updateDoc(doc(db, path), { plan: 'free' });
        data = { ...data, plan: 'free' };
      }

      // We no longer strictly care about monthly usageCount resets for "active documents",
      // but keeping billing period resets keeps the User record clean.
      const resetUpdates = buildResetIfNeeded(data);
      if (resetUpdates) {
        await updateDoc(doc(db, path), resetUpdates);
        data = { ...data, ...resetUpdates };
      }

      // Compute Active Documents via live DB count
      const q = query(collection(db, 'analyses'), where('userId', '==', userId));
      const countSnap = await getCountFromServer(q);
      const activeDocsCount = countSnap.data().count;

      const limit = getPlanLimit(data.plan);
      const remaining = Math.max(0, limit - activeDocsCount);
      const isLimitReached = activeDocsCount >= limit;

      return {
        plan: data.plan,
        usageCount: activeDocsCount, // Replaces naive increment with factual live active docs
        usageLimit: limit,
        remaining,
        isLimitReached,
        usageResetDate: data.usageResetDate ?? null,
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      throw error;
    }
  },

  /**
   * Checks whether the user can run another analysis.
   * Returns a structured result — never throws for a limit case.
   * Real Firestore/network errors still propagate so callers can handle them separately.
   */
  async canRunAnalysis(userId: string): Promise<{ allowed: boolean; reason?: 'plan_limit' }> {
    const status = await this.getUserStatus(userId);
    if (status.isLimitReached) {
      return { allowed: false, reason: 'plan_limit' };
    }
    return { allowed: true };
  },

  async incrementUsage(userId: string): Promise<void> {
    const path = `users/${userId}`;
    try {
      await updateDoc(doc(db, path), { usageCount: increment(1) });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  /** Called when user selects a plan (manual MVP flow before Lemon Squeezy webhook) */
  async updatePlan(userId: string, plan: UserPlan): Promise<void> {
    const path = `users/${userId}`;
    try {
      const limit = getPlanLimit(plan);
      const now = new Date();
      const end = new Date(now);
      end.setDate(end.getDate() + 30);

      await updateDoc(doc(db, path), {
        plan,
        usageLimit: limit,
        usageCount: 0,
        subscriptionStatus: 'active',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: end.toISOString(),
        usageResetDate: end.toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      throw error;
    }
  },

  /**
   * MVP post-payment activation: store billingEmail on profile.
   * Will be matched/confirmed by webhook in production.
   */
  async activateUnverifiedPlan(userId: string, plan: 'pro' | 'business', billingEmail: string): Promise<void> {
    const path = `users/${userId}`;
    try {
      const limit = getPlanLimit(plan);
      const now = new Date();
      const end = new Date(now);
      end.setDate(end.getDate() + 30);

      await updateDoc(doc(db, path), {
        plan,
        usageLimit: limit,
        usageCount: 0,
        billingEmail,
        subscriptionStatus: 'active',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: end.toISOString(),
        usageResetDate: end.toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      throw error;
    }
  },

  // ── Analyses ─────────────────────────────────────────────

  async saveAnalysis(analysis: AnalysisResult, userId: string, chunks: any[]): Promise<void> {
    if (!userId) {
      throw new Error("[Security] Missing authenticated userId for FireStore write.");
    }
    
    // HARDENING: Strictly limit to 1 chunk maximum, and trim safely to 50k chars
    const safeChunks = chunks.slice(0, 1).map(c => ({
      ...c,
      content: typeof c.content === 'string' ? c.content.substring(0, 50000) : ''
    }));

    const path = `analyses/${analysis.id}`;
    try {
      await setDoc(doc(db, path), {
        ...analysis,
        userId, // Strictly enforce owner identity
        chunks: safeChunks,
        uploadDate: new Date().toISOString()
      });
      await this.incrementUsage(userId);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getAnalysis(id: string): Promise<{ analysis: AnalysisResult, chunks: any[] } | null> {
    const path = `analyses/${id}`;
    try {
      const snap = await getDoc(doc(db, path));
      if (!snap.exists()) return null;
      const data = snap.data();
      const { chunks, userId, ...analysis } = data;
      return { analysis: analysis as AnalysisResult, chunks: chunks || [] };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      throw error;
    }
  },

  async deleteAnalysis(id: string): Promise<void> {
    const path = `analyses/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
      throw error;
    }
  },

  async listAnalyses(userId: string) {
    const path = 'analyses';
    try {
      const q = query(
        collection(db, path),
        where('userId', '==', userId),
        orderBy('uploadDate', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => d.data());
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      throw error;
    }
  },

  // ── Connection Test ───────────────────────────────────────

  async testConnection(): Promise<void> {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error('Please check your Firebase configuration.');
      }
    }
  }
};
