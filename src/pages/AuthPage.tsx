import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for email/password if needed, but we prefer Google
    setError("Email/Password login is not yet implemented. Please use Google.");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Background Ambiance */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-400/10 blur-[120px] rounded-full -mr-[200px] -mt-[200px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -ml-[200px] -mb-[200px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[420px] w-full glass-panel border-white/60 p-8 sm:p-10 relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <div className="w-12 h-12 bg-linear-to-br from-brand-600 to-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-black text-3xl tracking-tighter text-slate-900">DOCURA</span>
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-slate-500 mt-3 font-medium text-sm leading-relaxed max-w-[280px]">
            {isLogin ? 'Enter your details to access your secure documents.' : 'Start analyzing documents with DOCURA today.'}
          </p>
        </div>

        <div className="space-y-4 mb-8 relative z-20">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100/50 text-rose-600 text-xs font-bold uppercase tracking-wider rounded-2xl mb-6 shadow-sm flex items-center justify-center text-center">
              {error}
            </div>
          )}
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-slate-200/50 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all disabled:opacity-50 group hover:-translate-y-0.5"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Continue with Google
          </button>
        </div>

        <div className="relative mb-8 z-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/60"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-slate-400">
            <span className="bg-[#fbfeff] px-4 rounded-full">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10 flex flex-col items-center w-full">
          <div className="space-y-2 w-full">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                required
                placeholder="name@company.com"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200/50 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-inner"
              />
            </div>
          </div>
          <div className="space-y-2 w-full">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200/50 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-inner"
              />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full btn-primary py-4 flex items-center justify-center gap-2 group mt-6"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8 relative z-10 font-medium">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 relative z-10">
          <Link to="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
          <Link to="/disclaimer" className="hover:text-slate-900 transition-colors">Disclaimer</Link>
        </div>
      </motion.div>
    </div>
  );
}
