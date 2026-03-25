import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  Download, 
  Share2, 
  ArrowLeft,
  ChevronRight,
  Info,
  Zap,
  Send,
  Loader2,
  Calendar,
  X,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { AnalysisResult as AnalysisType, ChatMessage } from '../types/analysis';
import { firebaseService } from '../services/firebaseService';
import { AnalysisService } from '../services/analysisService';

export default function AnalysisResult() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState<AnalysisType | null>(null);
  const [chunks, setChunks] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('summary');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch real analysis
  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!id) return;
      try {
        const data = await firebaseService.getAnalysis(id);
        if (data) {
          setAnalysis(data.analysis);
          setChunks(data.chunks || []);
        } else {
          setError('Analysis not found');
        }
      } catch (err) {
        console.error("Failed to fetch analysis", err);
        setError('Failed to load analysis');
      }
    };
    fetchAnalysis();
  }, [id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isAsking || !analysis) return;

    const userMsg: ChatMessage = { role: 'user', content: inputMessage };
    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsAsking(true);

    try {
      const analysisService = new AnalysisService("");
      const answer = await analysisService.chat(chunks, currentInput, analysis.title);
      
      const assistantMsg: ChatMessage = { 
        role: 'assistant', 
        content: answer,
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const assistantMsg: ChatMessage = { 
        role: 'assistant', 
        content: "I'm sorry, I couldn't process your question at this time.",
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleExport = () => {
    if (!analysis) return;

    const formatSeverityLabel = (s: string) => s === 'high' ? '🔴 HIGH' : s === 'medium' ? '🟡 MEDIUM' : '🔵 LOW';
    const formatDeadlineSeverity = (s: string) => s === 'urgent' ? '🔴 URGENT' : s === 'important' ? '🟡 IMPORTANT' : '⚪ INFO';

    const risksHtml = (analysis.risks || []).map(r => `
      <div style="margin-bottom:16px;padding:16px;border-left:4px solid ${r.severity==='high'?'#ef4444':r.severity==='medium'?'#f59e0b':'#3b82f6'};background:#f8fafc;border-radius:4px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <strong style="font-size:15px;color:#1e293b">${r.title || ''}</strong>
          <span style="font-size:11px;font-weight:700;text-transform:uppercase;color:${r.severity==='high'?'#dc2626':r.severity==='medium'?'#d97706':'#2563eb'}">${formatSeverityLabel(r.severity)}</span>
        </div>
        <p style="margin:0;color:#475569;line-height:1.6">${r.explanation || ''}</p>
      </div>`).join('');

    const obligationsHtml = (analysis.obligations || []).map(o => `
      <tr style="border-bottom:1px solid #e2e8f0">
        <td style="padding:10px 16px;font-weight:600;color:#64748b;white-space:nowrap">${o.party || ''}</td>
        <td style="padding:10px 16px;color:#334155">${o.obligation || ''}</td>
        <td style="padding:10px 16px;color:#64748b;white-space:nowrap">${o.timing || ''}</td>
      </tr>`).join('');

    const deadlinesHtml = (analysis.deadlines || []).map(d => `
      <div style="margin-bottom:12px;padding:14px 16px;background:#f8fafc;border-radius:6px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <strong style="color:#1e293b">${d.description || ''}</strong>
          <div style="color:#6366f1;font-size:13px;margin-top:2px">${d.dateOrPeriod || ''}</div>
        </div>
        <span style="font-size:11px;font-weight:700;text-transform:uppercase">${formatDeadlineSeverity(d.severity)}</span>
      </div>`).join('');

    const keyPointsHtml = (analysis.keyPoints || []).map(p => `
      <li style="margin-bottom:8px;color:#334155;line-height:1.6">${p}</li>`).join('');

    const questionsHtml = (analysis.suggestedQuestions || []).map(q => `
      <li style="margin-bottom:6px;color:#334155">${q}</li>`).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Analysis Report — ${analysis.title || analysis.fileName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; background: #fff; padding: 40px; max-width: 860px; margin: auto; }
    h1 { font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
    h2 { font-size: 16px; font-weight: 700; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.1em; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #e0e7ff; }
    .meta { font-size: 13px; color: #64748b; margin-bottom: 32px; }
    .badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; text-transform:uppercase; background:#e0e7ff; color:#4f46e5; margin-left:8px; }
    .summary-box { background:#f1f5f9; border-radius:8px; padding:20px 24px; font-size:15px; line-height:1.8; color:#334155; margin-bottom:8px; }
    table { width:100%; border-collapse:collapse; background:#f8fafc; border-radius:8px; overflow:hidden; }
    th { padding:10px 16px; background:#e2e8f0; font-size:11px; font-weight:700; text-transform:uppercase; color:#475569; text-align:left; }
    ul { padding-left:20px; }
    .footer { margin-top:40px; padding-top:16px; border-top:1px solid #e2e8f0; font-size:11px; color:#94a3b8; text-align:center; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>${analysis.title || analysis.fileName || 'Document Analysis Report'}<span class="badge">${(analysis.documentType || 'document').replace('_', ' ')}</span></h1>
  <div class="meta">File: ${analysis.fileName || ''} &nbsp;|&nbsp; Analyzed: ${new Date(analysis.uploadDate || Date.now()).toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' })}</div>

  <h2>Executive Summary</h2>
  <div class="summary-box">${analysis.summary || 'No summary available.'}</div>

  ${analysis.keyPoints?.length ? `<h2>Key Points</h2><ul>${keyPointsHtml}</ul>` : ''}

  ${analysis.risks?.length ? `<h2>Risks (${analysis.risks.length})</h2>${risksHtml}` : ''}

  ${analysis.obligations?.length ? `<h2>Obligations</h2><table><thead><tr><th>Party</th><th>Obligation</th><th>Timing</th></tr></thead><tbody>${obligationsHtml}</tbody></table>` : ''}

  ${analysis.deadlines?.length ? `<h2>Deadlines (${analysis.deadlines.length})</h2>${deadlinesHtml}` : ''}

  ${analysis.suggestedQuestions?.length ? `<h2>Suggested Questions</h2><ul>${questionsHtml}</ul>` : ''}

  <div class="footer">Generated by DOCURA Intelligence &nbsp;|&nbsp; For informational purposes only. Not legal advice.</div>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-400" />
        <p className="text-zinc-900 font-bold text-xl">{error}</p>
        <Link to="/dashboard" className="text-brand-600 font-bold hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
        <p className="text-zinc-500 font-medium">Loading analysis...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'risks', label: 'Risks', icon: Shield, count: analysis.risks.length },
    { id: 'obligations', label: 'Obligations', icon: CheckCircle2 },
    { id: 'deadlines', label: 'Deadlines', icon: Clock, count: analysis.deadlines.length },
    { id: 'clauses', label: 'Key Clauses', icon: Zap },
  ];

  return (
    <div className="space-y-8 pb-24 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-400/10 blur-[100px] rounded-full -mr-[250px] -mt-[250px] pointer-events-none" />
      <div className="absolute top-[40vh] left-0 w-[500px] h-[500px] bg-blue-400/10 blur-[100px] rounded-full -ml-[250px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 glass-panel p-6 rounded-[2rem] mt-6">
        <div className="flex items-start gap-5">
          <Link to="/dashboard" className="p-3 bg-white/50 hover:bg-white text-slate-500 hover:text-brand-600 rounded-2xl shadow-sm transition-all mt-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-3xl font-bold text-gradient tracking-tight max-w-2xl">{analysis.title}</h1>
              <span className="px-3 py-1 bg-brand-50 border border-brand-100/50 text-brand-700 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                {(analysis.documentType || 'document').replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400" /> {analysis.fileName}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Analyzed {new Date(analysis.uploadDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 py-2">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button className="btn-primary flex items-center gap-2 py-2 shadow-brand-500/20">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl transition-all duration-300 whitespace-nowrap border",
                  activeTab === tab.id 
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-500/25 border-brand-500" 
                    : "bg-white/60 text-slate-600 border-white/40 hover:bg-white hover:shadow-md hover:text-brand-700 backdrop-blur-md"
                )}
              >
                <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.id ? "text-brand-100" : "text-slate-400")} />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={cn(
                    "ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold border",
                    activeTab === tab.id 
                      ? "bg-brand-500 text-white border-brand-400" 
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === 'summary' && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <section>
                    <h3 className="font-display text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
                      <div className="p-2 bg-brand-100 text-brand-600 rounded-xl">
                        <FileText className="w-5 h-5" />
                      </div>
                      Executive Summary
                    </h3>
                    <div className="soft-card p-8 leading-relaxed text-slate-600 text-lg shadow-sm">
                      {analysis.summary}
                    </div>
                  </section>

                  <section>
                    <h3 className="font-display text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                        <Zap className="w-5 h-5" />
                      </div>
                      Key Points
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-5">
                      {analysis.keyPoints.map((point, i) => (
                        <div key={i} className="soft-card p-5 group hover:border-emerald-200">
                          <div className="flex gap-4">
                            <div className="mt-0.5 w-6 h-6 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-emerald-100 group-hover:scale-110 transition-all">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                            <p className="text-slate-700 font-medium leading-relaxed">{point}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'risks' && (
                <motion.div
                  key="risks"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {analysis.risks.map((risk, i) => (
                    <div key={i} className="soft-card p-6 flex gap-5">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                        risk.severity === 'high' ? "bg-rose-50 text-rose-600 shadow-rose-100" : 
                        risk.severity === 'medium' ? "bg-amber-50 text-amber-600 shadow-amber-100" : "bg-blue-50 text-blue-600 shadow-blue-100"
                      )}>
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h4 className="font-bold text-slate-800 text-lg">{risk.title}</h4>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                            risk.severity === 'high' ? "bg-rose-50 text-rose-700 border-rose-200" : 
                            risk.severity === 'medium' ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"
                          )}>
                            {risk.severity} risk
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">{risk.explanation}</p>
                        {risk.sourceHint && (
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-2">
                            <Info className="w-3.5 h-3.5" />
                            Source: <span className="text-brand-600">{risk.sourceHint}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'obligations' && (
                <motion.div
                  key="obligations"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="soft-card overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50/80 border-b border-slate-200/60 backdrop-blur-sm">
                        <tr>
                          <th className="px-6 py-5 font-bold text-slate-800 uppercase tracking-wider text-[11px]">Party</th>
                          <th className="px-6 py-5 font-bold text-slate-800 uppercase tracking-wider text-[11px]">Obligation</th>
                          <th className="px-6 py-5 font-bold text-slate-800 uppercase tracking-wider text-[11px]">Timing</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {analysis.obligations.map((ob, i) => (
                          <tr key={i} className="hover:bg-brand-50/30 transition-colors">
                            <td className="px-6 py-5 align-top">
                              <span className="px-3 py-1.5 bg-slate-100/80 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-600 border border-slate-200/50">
                                {ob.party}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-slate-700 font-medium leading-relaxed">{ob.obligation}</td>
                            <td className="px-6 py-5 text-slate-500 font-medium whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {ob.timing}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'deadlines' && (
                <motion.div
                  key="deadlines"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {analysis.deadlines.map((dl, i) => (
                    <div key={i} className="soft-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 group">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-brand-50 group-hover:border-brand-200 transition-all">
                          <Calendar className="w-6 h-6 text-slate-400 group-hover:text-brand-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg mb-1">{dl.description}</h4>
                          <p className="text-sm font-semibold text-brand-600">{dl.dateOrPeriod}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest self-start sm:self-auto border",
                        dl.severity === 'urgent' ? "bg-rose-50 text-rose-600 border-rose-200" : 
                        dl.severity === 'important' ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-slate-100 text-slate-500 border-slate-200"
                      )}>
                        {dl.severity}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'clauses' && (
                <motion.div
                  key="clauses"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid sm:grid-cols-2 gap-6"
                >
                  {analysis.keyClauses.map((clause, i) => (
                    <div key={i} className="soft-card p-6 flex flex-col h-full hover:border-brand-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-200/50">
                          {clause.type}
                        </span>
                        {clause.sourceHint && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{clause.sourceHint}</span>}
                      </div>
                      <h4 className="font-bold text-slate-800 text-lg mb-2">{clause.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium flex-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">{clause.summary}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="glass-panel p-8 rounded-[2rem] space-y-5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Analysis Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="soft-card p-4 bg-white/50 border-white/40">
                <p className="text-3xl font-display font-bold text-slate-800 tracking-tight">{analysis.risks.length}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Risks Found</p>
              </div>
              <div className="soft-card p-4 bg-white/50 border-white/40">
                <p className="text-3xl font-display font-bold text-slate-800 tracking-tight">{analysis.deadlines.length}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Deadlines</p>
              </div>
            </div>
            <div className="pt-5 border-t border-slate-200/50">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                <Shield className="w-4 h-4 text-brand-500" />
                Extraction Confidence
              </div>
              {analysis.confidenceNotes && analysis.confidenceNotes.length > 0 ? (
                <p className="text-[11px] text-amber-600 font-medium leading-relaxed mt-2 bg-amber-50 p-3 rounded-xl border border-amber-100">
                  ⚠ {analysis.confidenceNotes[0]}
                </p>
              ) : (
                <>
                  <div className="h-2.5 w-full bg-slate-200/60 rounded-full overflow-hidden shadow-inner mt-3">
                    <div className="h-full bg-emerald-500 w-[92%] rounded-full shadow-sm" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Document text was clear and well-structured.</p>
                </>
              )}
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="glass-panel p-8 rounded-[2rem]">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Ask the Document</h3>
            <p className="text-xs text-slate-400 font-medium mb-5">Click a question to open the chat assistant.</p>
            <div className="space-y-3">
              {analysis.suggestedQuestions.map((q, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setIsChatOpen(true);
                    setInputMessage(q);
                  }}
                  className="w-full text-left p-4 text-sm font-medium text-slate-600 bg-white/60 hover:bg-white rounded-2xl border border-slate-200/40 shadow-sm hover:shadow-md hover:text-brand-700 hover:border-brand-200 transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-2">{q}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-colors shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer Card */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-3 uppercase tracking-widest text-[10px]">
              <HelpCircle className="w-4 h-4 text-brand-500" />
              For Informational Use Only
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              This is an AI-generated summary for informational purposes. It does not constitute legal advice. Always review the original document and consult a qualified professional for legal or commercial decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Chat Panel */}
      <div className="fixed bottom-8 right-8 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-20 right-0 w-[350px] md:w-[420px] h-[600px] bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-5 border-b border-white/20 flex items-center justify-between bg-brand-600 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-16 -mt-16 pointer-events-none" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm block">Ask the Document</span>
                    <span className="text-[10px] text-brand-100 uppercase tracking-widest font-bold">Pro Intelligence</span>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="relative z-10 p-2 hover:bg-white/10 rounded-xl transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar bg-slate-50/50">
                {chatMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-3xl flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-800">No messages yet</p>
                      <p className="text-sm text-slate-500 mt-2 font-medium">Ask anything about the document and get instant answers.</p>
                    </div>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "p-4 rounded-3xl text-sm leading-relaxed font-medium shadow-sm border",
                      msg.role === 'user' 
                        ? "bg-brand-600 text-white rounded-br-none border-brand-500" 
                        : "bg-white text-slate-700 rounded-bl-none border-slate-200/60"
                    )}>
                      {msg.content}
                    </div>
                    {msg.sourceHint && (
                      <span className="text-[10px] text-brand-500 mt-1.5 font-bold uppercase tracking-wider flex items-center gap-1 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                        <Info className="w-3 h-3" />
                        Source: {msg.sourceHint}
                      </span>
                    )}
                  </div>
                ))}
                {isAsking && (
                  <div className="flex items-center gap-2 text-brand-500 text-xs font-bold uppercase tracking-widest bg-brand-50 w-fit px-4 py-2 rounded-full border border-brand-100">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Thinking...
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200/60 bg-white">
                <div className="relative flex items-center gap-2">
                  <input 
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 bg-slate-50 border border-slate-200/60 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-inner"
                  />
                  <button 
                    type="submit"
                    disabled={!inputMessage.trim() || isAsking}
                    className="w-12 h-12 bg-brand-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 hover:bg-brand-700 disabled:opacity-50 disabled:grayscale transition-all active:scale-95 shrink-0"
                  >
                    <Send className="w-5 h-5 -ml-1" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={cn(
            "w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center transition-all duration-500",
            isChatOpen 
              ? "bg-slate-800 text-white rotate-90 scale-90" 
              : "bg-linear-to-br from-brand-600 to-brand-500 text-white hover:scale-105 hover:shadow-brand-500/40"
          )}
        >
          {isChatOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
        </button>
      </div>
    </div>
  );
}
