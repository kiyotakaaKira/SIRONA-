# HealthMesh AI Runbook

## Overview
HealthMesh AI is a full-stack Next.js and Express monorepo using Supabase for authentication and database management, and Three.js (React Three Fiber) for 3D visualizations.

## 1. Prerequisites
- **Node.js**: v18+ (v20 recommended)
- **pnpm**: v8+ (`npm install -g pnpm`)
- **Docker** (optional, for local Supabase)

## 2. Installation
From the root directory of the monorepo:
```bash
# Install all workspace dependencies
pnpm install
```

## 3. Environment Variables
You need to set up environment variables for both the Web and API workspaces.

### Web App (`apps/web/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
NEXT_PUBLIC_API_URL="http://localhost:4000"
```
*(Note: If Supabase env vars are left as the default placeholder, the app enters **Demo Mode** and bypasses authentication for easy demonstration).*

### API Server (`apps/api/.env`)
```env
PORT=4000
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
QR_SECRET="your-secure-qr-signing-key"
AI_MOCK="true" # Set to false to enable real Gemini/DeepSeek integration
```

## 4. Development
To run the full stack locally:
```bash
# Run both frontend and backend concurrently
pnpm run dev
```

Alternatively, to run them individually:
```bash
pnpm --filter web run dev
pnpm --filter api run dev
```
The web app will be available at `http://localhost:3000` and the API at `http://localhost:4000`.

## 5. Build
To verify production builds:
```bash
pnpm run build
```
This will compile the TypeScript backend and statically optimize the Next.js frontend.

## 6. Architecture Map
- `apps/web`: Next.js 15 React application
- `apps/api`: Express backend handling Webhooks and 3rd party AI integrations
- `packages/ui`: Shared Tailwind + Framer Motion component library
- `packages/config`: Shared ESLint, TS, and Tailwind configurations

## 7. Deployment
- **Web**: Designed to be deployed on Vercel. Ensure the `NEXT_PUBLIC_*` variables are set in the Vercel dashboard.
- **API**: Designed to be deployed on Render, Railway, or Heroku. Ensure `SUPABASE_SERVICE_ROLE_KEY` is kept secure.
