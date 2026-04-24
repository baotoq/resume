---
phase: 07-vercel-setup-config-migration
verified: 2026-04-22T00:00:00Z
status: passed
score: 7/7 must-haves verified
overrides_applied: 2
overrides:
  - must_have: "deploy.yml uses vercel pull/build/deploy pattern with master branch trigger"
    reason: "User chose Vercel native Git integration instead of GitHub Actions + Vercel CLI. deploy.yml was deleted in commit 6568623. Functional outcome is identical: push to master triggers live deployment. User explicitly attested this satisfies VERCEL-03."
    accepted_by: "user (task prompt attestation)"
    accepted_at: "2026-04-22T00:00:00Z"
  - must_have: "Push to main branch triggers a Vercel deployment automatically via the new GitHub Actions workflow"
    reason: "ROADMAP SC2 specified GitHub Actions workflow; user chose Vercel native Git integration. Same trigger (push to master), different mechanism. User confirmed live deployment at https://resume-ruddy-one-23.vercel.app/."
    accepted_by: "user (task prompt attestation)"
    accepted_at: "2026-04-22T00:00:00Z"
deferred: []
---

# Phase 7: Vercel Setup & Config Migration — Verification Report

**Phase Goal:** Site builds and deploys on Vercel with CI/CD — all static-export constraints removed and quick-win improvements landed in one atomic change
**Verified:** 2026-04-22
**Status:** PASSED
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `npm run build` succeeds with no `output: 'export'`, basePath, assetPrefix, or images.unoptimized in next.config.ts | VERIFIED | next.config.ts contains only `reactCompiler`, `headers()`, and `images.remotePatterns`. Grep confirms zero matches for `output`, `basePath`, `assetPrefix`, `unoptimized`, `isProd`. Build completes to static pages in 254ms. |
| 2 | Push to master triggers a Vercel deployment automatically | PASSED (override) | deploy.yml deleted (commit 6568623). Vercel native Git integration replaces it — push to master triggers live deployment. User attested live site at https://resume-ruddy-one-23.vercel.app/. Override accepted: mechanism differs, outcome identical. |
| 3 | Site is live on a Vercel URL with EMAIL and PHONE env vars resolving correctly in the rendered page | VERIFIED | page.tsx reads `process.env.EMAIL` and `process.env.PHONE` (no NEXT_PUBLIC_ prefix). User confirmed baotoq@outlook.com and +84 0708 270 396 visible in rendered HTML at live URL. HTTP 200 confirmed. |
| 4 | Company logos render via `next/image` without 404s (remotePatterns configured) | VERIFIED | next.config.ts has `images.remotePatterns: [{ protocol: "https", hostname: "logo.clearbit.com" }]`. resume.md has 3 Clearbit URLs (covergo.com, upmesh.io, nashtech.com). LogoImage.tsx uses `next/image` `<Image>` with error fallback to briefcase SVG for `"#"` src (AS White Global). User confirmed no 404s. |
| 5 | HTTP security headers present in Vercel response (X-Frame-Options, X-Content-Type-Options, Referrer-Policy) | VERIFIED | next.config.ts `headers()` returns all three headers for `source: "/:path*"`. User confirmed via `curl -I` on live URL. |
| 6 | next.config.ts has no static-export constraints and has security headers and remotePatterns | VERIFIED | Full file read: 24 lines, no GitHub Pages settings, correct structure. |
| 7 | src/app/page.tsx reads process.env.EMAIL and process.env.PHONE (no NEXT_PUBLIC_ prefix) | VERIFIED | Lines 16-17: `process.env.EMAIL ?? ""` and `process.env.PHONE ?? ""`. Grep confirms zero matches for `NEXT_PUBLIC_`. |

**Score:** 7/7 truths verified (2 via user override, 5 via code inspection)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `next.config.ts` | Cleaned config with headers and remotePatterns | VERIFIED | 24 lines. Contains `reactCompiler: true`, `async headers()` with 3 security headers, `images.remotePatterns` with logo.clearbit.com. Zero banned patterns. |
| `.github/workflows/deploy.yml` | Vercel CLI deployment workflow | PASSED (override) | File deleted in commit 6568623 per user decision to use Vercel native Git integration. See override. |
| `src/app/page.tsx` | Server-only env var reads | VERIFIED | Reads `process.env.EMAIL` and `process.env.PHONE`. No NEXT_PUBLIC_ prefix. |
| `src/data/resume.md` | Clearbit logo URLs | VERIFIED | 3 Clearbit URLs confirmed at lines 11, 23, 48. `logo_url: "#"` at line 37 unchanged. |
| `src/components/LogoImage.tsx` | next/image usage with error fallback | VERIFIED | Uses `<Image>` from next/image. Has `onError={() => setHasError(true)}` fallback to briefcase SVG when src is `"#"` or invalid. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `next.config.ts` remotePatterns | `src/data/resume.md` logo_url values | hostname `logo.clearbit.com` must match | VERIFIED | remotePatterns hostname `logo.clearbit.com` matches all 3 logo_url entries in resume.md. |
| `.github/workflows/deploy.yml` | Vercel platform | VERCEL_TOKEN + secrets | PASSED (override) | deploy.yml deleted; Vercel native Git integration handles deployment trigger. |
| `src/app/page.tsx` | Vercel env vars | `process.env.EMAIL` / `process.env.PHONE` | VERIFIED | Code reads server-only env vars. User confirmed EMAIL and PHONE configured in Vercel dashboard and resolving in production. |
| `src/components/LogoImage.tsx` | `src/data/resume.md` logo_url | `<Image src={src}>` receiving Clearbit URLs | VERIFIED | LogoImage.tsx is a client component using next/image. resume.md provides 3 Clearbit URLs. Wiring through WorkExperience component confirmed by existing phase. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|-------------------|--------|
| `src/app/page.tsx` | `email`, `phone` | `process.env.EMAIL`, `process.env.PHONE` | Yes — Vercel dashboard env vars, user confirmed values in rendered HTML | FLOWING |
| `src/app/page.tsx` | `resume` | `fs.readFileSync` + `gray-matter` from `src/data/resume.md` | Yes — reads actual file at runtime | FLOWING |
| `src/components/LogoImage.tsx` | `src` prop | logo_url from resume.md via WorkExperience chain | Yes — Clearbit URLs resolve to actual logo images | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build succeeds without static-export config | `npm run build` | Exit 0, 4 static pages generated in 254ms | PASS |
| next.config.ts has no banned settings | `grep -c "output\|basePath\|assetPrefix\|unoptimized\|isProd" next.config.ts` | 0 matches | PASS |
| Security headers in config | `grep -c "X-Frame-Options\|X-Content-Type-Options\|Referrer-Policy" next.config.ts` | 3 matches | PASS |
| Clearbit remotePatterns configured | `grep -c "logo.clearbit.com" next.config.ts` | 1 match | PASS |
| 3 Clearbit logo URLs in resume.md | `grep -c "logo.clearbit.com" src/data/resume.md` | 3 matches | PASS |
| Server-only env vars in page.tsx | `grep -c "NEXT_PUBLIC_" src/app/page.tsx` | 0 matches | PASS |
| Live site HTTP 200 + security headers | User-attested via curl -I | HTTP 200, x-frame-options, x-content-type-options, referrer-policy confirmed | PASS (attested) |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| VERCEL-01 | 07-01 | Build succeeds without `output: 'export'` and GitHub Pages settings | SATISFIED | next.config.ts verified clean; `npm run build` passes |
| VERCEL-02 | 07-02 | Site live on Vercel with EMAIL/PHONE env vars | SATISFIED | User confirmed live URL https://resume-ruddy-one-23.vercel.app/ with contact data in HTML |
| VERCEL-03 | 07-01, 07-02 | Push to master triggers automatic Vercel deployment | SATISFIED (override) | Vercel native Git integration replaces deploy.yml; same trigger, confirmed working |
| IMG-01 | 07-01 | Company logos via next/image with remotePatterns | SATISFIED | remotePatterns configured; LogoImage.tsx uses next/image; 3 Clearbit URLs in resume.md; briefcase fallback for "#" |
| SEC-01 | 07-01 | HTTP security headers in next.config.ts headers() | SATISFIED | All 3 headers present in config and confirmed in live response |
| CFG-01 | 07-01 | EMAIL/PHONE without NEXT_PUBLIC_ prefix, server-only | SATISFIED | page.tsx reads process.env.EMAIL/PHONE; user confirmed values in HTML not JS bundles |
| VERCEL-04 | — | GitHub Pages decommissioned (Pages source set to None) | NOT IN SCOPE | Assigned to Phase 8 per REQUIREMENTS.md traceability table and ROADMAP.md |

**Orphaned requirements check:** VERCEL-04 appears in REQUIREMENTS.md mapped to Phase 8 — correctly out of scope for Phase 7.

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| None | — | — | — |

No TODO/FIXME/placeholder comments found in modified files. No empty implementations. No hardcoded empty data flowing to render. The `logo_url: "#"` for AS White Global is intentional — handled by LogoImage.tsx briefcase fallback, pre-existed Phase 7, and explicitly preserved.

### Human Verification Required

None. The user provided explicit attestation covering all items that required live-site verification:

- Live URL https://resume-ruddy-one-23.vercel.app/ returns HTTP 200
- Security headers confirmed via `curl -I`: x-frame-options, x-content-type-options, referrer-policy
- Email (baotoq@outlook.com) and phone (+84 0708 270 396) present in rendered HTML, not in JS bundles
- Clearbit logos load; AS White Global briefcase fallback renders correctly
- Vercel native Git integration confirmed triggering on push to master

### Gaps Summary

No gaps. All six Phase 7 requirements are satisfied. The only deviation is the deployment mechanism: deploy.yml was deleted and Vercel native Git integration was used in place of GitHub Actions + Vercel CLI. This achieves identical functional outcome (push to master triggers live Vercel deployment) and was explicitly accepted by the user.

---

_Verified: 2026-04-22_
_Verifier: Claude (gsd-verifier)_
