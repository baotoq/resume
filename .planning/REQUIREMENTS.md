# Requirements: Resume / CV Page — v1.2

## Milestone: v1.2 Tech Stack Icons + Keyword Highlights

**Goal:** Make each experience card more scannable with colored Devicon tech stack icons and accent-colored keywords in bullet points.

---

## v1.2 Requirements

### Tech Stack Icons

- [ ] **TECH-01**: User can add `tech_stack: [React, TypeScript, Go]` to any experience entry in resume.md
- [ ] **TECH-02**: Each experience card renders Devicon icons for listed tech stack items below the role/date header, above bullets
- [ ] **TECH-03**: Icons load via Devicons CDN — no npm package added
- [ ] **TECH-04**: Experience entries with no `tech_stack` field render no icon row (graceful omission)
- [ ] **TECH-05**: Unknown tech names (no matching Devicon) render as a plain text pill fallback

### Keyword Highlights

- [ ] **KW-01**: User can wrap keywords in `**bold**` within bullet text in resume.md
- [ ] **KW-02**: Bold-marked keywords render in indigo-600 accent color (matching existing accent)
- [ ] **KW-03**: Bullets with no bold markup render unchanged

---

## Future Requirements

- PDF download button — generates clean PDF from the page
- About/bio intro paragraph
- Duration labels computed from date ranges
- Dark/light mode toggle

---

## Out of Scope

- Server-side icon proxying — CDN direct load sufficient for static export
- Automatic keyword detection — user marks keywords explicitly in bold
- Icon animation or hover effects — keep professional/static
- Custom icon uploads — Devicons covers all common tech

---

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| TECH-01 | — | Pending |
| TECH-02 | — | Pending |
| TECH-03 | — | Pending |
| TECH-04 | — | Pending |
| TECH-05 | — | Pending |
| KW-01 | — | Pending |
| KW-02 | — | Pending |
| KW-03 | — | Pending |
