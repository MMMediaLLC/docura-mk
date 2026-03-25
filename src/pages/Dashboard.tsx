import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Search,
  Zap,
  Sparkles,
  ArrowRight,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import UpgradeModal from '../components/UpgradeModal';
import OnboardingModal from '../components/OnboardingModal';
import { UserStatus } from '../types/user';
import { auth } from '../firebase';
import { firebaseService } from '../services/firebaseService';
import { AnalysisService } from '../services/analysisService';

export default function Dashboard() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isPlanLimitReached, setIsPlanLimitReached] = useState(false);
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  // Fetch user status
  const fetchData = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const status = await firebaseService.getUserStatus(user.uid);
      setUserStatus(status);
      // If limit is already reached on page load, show the upgrade panel immediately
      if (status.isLimitReached) {
        setIsPlanLimitReached(true);
      }

      const analyses = await firebaseService.listAnalyses(user.uid);
      setRecentAnalyses(analyses.slice(0, 3));
    } catch (err) {
      console.error("[Dashboard] Failed to fetch data from Firebase:", err);
      setUserStatus({ 
        plan: 'free', 
        usageCount: 0, 
        usageLimit: 1, 
        remaining: 1, 
        isLimitReached: false 
      } as any);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    const isAllowed = (f: File) => {
      const allowedMimes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream'];
      const allowedExts = ['.pdf', '.docx'];
      const ext = '.' + f.name.split('.').pop()?.toLowerCase();
      return allowedMimes.includes(f.type) || allowedExts.includes(ext);
    };
    if (droppedFile && isAllowed(droppedFile)) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a PDF or Word document (.docx).');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    const isAllowed = (f: File) => {
      const allowedMimes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream'];
      const allowedExts = ['.pdf', '.docx'];
      const ext = '.' + f.name.split('.').pop()?.toLowerCase();
      return allowedMimes.includes(f.type) || allowedExts.includes(ext);
    };
    if (selectedFile && isAllowed(selectedFile)) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please upload a PDF or Word document (.docx).');
    }
  };

  const processFile = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError("You must be signed in to analyze documents.");
      return;
    }

    // ── Stage 1: Fast pre-check using cached state ────────────────────
    // This is purely a UX shortcut — the hard check below is authoritative.
    if (userStatus?.isLimitReached) {
      setIsPlanLimitReached(true);
      return;
    }

    // ── Stage 2: Fresh server-side limit check ────────────────────────
    // This is the authoritative gate. Runs BEFORE any AI work.
    // Returns a structured result — limit is a product state, not an error.
    setIsProcessing(true);
    setError(null);
    setResult("");

    try {
      let checkResult: { allowed: boolean; reason?: string } = { allowed: true };

      try {
        checkResult = await firebaseService.canRunAnalysis(user.uid);
      } catch (checkErr) {
        // Firestore/network error on the check — safe fallback: re-fetch status
        console.warn("[Dashboard] canRunAnalysis check failed — re-fetching status.", checkErr);
        try {
          const freshStatus = await firebaseService.getUserStatus(user.uid);
          setUserStatus(freshStatus);
          if (freshStatus.isLimitReached) {
            setIsPlanLimitReached(true);
            return;
          }
          // Status re-fetched and we're within limit — allow proceeding
          checkResult = { allowed: true };
        } catch {
          setError("Unable to verify your plan status. Please refresh and try again.");
          return;
        }
      }

      // ── Stage 3: Handle limit result as a product state ───────────────
      if (!checkResult.allowed) {
        // Refresh local status so sidebar/counter updates, then show upgrade panel.
        try {
          const freshStatus = await firebaseService.getUserStatus(user.uid);
          setUserStatus(freshStatus);
        } catch { /* non-critical — UI still shows upgrade panel */ }
        setIsPlanLimitReached(true);
        return;
      }

      // ── Stage 4: Analysis pipeline (limit confirmed clear) ────────────
      const analysisService = new AnalysisService("");
      const { analysis, chunks } = await analysisService.analyze(file);

      // saveAnalysis also calls incrementUsage internally — do NOT call it again.
      await firebaseService.saveAnalysis(analysis, user.uid, chunks);

      navigate(`/analysis/${analysis.id}`);

    } catch (err: any) {
      // Real system/pipeline failure — show inline error, not upgrade panel.
      console.error("[Dashboard] Analysis pipeline error:", err);
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

return (
  <div className="min-h-screen bg-transparent font-sans selection:bg-brand-100 selection:text-brand-900">
    <OnboardingModal />
    <main className="max-w-6xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50/50 border border-brand-200/50 text-brand-700 text-[10px] font-bold rounded-full mb-6 uppercase tracking-[0.2em] shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Welcome {auth.currentUser?.displayName?.split(' ')[0] || 'Back'}
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-gradient mb-3">Document Analysis</h1>
          <p className="text-slate-500 font-medium text-lg max-w-lg">Upload your contract or agreement to instantly extract key intelligence, risks, and obligations.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
            <input
              type="text"
              placeholder="Search documents..."
              className="bg-white text-slate-700 border border-slate-200 pl-11 pr-5 py-2.5 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-sm w-64"
            />
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-10">
          {isPlanLimitReached ? (
            /* ── Plan Limit Reached — controlled product state, NOT a crash ────── */
            <div className="relative border-2 border-dashed border-brand-200 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center bg-white/60 backdrop-blur-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-400/10 blur-[60px] rounded-full -mr-24 -mt-24 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 blur-[60px] rounded-full -ml-24 -mb-24 pointer-events-none" />
              <div className="relative z-10 space-y-6 max-w-sm mx-auto">
                <div className="w-20 h-20 bg-brand-50 border border-brand-100 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                  <Zap className="w-9 h-9 text-brand-600" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight mb-3">
                    Free plan limit reached
                  </h2>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    You've used your 1 included document analysis.
                    Upgrade to <strong className="text-slate-700">Pro</strong> to analyze up to 3 documents,
                    or choose <strong className="text-slate-700">Business</strong> for higher usage.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="btn-primary flex items-center justify-center gap-2 py-3 px-6 shadow-brand-500/20"
                  >
                    <Zap className="w-4 h-4 fill-brand-200 text-brand-100" />
                    Upgrade to Pro
                  </button>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="px-6 py-3 bg-white border border-slate-200/60 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    View Pricing
                  </button>
                  <button
                    onClick={() => navigate('/history')}
                    className="px-6 py-3 bg-white border border-slate-200/60 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    View History
                  </button>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Already upgraded?{' '}
                  <button
                    onClick={() => { setIsPlanLimitReached(false); fetchData(); }}
                    className="text-brand-600 hover:underline font-bold"
                  >
                    Refresh status
                  </button>
                </p>
              </div>
            </div>
          ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-[2.5rem] p-16 transition-all duration-500 flex flex-col items-center justify-center text-center group overflow-hidden bg-white/40 backdrop-blur-xl",
              isDragging
                ? "border-brand-500 bg-brand-50/80 scale-[1.02] shadow-2xl shadow-brand-500/10"
                : "border-slate-300/60 hover:border-brand-300 hover:bg-white/80 hover:shadow-xl hover:shadow-slate-200/50",
              file && "border-brand-500 bg-brand-50/50"
            )}
          >
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-brand-400/10 blur-[60px] rounded-full -mr-32 -mt-32 pointer-events-none transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/10 blur-[60px] rounded-full -ml-32 -mb-32 pointer-events-none transition-transform duration-700 group-hover:scale-110" />

            {!file && (
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={isProcessing}
              />
            )}

            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8 relative z-0"
                >
                  <div className="w-24 h-24 bg-white text-slate-400 rounded-3xl flex items-center justify-center mx-auto group-hover:text-brand-600 transition-all duration-500 border border-slate-200/50 shadow-sm group-hover:shadow-xl group-hover:shadow-brand-500/10 group-hover:-translate-y-2">
                    <Upload className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-slate-800 mb-3 tracking-tight">Drop your document here</h3>
                    <p className="text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                      or click to browse from your computer. <br />
                      <span className="text-slate-400 text-sm mt-1 block">PDF or Word document (.docx) — max 20MB.</span>
                    </p>
                  </div>
                  <div className="flex gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest justify-center">
                    <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-brand-500" /> Secure</span>
                    <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-brand-500" /> Private</span>
                    <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-brand-500" /> AI-Powered</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8 w-full max-w-md relative z-0"
                >
                  <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 shadow-xl shadow-brand-500/5 flex items-center gap-5">
                    <div className="w-14 h-14 bg-linear-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/30">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 text-left truncate">
                      <p className="font-bold text-slate-800 truncate text-lg tracking-tight">{file.name}</p>
                      <p className="text-sm font-medium text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="p-2.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={processFile}
                    disabled={isProcessing}
                    className="btn-primary w-full py-5 rounded-[1.5rem] text-lg flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale-[0.5] disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing Intelligence...
                      </>
                    ) : (
                      <>
                        Start Analysis
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                    </button>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
          )} {/* end of isPlanLimitReached ternary */}

          {error && (
            <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-5 rounded-2xl border border-rose-100 text-sm font-bold animate-shake">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <p className="text-xs text-center text-slate-400 font-bold uppercase tracking-widest leading-relaxed max-w-lg mx-auto">
            Automated analysis for informational purposes only. Not legal advice.
          </p>

          {/* Recent Activity */}
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-3">
                Recent Analyses
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full font-bold">{recentAnalyses.length}</span>
              </h3>
              <button
                onClick={() => navigate('/history')}
                className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-1"
              >
                View all history
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {recentAnalyses.length > 0 ? (
                recentAnalyses.map((doc, i) => (
                  <div
                    key={doc.id}
                    onClick={() => navigate(`/analysis/${doc.id}`)}
                    className="soft-card p-6 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors duration-300">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 group-hover:text-brand-700 transition-colors text-lg tracking-tight">{doc.documentName || doc.fileName || 'Untitled Document'}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {new Date(doc.createdAt || doc.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/60">
                        Completed
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition-all border border-transparent group-hover:border-brand-100">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white border border-slate-100 rounded-[2rem]">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No recent analyses</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Stats */}
        <div className="space-y-8">
          <div className="glass-panel rounded-[2.5rem] p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-400/10 blur-[50px] rounded-full -mr-16 -mt-16 pointer-events-none" />
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">Plan Usage</h3>
            <div className="space-y-10 relative z-10">
              {userStatus ? (
                <>
                  <div className="space-y-5">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Analyses Used</span>
                        <span className="text-2xl font-display font-bold text-slate-800 tracking-tight">
                          {userStatus.plan === 'business' ? (
                            <span className="text-emerald-600">{userStatus.usageCount} <span className="text-lg font-medium text-slate-400">used</span></span>
                          ) : (
                            <>{userStatus.usageCount} <span className="text-slate-300 font-medium">/</span> {userStatus.usageLimit}</>
                          )}
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-200/60 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={cn("h-full transition-all duration-1000 ease-out rounded-full", userStatus.isLimitReached ? "bg-rose-500" : "bg-brand-500")}
                          style={{ 
                            width: userStatus.plan === 'business' 
                              ? '100%' 
                              : `${Math.min(100, (userStatus.usageCount / (userStatus.usageLimit as number || 1)) * 100)}%` 
                          }} 
                        />
                    </div>
                  </div>

                  <div className="p-6 bg-white/50 rounded-3xl border border-white">
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      {userStatus.isLimitReached
                        ? userStatus.plan === 'free'
                          ? "Free plan includes 1 analysis. Upgrade to Pro for 3, or Business for unlimited."
                          : "You've used all 3 analyses on your Pro plan. Upgrade to Business for unlimited."
                        : userStatus.plan === 'free'
                          ? "Free plan includes 1 analysis. Upgrade to Pro ($6/mo) for 3, or Business ($19/mo) for unlimited."
                          : userStatus.plan === 'business'
                            ? "Business plan — unlimited document analyses."
                            : `${userStatus.remaining} of ${userStatus.usageLimit} analyses remaining on this plan.`}
                    </p>
                  </div>

                  {userStatus.plan !== 'business' && (
                    <button
                      onClick={() => navigate('/pricing')}
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-semibold hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4 text-brand-400 fill-brand-400" />
                      Upgrade Plan
                    </button>
                  )}
                </>
              ) : (
                <div className="animate-pulse space-y-8">
                  <div className="h-6 bg-slate-200/50 rounded-lg w-3/4" />
                  <div className="h-4 bg-slate-200/50 rounded-full w-full" />
                  <div className="h-32 bg-slate-200/50 rounded-[2rem] w-full" />
                </div>
              )}
            </div>
          </div>

          <div className="bg-brand-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-brand-200 group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl rounded-full -mr-24 -mt-24 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-400/20 blur-2xl rounded-full -ml-16 -mb-16" />

            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <Sparkles className="w-6 h-6 text-brand-200" />
              </div>
              <h4 className="font-display text-2xl font-bold mb-4 tracking-tight">Ask the Document</h4>
              <p className="text-brand-100 text-base leading-relaxed font-medium mb-8 opacity-90">
                After analysis, use the chat button to ask specific questions about any clause, obligation, or risk found in the document.
              </p>
              <button className="text-xs font-bold uppercase tracking-[0.2em] bg-white text-brand-600 hover:bg-brand-50 px-6 py-3 rounded-xl transition-all shadow-lg active:scale-95">
                Try it on a document
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-10 shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Quick Tips</h3>
            <ul className="space-y-5">
              {[
                "Use high-quality PDF exports",
                "Ensure text is selectable",
                "Check for missing pages",
                "Review risks carefully"
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-4 text-sm text-slate-600 font-bold group cursor-default">
                  <div className="w-2 h-2 bg-brand-400 rounded-full mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>

    <UpgradeModal
      isOpen={isUpgradeModalOpen}
      onClose={() => setIsUpgradeModalOpen(false)}
      currentPlan={userStatus?.plan}
      usageCount={userStatus?.usageCount}
      usageLimit={userStatus?.usageLimit}
    />
  </div>
);
}
