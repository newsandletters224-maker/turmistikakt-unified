export interface FormData {
  // Header
  actNumber: string;
  actDate: string;

  // Section 1 - Client data
  fullName: string;
  birthDate: string;
  address: string;
  phone: string;
  pensionAmount: string;
  maritalStatus: string;

  // Section 7.1 - Housing conditions
  housingType: 'jeke_uy' | 'kopkabatty';
  floor: string;
  hasElevator: boolean;
  heatingType: 'ortalyk' | 'gaz' | 'pesh';
  waterType: 'uy_ishinde' | 'syrtta';
  toiletType: 'uy_ishinde' | 'syrtta';
  cleanliness: 'kanagattanarlyk' | 'tazalau_kajet';

  // Section 7.2 - Health
  healthComplaints: string;
  mobility: 'erkin' | 'tayakpen' | 'tosek';
  selfCareDescription: string;
  selfCareAbility: 'shekteuli' | 'kabiletsiz';

  // Section 7.3 - Services needed
  services: {
    food: boolean;
    payments: boolean;
    cleaning: boolean;
    medical: boolean;
    fuel: boolean;
  };

  // Conclusion
  limitationType: 'tolyktai' | 'ishinara';

  // Signature
  workerPosition: string;
  workerFullName: string;
}

export const initialFormData: FormData = {
  actNumber: '',
  actDate: '',
  fullName: '',
  birthDate: '',
  address: '',
  phone: '',
  pensionAmount: '',
  maritalStatus: '',
  housingType: 'jeke_uy',
  floor: '',
  hasElevator: false,
  heatingType: 'ortalyk',
  waterType: 'uy_ishinde',
  toiletType: 'uy_ishinde',
  cleanliness: 'kanagattanarlyk',
  healthComplaints: '',
  mobility: 'erkin',
  selfCareDescription: '',
  selfCareAbility: 'shekteuli',
  services: {
    food: false,
    payments: false,
    cleaning: false,
    medical: false,
    fuel: false,
  },
  limitationType: 'tolyktai',
  workerPosition: '',
  workerFullName: '',
};
