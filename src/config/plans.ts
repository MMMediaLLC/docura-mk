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
    name: 'Бесплатно',
    price: '0 ден.',
    limit: 1, // Lifetime total
  },
  true_docura: {
    name: 'True Docura',
    price: '0 ден.',
    limit: 1,
  },
  pro: {
    name: 'Про',
    price: '370 ден.',
    period: '/месечно',
    limit: 2, // Per billing period
    lemonSqueezyUrl: 'https://docura.lemonsqueezy.com/checkout/buy/dbdbb86d-e540-4a99-bceb-125f19334d23',
  },
  business: {
    name: 'Бизнис',
    price: '1.170 ден.',
    period: '/месечно',
    limit: 15, // Per billing period
    lemonSqueezyUrl: 'https://docura.lemonsqueezy.com/checkout/buy/95ac39a4-6bcc-45c2-ba87-9739781f2f15',
  },
};

export function getPlanLimit(plan: UserPlan): number {
  return PLANS[plan]?.limit ?? 1;
}

export function getPlanConfig(plan: UserPlan): PlanConfig {
  return PLANS[plan] ?? PLANS.free;
}

export function getCheckoutUrl(plan: 'pro' | 'business', userId?: string, email?: string): string {
  let url = PLANS[plan].lemonSqueezyUrl!;
  
  if (userId || email) {
    const params = new URLSearchParams();
    if (userId) {
      params.set('checkout[custom][user_id]', userId);
    }
    if (email) {
      params.set('checkout[email]', email);
    }
    const queryString = params.toString();
    if (queryString) {
      // Determine if original url already has search params
      url += url.includes('?') ? `&${queryString}` : `?${queryString}`;
    }
  }

  return url;
}

// Reusable checker based on new "Active Documents" paradigm
export function canCreateDocument(plan: UserPlan, activeDocsCount: number): boolean {
  return activeDocsCount < getPlanLimit(plan);
}

export function getRemainingDocs(plan: UserPlan, activeDocsCount: number): number {
  return Math.max(0, getPlanLimit(plan) - activeDocsCount);
}
