import { useState } from 'react';
import { FormData, initialFormData } from './types';
import { generateDocument } from './utils/generateDocument';

function App() {
  const [formData, setFormData] = useState<FormData>({ ...initialFormData });
  const [errors, setErrors] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateService = (service: keyof FormData['services'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: { ...prev.services, [service]: value }
    }));
  };

  const validate = (): boolean => {
    const newErrors: string[] = [];
    if (!formData.fullName.trim()) newErrors.push('Т.А.Ә. (ФИО получателя) міндетті');
    if (!formData.actNumber.trim()) newErrors.push('Акт нөмірі міндетті');
    if (!formData.actDate) newErrors.push('Акт күні міндетті');
    if (!formData.address.trim()) newErrors.push('Мекенжай міндетті');
    if (!formData.workerFullName.trim()) newErrors.push('Актіні жасаған тұлғаның Т.А.Ә. міндетті');
    if (!formData.workerPosition.trim()) newErrors.push('Лауазым міндетті');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleDownload = () => {
    if (!validate()) return;
    generateDocument(formData);
    setShowSuccess(true);
  };

  const handleReset = () => {
    setFormData({ ...initialFormData });
    setErrors([]);
    setShowSuccess(false);
  };

  const showFuelService = formData.heatingType === 'pesh' || formData.waterType === 'syrtta';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Тұрғын үй жағдайын тексеру актісі</h1>
              <p className="text-xs sm:text-sm text-gray-500">Әлеуметтік қызметкерге арналған құрал</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* Privacy notice */}
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm text-green-800">
              <strong>Құпиялылық:</strong> Барлық деректер тек сіздің браузеріңізде өңделеді. Ешқандай серверге жіберілмейді және сақталмайды.
            </p>
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
            <p className="text-sm font-medium text-red-800 mb-1">Қателер табылды:</p>
            <ul className="list-disc list-inside text-sm text-red-700">
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        {/* Success message */}
        {showSuccess && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">Құжат сәтті жүктелді!</p>
                <p className="text-sm text-blue-700 mt-1">Форманы тазалап, келесі клиент үшін жаңа акт жасауға болады.</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleDownload(); }} className="space-y-6">

          {/* Section: Header */}
          <FormSection title="Акт деректемелері" subtitle="Реквизиты документа">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Акт нөмірі <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.actNumber}
                  onChange={(e) => updateField('actNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="Мысалы: 142"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Акт күні <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.actDate}
                  onChange={(e) => updateField('actDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
              </div>
            </div>
          </FormSection>

          {/* Section 1: Client Data */}
          <FormSection title="1. Қызмет алушы туралы деректер" subtitle="Данные получателя услуг">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Т.А.Ә. (ФИО) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="Мысалы: Ахметова Айгүл Серікқызы"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Туған күні</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => updateField('birthDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Телефон нөмірі</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Мекенжайы <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  rows={2}
                  placeholder="Облыс, қала/аудан, көше, үй нөмірі"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Жәрдемақы/зейнетақы мөлшері
                    <span className="text-xs text-gray-500 ml-1">(теңге)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.pensionAmount}
                    onChange={(e) => updateField('pensionAmount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Отбасылық жағдайы
                    <span className="text-xs text-gray-500 ml-1">(жалғыз басты / отбасымен)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.maritalStatus}
                    onChange={(e) => updateField('maritalStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="Жалғыз басты"
                  />
                </div>
              </div>
            </div>
          </FormSection>

          {/* Section 7.1: Housing */}
          <FormSection title="7.1. Тұрғын үй-тұрмыстық жағдайы" subtitle="Жилищно-бытовые условия">
            <div className="space-y-4">
              {/* Housing type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Тұрғын үй түрі</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${formData.housingType === 'jeke_uy' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="housingType"
                      checked={formData.housingType === 'jeke_uy'}
                      onChange={() => updateField('housingType', 'jeke_uy')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Жеке үй</span>
                  </label>
                  <label className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${formData.housingType === 'kopkabatty' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="housingType"
                      checked={formData.housingType === 'kopkabatty'}
                      onChange={() => updateField('housingType', 'kopkabatty')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Көпқабатты үйдегі пәтер</span>
                  </label>
                </div>
              </div>

              {/* Additional fields for apartment */}
              {formData.housingType === 'kopkabatty' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4 border-l-2 border-blue-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Қабат (этаж)</label>
                    <input
                      type="number"
                      value={formData.floor}
                      onChange={(e) => updateField('floor', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      placeholder="5"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Лифт бар ма?</label>
                    <div className="flex gap-3">
                      <label className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm ${formData.hasElevator ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                        <input
                          type="radio"
                          checked={formData.hasElevator === true}
                          onChange={() => updateField('hasElevator', true)}
                          className="w-4 h-4 text-blue-600"
                        />
                        Бар
                      </label>
                      <label className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm ${!formData.hasElevator ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                        <input
                          type="radio"
                          checked={formData.hasElevator === false}
                          onChange={() => updateField('hasElevator', false)}
                          className="w-4 h-4 text-blue-600"
                        />
                        Жоқ
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Utilities */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Жылыту (отопление)</label>
                  <select
                    value={formData.heatingType}
                    onChange={(e) => updateField('heatingType', e.target.value as FormData['heatingType'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  >
                    <option value="ortalyk">Орталық</option>
                    <option value="gaz">Газ</option>
                    <option value="pesh">Пеш</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Су</label>
                  <select
                    value={formData.waterType}
                    onChange={(e) => updateField('waterType', e.target.value as FormData['waterType'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  >
                    <option value="uy_ishinde">Үй ішінде</option>
                    <option value="syrtta">Сыртта</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Әжетхана</label>
                  <select
                    value={formData.toiletType}
                    onChange={(e) => updateField('toiletType', e.target.value as FormData['toiletType'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  >
                    <option value="uy_ishinde">Үй ішінде</option>
                    <option value="syrtta">Сыртта</option>
                  </select>
                </div>
              </div>

              {/* Cleanliness */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Үйдің тазалығы мен санитарлық жағдайы</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${formData.cleanliness === 'kanagattanarlyk' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="cleanliness"
                      checked={formData.cleanliness === 'kanagattanarlyk'}
                      onChange={() => updateField('cleanliness', 'kanagattanarlyk')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Қанағаттанарлық</span>
                  </label>
                  <label className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${formData.cleanliness === 'tazalau_kajet' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="cleanliness"
                      checked={formData.cleanliness === 'tazalau_kajet'}
                      onChange={() => updateField('cleanliness', 'tazalau_kajet')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Тазалауды қажет етеді</span>
                  </label>
                </div>
              </div>
            </div>
          </FormSection>

          {/* Section 7.2: Health */}
          <FormSection title="7.2. Денсаулық жағдайы мен өзіне-өзі қызмет көрсету қабілеті" subtitle="Состояние здоровья и самообслуживание">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Денсаулық жағдайы (шағымдары)</label>
                <textarea
                  value={formData.healthComplaints}
                  onChange={(e) => updateField('healthComplaints', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  rows={3}
                  placeholder="Созылмалы аурулар, шағымдар..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Қозғалу қабілеті</label>
                <div className="flex flex-col gap-2">
                  <label className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${formData.mobility === 'erkin' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="mobility"
                      checked={formData.mobility === 'erkin'}
                      onChange={() => updateField('mobility', 'erkin')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Еркін қозғалады</span>
                  </label>
                  <label className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${formData.mobility === 'tayakpen' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="mobility"
                      checked={formData.mobility === 'tayakpen'}
                      onChange={() => updateField('mobility', 'tayakpen')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Таяқпен (ходунокпен) қозғалады</span>
                  </label>
                  <label className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${formData.mobility === 'tosek' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="mobility"
                      checked={formData.mobility === 'tosek'}
                      onChange={() => updateField('mobility', 'tosek')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Төсек тартып жатыр</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Өзіне-өзі қызмет көрсетуі</label>
                <textarea
                  value={formData.selfCareDescription}
                  onChange={(e) => updateField('selfCareDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  rows={3}
                  placeholder="Тамақ дайындау, дүкенге бару, тазалау, гигиена..."
                />
                <div className="mt-2 flex flex-col sm:flex-row gap-3">
                  <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer text-sm ${formData.selfCareAbility === 'shekteuli' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                    <input
                      type="radio"
                      name="selfCare"
                      checked={formData.selfCareAbility === 'shekteuli'}
                      onChange={() => updateField('selfCareAbility', 'shekteuli')}
                      className="w-4 h-4 text-blue-600"
                    />
                    Шектеулі
                  </label>
                  <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer text-sm ${formData.selfCareAbility === 'kabiletsiz' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                    <input
                      type="radio"
                      name="selfCare"
                      checked={formData.selfCareAbility === 'kabiletsiz'}
                      onChange={() => updateField('selfCareAbility', 'kabiletsiz')}
                      className="w-4 h-4 text-blue-600"
                    />
                    Қабілетсіз
                  </label>
                </div>
              </div>
            </div>
          </FormSection>

          {/* Section 7.3: Services */}
          <FormSection title="7.3. Қажетті әлеуметтік қызмет түрлері" subtitle="Необходимые виды социальных услуг">
            <div className="space-y-3">
              <CheckboxItem
                label="Азық-түлік, бірінші қажеттіліктегі тауарлар мен дәрі-дәрмектерді сатып алу және үйге жеткізу"
                checked={formData.services.food}
                onChange={(v) => updateService('food', v)}
              />
              <CheckboxItem
                label="Коммуналдық және басқа да төлемдерді төлеуге көмектесу"
                checked={formData.services.payments}
                onChange={(v) => updateService('payments', v)}
              />
              <CheckboxItem
                label="Тұрғын үйді тазалауға көмектесу (жеңіл тазалау, қоқыс шығару)"
                checked={formData.services.cleaning}
                onChange={(v) => updateService('cleaning', v)}
              />
              <CheckboxItem
                label="Медициналық мекемелерге жазылуға, дәрігерді үйге шақыруға жәрдемдесу"
                checked={formData.services.medical}
                onChange={(v) => updateService('medical', v)}
              />
              {showFuelService && (
                <div className="border border-amber-200 bg-amber-50 rounded-lg p-3">
                  <p className="text-xs text-amber-700 mb-2">
                    ⚠️ Бұл тармақ пешпен жылыту немесе су сыртта болған жағдайда ұсынылады
                  </p>
                  <CheckboxItem
                    label="Отын, көмір, су тасуға көмектесу"
                    checked={formData.services.fuel}
                    onChange={(v) => updateService('fuel', v)}
                  />
                </div>
              )}
            </div>
          </FormSection>

          {/* Section: Conclusion */}
          <FormSection title="Қорытынды мен ұсыныс" subtitle="Заключение и рекомендация">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Өзіне-өзі қызмет көрсету қабілетінің шектелу дәрежесі
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${formData.limitationType === 'tolyktai' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="limitation"
                      checked={formData.limitationType === 'tolyktai'}
                      onChange={() => updateField('limitationType', 'tolyktai')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Толықтай</span>
                  </label>
                  <label className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${formData.limitationType === 'ishinara' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="limitation"
                      checked={formData.limitationType === 'ishinara'}
                      onChange={() => updateField('limitationType', 'ishinara')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Ішінара</span>
                  </label>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 border">
                <p className="mb-2">
                  <strong>Қорытынды:</strong> Азамат(ша) <em>{formData.fullName || '___'}</em> материалдық-тұрмыстық жағдайын тексеру нәтижесі бойынша, оның жасы мен денсаулық жағдайына байланысты өзіне-өзі қызмет көрсету қабілетінің <strong>{formData.limitationType === 'tolyktai' ? 'толықтай' : 'ішінара'}</strong> шектелуіне, сондай-ақ жалғызбастылығына байланысты <strong>үйде әлеуметтік қызмет көрсетуге мұқтаж</strong> деп танылды.
                </p>
                <p>
                  <strong>Ұсыныс:</strong> Азамат(ша) <em>{formData.fullName || '___'}</em> арнаулы әлеуметтік қызметтер көрсететін үйде қызмет көрсету бөлімшесіне есепке алу және әлеуметтік қызметкерді бекіту ұсынылады.
                </p>
              </div>
            </div>
          </FormSection>

          {/* Section: Signature */}
          <FormSection title="Актіні жасаған тұлға" subtitle="Составитель акта">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Лауазымы <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.workerPosition}
                  onChange={(e) => updateField('workerPosition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="Әлеуметтік қызметкер"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Т.А.Ә. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.workerFullName}
                  onChange={(e) => updateField('workerFullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="Составительдің ФИО"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">«Қолы» жолы құжатта бос қалады — қолмен қойылады.</p>
          </FormSection>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors text-base shadow-md"
            >
              📄 Word құжатын жүктеу
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 sm:flex-none bg-white text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-colors text-base"
            >
              🗑️ Тазалау
            </button>
          </div>
        </form>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
          <p>Бұл құрал тек жергілікті браузерде жұмыс істейді. Деректер ешқайда сақталмайды.</p>
        </footer>
      </main>
    </div>
  );
}

// Reusable components
function FormSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function CheckboxItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className={`flex items-start gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${checked ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 mt-0.5 rounded"
      />
      <span className="text-sm text-gray-800">{label}</span>
    </label>
  );
}

export default App;
