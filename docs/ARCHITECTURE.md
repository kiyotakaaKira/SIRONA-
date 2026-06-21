# HealthMesh AI Architecture

## Monolithic Workspace
The project is built as a highly structured monorepo powered by `pnpm`.

### Packages
- `apps/web`: The core Next.js 15 App Router application. This handles all routing, layouts, page rendering, and API endpoints.
- `packages/ui`: A shared UI component library (currently wired via workspace bindings) containing reusable elements like GlassPanels, Buttons, and framer-motion variants.
- `packages/config`: Shared configuration files (TypeScript, ESLint, Tailwind) to ensure consistency across the workspace.

## Frontend Architecture
- **Next.js 15 (App Router):** Utilizes React Server Components (RSC) where possible, but heavily relies on Client Components (`"use client"`) for the highly interactive Framer Motion dashboards.
- **Tailwind CSS v4:** Driving the visual design system, utilizing CSS custom properties for gradients and glassmorphic (`backdrop-blur`) effects.
- **Zustand (`useStore`):** The primary state management architecture for the MVP. It orchestrates a sophisticated mock database simulating Vault documents, Consent grants, and Audit logs.
- **Framer Motion:** Handles all layout transitions, micro-animations, and dynamic rendering sequences.

## Backend Architecture (Pending Migration)
- **Middleware:** Next.js Middleware (`middleware.ts`) intercepts requests to enforce rudimentary role-based routing (checking `healthmesh_token`).
- **Route Handlers:** API routes located in `apps/web/app/api` handle server-side logic, such as AI model integration (Counterfeit Check) and delegated consent validation.
- **Database (Supabase):** While the Supabase client is initialized via `@supabase/ssr`, the full migration of the Zustand mock state into Supabase Postgres tables with Row Level Security (RLS) is ongoing.

## AI Integrations
- Large Language Models (Gemini/DeepSeek) are integrated into specific route handlers to synthesize patient narratives (Continuity Capsule) and perform semantic analysis on prescription data.
