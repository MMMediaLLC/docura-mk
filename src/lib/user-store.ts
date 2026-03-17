import { User, UserPlan, UserStatus } from '../types/user';

class UserStore {
  private user: User = {
    id: 'default-user',
    email: 'user@example.com',
    plan: 'true_docura',
    usageCount: 0,
    usageLimit: 1,
    subscriptionStatus: 'active',
    currentPeriodStart: null,
    currentPeriodEnd: null,
  };

  getUser(): User {
    this.checkAndResetBillingPeriod();
    return this.user;
  }

  updateUser(updates: Partial<User>): User {
    this.user = { ...this.user, ...updates };
    return this.user;
  }

  incrementUsage(): void {
    this.user.usageCount += 1;
  }

  getPlanLimit(plan: UserPlan): number {
    switch (plan) {
      case 'true_docura': return 1;
      case 'pro': return 3;
      case 'business': return 30;
      default: return 1;
    }
  }

  getUserStatus(): UserStatus {
    const user = this.getUser();
    const limit = this.getPlanLimit(user.plan);
    const remaining = Math.max(0, limit - user.usageCount);
    const isLimitReached = user.usageCount >= limit;

    return {
      plan: user.plan,
      usageCount: user.usageCount,
      usageLimit: limit,
      remaining,
      isLimitReached
    };
  }

  private checkAndResetBillingPeriod() {
    if (!this.user.currentPeriodEnd) return;
    
    const now = new Date();
    const periodEnd = new Date(this.user.currentPeriodEnd);

    if (now > periodEnd) {
      const newEnd = new Date(now);
      newEnd.setDate(newEnd.getDate() + 30);
      this.user.usageCount = 0;
      this.user.currentPeriodStart = now.toISOString();
      this.user.currentPeriodEnd = newEnd.toISOString();
    }
  }
}

export const userStore = new UserStore();
