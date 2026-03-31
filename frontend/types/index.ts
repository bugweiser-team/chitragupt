export interface Situation {
  id: string;
  emoji: string;
  title: string;
  description: string;
  rights: string[];
  lawText: string;
  steps: { text: string; status: 'done' | 'pending' | 'info' }[];
  successRate: number;
  timeline: string;
  cost: string;
  tip: string;
  documents: string[];
  checklist: string[];
  category: string;
  isHighRisk?: boolean;
}

export interface Lawyer {
  id: string;
  initials: string;
  name: string;
  verified: boolean;
  location: string;
  city: string;
  state: string;
  specializations: string[];
  languages: string[];
  rating: number;
  consultations: number;
  fee: string;
  experience: string;
  proBonoOnly: boolean;
  badge?: string;
  gradientFrom: string;
  gradientTo: string;
  category: string;
  whyMatch?: string;
}

export interface DocFormData {
  yourName: string;
  yourAddress: string;
  yourPhone: string;
  yourEmail: string;
  opponentName: string;
  opponentAddress: string;
  opponentPhone: string;
  issueType: string;
  amount: string;
  dateVacated: string;
  demand: string;
  deadline: string;
  language: 'english' | 'hindi';
  priorComm: boolean;
  priorCommDesc: string;
}

export type DocType = 'legal-notice' | 'rti' | 'consumer' | 'fir' | 'workplace' | 'banking';
export type Language = 'en' | 'hi';
