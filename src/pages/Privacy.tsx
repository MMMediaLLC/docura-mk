import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react';

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
            <ShieldCheck className="w-3 h-3" />
            Приватност и безбедност
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-slate-900 mb-4">Политика за приватност</h1>
          <p className="text-slate-500 font-medium">Последно ажурирано: 16 март, 2026</p>
        </header>

        <div className="space-y-12 text-slate-600 leading-relaxed font-medium">
          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">1. Вовед</h2>
            <p>
              Во DOCURA, ние сме посветени на заштитата на вашата приватност. Оваа Политика за приватност објаснува како ги собираме, користиме, откриваме и ги штитиме вашите информации кога ја користите нашата платформа за анализа на документи напојувана со вештачка интелигенција.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">2. Информации кои ги собираме</h2>
            <p className="mb-4">Собираме неколку типови на информации од и за корисниците на нашата Услуга, вклучително:</p>
            <ul className="space-y-3">
              {[
                { label: "Информации за сметката", desc: "Име, е-пошта и креденцијали за автентикација." },
                { label: "Прикачени документи", desc: "Содржината на документите што ги прикачувате за анализа." },
                { label: "Податоци за употреба", desc: "Информации за тоа како ја користите Услугата, вклучително и пристапените функции." },
                { label: "Логови", desc: "Технички податоци како IP адреси, типови на прелистувачи и системски активности." }
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
              3. Процесирање на документи
            </h2>
            <p className="text-brand-50 font-bold mb-4">
              Кога прикачувате документ, тој се процесира од нашите автоматизирани системи и модели на вештачка интелигенција.
            </p>
            <p className="text-brand-100">
              Ова процесирање е неопходно за да се обезбеди анализата, резимеата и согледувањата што ги барате. Вашите документи се користат исклучиво за целта на обезбедување на Услугата за вас.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">4. Употреба на податоци</h2>
            <p className="mb-4">Ги користиме информациите што ги собираме за да:</p>
            <ul className="space-y-3">
              {[
                "Обезбедување, одржување и подобрување на Услугата",
                "Процесирање на вашите документи и генерирање на согледувања со ВИ",
                "Комуникација со вас за вашата сметка или ажурирања на Услугата",
                "Следење и анализа на трендовите на користење за подобрување на корисничкото искуство",
                "Заштита на безбедноста и интегритетот на нашата платформа"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-brand-400 rounded-full mt-2 shrink-0" />
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">5. Складирање на документи</h2>
            <p>
              Прикачените документи се складираат безбедно на нашите сервери. Имате опција да ги избришете вашите документи и нивните поврзани анализи во секое време преку контролната табла. Откако ќе се избришат, податоците се отстрануваат од нашите активни бази на податоци.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">6. Услуги од трети страни</h2>
            <p>
              Можеме да користиме даватели на услуги од трети страни за да ја олесниме нашата Услуга, како што се даватели на хостинг во облак (на пр., Google Cloud) и даватели на модели на ВИ. Овие трети страни можат да ги процесираат вашите податоци само за да извршуваат задачи во наше име и се обврзани да не ги откриваат или користат за која било друга цел.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">7. Безбедност на податоци</h2>
            <p>
              Спроведуваме разумни административни, технички и физички безбедносни мерки дизајнирани да ги заштитат вашите информации од неовластен пристап, откривање или уништување. Сепак, ниту еден метод на пренос преку интернет не е 100% безбеден и не можеме да гарантираме апсолутна безбедност.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">8. Кориснички права</h2>
            <p>
              Во зависност од вашата локација, може да имате права во врска со вашите лични податоци, вклучително и право на пристап, исправка или бришење на вашите информации. Можете да управувате со вашите податоци директно преку поставките на вашата сметка или со контактирање на нашиот тим за поддршка.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">9. Задржување на податоци</h2>
            <p>
              Ние ги задржуваме вашите информации онолку долго колку што е вашата сметка активна или колку што е потребно за обезбедување на Услугата. Исто така, ќе ги задржиме и користиме вашите информации колку што е потребно за да ги исполниме нашите законски обврски, да разрешиме спорови и да ги спроведеме нашите договори.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">10. Колачиња и аналитика</h2>
            <p>
              Користиме колачиња и слични технологии за следење за да ја следиме активноста на нашата Услуга и да чуваме одредени информации. Можеме да користиме алатки за аналитика од трети страни за да ни помогнат да разбереме како корисниците комуницираат со платформата.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">11. Ажурирања на Политиката за приватност</h2>
            <p>
              Можеме да ја ажурираме нашата Политика за приватност одвреме-навреме. Ќе ве известиме за сите промени со објавување на новата Политика за приватност на оваа страница и ажурирање на датумот „Последно ажурирано“ на врвот на оваа политика.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
