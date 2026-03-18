// =============================================================
// DOCURA Subscription Plan Configuration
// Central source of truth for plan IDs, names, and limits.
// =============================================================

export type UserPlan = 'free' | 'true_docura' | 'pro' | 'business';

export interface PlanConfig {
  name: string;
  price: string;
  period?: string;
  limit: number; // Internal backend limit — never expose business cap in UI
  lemonSqueezyUrl?: string;
}

export const PLANS: Record<UserPlan, PlanConfig> = {
  free: {
    name: 'Free',
    price: '$0',
    limit: 1,
  },
  true_docura: {
    name: 'True Docura',
    price: '$0',
    limit: 1,
  },
  pro: {
    name: 'Pro',
    price: '$6',
    period: '/month',
    limit: 3,
    lemonSqueezyUrl: 'https://docura.lemonsqueezy.com/checkout/buy/dbdbb86d-e540-4a99-bceb-125f19334d23',
  },
  business: {
    name: 'Business',
    price: '$19',
    period: '/month',
    limit: 30, // HIDDEN — never shown in UI. Business plan shows "Unlimited" to users.
    lemonSqueezyUrl: 'https://docura.lemonsqueezy.com/checkout/buy/95ac39a4-6bcc-45c2-ba87-9739781f2f15',
  },
};

export function getPlanLimit(plan: UserPlan): number {
  return PLANS[plan]?.limit ?? 1;
}

export function getPlanConfig(plan: UserPlan): PlanConfig {
  return PLANS[plan] ?? PLANS.free;
}

export function getCheckoutUrl(plan: 'pro' | 'business'): string {
  return PLANS[plan].lemonSqueezyUrl!;
}

// Reusable checker based on new "Active Documents" paradigm
export function canCreateDocument(plan: UserPlan, activeDocsCount: number): boolean {
  return activeDocsCount < getPlanLimit(plan);
}

export function getRemainingDocs(plan: UserPlan, activeDocsCount: number): number {
  return Math.max(0, getPlanLimit(plan) - activeDocsCount);
}
