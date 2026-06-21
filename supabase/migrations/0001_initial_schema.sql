-- 0001_initial_schema.sql
-- Initial Schema for HealthMesh AI

CREATE TYPE user_role AS ENUM ('patient', 'hospital', 'pharmacy', 'insurance', 'doctor');
CREATE TYPE record_category AS ENUM ('prescription', 'lab_report', 'allergy', 'medication_history', 'insurance_doc');
CREATE TYPE prescription_status AS ENUM ('active', 'dispensed', 'expired', 'revoked');
CREATE TYPE grant_duration_type AS ENUM ('one_time', '24h', '1_week', 'until_discharge', 'custom');
CREATE TYPE grant_status AS ENUM ('pending', 'approved', 'denied', 'revoked', 'expired', 'break_glass');
CREATE TYPE capsule_type AS ENUM ('full', 'emergency');

-- Profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY, -- maps to auth.users
    role user_role NOT NULL,
    full_name TEXT NOT NULL,
    org_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients
CREATE TABLE patients (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    blood_group TEXT,
    vault_key_fingerprint TEXT NOT NULL,
    emergency_contact JSONB
);

-- Delegates
CREATE TABLE delegates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    delegate_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    relation TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Records
CREATE TABLE records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    category record_category NOT NULL,
    title TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    encrypted BOOLEAN DEFAULT TRUE,
    issued_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prescriptions
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
    doctor_name TEXT NOT NULL,
    doctor_signature_hash TEXT NOT NULL,
    medicine_list JSONB NOT NULL,
    qr_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    status prescription_status DEFAULT 'active'
);

-- Consent Grants
CREATE TABLE consent_grants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    requester_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    purpose TEXT NOT NULL,
    scope TEXT[] NOT NULL,
    duration_type grant_duration_type NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    status grant_status DEFAULT 'pending',
    is_emergency BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    decided_at TIMESTAMP WITH TIME ZONE
);

-- Access Logs
CREATE TABLE access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consent_grant_id UUID NOT NULL REFERENCES consent_grants(id) ON DELETE CASCADE,
    accessed_record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
    accessor_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fraud Flags
CREATE TABLE fraud_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    risk_score NUMERIC(3, 2) CHECK (risk_score >= 0 AND risk_score <= 1),
    flag_type TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Continuity Capsules
CREATE TABLE continuity_capsules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    capsule_type capsule_type NOT NULL,
    summary JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id UUID NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    payload JSONB,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
