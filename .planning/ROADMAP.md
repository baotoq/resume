# Roadmap: Resume / CV Page

## Milestones

- ✅ **v1.0 MVP** — Phases 1-3 (shipped 2026-04-13) — [archive](.planning/milestones/v1.0-ROADMAP.md)
- ✅ **v1.1 Visual Polish** — Phase 4 (shipped 2026-04-13) — [archive](.planning/milestones/v1.1-ROADMAP.md)
- 🔄 **v1.2 Tech Stack Icons + Keyword Highlights** — Phases 5-6 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-3) — SHIPPED 2026-04-13</summary>

- [x] Phase 1: Content (2/2 plans) — completed 2026-04-12
- [x] Phase 2: Layout & Polish (1/1 plan) — completed 2026-04-13
- [x] Phase 3: Deploy (1/1 plan) — completed 2026-04-13

</details>

<details>
<summary>✅ v1.1 Visual Polish (Phase 4) — SHIPPED 2026-04-13</summary>

- [x] Phase 4: Visual Polish (2/2 plans) — completed 2026-04-13

</details>

### v1.2 Tech Stack Icons + Keyword Highlights

- [ ] **Phase 5: Tech Stack Icons** - Devicon icons per experience card, below header, above bullets
- [ ] **Phase 6: Keyword Highlights** - Bold-marked bullet keywords render in indigo-600 accent color

## Phase Details

### Phase 5: Tech Stack Icons
**Goal**: Each experience card displays the role's tech stack at a glance via colored Devicon icons
**Depends on**: Nothing (additive UI layer over existing experience cards)
**Requirements**: TECH-01, TECH-02, TECH-03, TECH-04, TECH-05
**Success Criteria** (what must be TRUE):
  1. User can add `tech_stack: [React, TypeScript, Go]` to an experience entry in resume.md and icons appear on the page without any code change
  2. Icons appear below the role/date header and above the bullet list on each experience card that has a tech_stack field
  3. Experience entries with no tech_stack field render normally with no empty space or broken layout
  4. An unrecognized tech name (one with no Devicon match) renders as a legible text pill rather than a broken icon
  5. No npm package is added — icons load from the Devicons CDN stylesheet/sprite
**Plans**: TBD
**UI hint**: yes

### Phase 6: Keyword Highlights
**Goal**: Recruiters can immediately spot key technologies and terms in bullet points via accent-colored text
**Depends on**: Nothing (independent of Phase 5)
**Requirements**: KW-01, KW-02, KW-03
**Success Criteria** (what must be TRUE):
  1. User can wrap a word or phrase in `**bold**` within a bullet in resume.md and it renders in indigo-600 accent color without any code change
  2. Highlighted keywords match the existing indigo-600 accent used elsewhere on the page (consistent visual language)
  3. Bullets with no bold markup render as plain text — identical to current behavior
**Plans:** 1 plan
Plans:
- [x] 06-01-PLAN.md — Create HighlightedBullet component, integrate into WorkExperience, add sample markup data
**UI hint**: yes

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Content | v1.0 | 2/2 | Complete | 2026-04-12 |
| 2. Layout & Polish | v1.0 | 1/1 | Complete | 2026-04-13 |
| 3. Deploy | v1.0 | 1/1 | Complete | 2026-04-13 |
| 4. Visual Polish | v1.1 | 2/2 | Complete | 2026-04-13 |
| 5. Tech Stack Icons | v1.2 | 0/? | Not started | - |
| 6. Keyword Highlights | v1.2 | 0/1 | Planned | - |
