import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, CreditCard, Trash2, Loader2, Zap, ArrowRight, X, CheckCircle2, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { firebaseService } from '../services/firebaseService';
import { UserStatus } from '../types/user';

export default function SettingsPage() {
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      if (auth.currentUser) {
        try {
          const status = await firebaseService.getUserStatus(auth.currentUser.uid);
          setUserStatus(status);
        } catch (err) {
          console.error("Failed to fetch settings status:", err);
        }
      }
    };
    fetchStatus();
  }, []);

  const handleCancelPlan = async () => {
    if (!auth.currentUser) return;
    setIsCanceling(true);
    try {
      await firebaseService.updatePlan(auth.currentUser.uid, 'free');
      const updatedStatus = await firebaseService.getUserStatus(auth.currentUser.uid);
      setUserStatus(updatedStatus);
      setCancelSuccess(true);
      setShowCancelConfirm(false);
      setTimeout(() => setCancelSuccess(false), 4000);
    } catch (err) {
      console.error("Cancel plan error:", err);
    } finally {
      setIsCanceling(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser || !auth.currentUser.email) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      // 1. Wipe active data and retain minimal identity in DB
      await firebaseService.deleteUserAccount(auth.currentUser.uid, auth.currentUser.email);
      // 2. Delete Auth record
      await auth.currentUser.delete();
      navigate('/');
    } catch (err: any) {
      console.error("Delete account error:", err);
      if (err.code === 'auth/requires-recent-login') {
         setDeleteError("Недостасува неодамнешна автентикација. Ве молиме одјавете се, најавете се повторно и пробајте пак.");
      } else {
         let errorMessage = "Неуспешно бришење на сметката. Ве молиме обидете се повторно.";
         try {
           const parsed = JSON.parse(err.message);
            if (parsed.error && typeof parsed.error === 'string') {
              if (parsed.error.includes("Missing or insufficient permissions")) {
                errorMessage = "Пристапот за безбедно бришење е одбиен. Ве молиме освежете или обидете се повторно.";
              } else {
                errorMessage = parsed.error;
              }
            }
         } catch(e) {
           errorMessage = err.message || errorMessage;
         }
         setDeleteError(errorMessage);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const planLabel = userStatus?.plan === 'free' || userStatus?.plan === 'true_docura'
    ? 'Бесплатен'
    : userStatus?.plan === 'pro'
      ? 'Про — 370 ден./мес'
      : userStatus?.plan === 'business'
        ? 'Бизнис — 1.170 ден./мес'
        : 'Се вчитува...';

  const usageValue = !userStatus
    ? 'Се вчитува...'
    : userStatus.plan === 'business'
      ? 'Неограничено'
      : userStatus.plan === 'free' || (userStatus.plan as string) === 'true_docura'
        ? `${userStatus.lifetimeFreeAnalysesUsed} / ${userStatus.usageLimit} документи`
        : `${userStatus.usedAnalysesInPeriod} / ${userStatus.usageLimit} документи`;

  const isPaidPlan = userStatus && userStatus.plan !== 'free' && (userStatus.plan as string) !== 'true_docura';

  return (
    <div className="space-y-10 max-w-4xl font-sans selection:bg-brand-100 selection:text-brand-900 relative z-10">
      <div>
        <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight">Поставки</h1>
        <p className="text-slate-500 font-medium mt-2 leading-relaxed">Управувајте со вашите параметри на сметката, безбедноста и деталите за претплата.</p>
      </div>

      {/* Success toast */}
      <AnimatePresence>
        {cancelSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-3 px-6 py-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 font-medium text-sm shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            Вашиот план е вратен на Бесплатен план.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-8">
        {/* Profile Section */}
        <div className="glass-panel border-white/60 p-1 sm:p-2 group relative z-10">
          <div className="px-8 py-6 bg-white/40 border-b border-white/60 flex items-center gap-4 rounded-t-[2rem]">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-brand-600 transition-colors shadow-sm border border-slate-100/50">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Профил</h3>
          </div>
          <div className="divide-y divide-white/40 bg-white/20 rounded-b-[2rem]">
            {[
              { label: 'Име за приказ', value: auth.currentUser?.displayName || '—' },
              { label: 'Е-пошта', value: auth.currentUser?.email || '—' },
              { label: 'Провајдер на автентикација', value: 'Google' },
            ].map((item, i) => (
              <div key={i} className="px-8 py-6 flex items-center justify-between last:rounded-b-[2rem]">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                <span className="text-base font-bold text-slate-600">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Section */}
        <div className="glass-panel border-white/60 p-1 sm:p-2 group relative z-10">
          <div className="px-8 py-6 bg-white/40 border-b border-white/60 flex items-center gap-4 rounded-t-[2rem]">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-brand-600 transition-colors shadow-sm border border-slate-100/50">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Претплата</h3>
          </div>
          <div className="divide-y divide-white/40 bg-white/20 rounded-b-[2rem]">
            <div className="px-8 py-6 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Тековен план</span>
              <span className="text-base font-bold text-slate-600">{planLabel}</span>
            </div>
            <div className="px-8 py-6 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Употреба во овој период</span>
              <span className="text-base font-bold text-slate-600">{usageValue}</span>
            </div>
            <div className="px-8 py-6 flex items-center justify-between last:rounded-b-[2rem]">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                {isPaidPlan ? 'Управувај со планот' : 'Надгради план'}
              </span>
              {isPaidPlan ? (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-rose-200 text-rose-600 hover:bg-rose-50 transition-all"
                >
                  Откажи план
                </button>
              ) : (
                <Link
                  to="/pricing"
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-md shadow-brand-100"
                >
                  <Zap className="w-4 h-4" />
                  Надгради
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="glass-panel border-white/60 p-1 sm:p-2 group relative z-10">
          <div className="px-8 py-6 bg-white/40 border-b border-white/60 flex items-center gap-4 rounded-t-[2rem]">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-brand-600 transition-colors shadow-sm border border-slate-100/50">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Безбедност</h3>
          </div>
          <div className="divide-y divide-white/40 bg-white/20 rounded-b-[2rem]">
            <div className="px-8 py-6 flex items-center justify-between last:rounded-b-[2rem]">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Сесија</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-rose-600 hover:border-rose-200 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Одјави се
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="glass-panel border-white/60 p-1 sm:p-2 group relative z-10">
          <div className="px-8 py-6 bg-white/40 border-b border-white/60 flex items-center gap-4 rounded-t-[2rem]">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-brand-600 transition-colors shadow-sm border border-slate-100/50">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Известувања</h3>
          </div>
          <div className="divide-y divide-white/40 bg-white/20 rounded-b-[2rem]">
            {[
              { label: 'Е-пошта известувања', value: 'Овозможено (наскоро)' },
              { label: 'Ажурирања на анализи', value: 'Овозможено (наскоро)' },
            ].map((item, i) => (
              <div key={i} className="px-8 py-6 flex items-center justify-between last:rounded-b-[2rem]">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                <span className="text-sm font-medium text-slate-400 italic">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delete Account */}
        <div className="glass-panel bg-rose-50/30 border-rose-200/50 p-10 flex flex-col md:flex-row items-center justify-between gap-6 group relative z-10">
          <div className="text-center md:text-left">
            <h4 className="font-display text-2xl font-bold text-rose-900 tracking-tight">Избриши сметка</h4>
            <p className="text-sm text-rose-700 mt-2 font-medium leading-relaxed max-w-md">Трајно отстранете ја вашата активна сметка и податоците од документи. Се задржува минимален рекорд за идентитет за заштита и спречување злоупотреба.</p>
          </div>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-3 px-8 py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 active:scale-95 shrink-0"
          >
            <Trash2 className="w-5 h-5" />
            Избриши сметка
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCancelConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-panel max-w-md w-full p-8 relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900 mb-2 tracking-tight">Да го откажете вашиот план?</h3>
              <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                Веднаш ќе бидете вратени на <strong>Бесплатен</strong> план и ќе изгубите пристап до преостанатите анализи во овој период на наплата.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Задржи го мојот план
                </button>
                <button
                  onClick={handleCancelPlan}
                  disabled={isCanceling}
                  className="flex-1 py-3 rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isCanceling ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Да, откажи
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-panel max-w-md w-full p-8 relative border-rose-200 shadow-xl shadow-rose-500/10"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                disabled={isDeleting}
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
              <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-6 border border-rose-200">
                <Trash2 className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900 mb-2 tracking-tight">Избриши сметка?</h3>
              <p className="text-slate-500 mb-6 leading-relaxed font-medium">
                Ова трајно ће го избрише вашиот активен профил и сите прикачени податоци од документи. Се задржува минимален рекорд за идентитет за препознавање на оваа е-пошта во иднина за безбедност на платформата и спречување злоупотреба.
              </p>
              
              {deleteError && (
                <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-sm font-bold">
                  {deleteError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-60"
                >
                  Откажи
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Да, избриши
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand-400/5 blur-[120px] rounded-full -mr-[250px] -mt-[250px] pointer-events-none" />
    </div>
  );
}
