# Project: Resume Website Enhancement

> Transform existing resume into a polished, feature-rich portfolio

## What This Is

A comprehensive enhancement of an existing Next.js resume website to add new features, improve visual design, and implement modern best practices. The site showcases professional experience for To Quoc Bao, a Senior Software Engineer.

## Core Value

**A distinctive, professional portfolio that stands out** — not generic "AI slop" but a thoughtfully designed showcase that reflects engineering craftsmanship.

## Context

### Current State
- Static Next.js 16 site deployed to GitHub Pages (`/resume` base path)
- React 19, Tailwind v4, Ant Design v6
- Sections: Header, Summary, Experience, Education, Skills
- PDF export via browser print API
- Clean component architecture with TypeScript

### What's Missing
- Projects section (type exists but unused)
- Company logos (data fields exist but not displayed)
- Dark mode (CSS variables defined but unused)
- SEO structured data
- Analytics
- Visual distinctiveness

## Target Outcome

A resume/portfolio site that:
1. Dynamically showcases GitHub projects with stats
2. Displays company logos alongside work experience
3. Supports light/dark mode with user preference persistence
4. Has a fresh, distinctive visual aesthetic
5. Is SEO-optimized with structured data and OG images
6. Tracks visits with privacy-friendly analytics
7. Meets accessibility standards
8. Has no dead code or unused assets

## Constraints

- **Deployment**: Must remain static export compatible (GitHub Pages)
- **GitHub API**: Public endpoints only (no auth tokens in client)
- **Performance**: Fast initial load, no heavy dependencies
- **Accessibility**: WCAG 2.1 AA compliance target

## Users

**Primary**: Recruiters, hiring managers, potential collaborators viewing the resume
**Secondary**: The site owner (To Quoc Bao) maintaining and updating content

## Requirements

### Validated

- ✓ Display professional experience with company, title, period, achievements — existing
- ✓ Display education history — existing
- ✓ Display skills by category — existing
- ✓ Display contact information with links — existing
- ✓ Export resume as PDF — existing
- ✓ Responsive design (mobile/desktop) — existing
- ✓ Static deployment to GitHub Pages — existing

### Active

- [ ] **PROJ-01**: Display GitHub projects with filtering and stats
- [ ] **PROJ-02**: Configure which repos to show (pinned, stars threshold, manual list)
- [ ] **LOGO-01**: Display company logos alongside experience entries
- [ ] **LOGO-02**: Source and optimize company logo images
- [ ] **DARK-01**: Implement dark mode with CSS variables
- [ ] **DARK-02**: Add theme toggle UI component
- [ ] **DARK-03**: Persist theme preference in localStorage
- [ ] **VIS-01**: Design fresh color palette and typography
- [ ] **VIS-02**: Redesign layout and component styling
- [ ] **VIS-03**: Add subtle animations and micro-interactions
- [ ] **SEO-01**: Add JSON-LD structured data (Person, Resume)
- [ ] **SEO-02**: Generate OG image for social sharing
- [ ] **SEO-03**: Optimize meta tags
- [ ] **ANA-01**: Integrate privacy-friendly analytics (Plausible/Umami)
- [ ] **A11Y-01**: Add skip navigation link
- [ ] **A11Y-02**: Fix color contrast issues
- [ ] **A11Y-03**: Add aria-labels to interactive elements
- [ ] **CLEAN-01**: Remove unused public assets
- [ ] **CLEAN-02**: Remove dead code and unused types

### Out of Scope

- Backend/API server — keeping static export
- CMS integration — content stays in code
- Multiple pages — single page resume
- Contact form — external links only
- Blog section — pure portfolio focus
- Authentication — public site

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| GitHub API (public) | No auth tokens needed, sufficient for public repos | — Pending |
| Plausible vs Umami | Both privacy-friendly, need to evaluate | — Pending |
| Fresh aesthetic direction | User requested distinctive design, not polish | — Pending |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| GitHub API rate limits | Low | Medium | Cache responses, show fallback |
| Company logo sourcing | Medium | Low | Use placeholders if unavailable |
| Dark mode color contrast | Medium | Medium | Test both themes for accessibility |

---
*Last updated: 2026-01-31 after initialization*

