export interface FormData {
  // Шапка
  aktNumber: string;
  aktDate: string;

  // I. Жалпы мәліметтер
  childFullName: string;
  childBirthDate: string;
  childIIN: string;
  disabilityCategory: string;
  address: string;
  parentPhone: string;
  benefitsInfo: string;

  // II. Ата-аналары
  motherFullName: string;
  motherWork: string;
  fatherFullName: string;
  fatherWork: string;
  guardianInfo: string;
  familyMembers: string;
  socialStatus: string[];

  // III. Тұрғын үй және қатынау
  housingType: 'private' | 'apartment' | 'dormitory' | '';
  floor: string;
  hasElevator: boolean;
  sanitaryCondition: 'satisfactory' | 'needs_cleaning' | '';
  hasYardPlot: 'bar' | 'joq' | '';
  yardPlotHectares: string;
  needsInvataxi: 'yes' | 'no' | '';
  publicTransport: 'possible' | 'difficult' | 'impossible' | '';
  independentVisit: 'possible' | 'needs_accompaniment' | '';

  // IV. Денсаулық жағдайы
  mainDiagnosis: string;
  mobility: 'free' | 'assisted' | 'unable' | '';
  selfCare: 'preserved' | 'partial' | 'unable' | '';
  pmppkNumber: string;
  pmppkDate: string;
  ipraNumber: string;
  ipraPeriod: string;
  contraindications: 'none' | 'present' | '';
  contraindicationsText: string;

  // V. Қызмет түрлері
  services: string[];

  // Қорытынды
  conclusion: 'needed' | 'not_needed' | '';

  // Ұсыныс
  regimeType: 'full_day' | 'half_day' | '';

  // Подписи
  specialist1Position: string;
  specialist1Name: string;
  specialist2Position: string;
  specialist2Name: string;
  parentNameSignature: string;
  signatureDate: string;
}

export const initialFormData: FormData = {
  aktNumber: '',
  aktDate: '',
  childFullName: '',
  childBirthDate: '',
  childIIN: '',
  disabilityCategory: '',
  address: '',
  parentPhone: '',
  benefitsInfo: '',
  motherFullName: '',
  motherWork: '',
  fatherFullName: '',
  fatherWork: '',
  guardianInfo: '',
  familyMembers: '',
  socialStatus: [],
  housingType: '',
  floor: '',
  hasElevator: false,
  sanitaryCondition: '',
  hasYardPlot: '',
  yardPlotHectares: '',
  needsInvataxi: '',
  publicTransport: '',
  independentVisit: '',
  mainDiagnosis: '',
  mobility: '',
  selfCare: '',
  pmppkNumber: '',
  pmppkDate: '',
  ipraNumber: '',
  ipraPeriod: '',
  contraindications: '',
  contraindicationsText: '',
  services: [],
  conclusion: '',
  regimeType: '',
  specialist1Position: '',
  specialist1Name: '',
  specialist2Position: '',
  specialist2Name: '',
  parentNameSignature: '',
  signatureDate: '',
};
