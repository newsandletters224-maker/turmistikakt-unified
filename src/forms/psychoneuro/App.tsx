import { useState } from 'react';
import type { FormData, FamilyMember } from './types';
import { initialFormData } from './types';
import { downloadDocument } from './generateDoc';

function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      fio: '',
      relation: '',
      birthYear: '',
      occupation: '',
    };
    setFormData(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, newMember],
    }));
  };

  const removeFamilyMember = (id: string) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter(m => m.id !== id),
    }));
  };

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map(m =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    }));
  };

  const toggleServiceType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(type)
        ? prev.serviceTypes.filter(t => t !== type)
        : [...prev.serviceTypes, type],
    }));
  };

  const handleSubmit = async () => {
    setError('');
    if (!formData.fio.trim()) {
      setError('Қызмет алушының Т.А.Ә. міндетті түрде толтырылуы керек');
      return;
    }
    if (!formData.actNumber.trim()) {
      setError('Акт нөмірі міндетті түрде толтырылуы керек');
      return;
    }
    if (!formData.actDate) {
      setError('Акт күні міндетті түрде толтырылуы керек');
      return;
    }
    if (!formData.address.trim()) {
      setError('Мекенжай міндетті түрде толтырылуы керек');
      return;
    }
    if (!formData.specialist1Fio.trim() || !formData.specialist2Fio.trim()) {
      setError('Кем дегенде екі маманның Т.А.Ә. толтырылуы керек');
      return;
    }
    try {
      await downloadDocument(formData);
      setSubmitted(true);
    } catch (e) {
      setError('Құжатты жүктеу кезінде қате орын алды');
      console.error(e);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setSubmitted(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-blue-800 text-white rounded-t-xl p-6 shadow-lg">
          <h1 className="text-xl md:text-2xl font-bold text-center leading-tight">
            Психоневрологиялық ауытқулары бар 18 жастан асқан адамдарға және І, ІІ топтағы мүгедектігі бар адамдарға арнаулы әлеуметтік қызметтер көрсету үшін тұрғын үй және материалдық-тұрмыстық жағдайларды зерттеу-тексеру АКТІСІ
          </h1>
          <p className="text-center text-blue-200 mt-2 text-sm">
            Әлеуметтік жұмысшыға арналған форма
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow-xl rounded-b-xl p-6 md:p-8 space-y-8">
          {/* Шапка */}
          <Section title="Акт мәліметтері">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Акт нөмірі" value={formData.actNumber} onChange={v => updateField('actNumber', v)} required />
              <InputField label="Акт күні" type="date" value={formData.actDate} onChange={v => updateField('actDate', v)} required />
            </div>
          </Section>

          {/* I. ЖАЛПЫ МӘЛІМЕТТЕР */}
          <Section title="I. ЖАЛПЫ МӘЛІМЕТТЕР">
            <InputField label="1. Қызмет алушының Т.А.Ә. (бар болса)" value={formData.fio} onChange={v => updateField('fio', v)} required placeholder="Мысалы: Иванов Иван Иванович" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="2. Туған күні" type="date" value={formData.birthDate} onChange={v => updateField('birthDate', v)} />
              <InputField label="ЖСН (ИИН)" value={formData.iin} onChange={v => updateField('iin', v)} placeholder="12 сан" maxLength={12} />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">3. Мүгедектік тобы</label>
              <div className="flex flex-wrap gap-4">
                <RadioOption label="І топ" value="І топ" name="disabilityGroup" selected={formData.disabilityGroup} onChange={v => updateField('disabilityGroup', v)} />
                <RadioOption label="ІІ топ" value="ІІ топ" name="disabilityGroup" selected={formData.disabilityGroup} onChange={v => updateField('disabilityGroup', v)} />
              </div>
              <InputField label="Қайта тексеру мерзімі / мерзімсіз" value={formData.disabilityReview} onChange={v => updateField('disabilityReview', v)} placeholder="Мысалы: мерзімсіз немесе 01.2025 ж." />
            </div>
            <InputField label="4. Тұрғылықты мекенжайы" value={formData.address} onChange={v => updateField('address', v)} required textarea placeholder="Облыс, қала, көше, үй, пәтер" />
            <InputField label="5. Байланыс телефоны" value={formData.phone} onChange={v => updateField('phone', v)} placeholder="+7 (___) ___-__-__" />
            <div className="relative">
              <InputField label="6. Зейнетақы немесе жәрдемақы түрі мен мөлшері" value={formData.pension} onChange={v => updateField('pension', v)} placeholder="Мысалы: Мүгедектік бойынша, 65 000" />
              <span className="absolute right-3 bottom-3 text-slate-500 text-sm">теңге</span>
            </div>
          </Section>

          {/* II. ОТБАСЫ ЖАҒДАЙЫ */}
          <Section title="II. ОТБАСЫ ЖАҒДАЙЫ ЖӘНЕ БІРГЕ ТҰРАТЫН АДАМДАР">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">7. Отбасылық жағдайы</label>
              <div className="flex flex-wrap gap-3">
                <RadioOption label="Бойдақ (бойдақ/тұрмысқа шықпаған)" value="Бойдақ" name="maritalStatus" selected={formData.maritalStatus} onChange={v => updateField('maritalStatus', v)} />
                <RadioOption label="Отбасылы" value="Отбасылы" name="maritalStatus" selected={formData.maritalStatus} onChange={v => updateField('maritalStatus', v)} />
                <RadioOption label="Жесір (тұл)" value="Жесір" name="maritalStatus" selected={formData.maritalStatus} onChange={v => updateField('maritalStatus', v)} />
                <RadioOption label="Ажырасқан" value="Ажырасқан" name="maritalStatus" selected={formData.maritalStatus} onChange={v => updateField('maritalStatus', v)} />
              </div>
            </div>

            {/* Заңды өкілі */}
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasLegalRep}
                  onChange={e => updateField('hasLegalRep', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-slate-700">8. Заңды өкілі / Қамқоршысы / Қорғаншысы бар</span>
              </label>
              {formData.hasLegalRep && (
                <div className="mt-3 space-y-3">
                  <InputField label="Т.А.Ә." value={formData.legalRepFio} onChange={v => updateField('legalRepFio', v)} />
                  <InputField label="Байланыс телефоны" value={formData.legalRepPhone} onChange={v => updateField('legalRepPhone', v)} />
                  <InputField label="Растайтын құжат (Шешім/Қаулы №)" value={formData.legalRepDoc} onChange={v => updateField('legalRepDoc', v)} />
                </div>
              )}
            </div>

            {/* Әрекетке қабілеттілігі */}
            <div className="space-y-3 mt-4">
              <label className="block text-sm font-medium text-slate-700">9. Әрекетке қабілеттілігі</label>
              <div className="flex flex-col gap-2">
                <RadioOption label="Әрекетке қабілетті" value="capable" name="capacity" selected={formData.capacity} onChange={v => updateField('capacity', v)} />
                <RadioOption label="Әрекетке қабілетсіз деп танылған" value="incapacitated" name="capacity" selected={formData.capacity} onChange={v => updateField('capacity', v)} />
                <RadioOption label="Әрекет қабілеті шектелген" value="limited" name="capacity" selected={formData.capacity} onChange={v => updateField('capacity', v)} />
              </div>
              {formData.capacity === 'incapacitated' && (
                <div className="ml-4 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg space-y-3">
                  <InputField label="Сот шешімінің нөмірі" value={formData.courtDecisionNumber} onChange={v => updateField('courtDecisionNumber', v)} />
                  <InputField label="Сот шешімінің күні" type="date" value={formData.courtDecisionDate} onChange={v => updateField('courtDecisionDate', v)} />
                </div>
              )}
            </div>

            {/* Бірге тұратын отбасы мүшелері */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                10. Бірге тұратын отбасы мүшелері
              </label>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 px-2 py-2 w-10">№</th>
                      <th className="border border-slate-300 px-2 py-2">Т.А.Ә.</th>
                      <th className="border border-slate-300 px-2 py-2">Туыстық дәрежесі</th>
                      <th className="border border-slate-300 px-2 py-2 w-24">Туған жылы</th>
                      <th className="border border-slate-300 px-2 py-2">Жұмыс орны / Мәртебесі</th>
                      <th className="border border-slate-300 px-2 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.familyMembers.map((member, idx) => (
                      <tr key={member.id}>
                        <td className="border border-slate-300 px-2 py-1 text-center text-slate-500">{idx + 1}</td>
                        <td className="border border-slate-300 px-1 py-1">
                          <input className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 rounded" value={member.fio} onChange={e => updateFamilyMember(member.id, 'fio', e.target.value)} />
                        </td>
                        <td className="border border-slate-300 px-1 py-1">
                          <input className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 rounded" value={member.relation} onChange={e => updateFamilyMember(member.id, 'relation', e.target.value)} />
                        </td>
                        <td className="border border-slate-300 px-1 py-1">
                          <input className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 rounded" value={member.birthYear} onChange={e => updateFamilyMember(member.id, 'birthYear', e.target.value)} />
                        </td>
                        <td className="border border-slate-300 px-1 py-1">
                          <input className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 rounded" value={member.occupation} onChange={e => updateFamilyMember(member.id, 'occupation', e.target.value)} />
                        </td>
                        <td className="border border-slate-300 px-1 py-1 text-center">
                          <button onClick={() => removeFamilyMember(member.id)} className="text-red-500 hover:text-red-700 text-lg" title="Жою">×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {formData.familyMembers.map((member, idx) => (
                  <div key={member.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-600">#{idx + 1}</span>
                      <button onClick={() => removeFamilyMember(member.id)} className="text-red-500 hover:text-red-700 text-lg">×</button>
                    </div>
                    <div className="space-y-2">
                      <input className="w-full px-2 py-1 border border-slate-300 rounded text-sm" placeholder="Т.А.Ә." value={member.fio} onChange={e => updateFamilyMember(member.id, 'fio', e.target.value)} />
                      <input className="w-full px-2 py-1 border border-slate-300 rounded text-sm" placeholder="Туыстық дәрежесі" value={member.relation} onChange={e => updateFamilyMember(member.id, 'relation', e.target.value)} />
                      <input className="w-full px-2 py-1 border border-slate-300 rounded text-sm" placeholder="Туған жылы" value={member.birthYear} onChange={e => updateFamilyMember(member.id, 'birthYear', e.target.value)} />
                      <input className="w-full px-2 py-1 border border-slate-300 rounded text-sm" placeholder="Жұмыс орны / Мәртебесі" value={member.occupation} onChange={e => updateFamilyMember(member.id, 'occupation', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addFamilyMember}
                className="mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                + Жол қосу (Добавить строку)
              </button>
            </div>
          </Section>

          {/* III. ТҰРҒЫН ҮЙ */}
          <Section title="III. ТҰРҒЫН ҮЙ ЖӘНЕ МАТЕРИАЛДЫҚ-ТҰРМЫСТЫҚ ЖАҒДАЙЛАРЫ">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">11. Тұрғын үйдің типі</label>
                <div className="flex flex-wrap gap-3">
                  <RadioOption label="Жеке үй" value="house" name="housingType" selected={formData.housingType} onChange={v => updateField('housingType', v)} />
                  <RadioOption label="Көпқабатты үйдегі пәтер" value="apartment" name="housingType" selected={formData.housingType} onChange={v => updateField('housingType', v)} />
                  <RadioOption label="Жатақхана" value="dormitory" name="housingType" selected={formData.housingType} onChange={v => updateField('housingType', v)} />
                  <RadioOption label="Жалдамалы үй" value="rental" name="housingType" selected={formData.housingType} onChange={v => updateField('housingType', v)} />
                </div>
                {formData.housingType === 'apartment' && (
                  <div className="mt-2 ml-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField label="Этаж" value={formData.floor} onChange={v => updateField('floor', v)} placeholder="Мысалы: 5" />
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Лифт бар/жоқ</label>
                      <div className="flex gap-3">
                        <RadioOption label="Бар" value="бар" name="hasElevator" selected={formData.hasElevator} onChange={v => updateField('hasElevator', v)} />
                        <RadioOption label="Жоқ" value="жоқ" name="hasElevator" selected={formData.hasElevator} onChange={v => updateField('hasElevator', v)} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Тұрғын үй тиесілілігі</label>
                <div className="flex flex-wrap gap-3">
                  <RadioOption label="Меншікті" value="Меншікті" name="housingOwnership" selected={formData.housingOwnership} onChange={v => updateField('housingOwnership', v)} />
                  <RadioOption label="Өзге отбасы мүшелерінің меншігі" value="Өзге отбасы мүшелерінің меншігі" name="housingOwnership" selected={formData.housingOwnership} onChange={v => updateField('housingOwnership', v)} />
                  <RadioOption label="Жалға алынған" value="Жалға алынған" name="housingOwnership" selected={formData.housingOwnership} onChange={v => updateField('housingOwnership', v)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">12. Коммуналдық-тұрмыстық жағдайы</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SelectField label="Жылыту" value={formData.heating} onChange={v => updateField('heating', v)} options={[
                    { value: '', label: '— Таңдаңыз —' },
                    { value: 'орталық', label: 'Орталық' },
                    { value: 'газ', label: 'Газ' },
                    { value: 'пешпен (отын, көмір)', label: 'Пешпен (отын, көмір)' },
                  ]} />
                  <SelectField label="Сумен қамтылуы" value={formData.waterSupply} onChange={v => updateField('waterSupply', v)} options={[
                    { value: '', label: '— Таңдаңыз —' },
                    { value: 'үй ішінде', label: 'Үй ішінде' },
                    { value: 'сыртта', label: 'Сыртта' },
                  ]} />
                  <SelectField label="Санузел (әжетхана, душ)" value={formData.sanitation} onChange={v => updateField('sanitation', v)} options={[
                    { value: '', label: '— Таңдаңыз —' },
                    { value: 'үй ішінде', label: 'Үй ішінде' },
                    { value: 'сыртта', label: 'Сыртта' },
                  ]} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">13. Санитарлық-гигиеналық жағдайы</label>
                <div className="flex flex-wrap gap-3">
                  <RadioOption label="Қанағаттанарлық" value="Қанағаттанарлық" name="sanitaryCondition" selected={formData.sanitaryCondition} onChange={v => updateField('sanitaryCondition', v)} />
                  <RadioOption label="Арнайы тазалауды немесе дезинфекцияны қажет етеді" value="Арнайы тазалауды немесе дезинфекцияны қажет етеді" name="sanitaryCondition" selected={formData.sanitaryCondition} onChange={v => updateField('sanitaryCondition', v)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">14. Кедергісіз орта (пандустар, кең есік, арнайы тұтқалар)</label>
                <div className="flex flex-wrap gap-3">
                  <RadioOption label="Бар" value="бар" name="accessibility" selected={formData.accessibility} onChange={v => updateField('accessibility', v)} />
                  <RadioOption label="Жоқ" value="жоқ" name="accessibility" selected={formData.accessibility} onChange={v => updateField('accessibility', v)} />
                  <RadioOption label="Қажет етеді" value="қажет етеді" name="accessibility" selected={formData.accessibility} onChange={v => updateField('accessibility', v)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">15. Жеке ұйықтау орны және жиһаздармен қамтамасыз етілуі</label>
                <div className="flex flex-wrap gap-3">
                  <RadioOption label="Жеткілікті" value="жеткілікті" name="furnitureSufficiency" selected={formData.furnitureSufficiency} onChange={v => updateField('furnitureSufficiency', v)} />
                  <RadioOption label="Жеткіліксіз" value="жеткіліксіз" name="furnitureSufficiency" selected={formData.furnitureSufficiency} onChange={v => updateField('furnitureSufficiency', v)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">16. Аулалық учаскенің болуы</label>
                <div className="flex flex-wrap gap-3">
                  <RadioOption label="Бар" value="бар" name="hasYardPlot" selected={formData.hasYardPlot} onChange={v => updateField('hasYardPlot', v)} />
                  <RadioOption label="Жоқ" value="жоқ" name="hasYardPlot" selected={formData.hasYardPlot} onChange={v => updateField('hasYardPlot', v)} />
                </div>
                {formData.hasYardPlot === 'бар' && (
                  <div className="mt-3 pl-4 border-l-2 border-slate-200 max-w-xs">
                    <InputField label="Учаскенің көлемі (га)" value={formData.yardPlotHectares} onChange={v => updateField('yardPlotHectares', v)} placeholder="мыс.: 0,06" />
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* IV. ДЕНСАУЛЫҚ */}
          <Section title="IV. ДЕНСАУЛЫҚ ЖАҒДАЙЫ ЖӘНЕ ДЕНЕ/ПСИХИКАЛЫҚ ҚАБІЛЕТТІЛІГІ">
            <div className="space-y-4">
              <InputField label="Психоневрологиялық ауытқулар (созылмалы психикалық аурулар)" value={formData.psychoneuro} onChange={v => updateField('psychoneuro', v)} textarea placeholder="Медициналық картаға/қорытындыға сәйкес" />
              <InputField label="Тірек-қимыл аппаратының бұзылуы (ТҚА)" value={formData.musculoskeletal} onChange={v => updateField('musculoskeletal', v)} textarea placeholder="Медициналық картаға/қорытындыға сәйкес" />
              <InputField label="Соматикалық және өзге де ауыр аурулар" value={formData.somatic} onChange={v => updateField('somatic', v)} textarea placeholder="Медициналық картаға/қорытындыға сәйкес" />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Қозғалу деңгейі</label>
                <div className="flex flex-col gap-2">
                  <RadioOption label="Еркін" value="Еркін" name="mobility" selected={formData.mobility} onChange={v => updateField('mobility', v)} />
                  <RadioOption label="Бөгде адамның немесе арнайы құралдың көмегімен (арба, балдақ, ходунок)" value="Бөгде адамның немесе арнайы құралдың көмегімен" name="mobility" selected={formData.mobility} onChange={v => updateField('mobility', v)} />
                  <RadioOption label="Төсек тартып жатыр" value="Төсек тартып жатыр" name="mobility" selected={formData.mobility} onChange={v => updateField('mobility', v)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Өзіне-өзі қызмет көрсетуі (тамақтану, гигиена, киіну, дәретхана)</label>
                <div className="flex flex-col gap-2">
                  <RadioOption label="Сақталған" value="сақталған" name="selfCare" selected={formData.selfCare} onChange={v => updateField('selfCare', v)} />
                  <RadioOption label="Ішінара шектелген" value="ішінара шектелген" name="selfCare" selected={formData.selfCare} onChange={v => updateField('selfCare', v)} />
                  <RadioOption label="Толықтай қабілетсіз (бөгде адамның үнемі күтімін қажет етеді)" value="толықтай қабілетсіз" name="selfCare" selected={formData.selfCare} onChange={v => updateField('selfCare', v)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="АОЖБ нөмірі (Индивидуальная программа реабилитации и абилитации)" value={formData.ipraNumber} onChange={v => updateField('ipraNumber', v)} placeholder="Мысалы: № 12345" />
                <InputField label="АОЖБ қолданылу мерзімі" value={formData.ipraPeriod} onChange={v => updateField('ipraPeriod', v)} placeholder="Мысалы: 01.01.2024 — 01.01.2025" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Бөгде адамның күтіміне мұқтаждығы</label>
                <div className="flex flex-col gap-2">
                  <RadioOption label="Үнемі (күндіз-түні)" value="Үнемі (күндіз-түні)" name="careNeed" selected={formData.careNeed} onChange={v => updateField('careNeed', v)} />
                  <RadioOption label="Мерзімді" value="Мерзімді" name="careNeed" selected={formData.careNeed} onChange={v => updateField('careNeed', v)} />
                  <RadioOption label="Тек белгілі бір тұрмыстық істерде" value="Тек белгілі бір тұрмыстық істерде" name="careNeed" selected={formData.careNeed} onChange={v => updateField('careNeed', v)} />
                </div>
              </div>
            </div>
          </Section>

          {/* V. ҚЫЗМЕТ ТҮРЛЕРІ */}
          <Section title="V. СҰРАТЫЛАТЫН АРНАУЛЫ ӘЛЕУМЕТТІК ҚЫЗМЕТ ТҮРЛЕРІ ЖӘНЕ НЫСАНЫ">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Қызмет көрсету нысаны</label>
                <div className="flex flex-col gap-2">
                  <RadioOption label="Үйде қызмет көрсету жағдайында" value="home" name="serviceForm" selected={formData.serviceForm} onChange={v => updateField('serviceForm', v)} />
                  <RadioOption label="Күндізгі болу жартылай стационар жағдайында" value="semi" name="serviceForm" selected={formData.serviceForm} onChange={v => updateField('serviceForm', v)} />
                  <RadioOption label="Стационар (интернат үйлері) жағдайында" value="stationary" name="serviceForm" selected={formData.serviceForm} onChange={v => updateField('serviceForm', v)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Қажетті қызмет түрлері</label>
                <div className="space-y-2">
                  <CheckboxOption
                    label="Әлеуметтік-тұрмыстық"
                    description="Тамақ дайындауға/жегізуге, гигиеналық процедураларға, тазалық сақтауға, азық-түлік пен дәрі-дәрмек жеткізуге көмектесу."
                    value="social-domestic"
                    checked={formData.serviceTypes.includes('social-domestic')}
                    onChange={() => toggleServiceType('social-domestic')}
                  />
                  <CheckboxOption
                    label="Әлеуметтік-медициналық"
                    description="Денсаулық жағдайын бақылау, емдеу процедураларын орындауға жәрдемдесу, ЕДШ, оңалту шаралары."
                    value="social-medical"
                    checked={formData.serviceTypes.includes('social-medical')}
                    onChange={() => toggleServiceType('social-medical')}
                  />
                  <CheckboxOption
                    label="Әлеуметтік-психологиялық"
                    description="Психологиялық диагностика, кеңес беру, адаптациялық тренингтер."
                    value="social-psychological"
                    checked={formData.serviceTypes.includes('social-psychological')}
                    onChange={() => toggleServiceType('social-psychological')}
                  />
                  <CheckboxOption
                    label="Әлеуметтік-педагогикалық / Түзету"
                    description="Тұрмыстық дағдыларды қайта қалыптастыру, когнитивті функцияларды сүйемелдеу."
                    value="social-pedagogical"
                    checked={formData.serviceTypes.includes('social-pedagogical')}
                    onChange={() => toggleServiceType('social-pedagogical')}
                  />
                  <CheckboxOption
                    label="Әлеуметтік-еңбек"
                    description="Еңбек терапиясы, мүмкіндігіне қарай қарапайым шеберлік пен еңбек дағдыларына баулу."
                    value="social-labor"
                    checked={formData.serviceTypes.includes('social-labor')}
                    onChange={() => toggleServiceType('social-labor')}
                  />
                  <CheckboxOption
                    label="Әлеуметтік-мәдени"
                    description="Бос уақытты ұйымдастыру, мәдени шараларға қатыстыру."
                    value="social-cultural"
                    checked={formData.serviceTypes.includes('social-cultural')}
                    onChange={() => toggleServiceType('social-cultural')}
                  />
                  <CheckboxOption
                    label="Әлеуметтік-құқықтық"
                    description="Тұрғын үй, жәрдемақы, АОЖБ бойынша ТКҚ (арба, памперс т.б.) алуға және құжаттарды рәсімдеуге көмектесу."
                    value="social-legal"
                    checked={formData.serviceTypes.includes('social-legal')}
                    onChange={() => toggleServiceType('social-legal')}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* ҚОРЫТЫНДЫ */}
          <Section title="ҚОРЫТЫНДЫ">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Зерттеу нәтижесі</label>
              <div className="flex flex-col gap-2">
                <RadioOption label="Мұқтаж деп танылды" value="needed" name="conclusion" selected={formData.conclusion} onChange={v => updateField('conclusion', v)} />
                <RadioOption label="Мұқтаж деп танылған жоқ" value="notNeeded" name="conclusion" selected={formData.conclusion} onChange={v => updateField('conclusion', v)} />
              </div>
            </div>
          </Section>

          {/* Подписи */}
          <Section title="Тексеру жүргізген мамандар">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-800 mb-3">Бірінші маман</h4>
                <InputField label="Лауазымы" value={formData.specialist1Position} onChange={v => updateField('specialist1Position', v)} />
                <InputField label="Т.А.Ә." value={formData.specialist1Fio} onChange={v => updateField('specialist1Fio', v)} required />
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-800 mb-3">Екінші маман</h4>
                <InputField label="Лауазымы" value={formData.specialist2Position} onChange={v => updateField('specialist2Position', v)} />
                <InputField label="Т.А.Ә." value={formData.specialist2Fio} onChange={v => updateField('specialist2Fio', v)} required />
              </div>
            </div>
          </Section>

          <Section title="Актпен танысу">
            <div className="space-y-4">
              <InputField label="Қызмет алушы / Заңды өкілі Т.А.Ә. (қол қоятын адам)" value={formData.recipientFio} onChange={v => updateField('recipientFio', v)} placeholder="Бос қалса, қызмет алушының Т.А.Ә. қолданылады" />
              <InputField label="Актпен танысу күні" type="date" value={formData.reviewDate} onChange={v => updateField('reviewDate', v)} />
            </div>
          </Section>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Success */}
          {submitted && (
            <div className="p-4 bg-green-50 border border-green-300 rounded-lg text-green-700">
              <p className="font-medium">✅ Құжат сәтті жүктелді!</p>
              <p className="text-sm mt-1">Word файлы компьютеріңізге сақталды.</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200">
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-4 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-lg text-lg"
            >
              📄 Word құжатын жүктеу
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-4 bg-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-300 transition-colors"
            >
              🗑️ Тазалау
            </button>
          </div>

          {/* Privacy note */}
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-xs text-slate-500 text-center">
              🔒 Барлық деректер тек сіздің браузеріңізде өңделеді. Ешқандай ақпарат серверге жіберілмейді.
              <br />
              <span className="text-slate-400">(Все данные обрабатываются только в вашем браузере. Никакая информация не отправляется на сервер.)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-blue-900 border-b-2 border-blue-200 pb-2">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder, required, textarea, maxLength }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textarea ? (
        <textarea
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-y min-h-[60px]"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
        />
      ) : (
        <input
          type={type}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      )}
    </div>
  );
}

function RadioOption({ label, value, name, selected, onChange }: {
  label: string;
  value: string;
  name: string;
  selected: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-slate-50">
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected === value}
        onChange={() => onChange(value)}
        className="w-4 h-4 text-blue-600"
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <select
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function CheckboxOption({ label, description, value, checked, onChange }: {
  label: string;
  description: string;
  value: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 mt-0.5 text-blue-600 rounded"
      />
      <div>
        <span className="text-sm font-medium text-slate-800">{label}:</span>
        <span className="text-sm text-slate-600 ml-1">{description}</span>
      </div>
    </label>
  );
}

export default App;
