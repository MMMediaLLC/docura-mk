import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';

const ONBOARDING_KEY = 'docura_onboarding_shown';

const features = [
  { title: 'AI Contract Analysis', desc: 'Upload any PDF and extract key clauses, risks, and obligations instantly.' },
  { title: 'Document Intelligence', desc: 'Get summaries, red flags, and actionable insights from complex legal documents.' },
  { title: 'Secure & Private', desc: 'Your documents are isolated and only accessible to you — always.' },
];

export default function OnboardingModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Show only once per user (stored by uid to be user-specific)
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const key = `${ONBOARDING_KEY}_${uid}`;
    const alreadyShown = localStorage.getItem(key);
    if (!alreadyShown) {
      // Small delay so it appears after page load
      setTimeout(() => setIsVisible(true), 600);
    }
  }, []);

  const handleClose = () => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      localStorage.setItem(`${ONBOARDING_KEY}_${uid}`, 'true');
    }
    setIsVisible(false);
  };

  const handleNext = () => {
    if (step < features.length - 1) {
      setStep(s => s + 1);
    } else {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="glass-panel max-w-lg w-full p-10 relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-400/10 blur-[80px] rounded-full -mr-16 -mt-16 pointer-events-none" />

            <button
              onClick={handleClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="w-12 h-12 bg-linear-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-600 uppercase tracking-[0.3em]">Welcome to</p>
                <h2 className="font-display text-2xl font-black tracking-tighter text-slate-900">DOCURA</h2>
              </div>
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="mb-8 relative z-10"
              >
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">{features[step].title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{features[step].desc}</p>
              </motion.div>
            </AnimatePresence>

            {/* Step indicators */}
            <div className="flex items-center gap-2 mb-8 relative z-10">
              {features.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-brand-600' : 'w-3 bg-slate-200'}`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 relative z-10">
              <button
                onClick={handleClose}
                className="px-5 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-700 transition-colors text-sm"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-3"
              >
                {step < features.length - 1 ? (
                  <>Next <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Start Analyzing <Check className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
