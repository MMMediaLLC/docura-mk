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
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-brand-50 border border-brand-100 text-brand-700 text-[10px] font-bold rounded-full mb-6 uppercase tracking-widest">
            <Scale className="w-3 h-3" />
            Кориснички договор
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-slate-900 mb-4">Услови за користење</h1>
          <p className="text-slate-500 font-medium">Последно ажурирано: 16 март, 2026</p>
        </header>

        <div className="space-y-12 text-slate-600 leading-relaxed font-medium">
          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">1. Вовед</h2>
            <p>
              Добредојдовте во DOCURA („ние“, „наши“ или „нас“). DOCURA е платформа за анализа на документи напојувана со вештачка интелигенција, дизајнирана да им помогне на корисниците да извлечат согледувања, резимеа и клучни податоци од различни документи, вклучително и договори, деловни договори и датотеки за набавка.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">2. Прифаќање на условите</h2>
            <p>
              Со пристапување или користење на платформата DOCURA („Услугата“), вие се согласувате да бидете обврзани со овие Услови за користење. Ако не се согласувате со овие услови, ве молиме не ја користете нашата Услуга.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">3. Опис на услугата</h2>
            <p>
              DOCURA обезбедува автоматизирана анализа на документи користејќи вештачка интелигенција. Услугата вклучува класификација на документи, генерирање на резимеа, истакнување на ризици и интерфејс за прашања и одговори. Вие потврдувате дека Услугата е автоматизирана алатка и не претставува правен, финансиски или професионален совет.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">4. Подобност</h2>
            <p>
              Мора да имате најмалку 18 години за да ја користите оваа Услуга. Со користење на DOCURA, вие изјавувате и гарантирате дека имате правен капацитет за склучување на обврзувачки договор.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">5. Одговорности на корисникот</h2>
            <p>
              Вие сте единствено одговорни за документите што ги прикачувате на платформата. Вие изјавувате дека ги имате потребните права и дозволи за процесирање на овие документи. DOCURA не е одговорна за содржината на која било датотека прикачена од корисникот.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">6. Прифатлива употреба</h2>
            <p>
              Вие се согласувате да не ја користите Услугата за какви било незаконски цели. Не смеете да прикачувате документи што содржат малициозен софтвер, вируси или која било содржина што ги крши правата на интелектуална сопственост на трети страни. Злоупотребата на системот, вклучително и обидите за заобиколување на безбедноста или лимитите, може да резултира со итен прекин.
            </p>
          </section>

          <section className="bg-brand-600 p-8 rounded-3xl text-white shadow-xl shadow-brand-100">
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-brand-200" />
              7. Резултати генерирани од ВИ
            </h2>
            <p className="font-bold text-brand-50 mb-4">
              ВАЖНО: DOCURA користи напредна вештачка интелигенција за анализа на документи. ВИ моделите можат повремено да произведат неточни, нецелосни или погрешни информации.
            </p>
            <p className="text-brand-100">
              Анализата обезбедена од DOCURA е само за информативни цели. Мора независно да го проверите секој резултат генерирани од ВИ со оригиналниот документ пред да донесете какви било одлуки или да преземете какви било дејствија.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">8. Претплати и плаќања</h2>
            <p>
              DOCURA нуди и бесплатни и платени планови за претплата. Платените планови обезбедуваат дополнителни функции и повисоки лимити за користење. Со претплата на платен план, вие се согласувате со условите за цени и наплата претставени во моментот на купување.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">9. Политика за рефундирање</h2>
            <p>
              Плаќањата за претплата генерално не се рефундираат, освен каде што тоа го бара важечкиот закон или по наша дискреција. Можете да ја откажете вашата претплата во секое време и ќе продолжите да имате пристап до Услугата до крајот на вашиот тековен период на наплата.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">10. Достапност на услугата</h2>
            <p>
              Иако се стремиме кон висока достапност, не гарантираме дека Услугата ќе биде без прекини или без грешки. Го задржуваме правото да ја измениме или прекинеме Услугата во секое време без претходна најава.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">11. Интелектуална сопственост</h2>
            <p>
              Софтверот, брендот и платформата DOCURA се ексклузивна сопственост на DOCURA AI. Ви се доделува ограничена, неексклузивна лиценца за користење на Услугата за нејзината намена. Вие ја задржувате сопственоста на документите што ги прикачувате.
            </p>
          </section>

          <section className="bg-rose-50 p-8 rounded-3xl border border-rose-100 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-rose-900 mb-4">12. Ограничување на одговорноста</h2>
            <p className="uppercase font-bold text-[10px] tracking-[0.2em] text-rose-400 mb-3">Правно одрекување</p>
            <p className="text-rose-700 font-bold">
              DOCURA СЕ ОБЕЗБЕДУВА „КАКО ШТО Е“ И „КАКО ШТО Е ДОСТАПНО“ БЕЗ ГАРАНЦИИ ОД КАКОВ БИЛО ВИД. НИЕ НЕ СМЕ ОДГОВОРНИ ЗА КАКВА БИЛО ИНДИРЕКТНА, ИНЦИДЕНТНА ИЛИ ПОСЛЕДОВАТЕЛНА ШТЕТА КОЈА ПРОИЗЛЕГУВА ОД ВАШЕТО КОРИСТЕЊЕ НА УСЛУГАТА ИЛИ ПОТПИРАЊЕТО НА РЕЗУЛТАТИТЕ ГЕНЕРИРАНИ ОД ВИ. DOCURA НЕ Е АДВОКАТСКА КАНЦЕЛАРИЈА И НЕ ДАВА ПРАВНИ СОВЕТИ.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">13. Прекин на услугата</h2>
            <p>
              Го задржуваме правото да ја суспендираме или прекинеме вашата сметка по наша дискреција, без претходна најава, за однесување за кое веруваме дека ги крши овие Услови или е штетно за другите корисници или за Услугата.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">14. Измени на условите</h2>
            <p>
              Можеме да ги ажурираме овие Услови одвреме-навреме. Ќе ве известиме за сите значајни измени со објавување на новите Услови на оваа страница и ажурирање на датумот „Последно ажурирано“.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">15. Важечко право</h2>
            <p>
              Овие Услови ќе се управуваат и толкуваат во согласност со законите на јурисдикцијата во која работи DOCURA, без оглед на неговите одредби за судир на закони.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
