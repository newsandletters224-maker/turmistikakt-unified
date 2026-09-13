import { useState } from 'react';
import { generateDocument, FormData } from './generateDocument';

const initialFormData: FormData = {
  actNumber: '',
  actDate: '',
  childFullName: '',
  childBirthDate: '',
  childIIN: '',
  disabilityCategory: '',
  address: '',
  phone: '',
  benefits: '',
  motherFullName: '',
  motherWork: '',
  fatherFullName: '',
  fatherWork: '',
  guardian: '',
  familyMembers: '',
  familyStatus: '',
  familyStatusOther: '',
  housingType: '',
  floor: '',
  hasElevator: '',
  heating: '',
  waterSupply: '',
  sanitation: '',
  sanitaryCondition: '',
  childSleepPlace: '',
  accessibleEnvironment: '',
  childSafety: '',
  diagnosis: '',
  mobility: '',
  selfCare: '',
  pmpkNumber: '',
  pmpkDate: '',
  ipraNumber: '',
  ipraPeriod: '',
  services: {
    socialDomestic: false,
    socialMedical: false,
    socialPedagogical: false,
    socialPsychological: false,
    parentTraining: false,
    socialLegal: false,
  },
  conclusionResult: 'mukhaj',
  specialistPosition: '',
  specialistFullName: '',
  parentFullName: '',
  signatureDate: '',
};

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6 border-b-2 border-blue-200 pb-3">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-gray-400 mt-1">{children}</p>;
}

function RadioGroup({ name, options, value, onChange }: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function SelectField({ label, value, onChange, options, hint }: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      >
        <option value="">— Таңдаңыз —</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {hint && <FieldHint>{hint}</FieldHint>}
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState<FormData>(initialFormData);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const update = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateService = (key: keyof FormData['services'], value: boolean) => {
    setForm((prev) => ({
      ...prev,
      services: { ...prev.services, [key]: value },
    }));
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!form.childFullName.trim()) errs.push('Баланың Т.А.Ә.');
    if (!form.actNumber.trim()) errs.push('Актісі нөмірі');
    if (!form.actDate) errs.push('Актісі күні');
    if (!form.address.trim()) errs.push('Мекенжай');
    if (!form.specialistPosition.trim()) errs.push('Маманның лауазымы');
    if (!form.specialistFullName.trim()) errs.push('Маманның Т.А.Ә.');
    return errs;
  };

  const handleGenerate = async () => {
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrors([]);
    try {
      await generateDocument(form);
      setShowSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
      alert('Құжатты жасау кезінде қате орын алды');
    }
  };

  const handleReset = () => {
    setForm(initialFormData);
    setShowSuccess(false);
    setErrors([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-[Inter]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <h1 className="text-lg md:text-xl font-bold text-gray-800 leading-tight">
            Мүгедектігі бар балаларға үйде арнаулы әлеуметтік қызметтер көрсету үшін
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Тұрғын үй және материалдық-тұрмыстық жағдайларды зерттеу-тексеру актісі
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Error messages */}
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800 mb-2">Келесі міндетті өрістер толтырылмаған:</p>
            <ul className="list-disc list-inside text-sm text-red-700">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}

        {/* Success message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">✓ Құжат сәтті жүктелді!</p>
              <p className="text-xs text-green-600 mt-1">Word файлы компьютеріңізге сақталды.</p>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
            >
              Тазалау
            </button>
          </div>
        )}

        {/* Form */}
        <div className="space-y-8">
          {/* Header section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Актісі нөмірі <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.actNumber}
                  onChange={(e) => update('actNumber', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Мысалы: 125"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Актісі күні <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.actDate}
                  onChange={(e) => update('actDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Section I */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <SectionHeader
              title="I. ЖАЛПЫ МӘЛІМЕТТЕР"
              subtitle="Общие сведения"
            />
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  1. Баланың Т.А.Ә. (бар болса) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.childFullName}
                  onChange={(e) => update('childFullName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Мысалы: Иванов Алим Бауыржанұлы"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    2. Туған күні
                  </label>
                  <input
                    type="date"
                    value={form.childBirthDate}
                    onChange={(e) => update('childBirthDate', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    3. ЖСН (ИИН)
                  </label>
                  <input
                    type="text"
                    value={form.childIIN}
                    onChange={(e) => update('childIIN', e.target.value.replace(/\D/g, '').slice(0, 12))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="12 сан"
                    maxLength={12}
                  />
                  <FieldHint>ИИН ребёнка — 12 цифр</FieldHint>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  4. Мүгедектік санаты мен мерзімі (бар болса)
                </label>
                <input
                  type="text"
                  value={form.disabilityCategory}
                  onChange={(e) => update('disabilityCategory', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Мысалы: бірінші санат, мерзімі: 2027 жылға дейін"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  5. Тұрғылықты мекенжайы <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Облыс, қала, көше, үй, пәтер"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    6. Байланыс телефоны
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    7. Мемлекеттік жәрдемақы/төлемдер түрі мен мөлшері
                  </label>
                  <input
                    type="text"
                    value={form.benefits}
                    onChange={(e) => update('benefits', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Мысалы: мүгедектігі бойынша жәрдемақы, 45000 тг"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section II */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <SectionHeader
              title="II. АТА-АНАЛАРЫ (ЗАҢДЫ ӨКІЛДЕРІ) ЖӘНЕ ОТБАСЫ ҚҰРАМЫ"
              subtitle="Родители/законные представители и состав семьи"
            />
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  8. Заңды өкілдері туралы мәлімет
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Анасының Т.А.Ә.</label>
                    <input
                      type="text"
                      value={form.motherFullName}
                      onChange={(e) => update('motherFullName', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Жұмыс орны/әрекеті</label>
                    <input
                      type="text"
                      value={form.motherWork}
                      onChange={(e) => update('motherWork', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Әкесінің Т.А.Ә.</label>
                    <input
                      type="text"
                      value={form.fatherFullName}
                      onChange={(e) => update('fatherFullName', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Жұмыс орны/әрекеті</label>
                    <input
                      type="text"
                      value={form.fatherWork}
                      onChange={(e) => update('fatherWork', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-gray-500 mb-1">Қамқоршысы/Қорғаншысы (бар болса)</label>
                  <input
                    type="text"
                    value={form.guardian}
                    onChange={(e) => update('guardian', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Егер қолданылса"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  9. Бірге тұратын отбасы мүшелері
                </label>
                <textarea
                  value={form.familyMembers}
                  onChange={(e) => update('familyMembers', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Аға-інілері, апа-сіңлілері, туыстары"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  10. Отбасының әлеуметтік мәртебесі
                </label>
                <RadioGroup
                  name="familyStatus"
                  value={form.familyStatus}
                  onChange={(val) => update('familyStatus', val)}
                  options={[
                    { value: 'Көпбалалы', label: 'Көпбалалы' },
                    { value: 'Толық емес', label: 'Толық емес' },
                    { value: 'Мүгедектігі бар бала тәрбиелеп отырған отбасы', label: 'Мүгедектігі бар бала тәрбиелеп отырған отбасы' },
                    { value: 'Басқа', label: 'Басқа' },
                  ]}
                />
                {form.familyStatus === 'Басқа' && (
                  <input
                    type="text"
                    value={form.familyStatusOther}
                    onChange={(e) => update('familyStatusOther', e.target.value)}
                    className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Нақтылаңыз..."
                  />
                )}
              </div>
            </div>
          </section>

          {/* Section III */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <SectionHeader
              title="III. ТҰРҒЫН ҮЙ-ТҰРМЫСТЫҚ ЖӘНЕ ТАЗАЛЫҚ ЖАҒДАЙЛАРЫ"
              subtitle="Жилищно-бытовые условия и безопасность ребёнка"
            />
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  11. Тұрғын үй түрі
                </label>
                <RadioGroup
                  name="housingType"
                  value={form.housingType}
                  onChange={(val) => update('housingType', val)}
                  options={[
                    { value: 'Жеке үй', label: 'Жеке үй' },
                    { value: 'Көпқабатты үйдегі пәтер', label: 'Көпқабатты үйдегі пәтер' },
                    { value: 'Жатақхана', label: 'Жатақхана' },
                  ]}
                />
                {form.housingType === 'Көпқабатты үйдегі пәтер' && (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 border-l-2 border-blue-100">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Этаж</label>
                      <input
                        type="number"
                        value={form.floor}
                        onChange={(e) => update('floor', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Лифт</label>
                      <RadioGroup
                        name="hasElevator"
                        value={form.hasElevator}
                        onChange={(val) => update('hasElevator', val)}
                        options={[
                          { value: 'бар', label: 'Бар' },
                          { value: 'жоқ', label: 'Жоқ' },
                        ]}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  12. Коммуналдық және инфрақұрылымдық жағдайы
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <SelectField
                    label="Жылыту"
                    value={form.heating}
                    onChange={(val) => update('heating', val)}
                    options={[
                      { value: 'орталық', label: 'Орталық' },
                      { value: 'газ', label: 'Газ' },
                      { value: 'пешпен (отын, көмір)', label: 'Пешпен (отын, көмір)' },
                    ]}
                  />
                  <SelectField
                    label="Сумен қамтылуы"
                    value={form.waterSupply}
                    onChange={(val) => update('waterSupply', val)}
                    options={[
                      { value: 'үй ішінде', label: 'Үй ішінде' },
                      { value: 'сыртта', label: 'Сыртта' },
                    ]}
                  />
                  <SelectField
                    label="Санузел (әжетхана, душ)"
                    value={form.sanitation}
                    onChange={(val) => update('sanitation', val)}
                    options={[
                      { value: 'үй ішінде', label: 'Үй ішінде' },
                      { value: 'сыртта', label: 'Сыртта' },
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  13. Үйдің санитарлық-гигиеналық жағдайы
                </label>
                <RadioGroup
                  name="sanitaryCondition"
                  value={form.sanitaryCondition}
                  onChange={(val) => update('sanitaryCondition', val)}
                  options={[
                    { value: 'Қанағаттанарлық', label: 'Қанағаттанарлық' },
                    { value: 'арнайы тазалауды немесе дезинфекцияны қажет етеді', label: 'Арнайы тазалауды/дезинфекцияны қажет етеді' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  14. Балаға жасалған арнайы жағдайлар мен бейімделу
                </label>
                <div className="space-y-3 pl-4 border-l-2 border-blue-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Баланың жеке ұйықтау және сабақ/ойын орны:</p>
                    <RadioGroup
                      name="childSleepPlace"
                      value={form.childSleepPlace}
                      onChange={(val) => update('childSleepPlace', val)}
                      options={[
                        { value: 'бар', label: 'Бар' },
                        { value: 'жоқ', label: 'Жоқ' },
                      ]}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Үйдегі кедергісіз орта (пандус, кең есіктер, арнайы тұтқалар):</p>
                    <RadioGroup
                      name="accessibleEnvironment"
                      value={form.accessibleEnvironment}
                      onChange={(val) => update('accessibleEnvironment', val)}
                      options={[
                        { value: 'бар', label: 'Бар' },
                        { value: 'жоқ', label: 'Жоқ' },
                        { value: 'қажет етеді', label: 'Қажет етеді' },
                      ]}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Баланың қауіпсіздігі (қауіпті заттар, ашық розеткалар, пеш оқшаулануы):</p>
                    <RadioGroup
                      name="childSafety"
                      value={form.childSafety}
                      onChange={(val) => update('childSafety', val)}
                      options={[
                        { value: 'қамтамасыз етілген', label: 'Қамтамасыз етілген' },
                        { value: 'қауіп бар', label: 'Қауіп бар' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section IV */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <SectionHeader
              title="IV. БАЛАНЫҢ ДЕНСАУЛЫҚ ЖАҒДАЙЫ ЖӘНЕ ДАМУ ЕРЕКШЕЛІКТЕРІ"
              subtitle="Здоровье и развитие ребёнка"
            />
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  15. Негізгі диагнозы (медициналық картаға сәйкес)
                </label>
                <textarea
                  value={form.diagnosis}
                  onChange={(e) => update('diagnosis', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Психоневрологиялық ауытқулары бар / Тірек-қимыл аппараты (ТҚА) бұзылған"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  16. Қозғалу және өзіне-өзі қызмет көрсету қабілеті
                </label>
                <div className="space-y-3 pl-4 border-l-2 border-blue-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Қозғалысы:</p>
                    <RadioGroup
                      name="mobility"
                      value={form.mobility}
                      onChange={(val) => update('mobility', val)}
                      options={[
                        { value: 'Еркін', label: 'Еркін' },
                        { value: 'бөгде адамның немесе арнайы құралдың көмегімен', label: 'Бөгде адамның/арнайы құралдың көмегімен' },
                        { value: 'төсек тартып жатыр', label: 'Төсек тартып жатыр' },
                      ]}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Өзіне-өзі қызмет көрсетуі (жас ерекшелігін ескере отырып):</p>
                    <RadioGroup
                      name="selfCare"
                      value={form.selfCare}
                      onChange={(val) => update('selfCare', val)}
                      options={[
                        { value: 'толық сақталған', label: 'Толық сақталған' },
                        { value: 'ішінара шектелген', label: 'Ішінара шектелген' },
                        { value: 'толықтай қабілетсіз', label: 'Толықтай қабілетсіз' },
                      ]}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    17. ПМПК қорытындысы — нөмірі
                  </label>
                  <input
                    type="text"
                    value={form.pmpkNumber}
                    onChange={(e) => update('pmpkNumber', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="№"
                  />
                  <FieldHint>ПМПК — Психолого-медико-педагогическая консультация</FieldHint>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ПМПК қорытындысы — күні
                  </label>
                  <input
                    type="date"
                    value={form.pmpkDate}
                    onChange={(e) => update('pmpkDate', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    18. АОЖБ — нөмірі
                  </label>
                  <input
                    type="text"
                    value={form.ipraNumber}
                    onChange={(e) => update('ipraNumber', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="№"
                  />
                  <FieldHint>АОЖБ — Индивидуальная программа реабилитации и абилитации</FieldHint>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    АОЖБ — қолданылу мерзімі
                  </label>
                  <input
                    type="text"
                    value={form.ipraPeriod}
                    onChange={(e) => update('ipraPeriod', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Мысалы: 2025-2026 жж."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section V */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <SectionHeader
              title="V. ҮЙДЕ КӨРСЕТІЛУІ ҚАЖЕТ АРНАУЛЫ ӘЛЕУМЕТТІК ҚЫЗМЕТ ТҮРЛЕРІ"
              subtitle="Необходимые виды услуг на дому"
            />
            <div className="space-y-3">
              {[
                { key: 'socialDomestic' as const, title: 'Әлеуметтік-тұрмыстық қызметтер', desc: 'баланың гигиенасына, тамақтануына, киінуіне көмектесу, гигиеналық дағдыларға үйрету.' },
                { key: 'socialMedical' as const, title: 'Әлеуметтік-медициналық қызметтер', desc: 'патронаждық бақылау, ЕДШ жаттығуларын орындауға көмектесу, дәрігер процедураларын орындау.' },
                { key: 'socialPedagogical' as const, title: 'Әлеуметтік-педагогикалық қызметтер', desc: 'педагогикалық түзету, дағдыларға үйрету, арнайы білім беру бағдарламалары бойынша оқытуға жәрдемдесу.' },
                { key: 'socialPsychological' as const, title: 'Әлеуметтік-психологиялық қызметтер', desc: 'психологиялық диагностика, баламен және ата-анасымен психологиялық түзету/консультация.' },
                { key: 'parentTraining' as const, title: 'Ата-аналарды үйрету қызметтері', desc: 'ата-аналарды үйде оңалту негіздеріне және баланың өмірлік дағдыларын қалыптастыруға үйрету.' },
                { key: 'socialLegal' as const, title: 'Әлеуметтік-құқықтық қызметтер', desc: 'жәрдемақыларды, ТКҚ, протездік-ортопедиялық көмекті немесе санаторлық-курорттық емдеуді алуға жәрдемдесу.' },
              ].map((service) => (
                <label key={service.key} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={form.services[service.key]}
                    onChange={(e) => updateService(service.key, e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-800">{service.title}:</span>
                    <span className="text-sm text-gray-600 ml-1">{service.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Conclusion */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <SectionHeader
              title="ҚОРЫТЫНДЫ"
              subtitle="Заключение"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Бала «{form.childFullName || '___'}» үйде арнаулы әлеуметтік қызметтер көрсетуге:
              </label>
              <RadioGroup
                name="conclusionResult"
                value={form.conclusionResult}
                onChange={(val) => update('conclusionResult', val)}
                options={[
                  { value: 'mukhaj', label: 'Мұқтаж деп танылды' },
                  { value: 'tanylghan_zhoq', label: 'Танылған жоқ' },
                ]}
              />
            </div>
          </section>

          {/* Signatures */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <SectionHeader
              title="ҚОЛТАҢБАЛАР"
              subtitle="Подписи"
            />
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Актіні жасаған уәкілетті органның маманы:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Лауазымы <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.specialistPosition}
                      onChange={(e) => update('specialistPosition', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Мысалы: Әлеуметтік жұмыскер"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Т.А.Ә. <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.specialistFullName}
                      onChange={(e) => update('specialistFullName', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Актпен таныстым (Ата-анасы / Заңды өкілі):</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Т.А.Ә.</label>
                    <input
                      type="text"
                      value={form.parentFullName}
                      onChange={(e) => update('parentFullName', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Күні</label>
                    <input
                      type="date"
                      value={form.signatureDate}
                      onChange={(e) => update('signatureDate', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Generate button */}
          <div className="text-center pt-4 pb-8">
            <button
              onClick={handleGenerate}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition shadow-lg hover:shadow-xl"
            >
              📄 Word құжатын жүктеу
            </button>
            {showSuccess && (
              <div className="mt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition"
                >
                  🗑️ Форманы тазалау
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-400">
            Барлық деректер тек браузерде өңделеді. Серверге ешқандай ақпарат жіберілмейді.
          </p>
        </div>
      </footer>
    </div>
  );
}
