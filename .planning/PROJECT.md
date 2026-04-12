# Resume / CV Page

## What This Is

A personal resume website for a software engineer to share with recruiters and hiring teams. The page presents work experience and skills in a clean, professional format that also reflects engineering craft. It supports both online browsing and PDF download so recruiters can engage however they prefer.

## Core Value

A recruiter or engineer can open the link, immediately understand who you are and what you've built, and download a clean PDF — all without friction.

## Requirements

### Validated

- ✓ Next.js 16 App Router project scaffolded — existing
- ✓ TypeScript strict mode configured — existing
- ✓ Tailwind CSS v4 configured — existing
- ✓ Biome linting/formatting configured — existing
- ✓ GitHub Pages deployment ready — existing

### Active

- [ ] Work experience section — companies, roles, dates, key responsibilities
- [ ] Skills section — tech stack, languages, tools
- [ ] PDF download button — generates clean PDF from the page
- [ ] Responsive layout — readable on mobile and desktop
- [ ] Public deployment on GitHub Pages — shareable URL for recruiters

### Out of Scope

- Projects section — not requested by user, can be added later
- Education section — not requested by user
- About me / bio section — not requested by user
- Contact form — static page, no backend needed
- CMS / admin panel — content managed in code

## Context

- Brownfield: Next.js 16.2.3 app exists with default scaffolding (default landing page, Geist fonts, globals.css). All resume content needs to be built.
- Target audience: software engineering recruiters and engineering hiring managers
- Goal balance: professional enough for recruiter scan, polished enough to impress engineers reviewing it
- PDF export must match the web design — not a separate layout
- Deployment target: GitHub Pages (already implied by project setup)

## Constraints

- **Tech Stack**: Next.js 16 + React 19 + TypeScript + Tailwind v4 — use existing stack, no new frameworks
- **Tailwind**: v4 syntax only (`@import "tailwindcss"` in CSS, no `tailwind.config.*`) — breaking change from v3
- **Next.js**: v16 has breaking changes from training data — read `node_modules/next/dist/docs/` before touching framework APIs
- **No backend**: Static content only — no database, no API routes needed for resume data
- **PDF**: Must work without a headless browser server — use client-side or build-time PDF generation
- **GitHub Pages**: Requires Next.js `output: 'export'` in `next.config.ts` for static HTML export — no server-side rendering or API routes at runtime

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep existing Next.js stack | Already configured, GitHub Pages-ready | — Pending |
| PDF via client-side generation | No server infra needed for static resume | — Pending |
| Single page layout | Recruiters expect a scrollable resume, not multi-page nav | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-12 after initialization*
