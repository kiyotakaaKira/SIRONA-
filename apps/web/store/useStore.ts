import { create } from 'zustand';

export type Role = 'patient' | 'hospital' | 'pharmacy' | 'insurance';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  patientId?: string; // for patient role
  stakeholderId?: string; // for hospital/pharmacy/insurance
}

export interface RecordItem {
  id: string;
  title: string;
  category: string;
  issuer: string;
  date: string;
  encrypted: boolean;
  imageUrl?: string;         // per-patient scoped storage path
  ocrText?: string;          // extracted prescription text
  ocrConfidence?: number;    // 0-100
  createdByStakeholderId?: string; // set when pharmacy uploads
  patientId?: string;        // always scoped to a patient
}

export interface ConsentGrant {
  id: string;
  nodeId: string;
  requester: string;
  purpose: string;
  scope: string[];
  status: 'pending' | 'approved' | 'revoked' | 'expired' | 'delegated';
  expiry: string;
  date: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  doctor: string;
  hospital: string;
  issueDate: string;
  expiry: string;
  status: 'active' | 'dispensed' | 'expired' | 'flagged';
  refills: number;
  instructions: string;
  fraudScore: number;
}

export interface AuditEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'security' | 'access' | 'medical' | 'system';
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'consent' | 'prescription' | 'record' | 'ai' | 'system';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Non-Binary';
  dob: string;
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  insuranceProvider: string;
  emergencyContact: string;
  primaryPhysician: string;
}

interface AppState {
  // Auth
  user: User | null;
  login: (email: string) => void;
  logout: () => void;

  // Vault
  records: RecordItem[];
  uploadRecord: (record: Omit<RecordItem, 'id'>) => void;
  deleteRecord: (id: string) => void;
  updateRecordOcr: (id: string, ocrText: string, imageUrl?: string) => void;

  // Consent
  grants: ConsentGrant[];
  approveConsent: (id: string) => void;
  revokeConsent: (id: string) => void;
  hasApprovedConsent: (stakeholderId: string) => boolean;

  // Prescriptions
  prescriptions: Prescription[];
  issuePrescription: (prescription: Omit<Prescription, 'id'>) => void;
  dispensePrescription: (id: string) => void;

  // Audit
  auditLogs: AuditEvent[];
  logEvent: (event: Omit<AuditEvent, 'id' | 'time'>) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'time' | 'read'>) => void;

  // Patients (hospital search)
  patients: Patient[];
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const ROLE_CONFIGS: Record<string, { role: Role; name: string; patientId?: string; stakeholderId?: string }> = {
  'patient@demo.com': { role: 'patient', name: 'John Doe', patientId: 'PAT-001' },
  'hospital@demo.com': { role: 'hospital', name: 'Apollo Demo Hospital', stakeholderId: 'HOSP-001' },
  'pharmacy@demo.com': { role: 'pharmacy', name: 'Walgreens Pharmacy', stakeholderId: 'PHARM-001' },
  'insurance@demo.com': { role: 'insurance', name: 'Aetna Health', stakeholderId: 'INS-001' },
};

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  login: (email) => {
    const config = ROLE_CONFIGS[email];
    if (config) {
      set({ user: { id: generateId(), email, ...config } });
    } else {
      // Infer role from email for unknown emails
      let role: Role = 'patient';
      let name = email.split('@')[0];
      if (email.includes('hospital')) { role = 'hospital'; }
      else if (email.includes('pharmacy')) { role = 'pharmacy'; }
      else if (email.includes('insurance')) { role = 'insurance'; }
      set({ user: { id: generateId(), email, name, role, patientId: role === 'patient' ? 'PAT-' + generateId() : undefined } });
    }
  },
  logout: () => set({ user: null }),

  // Vault Initial Data
  records: [
    // ── PAT-001 (John Doe) — original 16 records ──
    { id: 'REC-101', title: 'Comprehensive Metabolic Panel', category: 'Lab Results', issuer: 'Apollo Labs', date: 'Oct 15, 2026', encrypted: true, patientId: 'PAT-001' },
    { id: 'REC-102', title: 'MRI Scan - Lumbar Spine', category: 'Imaging', issuer: 'City Imaging Center', date: 'Sep 22, 2026', encrypted: true, patientId: 'PAT-001' },
    { id: 'REC-103', title: 'Vaccination Record (Tdap, MMR)', category: 'Immunization', issuer: 'Mercy Clinic', date: 'Aug 10, 2026', encrypted: true, patientId: 'PAT-001' },
    { id: 'REC-104', title: 'Penicillin Allergy Report', category: 'Allergies', issuer: 'Metro Health', date: 'Jul 05, 2026', encrypted: true, patientId: 'PAT-001' },
    { id: 'REC-105', title: 'Echocardiogram Report', category: 'Imaging', issuer: 'Cardiology Associates', date: 'Jun 18, 2026', encrypted: true, patientId: 'PAT-001' },
    { id: 'REC-106', title: 'Annual Health Assessment', category: 'Lab Results', issuer: 'Apollo Labs', date: 'May 12, 2026', encrypted: true, patientId: 'PAT-001' },
    { id: 'REC-107', title: 'Hepatitis B Vaccination', category: 'Immunization', issuer: 'Mercy Clinic', date: 'Apr 20, 2026', encrypted: true, patientId: 'PAT-001' },
    { id: 'REC-108', title: 'Blue Cross Coverage Agreement', category: 'Insurance Policy', issuer: 'Blue Cross Blue Shield', date: 'Jan 01, 2026', encrypted: true, patientId: 'PAT-001' },
    { id: 'REC-109', title: 'CBC with Differential', category: 'Lab Results', issuer: 'Pathology Labs Inc', date: 'Dec 12, 2025', encrypted: true, patientId: 'PAT-001' },
    { id: 'REC-110', title: 'Chest X-Ray Post-Viral', category: 'Imaging', issuer: 'City Imaging Center', date: 'Nov 04, 2025', encrypted: true, patientId: 'PAT-001' },
    { id: 'REC-111', title: 'Influenza Vaccine (Seasonal)', category: 'Immunization', issuer: 'Walgreens Pharmacy', date: 'Oct 19, 2025', encrypted: true, patientId: 'PAT-001' },
    { id: 'REC-112', title: 'Sulfa Drugs Sensitivity Test', category: 'Allergies', issuer: 'Apollo Hospital', date: 'Sep 10, 2025', encrypted: true, patientId: 'PAT-001' },
    { id: 'REC-113', title: 'Aetna Platinum Coverage Policy', category: 'Insurance Policy', issuer: 'Aetna Health', date: 'Jan 01, 2025', encrypted: true, patientId: 'PAT-001' },
    { id: 'REC-114', title: 'Lipid Panel Screen', category: 'Lab Results', issuer: 'Quest Diagnostics', date: 'Aug 14, 2025', encrypted: true, patientId: 'PAT-001' },
    { id: 'REC-115', title: 'Electrocardiogram (ECG)', category: 'Imaging', issuer: 'Heart & Vascular Clinic', date: 'Jul 20, 2025', encrypted: true, patientId: 'PAT-001' },
    { id: 'REC-116', title: 'COVID-19 Booster Vaccine', category: 'Immunization', issuer: 'CVS Pharmacy', date: 'Jun 15, 2025', encrypted: true, patientId: 'PAT-001' },

    // ── PAT-002 (Maria Garcia) ──
    { id: 'REC-201', title: 'Hemoglobin A1c Test', category: 'Lab Results', issuer: 'Quest Diagnostics', date: 'Jun 10, 2026', encrypted: true, patientId: 'PAT-002' },
    { id: 'REC-202', title: 'Abdominal Ultrasound', category: 'Imaging', issuer: 'City Imaging Center', date: 'May 28, 2026', encrypted: true, patientId: 'PAT-002' },
    { id: 'REC-203', title: 'Shingrix Vaccination', category: 'Immunization', issuer: 'CVS Pharmacy', date: 'Apr 15, 2026', encrypted: true, patientId: 'PAT-002' },
    { id: 'REC-204', title: 'Latex Allergy Documentation', category: 'Allergies', issuer: 'Mercy Clinic', date: 'Mar 03, 2026', encrypted: true, patientId: 'PAT-002' },
    { id: 'REC-205', title: 'UnitedHealth PPO Policy', category: 'Insurance Policy', issuer: 'UnitedHealthcare', date: 'Jan 01, 2026', encrypted: true, patientId: 'PAT-002' },

    // ── PAT-003 (Robert Kim) ──
    { id: 'REC-301', title: 'Thyroid Stimulating Hormone Panel', category: 'Lab Results', issuer: 'LabCorp', date: 'Jun 05, 2026', encrypted: true, patientId: 'PAT-003' },
    { id: 'REC-302', title: 'Brain MRI with Contrast', category: 'Imaging', issuer: 'Metro Health Imaging', date: 'May 18, 2026', encrypted: true, patientId: 'PAT-003' },
    { id: 'REC-303', title: 'Pneumococcal Vaccine (PCV13)', category: 'Immunization', issuer: 'Walgreens Pharmacy', date: 'Feb 22, 2026', encrypted: true, patientId: 'PAT-003' },
    { id: 'REC-304', title: 'Iodine Contrast Allergy Report', category: 'Allergies', issuer: 'Metro Health', date: 'Jan 10, 2026', encrypted: true, patientId: 'PAT-003' },
    { id: 'REC-305', title: 'Cigna HMO Coverage Plan', category: 'Insurance Policy', issuer: 'Cigna Health', date: 'Jan 01, 2026', encrypted: true, patientId: 'PAT-003' },

    // ── PAT-004 (Emily Patel) ──
    { id: 'REC-401', title: 'Vitamin D & Calcium Screen', category: 'Lab Results', issuer: 'Apollo Labs', date: 'Jun 01, 2026', encrypted: true, patientId: 'PAT-004' },
    { id: 'REC-402', title: 'Pelvic Ultrasound Report', category: 'Imaging', issuer: 'City Imaging Center', date: 'Apr 22, 2026', encrypted: true, patientId: 'PAT-004' },
    { id: 'REC-403', title: 'HPV Vaccination Series (Dose 3)', category: 'Immunization', issuer: 'Mercy Clinic', date: 'Mar 15, 2026', encrypted: true, patientId: 'PAT-004' },
    { id: 'REC-404', title: 'Aspirin Sensitivity Report', category: 'Allergies', issuer: 'Cardiology Associates', date: 'Feb 10, 2026', encrypted: true, patientId: 'PAT-004' },

    // ── PAT-005 (David Okonkwo) ──
    { id: 'REC-501', title: 'Prostate-Specific Antigen (PSA)', category: 'Lab Results', issuer: 'Quest Diagnostics', date: 'May 20, 2026', encrypted: true, patientId: 'PAT-005' },
    { id: 'REC-502', title: 'Knee X-Ray Bilateral', category: 'Imaging', issuer: 'Metro Health Imaging', date: 'Apr 10, 2026', encrypted: true, patientId: 'PAT-005' },
    { id: 'REC-503', title: 'Metformin 500mg Prescription', category: 'Prescription', issuer: 'Apollo Hospital', date: 'Mar 05, 2026', encrypted: true, patientId: 'PAT-005' },
    { id: 'REC-504', title: 'Humana Gold Coverage Policy', category: 'Insurance Policy', issuer: 'Humana Inc', date: 'Jan 01, 2026', encrypted: true, patientId: 'PAT-005' },

    // ── PAT-006 (Sarah Williams) ──
    { id: 'REC-601', title: 'Iron Studies & Ferritin Panel', category: 'Lab Results', issuer: 'LabCorp', date: 'May 15, 2026', encrypted: true, patientId: 'PAT-006' },
    { id: 'REC-602', title: 'Mammogram Screening Report', category: 'Imaging', issuer: 'Radiology Associates', date: 'Apr 02, 2026', encrypted: true, patientId: 'PAT-006' },
    { id: 'REC-603', title: 'Flu Vaccine (2025-2026 Season)', category: 'Immunization', issuer: 'CVS Pharmacy', date: 'Oct 10, 2025', encrypted: true, patientId: 'PAT-006' },
    { id: 'REC-604', title: 'Codeine Allergy Documentation', category: 'Allergies', issuer: 'Mercy Clinic', date: 'Sep 15, 2025', encrypted: true, patientId: 'PAT-006' },

    // ── PAT-007 (James Rodriguez) ──
    { id: 'REC-701', title: 'Liver Function Panel (LFT)', category: 'Lab Results', issuer: 'Apollo Labs', date: 'Jun 12, 2026', encrypted: true, patientId: 'PAT-007' },
    { id: 'REC-702', title: 'CT Scan - Abdomen & Pelvis', category: 'Imaging', issuer: 'City Imaging Center', date: 'May 05, 2026', encrypted: true, patientId: 'PAT-007' },
    { id: 'REC-703', title: 'Tetanus Booster (Td)', category: 'Immunization', issuer: 'Mercy Clinic', date: 'Jan 28, 2026', encrypted: true, patientId: 'PAT-007' },

    // ── PAT-008 (Linda Chen) ──
    { id: 'REC-801', title: 'Renal Function Panel (BMP)', category: 'Lab Results', issuer: 'Quest Diagnostics', date: 'Jun 08, 2026', encrypted: true, patientId: 'PAT-008' },
    { id: 'REC-802', title: 'DEXA Bone Density Scan', category: 'Imaging', issuer: 'Metro Health Imaging', date: 'Mar 20, 2026', encrypted: true, patientId: 'PAT-008' },
    { id: 'REC-803', title: 'Shellfish Allergy Panel', category: 'Allergies', issuer: 'Apollo Labs', date: 'Feb 14, 2026', encrypted: true, patientId: 'PAT-008' },

    // ── PAT-009 (Ahmed Hassan) ──
    { id: 'REC-901', title: 'HbA1c & Fasting Glucose', category: 'Lab Results', issuer: 'LabCorp', date: 'May 30, 2026', encrypted: true, patientId: 'PAT-009' },
    { id: 'REC-902', title: 'Cardiac Stress Test Report', category: 'Imaging', issuer: 'Heart & Vascular Clinic', date: 'Apr 18, 2026', encrypted: true, patientId: 'PAT-009' },
    { id: 'REC-903', title: 'Hepatitis A & B Vaccination', category: 'Immunization', issuer: 'Walgreens Pharmacy', date: 'Mar 12, 2026', encrypted: true, patientId: 'PAT-009' },

    // ── PAT-010 (Priya Sharma) ──
    { id: 'REC-1001', title: 'Complete Blood Count (CBC)', category: 'Lab Results', issuer: 'Pathology Labs Inc', date: 'Jun 15, 2026', encrypted: true, patientId: 'PAT-010' },
    { id: 'REC-1002', title: 'Thyroid Ultrasound', category: 'Imaging', issuer: 'Radiology Associates', date: 'May 22, 2026', encrypted: true, patientId: 'PAT-010' },
    { id: 'REC-1003', title: 'COVID-19 Vaccine (Bivalent Booster)', category: 'Immunization', issuer: 'CVS Pharmacy', date: 'Nov 05, 2025', encrypted: true, patientId: 'PAT-010' },
    { id: 'REC-1004', title: 'Egg Allergy Documentation', category: 'Allergies', issuer: 'Metro Health', date: 'Aug 20, 2025', encrypted: true, patientId: 'PAT-010' },
    { id: 'REC-1005', title: 'Kaiser Permanente HMO Policy', category: 'Insurance Policy', issuer: 'Kaiser Permanente', date: 'Jan 01, 2025', encrypted: true, patientId: 'PAT-010' },
  ],
  uploadRecord: (record) => set((state) => {
    const newRecord = { ...record, id: `REC-${Math.floor(Math.random() * 900) + 100}` };
    state.logEvent({ title: 'Record Uploaded', description: `Uploaded new record: ${record.title}`, type: 'medical' });
    return { records: [newRecord, ...state.records] };
  }),
  deleteRecord: (id) => set((state) => {
    state.logEvent({ title: 'Record Deleted', description: `Deleted record ID: ${id}`, type: 'security' });
    return { records: state.records.filter(r => r.id !== id) };
  }),
  updateRecordOcr: (id, ocrText, imageUrl) => set((state) => ({
    records: state.records.map(r => r.id === id ? { ...r, ocrText, imageUrl } : r)
  })),

  // Consent Initial Data
  grants: [
    // ── Original 4 grants ──
    { id: 'c1', nodeId: 'HOSP-001', requester: 'Apollo Demo Hospital', purpose: 'Consultation', scope: ['Lab Reports', 'Allergies'], status: 'approved', expiry: '23h 45m', date: '2026-06-20' },
    { id: 'c2', nodeId: 'PHARM-001', requester: 'Walgreens Pharmacy', purpose: 'Dispense Medication', scope: ['Prescriptions'], status: 'approved', expiry: 'One Time', date: '2026-06-20' },
    { id: 'c3', nodeId: 'INS-001', requester: 'Blue Cross', purpose: 'Claim Verification', scope: ['Prescriptions', 'Lab Reports'], status: 'expired', expiry: 'Expired', date: '2026-05-15' },
    { id: 'c4', nodeId: 'HOSP-002', requester: 'Mercy Clinic', purpose: 'Referral Check', scope: ['Imaging', 'Lab Reports'], status: 'pending', expiry: '30 Days', date: '2026-06-21' },

    // ── New consent grants ──
    { id: 'c5', nodeId: 'PHARM-002', requester: 'CVS Pharmacy', purpose: 'Prescription Fulfillment', scope: ['Prescriptions', 'Allergies'], status: 'approved', expiry: '48h', date: '2026-06-18' },
    { id: 'c6', nodeId: 'INS-002', requester: 'UnitedHealthcare', purpose: 'Pre-Authorization Review', scope: ['Imaging', 'Lab Reports', 'Prescriptions'], status: 'pending', expiry: '7 Days', date: '2026-06-19' },
    { id: 'c7', nodeId: 'HOSP-003', requester: 'Princeton Plainsboro Teaching Hospital', purpose: 'Emergency Consult', scope: ['Lab Reports', 'Imaging', 'Allergies', 'Prescriptions'], status: 'approved', expiry: '72h', date: '2026-06-17' },
    { id: 'c8', nodeId: 'LAB-001', requester: 'Quest Diagnostics', purpose: 'Lab Result Delivery', scope: ['Lab Reports'], status: 'approved', expiry: 'One Time', date: '2026-06-15' },
    { id: 'c9', nodeId: 'INS-003', requester: 'Cigna Health', purpose: 'Annual Benefits Audit', scope: ['Insurance Policy', 'Prescriptions', 'Lab Reports'], status: 'revoked', expiry: 'Revoked', date: '2026-04-10' },
    { id: 'c10', nodeId: 'HOSP-004', requester: 'Metro Health System', purpose: 'Specialist Referral', scope: ['Imaging', 'Allergies'], status: 'delegated', expiry: '14 Days', date: '2026-06-12' },
    { id: 'c11', nodeId: 'PHARM-003', requester: 'Rite Aid Pharmacy', purpose: 'Medication Therapy Management', scope: ['Prescriptions', 'Lab Reports'], status: 'pending', expiry: '30 Days', date: '2026-06-20' },
    { id: 'c12', nodeId: 'HOSP-005', requester: 'Cardiology Associates', purpose: 'Post-Procedure Follow-up', scope: ['Imaging', 'Lab Reports'], status: 'approved', expiry: '90 Days', date: '2026-03-20' },
    { id: 'c13', nodeId: 'INS-004', requester: 'Humana Inc', purpose: 'Claim Resubmission Review', scope: ['Prescriptions'], status: 'expired', expiry: 'Expired', date: '2026-02-01' },
    { id: 'c14', nodeId: 'LAB-002', requester: 'LabCorp', purpose: 'Genetic Testing Results', scope: ['Lab Reports'], status: 'approved', expiry: 'One Time', date: '2026-06-10' },
    { id: 'c15', nodeId: 'HOSP-006', requester: 'Radiology Associates', purpose: 'Second Opinion Imaging Review', scope: ['Imaging'], status: 'delegated', expiry: '7 Days', date: '2026-06-14' },
  ],
  approveConsent: (id) => set((state) => {
    state.logEvent({ title: 'Consent Approved', description: `Approved access request ${id}`, type: 'access' });
    return { grants: state.grants.map(g => g.id === id ? { ...g, status: 'approved' } : g) };
  }),
  revokeConsent: (id) => set((state) => {
    state.logEvent({ title: 'Consent Revoked', description: `Revoked access for request ${id}`, type: 'security' });
    return { grants: state.grants.map(g => g.id === id ? { ...g, status: 'revoked' } : g) };
  }),
  hasApprovedConsent: (stakeholderId) => {
    const { grants } = get();
    return grants.some(g => g.nodeId === stakeholderId && g.status === 'approved');
  },

  // Prescriptions Initial Data
  prescriptions: [
    // ── Original 6 prescriptions ──
    { id: 'rx-1', medication: 'Amoxicillin', dosage: '500mg, 3x daily', doctor: 'Dr. Sarah Jenkins', hospital: 'Apollo Hospital', issueDate: '2026-06-20', expiry: '2026-06-30', status: 'active', refills: 0, instructions: 'Take with food.', fraudScore: 99 },
    { id: 'rx-2', medication: 'Lisinopril', dosage: '10mg, 1x daily', doctor: 'Dr. Michael Chen', hospital: 'Mercy Clinic', issueDate: '2026-05-15', expiry: '2026-11-15', status: 'dispensed', refills: 2, instructions: 'Take in the morning.', fraudScore: 98 },
    { id: 'rx-3', medication: 'Oxycodone', dosage: '5mg, as needed', doctor: 'Dr. Gregory House', hospital: 'Princeton Plainsboro', issueDate: '2026-06-19', expiry: '2026-06-26', status: 'flagged', refills: 0, instructions: 'Pain management.', fraudScore: 45 },
    { id: 'rx-4', medication: 'Metformin', dosage: '850mg, 2x daily', doctor: 'Dr. Michael Chen', hospital: 'Mercy Clinic', issueDate: '2026-04-10', expiry: '2026-10-10', status: 'dispensed', refills: 3, instructions: 'Take with meals.', fraudScore: 97 },
    { id: 'rx-5', medication: 'Atorvastatin', dosage: '20mg, 1x daily', doctor: 'Dr. Sarah Jenkins', hospital: 'Apollo Hospital', issueDate: '2026-06-01', expiry: '2026-12-01', status: 'active', refills: 5, instructions: 'Take at bedtime.', fraudScore: 95 },
    { id: 'rx-6', medication: 'Albuterol Inhaler', dosage: '90mcg, 2 puffs q4h', doctor: 'Dr. Sarah Jenkins', hospital: 'Apollo Hospital', issueDate: '2026-05-20', expiry: '2027-05-20', status: 'active', refills: 3, instructions: 'Inhale as needed for wheezing.', fraudScore: 96 },

    // ── New prescriptions ──
    { id: 'rx-7', medication: 'Omeprazole', dosage: '20mg, 1x daily', doctor: 'Dr. Anita Desai', hospital: 'Metro Health System', issueDate: '2026-06-10', expiry: '2026-09-10', status: 'active', refills: 2, instructions: 'Take 30 minutes before breakfast on empty stomach.', fraudScore: 94 },
    { id: 'rx-8', medication: 'Levothyroxine', dosage: '50mcg, 1x daily', doctor: 'Dr. Rachel Torres', hospital: 'Apollo Hospital', issueDate: '2026-03-15', expiry: '2026-09-15', status: 'dispensed', refills: 5, instructions: 'Take on empty stomach, 60 min before food.', fraudScore: 97 },
    { id: 'rx-9', medication: 'Prednisone', dosage: '10mg taper, 1x daily', doctor: 'Dr. Michael Chen', hospital: 'Mercy Clinic', issueDate: '2026-06-18', expiry: '2026-07-02', status: 'active', refills: 0, instructions: 'Follow taper schedule. Take with food.', fraudScore: 92 },
    { id: 'rx-10', medication: 'Sertraline', dosage: '50mg, 1x daily', doctor: 'Dr. Karen Obeid', hospital: 'Behavioral Health Center', issueDate: '2026-02-01', expiry: '2026-08-01', status: 'dispensed', refills: 4, instructions: 'Take in the morning. Do not discontinue abruptly.', fraudScore: 96 },
    { id: 'rx-11', medication: 'Amlodipine', dosage: '5mg, 1x daily', doctor: 'Dr. James Whitfield', hospital: 'Heart & Vascular Clinic', issueDate: '2026-05-05', expiry: '2026-11-05', status: 'active', refills: 5, instructions: 'Take at the same time each day.', fraudScore: 98 },
    { id: 'rx-12', medication: 'Gabapentin', dosage: '300mg, 3x daily', doctor: 'Dr. Gregory House', hospital: 'Princeton Plainsboro', issueDate: '2026-06-15', expiry: '2026-12-15', status: 'flagged', refills: 2, instructions: 'For neuropathic pain. May cause drowsiness.', fraudScore: 38 },
    { id: 'rx-13', medication: 'Hydrocodone/APAP', dosage: '5/325mg, q6h PRN', doctor: 'Dr. Gregory House', hospital: 'Princeton Plainsboro', issueDate: '2026-06-16', expiry: '2026-06-23', status: 'flagged', refills: 0, instructions: 'Short-term pain only. No alcohol.', fraudScore: 28 },
    { id: 'rx-14', medication: 'Ciprofloxacin', dosage: '500mg, 2x daily', doctor: 'Dr. Anita Desai', hospital: 'Metro Health System', issueDate: '2026-01-20', expiry: '2026-02-03', status: 'expired', refills: 0, instructions: 'Complete full course. Avoid dairy products.', fraudScore: 91 },
    { id: 'rx-15', medication: 'Losartan', dosage: '50mg, 1x daily', doctor: 'Dr. James Whitfield', hospital: 'Heart & Vascular Clinic', issueDate: '2025-12-01', expiry: '2026-06-01', status: 'expired', refills: 0, instructions: 'Monitor blood pressure weekly.', fraudScore: 93 },
    { id: 'rx-16', medication: 'Pantoprazole', dosage: '40mg, 1x daily', doctor: 'Dr. Rachel Torres', hospital: 'Apollo Hospital', issueDate: '2026-06-05', expiry: '2026-09-05', status: 'dispensed', refills: 1, instructions: 'Take before first meal. Swallow whole.', fraudScore: 88 },
    { id: 'rx-17', medication: 'Montelukast', dosage: '10mg, 1x daily', doctor: 'Dr. Sarah Jenkins', hospital: 'Apollo Hospital', issueDate: '2026-04-20', expiry: '2026-10-20', status: 'active', refills: 5, instructions: 'Take in the evening for asthma control.', fraudScore: 95 },
    { id: 'rx-18', medication: 'Clopidogrel', dosage: '75mg, 1x daily', doctor: 'Dr. James Whitfield', hospital: 'Heart & Vascular Clinic', issueDate: '2026-03-01', expiry: '2027-03-01', status: 'dispensed', refills: 11, instructions: 'Do not stop without cardiologist approval.', fraudScore: 99 },
    { id: 'rx-19', medication: 'Alprazolam', dosage: '0.5mg, 2x daily PRN', doctor: 'Dr. Gregory House', hospital: 'Princeton Plainsboro', issueDate: '2026-06-17', expiry: '2026-07-17', status: 'flagged', refills: 0, instructions: 'Anxiety relief. Do not combine with opioids.', fraudScore: 22 },
    { id: 'rx-20', medication: 'Insulin Glargine', dosage: '20 units, subcutaneous, 1x daily', doctor: 'Dr. Michael Chen', hospital: 'Mercy Clinic', issueDate: '2026-05-01', expiry: '2027-05-01', status: 'active', refills: 11, instructions: 'Inject at bedtime. Rotate injection sites.', fraudScore: 97 },
  ],
  issuePrescription: (rx) => set((state) => {
    const newRx = { ...rx, id: `RX-${Math.floor(Math.random() * 900) + 100}` };
    state.logEvent({ title: 'Prescription Issued', description: `Issued ${rx.medication}`, type: 'medical' });
    return { prescriptions: [newRx, ...state.prescriptions] };
  }),
  dispensePrescription: (id) => set((state) => {
    state.logEvent({ title: 'Prescription Dispensed', description: `Dispensed RX ${id}`, type: 'medical' });
    return { prescriptions: state.prescriptions.map(p => p.id === id ? { ...p, status: 'dispensed' } : p) };
  }),

  // Audit Logs
  auditLogs: [
    // ── Original 10 logs ──
    { id: 'AUD-001', title: 'System Login', description: 'Successful authentication from new device', time: '1 hour ago', type: 'system' },
    { id: 'AUD-002', title: 'Access Verification', description: 'Walgreens Pharmacy validated prescription rx-2 signature', time: '2 hours ago', type: 'access' },
    { id: 'AUD-003', title: 'Consent Renewed', description: 'Patient approved Apollo Demo Hospital access grant c1', time: '4 hours ago', type: 'access' },
    { id: 'AUD-004', title: 'ZKP Cryptographic Proof', description: 'Zero knowledge range check passed for patient age check', time: '1 day ago', type: 'security' },
    { id: 'AUD-005', title: 'Prescription Issued', description: 'Dr. Sarah Jenkins issued prescription rx-1 via Apollo Provider portal', time: '1 day ago', type: 'medical' },
    { id: 'AUD-006', title: 'Device Registered', description: 'Registered MacBook Pro client signature keys in enclave', time: '3 days ago', type: 'security' },
    { id: 'AUD-007', title: 'Record Decrypted', description: 'Patient decrypted MRI Scan - Lumbar Spine', time: '4 days ago', type: 'security' },
    { id: 'AUD-008', title: 'Emergency Override', description: 'Dr. Gregory House initiated Break-Glass protocol on patient vault', time: '5 days ago', type: 'security' },
    { id: 'AUD-009', title: 'Consent Revoked', description: 'Patient revoked access for Aetna claim reviewer', time: '6 days ago', type: 'security' },
    { id: 'AUD-010', title: 'Audit Trail Export', description: 'Patient exported complete verifiable audit logs to JSON', time: '1 week ago', type: 'system' },

    // ── New audit events ──
    { id: 'AUD-011', title: 'Prescription Dispensed', description: 'CVS Pharmacy dispensed Omeprazole (rx-7) after signature verification', time: '2 hours ago', type: 'medical' },
    { id: 'AUD-012', title: 'Consent Delegation', description: 'Metro Health System delegated imaging access to Radiology Associates', time: '5 hours ago', type: 'access' },
    { id: 'AUD-013', title: 'Failed Login Attempt', description: 'Blocked login attempt from unrecognized IP 203.0.113.42', time: '8 hours ago', type: 'security' },
    { id: 'AUD-014', title: 'AI Risk Analysis', description: 'Fraud detection engine flagged rx-13 (Hydrocodone) – score 28', time: '1 day ago', type: 'system' },
    { id: 'AUD-015', title: 'Record Shared via QR', description: 'Patient shared Lipid Panel Screen (REC-114) via encrypted QR link', time: '1 day ago', type: 'access' },
    { id: 'AUD-016', title: 'Insurance Claim Submitted', description: 'Aetna Health processed claim for Echocardiogram (REC-105)', time: '2 days ago', type: 'medical' },
    { id: 'AUD-017', title: 'Two-Factor Enabled', description: 'Patient enabled TOTP two-factor authentication on account', time: '2 days ago', type: 'security' },
    { id: 'AUD-018', title: 'Bulk Record Upload', description: 'Apollo Demo Hospital uploaded 3 lab results for PAT-001', time: '3 days ago', type: 'medical' },
    { id: 'AUD-019', title: 'Session Timeout', description: 'Automatic session expiry after 30 min inactivity', time: '3 days ago', type: 'system' },
    { id: 'AUD-020', title: 'Consent Scope Modified', description: 'Patient narrowed Quest Diagnostics scope to Lab Reports only', time: '4 days ago', type: 'access' },
    { id: 'AUD-021', title: 'Vault Key Rotation', description: 'Patient-side encryption keys rotated per 90-day policy', time: '5 days ago', type: 'security' },
    { id: 'AUD-022', title: 'Prescription Refill Approved', description: 'Dr. Michael Chen approved 3 refills for Metformin (rx-4)', time: '6 days ago', type: 'medical' },
    { id: 'AUD-023', title: 'API Rate Limit Warning', description: 'Third-party integration from INS-001 approached rate limit threshold', time: '1 week ago', type: 'system' },
    { id: 'AUD-024', title: 'Emergency Access Revoked', description: 'Break-glass access for Princeton Plainsboro auto-expired after 24h', time: '1 week ago', type: 'security' },
    { id: 'AUD-025', title: 'Continuity Capsule Generated', description: 'AI engine compiled 6-month medical summary for PAT-001', time: '2 weeks ago', type: 'system' },
  ],
  logEvent: (event) => set((state) => {
    const newLog = { ...event, id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`, time: 'Just now' };
    return { auditLogs: [newLog, ...state.auditLogs] };
  }),

  // Notifications
  notifications: [
    // ── Original 8 notifications ──
    { id: 'N-1', title: 'Prescription Dispensed', description: 'Walgreens Pharmacy verified and fulfilled Amoxicillin.', time: '2 hours ago', read: false, type: 'prescription' },
    { id: 'N-2', title: 'Lab Results Added', description: 'Apollo Demo Hospital cryptographically signed new records.', time: '4 hours ago', read: false, type: 'record' },
    { id: 'N-3', title: 'Consent Request', description: 'Mercy Clinic requested access to your Health Vault.', time: '1 day ago', read: false, type: 'consent' },
    { id: 'N-4', title: 'Continuity Capsule Generated', description: 'AI successfully synthesized your medical journey.', time: '2 days ago', read: true, type: 'ai' },
    { id: 'N-5', title: 'Security Alert: New Device', description: 'A new browser context authenticated on your account from IP 192.168.1.45', time: '3 days ago', read: true, type: 'system' },
    { id: 'N-6', title: 'Emergency Access Initiated', description: 'Princeton Plainsboro Hospital triggered break-glass protocol on your profile.', time: '5 days ago', read: true, type: 'consent' },
    { id: 'N-7', title: 'Claim Adjudicated', description: 'Aetna Insurance completed audit of comprehensive metabolic panel.', time: '6 days ago', read: true, type: 'ai' },
    { id: 'N-8', title: 'Allergy Record Updated', description: 'Added sensitivity: Sulfa Drugs sensitivity report.', time: '1 week ago', read: true, type: 'record' },

    // ── New notifications ──
    { id: 'N-9', title: 'Prescription Flagged by AI', description: 'Hydrocodone/APAP (rx-13) flagged with fraud score 28. Review recommended.', time: '3 hours ago', read: false, type: 'ai' },
    { id: 'N-10', title: 'New Consent Request', description: 'UnitedHealthcare is requesting access for pre-authorization review.', time: '5 hours ago', read: false, type: 'consent' },
    { id: 'N-11', title: 'Prescription Refill Available', description: 'Metformin 850mg has 3 remaining refills. Next refill eligible now.', time: '6 hours ago', read: false, type: 'prescription' },
    { id: 'N-12', title: 'Record Uploaded', description: 'Quest Diagnostics uploaded Hemoglobin A1c results to your vault.', time: '8 hours ago', read: false, type: 'record' },
    { id: 'N-13', title: 'Consent Delegation Active', description: 'Metro Health delegated your imaging records access to Radiology Associates.', time: '1 day ago', read: false, type: 'consent' },
    { id: 'N-14', title: 'System Maintenance Scheduled', description: 'HealthMesh platform maintenance window: Jun 25, 2026 2:00-4:00 AM EST.', time: '1 day ago', read: true, type: 'system' },
    { id: 'N-15', title: 'Prescription Expired', description: 'Ciprofloxacin 500mg (rx-14) has expired. Contact your doctor for renewal.', time: '2 days ago', read: true, type: 'prescription' },
    { id: 'N-16', title: 'AI Interaction Summary', description: 'Your weekly health insights report is ready for review.', time: '3 days ago', read: true, type: 'ai' },
    { id: 'N-17', title: 'Consent Auto-Expired', description: 'Cigna Health annual benefits audit consent has automatically expired.', time: '4 days ago', read: true, type: 'consent' },
    { id: 'N-18', title: 'Two-Factor Authentication Enabled', description: 'Your account security has been upgraded with TOTP 2FA.', time: '5 days ago', read: true, type: 'system' },
    { id: 'N-19', title: 'New Imaging Report', description: 'DEXA Bone Density Scan results from Metro Health are now available.', time: '6 days ago', read: true, type: 'record' },
    { id: 'N-20', title: 'Prescription Dispensed', description: 'CVS Pharmacy dispensed Pantoprazole 40mg (rx-16).', time: '1 week ago', read: true, type: 'prescription' },
  ],
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  addNotification: (n) => set((state) => ({
    notifications: [{ ...n, id: `N-${generateId()}`, time: 'Just now', read: false }, ...state.notifications]
  })),

  // Patients (hospital search feature)
  patients: [
    { id: 'PAT-001', name: 'John Doe', age: 34, gender: 'Male', dob: '1992-03-15', bloodType: 'O+', phone: '(555) 234-5678', email: 'john.doe@email.com', address: '142 Elm Street, Springfield, IL 62704', insuranceProvider: 'Blue Cross Blue Shield', emergencyContact: 'Jane Doe — (555) 234-5679', primaryPhysician: 'Dr. Sarah Jenkins' },
    { id: 'PAT-002', name: 'Maria Garcia', age: 58, gender: 'Female', dob: '1968-07-22', bloodType: 'A+', phone: '(555) 345-6789', email: 'maria.garcia@email.com', address: '891 Oak Avenue, Houston, TX 77001', insuranceProvider: 'UnitedHealthcare', emergencyContact: 'Carlos Garcia — (555) 345-6790', primaryPhysician: 'Dr. Anita Desai' },
    { id: 'PAT-003', name: 'Robert Kim', age: 45, gender: 'Male', dob: '1981-01-10', bloodType: 'B+', phone: '(555) 456-7890', email: 'robert.kim@email.com', address: '2305 Pine Road, San Francisco, CA 94102', insuranceProvider: 'Cigna Health', emergencyContact: 'Susan Kim — (555) 456-7891', primaryPhysician: 'Dr. Michael Chen' },
    { id: 'PAT-004', name: 'Emily Patel', age: 29, gender: 'Female', dob: '1997-05-30', bloodType: 'AB+', phone: '(555) 567-8901', email: 'emily.patel@email.com', address: '78 Maple Lane, Chicago, IL 60601', insuranceProvider: 'Aetna Health', emergencyContact: 'Raj Patel — (555) 567-8902', primaryPhysician: 'Dr. Rachel Torres' },
    { id: 'PAT-005', name: 'David Okonkwo', age: 62, gender: 'Male', dob: '1964-11-08', bloodType: 'O-', phone: '(555) 678-9012', email: 'david.okonkwo@email.com', address: '1560 Birch Drive, Atlanta, GA 30301', insuranceProvider: 'Humana Inc', emergencyContact: 'Grace Okonkwo — (555) 678-9013', primaryPhysician: 'Dr. James Whitfield' },
    { id: 'PAT-006', name: 'Sarah Williams', age: 51, gender: 'Female', dob: '1975-09-14', bloodType: 'A-', phone: '(555) 789-0123', email: 'sarah.williams@email.com', address: '420 Cedar Court, Boston, MA 02101', insuranceProvider: 'Blue Cross Blue Shield', emergencyContact: 'Mark Williams — (555) 789-0124', primaryPhysician: 'Dr. Sarah Jenkins' },
    { id: 'PAT-007', name: 'James Rodriguez', age: 38, gender: 'Male', dob: '1988-04-25', bloodType: 'B-', phone: '(555) 890-1234', email: 'james.rodriguez@email.com', address: '955 Walnut Street, Miami, FL 33101', insuranceProvider: 'Aetna Health', emergencyContact: 'Sofia Rodriguez — (555) 890-1235', primaryPhysician: 'Dr. Anita Desai' },
    { id: 'PAT-008', name: 'Linda Chen', age: 67, gender: 'Female', dob: '1959-02-18', bloodType: 'AB-', phone: '(555) 901-2345', email: 'linda.chen@email.com', address: '3012 Spruce Boulevard, Seattle, WA 98101', insuranceProvider: 'Kaiser Permanente', emergencyContact: 'Wei Chen — (555) 901-2346', primaryPhysician: 'Dr. Michael Chen' },
    { id: 'PAT-009', name: 'Ahmed Hassan', age: 43, gender: 'Male', dob: '1983-08-05', bloodType: 'O+', phone: '(555) 012-3456', email: 'ahmed.hassan@email.com', address: '187 Willow Way, Detroit, MI 48201', insuranceProvider: 'Cigna Health', emergencyContact: 'Fatima Hassan — (555) 012-3457', primaryPhysician: 'Dr. James Whitfield' },
    { id: 'PAT-010', name: 'Priya Sharma', age: 36, gender: 'Female', dob: '1990-12-01', bloodType: 'A+', phone: '(555) 123-4567', email: 'priya.sharma@email.com', address: '640 Ash Terrace, Denver, CO 80201', insuranceProvider: 'Kaiser Permanente', emergencyContact: 'Vikram Sharma — (555) 123-4568', primaryPhysician: 'Dr. Rachel Torres' },
    { id: 'PAT-011', name: 'Michael Thompson', age: 55, gender: 'Male', dob: '1971-06-12', bloodType: 'B+', phone: '(555) 234-8901', email: 'michael.thompson@email.com', address: '892 Magnolia Drive, Phoenix, AZ 85001', insuranceProvider: 'UnitedHealthcare', emergencyContact: 'Carol Thompson — (555) 234-8902', primaryPhysician: 'Dr. Sarah Jenkins' },
    { id: 'PAT-012', name: 'Jennifer Martinez', age: 41, gender: 'Female', dob: '1985-03-28', bloodType: 'O+', phone: '(555) 345-9012', email: 'jennifer.martinez@email.com', address: '1105 Poplar Avenue, Dallas, TX 75201', insuranceProvider: 'Humana Inc', emergencyContact: 'Ricardo Martinez — (555) 345-9013', primaryPhysician: 'Dr. Anita Desai' },
    { id: 'PAT-013', name: 'William Brown', age: 72, gender: 'Male', dob: '1954-10-20', bloodType: 'A-', phone: '(555) 456-0123', email: 'william.brown@email.com', address: '3300 Hickory Lane, Philadelphia, PA 19101', insuranceProvider: 'Blue Cross Blue Shield', emergencyContact: 'Margaret Brown — (555) 456-0124', primaryPhysician: 'Dr. James Whitfield' },
    { id: 'PAT-014', name: 'Aisha Johnson', age: 27, gender: 'Female', dob: '1999-01-15', bloodType: 'AB+', phone: '(555) 567-1234', email: 'aisha.johnson@email.com', address: '78 Sycamore Blvd, Nashville, TN 37201', insuranceProvider: 'Aetna Health', emergencyContact: 'Derrick Johnson — (555) 567-1235', primaryPhysician: 'Dr. Karen Obeid' },
    { id: 'PAT-015', name: 'Thomas Nguyen', age: 49, gender: 'Male', dob: '1977-07-09', bloodType: 'O-', phone: '(555) 678-2345', email: 'thomas.nguyen@email.com', address: '2450 Chestnut Road, Portland, OR 97201', insuranceProvider: 'Cigna Health', emergencyContact: 'Linh Nguyen — (555) 678-2346', primaryPhysician: 'Dr. Michael Chen' },
    { id: 'PAT-016', name: 'Rachel Adams', age: 33, gender: 'Female', dob: '1993-11-03', bloodType: 'B+', phone: '(555) 789-3456', email: 'rachel.adams@email.com', address: '560 Juniper Circle, San Diego, CA 92101', insuranceProvider: 'Kaiser Permanente', emergencyContact: 'Steven Adams — (555) 789-3457', primaryPhysician: 'Dr. Rachel Torres' },
    { id: 'PAT-017', name: 'George Wilson', age: 64, gender: 'Male', dob: '1962-04-18', bloodType: 'A+', phone: '(555) 890-4567', email: 'george.wilson@email.com', address: '1800 Dogwood Place, Charlotte, NC 28201', insuranceProvider: 'UnitedHealthcare', emergencyContact: 'Barbara Wilson — (555) 890-4568', primaryPhysician: 'Dr. James Whitfield' },
    { id: 'PAT-018', name: 'Fatima Al-Rashid', age: 39, gender: 'Female', dob: '1987-08-27', bloodType: 'O+', phone: '(555) 901-5678', email: 'fatima.alrashid@email.com', address: '945 Redwood Terrace, Minneapolis, MN 55401', insuranceProvider: 'Aetna Health', emergencyContact: 'Omar Al-Rashid — (555) 901-5679', primaryPhysician: 'Dr. Anita Desai' },
    { id: 'PAT-019', name: 'Christopher Lee', age: 56, gender: 'Male', dob: '1970-02-14', bloodType: 'AB-', phone: '(555) 012-6789', email: 'christopher.lee@email.com', address: '2780 Aspen Way, Columbus, OH 43201', insuranceProvider: 'Humana Inc', emergencyContact: 'Diana Lee — (555) 012-6790', primaryPhysician: 'Dr. Sarah Jenkins' },
    { id: 'PAT-020', name: 'Nina Petrova', age: 31, gender: 'Female', dob: '1995-06-21', bloodType: 'B-', phone: '(555) 123-7890', email: 'nina.petrova@email.com', address: '115 Hawthorn Drive, Austin, TX 73301', insuranceProvider: 'Blue Cross Blue Shield', emergencyContact: 'Alexei Petrov — (555) 123-7891', primaryPhysician: 'Dr. Karen Obeid' },
    { id: 'PAT-021', name: 'Daniel Foster', age: 47, gender: 'Male', dob: '1979-09-08', bloodType: 'O+', phone: '(555) 234-0987', email: 'daniel.foster@email.com', address: '3500 Mulberry Road, Jacksonville, FL 32099', insuranceProvider: 'Cigna Health', emergencyContact: 'Rebecca Foster — (555) 234-0988', primaryPhysician: 'Dr. Michael Chen' },
    { id: 'PAT-022', name: 'Olivia Wright', age: 25, gender: 'Female', dob: '2001-03-12', bloodType: 'A+', phone: '(555) 345-1098', email: 'olivia.wright@email.com', address: '680 Laurel Lane, Raleigh, NC 27601', insuranceProvider: 'UnitedHealthcare', emergencyContact: 'Brian Wright — (555) 345-1099', primaryPhysician: 'Dr. Rachel Torres' },
    { id: 'PAT-023', name: 'Samuel Nakamura', age: 60, gender: 'Male', dob: '1966-12-25', bloodType: 'AB+', phone: '(555) 456-2109', email: 'samuel.nakamura@email.com', address: '1920 Cottonwood Ave, Las Vegas, NV 89101', insuranceProvider: 'Kaiser Permanente', emergencyContact: 'Yuki Nakamura — (555) 456-2110', primaryPhysician: 'Dr. James Whitfield' },
    { id: 'PAT-024', name: 'Isabella Moreno', age: 44, gender: 'Female', dob: '1982-05-17', bloodType: 'O-', phone: '(555) 567-3210', email: 'isabella.moreno@email.com', address: '425 Beechwood Court, San Antonio, TX 78201', insuranceProvider: 'Aetna Health', emergencyContact: 'Luis Moreno — (555) 567-3211', primaryPhysician: 'Dr. Anita Desai' },
    { id: 'PAT-025', name: 'Kevin O\'Brien', age: 53, gender: 'Male', dob: '1973-08-30', bloodType: 'B+', phone: '(555) 678-4321', email: 'kevin.obrien@email.com', address: '2100 Cypress Street, Pittsburgh, PA 15201', insuranceProvider: 'Humana Inc', emergencyContact: 'Megan O\'Brien — (555) 678-4322', primaryPhysician: 'Dr. Sarah Jenkins' },
    { id: 'PAT-026', name: 'Amara Diallo', age: 37, gender: 'Female', dob: '1989-01-05', bloodType: 'A-', phone: '(555) 789-5432', email: 'amara.diallo@email.com', address: '810 Sequoia Boulevard, Oakland, CA 94601', insuranceProvider: 'Blue Cross Blue Shield', emergencyContact: 'Mamadou Diallo — (555) 789-5433', primaryPhysician: 'Dr. Karen Obeid' },
    { id: 'PAT-027', name: 'Henry Chang', age: 70, gender: 'Male', dob: '1956-04-02', bloodType: 'O+', phone: '(555) 890-6543', email: 'henry.chang@email.com', address: '1475 Palm Drive, Honolulu, HI 96801', insuranceProvider: 'Kaiser Permanente', emergencyContact: 'Mei-Ling Chang — (555) 890-6544', primaryPhysician: 'Dr. Michael Chen' },
    { id: 'PAT-028', name: 'Sophia Bennett', age: 28, gender: 'Female', dob: '1998-10-19', bloodType: 'AB+', phone: '(555) 901-7654', email: 'sophia.bennett@email.com', address: '335 Ironwood Place, Tampa, FL 33601', insuranceProvider: 'Cigna Health', emergencyContact: 'Andrew Bennett — (555) 901-7655', primaryPhysician: 'Dr. Rachel Torres' },
    { id: 'PAT-029', name: 'Marcus Taylor', age: 42, gender: 'Male', dob: '1984-07-14', bloodType: 'B-', phone: '(555) 012-8765', email: 'marcus.taylor@email.com', address: '2680 Oakwood Terrace, Memphis, TN 38101', insuranceProvider: 'UnitedHealthcare', emergencyContact: 'Denise Taylor — (555) 012-8766', primaryPhysician: 'Dr. James Whitfield' },
    { id: 'PAT-030', name: 'Elena Volkov', age: 35, gender: 'Non-Binary', dob: '1991-02-28', bloodType: 'A+', phone: '(555) 321-9876', email: 'elena.volkov@email.com', address: '590 Birchwood Lane, Washington, DC 20001', insuranceProvider: 'Aetna Health', emergencyContact: 'Dmitri Volkov — (555) 321-9877', primaryPhysician: 'Dr. Anita Desai' },
  ],
}));
