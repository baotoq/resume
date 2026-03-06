# Requirements: Resume Website Enhancement

> v1 requirements for portfolio enhancement project

## v1 Requirements

### Theme & Visual (THEME)

- [x] **THEME-01**: User can toggle between light and dark mode via button in header
- [x] **THEME-02**: Theme preference persists across browser sessions (localStorage)
- [x] **THEME-03**: Theme transitions smoothly without flash on page load
- [x] **THEME-04**: Site respects system color scheme preference on first visit
- [x] **THEME-05**: Fresh color palette applied (not blue/purple gradient)
- [x] **THEME-06**: Updated typography that feels modern and distinctive
- [x] **THEME-07**: Subtle animations on page load and hover interactions
- [x] **THEME-08**: Both light and dark themes meet WCAG contrast requirements

### GitHub Projects (PROJ)

- [ ] **PROJ-01**: Display GitHub repositories in a dedicated Projects section
- [ ] **PROJ-02**: Show repo name with link to GitHub
- [ ] **PROJ-03**: Show repo description
- [ ] **PROJ-04**: Show primary programming language with color indicator
- [ ] **PROJ-05**: Show star count
- [ ] **PROJ-06**: Show fork count
- [ ] **PROJ-07**: Show last updated date
- [ ] **PROJ-08**: Filter repos by configurable criteria (min stars, exclude forks, topics)
- [ ] **PROJ-09**: Repos fetched at build time (no runtime API calls)
- [ ] **PROJ-10**: Graceful fallback if GitHub API unavailable

### Company Branding (LOGO)

- [x] **LOGO-01**: Display company logo next to each experience entry
- [x] **LOGO-02**: Logos sourced from company websites and optimized
- [x] **LOGO-03**: Logos in WebP format, max 64px display size
- [x] **LOGO-04**: Fallback to letter avatar if logo unavailable

### SEO & Social (SEO)

- [ ] **SEO-01**: JSON-LD structured data for Person schema
- [ ] **SEO-02**: JSON-LD structured data for ProfilePage schema
- [ ] **SEO-03**: Open Graph meta tags (title, description, image, type)
- [ ] **SEO-04**: Twitter Card meta tags
- [ ] **SEO-05**: Custom OG image generated for social sharing
- [ ] **SEO-06**: Canonical URL specified

### Analytics (ANA)

- [ ] **ANA-01**: Plausible analytics script integrated
- [ ] **ANA-02**: Analytics respects user privacy (no cookies)
- [ ] **ANA-03**: Page views tracked on site

### Accessibility (A11Y)

- [ ] **A11Y-01**: Skip navigation link at top of page
- [ ] **A11Y-02**: All interactive elements have visible focus indicators
- [ ] **A11Y-03**: All icon-only buttons have aria-labels
- [ ] **A11Y-04**: Color contrast meets WCAG 2.1 AA (4.5:1 for text)
- [ ] **A11Y-05**: Keyboard navigation works for all interactive elements
- [ ] **A11Y-06**: Theme toggle is keyboard accessible

### Cleanup (CLEAN)

- [ ] **CLEAN-01**: Remove unused SVG files from public/ directory
- [ ] **CLEAN-02**: Remove unused Project type if not used
- [ ] **CLEAN-03**: Remove dark mode CSS variables if replaced
- [ ] **CLEAN-04**: Ensure no console errors or warnings

---

## v2 Requirements (Deferred)

- Testimonials/recommendations section
- Certifications section
- Blog/writing section
- Multi-language support (i18n)
- Contact form
- Self-hosted analytics (Umami)

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend/API server | Static export requirement |
| Database | Static site |
| Authentication | Public portfolio |
| CMS integration | Overengineering |
| Multiple pages | Single-page resume preferred |
| 3D animations | Performance, professionalism |
| Chatbot | Unnecessary |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| THEME-01 | Phase 1 | Complete |
| THEME-02 | Phase 1 | Complete |
| THEME-03 | Phase 1 | Complete |
| THEME-04 | Phase 1 | Complete |
| THEME-05 | Phase 2 | Complete |
| THEME-06 | Phase 2 | Complete |
| THEME-07 | Phase 2 | Complete |
| THEME-08 | Phase 2 | Complete |
| PROJ-01 | Phase 4 | Pending |
| PROJ-02 | Phase 4 | Pending |
| PROJ-03 | Phase 4 | Pending |
| PROJ-04 | Phase 4 | Pending |
| PROJ-05 | Phase 4 | Pending |
| PROJ-06 | Phase 4 | Pending |
| PROJ-07 | Phase 4 | Pending |
| PROJ-08 | Phase 4 | Pending |
| PROJ-09 | Phase 4 | Pending |
| PROJ-10 | Phase 4 | Pending |
| LOGO-01 | Phase 3 | Complete |
| LOGO-02 | Phase 3 | Complete |
| LOGO-03 | Phase 3 | Complete |
| LOGO-04 | Phase 3 | Complete |
| SEO-01 | Phase 5 | Pending |
| SEO-02 | Phase 5 | Pending |
| SEO-03 | Phase 5 | Pending |
| SEO-04 | Phase 5 | Pending |
| SEO-05 | Phase 5 | Pending |
| SEO-06 | Phase 5 | Pending |
| ANA-01 | Phase 6 | Pending |
| ANA-02 | Phase 6 | Pending |
| ANA-03 | Phase 6 | Pending |
| A11Y-01 | Phase 7 | Pending |
| A11Y-02 | Phase 7 | Pending |
| A11Y-03 | Phase 7 | Pending |
| A11Y-04 | Phase 7 | Pending |
| A11Y-05 | Phase 7 | Pending |
| A11Y-06 | Phase 7 | Pending |
| CLEAN-01 | Phase 8 | Pending |
| CLEAN-02 | Phase 8 | Pending |
| CLEAN-03 | Phase 8 | Pending |
| CLEAN-04 | Phase 8 | Pending |

---

*Last updated: 2026-01-31*

