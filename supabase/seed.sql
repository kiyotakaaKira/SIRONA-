-- seed.sql
-- Seed data for HealthMesh AI

-- Demo Users (Using predictable UUIDs for linking)
-- Patient: uuid-patient-1
-- Hospital 1: uuid-hospital-1
-- Hospital 2: uuid-hospital-2
-- Pharmacy: uuid-pharmacy-1
-- Insurer: uuid-insurance-1

INSERT INTO profiles (id, role, full_name, org_name) VALUES
('11111111-1111-1111-1111-111111111111', 'patient', 'John Doe', NULL),
('22222222-2222-2222-2222-222222222222', 'hospital', 'Apollo Demo Hospital', 'Apollo Demo Hospital'),
('33333333-3333-3333-3333-333333333333', 'hospital', 'Mercy Medical Center', 'Mercy Medical Center'),
('44444444-4444-4444-4444-444444444444', 'pharmacy', 'Walgreens Pharmacy', 'Walgreens Pharmacy'),
('55555555-5555-5555-5555-555555555555', 'insurance', 'Blue Cross Insurance', 'Blue Cross Insurance');

INSERT INTO patients (id, blood_group, vault_key_fingerprint, emergency_contact) VALUES
('11111111-1111-1111-1111-111111111111', 'O+', 'demofingerprint12345', '{"name": "Jane Doe", "phone": "555-1234", "relation": "Wife"}');

-- Sample Records
INSERT INTO records (id, patient_id, category, title, storage_path, encrypted, issued_by) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'prescription', 'Amoxicillin Prescription', 'vault-records/11/aa.enc', true, '22222222-2222-2222-2222-222222222222'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'lab_report', 'Complete Blood Count', 'vault-records/11/bb.enc', true, '22222222-2222-2222-2222-222222222222'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'allergy', 'Penicillin Allergy Document', 'vault-records/11/cc.enc', true, '33333333-3333-3333-3333-333333333333'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'medication_history', '6-Month Med History', 'vault-records/11/dd.enc', true, '22222222-2222-2222-2222-222222222222'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'insurance_doc', 'Health Policy Card', 'vault-records/11/ee.enc', true, '55555555-5555-5555-5555-555555555555');

-- Sample Prescriptions for the 'prescription' record
INSERT INTO prescriptions (record_id, doctor_name, doctor_signature_hash, medicine_list, qr_token, status) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dr. Smith', 'hash123', '[{"name": "Amoxicillin", "dosage": "500mg"}]', 'qr-demo-amox-token', 'active');

-- Consent Grants
INSERT INTO consent_grants (patient_id, requester_profile_id, purpose, scope, duration_type, status) VALUES
-- 1 Approved for Hospital 2
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Consultation', '{"lab_report", "allergy"}', '24h', 'approved'),
-- 2 Pending (Pharmacy and Insurer)
('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Dispense Medication', '{"prescription"}', 'one_time', 'pending'),
('11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'Claim Verification', '{"prescription", "lab_report"}', '1_week', 'pending');
