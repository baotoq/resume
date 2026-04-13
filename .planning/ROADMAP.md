# Roadmap: Resume / CV Page

## Milestones

- ✅ **v1.0 MVP** — Phases 1-3 (shipped 2026-04-13) — [archive](.planning/milestones/v1.0-ROADMAP.md)
- 🔄 **v1.1 Visual Polish** — Phase 4 (active)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-3) — SHIPPED 2026-04-13</summary>

- [x] Phase 1: Content (2/2 plans) — completed 2026-04-12
- [x] Phase 2: Layout & Polish (1/1 plan) — completed 2026-04-13
- [x] Phase 3: Deploy (1/1 plan) — completed 2026-04-13

</details>

- [ ] **Phase 4: Visual Polish** — Company logos and vertical timeline in the work experience section

## Phase Details

### Phase 4: Visual Polish
**Goal**: Visitors see company logos and a vertical timeline connecting all work experience entries
**Depends on**: Phase 3 (complete — static site deployed)
**Requirements**: LOGO-01, LOGO-02, LOGO-03, TIMELINE-01, TIMELINE-02, TIMELINE-03, TIMELINE-04
**Success Criteria** (what must be TRUE):
  1. Each work entry displays a company logo when `logo_url` is set in resume.md, or a briefcase icon when absent or the image fails to load
  2. A continuous vertical line runs down the left side of all work experience entries, with a dot at each entry's header level
  3. The current role (no `endDate`) shows a filled indigo dot; all past roles show a hollow outlined dot
  4. The vertical line ends at the last entry and does not extend into empty space below
  5. The layout remains readable on mobile at 375px with no horizontal scroll
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Content | v1.0 | 2/2 | Complete | 2026-04-12 |
| 2. Layout & Polish | v1.0 | 1/1 | Complete | 2026-04-13 |
| 3. Deploy | v1.0 | 1/1 | Complete | 2026-04-13 |
| 4. Visual Polish | v1.1 | 0/? | Not started | - |
