# Roadmap: Resume Website Enhancement

> 8 phases to transform resume into polished portfolio

## Overview

| Phase | Name | Goal | Requirements |
|-------|------|------|--------------|
| 1 | Theme Infrastructure | Enable dark mode switching | THEME-01, THEME-02, THEME-03, THEME-04 |
| 2 | Visual Refresh | Fresh, distinctive design | THEME-05, THEME-06, THEME-07, THEME-08 |
| 3 | Company Logos | Visual credibility | LOGO-01, LOGO-02, LOGO-03, LOGO-04 |
| 4 | GitHub Projects | Complete    | 2026-03-06 |
| 5 | SEO & Social | Discoverability | SEO-01 through SEO-06 |
| 6 | Analytics | Track engagement | ANA-01, ANA-02, ANA-03 |
| 7 | Accessibility | Inclusive design | A11Y-01 through A11Y-06 |
| 8 | Cleanup | Polish & ship | CLEAN-01 through CLEAN-04 |

**Total:** 37 requirements across 8 phases

---

## Phase 1: Theme Infrastructure

**Goal:** Enable users to switch between light and dark modes with persistence.

**Requirements:**
- THEME-01: Toggle button in header
- THEME-02: Persist preference in localStorage
- THEME-03: No flash on page load
- THEME-04: Respect system preference on first visit

**Success Criteria:**
1. User can click toggle and theme changes immediately
2. Refreshing page maintains chosen theme
3. No white flash when loading dark mode
4. New visitor sees theme matching their OS preference
5. Toggle is visible and intuitive

**Dependencies:** None (foundation for Phase 2)

**Estimated Effort:** Small

---

## Phase 2: Visual Refresh

**Goal:** Transform the site with a fresh, distinctive aesthetic.

**Requirements:**
- THEME-05: New color palette
- THEME-06: Updated typography
- THEME-07: Subtle animations
- THEME-08: WCAG contrast compliance

**Success Criteria:**
1. Site looks noticeably different from current design
2. Design feels cohesive and intentional
3. Animations are smooth and not distracting
4. Both themes pass contrast checks
5. Print/PDF export still works correctly

**Dependencies:** Phase 1 (theme system must exist)

**Estimated Effort:** Large

---

## Phase 3: Company Logos

**Goal:** Add visual credibility with company branding.

**Requirements:**
- LOGO-01: Display logos in experience section
- LOGO-02: Source and optimize images
- LOGO-03: WebP format, optimized size
- LOGO-04: Fallback for missing logos

**Plans:** 1 plan

Plans:
- [x] 03-01-PLAN.md -- Source logos, add CompanyLogo component with letter-avatar fallback

**Success Criteria:**
1. Each experience entry shows company logo
2. Logos are crisp at display size
3. Page load time not significantly impacted
4. Missing logos show letter avatar gracefully
5. Logos work in both light and dark modes

**Dependencies:** Phase 2 (styling context needed)

**Estimated Effort:** Small

---

## Phase 4: GitHub Projects

**Goal:** Showcase open source work with live GitHub data.

**Requirements:**
- PROJ-01: Projects section on page
- PROJ-02: Repo name with link
- PROJ-03: Description
- PROJ-04: Language with color
- PROJ-05: Star count
- PROJ-06: Fork count
- PROJ-07: Last updated
- PROJ-08: Configurable filtering
- PROJ-09: Build-time fetch
- PROJ-10: Graceful fallback

**Plans:** 2/2 plans complete

Plans:
- [x] 04-01-PLAN.md -- Data pipeline: types, prebuild script, language colors, fallback data
- [x] 04-02-PLAN.md -- UI component: ProjectsSection card grid, page wiring, visual verification

**Success Criteria:**
1. Projects section displays repos
2. Clicking repo opens GitHub in new tab
3. Stats (stars, forks) are accurate
4. Language colors match GitHub's colors
5. Build succeeds even if GitHub API is down
6. Section looks good with 0, 3, or 10 repos

**Dependencies:** Phase 2 (styling context needed)

**Estimated Effort:** Medium

---

## Phase 5: SEO & Social

**Goal:** Improve discoverability and social sharing appearance.

**Requirements:**
- SEO-01: Person schema JSON-LD
- SEO-02: ProfilePage schema JSON-LD
- SEO-03: Open Graph tags
- SEO-04: Twitter Card tags
- SEO-05: Custom OG image
- SEO-06: Canonical URL

**Success Criteria:**
1. Google Rich Results Test shows valid structured data
2. Sharing on LinkedIn/Twitter shows custom image and description
3. Facebook Debugger shows correct metadata
4. No duplicate or conflicting meta tags
5. OG image is visually appealing

**Dependencies:** Phase 2 (design for OG image)

**Estimated Effort:** Medium

---

## Phase 6: Analytics

**Goal:** Track visitor engagement with privacy-friendly analytics.

**Requirements:**
- ANA-01: Plausible script integration
- ANA-02: Privacy-respecting (no cookies)
- ANA-03: Page view tracking

**Success Criteria:**
1. Plausible dashboard shows page views
2. No cookie consent banner needed
3. Script loads without errors
4. Analytics work in production environment
5. Script doesn't block page rendering

**Dependencies:** None (can run in parallel with Phase 5)

**Estimated Effort:** Small

---

## Phase 7: Accessibility

**Goal:** Ensure site is usable by everyone.

**Requirements:**
- A11Y-01: Skip navigation link
- A11Y-02: Visible focus indicators
- A11Y-03: Aria-labels on icon buttons
- A11Y-04: WCAG 2.1 AA contrast
- A11Y-05: Keyboard navigation
- A11Y-06: Accessible theme toggle

**Success Criteria:**
1. Can navigate entire site with keyboard only
2. Focus is always visible when tabbing
3. Screen reader announces all interactive elements
4. Lighthouse accessibility score >= 95
5. axe DevTools shows no critical issues

**Dependencies:** Phase 2 (all visual elements must exist)

**Estimated Effort:** Medium

---

## Phase 8: Cleanup

**Goal:** Remove dead code and polish for ship.

**Requirements:**
- CLEAN-01: Remove unused public assets
- CLEAN-02: Remove unused types
- CLEAN-03: Clean up old CSS variables
- CLEAN-04: No console errors

**Success Criteria:**
1. No unused files in public/
2. No unused exports in codebase
3. Console is clean (no errors or warnings)
4. All existing features still work
5. Build size is smaller or same

**Dependencies:** All phases complete

**Estimated Effort:** Small

---

## Execution Strategy

### Parallel Opportunities

```
Phase 1 (Theme) ─────────────────────────────────────────►
                 │
                 └──► Phase 2 (Visual) ──────────────────►
                                        │
                      ┌─────────────────┼─────────────────┐
                      │                 │                 │
                      ▼                 ▼                 ▼
              Phase 3 (Logos)   Phase 4 (GitHub)   Phase 5 (SEO)
                      │                 │                 │
                      └─────────────────┼─────────────────┘
                                        │
                                        ▼
                              Phase 6 (Analytics)
                                        │
                                        ▼
                              Phase 7 (Accessibility)
                                        │
                                        ▼
                              Phase 8 (Cleanup)
```

**Parallelizable:**
- Phases 3, 4, 5 can run in parallel after Phase 2
- Phase 6 can run in parallel with Phase 5

**Sequential:**
- Phase 1 → Phase 2 (dependency)
- Phase 7 → Phase 8 (cleanup after all features)

---

## Risk Mitigation

| Risk | Phase | Mitigation |
|------|-------|------------|
| Dark mode flash | 1 | Use next-themes (proven solution) |
| GitHub API limits | 4 | Build-time fetch + static fallback |
| Print breaks | 2 | Test PDF after every visual change |
| Contrast issues | 2, 7 | Design both themes intentionally |

---

## Definition of Done

Each phase is complete when:
- [ ] All requirements pass acceptance criteria
- [ ] No regressions in existing functionality
- [ ] Code committed and pushed
- [ ] Print/PDF export verified
- [ ] Both themes tested

---

*Last updated: 2026-03-06*
