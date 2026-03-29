import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Rocket, Shield, ArrowRight } from 'lucide-react';
import { getCheckoutUrl } from '../config/plans';
import { auth } from '../firebase';
import type { UserPlan } from '../types/user';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  currentPlan?: UserPlan;
  usageCount?: number;
  usageLimit?: number;
}

export default function UpgradeModal({ 
  isOpen, 
  onClose, 
  title, 
  message,
  currentPlan,
  usageCount,
  usageLimit,
}: UpgradeModalProps) {
  
  const handleCheckout = (plan: 'pro' | 'business') => {
    window.open(getCheckoutUrl(plan, auth.currentUser?.uid, auth.currentUser?.email || undefined), '_blank');
    onClose();
  };

  // Build usage context message
  const usageMessage = currentPlan && usageCount != null && usageLimit != null && currentPlan !== 'business'
    ? `Го достигнавте вашиот лимит од ${usageLimit} активен ${usageLimit === 1 ? 'документ' : 'документи'}.`
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md glass-panel p-2 shadow-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors z-20"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>

            <div className="p-8 pb-10 text-center relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 bg-linear-to-br from-brand-600 to-indigo-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-7 shadow-xl shadow-brand-500/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
              
              {/* Headline */}
              <h2 className="font-display text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                {title || "Го достигнавте лимитот на вашиот план."}
              </h2>

              {/* Usage context */}
              {usageMessage && (
                <p className="text-sm font-bold text-rose-500 mb-1">{usageMessage}</p>
              )}
              <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                {message || "Надградете го вашиот план за да анализирате повеќе документи. Бизнис корисниците добиваат најголем капацитет."}
              </p>

              {/* Plan options */}
              <div className="space-y-4 text-left">
                {/* Pro */}
                <button
                  onClick={() => handleCheckout('pro')}
                  className="flex items-center justify-between w-full p-5 bg-white border border-slate-200/60 rounded-2xl hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center group-hover:bg-brand-100 transition-colors border border-brand-100">
                      <Shield className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-base">Надгради на Про</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-0.5">370 ден. / месечно • 2 анализи</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
                </button>

                {/* Business */}
                <button
                  onClick={() => handleCheckout('business')}
                  className="flex items-center justify-between w-full p-5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 hover:shadow-xl hover:shadow-brand-900/20 transition-all group border border-slate-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                      <Rocket className="w-6 h-6 text-brand-400" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Надгради на Бизнис</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-0.5">1.170 ден. / месечно • 15 анализи</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-brand-400 group-hover:text-brand-300 transition-colors" />
                </button>
              </div>

              <button 
                onClick={onClose}
                className="mt-8 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
              >
                Можеби подоцна
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
