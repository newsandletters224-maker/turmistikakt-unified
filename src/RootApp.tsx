import { useState } from 'react';
import AdultsForm from './forms/adults/App';
import KidsHomeForm from './forms/kidsHome/App';
import KidsDayForm from './forms/kidsDay/App';
import PsychoneuroForm from './forms/psychoneuro/App';

type FormKey = 'menu' | 'adults' | 'kidsHome' | 'kidsDay' | 'psychoneuro';

interface MenuItem {
  key: FormKey;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    key: 'adults',
    title: 'Қарттардың үй бөлімшесіне арналған акт',
    subtitle: 'Ересектерге арналған үйде қызмет көрсету актісі',
    description: 'Тұрғын үй және материалдық-тұрмыстық жағдайларды зерттеу актісі — үйде әлеуметтік қызмет көрсету үшін.',
    icon: '🏠',
  },
  {
    key: 'kidsHome',
    title: 'Балалардың үй бөлімшесіне арналған акт',
    subtitle: 'Мүгедектігі бар балаларға үйде қызмет көрсету актісі',
    description: 'Мүгедектігі бар балаларға үйде арнаулы әлеуметтік қызметтер көрсету үшін тексеру актісі.',
    icon: '🧒',
  },
  {
    key: 'kidsDay',
    title: 'Күндіз болу орталықтарына арналған акт',
    subtitle: 'Жартылай стационар (күндізгі орталық) актісі',
    description: 'Мүгедектігі бар балаларды жартылай стационарлық типтегі күндізгі болу орталығына қабылдау үшін тексеру актісі.',
    icon: '🏫',
  },
  {
    key: 'psychoneuro',
    title: 'Психоневрология бөлімшесіне акт',
    subtitle: '18 жастан асқан, І/ІІ топ мүгедектігі бар адамдарға арналған акт',
    description: 'Психоневрологиялық ауытқулары бар 18 жастан асқан адамдарға және І, ІІ топтағы мүгедектігі бар адамдарға арнаулы әлеуметтік қызметтер көрсету үшін тексеру актісі.',
    icon: '🩺',
  },
];

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-3 left-3 z-50 flex items-center gap-1.5 rounded-lg bg-white/95 backdrop-blur border border-gray-200 shadow-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors print:hidden"
    >
      <span aria-hidden="true">←</span> Басты бетке
    </button>
  );
}

function HomeMenu({ onSelect }: { onSelect: (key: FormKey) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Тұрғын үй жағдайын тексеру актілері
          </h1>
          <p className="mt-2 text-slate-500 text-sm sm:text-base">
            Қажетті акт түрін таңдаңыз
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className="text-left bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all p-6 flex flex-col gap-3 group"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-slate-300 group-hover:text-blue-500 transition-colors text-xl">→</span>
              </div>
              <div>
                <h2 className="font-semibold text-slate-800 text-base leading-snug">
                  {item.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">{item.subtitle}</p>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                {item.description}
              </p>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-10">
          Барлық деректер тек сіздің браузеріңізде өңделеді. Ешқандай серверге жіберілмейді және сақталмайды.
        </p>
      </div>
    </div>
  );
}

export default function RootApp() {
  const [active, setActive] = useState<FormKey>('menu');

  if (active === 'menu') {
    return <HomeMenu onSelect={setActive} />;
  }

  const goHome = () => setActive('menu');

  return (
    <>
      <BackButton onClick={goHome} />
      {active === 'adults' && <AdultsForm />}
      {active === 'kidsHome' && <KidsHomeForm />}
      {active === 'kidsDay' && <KidsDayForm />}
      {active === 'psychoneuro' && <PsychoneuroForm />}
    </>
  );
}
