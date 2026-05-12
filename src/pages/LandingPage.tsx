import { Link } from 'react-router-dom';
import {
  FileSearch, ShieldCheck, ArrowRight, Zap, Bot, Sparkles,
  Check, Lock, FileText, Scale, Building2, Receipt,
  FolderOpen, Briefcase, Users, AlertTriangle, Clock,
  ClipboardList, ChevronRight, Star,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const DOC_TYPES = [
  { icon: Scale,      label: 'Договори',           desc: 'Закуп, вработување, услуги, купопродажба, NDA',          color: 'text-brand-600', bg: 'bg-brand-50',   border: 'border-brand-100' },
  { icon: Receipt,    label: 'Понуди',              desc: 'Комерцијални понуди, проформа фактури, котации',         color: 'text-amber-600', bg: 'bg-amber-50',   border: 'border-amber-100' },
  { icon: Building2,  label: 'Тендери',             desc: 'Јавни набавки, услови, рокови, дисквалификација',        color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { icon: Briefcase,  label: 'Деловни документи',  desc: 'МОУ, општи услови, анекси, Terms & Conditions',         color: 'text-indigo-600', bg: 'bg-indigo-50',  border: 'border-indigo-100' },
  { icon: FolderOpen, label: 'Грантови и проекти', desc: 'Апликации, услови за финансирање, проектни договори',    color: 'text-rose-600',  bg: 'bg-rose-50',    border: 'border-rose-100' },
  { icon: FileText,   label: 'Секој PDF документ', desc: 'Непознат документ? Прикачи го — DOCURA го идентификува', color: 'text-slate-500', bg: 'bg-slate-100',  border: 'border-slate-200' },
];

const STEPS = [
  { num: '01', icon: FileText, title: 'Прикачете документ',  desc: 'PDF или Word — договор, понуда, тендерска документација, грант или кој било деловен документ.', color: 'text-brand-600',   bg: 'bg-brand-50',   border: 'border-brand-100' },
  { num: '02', icon: Zap,      title: 'ВИ анализа',          desc: 'Системот ги издвојува ризиците, обврските, роковите, клучните клаузули и нејасните точки.',        color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-100' },
  { num: '03', icon: Bot,      title: 'Прегледај и прашај',  desc: 'Добиј структуриран извештај и постави дополнителни прашања за конкретни делови од документот.',   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
];

const USE_CASES = [
  { icon: Users,     title: 'За секој граѓанин',      tag: 'Секојдневна употреба',   tagBg: 'bg-brand-50 text-brand-700 border-brand-200',   desc: 'Договор за закуп, купување, телекомуникации, осигурување — без правни познавања, разбери на што се обврзуваш пред да потпишеш.' },
  { icon: Briefcase, title: 'За МСП и претприемачи',  tag: 'Деловни документи',      tagBg: 'bg-amber-50 text-amber-700 border-amber-200',    desc: 'Договори со клиенти, понуди, деловни услови — побрзо разбирање без потреба од надворешен правник за секој документ.' },
  { icon: Building2, title: 'За тендерски учесници',  tag: 'Јавни набавки',          tagBg: 'bg-emerald-50 text-emerald-700 border-emerald-200', desc: 'Задолжителни документи, рокови, критериуми — провери сè пред поднесување и избегни дисквалификација поради превид.' },
];

const FAQS = [
  { q: 'Дали ова е правен совет?',                          a: 'Не. DOCURA обезбедува информативна анализа за полесно разбирање. Не претставува правен совет и не е замена за адвокат или квалификуван правник.' },
  { q: 'Дали DOCURA разбира македонски правен контекст?',   a: 'Да. Системот познава македонски правен и деловен контекст: ЗОО, ЗРО и Закон за јавни набавки.' },
  { q: 'Може ли да анализирам тендерска документација?',    a: 'Да. DOCURA е приспособен за македонски јавни набавки — задолжителни услови, рокови, критериуми и потенцијални причини за дисквалификација.' },
  { q: 'Кои формати на документи се поддржани?',            a: 'PDF и Word (.docx). Најдобри резултати со јасни, текстуално достапни документи.' },
  { q: 'Дали моите документи се користат за обучување?',    a: 'Не. Документите се обработуваат исклучиво за вашата анализа и не се зачувуваат за обучување на модели.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">

      {/* ── Navigation ─────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm shadow-slate-100/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-18 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-linear-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200 group-hover:shadow-brand-300 transition-all duration-300">
                <FileSearch className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white">
                <div className="w-full h-full rounded-full bg-emerald-400 animate-ping opacity-75" />
              </div>
            </div>
            <div className="-space-y-1">
              <p className="font-display font-black text-xl tracking-tight text-slate-900 leading-none">DOCURA</p>
              <p className="text-[8px] font-black text-brand-500 uppercase tracking-[0.3em]">Macedonia</p>
            </div>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-10">
            {[['#dokumenti', 'Документи'], ['#kako-funkcionira', 'Kako функционира'], ['/pricing', 'Цени']].map(([href, label]) => (
              href.startsWith('#')
                ? <a key={label} href={href} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{label}</a>
                : <Link key={label} to={href} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{label}</Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link to="/auth" className="hidden sm:block text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors px-3 py-2">Најава</Link>
            <Link to="/dashboard" className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2">
              Почнете бесплатно <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        {/* Subtle dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.018]"
          style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-400/6 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-[1fr_440px] gap-20 items-center">

            {/* Left — Copy */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200/70 rounded-full text-brand-700 text-[11px] font-bold uppercase tracking-widest mb-8 shadow-sm">
                <Sparkles className="w-3 h-3 text-brand-500" />
                ВИ асистент за документи
              </div>

              <h1 className="font-display text-[3.5rem] lg:text-[4.25rem] font-black leading-[1.04] tracking-tight text-slate-900 mb-7">
                Разбери го секој<br />
                документ пред<br />
                да{' '}
                <span className="relative inline-block">
                  <span className="text-brand-600">потпишеш.</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M2 6 Q50 2 100 5 Q150 8 198 4" stroke="#c7d2fe" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg font-medium">
                Договор, понуда, тендер или грант — прикачи го и за неколку секунди добиј јасна слика: ризици, обврски, рокови и клучни клаузули. Без правни познавања.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/dashboard" className="btn-primary py-4 px-8 text-base flex items-center justify-center gap-2.5 group shadow-xl shadow-brand-500/25">
                  Анализирај документ бесплатно
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a href="#dokumenti" className="btn-secondary py-4 px-6 text-sm flex items-center justify-center gap-2">
                  Кои документи?
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-400" />Без платежна картичка</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />Документите се приватни</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" />МК правен контекст</span>
              </div>
            </motion.div>

            {/* Right — Analysis card */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block relative"
            >
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-brand-300/10 blur-3xl rounded-3xl -z-10 scale-110" />

              <div className="glass-panel rounded-3xl overflow-hidden">
                {/* Card header */}
                <div className="px-5 py-4 border-b border-white/50 flex items-center gap-3 bg-white/40">
                  <div className="w-9 h-9 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">Договор за закуп.pdf</p>
                    <p className="text-[11px] text-slate-400 font-medium">Анализиран · само што</p>
                  </div>
                  <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full shrink-0">Висок ризик</span>
                </div>

                {/* Score strip */}
                <div className="px-5 py-4 bg-white/20 border-b border-white/40 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Ризик скор</p>
                    <p className="text-3xl font-black text-rose-600 leading-none">74<span className="text-base font-semibold text-slate-400">/100</span></p>
                  </div>
                  <div className="flex gap-4">
                    {[['2', 'Висок', 'text-rose-600'], ['1', 'Среден', 'text-amber-600'], ['3', 'Обврски', 'text-slate-600']].map(([v, l, c]) => (
                      <div key={l} className="text-center">
                        <p className={cn('text-xl font-black leading-none', c)}>{v}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Findings */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-start gap-3 p-3.5 bg-rose-50/80 rounded-2xl border border-rose-100/70">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 mb-0.5">Еднострано раскинување</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Закуподавачот може да го раскине со 15-дневно известување без причина. Закупецот нема реципрочно право.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 bg-amber-50/80 rounded-2xl border border-amber-100/70">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 mb-0.5">Рок: плаќање до 5-ти</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Доцнење повлекува затезна камата согласно ЗОО.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 bg-white/60 rounded-2xl border border-slate-100">
                    <ClipboardList className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 mb-0.5">3 обврски идентификувани</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Депозит, одржување и известување при напуштање.</p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-white/40 bg-white/30 flex items-center justify-between">
                  <p className="text-[10px] text-slate-400 font-semibold">Уште 4 наоди · Целосен извештај →</p>
                  <Star className="w-3.5 h-3.5 text-brand-400" />
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg shadow-emerald-200/60 rotate-2 select-none">
                ✓ Анализа завршена
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────── */}
      <section className="bg-slate-900 border-y border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-700/50">
            {[['6+', 'Типа документи'], ['<30с', 'Времетраење'], ['100%', 'Македонски јазик'], ['PDF', 'Word поддржани']].map(([v, l]) => (
              <div key={l} className="first:divide-x-0">
                <p className="text-2xl font-black text-white mb-0.5">{v}</p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Document Types ─────────────────────────────────────── */}
      <section id="dokumenti" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="text-xs font-black text-brand-600 uppercase tracking-[0.25em] mb-3">Поддржани документи</p>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-5 leading-tight">
              За секој документ<br className="hidden md:block" /> со кој се среќаваш
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
              Без разлика дали потпишуваш закуп, поднесуваш тендер или примаш деловна понуда — DOCURA го разбира и ти ги покажува работите што се важни.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOC_TYPES.map((dt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
              >
                <div className="soft-card p-7 h-full flex items-start gap-4">
                  <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border', dt.bg, dt.border)}>
                    <dt.icon className={cn('w-5 h-5', dt.color)} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-900 mb-1.5 text-base">{dt.label}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{dt.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────── */}
      <section id="kako-funkcionira" className="py-16 px-6 bg-white border-y border-slate-100/60">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="text-xs font-black text-brand-600 uppercase tracking-[0.25em] mb-3">Процес</p>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">Три чекори до јасна слика</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
              >
                <div className="glass-panel rounded-3xl p-8 h-full">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0', step.bg, step.border)}>
                      <step.icon className={cn('w-6 h-6', step.color)} />
                    </div>
                    <span className="font-display text-5xl font-black text-slate-100 leading-none select-none mt-1">{step.num}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use Cases ──────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="text-xs font-black text-brand-600 uppercase tracking-[0.25em] mb-3">За кого е DOCURA</p>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-5 leading-tight">
              Достапен за секого
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">Секој кој прима, потпишува или поднесува документ заслужува да го разбере — пред да постапи.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {USE_CASES.map((uc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
              >
                <div className="soft-card p-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200/60">
                      <uc.icon className="w-5 h-5 text-slate-700" />
                    </div>
                    <span className={cn('text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border', uc.tagBg)}>{uc.tag}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900 mb-3">{uc.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{uc.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Analysis Preview (dark) ────────────────────────────── */}
      <section className="py-16 px-6 bg-slate-950 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="text-xs font-black text-brand-400 uppercase tracking-[0.25em] mb-3">Пример на резултат</p>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-white tracking-tight mb-5 leading-tight">Структуриран извештај<br className="hidden md:block" /> за неколку секунди</h2>
            <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto">Ризици, обврски, рокови и клучни клаузули — јасно издвоени, лесни за скенирање.</p>
          </motion.div>

          <div className="max-w-2xl mx-auto bg-slate-900 rounded-3xl border border-white/8 overflow-hidden shadow-2xl shadow-black/40">
            <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center">
                  <FileText className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Договор за закуп на деловен простор.pdf</p>
                  <p className="text-[11px] text-slate-500 font-medium">Тип: Договор · Анализа завршена</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-black text-rose-500 leading-none">74</p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ризик</p>
              </div>
            </div>

            <div className="p-5 space-y-3">
              {[
                { dot: 'bg-rose-500',   label: 'Висок ризик',   labelColor: 'text-rose-400',  bg: 'bg-rose-500/6 border-rose-500/15',   title: 'Еднострано раскинување без образложение',  body: '"Закуподавачот може да го раскине договорот со 15-дневно известување без наведување причина." — Закупецот нема реципрочно право.' },
                { dot: 'bg-amber-500',  label: 'Среден ризик',  labelColor: 'text-amber-400', bg: 'bg-amber-500/6 border-amber-500/15',  title: 'Казна при предвремено напуштање',           body: 'Предвремено напуштање пред истекот на рокот повлекува казна во висина на 3 месечни закупнини.' },
                { dot: 'bg-slate-500',  label: 'Рок',           labelColor: 'text-slate-400', bg: 'bg-white/2 border-white/6',           title: 'Плаќање до 5-ти во месецот',               body: 'Доцнење повлекува затезна камата согласно ЗОО. — Клаузула 4.2' },
              ].map((item, i) => (
                <div key={i} className={cn('flex items-start gap-3 p-4 rounded-2xl border', item.bg)}>
                  <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', item.dot)} />
                  <div>
                    <p className={cn('text-[9px] font-black uppercase tracking-widest mb-1', item.labelColor)}>{item.label}</p>
                    <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-3.5 border-t border-white/8 bg-slate-950/60 flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">Уште 4 наоди · 3 обврски · 1 рок</p>
              <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest">DOCURA</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white border-b border-slate-100/60">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="text-xs font-black text-brand-600 uppercase tracking-[0.25em] mb-3">Цени</p>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">Едноставни и јасни цени</h2>
            <p className="text-lg text-slate-500 font-medium">Започнете бесплатно. Надградете кога ќе ви треба повеќе.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { plan: 'Бесплатно', price: '0',     suffix: 'ден.',          docs: '1 доживотна анализа',     cta: 'Започнете бесплатно', link: '/auth',    dark: false },
              { plan: 'Про',       price: '370',   suffix: 'ден./месечно',  docs: '2 анализи / месечно',     cta: 'Изберете Про',        link: '/pricing', dark: true, popular: true },
              { plan: 'Бизнис',   price: '1.170', suffix: 'ден./месечно',  docs: '15 анализи / месечно',    cta: 'Изберете Бизнис',     link: '/pricing', dark: false },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="relative"
              >
                {p.popular && (
                  <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                    <span className="bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md shadow-brand-300/30">Најпопуларно</span>
                  </div>
                )}
                <div className={cn('rounded-3xl p-8 flex flex-col h-full border', p.dark ? 'bg-slate-900 border-slate-700/60 shadow-2xl shadow-slate-900/40 text-white' : 'bg-white border-slate-200/60 shadow-sm text-slate-900')}>
                  <h3 className="font-display font-bold text-lg mb-5">{p.plan}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-black">{p.price}</span>
                    <span className={cn('text-xs font-semibold ml-1.5', p.dark ? 'text-slate-400' : 'text-slate-400')}>{p.suffix}</span>
                  </div>
                  <p className={cn('text-sm font-semibold mb-8 flex-1', p.dark ? 'text-slate-400' : 'text-slate-500')}>{p.docs}</p>
                  <Link to={p.link} className={cn('w-full py-3.5 rounded-2xl font-bold text-sm text-center transition-all', p.dark ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-700/30' : 'bg-slate-100 hover:bg-slate-200 text-slate-700')}>
                    {p.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <p className="text-xs font-black text-brand-600 uppercase tracking-[0.25em] mb-3">FAQ</p>
            <h2 className="font-display text-4xl font-black text-slate-900 tracking-tight">Честопати поставувани прашања</h2>
          </motion.div>
          <div className="soft-card divide-y divide-slate-100 overflow-hidden">
            {FAQS.map((faq, i) => (
              <div key={i} className="px-8 py-6">
                <h3 className="font-display font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-linear-to-br from-brand-600 to-brand-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 border border-white/20 rounded-2xl mx-auto mb-8">
              <FileSearch className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              Разбери го секој документ.<br />
              <span className="text-brand-200">Пред да постапиш.</span>
            </h2>
            <p className="text-brand-100 text-lg font-medium mb-10 max-w-xl mx-auto leading-relaxed">
              Договор, понуда, тендер или грант — прикачи го и добиј јасна слика за неколку секунди. Првата анализа е бесплатна, без регистрација на картичка.
            </p>
            <Link to="/auth" className="inline-flex items-center gap-3 bg-white text-brand-700 font-bold px-10 py-4 rounded-2xl text-base hover:bg-brand-50 transition-colors shadow-2xl shadow-brand-900/30 group">
              Анализирај документ бесплатно
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <p className="text-brand-300/70 text-[11px] font-semibold uppercase tracking-widest mt-10">
              Приватност по дизајн · Не се зачувува за обучување · Бришење под контрола на корисникот
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="py-10 bg-white border-t border-slate-100 text-center">
        <div className="flex flex-wrap justify-center gap-8 mb-5">
          {[['Услови', '/terms'], ['Приватност', '/privacy'], ['Одрекување', '/disclaimer'], ['Цени', '/pricing']].map(([l, h]) => (
            <Link key={l} to={h} className="text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-wide">{l}</Link>
          ))}
        </div>
        <p className="text-sm text-slate-400">© 2026 DOCURA Macedonia. Сите права се задржани.</p>
      </footer>

    </div>
  );
}
