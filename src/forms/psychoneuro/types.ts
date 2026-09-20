export interface FamilyMember {
  id: string;
  fio: string;
  relation: string;
  birthYear: string;
  occupation: string;
}

export interface FormData {
  // Шапка
  actNumber: string;
  actDate: string;

  // I. Жалпы мәліметтер
  fio: string;
  birthDate: string;
  iin: string;
  disabilityGroup: 'І топ' | 'ІІ топ' | '';
  disabilityReview: string;
  address: string;
  phone: string;
  pension: string;

  // II. Отбасы жағдайы
  maritalStatus: string;
  // Заңды өкілі
  hasLegalRep: boolean;
  legalRepFio: string;
  legalRepPhone: string;
  legalRepDoc: string;
  // Әрекетке қабілеттілігі
  capacity: string;
  courtDecisionNumber: string;
  courtDecisionDate: string;
  // Бірге тұратын отбасы мүшелері
  familyMembers: FamilyMember[];

  // III. Тұрғын үй
  housingType: string;
  floor: string;
  hasElevator: string;
  housingOwnership: string;
  heating: string;
  waterSupply: string;
  sanitation: string;
  sanitaryCondition: string;
  accessibility: string;
  furnitureSufficiency: string;
  hasYardPlot: string;
  yardPlotHectares: string;

  // IV. Денсаулық
  psychoneuro: string;
  musculoskeletal: string;
  somatic: string;
  mobility: string;
  selfCare: string;
  ipraNumber: string;
  ipraPeriod: string;
  careNeed: string;

  // V. Қызмет түрлері
  serviceForm: string;
  serviceTypes: string[];

  // Қорытынды
  conclusion: string;

  // Подписи
  specialist1Position: string;
  specialist1Fio: string;
  specialist2Position: string;
  specialist2Fio: string;
  recipientSignature: string;
  recipientFio: string;
  reviewDate: string;
}

export const initialFormData: FormData = {
  actNumber: '',
  actDate: '',
  fio: '',
  birthDate: '',
  iin: '',
  disabilityGroup: '',
  disabilityReview: '',
  address: '',
  phone: '',
  pension: '',
  maritalStatus: '',
  hasLegalRep: false,
  legalRepFio: '',
  legalRepPhone: '',
  legalRepDoc: '',
  capacity: '',
  courtDecisionNumber: '',
  courtDecisionDate: '',
  familyMembers: [
    { id: '1', fio: '', relation: '', birthYear: '', occupation: '' },
    { id: '2', fio: '', relation: '', birthYear: '', occupation: '' },
    { id: '3', fio: '', relation: '', birthYear: '', occupation: '' },
  ],
  housingType: '',
  floor: '',
  hasElevator: '',
  housingOwnership: '',
  heating: '',
  waterSupply: '',
  sanitation: '',
  sanitaryCondition: '',
  accessibility: '',
  furnitureSufficiency: '',
  hasYardPlot: '',
  yardPlotHectares: '',
  psychoneuro: '',
  musculoskeletal: '',
  somatic: '',
  mobility: '',
  selfCare: '',
  ipraNumber: '',
  ipraPeriod: '',
  careNeed: '',
  serviceForm: '',
  serviceTypes: [],
  conclusion: '',
  specialist1Position: '',
  specialist1Fio: '',
  specialist2Position: '',
  specialist2Fio: '',
  recipientSignature: '',
  recipientFio: '',
  reviewDate: '',
};
