# HealthMesh AI
**Patient-Owned Prescription Intelligence Network**

HealthMesh AI (formerly Sirona Medical Intelligence) is a modern, unified portal system designed to securely connect Patients, Hospitals, Pharmacies, and Insurance providers. It empowers patients with cryptographic ownership of their medical records while providing AI-powered insights, anomaly detection, and cross-stakeholder continuity.

## Tech Stack
- **Frontend:** Next.js 15 (React 19), Tailwind CSS v4, Framer Motion
- **Architecture:** pnpm workspaces (Monorepo)
- **Database / Auth:** Supabase (PostgreSQL, RLS)
- **State Management:** Zustand
- **AI Integration:** Gemini / DeepSeek APIs

## Features
### Patient Portal
- Cryptographically sealed Document Vault.
- Granular, time-bound Consent Management.
- AI-Generated "Continuity Capsule" for medical history synthesis.
- Immutable Audit Timeline.

### Hospital Portal
- Global patient search.
- Break-glass emergency access protocols.
- Digital prescribing.

### Pharmacy Portal
- Cryptographic QR Verification for prescriptions.
- AI-powered fraud and duplicate detection.

### Insurance Portal
- Claim verification linked to cryptographic records.

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kiyotakaaKira/SIRONA-.git
   cd SIRONA-/MEDOO
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   Copy the example environment file and fill in your Supabase and AI keys:
   ```bash
   cp .env.example .env.local
   ```

4. **Run the Development Server:**
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:3000`.

## Documentation
For deeper technical insights, please refer to the `docs/` directory:
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Project Status](docs/PROJECT_STATUS.md)
- [Security Audit](docs/SECURITY_AUDIT.md)
- [Feature Checklist](docs/FEATURES.md)
- [Roadmap](docs/ROADMAP.md)

## Contributors
- Project created and maintained by the HealthMesh AI (Sirona) team.
