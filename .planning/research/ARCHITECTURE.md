# Architecture Research

**Domain:** Next.js 16 App Router — GitHub Pages static export to Vercel migration
**Researched:** 2026-04-22
**Confidence:** HIGH

## Standard Architecture

### System Overview

**Before (GitHub Pages static export):**

```
Push to master
    ↓
GitHub Actions (deploy.yml)
    ├── Job: build
    │   ├── actions/configure-pages@v5  (injects basePath automatically)
    │   ├── next build  →  ./out/  (static HTML dump)
    │   └── actions/upload-pages-artifact@v3
    └── Job: deploy
        └── actions/deploy-pages@v5  →  GitHub Pages CDN
                                            ↓
                                   https://<user>.github.io/resume/
```

**After (Vercel):**

```
Push to master
    ↓
Option A: Vercel Git Integration (no workflow file at all)
    └── Vercel build runner detects Next.js, runs next build
            ↓
        Vercel Platform (Node.js runtime + CDN edge network)
                ↓
        https://<project>.vercel.app/

Option B: GitHub Actions + Vercel CLI
    └── deploy.yml: vercel build --prod + vercel deploy --prebuilt --prod
            ↓
        Vercel Platform (Node.js runtime + CDN edge network)
                ↓
        https://<project>.vercel.app/
```

### Component Responsibilities

| Component | Before (GitHub Pages) | After (Vercel) |
|-----------|----------------------|----------------|
| `next.config.ts` | `output:'export'`, `basePath:'/resume'`, `assetPrefix:'/resume'`, `images.unoptimized:true` | Remove all four. Keep only `reactCompiler: true`. |
| `.github/workflows/deploy.yml` | Two-job: build (static export) + deploy-pages. OIDC Pages permissions. | REPLACE with Vercel CLI workflow (Option B), OR DELETE entirely (Option A). |
| `vercel.json` | Does not exist | Optional. Not required for a basic Next.js deploy. Skip unless custom headers or regions are needed. |
| `.vercel/project.json` | Does not exist | Created by `vercel link` CLI. Contains `projectId` and `orgId`. These are not secrets — commit the file. |
| GitHub repo Settings → Pages | Enabled (source: GitHub Actions) | Disable. Set Pages source to "None" to decommission. Last step. |
| GitHub Secrets | None (OIDC, no stored secrets needed) | Option B only: add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`. |

## Recommended Project Structure

No new source files. Changes are infrastructure-only:

```
resume/
├── next.config.ts          MODIFY — remove output/basePath/assetPrefix/images.unoptimized
├── vercel.json             CREATE (optional) — skip for basic resume deploy
├── .vercel/
│   └── project.json        CREATED BY CLI — commit this; not a secret
└── .github/
    └── workflows/
        └── deploy.yml      REPLACE or DELETE — Pages-specific workflow is fully replaced
```

All source files under `src/`, `public/`, and `package.json` are unchanged.

### Structure Rationale

- **.vercel/project.json:** Created by `vercel link`. Contains `projectId` and `orgId` — not secrets (visible in the Vercel dashboard URL). Committing them gives CI a canonical reference without requiring a re-link step in every environment.
- **vercel.json:** A resume site with no API routes, no redirects, and no custom headers does not need one. Vercel's framework autodetection handles Next.js with zero config.

## Architectural Patterns

### Pattern 1: Vercel Git Integration (zero-config, recommended)

**What:** Connect the GitHub repo to a Vercel project via the dashboard OAuth flow. Vercel deploys automatically on every push to `master`. No GitHub Actions file needed at all.

**When to use:** When the goal is simplicity. No secrets to manage. No YAML to maintain. Vercel detects Next.js 16 and runs `next build` with the correct Node version.

**Trade-offs:**
- Pro: Zero configuration. Preview deployments automatically created for every PR.
- Pro: Vercel manages the build environment — no Node version pinning needed.
- Con: Build logs are in the Vercel dashboard, not the GitHub Actions UI.
- Con: Cannot add lint/type-check gates before deploy without also adding a GitHub Actions workflow.

**Recommendation for this project:** Use Option A. The resume project has no test suite and no lint gate in CI — the existing workflow is purely a build+deploy step. Vercel Git Integration is a direct replacement with less complexity.

### Pattern 2: GitHub Actions + Vercel CLI (explicit CI/CD)

**What:** Keep GitHub Actions as the CI/CD driver. The workflow installs Vercel CLI, runs `vercel build` (which detects Next.js), then uploads the pre-built artifact via `vercel deploy --prebuilt`.

**When to use:** When pre-deploy gates (lint, type-check, tests) need to block deployment.

**Trade-offs:**
- Pro: Build steps can gate deployment.
- Pro: Build logs stay in GitHub Actions UI.
- Con: Three secrets must be managed.
- Con: More YAML to maintain.

**Example production workflow (Option B):**
```yaml
name: deploy
on:
  push:
    branches: ["master"]
  workflow_dispatch:
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
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
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      - name: Pull Vercel env
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Pattern 3: next.config.ts cleanup

**What:** Remove all four GitHub Pages-specific config keys. On Vercel the app is served from the domain root — `basePath` and `assetPrefix` must not be set. Removing `output:'export'` allows Next.js to run as a Node.js server. Removing `images.unoptimized:true` enables Vercel's built-in image optimization.

**Before:**
```typescript
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/resume" : "",
  assetPrefix: isProd ? "/resume" : "",
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
};
```

**After:**
```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,
};
```

The `isProd` variable and its conditional logic can be deleted entirely — they only existed to conditionally apply the GitHub Pages path prefix.

## Data Flow

### Build + Deploy Flow (Option A: Vercel Git Integration)

```
git push master
    ↓
Vercel webhook triggered
    ↓
Vercel build runner
    ├── npm ci
    └── next build  (Node.js mode — no static export, output goes to .next/)
            ↓
        Deploy to Vercel edge network
            ↓
        https://<project>.vercel.app/
```

### Build + Deploy Flow (Option B: GitHub Actions)

```
git push master
    ↓
GitHub Actions triggered
    ├── npm ci
    ├── vercel pull  (fetches env vars and project config from Vercel)
    ├── vercel build --prod  (produces .vercel/output/ conforming to Build Output API)
    └── vercel deploy --prebuilt --prod  (uploads .vercel/output/ — does not rebuild)
            ↓
        https://<project>.vercel.app/
```

### Request Flow (runtime, after migration)

```
Browser → https://<project>.vercel.app/
    ↓
Vercel CDN edge
    ├── /_next/static/* → served from CDN cache (unchanged behavior)
    └── / (page request)
            ↓
        The resume page.tsx has no dynamic server functions (no cookies,
        no request headers, no generateStaticParams with dynamicParams:true).
        Vercel automatically detects this and serves the page as static HTML
        from the CDN — same effective behavior as GitHub Pages, without the
        basePath constraint and without the output:'export' limitation.
```

Note: gray-matter reads `src/data/resume.md` at build time via synchronous `readFileSync`. This is unchanged. Vercel's build environment has filesystem access identical to a local build.

## File Change Matrix

| File | Action | What Changes |
|------|--------|-------------|
| `next.config.ts` | MODIFY | Remove `output`, `basePath`, `assetPrefix`, `images.unoptimized`, `isProd` variable. Keep `reactCompiler: true`. |
| `.github/workflows/deploy.yml` | REPLACE or DELETE | Option A: delete entirely. Option B: replace content with Vercel CLI workflow above. |
| `.vercel/project.json` | CREATE via CLI | Run `vercel link` locally once. Commit the generated file. Contains `projectId` + `orgId`. |
| `vercel.json` | SKIP | Not required. Only create if custom headers, redirects, or regions become necessary. |
| All `src/**` | NO CHANGE | All components, data layer, and styling unchanged. |
| `public/` | NO CHANGE | Static assets served identically on Vercel. |
| `package.json` | NO CHANGE | Build script is already `next build`. |

## Execution Order for Migration Tasks

Dependencies flow in this order — do not reorder:

1. **VERCEL-01: Modify `next.config.ts`**
   Must happen first. Removing `output:'export'` changes what `next build` produces (`.next/` server bundle instead of `./out/` static HTML). All downstream steps depend on correct config.

2. **VERCEL-02: Create Vercel project + link**
   Run `vercel link` locally (or create project via Vercel dashboard → Import Git Repository). This produces `.vercel/project.json` with `projectId` and `orgId`. Required before CI/CD can reference the project. Also: set any environment variables (e.g., email/phone env vars) in the Vercel dashboard under Project Settings → Environment Variables.

3. **VERCEL-03: Replace or delete GitHub Actions workflow**
   Depends on `.vercel/project.json` existing (for project IDs). Option A: delete `deploy.yml`. Option B: replace content with the Vercel CLI workflow. If Option B, add three secrets to the GitHub repo: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

4. **VERCEL-04: Decommission GitHub Pages**
   Last step. Navigate to GitHub repo Settings → Pages → Source → set to "None". Execute only after confirming the Vercel URL serves the resume correctly. This is the point of no easy return.

## Reversibility Considerations

The migration is reversible until VERCEL-04 is executed:

- **Before VERCEL-04:** GitHub Pages still serves the site. Reverting `next.config.ts` and re-running the old workflow restores the prior deployment.
- **After VERCEL-04:** Reversibility requires re-enabling GitHub Pages, reverting all config changes, and triggering a new build. Achievable but takes a full deploy cycle.
- **Recommendation:** Confirm the Vercel deployment URL renders the resume correctly before executing VERCEL-04. The old `deploy.yml` is preserved in git history and can be recovered.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Vercel | Git integration (dashboard OAuth) OR CLI via GitHub Actions | Choose one — do not run both simultaneously or double-deploys occur |
| GitHub | Source repo. Grant Vercel OAuth access during project setup | Required for Git integration. Already authenticated for Actions. |
| Devicons CDN | Browser-side external CDN fetch | Unchanged — no config impact |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `next.config.ts` → Vercel build runner | Vercel reads `next.config.ts` automatically | No `vercel.json` needed to reference it |
| `.vercel/project.json` → GitHub Actions | Workflow reads `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` from repo secrets | Values must match what `vercel link` wrote to the file |
| `src/data/resume.md` → `page.tsx` | `readFileSync` at build time | Unchanged — works identically on Vercel's build environment |
| Environment variables (email/phone) → runtime | Set in Vercel dashboard Project Settings → Environment Variables | Must be re-entered in Vercel; they are not in the repo |

## Anti-Patterns

### Anti-Pattern 1: Leaving `output: 'export'` in next.config.ts

**What people do:** Deploy to Vercel without removing the static export config.

**Why it's wrong:** Vercel detects `output: 'export'` and serves the static bundle — functionally identical to GitHub Pages but on Vercel infrastructure. You lose the Node.js runtime, image optimization, and any future server-side capabilities. The whole point of the migration is lost.

**Do this instead:** Remove `output: 'export'` entirely as the very first step.

### Anti-Pattern 2: Leaving `basePath: '/resume'` and `assetPrefix: '/resume'`

**What people do:** Keep the basePath because it worked on GitHub Pages (where the repo name is the URL path segment `/resume/`).

**Why it's wrong:** On Vercel the app is served from the domain root (`/`). All internal `<Link>` hrefs, `<Image>` src paths, and asset URLs will generate `/resume/...` paths that 404. The site will be partially broken.

**Do this instead:** Remove `basePath` and `assetPrefix` entirely. They have no purpose on Vercel.

### Anti-Pattern 3: Running Vercel Git Integration AND a GitHub Actions deploy step simultaneously

**What people do:** Enable Vercel's Git integration in the dashboard AND keep a `vercel deploy` step in GitHub Actions — resulting in two deployments per push.

**Why it's wrong:** Double-deploys, race conditions, and wasted Vercel build minutes.

**Do this instead:** Choose one approach. If using Option A (Git Integration), delete the deploy workflow file. If using Option B (GitHub Actions), disable Vercel's automatic Git deployment in the Vercel project settings under Git → Ignored Build Step or by disconnecting the Git integration.

### Anti-Pattern 4: Not committing `.vercel/project.json`

**What people do:** Add `.vercel/` to `.gitignore` (common in starter templates) so the project link stays out of version control.

**Why it's wrong:** GitHub Actions workflows using Option B need `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`. Without `.vercel/project.json` committed, developers have no canonical source for these values and must re-run `vercel link` in every new environment.

**Do this instead:** Ensure `.vercel/project.json` is NOT in `.gitignore`. The values in this file are not secrets — `VERCEL_TOKEN` is the secret, and that lives in GitHub Secrets.

## Scaling Considerations

This is a static resume site. Scaling is not a concern at any traffic level.

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Any traffic | None. The resume page renders as static HTML on Vercel's CDN. No server function executes per request. |
| Future features (PDF export, analytics API) | Server Components and Route Handlers can be added without further architectural changes — this is the specific benefit unlocked by removing `output: 'export'`. |

## Sources

- Next.js 16 static exports docs: `node_modules/next/dist/docs/01-app/02-guides/static-exports.md` (HIGH — local, version-exact)
- Next.js 16 output config docs: `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/output.md` (HIGH — local, version-exact)
- Next.js 16 deploying to platforms: `node_modules/next/dist/docs/01-app/02-guides/deploying-to-platforms.md` (HIGH — local, version-exact)
- Vercel GitHub Actions guide: https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel (MEDIUM)
- Vercel Next.js framework docs: https://vercel.com/docs/frameworks/full-stack/nextjs (MEDIUM)
- Vercel project configuration reference: https://vercel.com/docs/projects/project-configuration (MEDIUM)
- Existing project files (direct inspection): `next.config.ts`, `.github/workflows/deploy.yml`, `package.json` (HIGH)

---
*Architecture research for: Next.js 16 GitHub Pages to Vercel migration*
*Researched: 2026-04-22*
