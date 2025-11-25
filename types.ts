export interface FormData {
  fullName: string;
  birthDate: string;
  whatsapp: string;
  email: string;
  tiktokUsername: string;
  socialPlatform: 'Instagram' | 'Facebook' | '';
  socialUsername: string;
  nik: string;
  address: string;
  departureDate: string;
  activationDate: string;
  companyName: string;
  trainingCenter: string;
  deviceModel: string;
  paymentMethod: string;
  selectedPackage: string;
  ktpFile: File | null;
  passportFile: File | null;
  agreedToTerms: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

export const PACKAGES = [
  { value: "3 GB Call Sim - Sinyal 5G (¥1.408/bulan)", text: "3 GB Call Sim - Sinyal 5G (¥1.408/bulan)", type: "call" },
  { value: "20 GB Call Sim - Sinyal 5G (¥2.178/bulan)", text: "20 GB Call Sim - Sinyal 5G (¥2.178/bulan)", type: "call" },
  { value: "100 GB Call Sim - Sinyal 5G (¥5.478/bulan)", text: "100 GB Call Sim - Sinyal 5G (¥5.478/bulan)", type: "call" },
  { value: "3 GB Data Sim - Sinyal 4G LTE (¥1.078/bulan)", text: "3 GB Data Sim - Sinyal 4G LTE (¥1.078/bulan)", type: "data" },
  { value: "20 GB Data Sim - Sinyal 4G LTE (¥1.848/bulan)", text: "20 GB Data Sim - Sinyal 4G LTE (¥1.848/bulan)", type: "data" },
  { value: "100 GB Data Sim - Sinyal 4G LTE (¥5.148/bulan)", text: "100 GB Data Sim - Sinyal 4G LTE (¥5.148/bulan)", type: "data" }
];
