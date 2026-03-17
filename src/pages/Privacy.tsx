import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Sparkles, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
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
            <ShieldCheck className="w-3 h-3" />
            Privacy & Security
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-500 font-medium">Last Updated: March 16, 2026</p>
        </header>

        <div className="space-y-12 text-slate-600 leading-relaxed font-medium">
          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
            <p>
              At DOCURA, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered document analysis platform.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
            <p className="mb-4">We collect several types of information from and about users of our Service, including:</p>
            <ul className="space-y-3">
              {[
                { label: "Account Information", desc: "Name, email address, and authentication credentials." },
                { label: "Uploaded Documents", desc: "The content of the documents you upload for analysis." },
                { label: "Usage Data", desc: "Information about how you use the Service, including features accessed." },
                { label: "Logs", desc: "Technical data such as IP addresses, browser types, and system activity." }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-brand-400 rounded-full mt-2 shrink-0" />
                  <p><span className="font-bold text-slate-900">{item.label}:</span> {item.desc}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-brand-600 p-8 rounded-3xl text-white shadow-xl shadow-brand-100">
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-brand-200" />
              3. Document Processing
            </h2>
            <p className="text-brand-50 font-bold mb-4">
              When you upload a document, it is processed by our automated systems and artificial intelligence models.
            </p>
            <p className="text-brand-100">
              This processing is necessary to provide the analysis, summaries, and insights you request. Your documents are used solely for the purpose of providing the Service to you.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">4. Use of Data</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="space-y-3">
              {[
                "Provide, maintain, and improve the Service",
                "Process your documents and generate AI insights",
                "Communicate with you about your account or Service updates",
                "Monitor and analyze usage trends to enhance user experience",
                "Protect the security and integrity of our platform"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-brand-400 rounded-full mt-2 shrink-0" />
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">5. Document Storage</h2>
            <p>
              Uploaded documents are stored securely on our servers. You have the option to delete your documents and their associated analysis at any time through the Dashboard. Once deleted, the data is removed from our active databases.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">6. Third Party Services</h2>
            <p>
              We may use third-party service providers to facilitate our Service, such as cloud hosting providers (e.g., Google Cloud) and AI model providers. These third parties may process your data only to perform tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">7. Data Security</h2>
            <p>
              We implement reasonable administrative, technical, and physical security measures designed to protect your information from unauthorized access, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">8. User Rights</h2>
            <p>
              Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or delete your information. You can manage your data directly through your account settings or by contacting our support team.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">9. Data Retention</h2>
            <p>
              We retain your information for as long as your account is active or as needed to provide the Service. We will also retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">10. Cookies and Analytics</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our Service and hold certain information. We may use third-party analytics tools to help us understand how users interact with the platform.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">11. Updates to Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this policy.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
