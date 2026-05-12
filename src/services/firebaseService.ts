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

function buildResetIfNeeded(user: User): Partial<User> | null {
  const isPaid = user.plan !== 'free';
  const now = new Date();

  // If there's no period end yet, initialize it
  if (!user.currentPeriodEnd) {
    const newEnd = new Date(now);
    newEnd.setDate(newEnd.getDate() + 30);
    return {
      usageCount: 0,
      usedAnalysesInPeriod: 0,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: newEnd.toISOString(),
    };
  }

  const periodEnd = new Date(user.currentPeriodEnd);

  // If the period has elapsed
  if (now >= periodEnd) {
    if (isPaid && user.subscriptionStatus === 'active') {
      // Roll forward by exactly 1 month and reset monthly usage
      const newStart = new Date(periodEnd);
      const newEnd = new Date(periodEnd);
      newEnd.setMonth(newEnd.getMonth() + 1);
      // Failsafe: if they haven't logged in for 3 months, jump to now
      if (now > newEnd) {
        newEnd.setTime(now.getTime());
        newEnd.setMonth(newEnd.getMonth() + 1);
      }
      return {
        usageCount: 0,
        usedAnalysesInPeriod: 0,
        currentPeriodStart: newStart.toISOString(),
        currentPeriodEnd: newEnd.toISOString(),
      };
    } else {
      // Inactive subscription or Free
      // DO NOT update 'plan' or 'subscriptionStatus' here (Firestore rules block it)
      const newEnd = new Date(now);
      newEnd.setDate(newEnd.getDate() + 30);
      return {
        usageCount: 0,
        usedAnalysesInPeriod: 0,
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: newEnd.toISOString(),
      };
    }
  }

  return null;
}

/**
 * Pure check — can this user run another analysis based strictly on their current tracking numbers?
 */
function canAnalyze(user: User): boolean {
  // If plan claims to be paid, but subscription is inactive, treat as Free limit
  const activePlan = (user.plan !== 'free' && user.subscriptionStatus !== 'active') ? 'free' : user.plan;
  const limit = getPlanLimit(activePlan);
  if (activePlan === 'free') {
    return (user.lifetimeFreeAnalysesUsed || 0) < limit;
  }
  return (user.usedAnalysesInPeriod || 0) < limit;
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
          usedAnalysesInPeriod: 0,
          lifetimeFreeAnalysesUsed: 0,
          usageLimit: 1,
          remaining: 1,
          isLimitReached: false,
          usageResetDate: newUser.currentPeriodEnd,
        };
      }

      let data = snap.data() as User;

      // Ensure default fields exist
      if (typeof data.lifetimeFreeAnalysesUsed === 'undefined') data.lifetimeFreeAnalysesUsed = 0;
      if (typeof data.usedAnalysesInPeriod === 'undefined') data.usedAnalysesInPeriod = 0;

      // Migrate legacy `true_docura` plan to `free`
      if ((data.plan as string) === 'true_docura') {
        const update = { plan: 'free' as UserPlan };
        updateDoc(doc(db, path), update).catch(e => console.warn('[Security] Legacy plan drift silent handle'));
        data = { ...data, ...update };
      }

      // Check and apply period rollovers
      const resetUpdates = buildResetIfNeeded(data);
      if (resetUpdates) {
        // Safe to ignore firestore rule throws here (if periods are restricted)
        updateDoc(doc(db, path), { ...resetUpdates }).catch(e => console.warn('[Security] Rollover logic DB write suppressed'));
        data = { ...data, ...resetUpdates };
      }

      // If user has paid plan but it is not active, treat as 'free' for limits here
      const effectivePlan = (data.plan !== 'free' && data.subscriptionStatus !== 'active') ? 'free' : data.plan;

      const limit = getPlanLimit(effectivePlan);
      const currentUsage = effectivePlan === 'free' ? data.lifetimeFreeAnalysesUsed : data.usedAnalysesInPeriod;
      const remaining = Math.max(0, limit - currentUsage);
      const isLimitReached = currentUsage >= limit;

      return {
        plan: effectivePlan,
        usedAnalysesInPeriod: data.usedAnalysesInPeriod,
        lifetimeFreeAnalysesUsed: data.lifetimeFreeAnalysesUsed,
        usageLimit: limit,
        remaining,
        isLimitReached,
        usageResetDate: data.currentPeriodEnd ?? null,
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
      const snap = await getDoc(doc(db, path));
      if (!snap.exists()) return;
      
      const data = snap.data() as User;
      const updates: Partial<User> = {};
      
      // Legacy compliance + always increment lifetime
      updates.usageCount = increment(1) as unknown as number;
      updates.lifetimeFreeAnalysesUsed = increment(1) as unknown as number;
      
      // If paid plan, increment the monthly counter too
      if (data.plan !== 'free') {
        updates.usedAnalysesInPeriod = increment(1) as unknown as number;
      }
      
      await updateDoc(doc(db, path), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  /** Called when user selects a plan (manual MVP flow before Lemon Squeezy webhook) */
  async updatePlan(userId: string, plan: UserPlan): Promise<void> {
    const path = `users/${userId}`;
    try {
      const now = new Date();
      const end = new Date(now);
      end.setMonth(end.getMonth() + 1);

      await updateDoc(doc(db, path), {
        plan,
        usageCount: 0,
        usedAnalysesInPeriod: 0,
        subscriptionStatus: 'active',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: end.toISOString()
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
      const now = new Date();
      const end = new Date(now);
      end.setMonth(end.getMonth() + 1);

      await updateDoc(doc(db, path), {
        plan,
        usageCount: 0,
        usedAnalysesInPeriod: 0,
        billingEmail,
        subscriptionStatus: 'active',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: end.toISOString()
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
    
    // Minimal history record — all fields required to render the Analysis page without crashing
    const minimalRecord = {
      id: analysis.id,
      userId,
      documentName: analysis.fileName || 'Untitled Document',
      title: analysis.title || analysis.fileName || 'Untitled Document',
      documentType: analysis.documentType || 'document',
      createdAt: new Date().toISOString(),
      status: 'completed',
      summary: typeof analysis.summary === 'string' ? analysis.summary.substring(0, 500) : '',
      keyPoints: Array.isArray(analysis.keyPoints) ? analysis.keyPoints.map(String).slice(0, 10) : [],
      risks: Array.isArray(analysis.risks) ? analysis.risks.map(r => ({ title: String(r.title || ''), severity: r.severity || 'medium', explanation: String(r.explanation || ''), sourceHint: r.sourceHint })).slice(0, 10) : [],
      obligations: Array.isArray(analysis.obligations) ? analysis.obligations.map(o => ({ party: String(o.party || 'unspecified'), obligation: String(o.obligation || ''), timing: String(o.timing || '') })).slice(0, 10) : [],
      deadlines: Array.isArray(analysis.deadlines) ? analysis.deadlines.map(d => ({ dateOrPeriod: String(d.dateOrPeriod || ''), description: String(d.description || ''), severity: d.severity || 'info' })).slice(0, 10) : [],
      keyClauses: Array.isArray(analysis.keyClauses) ? analysis.keyClauses.map(c => ({ title: String(c.title || ''), type: String(c.type || ''), summary: String(c.summary || ''), sourceHint: c.sourceHint })).slice(0, 10) : [],
      confidenceNotes: Array.isArray(analysis.confidenceNotes) ? analysis.confidenceNotes.map(String).slice(0, 5) : [],
      questions: Array.isArray(analysis.suggestedQuestions) ? analysis.suggestedQuestions.map(String).slice(0, 10) : []
    };

    const path = `analyses/${analysis.id}`;
    try {
      await setDoc(doc(db, path), minimalRecord);
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
      return {
        analysis: data as AnalysisResult,
        chunks: []
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
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
      const q = query(collection(db, path), where('userId', '==', userId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
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
  },

  // ── Account Deletion ──────────────────────────────────────
  
  async deleteUserAccount(userId: string, email: string): Promise<void> {
    if (!userId || !email) {
      throw new Error("[Security] Missing required identity for account deletion.");
    }
    
    // 1. Create the minimal retained record for long-term protection
    const retainedRecordPath = `retained_identities/${userId}`;
    const retainedIdentity = {
      email,
      normalizedEmail: email.toLowerCase().trim(),
      originalUserId: userId,
      createdAt: new Date().toISOString(), // Fallback base creation tracking
      deletedAt: new Date().toISOString(),
      status: 'deleted',
      retentionReason: 'Security, abuse prevention, and account history'
    };

    try {
      // Create retained record
      await setDoc(doc(db, retainedRecordPath), retainedIdentity);

      // 2. Query and delete all analyses for this user
      const analysesPath = 'analyses';
      const analysesQ = query(collection(db, analysesPath), where('userId', '==', userId));
      const analysesSnap = await getDocs(analysesQ);
      
      const deletePromises = analysesSnap.docs.map(d => deleteDoc(doc(db, analysesPath, d.id)));
      await Promise.all(deletePromises);

      // 3. Delete the active user profile
      const userPath = `users/${userId}`;
      await deleteDoc(doc(db, userPath));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'Account Deletion Pipeline');
      throw error;
    }
  }
};
