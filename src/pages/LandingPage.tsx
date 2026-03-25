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
  Check,
  Lock,
  Briefcase,
  FileText,
  Scale
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { PLANS } from '../config/plans';

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
            <a href="#how-it-works" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-all uppercase tracking-widest">How it works</a>
            <a href="#use-cases" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-all uppercase tracking-widest">Use Cases</a>
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
      <section className="relative pt-48 pb-20 px-6 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-brand-400/8 rounded-full blur-[180px]" />
          <div className="absolute top-20 right-1/4 w-[700px] h-[700px] bg-indigo-400/8 rounded-full blur-[200px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-linear-to-r from-transparent via-brand-300/30 to-transparent" />
        </div>
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-linear-to-r from-brand-50 to-indigo-50 border border-brand-200/60 text-brand-700 text-[11px] font-bold rounded-full mb-8 uppercase tracking-[0.2em] shadow-sm shadow-brand-100">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              AI Documents Intelligence
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.05]">
              Protect Your Position Before <span className="text-gradient">Signing.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Instantly identify risks, obligations, deadlines, and critical clauses in contracts, tenders, and business documents. Private by design, secure by default.
            </p>
            <div className="flex justify-center">
              <Link to="/dashboard" className="btn-primary px-10 py-5 text-lg flex items-center justify-center gap-3 group shadow-xl shadow-brand-500/30">
                Analyze Your First Document Free
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="pb-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-10 text-slate-400 font-bold text-xs uppercase tracking-[0.1em] border-y border-slate-200/60 py-8 bg-white/50 backdrop-blur-md rounded-[2.5rem]">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              256-Bit Encryption
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Your Documents Are Never Used for Training
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              Delete Your Files Anytime
            </div>
          </div>
        </div>
      </section>

      {/* Output Preview */}
      <section className="py-20 px-6 relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/10 blur-[200px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-linear-to-br from-white to-slate-400 text-transparent bg-clip-text">See What DOCURA Finds in Seconds.</h2>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">Get a structured report covering summary, key points, risks, obligations, deadlines, and critical clauses — in seconds.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 rounded-[2.5rem] p-4 lg:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
            {/* Mock Dashboard UI */}
            <div className="bg-slate-950 rounded-[1.5rem] border border-white/10 overflow-hidden">
              <div className="flex items-center gap-3 bg-slate-900/50 px-6 py-4 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="ml-4 font-bold text-xs text-slate-400 uppercase tracking-widest">Master Services Agreement.pdf</div>
              </div>
              
              <div className="p-6 md:p-10 space-y-8">
                {/* Score Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-2">High Risk Identified</h3>
                    <p className="text-slate-400 text-sm font-medium">Our AI found 3 critical liabilities in this agreement.</p>
                  </div>
                  <div className="w-20 h-20 rounded-full border-4 border-rose-500/30 border-t-rose-500 flex items-center justify-center">
                    <span className="text-xl font-black text-rose-500">82%</span>
                  </div>
                </div>

                {/* Clauses */}
                <div className="space-y-4">
                  <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4 text-rose-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Limitation of Liability</h4>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                          <span className="text-rose-400 bg-rose-400/10 px-1 py-0.5 rounded">"The vendor's liability is capped at $500, regardless of actual damages incurred."</span><br/><br/>
                          This clause severely limits your recourse in case of vendor failure.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Termination Notice</h4>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                          Either party may terminate with <span className="text-white px-1 py-0.5 bg-white/10 rounded">30 days written notice</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-32 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">How it works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { title: "1. Upload", desc: "Drag and drop any PDF or Word document (.docx). We support up to 20MB.", icon: FileText, color: "text-brand-600", bg: "bg-brand-50" },
              { title: "2. AI Analysis", desc: "Advanced AI scans your document for risks, deadlines, obligations, and non-standard clauses.", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
              { title: "3. Review & Ask", desc: "Review the structured report or ask follow-up questions about specific clauses, obligations, or risks.", icon: Bot, color: "text-emerald-600", bg: "bg-emerald-50" }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-lg mb-8", step.bg)}>
                  <step.icon className={cn("w-8 h-8", step.color)} />
                </div>
                <h3 className="font-display font-bold text-2xl mb-4 text-slate-900">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-32 px-6 bg-[#fafbff]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">Built for Teams That Review Important Documents</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { role: "For Legal Teams", needs: "NDAs, Employment Contracts, Vendor Agreements", icon: Scale, desc: "Speed up first-pass review by surfacing critical, unusual, and high-risk clauses in seconds." },
              { role: "For Agencies & Freelancers", needs: "Master Service Agreements, SOWs", icon: Briefcase, desc: "Spot unfavorable payment terms, unclear scope, and risky revision language before you commit." },
              { role: "For Operations", needs: "Leases, Compliance Documents, Financial Reports", icon: ListChecks, desc: "Turn dates, renewal periods, and compliance obligations into clear next steps without reading every page manually." }
            ].map((useCase, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-500">
                <useCase.icon className="w-10 h-10 text-brand-600 mb-6" />
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-3">{useCase.role}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 pb-6 border-b border-slate-100">{useCase.needs}</p>
                <p className="text-slate-500 font-medium leading-relaxed">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified Pricing */}
      <section className="py-32 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Start free. Upgrade when you need more analyses, history, and flexibility.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { plan: "Free", price: "$0", docs: "1 Lifetime Document Analysis", cta: "Try Now", link: "/auth" },
              { plan: "Pro", price: "$6", period: "/mo", docs: "2 Document Analyses / month", cta: "Upgrade to Pro", link: "/pricing", popular: true },
              { plan: "Business", price: "$19", period: "/mo", docs: "15 Document Analyses / month", cta: "Get Business", link: "/pricing" }
            ].map((p, i) => (
              <div key={i} className={cn("rounded-[2rem] p-8 flex flex-col items-center text-center border transition-all", p.popular ? "bg-slate-900 text-white shadow-2xl shadow-brand-900/20 border-slate-800 scale-105" : "bg-white text-slate-900 border-slate-200")}>
                {p.popular && <span className="bg-brand-600 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full mb-6 relative -top-3">Most Popular</span>}
                <h3 className="font-display text-xl font-bold mb-2">{p.plan}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black">{p.price}</span>
                  {p.period && <span className={cn("text-xs font-bold uppercase", p.popular ? "text-slate-400" : "text-slate-500")}>{p.period}</span>}
                </div>
                <p className={cn("text-sm font-bold mb-8 flex-1", p.popular ? "text-brand-300" : "text-slate-500")}>{p.docs}</p>
                <Link to={p.link} className={cn("w-full py-4 rounded-xl font-bold transition-colors", p.popular ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 bg-[#fafbff]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Is this legal advice?", a: "No. DOCURA provides AI-assisted document analysis, not legal advice. Important legal decisions should always be reviewed by a qualified legal professional." },
              { q: "What file types are supported?", a: "DOCURA accepts PDF files and Word documents (.docx). Both formats are fully supported for contracts, tenders, agreements, and general business documents." },
              { q: "Do you train AI on my documents?", a: "Never. Your files are processed only to generate your report and are never used to train DOCURA or third-party AI models." },
              { q: "What languages are supported?", a: "Our AI engine comprehends documents in English, Spanish, French, German, and many more, though English yields the highest accuracy for complex legal jargon." },
              { q: "How do I delete my data?", a: "You have full control. You can delete your documents and entire account permanently from the Settings page at any time." }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-slate-900">{faq.q}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Statement & Final CTA */}
      <section className="py-32 px-6 bg-slate-950 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-8" />
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 tracking-tight">Review Complex Contracts Faster and With More Clarity.</h2>
          <p className="text-xl text-slate-400 font-medium mb-12">Join professionals using DOCURA to save time and reduce risk every day.</p>
          <Link to="/auth" className="inline-flex items-center gap-3 bg-brand-600 text-white font-bold px-10 py-5 rounded-2xl text-lg hover:bg-brand-500 transition-all shadow-xl shadow-brand-900/50">
            Try DOCURA for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-12">Private by Design • AES-256 Encryption • User-Controlled Deletion</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 bg-slate-950 text-slate-400 text-sm font-bold uppercase tracking-widest text-center">
         <div className="flex flex-wrap justify-center gap-8 mb-6">
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
         </div>
         <p>© 2026 DOCURA AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
