import { Link } from 'react-router-dom';
import {
  FileSearch,
  ShieldCheck,
  ArrowRight,
  Zap,
  Bot,
  Sparkles,
  Check,
  Lock,
  FileText,
  Scale,
  Building2,
  Receipt,
  FolderOpen,
  Briefcase,
  Users,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const DOC_TYPES = [
  {
    icon: Scale,
    label: 'Договори',
    desc: 'Закуп, вработување, услуги, купопродажба, NDA — знај на што се обврзуваш пред да потпишеш.',
    color: 'text-brand-600',
    bg: 'bg-brand-50',
    border: 'border-brand-100',
  },
  {
    icon: Receipt,
    label: 'Понуди',
    desc: 'Комерцијални понуди, проформа фактури — провери вредност, услови и рокови пред да прифатиш.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    icon: Building2,
    label: 'Тендери',
    desc: 'Јавни набавки и ЕСЈН — провери задолжителни услови, рокови и причини за дисквалификација.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    icon: Briefcase,
    label: 'Деловни документи',
    desc: 'МОУ, општи услови, анекси, Terms & Conditions — разбери ги обврските и ограничувањата.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
  },
  {
    icon: FolderOpen,
    label: 'Грантови и проекти',
    desc: 'Апликации, услови за финансирање, проектни договори — провери обврски, рокови и услови.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
  {
    icon: FileText,
    label: 'Секој PDF документ',
    desc: 'Не знаеш каков е документот? Прикачи го — DOCURA ќе го идентификува и анализира.',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
  },
];

const USE_CASES = [
  {
    icon: Users,
    title: 'За секој граѓанин',
    tag: 'Секојдневна употреба',
    desc: 'Договор за закуп, купување, телекомуникации, осигурување — без правни познавања, разбери на што се обврзуваш пред да потпишеш.',
    highlight: 'bg-brand-50 border-brand-100',
    tagColor: 'text-brand-600 bg-brand-50',
  },
  {
    icon: Briefcase,
    title: 'За МСП и претприемачи',
    tag: 'Бизнис документи',
    desc: 'Договори со клиенти, понуди, деловни услови — побрзо разбирање без потреба од надворешен правник за секој документ.',
    highlight: 'bg-white border-slate-200',
    tagColor: 'text-amber-600 bg-amber-50',
  },
  {
    icon: Building2,
    title: 'За тендерски учесници',
    tag: 'Јавни набавки / ЕСЈН',
    desc: 'Задолжителни документи, рокови, критериуми — провери сè пред поднесување и избегни дисквалификација поради превид.',
    highlight: 'bg-white border-slate-200',
    tagColor: 'text-emerald-600 bg-emerald-50',
  },
];

const FAQS = [
  {
    q: 'Дали ова е правен совет?',
    a: 'Не. DOCURA обезбедува информативна анализа за полесно разбирање на документот. Не претставува правен совет и не е замена за адвокат или квалификуван професионалец.',
  },
  {
    q: 'Кои формати на документи се поддржани?',
    a: 'PDF и Word (.docx) документи. Најдобри резултати со јасни, текстуално достапни документи.',
  },
  {
    q: 'Дали DOCURA разбира македонски правен контекст?',
    a: 'Да. Системот познава македонски правен и деловен контекст: ЗОО, ЗРО, Закон за јавни набавки и ЕСЈН постапки.',
  },
  {
    q: 'Дали моите документи се користат за обучување на ВИ?',
    a: 'Не. Документите се обработуваат исклучиво за вашата анализа и не се користат за обучување на модели.',
  },
  {
    q: 'Може ли да анализирам тендерска документација од ЕСЈН?',
    a: 'Да. DOCURA е приспособен за македонски јавни набавки — ги издвојува задолжителните услови, роковите за поднесување, критериумите за евалуација и потенцијалните причини за дисквалификација.',
  },
  {
    q: 'Може ли да постављам прашања за документот?',
    a: 'Да. Откако ќе добиете анализа, можете да поставувате дополнителни прашања за конкретни клаузули, рокови или обврски директно во апликацијата.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafbff] text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900 relative overflow-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="w-11 h-11 bg-linear-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-200 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                <FileSearch className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col -space-y-1.5">
              <span className="font-display font-black text-2xl tracking-tighter text-slate-900">DOCURA</span>
              <span className="text-[9px] font-black text-brand-600 uppercase tracking-[0.3em] pl-0.5">Macedonia</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-12">
            <a href="#dokumenti" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-all uppercase tracking-widest">Документи</a>
            <a href="#kako-funkcionira" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-all uppercase tracking-widest">Kako функционира</a>
            <Link to="/pricing" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-all uppercase tracking-widest">Цени</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-bold text-slate-600 hover:text-brand-600 px-4 py-2 transition-colors uppercase tracking-widest hidden sm:block">Најава</Link>
            <Link to="/dashboard" className="btn-primary text-sm uppercase tracking-widest py-3 px-7 flex items-center gap-2">
              Почнете бесплатно
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-brand-400/8 rounded-full blur-[180px]" />
          <div className="absolute top-20 right-1/4 w-[700px] h-[700px] bg-indigo-400/8 rounded-full blur-[200px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-linear-to-r from-transparent via-brand-300/30 to-transparent" />
        </div>
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-linear-to-r from-brand-50 to-indigo-50 border border-brand-200/60 text-brand-700 text-[11px] font-bold rounded-full mb-8 uppercase tracking-[0.2em] shadow-sm shadow-brand-100">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              ВИ асистент за документи — за секого
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.05]">
              Разбери го секој<br />
              документ пред да <span className="text-gradient">потпишеш.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Договор, понуда, тендер, грант или деловен документ — прикачи го и за неколку секунди добиј јасна слика: ризици, обврски, рокови и клучни клаузули. Без правни познавања.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard" className="btn-primary px-10 py-5 text-lg flex items-center justify-center gap-3 group shadow-xl shadow-brand-500/30 w-full sm:w-auto">
                Анализирај документ бесплатно
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#dokumenti" className="flex items-center gap-2 text-slate-500 font-bold text-sm uppercase tracking-widest hover:text-brand-600 transition-colors">
                Кои документи?
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="pb-20 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-slate-400 font-bold text-xs uppercase tracking-[0.1em] border-y border-slate-200/60 py-8 bg-white/50 backdrop-blur-md rounded-[2.5rem]">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
              Не е потребна платежна картичка
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              Документите не се користат за обучување
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              Македонски правен контекст
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              ЕСЈН и јавни набавки поддржани
            </div>
          </div>
        </div>
      </section>

      {/* Document Types */}
      <section id="dokumenti" className="py-32 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black text-brand-600 uppercase tracking-[0.25em] mb-4">Поддржани документи</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              За секој документ со кој<br className="hidden md:block" /> се среќаваш
            </h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              Без разлика дали потпишуваш закуп, поднесуваш на тендер или примаш деловна понуда — DOCURA го разбира документот и ти кажува што е важно.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOC_TYPES.map((dt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={cn('rounded-[2rem] p-8 border hover:-translate-y-1 transition-all duration-300 cursor-default', dt.bg, dt.border)}
              >
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-white shadow-sm border', dt.border)}>
                  <dt.icon className={cn('w-6 h-6', dt.color)} />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900 mb-3">{dt.label}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">{dt.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="kako-funkcionira" className="py-32 px-6 bg-[#fafbff]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-black text-brand-600 uppercase tracking-[0.25em] mb-4">Процес</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">Три чекори до јасна слика</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              {
                num: '01',
                title: 'Прикачете документ',
                desc: 'PDF или Word — договор, понуда, тендерска документација, грант или кој било деловен документ.',
                icon: FileText,
                color: 'text-brand-600',
                bg: 'bg-brand-50',
              },
              {
                num: '02',
                title: 'ВИ анализа',
                desc: 'Системот ги издвојува ризиците, обврските, роковите, клучните клаузули и нејасните точки.',
                icon: Zap,
                color: 'text-amber-600',
                bg: 'bg-amber-50',
              },
              {
                num: '03',
                title: 'Прегледај и прашај',
                desc: 'Добиј структуриран извештај и постави дополнителни прашања за конкретни делови од документот.',
                icon: Bot,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-8">
                  <div className={cn('w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-lg', step.bg)}>
                    <step.icon className={cn('w-8 h-8', step.color)} />
                  </div>
                  <span className="absolute -top-3 -right-3 text-[10px] font-black text-slate-300 tracking-widest">{step.num}</span>
                </div>
                <h3 className="font-display font-bold text-2xl mb-4 text-slate-900">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Output Preview */}
      <section className="py-20 px-6 relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/10 blur-[200px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center mb-16">
          <p className="text-xs font-black text-brand-400 uppercase tracking-[0.25em] mb-4">Пример на резултат</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-linear-to-br from-white to-slate-400 text-transparent bg-clip-text">
            Структуриран извештај за неколку секунди
          </h2>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">
            Ризици, обврски, рокови и клучни клаузули — јасно издвоени, лесни за скенирање.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 rounded-[2.5rem] p-4 lg:p-8 shadow-2xl border border-white/10">
            <div className="bg-slate-950 rounded-[1.5rem] border border-white/10 overflow-hidden">
              <div className="flex items-center gap-3 bg-slate-900/50 px-6 py-4 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="ml-4 font-bold text-xs text-slate-400 uppercase tracking-widest">Договор за закуп на деловен простор.pdf</div>
              </div>

              <div className="p-6 md:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-white/5">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight mb-1">Идентификуван е висок ризик</h3>
                    <p className="text-slate-400 text-sm font-medium">3 критични наоди · 2 обврски · 1 рок</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-rose-500/30 border-t-rose-500 flex items-center justify-center shrink-0">
                    <span className="text-lg font-black text-rose-500">74%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5 relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 rounded-l-2xl" />
                    <div className="flex items-start gap-4 pl-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Висок ризик</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">Еднострано раскинување без образложение</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          <span className="text-rose-300 bg-rose-400/10 px-1 py-0.5 rounded">"Закуподавачот може да го раскине договорот со 15-дневно известување без наведување причина."</span>
                          <span className="block mt-2">Закупецот нема реципрочно право — раскинувањето е еднострано во корист на закуподавачот.</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-2xl" />
                    <div className="pl-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Среден ризик</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">Казна при предвремено напуштање</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Предвремено напуштање пред истекот на рокот повлекува казна во висина на <span className="text-white px-1 py-0.5 bg-white/10 rounded">3 месечни закупнини</span>.
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-2xl" />
                    <div className="pl-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Рок</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">Плаќање до 5-ти во месецот</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">Закупнината се плаќа до 5-ти секој месец. Доцнење носи затезна камата согласно ЗОО.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-32 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black text-brand-600 uppercase tracking-[0.25em] mb-4">За кого е DOCURA</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">
              Достапен за секого —<br className="hidden md:block" /> не само за правници
            </h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              Секој кој прима, потпишува или поднесува документ заслужува да го разбере — пред да постапи.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {USE_CASES.map((uc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={cn('rounded-[2rem] p-10 border hover:-translate-y-1 transition-all duration-300', uc.highlight)}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                    <uc.icon className="w-6 h-6 text-slate-700" />
                  </div>
                  <span className={cn('text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border', uc.tagColor)}>{uc.tag}</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-4">{uc.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-32 px-6 bg-[#fafbff] border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black text-brand-600 uppercase tracking-[0.25em] mb-4">Цени</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">Едноставни и јасни цени</h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Започнете бесплатно. Надградете кога ќе ви треба повеќе.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { plan: 'Бесплатно', price: '0 ден.', docs: '1 доживотна анализа на документ', cta: 'Започнете бесплатно', link: '/auth', popular: false },
              { plan: 'Про', price: '370 ден.', period: '/месечно', docs: '2 анализи на документи / месечно', cta: 'Изберете Про', link: '/pricing', popular: true },
              { plan: 'Бизнис', price: '1.170 ден.', period: '/месечно', docs: '15 анализи на документи / месечно', cta: 'Изберете Бизнис', link: '/pricing', popular: false },
            ].map((p, i) => (
              <div key={i} className={cn('rounded-[2rem] p-8 flex flex-col items-center text-center border transition-all', p.popular ? 'bg-slate-900 text-white shadow-2xl shadow-brand-900/20 border-slate-800 scale-105' : 'bg-white text-slate-900 border-slate-200')}>
                {p.popular && <span className="bg-brand-600 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full mb-6 relative -top-3">Најпопуларно</span>}
                <h3 className="font-display text-xl font-bold mb-2">{p.plan}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black">{p.price}</span>
                  {p.period && <span className={cn('text-xs font-bold uppercase', p.popular ? 'text-slate-400' : 'text-slate-500')}>{p.period}</span>}
                </div>
                <p className={cn('text-sm font-bold mb-8 flex-1', p.popular ? 'text-brand-300' : 'text-slate-500')}>{p.docs}</p>
                <Link to={p.link} className={cn('w-full py-4 rounded-xl font-bold transition-colors', p.popular ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black text-brand-600 uppercase tracking-[0.25em] mb-4">FAQ</p>
            <h2 className="font-display text-4xl font-bold text-slate-900 tracking-tight">Често поставувани прашања</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                <h3 className="font-bold text-lg mb-3 text-slate-900">{faq.q}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-slate-950 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-brand-600/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-brand-500/20">
              <FileSearch className="w-10 h-10 text-brand-400" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Разбери го секој документ.<br />
              <span className="text-brand-400">Пред да постапиш.</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              Договор, понуда, тендер или грант — прикачи го и добиј јасна слика за неколку секунди. Првата анализа е бесплатна, без регистрација на картичка.
            </p>
            <Link to="/auth" className="inline-flex items-center gap-3 bg-brand-600 text-white font-bold px-10 py-5 rounded-2xl text-lg hover:bg-brand-500 transition-all shadow-xl shadow-brand-900/50 group">
              Анализирај документ бесплатно
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-10">
              Приватност по дизајн · Документите не се зачувуваат за обучување · Бришење под контрола на корисникот
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 bg-slate-950 text-slate-400 text-sm font-bold uppercase tracking-widest text-center">
        <div className="flex flex-wrap justify-center gap-8 mb-6">
          <Link to="/terms" className="hover:text-white transition-colors">Услови</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Приватност</Link>
          <Link to="/disclaimer" className="hover:text-white transition-colors">Одрекување</Link>
          <Link to="/pricing" className="hover:text-white transition-colors">Цени</Link>
        </div>
        <p>© 2026 DOCURA Macedonia. Сите права се задржани.</p>
      </footer>
    </div>
  );
}
