import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Sparkles, Scale } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 selection:bg-brand-100 selection:text-brand-900">
      {/* Soft Header */}
      <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg group-hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </div>
            <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-sm shadow-brand-200">
              <FileText className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">DOCURA</span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-20">
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-brand-50 border border-brand-100 text-brand-700 text-[10px] font-bold rounded-full mb-6 uppercase tracking-widest">
            <Scale className="w-3 h-3" />
            User Agreement
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-slate-500 font-medium">Last Updated: March 16, 2026</p>
        </header>

        <div className="space-y-12 text-slate-600 leading-relaxed font-medium">
          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
            <p>
              Welcome to DOCURA ("we," "our," or "us"). DOCURA is an AI-powered document analysis platform designed to help users extract insights, summaries, and key data points from various documents, including contracts, business agreements, and procurement files.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">2. Acceptance of Terms</h2>
            <p>
              By accessing or using the DOCURA platform (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">3. Description of Service</h2>
            <p>
              DOCURA provides automated document analysis using artificial intelligence. The Service includes document classification, summary generation, risk highlighting, and a question-and-answer interface. You acknowledge that the Service is an automated tool and does not constitute legal, financial, or professional advice.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">4. Eligibility</h2>
            <p>
              You must be at least 18 years of age to use this Service. By using DOCURA, you represent and warrant that you have the legal capacity to enter into a binding agreement.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">5. User Responsibilities</h2>
            <p>
              You are solely responsible for the documents you upload to the platform. You represent that you have the necessary rights and permissions to process these documents. DOCURA is not responsible for the content of any user-uploaded files.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">6. Acceptable Use</h2>
            <p>
              You agree not to use the Service for any illegal purposes. You may not upload documents that contain malware, viruses, or any content that violates third-party intellectual property rights. Misuse of the system, including attempts to circumvent security or rate limits, may result in immediate termination.
            </p>
          </section>

          <section className="bg-brand-600 p-8 rounded-3xl text-white shadow-xl shadow-brand-100">
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-brand-200" />
              7. AI Generated Output
            </h2>
            <p className="font-bold text-brand-50 mb-4">
              IMPORTANT: DOCURA uses advanced artificial intelligence to analyze documents. AI models can occasionally produce inaccurate, incomplete, or misleading information.
            </p>
            <p className="text-brand-100">
              The analysis provided by DOCURA is for informational purposes only. You must independently verify all AI-generated output against the original document before making any decisions or taking any actions.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">8. Subscriptions and Payments</h2>
            <p>
              DOCURA offers both free and paid subscription plans. Paid plans provide additional features and higher usage limits. By subscribing to a paid plan, you agree to the pricing and billing terms presented at the time of purchase.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">9. Refund Policy</h2>
            <p>
              Subscription payments are generally non-refundable except where required by applicable law or at our sole discretion. You may cancel your subscription at any time, and you will continue to have access to the Service until the end of your current billing period.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">10. Service Availability</h2>
            <p>
              While we strive for high availability, we do not guarantee that the Service will be uninterrupted or error-free. We reserve the right to modify or discontinue the Service at any time without notice.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">11. Intellectual Property</h2>
            <p>
              The DOCURA software, brand, and platform are the exclusive property of DOCURA AI. You are granted a limited, non-exclusive license to use the Service for its intended purpose. You retain ownership of the documents you upload.
            </p>
          </section>

          <section className="bg-rose-50 p-8 rounded-3xl border border-rose-100 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-rose-900 mb-4">12. Limitation of Liability</h2>
            <p className="uppercase font-bold text-[10px] tracking-[0.2em] text-rose-400 mb-3">Legal Disclaimer</p>
            <p className="text-rose-700 font-bold">
              DOCURA IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. WE ARE NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE OR RELIANCE ON AI-GENERATED OUTPUT. DOCURA IS NOT A LAW FIRM AND DOES NOT PROVIDE LEGAL ADVICE.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">13. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or the Service.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">14. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of any significant changes by posting the new Terms on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">15. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which DOCURA operates, without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
