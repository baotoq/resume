# Phase 7: Vercel Setup & Config Migration - Research

**Researched:** 2026-04-22
**Domain:** Vercel deployment, Next.js 16 config, GitHub Actions CI/CD
**Confidence:** HIGH

---

## Summary

Phase 7 migrates the resume site from GitHub Pages static export to Vercel, and bundles three quick-win improvements (next/image remote patterns, security headers, server-only env vars) into the same atomic commit. This is required because removing `output: 'export'` without a replacement deployment workflow immediately breaks CI — so VERCEL-01 (config strip) and VERCEL-03 (new workflow) MUST land in the same wave.

The codebase is already on Next.js 16 with App Router. The page component (`src/app/page.tsx`) is a Server Component — it reads files from disk and reads env vars at runtime. LogoImage.tsx already uses `next/image` but the `images` config still has `unoptimized: true` which disables optimization. The old workflow (`deploy.yml`) targets GitHub Pages and must be replaced, not amended.

The env var change (CFG-01) requires a code edit in `src/app/page.tsx`: the two vars are read as `NEXT_PUBLIC_EMAIL` and `NEXT_PUBLIC_PHONE` but the requirement is to drop the `NEXT_PUBLIC_` prefix and read them server-side only. This is safe because the page is already a Server Component with no `"use client"` directive.

**Primary recommendation:** Execute in two waves — Wave 0 creates the new GitHub Actions workflow and strips next.config.ts, Wave 1 adds security headers + remotePatterns + renames env vars. Vercel project must be linked manually (CLI) before Wave 0 so secrets exist in GitHub. Crucially, Vercel's built-in Git Integration auto-deploy must be disabled in the Vercel project settings to avoid double-deploys alongside the GitHub Actions workflow.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| VERCEL-01 | Strip `output: 'export'`, `basePath`, `assetPrefix`, `images.unoptimized`, and `isProd` from next.config.ts | Dropping `output: 'export'` re-enables full Next.js runtime; all other settings were only needed for GitHub Pages |
| VERCEL-02 | Site live on Vercel URL with EMAIL and PHONE env vars resolving in rendered page | Requires Vercel project creation + env vars set in Vercel dashboard |
| VERCEL-03 | Push to master triggers Vercel deployment via GitHub Actions | Requires VERCEL_TOKEN + VERCEL_ORG_ID + VERCEL_PROJECT_ID as GitHub repo secrets; Vercel Git Integration auto-deploy must be disabled |
| IMG-01 | Company logos render via next/image with remotePatterns (no 404s) | LogoImage.tsx already uses `<Image>` — only next.config.ts `images.remotePatterns` needs adding |
| SEC-01 | HTTP security headers in next.config.ts via `headers()` | Supported natively via `async headers()` in next.config.ts — no middleware needed |
| CFG-01 | EMAIL and PHONE read server-side only (no NEXT_PUBLIC_ prefix) | Page is already a Server Component — rename vars in page.tsx and in Vercel dashboard |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Deployment pipeline | CI/CD (GitHub Actions) | Vercel platform | GitHub Actions orchestrates build + deploy; Vercel runs the Next.js server |
| next.config.ts changes | Build config | — | All config changes are compile-time / server-startup |
| Security headers | Next.js server (next.config.ts `headers()`) | — | Headers are injected server-side per-request, not at CDN edge |
| Remote image optimization | Vercel image CDN | Next.js config (allowlist) | `remotePatterns` is the allowlist; Vercel's CDN fetches and optimizes |
| Env var delivery (EMAIL, PHONE) | Vercel dashboard (runtime env) | GitHub Actions `vercel pull` | Non-NEXT_PUBLIC_ vars are runtime-only, set in Vercel project settings |

---

## Standard Stack

### Core
| Library/Tool | Version | Purpose | Why Standard |
|---|---|---|---|
| vercel (CLI) | latest | Link project, generate `.vercel/project.json`, CI deploy | Official Vercel deployment tool |
| next | 16.2.3 (pinned) | Framework | Already installed |
| GitHub Actions | — | CI/CD trigger | Already used in project |

### No new npm packages required

All six requirements are satisfied via config file edits and a new GitHub Actions workflow YAML. No new npm dependencies.

**Environment Availability:**

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js 20 | Build | Installed via setup-node@v4 in CI | 20.x | — |
| vercel CLI | Link step (manual, local) + CI deploy | Not installed globally — user must install for link step | latest | `npx vercel@latest link` |
| GitHub repo secrets | VERCEL-03 | Must be created manually by user | — | None — blocks deploy |
| Vercel account + project | VERCEL-02 | User must create/link | — | None — prerequisite |
| `.vercel` in .gitignore | Pitfall 3 | Already present [VERIFIED: .gitignore line 37] | — | — |

---

## Architecture Patterns

### System Architecture Diagram

```
[Developer pushes to master]
        |
        v
[GitHub Actions: deploy.yml]
  1. checkout
  2. setup-node@v4 (Node 20, npm cache)
  3. npm ci
  4. npm install --global vercel@latest
  5. vercel pull --yes --environment=production   <-- downloads .vercel/output config + env vars
  6. vercel build --prod                          <-- runs next build, outputs to .vercel/output
  7. vercel deploy --prebuilt --prod              <-- uploads .vercel/output to Vercel CDN
        |
        v
[Vercel CDN / Next.js runtime]
  - Serves pages with full Next.js runtime (no static export)
  - Injects EMAIL + PHONE env vars at runtime (server-only)
  - next/image optimization active (remotePatterns allowlist enforced)
  - HTTP security headers injected via next.config.ts headers()

NOTE: Vercel's built-in Git Integration auto-deploy must be DISABLED
in Vercel project Settings > Git > "Ignored Build Step"
to prevent double deploys alongside GitHub Actions.
```

### Recommended Project Structure (changes only)

```
.github/workflows/
├── deploy.yml            # REPLACE entirely (GitHub Pages -> Vercel CLI workflow)
next.config.ts            # EDIT (strip export settings, add headers(), add remotePatterns)
src/app/page.tsx          # EDIT (NEXT_PUBLIC_EMAIL -> EMAIL, NEXT_PUBLIC_PHONE -> PHONE)
```

### Pattern 1: Vercel CLI GitHub Actions Workflow

**What:** Use `vercel pull` / `vercel build` / `vercel deploy --prebuilt` to deploy from CI without rebuilding on Vercel's servers.
**When to use:** Always — this avoids double-builds and gives CI control over the build environment.

```yaml
# Source: https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel
name: deploy
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
on:
  push:
    branches: ["master"]
  workflow_dispatch:
concurrency:
  group: "vercel-production"
  cancel-in-progress: false
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm install --global vercel@latest
      - run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**Important notes on the new workflow:**
- No `permissions` block needed (unlike the old Pages workflow which needed `pages: write`, `id-token: write`). Do NOT copy permissions from the old file.
- `concurrency` block prevents race conditions on concurrent pushes — use `cancel-in-progress: false` to let deploys complete.
- Branch is `master` (not `main`) — matches this repo's default branch. [VERIFIED: git status, existing deploy.yml]

**Key secrets required (GitHub repo Settings > Secrets > Actions):**
- `VERCEL_TOKEN` — Vercel account API token (Vercel dashboard > Account Settings > Tokens)
- `VERCEL_ORG_ID` — from `.vercel/project.json` after `vercel link`
- `VERCEL_PROJECT_ID` — from `.vercel/project.json` after `vercel link`

**Manual prerequisite steps (user must do before first push):**
1. Create Vercel project: `npx vercel@latest link` in project root
2. Extract `orgId` and `projectId` from `.vercel/project.json`
3. Add all three GitHub secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
4. In Vercel project Settings > Git: disable automatic deployments (set "Ignored Build Step" to always exit 1, or disconnect Git integration) to prevent double deploys

### Pattern 2: next.config.ts after migration

**What:** Strip all GitHub Pages settings. Add `headers()` for security. Add `images.remotePatterns` for logo domains. Use `/:path*` catch-all (canonical form from official docs).

```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md
// Source: node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      // Must enumerate actual hostnames from logo_url fields in src/data/resume.md
      { protocol: "https", hostname: "covergo.com" },
      { protocol: "https", hostname: "upmesh.io" },
      // Add all other logo_url hostnames from resume.md
    ],
  },
};

export default nextConfig;
```

**CRITICAL:** `remotePatterns` entries must match the actual hostnames used in `logo_url` fields in `src/data/resume.md`. The planner must extract these at task-authoring time. See Open Questions about logo URL content.

**Removed settings (never carry forward):**
- `output: "export"` — removed to re-enable full runtime
- `basePath: isProd ? "/resume" : ""` — GitHub Pages subpath, no longer needed
- `assetPrefix: isProd ? "/resume" : ""` — same reason
- `images.unoptimized: true` — was required by static export; removed to enable optimization
- `isProd` constant — no longer referenced

### Pattern 3: Server-only env vars (CFG-01)

**What:** Remove `NEXT_PUBLIC_` prefix from EMAIL and PHONE. These vars are already consumed in a Server Component — the prefix was only needed for static export (no server exists). With Vercel, the server reads them at runtime.

```typescript
// src/app/page.tsx — BEFORE
const email = process.env.NEXT_PUBLIC_EMAIL ?? "";
const phone = process.env.NEXT_PUBLIC_PHONE ?? "";

// src/app/page.tsx — AFTER
const email = process.env.EMAIL ?? "";
const phone = process.env.PHONE ?? "";
```

Also rename in Vercel dashboard: set env vars as `EMAIL` and `PHONE` (not `NEXT_PUBLIC_EMAIL`).

**Why this is safe:** `page.tsx` has no `"use client"` directive — it is a Server Component. [VERIFIED: code inspection of src/app/page.tsx]. The vars never reach the browser bundle.

**Warning:** Check for `.env.local` — if it contains `NEXT_PUBLIC_EMAIL`/`NEXT_PUBLIC_PHONE`, local dev breaks after rename. The project's `.gitignore` matches `.env*` so this file would not be in the repo. The plan should include a note to update `.env.local` if it exists locally.

### Anti-Patterns to Avoid

- **Don't use `amondnet/vercel-action` marketplace action.** The official Vercel KB recommends the CLI approach (`vercel pull / build / deploy`) — it is more predictable and does not rely on a third-party action.
- **Don't leave `output: 'export'` in next.config.ts.** It prevents all dynamic Next.js features. Must be fully removed.
- **Don't set `images.unoptimized: true` globally.** This disables Next.js image optimization. Remove it; use `remotePatterns` instead.
- **Don't use `NEXT_PUBLIC_` prefix for server-only data.** It bakes values into the client JS bundle at build time.
- **Don't amend the old `deploy.yml`.** Replace the file entirely — the old workflow has GitHub Pages permissions (`pages: write`, `id-token: write`) and a `github-pages` concurrency group that are incompatible with the new workflow.
- **Don't use `source: "/(.*)"` for headers catch-all.** Use `source: "/:path*"` — the canonical form in Next.js official docs.
- **Don't leave Vercel Git Integration auto-deploy enabled.** Connecting the repo in Vercel dashboard + having GitHub Actions both deploy on push = double deploys. Disable one.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Security header injection | Custom middleware | `headers()` in next.config.ts | Native Next.js feature, runs before filesystem, no runtime overhead |
| Image proxy for remote logos | Custom API route | `next/image` + `remotePatterns` | Vercel's image CDN handles optimization, caching, format negotiation |
| Build + deploy orchestration | Custom shell scripts | `vercel pull && vercel build && vercel deploy --prebuilt` | Official pattern, handles env injection and output format correctly |

---

## Common Pitfalls

### Pitfall 1: Vercel Git Integration double-deploy

**What goes wrong:** If the GitHub repo is connected to Vercel (via dashboard) AND GitHub Actions also deploys, every push triggers two deployments. The Actions deploy succeeds; the Vercel auto-deploy may fail or conflict.
**Why it happens:** `vercel link` or dashboard project creation may enable Git Integration by default.
**How to avoid:** After creating the Vercel project, go to Settings > Git and either disconnect the Git repo or set the "Ignored Build Step" command to `exit 1` so Vercel's native deploy always skips.
**Warning signs:** Two simultaneous deployments in the Vercel dashboard after a push.

### Pitfall 2: `logo_url` values are domain roots, not image paths

**What goes wrong:** `logo_url: "https://covergo.com"` in resume.md is a website URL, not a PNG. `next/image` will try to optimize it and likely get HTML back, causing a broken image.
**Why it happens:** The data was set up for `<img>` tags where any URL works. `next/image` needs an actual image file.
**How to avoid:** User must update `logo_url` values in `resume.md` to point to actual logo image files. Consider using Clearbit Logo API (`https://logo.clearbit.com/covergo.com`) as a drop-in. If using Clearbit, add `logo.clearbit.com` to `remotePatterns`.
**Warning signs:** 404 or content-type mismatch errors in browser network tab after migration.

### Pitfall 3: Missing GitHub secrets blocks the deploy silently

**What goes wrong:** The workflow runs but `vercel pull` fails with auth error. Deployment never happens.
**Why it happens:** `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` must be set as GitHub repo secrets before the first push.
**How to avoid:** Plan must include a manual prerequisite: run `vercel link` locally, extract IDs from `.vercel/project.json`, add all three secrets to GitHub.

### Pitfall 4: `.vercel/project.json` accidentally committed

**What goes wrong:** `.vercel/project.json` contains org/project IDs. If committed, it leaks project metadata (not credentials, but IDs).
**Prevention:** Already handled — `.vercel` is in `.gitignore`. [VERIFIED: .gitignore line 37]. No action needed.

### Pitfall 5: Old workflow still runs in parallel

**What goes wrong:** If the old `deploy.yml` is renamed but not deleted, both the old Pages workflow and new Vercel workflow can run. The Pages deploy fails (Pages still enabled), Vercel succeeds — confusing mixed state.
**How to avoid:** Delete the old `deploy.yml` entirely in the same commit that adds the new workflow. Phase 8 handles disabling GitHub Pages itself.

### Pitfall 6: reactCompiler compatibility

**What goes wrong:** React Compiler (`babel-plugin-react-compiler`) may conflict with certain patterns after removing the static export constraints.
**Why it happens:** The project uses `reactCompiler: true` in next.config.ts. This is an experimental feature.
**How to avoid:** Keep `reactCompiler: true` as-is — don't modify it in this phase. If build fails post-migration, isolate by temporarily disabling it to identify whether it is the cause.

---

## Runtime State Inventory

This is not a rename/refactor phase. One env var rename item:

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | None | — |
| Live service config | GitHub Pages deployment active | Phase 8 handles decommission — out of scope for Phase 7 |
| OS-registered state | None | — |
| Secrets/env vars | `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_PHONE` — code rename to `EMAIL`, `PHONE`; Vercel dashboard vars also renamed | Code edit (page.tsx) + Vercel dashboard update (manual) |
| Build artifacts | `out/` directory — stale static export output | Can be deleted; Vercel uses `.next/` and `.vercel/output/` |

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js 20 | GitHub Actions build | Installed via setup-node@v4 | 20.x | — |
| Vercel CLI (local) | Link step (one-time manual) | Not verified — user installs | latest | `npx vercel@latest link` |
| GitHub repo secrets | VERCEL-03 | Must be created manually | — | None — blocks deploy |
| Vercel account + project | VERCEL-02 | User must create | — | None — prerequisite |

**Missing dependencies with no fallback:**
- Vercel account must exist and project must be created/linked before first deploy
- GitHub secrets (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID) must be set by user

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected (no jest/vitest/playwright config) |
| Config file | None |
| Quick run command | `npm run build` |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| VERCEL-01 | `npm run build` succeeds without `output: 'export'` | smoke | `npm run build` | N/A — build itself is the test |
| VERCEL-02 | Env vars resolve on rendered page | manual | Visit Vercel URL, check HTML for email/phone values | N/A |
| VERCEL-03 | Push to master triggers Vercel deploy | manual | Push commit, observe GitHub Actions + Vercel dashboard | N/A |
| IMG-01 | Logo images load without 404 | manual | Visit Vercel URL, check Network tab for image 200s | N/A |
| SEC-01 | Security headers present in response | manual/CLI | `curl -I <vercel-url>` — inspect for X-Frame-Options etc. | N/A |
| CFG-01 | EMAIL/PHONE not in client JS bundle | manual | View page source, search JS bundles for email value | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (validates VERCEL-01 locally)
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** All 6 success criteria verified manually against live Vercel URL before `/gsd-verify-work`

### Wave 0 Gaps
- No test files to create — this phase has no unit-testable logic
- All verification is smoke/manual against the deployed environment

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | no | Resume data is static YAML read at build/runtime |
| V6 Cryptography | no | — |
| HTTP Security Headers | yes | `headers()` in next.config.ts (SEC-01) |
| Sensitive data in client bundle | yes | Remove NEXT_PUBLIC_ prefix (CFG-01) |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Clickjacking (iframe embedding) | Spoofing | `X-Frame-Options: SAMEORIGIN` |
| MIME sniffing | Tampering | `X-Content-Type-Options: nosniff` |
| Referrer leakage | Info Disclosure | `Referrer-Policy: origin-when-cross-origin` |
| Email/phone in client JS bundle | Info Disclosure | Remove `NEXT_PUBLIC_` prefix — keep vars server-only |

---

## Code Examples

### Final next.config.ts shape

```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md
// Source: node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "covergo.com" },
      { protocol: "https", hostname: "upmesh.io" },
      // Add all other logo_url hostnames from src/data/resume.md
      // If using Clearbit: { protocol: "https", hostname: "logo.clearbit.com" }
    ],
  },
};

export default nextConfig;
```

### Verify headers with curl (post-deploy check)

```bash
curl -I https://<your-vercel-url>.vercel.app
# Expect to see:
# x-frame-options: SAMEORIGIN
# x-content-type-options: nosniff
# referrer-policy: origin-when-cross-origin
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `output: 'export'` for GitHub Pages | Remove output setting; deploy to Vercel | This phase | Full Next.js runtime unlocked |
| `images.unoptimized: true` | `images.remotePatterns` allowlist | This phase | Native image optimization enabled |
| `NEXT_PUBLIC_EMAIL/PHONE` | `EMAIL`/`PHONE` (server-only) | This phase | Vars no longer baked into client bundle |
| GitHub Pages Actions workflow | Vercel CLI workflow | This phase | Proper CI/CD for Next.js runtime app |

**Removed from next.config.ts — never carry forward:**
- `output: "export"` — static export mode, blocks runtime
- `basePath: isProd ? "/resume" : ""` — GitHub Pages subpath only
- `assetPrefix: isProd ? "/resume" : ""` — same
- `images.unoptimized: true` — was required for static export
- `isProd` constant — no longer referenced by anything

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `logo_url` values in resume.md are website root URLs, not image files — logos will 404 with next/image | Pitfall 2, Open Questions | If actual image URLs exist elsewhere, no content fix needed |
| A2 | Branch name is `master` (verified) | Workflow YAML | [VERIFIED: git status + existing deploy.yml] |
| A3 | No `.env.local` file exists with `NEXT_PUBLIC_EMAIL`/`NEXT_PUBLIC_PHONE` | CFG-01 pattern | If it exists, local dev breaks after rename until updated |
| A4 | Vercel project has not been created yet | Environment Availability | If already linked, user skips `vercel link` step |

---

## Open Questions

1. **What are the actual logo image URLs?**
   - What we know: `logo_url: "https://covergo.com"` and `"https://upmesh.io"` in resume.md are website URLs, not image files. `next/image` will fail on these.
   - What's unclear: Does the user want to use Clearbit Logo API (`https://logo.clearbit.com/<domain>`) or provide specific image URLs?
   - Recommendation: The plan should include a task noting that logo_url values must be real image URLs. Clearbit Logo API (`logo.clearbit.com`) is a common choice — add `{ protocol: "https", hostname: "logo.clearbit.com" }` to remotePatterns and update resume.md logo URLs to `https://logo.clearbit.com/covergo.com` format.

2. **Does a Vercel project already exist?**
   - What we know: No `.vercel/project.json` found in repo (`.vercel` is gitignored so this is expected either way)
   - What's unclear: Has the user already created a Vercel project via the dashboard?
   - Recommendation: Plan Wave 0 should include a manual prerequisite: "Run `vercel link` or confirm project exists in Vercel dashboard"

---

## Sources

### Primary (HIGH confidence)
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md` — `headers()` API, security header examples, `/:path*` catch-all pattern [VERIFIED: local file]
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` — `remotePatterns` configuration, image component props [VERIFIED: local file]
- `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md` — NEXT_PUBLIC_ behavior, server-only env vars [VERIFIED: local file]
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/output.md` — `output: 'export'` documentation [VERIFIED: local file]
- `.github/workflows/deploy.yml` — existing workflow structure [VERIFIED: codebase]
- `next.config.ts` — current config with all GitHub Pages settings [VERIFIED: codebase]
- `src/app/page.tsx` — Server Component, NEXT_PUBLIC_ var usage [VERIFIED: codebase]
- `.gitignore` — `.vercel` already excluded [VERIFIED: line 37]

### Secondary (MEDIUM confidence)
- [Vercel Knowledge Base — GitHub Actions with Vercel](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel) — exact workflow YAML with `vercel pull / build / deploy --prebuilt`, required secrets

### Tertiary (LOW confidence)
- [FreeCodeCamp — Deploy to Vercel with GitHub Actions](https://www.freecodecamp.org/news/deploy-to-vercel-with-github-actions/) — corroborates official pattern

---

## Metadata

**Confidence breakdown:**
- next.config.ts changes (VERCEL-01, SEC-01, IMG-01): HIGH — verified against local Next.js 16 docs
- GitHub Actions workflow (VERCEL-03): HIGH — verified against official Vercel KB
- Env var rename (CFG-01): HIGH — verified against Next.js env var docs; code inspection confirms Server Component
- Double-deploy pitfall (Git Integration): HIGH — known Vercel behavior when using CLI alongside dashboard Git Integration
- Logo URL content issue: MEDIUM — inferred from data inspection; user must confirm and resolve
- Vercel project existence: LOW — not verifiable without user confirmation

**Research date:** 2026-04-22
**Valid until:** 2026-05-22 (stable APIs — Next.js config and Vercel CLI patterns are stable)
