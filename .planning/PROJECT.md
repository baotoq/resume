# Project: Resume Website Enhancement

> A polished, feature-rich portfolio site for To Quoc Bao

## What This Is

A professional resume/portfolio website built with Next.js 16, featuring dark/light theme, company logos, privacy-friendly analytics, full accessibility, and SEO optimization. Static export deployed to GitHub Pages.

## Core Value

**A distinctive, professional portfolio that stands out** — not generic "AI slop" but a thoughtfully designed showcase that reflects engineering craftsmanship.

## Context

### Current State (v1.0 shipped)
- Static Next.js 16 site deployed to GitHub Pages (`/resume` base path)
- React 19, TypeScript 5, Tailwind CSS v4, Biome 2.x
- 1,092 lines of code, 1.1M build output
- Sections: Header, Summary, Experience (with company logos), Education, Skills
- Dark/light theme with system preference detection and persistence
- PDF export via browser print API with contact info privacy
- Plausible analytics (cookie-free)
- Skip navigation, focus indicators, aria-labels, WCAG AA contrast
- JSON-LD structured data, OG/Twitter meta tags, custom OG image

### What Was Built (v1.0)
1. Theme system with smooth transitions and persistence
2. Visual refresh — Plus Jakarta Sans, warm earth tones, teal accents, animations
3. Company logos with letter avatar fallbacks
4. GitHub Projects section (built then removed — disabled feature)
5. SEO & social sharing optimization
6. Contact info privacy (web hidden, PDF visible)
7. Plausible analytics integration
8. Full accessibility improvements
9. Dead code cleanup and Biome config fix

## Constraints

- **Deployment**: Must remain static export compatible (GitHub Pages)
- **Performance**: Fast initial load, no heavy dependencies
- **Accessibility**: WCAG 2.1 AA compliance
- **Privacy**: No cookies, no tracking without consent

## Users

**Primary**: Recruiters, hiring managers, potential collaborators viewing the resume
**Secondary**: The site owner (To Quoc Bao) maintaining and updating content

## Requirements

### Validated

- ✓ Display professional experience with company, title, period, achievements — v1.0
- ✓ Display education history — v1.0
- ✓ Display skills by category — v1.0
- ✓ Display contact information with links — v1.0
- ✓ Export resume as PDF — v1.0
- ✓ Responsive design (mobile/desktop) — v1.0
- ✓ Static deployment to GitHub Pages — v1.0
- ✓ Dark/light theme with toggle and persistence (THEME-01 to THEME-04) — v1.0
- ✓ Fresh visual aesthetic with distinctive typography and colors (THEME-05 to THEME-08) — v1.0
- ✓ Company logos alongside experience entries (LOGO-01 to LOGO-04) — v1.0
- ✓ JSON-LD structured data, OG tags, Twitter cards, OG image (SEO-01 to SEO-06) — v1.0
- ✓ Privacy-friendly analytics via Plausible (ANA-01 to ANA-03) — v1.0
- ✓ Skip nav, focus indicators, aria-labels, WCAG AA contrast, keyboard nav (A11Y-01 to A11Y-06) — v1.0
- ✓ Removed unused assets, dead code, stale CSS (CLEAN-01 to CLEAN-04) — v1.0
- ✓ Contact info privacy — web hidden, PDF visible — v1.0

### Active

(None — start next milestone to define new requirements)

### Out of Scope

- Backend/API server — keeping static export
- CMS integration — content stays in code
- Multiple pages — single page resume
- Contact form — external links only
- Blog section — pure portfolio focus
- Authentication — public site
- GitHub Projects display — built and removed (feature disabled)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| next-themes for dark mode | Proven solution, handles flash prevention | ✓ Good |
| Plausible over Umami | Hosted service, no self-hosting needed, next-plausible package | ✓ Good |
| Plus Jakarta Sans typography | Modern, distinctive, good readability | ✓ Good |
| Warm earth tone palette | Professional, distinctive, not generic blue | ✓ Good |
| Public/ for OG image | Avoids Next.js file convention + basePath double-prefix bug | ✓ Good |
| GitHub Projects removed | Feature was hardcoded disabled, dead code removed in cleanup | ✓ Good |
| Contact info print-only | Privacy protection without losing PDF functionality | ✓ Good |
| No test runner | QA via lint + build + manual check, appropriate for static resume site | ⚠️ Revisit |

## Risks

| Risk | Likelihood | Impact | Mitigation | Status |
|------|------------|--------|------------|--------|
| GitHub API rate limits | N/A | N/A | Feature removed | Closed |
| Company logo sourcing | Low | Low | Letter avatar fallback implemented | Mitigated |
| Dark mode color contrast | Low | Medium | Muted foreground darkened for WCAG AA | Mitigated |
| OG image URL path issues | Low | Medium | Explicit absolute URLs in metadata | Mitigated |

---
*Last updated: 2026-03-06 after v1.0 milestone*
