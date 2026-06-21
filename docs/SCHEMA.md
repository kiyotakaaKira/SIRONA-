# Database Schema Overview

- **`profiles`**: Core identity table linked to `auth.users`, storing role and basic info.
- **`patients`**: Extended profile data for patients, including encrypted vault key fingerprint.
- **`delegates`**: Trusted family members/delegates who can manage a patient's consent.
- **`records`**: Patient's health records metadata (encrypted files stored in Supabase Storage).
- **`prescriptions`**: Detailed prescription data linked to a record, including QR token and validation.
- **`consent_grants`**: The core security layer recording access permissions requested and granted.
- **`access_logs`**: Detailed log of when a specific record was accessed under a specific grant.
- **`fraud_flags`**: Risk analysis results associated with prescriptions.
- **`continuity_capsules`**: AI-generated structured summaries of patient's health history.
- **`audit_logs`**: Immutable, trigger-generated trail of all security-sensitive actions.
- **`notifications`**: User-facing alerts and messages.
