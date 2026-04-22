# Phase 7: Vercel Setup & Config Migration - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Migrate the resume site from GitHub Pages static export to Vercel, unlocking full Next.js 16 runtime. Bundle three quick-win improvements atomically: next/image remote patterns (IMG-01), HTTP security headers (SEC-01), and server-only env vars (CFG-01). GitHub Pages decommission (VERCEL-04) is Phase 8.

</domain>

<decisions>
## Implementation Decisions

### Logo Image Source (IMG-01)
- **D-01:** Use **Clearbit Logo API** — change `logo_url` values in `src/data/resume.md` from domain roots to `https://logo.clearbit.com/<domain>` format (e.g., `https://logo.clearbit.com/covergo.com`).
- **D-02:** Add `{ protocol: "https", hostname: "logo.clearbit.com" }` to `remotePatterns` in `next.config.ts` — this is the only hostname needed for logos.
- **D-03:** The `"#"` placeholder `logo_url` entry stays as `"#"` — LogoImage.tsx briefcase fallback handles it. No change needed for that entry.
- **D-04:** Actual logo domains in resume.md: `covergo.com`, `upmesh.io`, `nashtech.com` — all to be converted to Clearbit format.

### Vercel Project Setup (VERCEL-02, VERCEL-03)
- **D-05:** Vercel project has **not yet been created**. Plan must include manual prerequisite steps:
  1. Run `npx vercel@latest link` in project root
  2. Extract `orgId` and `projectId` from `.vercel/project.json`
  3. Add three GitHub repo secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
  4. Disable Vercel Git Integration auto-deploy in Vercel project Settings > Git (set "Ignored Build Step" to `exit 1` or disconnect Git repo) to prevent double deploys

### GitHub Actions Workflow (VERCEL-03)
- **D-06:** Replace `.github/workflows/deploy.yml` entirely — do NOT amend. The old file has GitHub Pages permissions (`pages: write`, `id-token: write`) incompatible with the new workflow.
- **D-07:** Use `vercel pull --yes --environment=production` → `vercel build --prod` → `vercel deploy --prebuilt --prod` pattern (official Vercel KB approach, not marketplace action).
- **D-08:** Trigger on `master` branch (verified: this repo uses `master`, not `main`).
- **D-09:** No `permissions:` block needed in the new workflow.
- **D-10:** Add `concurrency: group: "vercel-production", cancel-in-progress: false` to prevent race conditions.

### next.config.ts Migration (VERCEL-01)
- **D-11:** Strip all GitHub Pages settings: `output: "export"`, `basePath`, `assetPrefix`, `images.unoptimized: true`, `isProd` constant.
- **D-12:** Keep `reactCompiler: true` — do not modify it.
- **D-13:** Security headers via `async headers()` — source: `/:path*` catch-all (NOT `/(.*)`).
- **D-14:** Headers: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: origin-when-cross-origin`.

### Env Var Rename (CFG-01)
- **D-15:** Rename `NEXT_PUBLIC_EMAIL` → `EMAIL` and `NEXT_PUBLIC_PHONE` → `PHONE` in `src/app/page.tsx`. Page is already a Server Component — safe to drop NEXT_PUBLIC_ prefix.
- **D-16:** Also rename in Vercel dashboard when setting up env vars (set as `EMAIL` and `PHONE`, not `NEXT_PUBLIC_EMAIL`).
- **D-17:** If `.env.local` exists locally with `NEXT_PUBLIC_EMAIL`/`NEXT_PUBLIC_PHONE`, it must be updated — plan should include a note.

### Claude's Discretion
- Wave grouping: VERCEL-01 (config strip) and VERCEL-03 (new workflow) MUST land in Wave 1 together — removing `output: 'export'` without a replacement workflow breaks CI. IMG-01, SEC-01, CFG-01 can be Wave 1 or Wave 2; researcher recommends two waves.
- Order of `remotePatterns` entries — Clearbit first, then any others.
- Whether to delete the `out/` directory (stale static export artifacts) — optional cleanup.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Next.js 16 Docs (local)
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md` — `headers()` API, `/:path*` catch-all pattern, security header examples
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` — `remotePatterns` configuration, Image component props
- `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md` — NEXT_PUBLIC_ behavior, server-only env vars
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/output.md` — `output: 'export'` documentation

### Current Codebase Files (read before modifying)
- `next.config.ts` — current config (all GitHub Pages settings to be stripped)
- `src/app/page.tsx` — Server Component; NEXT_PUBLIC_ var usage to be renamed
- `.github/workflows/deploy.yml` — old workflow to be replaced entirely
- `src/data/resume.md` — logo_url values to be converted to Clearbit format
- `.gitignore` — `.vercel` already excluded (line 37)

### Research
- `.planning/phases/07-vercel-setup-config-migration/07-RESEARCH.md` — comprehensive implementation guide, workflow YAML template, pitfall list, open questions

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/LogoImage.tsx` — already uses `next/image` (`<Image>`) internally; only `next.config.ts` remotePatterns needs updating. No component changes required for IMG-01.
- Briefcase fallback in LogoImage.tsx — handles `logo_url: "#"` correctly already.

### Established Patterns
- `src/app/page.tsx` is a Server Component (no `"use client"`) — safe to use server-only env vars.
- No test suite — validation is `npm run build` + manual checks against live Vercel URL.

### Integration Points
- All changes land in config files and one data file — no component code changes beyond `src/app/page.tsx` env var rename.
- `.github/workflows/deploy.yml` replacement is the critical integration point with GitHub Actions.

</code_context>

<specifics>
## Specific Ideas

- Clearbit Logo API format: `https://logo.clearbit.com/<domain>` — e.g., `https://logo.clearbit.com/covergo.com`
- Exact secrets needed in GitHub repo Settings > Secrets > Actions: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- Vercel Git Integration disable method: Settings > Git > "Ignored Build Step" → set to `exit 1`

</specifics>

<deferred>
## Deferred Ideas

- GitHub Pages decommission (VERCEL-04) — Phase 8
- Custom domain setup — out of scope (not blocking recruiter use)

</deferred>

---

*Phase: 07-vercel-setup-config-migration*
*Context gathered: 2026-04-22*
