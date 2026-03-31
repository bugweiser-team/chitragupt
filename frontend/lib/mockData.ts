import { Situation, Lawyer } from '../types';

export const SITUATIONS: Situation[] = [
  {
    id: 'deposit-return',
    emoji: '🏠',
    title: 'Landlord Problems',
    description: 'Deposit not returned? Illegal eviction?',
    category: 'tenant',
    rights: [
      'Your landlord is LEGALLY required to return your security deposit',
      'They can only deduct for actual proven damages (not normal wear & tear)',
      'You have the right to demand an itemized list of any deductions',
      'If they refuse, you can file a complaint in Consumer Forum or Civil Court'
    ],
    lawText: 'Transfer of Property Act, 1882 — Section 108(q):\nThe lessor is bound to put the lessee into possession of the property...\n\nRent Control Acts (state-specific): Security deposit must be returned within [30-60] days of vacating, failing which tenant can claim interest.',
    steps: [
      { text: 'Send a formal legal notice (deadline: 15 days to respond)', status: 'done' },
      { text: 'If no response → File complaint in Rent Authority / Consumer Forum', status: 'pending' },
      { text: 'If still no response → File civil suit for recovery', status: 'info' }
    ],
    successRate: 78,
    timeline: '30-90 days',
    cost: '₹0 - ₹500',
    tip: '68% of landlords return deposit after receiving a formal legal notice. You may not need to go to court.',
    documents: ['legal-notice', 'consumer-complaint'],
    checklist: [
      'Rent agreement / lease copy',
      'Deposit payment receipt',
      'Bank transfer proof of deposit',
      'WhatsApp messages / emails with landlord',
      'Photos of the property when you left'
    ]
  },
  {
    id: 'consumer-fraud',
    emoji: '🛒',
    title: 'Consumer Rights',
    description: 'Defective product? Refund denied?',
    category: 'consumer',
    rights: [
      'You have the right to be protected against marketing of defective goods',
      'Sellers cannot refuse returns for clearly defective items',
      'E-commerce platforms are liable for sellers on their platform'
    ],
    lawText: 'Consumer Protection Act, 2019:\nProtects consumers from unfair trade practices, defective goods, and deficient services.',
    steps: [
      { text: 'Send written complaint to the company\'s grievance officer', status: 'done' },
      { text: 'File complaint on National Consumer Helpline (NCH)', status: 'pending' },
      { text: 'File case in District Consumer Disputes Redressal Commission', status: 'info' }
    ],
    successRate: 85,
    timeline: '60-120 days',
    cost: '₹0 - ₹1000',
    tip: 'Keep all receipts and screenshots of the product page as it was when you bought it.',
    documents: ['legal-notice', 'consumer-complaint'],
    checklist: ['Invoice/Bill', 'Warranty card', 'Photos/videos of defect', 'Communication with customer care']
  },
  {
    id: 'unpaid-salary',
    emoji: '💼',
    title: 'Workplace Issues',
    description: 'Salary unpaid? Wrongful termination?',
    category: 'workplace',
    rights: [
      'Employees are legally entitled to receive their wages on time',
      'Employers cannot withhold salary without a valid, legally sanctioned reason',
      'Terminal dues MUST be cleared as per the employment contract'
    ],
    lawText: 'Payment of Wages Act, 1936:\nEnsures timely payment of wages to employees... employers cannot make unauthorized deductions.',
    steps: [
      { text: 'Send a formal email/notice demanding unpaid salary', status: 'done' },
      { text: 'File a complaint with the Labour Commissioner', status: 'pending' },
      { text: 'Approach the Labour Court if unresolved', status: 'info' }
    ],
    successRate: 72,
    timeline: '3-6 months',
    cost: '₹500+',
    tip: 'Do not resign if you are planning to claim unpaid dues; let them terminate you or follow proper grievance channels.',
    documents: ['legal-notice', 'workplace-complaint'],
    checklist: ['Offer letter / Contract', 'Payslips', 'Relieving letter (if any)', 'Email correspondence regarding unpaid salary']
  },
  {
    id: 'fir-police',
    emoji: '🚓',
    title: 'Police & FIR',
    description: 'Police refusing to help? Need to file FIR?',
    category: 'police',
    rights: [
      'Police MUST register an FIR for any cognizable offense',
      'You can file a Zero FIR at ANY police station, regardless of jurisdiction',
      'If police refuse, you can approach the Superintendent of Police (SP)'
    ],
    lawText: 'Code of Criminal Procedure (CrPC), Section 154:\nInformation in cognizable cases... officer in charge of a police station shall reduce it to writing.',
    steps: [
      { text: 'Draft a written complaint and submit to Police Station', status: 'done' },
      { text: 'If refused, send complaint to SP via registered post', status: 'pending' },
      { text: 'If still no action, file application before Magistrate under Sec 156(3) CrPC', status: 'info' }
    ],
    successRate: 90,
    timeline: 'Immediate to 15 days',
    cost: '₹0',
    tip: 'Always get a stamped receipt (receiving) on the copy of your written complaint from the police station.',
    documents: ['fir'],
    checklist: ['Written complaint detailing the incident', 'ID Proof', 'Any evidence (medical report, photos, etc.)'],
    isHighRisk: true
  }
];

export const LAWYERS: Lawyer[] = [
  {
    id: 'l1',
    initials: 'PS',
    name: 'Adv. Priya Sharma',
    verified: true,
    location: '📍 Indore, Madhya Pradesh',
    city: 'Indore',
    state: 'Madhya Pradesh',
    specializations: ['Tenant Law', 'Consumer Rights', 'Family Law'],
    languages: ['Hindi', 'English'],
    rating: 4.8,
    consultations: 23,
    fee: '💰 Pro Bono available | ₹500 first consultation',
    experience: '8 years experience',
    proBonoOnly: false,
    gradientFrom: '#3b82f6',
    gradientTo: '#2563eb',
    category: 'tenant',
    whyMatch: 'Best match for tenant disputes in Indore. Speaks Hindi & English.'
  },
  {
    id: 'l2',
    initials: 'RK',
    name: 'Adv. Ramesh Kumar',
    verified: true,
    location: '📍 Bhopal, Madhya Pradesh',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    specializations: ['Workplace Issues', 'RTI Expert', 'Banking'],
    languages: ['Hindi'],
    rating: 4.6,
    consultations: 41,
    fee: '💰 100% Pro Bono (Legal Aid)',
    experience: '12 years experience',
    proBonoOnly: true,
    badge: '🏛️ District Legal Aid Authority',
    gradientFrom: '#10b981',
    gradientTo: '#059669',
    category: 'workplace',
    whyMatch: 'Perfect match for workplace issues. Available for free Legal Aid in Bhopal.'
  },
  {
    id: 'l3',
    initials: 'SP',
    name: 'Adv. Sunita Patel',
    verified: true,
    location: '📍 Gwalior, Madhya Pradesh',
    city: 'Gwalior',
    state: 'Madhya Pradesh',
    specializations: ['Domestic Violence', 'Family Law', "Women's Rights"],
    languages: ['Hindi', 'English', 'Marathi'],
    rating: 4.9,
    consultations: 67,
    fee: '💰 Pro Bono for domestic violence cases',
    experience: '15 years experience',
    proBonoOnly: false,
    gradientFrom: '#8b5cf6',
    gradientTo: '#7c3aed',
    category: 'family',
    whyMatch: 'Top-rated female advocate for domestic rights in Gwalior. Fluent in 3 languages.'
  },
  {
    id: 'l4',
    initials: 'VD',
    name: 'Adv. Vikram Desai',
    verified: true,
    location: '📍 Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    specializations: ['Cyber Crime', 'Banking Fraud', 'Corporate Law'],
    languages: ['English', 'Marathi', 'Hindi'],
    rating: 4.7,
    consultations: 89,
    fee: '💰 ₹1500 first consultation',
    experience: '10 years experience',
    proBonoOnly: false,
    gradientFrom: '#f59e0b',
    gradientTo: '#d97706',
    category: 'cyber',
    whyMatch: 'Cyber Crime expert located in Mumbai. Crucial for handling severe digital frauds.'
  },
  {
    id: 'l5',
    initials: 'AK',
    name: 'Adv. Anjali Krishnan',
    verified: true,
    location: '📍 Bangalore, Karnataka',
    city: 'Bangalore',
    state: 'Karnataka',
    specializations: ['Consumer Rights', 'Tenant Law'],
    languages: ['English', 'Kannada', 'Hindi'],
    rating: 4.5,
    consultations: 15,
    fee: '💰 100% Pro Bono (Legal Aid)',
    experience: '5 years experience',
    proBonoOnly: true,
    badge: '🏛️ High Court Legal Services',
    gradientFrom: '#ec4899',
    gradientTo: '#db2777',
    category: 'consumer',
    whyMatch: 'Direct access to Bangalore High Court Legal Services for Consumer cases.'
  },
  {
    id: 'l6',
    initials: 'MD',
    name: 'Adv. Manish Dubey',
    verified: true,
    location: '📍 Delhi, NCR',
    city: 'Delhi',
    state: 'Delhi',
    specializations: ['Police & FIR', 'Criminal Law', 'RTI'],
    languages: ['Hindi', 'English', 'Punjabi'],
    rating: 4.8,
    consultations: 112,
    fee: '💰 ₹1000 first consultation',
    experience: '20 years experience',
    proBonoOnly: false,
    gradientFrom: '#ef4444',
    gradientTo: '#dc2626',
    category: 'police',
    whyMatch: '20 veteran in Criminal Law. Specifically recommended for cases where police refuse FIR.'
  }
];
