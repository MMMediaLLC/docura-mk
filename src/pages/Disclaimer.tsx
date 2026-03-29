import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, AlertTriangle, ShieldAlert, Scale } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 selection:bg-brand-100 selection:text-brand-900">
      {/* Soft Header */}
      <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg group-hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </div>
            <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">Назад кон почетната</span>
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
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold rounded-full mb-6 uppercase tracking-widest">
            <AlertTriangle className="w-3 h-3" />
            Важна напомена
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-slate-900 mb-4">Правно одрекување</h1>
          <p className="text-slate-500 font-medium">Последно ажурирано: 16 март, 2026</p>
        </header>

        <div className="space-y-12 text-slate-600 leading-relaxed font-medium">
          <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-10 space-y-4 shadow-sm">
            <div className="flex items-center gap-4 text-amber-800">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Scale className="w-6 h-6" />
              </div>
              <h2 className="font-display text-2xl font-bold">Не е правен совет</h2>
            </div>
            <p className="text-amber-900/80 font-bold text-lg leading-relaxed">
              DOCURA не е адвокатска канцеларија и не дава правни совети. Информациите и анализите обезбедени од нашата платформа се само за информативни и едукативни цели.
            </p>
          </div>

          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">Предупредување за точноста на ВИ</h3>
              <p className="text-sm leading-relaxed">
                Анализата генерирана од DOCURA е произведена од вештачка интелигенција. Иако се стремиме кон точност, ВИ моделите можат да направат грешки, да превидат критични детали или погрешно да го интерпретираат сложениот правен јазик. Никогаш не треба да се потпирате исклучиво на резултатите генерирани од ВИ за правни или бизнис одлуки.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">Нема однос адвокат-клиент</h3>
              <p className="text-sm leading-relaxed">
                Вашето користење на DOCURA не создава однос адвокат-клиент помеѓу вас и DOCURA AI. Ниту една информација обезбедена преку Услугата не е заштитена со адвокатска тајна или доктрина за работни производи.
              </p>
            </div>
          </section>

          <section className="bg-white p-10 rounded-[2rem] border border-slate-200/60 shadow-sm space-y-6">
            <h2 className="font-display text-2xl font-bold text-slate-900">Независна проверка</h2>
            <p>
              Корисниците мора независно да ги проверат сите информации извлечени или сумирани од DOCURA пред да се потпрат на нив. Вие сте одговорни за прегледување на оригиналниот документ во целост. DOCURA не гарантира за точноста, комплетноста или корисноста на која било обезбедена анализа.
            </p>
            <p className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 italic">
              Силно препорачуваме да се консултирате со квалификуван правен професионалец или експерт пред да донесете какви било правни одлуки, потпишување договори или преземање акции врз основа на анализата обезбедена од оваа платформа.
            </p>
          </section>

          <section className="bg-rose-50 p-10 rounded-[2rem] border border-rose-100 shadow-sm space-y-6">
            <h2 className="font-display text-2xl font-bold text-rose-900">Ограничување на гаранцијата</h2>
            <p className="text-rose-700 font-bold">
              DOCURA СЕ ОДРЕКУВА ОД СИТЕ ГАРАНЦИИ, ИЗРИЧНИ ИЛИ ИМПЛИЦИРАНИ, ВКЛУЧИТЕЛНО, НО НЕ ОГРАНИЧУВАЈЌИ СЕ НА ГАРАНЦИИ ЗА ПРОДАЖБА ИЛИ ПОДОБНОСТ ЗА ОДРЕДЕНА НАМЕНА. НИЕ НЕ СМЕ ОДГОВОРНИ ЗА КАКВА БИЛО ЗАГУБА ИЛИ ШТЕТА КОЈА ПРОИЗЛЕГУВА ОД КОРИСТЕЊЕТО НА НАШАТА УСЛУГА ИЛИ ПОТПИРАЊЕТО НА ИНФОРМАЦИИТЕ ОБЕЗБЕДЕНИ ТАМУ.
            </p>
          </section>

          <div className="pt-12 text-center">
            <Link to="/dashboard" className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 shadow-lg transition-all active:scale-95">
              Врати се на контролната табла
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
