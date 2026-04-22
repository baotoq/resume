# Roadmap: Resume / CV Page

## Milestones

- ✅ **v1.0 MVP** — Phases 1-3 (shipped 2026-04-13)
- ✅ **v1.1 Visual Polish** — Phase 4 (shipped 2026-04-13)
- ✅ **v1.2 Tech Stack Icons + Keyword Highlights** — Phases 5-6 (shipped 2026-04-14)
- ✅ **v2.0 Vercel Migration** — Phases 7-8 (shipped 2026-04-22)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-3) — SHIPPED 2026-04-13</summary>

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
<summary>✅ v1.1 Visual Polish (Phase 4) — SHIPPED 2026-04-13</summary>

### Phase 4: Logos & Timeline
**Goal**: Company logos and vertical timeline render on work experience cards
**Plans**: TBD

</details>

<details>
<summary>✅ v1.2 Tech Stack Icons + Keyword Highlights (Phases 5-6) — SHIPPED 2026-04-14</summary>

### Phase 5: Tech Stack Icons
**Goal**: Devicon icons render per experience entry with secure allowlist and fallback
**Plans**: TBD

### Phase 6: Keyword Highlights
**Goal**: Bold/italic markdown syntax in bullet points renders as styled spans
**Plans**: TBD

</details>

<details>
<summary>✅ v2.0 Vercel Migration (Phases 7-8) — SHIPPED 2026-04-22</summary>

### Phase 7: Vercel Setup & Config Migration
**Goal**: Site builds and deploys on Vercel with CI/CD — all static-export constraints removed and quick-win improvements landed in one atomic change
**Plans**: 2/2 complete

- [x] 07-01: Vercel Config Migration — strip GitHub Pages config, add security headers + remotePatterns, replace deploy.yml
- [x] 07-02: Vercel Deployment Verification — confirm live deployment, all 6 requirements verified

### Phase 8: Decommission GitHub Pages
**Goal**: GitHub Pages is fully decommissioned and Vercel is the sole deployment target
**Plans**: 2/2 complete

- [x] 08-01: Code Review Fixes (WR-01, WR-02) — guard readFileSync, correct LogoImage props
- [x] 08-02: GitHub Pages Decommission — disable Pages source, verify 404

</details>

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | — | Complete | 2026-04-13 |
| 2. Core Content | v1.0 | — | Complete | 2026-04-13 |
| 3. Animations & Deploy | v1.0 | — | Complete | 2026-04-13 |
| 4. Logos & Timeline | v1.1 | — | Complete | 2026-04-13 |
| 5. Tech Stack Icons | v1.2 | — | Complete | 2026-04-14 |
| 6. Keyword Highlights | v1.2 | — | Complete | 2026-04-14 |
| 7. Vercel Setup & Config Migration | v2.0 | 2/2 | Complete | 2026-04-22 |
| 8. Decommission GitHub Pages | v2.0 | 2/2 | Complete | 2026-04-22 |
