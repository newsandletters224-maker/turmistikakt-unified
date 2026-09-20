import { useState } from 'react';
import { FormData, initialFormData } from './types';
import { generateDocument } from './generateDoc';

const SOCIAL_STATUS_OPTIONS = [
  { value: 'large_family', label: 'Көпбалалы' },
  { value: 'incomplete', label: 'Толық емес' },
  { value: 'disabled_child', label: 'Мүгедектігі бар бала тәрбиелеп отырған отбасы' },
  { value: 'low_income', label: 'Аз қамтылған отбасы' },
];

const SERVICE_OPTIONS = [
  { value: 'social-domestic', label: 'Әлеуметтік-тұрмыстық қызметтер', desc: 'Күндізгі болу кезінде тамақтандыруды ұйымдастыру, демалыс пен гигиеналық процедураларға көмектесу.' },
  { value: 'social-medical', label: 'Әлеуметтік-медициналық қызметтер', desc: 'Емдік дене шынықтыру (ЕДШ), массаж, физиотерапия, дәрігерлік бақылау, салауатты өмір салтын қалыптастыру.' },
  { value: 'social-pedagogical', label: 'Әлеуметтік-педагогикалық қызметтер', desc: 'Арнайы педагогтардың (дефектолог, логопед, сурдопедагог) сабақтары, когнитивті және сенсорлық дағдыларды дамыту, тәрбиелік шаралар.' },
  { value: 'social-psychological', label: 'Әлеуметтік-психологиялық қызметтер', desc: 'Психологиялық диагностика, тренингтер, психологиялық түзету (сенсорлық бөлме), социометрикалық бейімдеу.' },
  { value: 'social-cultural', label: 'Әлеуметтік-мәдени қызметтер', desc: 'Мәдени-бұқаралық шаралар, үйірмелер, мерекелер ұйымдастыру, шығармашылық дағдыларды дамыту (арт-терапия, музыка).' },
  { value: 'social-labor', label: 'Әлеуметтік-еңбек қызметтері', desc: 'Еңбек терапиясы (эстетикалық және қарапайым еңбек дағдыларына үйрету, шеберханалар).' },
  { value: 'social-legal', label: 'Әлеуметтік-құқықтық қызметтер', desc: 'Заңды өкілдерге құқықтық кеңес беру, баланың құқықтары мен жеңілдіктерін қорғауға жәрдемдесу.' },
];

function App() {
  const [form, setForm] = useState<FormData>(initialFormData);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof FormData, value: string | boolean | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'socialStatus' | 'services', value: string) => {
    setForm(prev => {
      const arr = prev[field] as string[];
      const newArr = arr.includes(value)
        ? arr.filter(v => v !== value)
        : [...arr, value];
      return { ...prev, [field]: newArr };
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await generateDocument(form);
      setSuccess(true);
    } catch (e) {
      console.error('Generation error:', e);
      alert('Құжат жасау кезінде қате пайда болды. Қайталап көріңіз.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialFormData);
    setSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-2">
            Акт — Балаларға арналған жартылай стационар
          </h1>
          <p className="text-sm md:text-base text-indigo-700">
            Мүгедектігі бар балаларға жартылай стационарлық типтегі күндізгі болу орталығында арнаулы әлеуметтік қызметтер көрсету үшін
          </p>
          <p className="text-xs text-gray-500 mt-1">
            (тұрғын үй және материалдық-тұрмыстық жағдайларды зерттеу-тексеру АКТІСІ)
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-8">
          
          {/* Шапка */}
          <Section title="Құжат мәліметтері" subtitle="Данные документа">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Актісі №" hint="Номер акта">
                <input
                  type="text"
                  value={form.aktNumber}
                  onChange={e => update('aktNumber', e.target.value)}
                  className="form-input"
                  placeholder="Мысалы: 15"
                />
              </Field>
              <Field label="Құжат күні" hint="Дата составления">
                <input
                  type="date"
                  value={form.aktDate}
                  onChange={e => update('aktDate', e.target.value)}
                  className="form-input"
                />
              </Field>
            </div>
          </Section>

          {/* I. Жалпы мәліметтер */}
          <Section title="I. ЖАЛПЫ МӘЛІМЕТТЕР" subtitle="Общие сведения">
            <Field label="1. Баланың Т.А.Ә. (бар болса)" hint="ФИО ребёнка">
              <input
                type="text"
                value={form.childFullName}
                onChange={e => update('childFullName', e.target.value)}
                className="form-input"
                placeholder="Аты-жөні"
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="2. Туған күні" hint="Дата рождения">
                <input
                  type="date"
                  value={form.childBirthDate}
                  onChange={e => update('childBirthDate', e.target.value)}
                  className="form-input"
                />
              </Field>
              <Field label="ЖСН" hint="ИИН ребёнка (12 цифр)">
                <input
                  type="text"
                  value={form.childIIN}
                  onChange={e => update('childIIN', e.target.value)}
                  className="form-input"
                  placeholder="12 цифр"
                  maxLength={12}
                />
              </Field>
            </div>
            <Field label="3. Мүгедектік санаты мен мерзімі (бар болса)" hint="Категория и срок инвалидности">
              <input
                type="text"
                value={form.disabilityCategory}
                onChange={e => update('disabilityCategory', e.target.value)}
                className="form-input"
                placeholder="Мысалы: Мүгедек бала, 2025 жылға дейін"
              />
            </Field>
            <Field label="4. Тұрғылықты мекенжайы" hint="Адрес проживания">
              <textarea
                value={form.address}
                onChange={e => update('address', e.target.value)}
                className="form-input"
                rows={2}
                placeholder="Облыс, қала, көше, үй, пәтер"
              />
            </Field>
            <Field label="5. Байланыс телефоны (ата-анасы/заңды өкілі)" hint="Телефон родителя/законного представителя">
              <input
                type="tel"
                value={form.parentPhone}
                onChange={e => update('parentPhone', e.target.value)}
                className="form-input"
                placeholder="+7 (___) ___-__-__"
              />
            </Field>
            <Field label="6. Мемлекеттік жәрдемақы/төлемдер түрі мен мөлшері" hint="Вид и размер гос. пособий/выплат">
              <input
                type="text"
                value={form.benefitsInfo}
                onChange={e => update('benefitsInfo', e.target.value)}
                className="form-input"
                placeholder="Мысалы: Мүгедек балаға жәрдемақы — 45 678 тг"
              />
            </Field>
          </Section>

          {/* II. Ата-аналары */}
          <Section title="II. АТА-АНАЛАРЫ (ЗАҢДЫ ӨКІЛДЕРІ) ЖӘНЕ ОТБАСЫ МӘРТЕБЕСІ" subtitle="Родители/законные представители и статус семьи">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Анасының Т.А.Ә." hint="ФИО матери">
                <input
                  type="text"
                  value={form.motherFullName}
                  onChange={e => update('motherFullName', e.target.value)}
                  className="form-input"
                />
              </Field>
              <Field label="Анасының жұмыс орны/қызметі" hint="Место работы/должность матери">
                <input
                  type="text"
                  value={form.motherWork}
                  onChange={e => update('motherWork', e.target.value)}
                  className="form-input"
                />
              </Field>
              <Field label="Әкесінің Т.А.Ә." hint="ФИО отца">
                <input
                  type="text"
                  value={form.fatherFullName}
                  onChange={e => update('fatherFullName', e.target.value)}
                  className="form-input"
                />
              </Field>
              <Field label="Әкесінің жұмыс орны/қызметі" hint="Место работы/должность отца">
                <input
                  type="text"
                  value={form.fatherWork}
                  onChange={e => update('fatherWork', e.target.value)}
                  className="form-input"
                />
              </Field>
            </div>
            <Field label="Қамқоршысы/Қорғаншысы (бар болса)" hint="Опекун/попечитель (при наличии)">
              <input
                type="text"
                value={form.guardianInfo}
                onChange={e => update('guardianInfo', e.target.value)}
                className="form-input"
                placeholder="Т.А.Ә., құжат негізі"
              />
            </Field>
            <Field label="8. Бірге тұратын отбасы мүшелері" hint="Проживающие совместно члены семьи">
              <textarea
                value={form.familyMembers}
                onChange={e => update('familyMembers', e.target.value)}
                className="form-input"
                rows={2}
                placeholder="Аға-інілері, апа-сіңлілері, туыстар"
              />
            </Field>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                9. Отбасының әлеуметтік мәртебесі
                <span className="text-xs text-gray-500 ml-2">(Социальный статус семьи — можно выбрать несколько)</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {SOCIAL_STATUS_OPTIONS.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-indigo-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={form.socialStatus.includes(opt.value)}
                      onChange={() => toggleArrayItem('socialStatus', opt.value)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </Section>

          {/* III. Тұрғын үй және қатынау */}
          <Section title="III. ТҰРҒЫН ҮЙ ЖӘНЕ ҚАТЫНАУ (КӨЛІК) ЖАҒДАЙЛАРЫ" subtitle="Жильё и транспортная доступность">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                10. Тұрғын үй түрі <span className="text-xs text-gray-500">(Тип жилья)</span>
              </label>
              <div className="space-y-2">
                <RadioOption
                  name="housingType"
                  value="private"
                  label="Жеке үй"
                  hint="Частный дом"
                  checked={form.housingType === 'private'}
                  onChange={() => update('housingType', 'private')}
                />
                <RadioOption
                  name="housingType"
                  value="apartment"
                  label="Көпқабатты үйдегі пәтер"
                  hint="Квартира в многоквартирном доме"
                  checked={form.housingType === 'apartment'}
                  onChange={() => update('housingType', 'apartment')}
                />
                {form.housingType === 'apartment' && (
                  <div className="ml-6 mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                    <Field label="Қабат" hint="Этаж">
                      <input
                        type="text"
                        value={form.floor}
                        onChange={e => update('floor', e.target.value)}
                        className="form-input"
                        placeholder="Мысалы: 5"
                      />
                    </Field>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Лифт бар/жоқ</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="radio"
                            name="hasElevator"
                            checked={form.hasElevator === true}
                            onChange={() => update('hasElevator', true)}
                          />
                          Бар
                        </label>
                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="radio"
                            name="hasElevator"
                            checked={form.hasElevator === false}
                            onChange={() => update('hasElevator', false)}
                          />
                          Жоқ
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                <RadioOption
                  name="housingType"
                  value="dormitory"
                  label="Жатақхана"
                  hint="Общежитие"
                  checked={form.housingType === 'dormitory'}
                  onChange={() => update('housingType', 'dormitory')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                11. Үйдің санитарлық-гигиеналық жағдайы <span className="text-xs text-gray-500">(Санитарно-гигиеническое состояние)</span>
              </label>
              <div className="space-y-2">
                <RadioOption
                  name="sanitaryCondition"
                  value="satisfactory"
                  label="Қанағаттанарлық"
                  hint="Удовлетворительное"
                  checked={form.sanitaryCondition === 'satisfactory'}
                  onChange={() => update('sanitaryCondition', 'satisfactory')}
                />
                <RadioOption
                  name="sanitaryCondition"
                  value="needs_cleaning"
                  label="Арнайы тазалауды немесе дезинфекцияны қажет етеді"
                  hint="Требуется специальная уборка или дезинфекция"
                  checked={form.sanitaryCondition === 'needs_cleaning'}
                  onChange={() => update('sanitaryCondition', 'needs_cleaning')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                12. Аулалық учаскенің болуы <span className="text-xs text-gray-500">(Наличие приусадебного участка)</span>
              </label>
              <div className="space-y-2">
                <RadioOption
                  name="hasYardPlot"
                  value="bar"
                  label="Бар"
                  hint="Есть"
                  checked={form.hasYardPlot === 'bar'}
                  onChange={() => update('hasYardPlot', 'bar')}
                />
                <RadioOption
                  name="hasYardPlot"
                  value="joq"
                  label="Жоқ"
                  hint="Нет"
                  checked={form.hasYardPlot === 'joq'}
                  onChange={() => update('hasYardPlot', 'joq')}
                />
              </div>
              {form.hasYardPlot === 'bar' && (
                <div className="mt-3 pl-4 border-l-2 border-blue-100 max-w-xs">
                  <Field label="Учаскенің көлемі" hint="Площадь участка (га)">
                    <input
                      type="text"
                      value={form.yardPlotHectares}
                      onChange={e => update('yardPlotHectares', e.target.value)}
                      className="form-input"
                      placeholder="мыс.: 0,06"
                    />
                  </Field>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                13. Күндізгі болу орталығына қатынау мүмкіндігі <span className="text-xs text-gray-500">(Возможность посещения центра)</span>
              </label>
              <div className="space-y-3 pl-4 border-l-2 border-indigo-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Инватакси қажеттілігі <span className="text-xs text-gray-400">(Необходимость инватакси — спец. транспорт)</span></p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="needsInvataxi" checked={form.needsInvataxi === 'yes'} onChange={() => update('needsInvataxi', 'yes')} />
                      Бар
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="needsInvataxi" checked={form.needsInvataxi === 'no'} onChange={() => update('needsInvataxi', 'no')} />
                      Жоқ
                    </label>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Қоғамдық немесе жеке транспортпен қатынау <span className="text-xs text-gray-400">(Общественный/личный транспорт)</span></p>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="publicTransport" checked={form.publicTransport === 'possible'} onChange={() => update('publicTransport', 'possible')} />
                      Мүмкін
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="publicTransport" checked={form.publicTransport === 'difficult'} onChange={() => update('publicTransport', 'difficult')} />
                      Қиын
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="publicTransport" checked={form.publicTransport === 'impossible'} onChange={() => update('publicTransport', 'impossible')} />
                      Мүмкін емес
                    </label>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Баланың орталыққа келу мүмкіндігі <span className="text-xs text-gray-400">(Возможность прибытия ребёнка)</span></p>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="independentVisit" checked={form.independentVisit === 'possible'} onChange={() => update('independentVisit', 'possible')} />
                      Бар (өз бетінше)
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="independentVisit" checked={form.independentVisit === 'needs_accompaniment'} onChange={() => update('independentVisit', 'needs_accompaniment')} />
                      Сүйемелдеуді қажет етеді
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* IV. Денсаулық жағдайы */}
          <Section title="IV. БАЛАНЫҢ ДЕНСАУЛЫҚ ЖАҒДАЙЫ ЖӘНЕ ЖАРТЫЛАЙ СТАЦИОНАРҒА КЕЛУ МҮМКІНДІГІ" subtitle="Здоровье и возможность посещения центра">
            <Field label="14. Негізгі диагнозы (медициналық құжаттарға сәйкес)" hint="Основной диагноз (по мед. документам)">
              <textarea
                value={form.mainDiagnosis}
                onChange={e => update('mainDiagnosis', e.target.value)}
                className="form-input"
                rows={2}
                placeholder="Психоневрологиялық ауытқулары бар / Тірек-қимыл аппараты (ТҚА) бұзылған"
              />
            </Field>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                15. Қозғалу және ортада бейімделу қабілеті <span className="text-xs text-gray-500">(Способность к передвижению и адаптации)</span>
              </label>
              <div className="space-y-3 pl-4 border-l-2 border-indigo-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Қозғалысы <span className="text-xs text-gray-400">(Передвижение)</span></p>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="mobility" checked={form.mobility === 'free'} onChange={() => update('mobility', 'free')} />
                      Еркін
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="mobility" checked={form.mobility === 'assisted'} onChange={() => update('mobility', 'assisted')} />
                      Бөгде адамның немесе арнайы құралдың (арба, балдақ, ходунок) көмегімен
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="mobility" checked={form.mobility === 'unable'} onChange={() => update('mobility', 'unable')} />
                      Өз бетінше қозғала алмайды
                    </label>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Өзіне-өзі қызмет көрсетуі <span className="text-xs text-gray-400">(Самообслуживание)</span></p>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="selfCare" checked={form.selfCare === 'preserved'} onChange={() => update('selfCare', 'preserved')} />
                      Сақталған
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="selfCare" checked={form.selfCare === 'partial'} onChange={() => update('selfCare', 'partial')} />
                      Ішінара шектелген
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="selfCare" checked={form.selfCare === 'unable'} onChange={() => update('selfCare', 'unable')} />
                      Толықтай қабілетсіз
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="16. ПМПК қорытындысы — №" hint="Психолого-медико-педагогическая консультация — номер">
                <input
                  type="text"
                  value={form.pmppkNumber}
                  onChange={e => update('pmppkNumber', e.target.value)}
                  className="form-input"
                  placeholder="Номер заключения"
                />
              </Field>
              <Field label="ПМПК күні" hint="Дата ПМПК">
                <input
                  type="date"
                  value={form.pmppkDate}
                  onChange={e => update('pmppkDate', e.target.value)}
                  className="form-input"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="17. АОЖБ №" hint="ИПРА — Индивидуальная программа реабилитации и абилитации">
                <input
                  type="text"
                  value={form.ipraNumber}
                  onChange={e => update('ipraNumber', e.target.value)}
                  className="form-input"
                  placeholder="Номер ИПРА"
                />
              </Field>
              <Field label="АОЖБ қолданылу мерзімі" hint="Срок действия ИПРА">
                <input
                  type="text"
                  value={form.ipraPeriod}
                  onChange={e => update('ipraPeriod', e.target.value)}
                  className="form-input"
                  placeholder="Мысалы: 2024-2025 жж."
                />
              </Field>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                18. Ұжымдық/топтық ортада болуға кері көрсетілімдері <span className="text-xs text-gray-500">(Противопоказания для пребывания в коллективе)</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="contraindications" checked={form.contraindications === 'none'} onChange={() => update('contraindications', 'none')} />
                  Жоқ
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="contraindications" checked={form.contraindications === 'present'} onChange={() => update('contraindications', 'present')} />
                  Бар (көрсетілсін)
                </label>
              </div>
              {form.contraindications === 'present' && (
                <div className="mt-2 ml-6">
                  <textarea
                    value={form.contraindicationsText}
                    onChange={e => update('contraindicationsText', e.target.value)}
                    className="form-input"
                    rows={2}
                    placeholder="Жұқпалы аурулар, өткір кезеңдегі психикалық бұзылыстар, жиі ұстамалар және т.б."
                  />
                </div>
              )}
            </div>
          </Section>

          {/* V. Қызмет түрлері */}
          <Section title="V. ЖАРТЫЛАЙ СТАЦИОНАР ЖАҒДАЙЫНДА КӨРСЕТІЛЕТІН АРНАУЛЫ ӘЛЕУМЕТТІК ҚЫЗМЕТ ТҮРЛЕРІ" subtitle="Виды специальных социальных услуг в условиях полустационара">
            <div className="space-y-3">
              {SERVICE_OPTIONS.map(opt => (
                <label key={opt.value} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-indigo-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={form.services.includes(opt.value)}
                    onChange={() => toggleArrayItem('services', opt.value)}
                    className="w-4 h-4 text-indigo-600 rounded mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </Section>

          {/* Қорытынды */}
          <Section title="ҚОРЫТЫНДЫ" subtitle="Заключение">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Зерттеу-тексеру нәтижесі <span className="text-xs text-gray-500">(Результат обследования)</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="conclusion" checked={form.conclusion === 'needed'} onChange={() => update('conclusion', 'needed')} />
                  Мұқтаж деп танылды
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="conclusion" checked={form.conclusion === 'not_needed'} onChange={() => update('conclusion', 'not_needed')} />
                  Танылған жоқ
                </label>
              </div>
            </div>
          </Section>

          {/* Ұсыныс */}
          <Section title="ҰСЫНЫС" subtitle="Рекомендация">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Режим түрі <span className="text-xs text-gray-500">(Тип режима пребывания)</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="regimeType" checked={form.regimeType === 'full_day'} onChange={() => update('regimeType', 'full_day')} />
                  Толық күн (тамақтандырумен және ұйқымен)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="regimeType" checked={form.regimeType === 'half_day'} onChange={() => update('regimeType', 'half_day')} />
                  Жартылай күн (сабақтар/реабилитация уақытына)
                </label>
              </div>
            </div>
          </Section>

          {/* Подписи */}
          <Section title="ҚОЛТАҢБАЛАР" subtitle="Подписи">
            <div className="space-y-6">
              {/* Specialist 1 */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-bold text-indigo-800 mb-3">Бірінші маман <span className="text-xs text-gray-500">(Первый специалист)</span></h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Лауазымы" hint="Должность">
                    <input
                      type="text"
                      value={form.specialist1Position}
                      onChange={e => update('specialist1Position', e.target.value)}
                      className="form-input"
                      placeholder="Мысалы: Әлеуметтік жұмыс маманы"
                    />
                  </Field>
                  <Field label="Т.А.Ә." hint="ФИО специалиста">
                    <input
                      type="text"
                      value={form.specialist1Name}
                      onChange={e => update('specialist1Name', e.target.value)}
                      className="form-input"
                    />
                  </Field>
                </div>
              </div>

              {/* Specialist 2 */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-bold text-indigo-800 mb-3">Екінші маман <span className="text-xs text-gray-500">(Второй специалист)</span></h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Лауазымы" hint="Должность">
                    <input
                      type="text"
                      value={form.specialist2Position}
                      onChange={e => update('specialist2Position', e.target.value)}
                      className="form-input"
                      placeholder="Мысалы: Психолог"
                    />
                  </Field>
                  <Field label="Т.А.Ә." hint="ФИО специалиста">
                    <input
                      type="text"
                      value={form.specialist2Name}
                      onChange={e => update('specialist2Name', e.target.value)}
                      className="form-input"
                    />
                  </Field>
                </div>
              </div>

              {/* Parent */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-bold text-indigo-800 mb-3">Актпен таныстам (Ата-анасы / Заңды өкілі) <span className="text-xs text-gray-500">(Ознакомление родителя/законного представителя)</span></h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Т.А.Ә." hint="ФИО родителя/законного представителя">
                    <input
                      type="text"
                      value={form.parentNameSignature}
                      onChange={e => update('parentNameSignature', e.target.value)}
                      className="form-input"
                    />
                  </Field>
                  <Field label="Күні" hint="Дата ознакомления">
                    <input
                      type="date"
                      value={form.signatureDate}
                      onChange={e => update('signatureDate', e.target.value)}
                      className="form-input"
                    />
                  </Field>
                </div>
              </div>
            </div>
          </Section>

          {/* Generate button */}
          <div className="pt-6 border-t border-gray-200">
            {success ? (
              <div className="text-center space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-800 font-semibold">✓ Құжат сәтті жүктелді!</p>
                  <p className="text-green-600 text-sm">Документ успешно скачан</p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors"
                >
                  Тазалау / Очистить форму
                </button>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.01]"
              >
                {loading ? 'Жүктелуде...' : '📄 Word құжатын жүктеу / Скачать документ Word'}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Барлық деректер тек браузерде өңделеді — серверге жіберілмейді.</p>
          <p>Все данные обрабатываются только в браузере — не отправляются на сервер.</p>
        </div>
      </div>
    </div>
  );
}

// Sub-components

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="border-b border-indigo-100 pb-2">
        <h2 className="text-lg font-bold text-indigo-900">{title}</h2>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
        {hint && <span className="text-xs text-gray-400 ml-1 font-normal">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

function RadioOption({ name, value, label, hint, checked, onChange }: {
  name: string;
  value: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-indigo-50 cursor-pointer transition-colors">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-indigo-600"
      />
      <span className="text-sm">
        {label}
        {hint && <span className="text-xs text-gray-400 ml-1">({hint})</span>}
      </span>
    </label>
  );
}

export default App;
