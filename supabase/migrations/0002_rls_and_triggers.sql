-- 0002_rls_and_triggers.sql
-- Enable RLS and set up policies

ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Records Policies
CREATE POLICY "Patient can select own records"
    ON records FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Others can select records if granted consent"
    ON records FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM consent_grants cg
            WHERE cg.patient_id = records.patient_id
              AND cg.requester_profile_id = auth.uid()
              AND cg.status = 'approved'
              AND (cg.expires_at IS NULL OR cg.expires_at > NOW())
              AND (records.category::text = ANY (cg.scope))
        )
    );

-- Consent Grants Policies
CREATE POLICY "Patient can select own grants"
    ON consent_grants FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Requester can select grants they made"
    ON consent_grants FOR SELECT
    USING (auth.uid() = requester_profile_id);

-- Access Logs Policies
CREATE POLICY "Patient can select own access logs"
    ON access_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM consent_grants cg
            WHERE cg.id = access_logs.consent_grant_id
              AND cg.patient_id = auth.uid()
        )
    );

-- Audit Logs Policies (INSERT-only)
CREATE POLICY "Insert only audit logs"
    ON audit_logs FOR INSERT
    WITH CHECK (true);

-- No update/delete policy for audit logs implicitly makes them impossible to update/delete

-- Trigger function for automatic audit logging
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'consent_grants' THEN
        INSERT INTO audit_logs (actor_profile_id, action, target_table, target_id, metadata)
        VALUES (
            COALESCE(auth.uid(), NEW.requester_profile_id),
            'consent_grant_' || TG_OP,
            'consent_grants',
            NEW.id,
            jsonb_build_object('status', NEW.status, 'scope', NEW.scope)
        );
    ELSIF TG_TABLE_NAME = 'access_logs' THEN
        INSERT INTO audit_logs (actor_profile_id, action, target_table, target_id, metadata)
        VALUES (
            NEW.accessor_profile_id,
            'record_accessed',
            'access_logs',
            NEW.id,
            jsonb_build_object('record_id', NEW.accessed_record_id, 'action', NEW.action)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER consent_grants_audit_trigger
AFTER INSERT OR UPDATE ON consent_grants
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER access_logs_audit_trigger
AFTER INSERT ON access_logs
FOR EACH ROW EXECUTE FUNCTION log_audit_event();
