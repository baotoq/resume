# Roadmap: Resume / CV Page

## Milestones

- ✅ **v1.0 MVP** - Phases 1-3 (shipped 2026-04-13)
- ✅ **v1.1 Visual Polish** - Phase 4 (shipped 2026-04-13)
- ✅ **v1.2 Tech Stack Icons + Keyword Highlights** - Phases 5-6 (shipped 2026-04-14)
- ✅ **v2.0 Vercel Migration** - Phases 7-8 (shipped 2026-04-22)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-3) - SHIPPED 2026-04-13</summary>

### Phase 1: Foundation
**Goal**: Project scaffolding, CI/CD, and deployment infrastructure are in place
**Plans**: TBD

### Phase 2: Core Content
**Goal**: Work experience and skills sections render with correct data
**Plans**: TBD

### Phase 3: Animations & Deploy
**Goal**: Scroll animations work and site is publicly live on GitHub Pages
**Plans**: TBD

</details>

<details>
<summary>✅ v1.1 Visual Polish (Phase 4) - SHIPPED 2026-04-13</summary>

### Phase 4: Logos & Timeline
**Goal**: Company logos and vertical timeline render on work experience cards
**Plans**: TBD

</details>

<details>
<summary>✅ v1.2 Tech Stack Icons + Keyword Highlights (Phases 5-6) - SHIPPED 2026-04-14</summary>

### Phase 5: Tech Stack Icons
**Goal**: Devicon icons render per experience entry with secure allowlist and fallback
**Plans**: TBD

### Phase 6: Keyword Highlights
**Goal**: Bold/italic markdown syntax in bullet points renders as styled spans
**Plans**: TBD

</details>

### ✅ v2.0 Vercel Migration (Shipped 2026-04-22)

**Milestone Goal:** Migrate deployment from GitHub Pages static export to Vercel, unlocking full Next.js 16 capabilities.

## Phase Details

### Phase 7: Vercel Setup & Config Migration
**Goal**: Site builds and deploys on Vercel with CI/CD — all static-export constraints removed and quick-win improvements landed in one atomic change
**Depends on**: Phase 6
**Requirements**: VERCEL-01, VERCEL-02, VERCEL-03, IMG-01, SEC-01, CFG-01
**Success Criteria** (what must be TRUE):
  1. `npm run build` succeeds with no `output: 'export'` in next.config.ts and no basePath/assetPrefix/images.unoptimized settings
  2. Push to main branch triggers a Vercel deployment automatically via the new GitHub Actions workflow
  3. Site is live on a Vercel URL with `EMAIL` and `PHONE` env vars resolving correctly in the rendered page
  4. Company logos render via `next/image` without 404s (remotePatterns configured)
  5. HTTP security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy) are present in Vercel response headers
**Plans**: TBD
**UI hint**: yes

### Phase 8: Decommission GitHub Pages
**Goal**: GitHub Pages is fully decommissioned and Vercel is the sole deployment target
**Depends on**: Phase 7
**Requirements**: VERCEL-04
**Success Criteria** (what must be TRUE):
  1. GitHub Pages source is set to None in repo Settings — the old GitHub Pages URL returns 404
  2. No active GitHub Actions workflows reference the Pages deployment job
  3. The Vercel URL is the only live deployment of the site
**Plans**: 2 plans
Plans:
- [x] 08-01-PLAN.md — Code review fixes (WR-01: readFileSync try/catch, WR-02: LogoImage HTMLAttributes)
- [x] 08-02-PLAN.md — GitHub Pages decommission (disable Pages, verify 404)

## Progress

**Execution Order:**
Phases execute in numeric order: 7 → 8

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | - | Complete | 2026-04-13 |
| 2. Core Content | v1.0 | - | Complete | 2026-04-13 |
| 3. Animations & Deploy | v1.0 | - | Complete | 2026-04-13 |
| 4. Logos & Timeline | v1.1 | - | Complete | 2026-04-13 |
| 5. Tech Stack Icons | v1.2 | - | Complete | 2026-04-14 |
| 6. Keyword Highlights | v1.2 | - | Complete | 2026-04-14 |
| 7. Vercel Setup & Config Migration | v2.0 | 2/2 | Complete    | 2026-04-22 |
| 8. Decommission GitHub Pages | v2.0 | 2/2 | Complete | 2026-04-22 |
