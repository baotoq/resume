# Requirements: Resume / CV Page

**Defined:** 2026-04-23
**Core Value:** A recruiter or engineer can open the link, immediately understand who you are and what you've built — all without friction.

---

## v4.0 Requirements

Requirements for milestone v4.0 shadcn/ui Full Design System Swap.

### Infrastructure

- [ ] **SHAD-01**: shadcn/ui is initialized — packages installed, components.json configured, cn() utility present, globals.css merged with Geist font vars preserved
- [ ] **SHAD-02**: shadcn component sources installed in src/components/ui/ (Card, Badge, Separator via CLI)

### Card Swap

- [ ] **CARD-01**: Header section wrapper uses shadcn Card primitive instead of hand-rolled rounded-xl border bg-white classes
- [ ] **CARD-02**: Each WorkExperience entry card uses shadcn Card primitive
- [ ] **CARD-03**: Each EducationSection entry card uses shadcn Card primitive

### Badge and Separator

- [ ] **BADGE-01**: Unrecognized tech stack fallback pill in TechStackIcons uses shadcn Badge instead of hand-rolled zinc pill
- [ ] **SEP-01**: Structural shadcn Separator is present between resume sections

### Token Unification

- [ ] **TOKEN-01**: Hardcoded zinc/indigo/blue color classes replaced with shadcn semantic tokens (text-foreground, text-muted-foreground, bg-card, border-border, etc.) across all components
- [ ] **TOKEN-02**: Typography and spacing consistent across all components via shadcn design token layer — subsumes v3.0 TYP-01 through TYP-04

---

## v3.0 Requirements

Requirements for milestone v3.0 Content & Polish.

### Bio

- [x] **BIO-01**: User can read a plain-text bio paragraph at the top of the resume page
- [x] **BIO-02**: Bio section animates in on scroll entry

### Duration Labels

- [x] **DUR-01**: Each work experience entry displays a computed duration label ("X yrs Y mos") next to the date range
- [x] **DUR-02**: Duration computed at build time (static — no client JS required)

### Education

- [x] **EDU-01**: User can read an education section below work experience
- [x] **EDU-02**: Education entry shows degree, institution, and date range
- [x] **EDU-03**: Education entry shows relevant coursework/details when present
- [x] **EDU-04**: Education section animates in on scroll entry

### Typography

- [ ] **TYP-01**: Resume uses a 4-level type scale (text-2xl name → text-xl section heads → text-lg role titles → text-base body → text-sm secondary)
- [ ] **TYP-02**: Section spacing uses gap-10/12 between sections; p-6 on all cards
- [ ] **TYP-03**: Color tokens consistent — zinc-900/700/500 hierarchy + indigo-600 accent across all components
- [ ] **TYP-04**: Body font is Inter (via next/font/google), replacing Geist

---

## Future Requirements

### Dark/Light Mode

- **THEME-01**: User can toggle between dark and light theme
- **THEME-02**: Theme preference persists across sessions
- **THEME-03**: System color scheme detected on first load

### PDF Export

- **PDF-01**: User can download a clean, print-ready PDF of the resume

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Dark/light mode toggle | Deferred — complex state management, not blocking recruiter use |
| PDF export | Deferred — Puppeteer exceeds Vercel Lambda size limit; needs research |
| Projects section | Not requested |
| Education section GPA/honors | Not needed for senior engineer resume |
| Education timeline rail | Single entry — rail adds visual noise without benefit |
| Animated bio text | Distracting, signals student project |
| Markdown rendering in bio | Plain prose is sufficient; avoid added complexity |
| Real-time "Present" duration | Static build-time computation accepted; simpler, no client JS |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BIO-01 | Phase 10 | Complete |
| BIO-02 | Phase 10 | Complete |
| DUR-01 | Phase 10 | Complete |
| DUR-02 | Phase 10 | Complete |
| EDU-01 | Phase 11 | Complete |
| EDU-02 | Phase 11 | Complete |
| EDU-03 | Phase 11 | Complete |
| EDU-04 | Phase 11 | Complete |
| TYP-01 | Phase 12 | Superseded by TOKEN-02 (v4.0) |
| TYP-02 | Phase 12 | Superseded by TOKEN-02 (v4.0) |
| TYP-03 | Phase 12 | Superseded by TOKEN-01 (v4.0) |
| TYP-04 | Phase 12 | Superseded by TOKEN-01 (v4.0) |

### v4.0 Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SHAD-01 | Phase 13 | Pending |
| SHAD-02 | Phase 13 | Pending |
| CARD-01 | Phase 14 | Pending |
| CARD-02 | Phase 14 | Pending |
| CARD-03 | Phase 14 | Pending |
| BADGE-01 | Phase 15 | Pending |
| SEP-01 | Phase 15 | Pending |
| TOKEN-01 | Phase 16 | Pending |
| TOKEN-02 | Phase 16 | Pending |

**Coverage:**
- v3.0 requirements: 12 total (8 complete, 4 superseded by v4.0)
- v4.0 requirements: 9 total, 9 mapped (100%)
- Phases 13-16 cover all v4.0 requirements

---
*Requirements defined: 2026-04-23*
*Last updated: 2026-04-24 after v4.0 roadmap creation*
