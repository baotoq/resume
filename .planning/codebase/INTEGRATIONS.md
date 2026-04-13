# External Integrations

**Analysis Date:** 2026-04-13

## APIs & External Services

**Font CDN:**
- Google Fonts (via `next/font/google`) - Serves Geist Sans and Geist Mono typefaces; self-hosted at build time
  - SDK/Client: `next/font/google` (built into Next.js)
  - Auth: None required
  - Usage: `src/app/layout.tsx`

**External Image Sources:**
- Arbitrary external URLs - Company logos loaded via `<img>` tags in `src/components/LogoImage.tsx`
  - Source URLs come from `logo_url` field in `src/data/resume.md` YAML frontmatter
  - No domain allowlist enforced (static export means `next/image` remote patterns are not applicable)
  - Error state handled: `LogoImage` falls back to an inline SVG icon when image load fails

No other third-party service SDKs are present.

## Data Storage

**Databases:**
- None — no database client, ORM, or connection string detected

**File Storage:**
- Local filesystem only — resume content read from `src/data/resume.md` at build time in `src/app/page.tsx` using Node.js `fs.readFileSync`
- Static assets served from `public/` (SVG files: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`)

**Caching:**
- Next.js static export caching only — the entire site is pre-rendered; no runtime cache store
- `types/cache-life.d.ts` is auto-generated but the `"use cache"` directive is not used in any source file

## Authentication & Identity

**Auth Provider:**
- None — no authentication library or provider configured

## Monitoring & Observability

**Error Tracking:**
- None

**Logs:**
- None configured beyond Next.js default build/dev output

## CI/CD & Deployment

**Hosting:**
- GitHub Pages — deployed under `/resume` base path (set via `basePath: "/resume"` in `next.config.ts`)
- Workflow file: `.github/workflows/deploy.yml`

**CI Pipeline:**
- GitHub Actions — triggers on push to `master` branch and manual `workflow_dispatch`
- Build job: checkout → setup Node.js 22 (npm cache) → `npm ci` → `npm run build` → upload `out/` as Pages artifact
- Deploy job: depends on build job; deploys artifact to GitHub Pages environment
- No test or lint step in CI pipeline

## Environment Configuration

**Required env vars:**
- None required — site builds and renders correctly without any env vars

**Optional env vars:**
- `NEXT_PUBLIC_EMAIL` - Contact email shown in header; set as GitHub Actions secret/variable if desired
- `NEXT_PUBLIC_PHONE` - Contact phone shown in header; set as GitHub Actions secret/variable if desired

**Secrets location:**
- No secrets committed; optional contact details injected via CI environment variables

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2026-04-13*
