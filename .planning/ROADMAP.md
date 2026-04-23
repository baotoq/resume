# Roadmap: Resume / CV Page

## Milestones

- ✅ **v1.0 MVP** — Phases 1-3 (shipped 2026-04-13)
- ✅ **v1.1 Visual Polish** — Phase 4 (shipped 2026-04-13)
- ✅ **v1.2 Tech Stack Icons + Keyword Highlights** — Phases 5-6 (shipped 2026-04-14)
- ✅ **v2.0 Vercel Migration** — Phases 7-8 (shipped 2026-04-22)
- [ ] **v3.0 Content & Polish** — Phases 9-12

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

### Phase 9: Type System & Data Foundation
**Goal**: TypeScript interfaces and YAML data are extended to support bio, education, and all v3.0 content — unblocking all component work
**Depends on**: Phase 8
**Requirements**: (data foundation — enables BIO-01, DUR-01, EDU-01, EDU-02, EDU-03)
**Success Criteria** (what must be TRUE):
  1. `ResumeData` type in `src/types/resume.ts` has `bio?: string` and `education?: EducationEntry[]` fields without TypeScript errors
  2. `resume.md` YAML frontmatter contains a populated `bio` string and at least one `education` entry (degree, institution, dates, details)
  3. `EducationEntry` interface is distinct from `WorkEntry` — fields match education YAML shape exactly
  4. TypeScript build (`npm run build`) passes with zero type errors after the extension
**Plans**: 1 plan

Plans:
- [x] 09-01-PLAN.md — Extend TypeScript types and YAML data for bio + education

### Phase 10: Bio Paragraph + Duration Labels
**Goal**: Recruiters can read a bio intro at the top of the page and see computed durations next to each work experience date range
**Depends on**: Phase 9
**Requirements**: BIO-01, BIO-02, DUR-01, DUR-02
**Success Criteria** (what must be TRUE):
  1. A bio paragraph is visible below the name/contact header on page load, with no JS required
  2. The bio section animates in on scroll entry, consistent with other sections
  3. Each work experience card shows a "X yrs Y mos" label alongside its date range
  4. Duration values are correct (computed from `start_date` to `end_date` or present) and require no client-side JavaScript
**Plans**: TBD
**UI hint**: yes

### Phase 11: Education Section
**Goal**: Recruiters can read a complete education section below work experience showing degree, institution, dates, and relevant coursework
**Depends on**: Phase 9
**Requirements**: EDU-01, EDU-02, EDU-03, EDU-04
**Success Criteria** (what must be TRUE):
  1. An education section is visible below the work experience section
  2. Each education entry shows degree, institution name, and date range
  3. Relevant coursework or details are displayed when present in the YAML data
  4. The education section animates in on scroll entry, consistent with other sections
**Plans**: TBD
**UI hint**: yes

### Phase 12: Typography & Spacing Overhaul
**Goal**: The resume uses a consistent 4-level type scale, Inter font, unified color tokens, and professional spacing — readable and scannable at recruiter pace
**Depends on**: Phase 11
**Requirements**: TYP-01, TYP-02, TYP-03, TYP-04
**Success Criteria** (what must be TRUE):
  1. Body font is Inter (loaded via `next/font/google`), replacing Geist — confirmed visually in browser
  2. Name, section headings, role titles, body, and secondary text each use the correct step of the 4-level type scale (`text-2xl` → `text-xl` → `text-lg` → `text-base` → `text-sm`)
  3. All cards use `p-6` padding and sections use `gap-10`/`gap-12` spacing — no inconsistent padding visible
  4. Color usage is consistent: zinc-900/zinc-700/500 hierarchy and indigo-600 accent apply uniformly across Header, WorkExperience, EducationSection
  5. Timeline dot alignment is verified visually at 375px (mobile) and 1280px (desktop) — no drift after spacing changes
**Plans**: TBD
**UI hint**: yes

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
| 9. Type System & Data Foundation | v3.0 | 0/1 | Not started | — |
| 10. Bio Paragraph + Duration Labels | v3.0 | 0/? | Not started | — |
| 11. Education Section | v3.0 | 0/? | Not started | — |
| 12. Typography & Spacing Overhaul | v3.0 | 0/? | Not started | — |
