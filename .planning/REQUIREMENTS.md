# Requirements: Resume / CV Page

**Defined:** 2026-04-12
**Core Value:** A recruiter or engineer can open the link, immediately understand who you are and what you've built, and download a clean PDF — all without friction.

## v1 Requirements

### Content

- [ ] **CONT-01**: Visitor can see a header with name, job title, email, GitHub, and LinkedIn link
- [ ] **CONT-02**: Visitor can read work experience in reverse-chronological order with company, role, date range, and 3-4 metric-driven bullets per entry
- [ ] **CONT-03**: Visitor can read skills organized into plain-text categories (Languages, Frameworks, Databases, Tools/Cloud)

### Layout

- [ ] **LAYOUT-01**: Page is readable and usable on mobile and desktop viewports
- [ ] **LAYOUT-02**: Sections fade in subtly on scroll entry using motion library animations

### Deploy

- [ ] **DEPLOY-01**: Page is live at a public GitHub Pages URL that can be shared with recruiters

## v2 Requirements

### Content

- **CONT-V2-01**: Visitor can read an about/bio intro paragraph
- **CONT-V2-02**: Visitor can see duration labels computed from date ranges (e.g. "2 yr 4 mo")
- **CONT-V2-03**: Visitor can click email address to copy it to clipboard

### Theme

- **THEME-V2-01**: Visitor can toggle dark/light mode (defaults to system preference)

### PDF

- **PDF-V2-01**: Visitor can click a download button and receive a PDF with real selectable text matching the web layout
- **PDF-V2-02**: Visitor who prints via Cmd+P receives a clean print-optimized layout via `@media print`

### Projects

- **PROJ-V2-01**: Visitor can see a projects section with descriptions and links

## Out of Scope

| Feature | Reason |
|---------|--------|
| Education section | Not requested by user — can be added to v2 |
| Contact form | Static page, no backend needed |
| CMS / admin panel | Content managed in code — no operational overhead |
| Multi-page navigation | Recruiters expect one scrollable page; breaks PDF flow |
| Skill progress bars / ratings | Anti-pattern — meaningless to both recruiters and engineers |
| Parallax / typing animations | Distracting, signals student project |
| Particle / canvas backgrounds | Pattern-matches to student projects, not SWE professional |
| ATS optimization of web HTML | ATS only parses uploaded PDFs, not web pages |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CONT-01 | Phase 1 | Pending |
| CONT-02 | Phase 1 | Pending |
| CONT-03 | Phase 1 | Pending |
| LAYOUT-01 | Phase 2 | Pending |
| LAYOUT-02 | Phase 2 | Pending |
| DEPLOY-01 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 6 total
- Mapped to phases: 6
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-12*
*Last updated: 2026-04-12 after roadmap creation*
