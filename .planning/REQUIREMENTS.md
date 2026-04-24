# Requirements: Resume / CV Page

**Defined:** 2026-04-23
**Core Value:** A recruiter or engineer can open the link, immediately understand who you are and what you've built — all without friction.

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

- [ ] **EDU-01**: User can read an education section below work experience
- [ ] **EDU-02**: Education entry shows degree, institution, and date range
- [ ] **EDU-03**: Education entry shows relevant coursework/details when present
- [ ] **EDU-04**: Education section animates in on scroll entry

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
| EDU-01 | Phase 11 | Pending |
| EDU-02 | Phase 11 | Pending |
| EDU-03 | Phase 11 | Pending |
| EDU-04 | Phase 11 | Pending |
| TYP-01 | Phase 12 | Pending |
| TYP-02 | Phase 12 | Pending |
| TYP-03 | Phase 12 | Pending |
| TYP-04 | Phase 12 | Pending |

**Coverage:**
- v3.0 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-23*
*Last updated: 2026-04-23 after roadmap creation*
