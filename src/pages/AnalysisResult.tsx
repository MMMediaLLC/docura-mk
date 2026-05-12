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
  ArrowLeft,
  ChevronRight,
  Info,
  Zap,
  Send,
  Loader2,
  Calendar,
  X,
  Sparkles,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { AnalysisResult as AnalysisType, ChatMessage } from '../types/analysis';
import { firebaseService } from '../services/firebaseService';
import { AnalysisService } from '../services/analysisService';
import { auth } from '../firebase';

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
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!id) return;
      try {
        const data = await firebaseService.getAnalysis(id);
        if (data) {
          setAnalysis(data.analysis);
          setChunks(data.chunks || []);
        } else {
          setError('Анализата не е пронајдена');
        }
      } catch (err) {
        console.error("Failed to fetch analysis", err);
        setError('Неуспешно вчитување на анализата');
      }
    };

    const fetchUserPlan = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const status = await firebaseService.getUserStatus(user.uid);
      setIsPro(status.plan !== 'free');
    };

    fetchAnalysis();
    fetchUserPlan();
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
      const assistantMsg: ChatMessage = { role: 'assistant', content: answer };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: "Жалам, не можев да го процесирам вашето прашање во овој момент.",
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleExport = () => {
    if (!analysis) return;

    const sevBorder = (s: string) => s === 'high' ? '#ef4444' : s === 'medium' ? '#f59e0b' : '#3b82f6';
    const sevBg = (s: string) => s === 'high' ? '#fff5f5' : s === 'medium' ? '#fffbeb' : '#eff6ff';
    const sevColor = (s: string) => s === 'high' ? '#dc2626' : s === 'medium' ? '#b45309' : '#1d4ed8';
    const sevLabel = (s: string) => s === 'high' ? 'ВИСОК' : s === 'medium' ? 'СРЕДЕН' : 'НИЗОК';
    const dlColor = (s: string) => s === 'urgent' ? '#dc2626' : s === 'important' ? '#b45309' : '#475569';
    const dlLabel = (s: string) => s === 'urgent' ? 'ИТНО' : s === 'important' ? 'ВАЖНО' : 'ИНФО';
    const docType = (analysis.documentType || 'документ').replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    const analyzedDate = new Date(analysis.uploadDate || Date.now()).toLocaleDateString('mk-MK', { day: '2-digit', month: 'long', year: 'numeric' });

    // Risk scoring
    const highRisks = (analysis.risks || []).filter(r => r.severity === 'high');
    const medRisks  = (analysis.risks || []).filter(r => r.severity === 'medium');
    const lowRisks  = (analysis.risks || []).filter(r => r.severity === 'low');
    const totalObs  = (analysis.obligations || []).length;
    const totalDls  = (analysis.deadlines || []).length;

    const riskScore    = Math.min(100, highRisks.length * 16 + medRisks.length * 6 + lowRisks.length * 2);
    const overallLevel = riskScore > 60 ? 'ВИСОК' : riskScore > 30 ? 'СРЕДЕН' : 'НИЗок';
    const levelColor   = riskScore > 60 ? '#ef4444' : riskScore > 30 ? '#f59e0b' : '#22c55e';
    const levelBg      = riskScore > 60 ? 'rgba(239,68,68,0.12)' : riskScore > 30 ? 'rgba(245,158,11,0.12)' : 'rgba(34,197,94,0.12)';
    const levelBorder  = riskScore > 60 ? 'rgba(239,68,68,0.35)' : riskScore > 30 ? 'rgba(245,158,11,0.35)' : 'rgba(34,197,94,0.35)';

    const ringR     = 44;
    const ringC     = 2 * Math.PI * ringR;
    const ringDash  = ((riskScore / 100) * ringC).toFixed(2);
    const ringGap   = (ringC - parseFloat(ringDash)).toFixed(2);
    const ringColor = riskScore > 60 ? '#ef4444' : riskScore > 30 ? '#f59e0b' : '#22c55e';
    const ringGlow  = riskScore > 60 ? 'rgba(239,68,68,0.20)' : riskScore > 30 ? 'rgba(245,158,11,0.20)' : 'rgba(34,197,94,0.20)';

    const smartTrim = (s: string, n: number): string => {
      if (!s || s.length <= n) return s || '';
      const cut = s.slice(0, n);
      const lastSpace = cut.lastIndexOf(' ');
      return (lastSpace > n * 0.65 ? cut.slice(0, lastSpace) : cut) + '…';
    };

    const findingCards: { color: string; border: string; accentColor: string; badge: string; badgeColor: string; title: string; snippet: string; note: string }[] = [];

    highRisks.slice(0, 2).forEach(r => {
      findingCards.push({
        color: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.22)', accentColor: '#ef4444',
        badge: 'Критичен ризик', badgeColor: '#ef4444',
        title: r.title || 'Критичен ризик',
        snippet: smartTrim(r.explanation || '', 82),
        note: 'Приоритет: Висок · Препорачан правен преглед',
      });
    });

    medRisks.slice(0, 1).forEach(r => {
      findingCards.push({
        color: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.22)', accentColor: '#f59e0b',
        badge: 'Потенцијален ризик', badgeColor: '#f59e0b',
        title: r.title || 'Среден ризик',
        snippet: smartTrim(r.explanation || '', 82),
        note: 'Приоритет: Среден · Прегледај и побарај појаснување',
      });
    });

    if ((analysis.obligations || []).length > 0 && findingCards.length < 4) {
      const ob = analysis.obligations[0];
      findingCards.push({
        color: 'rgba(34,197,94,0.07)', border: 'rgba(34,197,94,0.20)', accentColor: '#22c55e',
        badge: 'Клучна обврска', badgeColor: '#22c55e',
        title: smartTrim(ob.obligation || 'Клучна обврска', 55),
        snippet: ob.party ? `Одговорна страна: ${ob.party}` : 'Одговорна страна: Не е наведено',
        note: ob.timing ? `Рок: ${ob.timing}` : 'Рок: Не е наведен во документот',
      });
    }

    if ((analysis.deadlines || []).length > 0 && findingCards.length < 4) {
      const dl = analysis.deadlines[0];
      findingCards.push({
        color: 'rgba(99,102,241,0.07)', border: 'rgba(99,102,241,0.20)', accentColor: '#818cf8',
        badge: 'Клучен рок', badgeColor: '#818cf8',
        title: smartTrim(dl.description || 'Клучен рок', 55),
        snippet: dl.dateOrPeriod ? `Датум: ${dl.dateOrPeriod}` : 'Датум: Не е наведен',
        note: dl.severity === 'urgent' ? 'Итност: Висока · Потребна итна акција' : dl.severity === 'important' ? 'Итност: Средна · Прегледај навреме' : 'Итност: Ниска · Следи за усогласеност',
      });
    }

    const findingCardsHtml = findingCards.slice(0, 4).map(fc => `
      <div style="flex:1;min-width:0;background:${fc.color};border:1px solid ${fc.border};border-radius:11px;padding:19px 20px 15px;display:flex;flex-direction:column;gap:0;page-break-inside:avoid;position:relative;overflow:hidden">
        <div style="position:absolute;top:0;left:0;width:3px;height:100%;background:${fc.accentColor};opacity:0.8"></div>
        <div style="font-size:13px;font-weight:800;color:#ffffff;line-height:1.3;margin-bottom:8px;padding-left:4px">${fc.title}</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.55);line-height:1.6;flex:1;margin-bottom:12px;padding-left:4px">${fc.snippet}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.08);padding-top:9px;gap:8px">
          <div style="font-size:9px;color:rgba(255,255,255,0.32);letter-spacing:0.01em;line-height:1.4">${fc.note}</div>
          <div style="flex-shrink:0;font-size:7.5px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;color:${fc.badgeColor};border:1px solid ${fc.border};border-radius:3px;padding:2px 8px;white-space:nowrap">${fc.badge}</div>
        </div>
      </div>`).join('');

    const summaryPage = `<div style="
        background:#090e1a;color:#fff;min-height:100vh;padding:40px 48px 32px;
        font-family:'Segoe UI',system-ui,-apple-system,Arial,sans-serif;
        -webkit-print-color-adjust:exact;print-color-adjust:exact;
        position:relative;overflow:hidden;page-break-after:always;">
      <div style="position:absolute;top:-100px;left:-80px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,0.20) 0%,transparent 70%);pointer-events:none"></div>
      <div style="position:absolute;top:40px;right:-100px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(239,68,68,0.14) 0%,transparent 70%);pointer-events:none"></div>
      <div style="position:absolute;bottom:-80px;left:38%;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,0.11) 0%,transparent 70%);pointer-events:none"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;position:relative;z-index:1">
        <div style="display:flex;align-items:center;gap:13px">
          <div style="width:38px;height:38px;background:linear-gradient(135deg,#6366f1,#4338ca);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 0 20px rgba(99,102,241,0.45)">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div>
            <div style="font-size:16px;font-weight:900;letter-spacing:-0.02em;color:#fff">DOCURA</div>
            <div style="font-size:8px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:#818cf8;margin-top:2px">Интелигенција</div>
          </div>
        </div>
        <div style="font-size:7.5px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.28);text-align:right;line-height:1.7">Анализа на документи<br>со вештачка интелигенција</div>
      </div>
      <div style="height:1px;background:linear-gradient(90deg,rgba(99,102,241,0.65),rgba(239,68,68,0.45),transparent);margin-bottom:26px;position:relative;z-index:1"></div>
      <div style="margin-bottom:22px;position:relative;z-index:1">
        <div style="font-size:27px;font-weight:900;letter-spacing:-0.025em;color:#fff;line-height:1.15;margin-bottom:7px">Резиме на анализата</div>
        <div style="font-size:11.5px;color:rgba(255,255,255,0.38);line-height:1.6;max-width:500px;font-weight:400">Увиди базирани на ВИ за брзо разбирање на ризиците, обврските и клучните услови.</div>
      </div>
      <div style="display:flex;gap:10px;margin-bottom:24px;position:relative;z-index:1">
        <div style="flex:1;background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.08);border-radius:11px;padding:14px 17px">
          <div style="font-size:8px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:6px">Документ</div>
          <div style="font-size:12px;font-weight:700;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${analysis.fileName || '—'}</div>
        </div>
        <div style="flex:1;background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.08);border-radius:11px;padding:14px 17px">
          <div style="font-size:8px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:6px">Датум на анализа</div>
          <div style="font-size:12px;font-weight:700;color:#e2e8f0">${analyzedDate}</div>
        </div>
        <div style="flex:1;background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.08);border-radius:11px;padding:14px 17px">
          <div style="font-size:8px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:6px">Тип на документ</div>
          <div style="font-size:12px;font-weight:700;color:#e2e8f0">${docType}</div>
        </div>
        <div style="flex:1.2;background:${levelBg};border:1px solid ${levelBorder};border-radius:11px;padding:14px 17px">
          <div style="font-size:8px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:6px">Вкупен ризик</div>
          <div style="font-size:15px;font-weight:900;letter-spacing:0.04em;color:${levelColor}">${overallLevel}</div>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:22px 26px;display:flex;align-items:center;gap:28px;margin-bottom:22px;position:relative;z-index:1;overflow:hidden">
        <div style="position:absolute;top:0;left:0;width:3.5px;height:100%;background:linear-gradient(180deg,${levelColor} 0%,rgba(255,255,255,0.03) 100%)"></div>
        <div style="flex:1;padding-left:10px">
          <div style="display:flex;align-items:center;gap:11px;margin-bottom:11px">
            <div style="width:34px;height:34px;background:${levelBg};border:1px solid ${levelBorder};border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${levelColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div style="font-size:18px;font-weight:900;color:#fff;letter-spacing:-0.02em">${riskScore > 60 ? 'Идентификуван висок ризик' : riskScore > 30 ? 'Детектиран умерен ризик' : 'Низок профил на ризик'}</div>
          </div>
          <div style="display:flex;align-items:center;gap:0;margin-top:16px;border-top:1px solid rgba(255,255,255,0.07);padding-top:14px">
            <div style="flex:1;text-align:center;padding:0 6px">
              <div style="font-size:22px;font-weight:900;color:#f87171;line-height:1">${highRisks.length}</div>
              <div style="font-size:7.5px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-top:4px">Критични</div>
            </div>
            <div style="width:1px;height:32px;background:rgba(255,255,255,0.08)"></div>
            <div style="flex:1;text-align:center;padding:0 6px">
              <div style="font-size:22px;font-weight:900;color:#fbbf24;line-height:1">${medRisks.length}</div>
              <div style="font-size:7.5px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-top:4px">Средни</div>
            </div>
            <div style="width:1px;height:32px;background:rgba(255,255,255,0.08)"></div>
            <div style="flex:1;text-align:center;padding:0 6px">
              <div style="font-size:22px;font-weight:900;color:#34d399;line-height:1">${totalObs}</div>
              <div style="font-size:7.5px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-top:4px">Обврски</div>
            </div>
            <div style="width:1px;height:32px;background:rgba(255,255,255,0.08)"></div>
            <div style="flex:1;text-align:center;padding:0 6px">
              <div style="font-size:22px;font-weight:900;color:#818cf8;line-height:1">${totalDls}</div>
              <div style="font-size:7.5px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-top:4px">Рокови</div>
            </div>
          </div>
        </div>
        <div style="flex-shrink:0;position:relative;width:112px;height:112px">
          <svg width="112" height="112" viewBox="0 0 112 112" style="transform:rotate(-90deg);display:block">
            <circle cx="56" cy="56" r="${ringR}" fill="none" stroke="${ringGlow}" stroke-width="9"/>
            <circle cx="56" cy="56" r="${ringR}" fill="none" stroke="${ringColor}" stroke-width="9"
              stroke-dasharray="${ringDash} ${ringGap}" stroke-linecap="round"
              style="filter:drop-shadow(0 0 7px ${ringColor})"/>
          </svg>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;line-height:1">
            <div style="font-size:26px;font-weight:900;color:${ringColor};letter-spacing:-0.03em">${riskScore}</div>
            <div style="font-size:7px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.32);margin-top:4px">Индекс</div>
          </div>
        </div>
      </div>
      ${findingCards.length > 0 ? `
      <div style="margin-bottom:20px;position:relative;z-index:1">
        <div style="font-size:8px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:11px;padding-bottom:9px;border-bottom:1px solid rgba(255,255,255,0.06)">Главни наоди</div>
        <div style="display:flex;gap:11px">${findingCardsHtml}</div>
      </div>` : ''}
      <div style="background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.15);border-radius:9px;padding:12px 18px;margin-bottom:22px;position:relative;z-index:1;display:flex;align-items:center;gap:12px">
        <div style="width:3px;height:28px;background:rgba(99,102,241,0.5);border-radius:2px;flex-shrink:0"></div>
        <div style="font-size:11px;color:rgba(255,255,255,0.42);line-height:1.65">Оваа страна ги сумира најзначајните наоди од вашиот документ. <span style="color:rgba(255,255,255,0.62);font-weight:600">Видете го целосниот извештај за анализа на клаузули, обврски и препорачани акции.</span></div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:13px;border-top:1px solid rgba(255,255,255,0.07);position:relative;z-index:1">
        <div style="font-size:8.5px;color:rgba(255,255,255,0.22);line-height:1.6;max-width:420px;font-style:italic;letter-spacing:0.01em">Автоматски генериран извештај само за информативни цели. Не претставува правен совет. Консултирајте се со квалификуван професионалец.</div>
        <div style="font-size:8.5px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:#4f46e5;flex-shrink:0">DOCURA ИНТЕЛИГЕНЦИЈА</div>
      </div>
    </div>`;

    const risksHtml = (analysis.risks || []).map(r => `
      <div style="margin-bottom:12px;padding:14px 18px;border-left:3px solid ${sevBorder(r.severity)};background:${sevBg(r.severity)};page-break-inside:avoid">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:5px">
          <span style="font-size:13px;font-weight:700;color:#0f172a;line-height:1.4">${r.title || ''}</span>
          <span style="font-size:9px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:${sevColor(r.severity)};white-space:nowrap;padding:2px 7px;border:1px solid ${sevBorder(r.severity)};flex-shrink:0">${sevLabel(r.severity)}</span>
        </div>
        <p style="margin:0;font-size:12.5px;color:#334155;line-height:1.65">${r.explanation || ''}</p>
        ${(r as any).sourceHint ? `<div style="margin-top:5px;font-size:11px;color:#64748b;font-style:italic">Извор: ${(r as any).sourceHint}</div>` : ''}
      </div>`).join('');

    const obligationsHtml = (analysis.obligations || []).map((o, i) => `
      <tr style="background:${i % 2 === 0 ? '#fff' : '#f8fafc'}">
        <td style="padding:9px 13px;font-size:12px;font-weight:700;color:#475569;border-bottom:1px solid #e2e8f0;vertical-align:top;white-space:nowrap">${o.party || ''}</td>
        <td style="padding:9px 13px;font-size:12.5px;color:#1e293b;border-bottom:1px solid #e2e8f0;line-height:1.5;vertical-align:top">${o.obligation || ''}</td>
        <td style="padding:9px 13px;font-size:12px;color:#64748b;border-bottom:1px solid #e2e8f0;vertical-align:top;white-space:nowrap">${o.timing || 'Не е наведено'}</td>
      </tr>`).join('');

    const deadlinesHtml = (analysis.deadlines || []).map(d => `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:10px 14px;border-bottom:1px solid #f1f5f9;gap:12px">
        <div style="flex:1">
          <div style="font-size:13px;font-weight:600;color:#0f172a;margin-bottom:2px">${d.description || ''}</div>
          <div style="font-size:12px;color:#4f46e5;font-weight:500">${d.dateOrPeriod || ''}</div>
        </div>
        <span style="font-size:9px;font-weight:800;letter-spacing:0.07em;text-transform:uppercase;color:${dlColor(d.severity)};white-space:nowrap;padding-top:2px">${dlLabel(d.severity)}</span>
      </div>`).join('');

    const keyPointsHtml = (analysis.keyPoints || []).map(p =>
      `<li style="margin-bottom:7px;font-size:13px;color:#334155;line-height:1.6;padding-left:3px">${p}</li>`).join('');

    const questionsHtml = (analysis.suggestedQuestions || []).map((q, i) =>
      `<div style="padding:9px 0;border-bottom:1px solid #f1f5f9;font-size:12.5px;color:#1e293b;line-height:1.5">${i + 1}.&nbsp; ${q}</div>`).join('');

    const html = `<!DOCTYPE html>
<html lang="mk">
<head>
  <meta charset="UTF-8" />
  <title>DOCURA Извештај — ${analysis.title || analysis.fileName || 'Анализа'}</title>
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #fff; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif; color: #1e293b; font-size: 13px; line-height: 1.6; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .rp { max-width: 800px; margin: 0 auto; padding: 18mm 16mm 20mm 16mm; }
    .report-header { border-bottom: 2px solid #0f172a; padding-bottom: 18px; margin-bottom: 26px; }
    .brand-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
    .brand { font-size:10px; font-weight:800; letter-spacing:0.2em; text-transform:uppercase; color:#4f46e5; }
    .report-label { font-size:10px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#94a3b8; }
    .doc-title { font-size:21px; font-weight:800; color:#0f172a; line-height:1.25; margin-bottom:9px; letter-spacing:-0.01em; }
    .doc-badge { display:inline-block; padding:2px 9px; background:#eef2ff; color:#4338ca; font-size:9.5px; font-weight:800; letter-spacing:0.07em; text-transform:uppercase; margin-left:9px; vertical-align:middle; }
    .meta-row { font-size:11px; color:#64748b; }
    .meta-row strong { color:#334155; font-weight:700; margin-right:4px; }
    .meta-sep { color:#cbd5e1; margin: 0 10px; }
    h2 { font-size:10px; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; color:#4f46e5; margin:26px 0 11px; padding-bottom:7px; border-bottom:1px solid #e0e7ff; page-break-after:avoid; }
    .summary-block { font-size:13.5px; color:#334155; line-height:1.75; background:#f8fafc; border-left:3px solid #4f46e5; padding:13px 17px; }
    ul.kp { padding-left:16px; }
    .obligations-table { width:100%; border-collapse:collapse; border:1px solid #e2e8f0; }
    .obligations-table th { padding:8px 13px; background:#f1f5f9; font-size:9.5px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#64748b; text-align:left; border-bottom:1px solid #e2e8f0; }
    .deadlines-box { border:1px solid #e2e8f0; }
    .questions-box { border:1px solid #e2e8f0; padding:0 14px; }
    .report-footer { margin-top:32px; padding-top:12px; border-top:1px solid #cbd5e1; display:flex; justify-content:space-between; align-items:center; gap:12px; }
    .footer-brand { font-size:9.5px; font-weight:800; letter-spacing:0.12em; text-transform:uppercase; color:#4f46e5; flex-shrink:0; }
    .footer-note { font-size:10px; color:#94a3b8; line-height:1.4; }
    @media print { .report-header, h2, .summary-block { page-break-inside:avoid; } }
  </style>
</head>
<body>
  ${summaryPage}
  <div class="rp">
    <div class="report-header">
      <div class="brand-row">
        <span class="brand">DOCURA Интелигенција</span>
        <span class="report-label">Автоматизиран извештај од анализа</span>
      </div>
      <div class="doc-title">
        ${analysis.title || analysis.fileName || 'Анализа на документ'}
        <span class="doc-badge">${docType}</span>
      </div>
      <div class="meta-row">
        <strong>Датотека:</strong>${analysis.fileName || '—'}<span class="meta-sep">|</span><strong>Анализирано:</strong>${analyzedDate}
      </div>
    </div>
    <h2>Извршно резиме</h2>
    <div class="summary-block">${analysis.summary || 'Нема достапно резиме.'}</div>
    ${analysis.keyPoints?.length ? `<h2>Клучни точки</h2><ul class="kp">${keyPointsHtml}</ul>` : ''}
    ${analysis.risks?.length ? `<h2>Идентификувани ризици (${analysis.risks.length})</h2>${risksHtml}` : ''}
    ${analysis.obligations?.length ? `
      <h2>Обврски</h2>
      <table class="obligations-table">
        <thead><tr><th>Страна</th><th>Обврска</th><th>Рок/Време</th></tr></thead>
        <tbody>${obligationsHtml}</tbody>
      </table>` : ''}
    ${analysis.deadlines?.length ? `<h2>Рокови и клучни датуми (${analysis.deadlines.length})</h2><div class="deadlines-box">${deadlinesHtml}</div>` : ''}
    ${analysis.suggestedQuestions?.length ? `<h2>Предложени прашања за преглед</h2><div class="questions-box">${questionsHtml}</div>` : ''}
    <div class="report-footer">
      <span class="footer-brand">DOCURA Интелигенција</span>
      <span class="footer-note">Автоматизиран извештај само за информативни цели. Не е правен совет. Консултирајте се со квалификуван професионалец пред да донесете правни или комерцијални одлуки.</span>
    </div>
  </div>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-400" />
        <p className="text-zinc-900 font-bold text-xl">{error}</p>
        <Link to="/dashboard" className="text-brand-600 font-bold hover:underline">Врати се на контролната табла</Link>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
        <p className="text-zinc-500 font-medium">Вчитување на анализата...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'summary', label: 'Резиме', icon: FileText },
    { id: 'risks', label: 'Ризици', icon: Shield, count: analysis.risks?.length || 0 },
    { id: 'obligations', label: 'Обврски', icon: CheckCircle2 },
    { id: 'deadlines', label: 'Рокови', icon: Clock, count: analysis.deadlines?.length || 0 },
    { id: 'clauses', label: 'Клучни клаузули', icon: Zap },
  ];

  return (
    <div className="space-y-8 pb-24 relative">
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
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Анализирано на {new Date(analysis.uploadDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isPro ? (
            <button onClick={handleExport} className="btn-secondary flex items-center gap-2 py-2">
              <Download className="w-4 h-4" />
              Извези PDF
            </button>
          ) : (
            <Link to="/pricing" className="btn-secondary flex items-center gap-2 py-2 opacity-60">
              <Lock className="w-4 h-4" />
              Извези PDF
            </Link>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap pb-2">
            {tabs.map((tab) => {
              const isLocked = !isPro && (tab.id === 'obligations' || tab.id === 'deadlines' || tab.id === 'clauses');
              return (
                <button
                  key={tab.id}
                  onClick={() => !isLocked && setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl transition-all duration-300 whitespace-nowrap border",
                    isLocked
                      ? "bg-white/40 text-slate-400 border-white/30 cursor-not-allowed"
                      : activeTab === tab.id
                        ? "bg-brand-600 text-white shadow-lg shadow-brand-500/25 border-brand-500"
                        : "bg-white/60 text-slate-600 border-white/40 hover:bg-white hover:shadow-md hover:text-brand-700 backdrop-blur-md"
                  )}
                >
                  {isLocked
                    ? <Lock className="w-3.5 h-3.5 text-slate-300" />
                    : <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.id ? "text-brand-100" : "text-slate-400")} />
                  }
                  {tab.label}
                  {tab.count !== undefined && !isLocked && (
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
              );
            })}
          </div>

          {/* Upgrade banner for free users */}
          {!isPro && (
            <div className="flex items-center justify-between gap-4 px-5 py-4 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200/60 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-brand-500 shrink-0" />
                <p className="text-sm font-semibold text-slate-700">
                  Обврски, Рокови и Клучни клаузули се достапни на Про планот.
                </p>
              </div>
              <Link
                to="/pricing"
                className="shrink-0 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-colors"
              >
                Надгради
              </Link>
            </div>
          )}

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
                      Извршно резиме
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
                      Клучни точки
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-5">
                      {analysis.keyPoints?.map((point, i) => (
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
                  {analysis.risks?.map((risk, i) => (
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
                            {risk.severity === 'high' ? 'висок' : risk.severity === 'medium' ? 'среден' : 'низок'} ризик
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">{risk.explanation}</p>
                        {risk.sourceHint && (
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-2">
                            <Info className="w-3.5 h-3.5" />
                            Извор: <span className="text-brand-600">{risk.sourceHint}</span>
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
                          <th className="px-6 py-5 font-bold text-slate-800 uppercase tracking-wider text-[11px]">Страна</th>
                          <th className="px-6 py-5 font-bold text-slate-800 uppercase tracking-wider text-[11px]">Обврска</th>
                          <th className="px-6 py-5 font-bold text-slate-800 uppercase tracking-wider text-[11px]">Рок/Време</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {analysis.obligations?.map((ob, i) => (
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
                  {analysis.deadlines?.map((dl, i) => (
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
                        {dl.severity === 'urgent' ? 'итно' : dl.severity === 'important' ? 'важно' : 'инфо'}
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
                  {analysis.keyClauses?.map((clause, i) => (
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
          <div className="glass-panel p-8 rounded-[2rem] space-y-5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Преглед на анализата</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="soft-card p-4 bg-white/50 border-white/40">
                <p className="text-3xl font-display font-bold text-slate-800 tracking-tight">{analysis.risks?.length || 0}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Пронајдени ризици</p>
              </div>
              <div className="soft-card p-4 bg-white/50 border-white/40">
                <p className="text-3xl font-display font-bold text-slate-800 tracking-tight">{analysis.deadlines?.length || 0}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Рокови</p>
              </div>
            </div>
            <div className="pt-5 border-t border-slate-200/50">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                <Shield className="w-4 h-4 text-brand-500" />
                Доверливост на извлекувањето
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
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Текстот на документот беше јасен и добро структуриран.</p>
                </>
              )}
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="glass-panel p-8 rounded-[2rem]">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Прашај го документот</h3>
            <p className="text-xs text-slate-400 font-medium mb-5">Кликнете на прашање за да го отворите асистентот за чет.</p>
            <div className="space-y-3">
              {analysis.suggestedQuestions?.map((q, i) => (
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

          {/* Disclaimer */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-3 uppercase tracking-widest text-[10px]">
              <HelpCircle className="w-4 h-4 text-brand-500" />
              Само за информативна употреба
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Ова е резиме генерирано од ВИ за информативни цели. Не претставува правен совет. Секогаш прегледувајте го оригиналниот документ и консултирајте се со квалификуван професионалец.
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
                    <span className="font-bold text-sm block">Прашај го документот</span>
                    <span className="text-[10px] text-brand-100 uppercase tracking-widest font-bold">Про Интелигенција</span>
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
                      <p className="text-base font-bold text-slate-800">Сè уште нема пораки</p>
                      <p className="text-sm text-slate-500 mt-2 font-medium">Прашајте bilo што за документот и добијте инстант одговори.</p>
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
                        Извор: {msg.sourceHint}
                      </span>
                    )}
                  </div>
                ))}
                {isAsking && (
                  <div className="flex items-center gap-2 text-brand-500 text-xs font-bold uppercase tracking-widest bg-brand-50 w-fit px-4 py-2 rounded-full border border-brand-100">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Размислувам...
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200/60 bg-white">
                <div className="relative flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Постави прашање..."
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
