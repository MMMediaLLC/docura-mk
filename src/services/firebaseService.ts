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
      let data = snap.data();
      const { chunks, userId, ...rawAnalysis } = data;
      
      // Map saved record back to a full AnalysisResult shape with safe fallbacks
      const analysis: Partial<AnalysisResult> = {
        ...rawAnalysis,
        id: rawAnalysis.id || id,
        title: rawAnalysis.title || rawAnalysis.documentName || rawAnalysis.fileName || 'Untitled Document',
        documentType: rawAnalysis.documentType || 'document',
        fileName: rawAnalysis.documentName || rawAnalysis.fileName || 'Untitled Document',
        uploadDate: rawAnalysis.createdAt || rawAnalysis.uploadDate || new Date().toISOString(),
        risks: Array.isArray(rawAnalysis.risks) ? rawAnalysis.risks.map((r: any) => 
          typeof r === 'string' ? { title: r, severity: 'medium', explanation: r } : r
        ) : [],
        obligations: Array.isArray(rawAnalysis.obligations) ? rawAnalysis.obligations.map((o: any) => 
          typeof o === 'string' ? { party: 'unspecified', obligation: o, timing: 'See document' } : o
        ) : [],
        deadlines: Array.isArray(rawAnalysis.deadlines) ? rawAnalysis.deadlines.map((d: any) => 
          typeof d === 'string' ? { dateOrPeriod: 'Review', description: d, severity: 'info' } : d
        ) : [],
        keyClauses: Array.isArray(rawAnalysis.keyClauses) ? rawAnalysis.keyClauses : [],
        confidenceNotes: Array.isArray(rawAnalysis.confidenceNotes) ? rawAnalysis.confidenceNotes : [],
        suggestedQuestions: Array.isArray(rawAnalysis.questions) ? rawAnalysis.questions : (rawAnalysis.suggestedQuestions || [])
      };

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
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort client-side to avoid requiring a composite Firestore index
      docs.sort((a: any, b: any) => {
        const aDate = a.createdAt || a.uploadDate || '';
        const bDate = b.createdAt || b.uploadDate || '';
        return bDate.localeCompare(aDate);
      });
      return docs;
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
