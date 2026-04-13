# Resume / CV Page

## What This Is

A personal resume website for a software engineer to share with recruiters and hiring teams. The page presents work experience and skills in a clean, professional format with scroll animations that reflects engineering craft. Live on GitHub Pages at a shareable URL.

## Core Value

A recruiter or engineer can open the link, immediately understand who you are and what you've built — all without friction.

## Current Milestone: v1.2 Tech Stack Icons + Keyword Highlights

**Goal:** Make each experience card more scannable with colored Devicon tech stack icons and accent-colored keywords in bullet points.

**Target features:**
- `tech_stack` array field per experience entry in resume.md
- Devicons via CDN, rendered below role/date header, above bullets
- `**bold**` keywords in bullet text render in indigo-600 accent color

## Requirements

### Validated

- ✓ Next.js 16 App Router project scaffolded — existing
- ✓ TypeScript strict mode configured — existing
- ✓ Tailwind CSS v4 configured — existing
- ✓ Biome linting/formatting configured — existing
- ✓ GitHub Pages deployment ready — existing
- ✓ Work experience section — companies, roles, dates, bullets — v1.0
- ✓ Skills section — tech stack, languages, tools — v1.0
- ✓ Responsive layout — readable on mobile and desktop — v1.0
- ✓ Public deployment on GitHub Pages — shareable URL for recruiters — v1.0
- ✓ Scroll animations — sections fade in on scroll entry — v1.0
- ✓ Company logo per work entry (manual logo_url, briefcase fallback) — v1.1
- ✓ Vertical timeline — continuous left-side line + dot per job entry, filled/hollow dot distinction — v1.1

### Active

- [ ] Tech stack icons per experience entry (Devicons CDN) — TECH-01
- [ ] Keyword highlighting in bullet points (**bold** → accent color) — TECH-02
- [ ] PDF download button — generates clean PDF from the page
- [ ] About/bio intro paragraph — CONT-V2-01
- [ ] Duration labels computed from date ranges — CONT-V2-02
- [ ] Dark/light mode toggle — THEME-V2-01

### Out of Scope

- Projects section — not requested by user, can be added to v2
- Education section — not requested by user
- Contact form — static page, no backend needed
- CMS / admin panel — content managed in code
- Parallax / typing animations — distracting, signals student project
- Skill progress bars / ratings — meaningless to recruiters and engineers

## Context

- Shipped v1.1 with ~270 LOC TypeScript/TSX (added LogoImage component + timeline rail)
- Tech stack: Next.js 16.2.3 + React 19 + TypeScript + Tailwind v4 + framer-motion 12
- Content: gray-matter YAML frontmatter in `src/data/resume.md` — user fills in real data
- Deployment: GitHub Pages via `output: 'export'` static export + GitHub Actions OIDC workflow
- Note: `src/data/resume.md` still has placeholder experience entries — user must populate with real data before sharing
- Note: `logo_url` fields in resume.md point to placeholder (Wikimedia CDN Google logo) — user must add real logo URLs

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
| Keep existing Next.js stack | Already configured, GitHub Pages-ready | ✓ Good — no friction |
| gray-matter for data layer | YAML frontmatter in .md file — simple, no DB | ✓ Good — worked cleanly |
| Email/phone from env vars | Keeps secrets out of git | ✓ Good |
| Synchronous readFileSync in page.tsx | No async needed for static file read | ✓ Good |
| AnimateIn client wrapper pattern | Keeps page.tsx + section components as Server Components | ✓ Good — clean boundary |
| framer-motion whileInView + once:true | Sections animate in once, stay visible on scroll back | ✓ Good |
| Two-job GitHub Actions workflow | Separates build from deploy, allows environment protection | ✓ Good |
| OIDC auth for GitHub Pages deploy | No stored secrets in repo | ✓ Good |
| PDF via client-side generation | No server infra needed for static resume | — Deferred to v2 |
| Single page layout | Recruiters expect a scrollable resume, not multi-page nav | ✓ Good |
| Plain `<img>` over next/image for logos | next/image silently 404s with external URLs on static export | ✓ Good — avoids silent failures |
| Inline SVG briefcase fallback | Avoids basePath routing issues and icon library bundle cost | ✓ Good |
| Single continuous timeline line vs per-entry segments | Per-entry `!isLast` approach left last card with no visible line; single rail-container element fixes this cleanly | ✓ Good — simpler and correct |

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
*Last updated: 2026-04-13 — Milestone v1.2 started*
