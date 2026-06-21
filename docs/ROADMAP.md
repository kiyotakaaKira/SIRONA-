# HealthMesh AI Roadmap

## Phase 1: Prototype & MVP (Current)
- Monorepo structural setup.
- Interactive, responsive, and dynamic user interfaces for 4 distinct stakeholder portals.
- Client-side data mocking using Zustand to demonstrate application flow.
- Core UX elements implemented (Glassmorphism, Framer Motion animations).

## Phase 2: Backend Integration & Security (Immediate Next)
- **Supabase Migration:** Replace Zustand mock data arrays with Supabase PostgreSQL tables.
- **Row Level Security (RLS):** Implement strict RLS policies to enforce patient data ownership and authorized consent grants.
- **Authentication:** Migrate from cookie-based mock routing to Supabase Auth (JWT).
- **Storage Integration:** Replace local image previews with encrypted Supabase Storage buckets for the Document Vault.

## Phase 3: AI & Network Features
- **Live AI Synthesis:** Wire the "Continuity Capsule" and "Risk Analysis" panels directly to Gemini/DeepSeek APIs.
- **Real-time Notifications:** Implement Supabase Realtime subscriptions to push instant notifications (e.g., "Pharmacy viewed your prescription") to the active client.
- **Decentralized Verification:** Expand the QR signature system to use standard PKI signatures.

## Phase 4: Production Readiness
- Complete End-to-End (E2E) testing suite via Playwright or Cypress.
- Automated CI/CD pipeline deployments via Vercel.
- Comprehensive security and penetration testing.
