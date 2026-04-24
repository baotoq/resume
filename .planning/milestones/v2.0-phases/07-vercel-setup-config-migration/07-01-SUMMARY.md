---
phase: 07-vercel-setup-config-migration
plan: "01"
subsystem: config
tags: [vercel, next.js, github-actions, security-headers, env-vars, logos]
dependency_graph:
  requires: []
  provides: [vercel-config, security-headers, clearbit-logos, server-env-vars, vercel-workflow]
  affects: [next.config.ts, .github/workflows/deploy.yml, src/app/page.tsx, src/data/resume.md]
tech_stack:
  added: []
  patterns: [next.js-remotePatterns, next.js-headers, vercel-cli-deploy, server-only-env-vars]
key_files:
  modified:
    - next.config.ts
    - .github/workflows/deploy.yml
    - src/app/page.tsx
    - src/data/resume.md
decisions:
  - "Strip all GitHub Pages config from next.config.ts and replace with Vercel-compatible config including security headers and Clearbit remotePatterns"
  - "Replace deploy.yml entirely (not amend) to remove incompatible GitHub Pages permissions block"
  - "Rename NEXT_PUBLIC_EMAIL/PHONE to EMAIL/PHONE — page.tsx is a Server Component, safe for server-only vars"
  - "Clearbit Logo API format: https://logo.clearbit.com/<domain>"
  - "Keep logo_url: '#' for AS White Global unchanged — LogoImage.tsx briefcase fallback handles it"
metrics:
  duration: "~1 minute"
  completed: "2026-04-22"
  tasks_completed: 2
  files_modified: 4
---

# Phase 7 Plan 01: Vercel Config Migration Summary

**One-liner:** Stripped GitHub Pages static export config, added Vercel-compatible security headers and Clearbit remotePatterns, replaced GitHub Actions workflow with Vercel CLI three-step deploy, and renamed env vars to server-only.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Rewrite next.config.ts and update Clearbit logo URLs | 68503b0 | next.config.ts, src/data/resume.md |
| 2 | Replace deploy.yml workflow and rename env vars in page.tsx | 95659c2 | .github/workflows/deploy.yml, src/app/page.tsx |

## What Changed

### next.config.ts
- Removed: `const isProd`, `output: "export"`, `basePath`, `assetPrefix`, `images.unoptimized: true`
- Added: `async headers()` with three security headers (`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: origin-when-cross-origin`) using `source: "/:path*"`
- Added: `images.remotePatterns` with `{ protocol: "https", hostname: "logo.clearbit.com" }`
- Kept: `reactCompiler: true`

### src/data/resume.md
- `covergo.com` → `https://logo.clearbit.com/covergo.com`
- `upmesh.io` → `https://logo.clearbit.com/upmesh.io`
- `nashtech.com` → `https://logo.clearbit.com/nashtech.com`
- `"#"` (AS White Global) — unchanged, briefcase fallback handles it

### .github/workflows/deploy.yml
- Replaced entire file — removed GitHub Pages multi-job structure, `permissions:` block, GitHub Pages actions
- New: single `deploy` job using Vercel CLI three-step pattern: `vercel pull → vercel build → vercel deploy --prebuilt --prod`
- Branch trigger: `master` (unchanged)
- Concurrency group: `vercel-production` (was `pages`)

### src/app/page.tsx
- `process.env.NEXT_PUBLIC_EMAIL` → `process.env.EMAIL`
- `process.env.NEXT_PUBLIC_PHONE` → `process.env.PHONE`
- No other changes — file remains a Server Component

## Verification Results

- `npm run build` exits 0 (both after Task 1 and Task 2)
- All grep acceptance criteria pass (0 occurrences of removed items, 1 occurrence of each added item)
- 3 Clearbit logo URLs in resume.md confirmed

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — no placeholder data introduced. The `logo_url: "#"` for AS White Global pre-existed and is handled by the briefcase fallback in LogoImage.tsx.

## Threat Surface Scan

All three security headers added to next.config.ts directly address the threat register:
- T-07-01 (X-Frame-Options: SAMEORIGIN) — mitigated
- T-07-02 (X-Content-Type-Options: nosniff) — mitigated
- T-07-03 (Referrer-Policy: origin-when-cross-origin) — mitigated
- T-07-04 (server-only env vars) — mitigated by removing NEXT_PUBLIC_ prefix

No new threat surface introduced beyond what was planned.

## Manual Prerequisites (for Plan 02)

The workflow will fail until these GitHub repo secrets are added:
1. Run `npx vercel@latest link` in project root — creates `.vercel/project.json`
2. Extract `orgId` and `projectId` from `.vercel/project.json`
3. Add to GitHub repo Settings > Secrets > Actions: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
4. In Vercel dashboard: set env vars `EMAIL` and `PHONE` (server-only, no NEXT_PUBLIC_ prefix)
5. Disable Vercel Git auto-deploy: Settings > Git > "Ignored Build Step" → `exit 1`

Also: if `.env.local` exists locally with `NEXT_PUBLIC_EMAIL`/`NEXT_PUBLIC_PHONE`, rename those keys to `EMAIL`/`PHONE`.

## Self-Check: PASSED

- next.config.ts: exists, contains reactCompiler + headers() + remotePatterns, no GitHub Pages settings
- src/data/resume.md: 3 Clearbit URLs confirmed
- .github/workflows/deploy.yml: Vercel CLI workflow, no GitHub Pages remnants
- src/app/page.tsx: server-only EMAIL/PHONE env vars
- Commits: 68503b0 and 95659c2 confirmed in git log
