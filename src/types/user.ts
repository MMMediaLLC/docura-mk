import type { UserPlan } from '../config/plans';

export type { UserPlan };

export interface User {
  id: string;
  email: string;
  plan: UserPlan;
  usageCount: number;
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
  usageCount: number;
  usageLimit: number;
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
    usageCount: 0,
    usageLimit: 1,
    usageResetDate: resetDate.toISOString(),
    subscriptionStatus: 'active',
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: resetDate.toISOString(),
  };
}
