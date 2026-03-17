import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2, CheckCircle2, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { auth } from '../firebase';
import { firebaseService } from '../services/firebaseService';
import { PLANS } from '../config/plans';

export default function ActivatePlanPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'business'>('pro');
  const [billEmail, setBillEmail] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!auth.currentUser) {
      setError('You must be signed in to activate a subscription.');
      return;
    }

    if (!billEmail.trim() || !billEmail.includes('@')) {
      setError('Please enter the email address you used at checkout.');
      return;
    }

    setIsActivating(true);
    try {
      await firebaseService.activateUnverifiedPlan(auth.currentUser.uid, selectedPlan, billEmail.trim().toLowerCase());
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err) {
      setError('Activation failed. Please contact support at support@docura.ai');
    } finally {
      setIsActivating(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-sans">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel max-w-md w-full p-10 text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-3 tracking-tight">
            Welcome to {PLANS[selectedPlan].name}!
          </h2>
          <p className="text-slate-500 font-medium">Your subscription has been activated. Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-[#fafbff]">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-400/6 rounded-full blur-[200px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel max-w-lg w-full p-10 relative z-10"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-linear-to-br from-brand-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Activate Subscription</h1>
            <p className="text-sm text-slate-500 font-medium">Already paid? Enter your checkout email below.</p>
          </div>
        </div>

        <form onSubmit={handleActivate} className="space-y-6">
          {/* Plan selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 block mb-3">Select your plan</label>
            <div className="grid grid-cols-2 gap-3">
              {(['pro', 'business'] as const).map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all font-bold ${
                    selectedPlan === plan
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <div className="text-base">{PLANS[plan].name}</div>
                  <div className="text-sm font-medium mt-0.5 opacity-70">{PLANS[plan].price}{PLANS[plan].period}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Email input */}
          <div>
            <label htmlFor="billing-email" className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 block mb-2">
              Billing Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="billing-email"
                type="email"
                value={billEmail}
                onChange={e => setBillEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-all"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Enter the exact email you used on the Lemon Squeezy checkout page.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isActivating}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isActivating ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Activating...</>
            ) : (
              <>Activate {PLANS[selectedPlan].name} Plan <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        {/* Haven't paid yet? */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500 font-medium mb-4">Haven't upgraded yet?</p>
          <div className="flex justify-center gap-4">
            <a
              href="https://docura.lemonsqueezy.com/checkout/buy/dbdbb86d-e540-4a99-bceb-125f19334d23"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-2xl border border-brand-200 text-brand-700 text-sm font-bold hover:bg-brand-50 transition-all text-center"
            >
              Get Pro — $6/mo
            </a>
            <a
              href="https://docura.lemonsqueezy.com/checkout/buy/95ac39a4-6bcc-45c2-ba87-9739781f2f15"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all text-center"
            >
              Get Business — $19/mo
            </a>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/dashboard" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
