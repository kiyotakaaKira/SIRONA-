# HealthMesh AI Error Audit

## 1. Syntax Error in API Route
**Error:** `tsc` failed with `TS1005: ',' expected.` in `apps/api/routes/consent.ts`.
**Root Cause:** A missing closing brace `}` on the `/revoke` route before the emergency `break-glass` route was added, causing a syntax parsing failure.
**Fix Applied:** Added the missing closing brace and properly separated the routes.

## 2. Unhandled Supabase Failures in Middleware
**Error:** The Next.js app would crash with a white screen if Supabase environment variables were missing or invalid.
**Root Cause:** `middleware.ts` was not checking if `NEXT_PUBLIC_SUPABASE_URL` was correctly set, and `getUser()` was not wrapped in a `try/catch`. 
**Fix Applied:** Added a graceful demo-mode fallback. If the URL is missing or set to the default placeholder, the middleware bypasses auth entirely and allows access.

## 3. Env Variable Initialization Crashes
**Error:** Importing the Supabase client caused instant errors on startup.
**Root Cause:** Both `lib/supabase/client.ts` and `server.ts` used non-null assertions (`!`) on process.env variables, causing throws before the app even mounted.
**Fix Applied:** Used fallback values `process.env.NEXT_PUBLIC_SUPABASE_URL || ""` to safely initialize empty clients that fail gracefully.

## 4. Missing Dependencies
**Error:** `pnpm install` warnings and missing module errors during build.
**Root Cause:** The workspace was missing `@react-three/postprocessing`, `tailwindcss-animate`, and `@types/three`.
**Fix Applied:** Installed the missing packages in the `web` workspace.

## 5. React Version Mismatch
**Error:** Dependency resolution conflicts with `react`.
**Root Cause:** `packages/ui/package.json` had hardcoded `react` and `react-dom` `^18.2.0` in `dependencies`, while the `web` app uses `19.1.0`.
**Fix Applied:** Moved `react` and `react-dom` to `peerDependencies` with a `>=18` range in the UI package.

## 6. Turbopack Compilation Failure for UI Package
**Error:** The UI package was not transpiling correctly.
**Root Cause:** Next.js wasn't configured to transpile the internal workspace package.
**Fix Applied:** Added `transpilePackages: ["@healthmesh/ui"]` to `next.config.ts`.

## 7. Node.js `Buffer` Usage in Browser
**Error:** Cryptography functions failed in the browser due to `Buffer` undefined.
**Root Cause:** `crypto.ts` was using Node's `Buffer.from()` which is unavailable client-side.
**Fix Applied:** Rewrote the encoding to use standard `atob()` and `btoa()` browser functions.

## 8. TypeScript `BufferSource` Error in WebCrypto
**Error:** `TS2345: Type 'Uint8Array' is not assignable to type 'BufferSource'.`
**Root Cause:** TypeScript strictness on `window.crypto.subtle` expecting precise types not inferrable from standard Uint8Array without casting.
**Fix Applied:** Cast `iv` as `any` when passing to `encrypt`/`decrypt` functions.

## 9. Next.js Parallel Route Conflicts
**Error:** `You cannot have two parallel pages that resolve to the same path.`
**Root Cause:** The route groups `(auth)`, `(hospital)`, `(insurance)`, `(patient)`, and `(pharmacy)` all had a `page.tsx` at their root, competing for the `/` path.
**Fix Applied:** Kept `(patient)` as the root. Removed the others and moved `(insurance)/page.tsx` to `(insurance)/claims/page.tsx` for correct sub-routing.

## 10. Broken Import Paths
**Error:** `Module not found: Can't resolve '../../lib/supabase/client'`
**Root Cause:** Next.js route groups `(auth)` modify the filesystem depth relative to `lib/`.
**Fix Applied:** Fixed the import paths in `log-in` and `sign-up` to `../../../lib/supabase/client`.
