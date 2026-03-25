import { 
  Check, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Gem
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { PLANS, getCheckoutUrl } from '../config/plans';

export default function PricingPage() {
  const plans = [
    {
      id: "free",
      name: PLANS.free.name,
      price: PLANS.free.price,
      desc: "Experience core document intelligence and risk detection.",
      icon: Sparkles,
      iconGradient: "from-blue-400 to-indigo-500",
      features: [
        "1 complete document review",
        "Risk & liability extraction",
        "Key clause identification",
      ],
      cta: "Current Plan",
      current: true
    },
    {
      id: "pro",
      name: PLANS.pro.name,
      price: PLANS.pro.price,
      period: PLANS.pro.period,
      desc: "For professionals requiring deep document visibility.",
      icon: ShieldCheck, 
      iconGradient: "from-slate-600 to-slate-800",
      features: [
        "2 document analyses / month",
        "Comprehensive risk detection",
        "Automated obligation tracking",
        "Critical deadline extraction",
        "History",
        "PDF export",
      ],
      cta: "Upgrade to Pro",
      highlight: true,
      lemonSqueezyUrl: getCheckoutUrl("pro")
    },
    {
      id: "business",
      name: PLANS.business.name,
      price: PLANS.business.price,
      period: PLANS.business.period,
      desc: "Advanced processing power and expanded capacity for teams.",
      icon: Gem,
      iconGradient: "from-fuchsia-500 to-purple-700",
      features: [
        "15 document analyses / month",
        "Everything in Pro",
        "Priority processing speed",
        "Advanced data extraction",
        "Export professional reports",
        "Dedicated support",
      ],
      cta: "Start Business",
      lemonSqueezyUrl: getCheckoutUrl("business")
    }
  ];

  const handlePlanAction = (plan: any) => {
    if (plan.id === 'free' || plan.current) return;
    
    // Redirect to Lemon Squeezy checkout
    if (plan.lemonSqueezyUrl) {
      window.open(plan.lemonSqueezyUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-4 px-4 font-sans selection:bg-brand-100 selection:text-brand-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-40 left-1/4 w-[500px] h-[500px] bg-slate-200/20 rounded-full blur-[200px]" />
        <div className="absolute bottom-40 right-1/4 w-[500px] h-[500px] bg-slate-200/20 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto pt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-100 text-brand-700 text-[10px] font-bold rounded-full mb-6 uppercase tracking-[0.25em] shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Pricing Plans
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
            Professional Document <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-600 to-indigo-500">Intelligence</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium leading-relaxed">Transparent pricing for structured document analysis, risk detection, and obligation tracking.</p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "relative rounded-[2.5rem] border flex flex-col h-full transition-all duration-500 group overflow-hidden",
                plan.highlight 
                  ? "bg-linear-to-b from-brand-700 to-brand-900 text-white border-brand-600/50 shadow-2xl shadow-brand-900/30 md:scale-105 md:z-10" 
                  : "bg-white text-slate-900 border-slate-200/60 hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-100/30 shadow-sm"
              )}
            >
              {/* Top glow for highlighted plan */}
              {plan.highlight && (
                <>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-400/20 blur-[80px] rounded-full pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 blur-[80px] rounded-full pointer-events-none" />
                </>
              )}

              {plan.highlight && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white border border-white/30 text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-brand-900/30 whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="p-9 relative z-10 flex flex-col h-full">
                {/* Plan header */}
                <div className="mb-8 mt-4">
                  <h3 className={cn("font-display text-2xl font-bold mb-2 tracking-tight", plan.highlight ? "text-white" : "text-slate-900")}>{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className={cn("text-5xl font-black tracking-tighter", plan.highlight ? "text-white" : "text-slate-900")}>{plan.price}</span>
                    {plan.period && <span className={cn("text-sm font-bold uppercase tracking-widest ml-1", plan.highlight ? "text-slate-400" : "text-slate-400")}>{plan.period}</span>}
                  </div>
                  <p className={cn("text-sm font-medium leading-relaxed", plan.highlight ? "text-brand-200" : "text-slate-500")}>{plan.desc}</p>
                </div>

                {/* Divider */}
                <div className={cn("h-px w-full mb-8", plan.highlight ? "bg-white/20" : "bg-slate-100")} />

                {/* Features */}
                <div className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm font-medium">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                        plan.highlight ? "bg-white/20 text-white shadow-inner border border-white/10" : "bg-emerald-100 text-emerald-600"
                      )}>
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <span className={cn(plan.highlight ? "text-brand-50" : "text-slate-600")}>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanAction(plan)}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 active:scale-[0.98]",
                    plan.current
                      ? "bg-slate-100 text-slate-400 cursor-default"
                      : plan.highlight
                        ? "bg-white text-brand-800 hover:bg-brand-50 shadow-xl shadow-brand-900/20 hover:shadow-brand-900/30"
                        : "bg-linear-to-br from-brand-600 to-brand-700 text-white hover:from-brand-500 hover:to-brand-600 shadow-lg shadow-brand-200"
                  )}
                >
                  {plan.cta}
                  {!plan.current && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2.5rem] p-12 text-center border border-slate-200 bg-white shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100/50 blur-[100px] rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100/50 blur-[100px] rounded-full -ml-32 -mb-32 transition-transform duration-700 group-hover:scale-110 pointer-events-none" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] shadow-lg shadow-slate-900/10 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-display text-3xl font-bold text-slate-900 mb-3 tracking-tight">Enterprise & custom workflows</h3>
            <p className="text-slate-500 text-lg font-medium mb-8 max-w-xl mx-auto leading-relaxed">Dedicated environments, custom legal playbooks, API access, and tailored reporting for scaling teams.</p>
            <button className="inline-flex items-center gap-2 bg-brand-600 text-white font-bold px-8 py-4 rounded-2xl text-sm uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 hover:-translate-y-0.5 group/btn">
              Talk to our team
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
