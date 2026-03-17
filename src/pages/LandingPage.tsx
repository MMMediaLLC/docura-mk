import { Link } from 'react-router-dom';
import { 
  FileSearch, 
  ShieldCheck, 
  Calendar, 
  ListChecks, 
  ArrowRight, 
  Zap, 
  Bot,
  ChevronDown,
  Sparkles,
  FileText,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const features = [
  {
    title: "Executive Summary",
    desc: "Get a high-level overview of complex documents in seconds, highlighting the core purpose.",
    icon: FileSearch,
    gradient: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/20",
    bg: "bg-blue-50",
  },
  {
    title: "Risk Detection",
    desc: "Automatically flag red flags, liabilities, and unfavorable terms hidden in the fine print.",
    icon: ShieldCheck,
    gradient: "from-rose-500 to-pink-600",
    glow: "shadow-rose-500/20",
    bg: "bg-rose-50",
  },
  {
    title: "Deadline Tracking",
    desc: "Never miss a renewal, submission, or payment date again with automated extraction.",
    icon: Calendar,
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
    bg: "bg-amber-50",
  },
  {
    title: "Obligation Extraction",
    desc: "Clearly see what you are responsible for and what others owe you in a structured list.",
    icon: ListChecks,
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/20",
    bg: "bg-emerald-50",
  },
  {
    title: "Clause Analysis",
    desc: "Deep dive into IP, liability, and termination clauses instantly without manual searching.",
    icon: Zap,
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
    bg: "bg-violet-50",
  },
  {
    title: "Ask the Document",
    desc: "Chat with your document to find specific answers and citations using natural language.",
    icon: Bot,
    gradient: "from-brand-500 to-indigo-600",
    glow: "shadow-brand-500/20",
    bg: "bg-brand-50",
  }
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
              <span className="text-[9px] font-black text-brand-600 uppercase tracking-[0.3em] pl-0.5">Intelligence</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-12">
            <a href="#features" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-all uppercase tracking-widest">Features</a>
            <a href="#how-it-works" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-all uppercase tracking-widest">How it works</a>
            <Link to="/pricing" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-all uppercase tracking-widest">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-bold text-slate-600 hover:text-brand-600 px-4 py-2 transition-colors uppercase tracking-widest hidden sm:block">Sign In</Link>
            <Link to="/dashboard" className="btn-primary text-sm uppercase tracking-widest py-3 px-7 flex items-center gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-40 px-6 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-brand-400/8 rounded-full blur-[180px]" />
          <div className="absolute top-20 right-1/4 w-[700px] h-[700px] bg-indigo-400/8 rounded-full blur-[200px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-linear-to-r from-transparent via-brand-300/30 to-transparent" />
        </div>
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-linear-to-r from-brand-50 to-indigo-50 border border-brand-200/60 text-brand-700 text-[11px] font-bold rounded-full mb-10 uppercase tracking-[0.2em] shadow-sm shadow-brand-100">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              AI-Powered Document Intelligence
            </div>
            <h1 className="font-display text-6xl md:text-[5.5rem] font-bold tracking-tight text-slate-900 mb-10 leading-[0.92]">
              Understand any document <br />
              <span className="relative">
                <span className="text-gradient">before you sign.</span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
              Upload any PDF and instantly get a structured summary, key risks, obligations, and important clauses in plain English.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/dashboard" className="w-full sm:w-auto btn-primary px-12 py-5 text-lg flex items-center justify-center gap-3 group">
                Analyze a document
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>

            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-16">
              {['No credit card required', 'GDPR Compliant', 'Delete anytime'].map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust / Social Proof */}
      <section className="py-16 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-10">Trusted by professionals at</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-25 grayscale contrast-150">
            {['FORBES', 'TECHCRUNCH', 'WIRED', 'THE VERGE', 'FAST CO.'].map((brand) => (
              <span key={brand} className="text-xl md:text-2xl font-display font-black tracking-tighter">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-50/60 rounded-full blur-[200px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50/60 rounded-full blur-[200px]" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-[0.3em] mb-6 px-4 py-2 bg-brand-50 rounded-full border border-brand-100">
              <Sparkles className="w-3.5 h-3.5" />
              Capabilities
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-8 text-slate-900 tracking-tight leading-tight">
              Everything you need to review <br />
              <span className="text-gradient">with absolute confidence</span>
            </h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">Powerful AI tools designed for business-grade document analysis, simplified for everyone.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="relative group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 overflow-hidden"
              >
                {/* Card hover gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-transparent to-slate-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Top border glow on hover */}
                <div className={cn("absolute top-0 left-0 right-0 h-px bg-linear-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500", `${feature.gradient}`)} />
                
                <div className="relative z-10">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-7 bg-linear-to-br shadow-lg", feature.gradient, feature.glow)}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3 text-slate-900 tracking-tight group-hover:text-brand-700 transition-colors">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium text-[15px]">{feature.desc}</p>
                </div>

                {/* Bottom decorative dot */}
                <div className={cn("absolute bottom-6 right-6 w-20 h-20 rounded-full bg-linear-to-br opacity-5 group-hover:opacity-10 transition-opacity blur-sm", feature.gradient)} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-40 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[200px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-[0.3em] mb-10 px-4 py-2 bg-brand-500/10 rounded-full border border-brand-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Process
              </div>
              <h2 className="font-display text-5xl md:text-6xl font-bold mb-16 tracking-tight bg-linear-to-br from-white to-slate-400 text-transparent bg-clip-text">How DOCURA works</h2>
              <div className="space-y-14">
                {[
                  { step: "01", title: "Upload your document", desc: "Drag and drop any PDF. We support contracts, tenders, and business reports up to 20MB.", color: "from-brand-500 to-indigo-500" },
                  { step: "02", title: "AI Analysis", desc: "Our engine classifies the document and extracts key data points using advanced multi-step AI workflows.", color: "from-violet-500 to-purple-500" },
                  { step: "03", title: "Review & Chat", desc: "Get a structured report and ask specific questions to clarify any unclear sections instantly.", color: "from-emerald-500 to-teal-500" }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="flex gap-8 group"
                  >
                    <div className={cn("w-14 h-14 rounded-2xl bg-linear-to-br flex items-center justify-center shrink-0 shadow-lg font-display font-black text-xl text-white group-hover:scale-110 transition-transform", item.color)}>
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{item.title}</h3>
                      <p className="text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-slate-900 rounded-[3rem] p-6 shadow-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/10 blur-[60px]" />
                <div className="bg-slate-950 rounded-[2.5rem] p-8 space-y-6 border border-white/5 relative z-10">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-lg shadow-rose-500/30" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-lg shadow-amber-500/30" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-lg shadow-emerald-500/30" />
                    <div className="ml-auto text-xs font-bold text-slate-600 uppercase tracking-widest">DOCURA Analysis</div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-3/4 bg-white/5 rounded-full animate-pulse" />
                    <div className="h-4 w-1/2 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <div className="h-28 w-full bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center mt-4">
                      <div className="text-center">
                        <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-3" />
                        <div className="text-xs text-slate-600 font-bold uppercase tracking-widest">Analyzing...</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-4">
                    {[
                      { color: 'bg-rose-500', label: 'Risk Found', width: 'w-1/3' },
                      { color: 'bg-emerald-500', label: 'Compliant', width: 'w-1/2' },
                      { color: 'bg-brand-500', label: 'Deadline: 30 days', width: 'w-2/3' },
                    ].map((row, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className={cn("w-2 h-2 rounded-full shrink-0", row.color)} />
                        <div className={cn("h-4 bg-white/5 rounded-full", row.width)} />
                        <div className="ml-auto text-[10px] text-slate-600 font-bold uppercase tracking-widest shrink-0">{row.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-500/15 rounded-full blur-[100px] opacity-60" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-500/15 rounded-full blur-[100px] opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-40 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-[0.3em] mb-6 px-4 py-2 bg-brand-50 rounded-full border border-brand-100">
              <Sparkles className="w-3.5 h-3.5" />
              Support
            </div>
            <h2 className="font-display text-5xl font-bold text-slate-900 tracking-tight">Common Questions</h2>
          </div>
          <div className="space-y-5">
            {[
              { q: "Is this legal advice?", a: "No. DOCURA is an AI document assistant designed to help you understand documents faster. You should always consult with a qualified legal professional for legal decisions." },
              { q: "What file types do you support?", a: "We currently support PDF files up to 20MB in size. Our engine is optimized for text-heavy business documents including contracts, tenders, and corporate agreements." },
              { q: "How secure is my data?", a: "We take privacy seriously. Your documents are isolated and only accessible to you. You can delete them at any time, and we do not use your data to train our models." }
            ].map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-slate-50/60 hover:bg-white rounded-[2rem] p-8 border border-slate-100 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100/10 transition-all duration-500 cursor-default"
              >
                <h3 className="font-display font-bold text-xl mb-4 flex items-center justify-between text-slate-900 tracking-tight">
                  {faq.q}
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:bg-linear-to-br group-hover:from-brand-500 group-hover:to-indigo-600 group-hover:border-transparent group-hover:text-white transition-all shadow-sm shrink-0 ml-4">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </h3>
                <p className="text-slate-500 text-lg leading-relaxed font-medium">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 relative overflow-hidden bg-[#fafbff]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-brand-400/8 rounded-full blur-[180px]" />
          <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-indigo-400/8 rounded-full blur-[180px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-linear-to-br from-brand-600 via-brand-700 to-indigo-800 rounded-[3rem] p-16 shadow-2xl shadow-brand-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/20 rounded-full blur-[80px]" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 text-xs font-bold uppercase tracking-[0.2em] mb-8 border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                Start for free today
              </div>
              <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-white leading-[1.05] tracking-tight">Ready to review smarter?</h2>
              <p className="text-xl text-white/70 mb-12 font-medium max-w-xl mx-auto leading-relaxed">Join professionals using DOCURA to save time and reduce risk every day.</p>
              <Link to="/dashboard" className="inline-flex items-center gap-3 bg-white text-brand-700 font-bold px-10 py-5 rounded-2xl text-lg hover:bg-slate-50 transition-all shadow-xl shadow-brand-900/20 hover:-translate-y-0.5 group">
                Get started — it's free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-14">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 bg-linear-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200 group-hover:scale-105 transition-all">
                <FileSearch className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="font-display font-black text-xl tracking-tighter text-slate-900">DOCURA</span>
                <span className="text-[7px] font-black text-brand-600 uppercase tracking-[0.3em] pl-0.5">Intelligence</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-10 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              <Link to="/terms" className="hover:text-brand-600 transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-brand-600 transition-colors">Privacy</Link>
              <Link to="/disclaimer" className="hover:text-brand-600 transition-colors">Disclaimer</Link>
              <Link to="/pricing" className="hover:text-brand-600 transition-colors">Pricing</Link>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">© 2026 DOCURA AI. All rights reserved.</p>

          </div>
        </div>
      </footer>
    </div>
  );
}
