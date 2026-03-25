import type { UserPlan } from '../config/plans';

export type { UserPlan };

export interface User {
  id: string;
  email: string;
  plan: UserPlan;
  usedAnalysesInPeriod: number; // For paid active monthly cycle
  lifetimeFreeAnalysesUsed: number; // Permanent cap for Free plan
  usageLimit: number;
  usageResetDate: string | null; // ISO string — monthly reset date
  billingEmail?: string;         // Email used on Lemon Squeezy checkout
  subscriptionStatus: 'active' | 'inactive' | 'canceled';
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  lemonCustomerId?: string;
  lemonSubscriptionId?: string;
}

export interface UserStatus {
  plan: UserPlan;
  usedAnalysesInPeriod: number;
  lifetimeFreeAnalysesUsed: number;
  usageLimit: number; // Represents either lifetime free limit, or active monthly limit
  remaining: number;
  isLimitReached: boolean;
  usageResetDate: string | null;
}

// Default new user — free plan, zero usage
export function createDefaultUser(userId: string, email: string): User {
  const now = new Date();
  const resetDate = new Date(now);
  resetDate.setDate(resetDate.getDate() + 30);
  return {
    id: userId,
    email,
    plan: 'free',
    usedAnalysesInPeriod: 0,
    lifetimeFreeAnalysesUsed: 0,
    usageLimit: 1, // 1 lifetime review for Free plan
    usageResetDate: resetDate.toISOString(),
    subscriptionStatus: 'active',
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: resetDate.toISOString(),
  };
}
