import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FileSearch,
  LayoutGrid, 
  Clock, 
  Sliders, 
  LogOut, 
  Menu, 
  X,
  CreditCard,
  Zap,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseService } from './services/firebaseService';
import { ErrorBoundary } from './components/ErrorBoundary';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AnalysisResult from './pages/AnalysisResult';
import HistoryPage from './pages/HistoryPage';
import PricingPage from './pages/PricingPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import TermsPage from './pages/Terms';
import PrivacyPage from './pages/Privacy';
import DisclaimerPage from './pages/Disclaimer';
import ActivatePlanPage from './pages/ActivatePlanPage';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userStatus, setUserStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const isLanding = location.pathname === '/';
  const isAuth = location.pathname === '/auth';
  const isActivate = location.pathname === '/activate-plan';
  const isLegal = ['/terms', '/privacy', '/disclaimer'].includes(location.pathname);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const status = await firebaseService.getUserStatus(user.uid);
          setUserStatus(status);
        } catch (err) {
          console.error("Failed to fetch user status:", err);
        }
      } else {
        setUserStatus(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Refresh status on navigation to dashboard or history
  useEffect(() => {
    if (user && (location.pathname === '/dashboard' || location.pathname === '/history')) {
      firebaseService.getUserStatus(user.uid).then(setUserStatus).catch(console.error);
    }
  }, [location.pathname, user]);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (isLanding) return <LandingPage />;
  
  if (!user && !isAuth && !isLegal) {
    return <Navigate to="/auth" />;
  }

  if (user && isAuth) {
    return <Navigate to="/dashboard" />;
  }

  if (isAuth) return <AuthPage />;
  if (isActivate) return <ActivatePlanPage />;
  
  if (isLegal) {
    return (
      <Routes>
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
      </Routes>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'History', path: '/history', icon: Clock },
    { name: 'Pricing', path: '/pricing', icon: CreditCard },
    { name: 'Settings', path: '/settings', icon: Sliders },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 flex selection:bg-brand-100 selection:text-brand-900">
        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-sm border border-slate-200"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>

        {/* Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className={cn(
                "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200/60 flex flex-col transition-all duration-300 lg:relative lg:translate-x-0",
                !isSidebarOpen && "hidden lg:flex"
              )}
            >
              <div className="p-8 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className="w-11 h-11 bg-linear-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-200 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                      <FileSearch className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-emerald-500 rounded-full border-3 border-white shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="flex flex-col -space-y-1.5">
                    <span className="font-display font-black text-2xl tracking-tighter text-slate-900">DOCURA</span>
                    <span className="text-[9px] font-black text-brand-600 uppercase tracking-[0.3em] pl-0.5">Intelligence</span>
                  </div>
                </Link>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <nav className="flex-1 px-4 space-y-1.5">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group",
                        isActive 
                          ? "bg-brand-600 text-white shadow-lg shadow-brand-100" 
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <item.icon className={cn("w-4.5 h-4.5", isActive ? "text-white" : "text-slate-400 group-hover:text-brand-500")} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-6">
                {userStatus && (
                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50/50 blur-2xl rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-110" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                            {userStatus.plan === 'free' ? 'Free Plan' : userStatus.plan === 'pro' ? 'Pro Plan' : 'Business Plan'}
                          </span>
                          <span className="text-sm font-black text-slate-900">
                             {userStatus.plan === 'business' ? `${userStatus.usageCount} Docs` : `${userStatus.usageCount} / ${userStatus.usageLimit} Docs`}
                          </span>
                        </div>
                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                          <Zap className={cn("w-4 h-4", userStatus.plan === 'free' ? "text-slate-300" : "text-brand-500 fill-brand-500")} />
                        </div>
                      </div>
                      
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-4 relative">
                        {userStatus.plan === 'business' ? (
                          <div className="absolute inset-0 bg-linear-to-r from-brand-400 via-brand-600 to-brand-400 animate-gradient" />
                        ) : (
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (userStatus.usageCount / userStatus.usageLimit) * 100)}%` }}
                            className="h-full bg-brand-600 rounded-full"
                          />
                        )}
                      </div>

                      {userStatus.plan === 'free' && (
                        <Link to="/pricing" className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-[0.98]">
                          <Sparkles className="w-3 h-3 text-brand-400" />
                          Upgrade to Pro
                        </Link>
                      )}
                      {userStatus.plan !== 'free' && (
                        <Link to="/activate-plan" className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
                          Already paid? Activate
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group"
                >
                  <LogOut className="w-4.5 h-4.5 text-slate-400 group-hover:text-rose-500" />
                  Sign Out
                </button>

                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-2 px-4">
                  <Link to="/terms" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors">Terms</Link>
                  <Link to="/privacy" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors">Privacy</Link>
                  <Link to="/disclaimer" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors">Legal</Link>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-auto">
          <div className="max-w-6xl mx-auto p-6 lg:p-12">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analysis/:id" element={<AnalysisResult />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/activate-plan" element={<ActivatePlanPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
