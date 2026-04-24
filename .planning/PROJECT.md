# Resume / CV Page

## What This Is

A personal resume website for a software engineer to share with recruiters and hiring teams. The page presents work experience and skills in a clean, professional format with scroll animations that reflects engineering craft. Live on Vercel at https://resume-ruddy-one-23.vercel.app/

## Core Value

A recruiter or engineer can open the link, immediately understand who you are and what you've built — all without friction.

## Current State — v4.0 SHIPPED 2026-04-24

shadcn/ui Full Design System Swap complete. Resume now uses shadcn primitives (Card, Badge, Separator) across all section components with a unified semantic token layer (text-foreground, text-muted-foreground, bg-card, bg-popover, border-border). All 9 v4.0 requirements satisfied. See `.planning/milestones/v4.0-ROADMAP.md`.

## Next Milestone Goals

TBD — candidates: dark/light mode toggle, PDF export, content polish (real bullet metrics), content authoring ergonomics. Run `/gsd-new-milestone` to formalize.

## Previous Milestone: v3.0 Content & Polish (Phases 9–11 complete, Phase 12 superseded by v4.0)

**Goal:** Enhance resume completeness and presentation quality — add missing content sections and elevate the visual design to senior-engineer standard.

**Target features:**
- Bio/intro paragraph at top of page
- Duration labels computed from date ranges on experience entries
- Education section (Bachelor of CS, Ton Duc Thang University, 2014–2018)
- Typography + spacing overhaul: professional, scannable, well-spaced

## Previous State — v2.0 SHIPPED 2026-04-22

Vercel is the sole deployment target. Full Next.js 16 runtime available. All static-export constraints removed. Site live at https://resume-ruddy-one-23.vercel.app/

## Requirements

### Validated

- ✓ Next.js 16 App Router project scaffolded — existing
- ✓ TypeScript strict mode configured — existing
- ✓ Tailwind CSS v4 configured — existing
- ✓ Biome linting/formatting configured — existing
- ✓ Work experience section — companies, roles, dates, bullets — v1.0
- ✓ Skills section — tech stack, languages, tools — v1.0
- ✓ Responsive layout — readable on mobile and desktop — v1.0
- ✓ Public deployment on GitHub Pages — shareable URL for recruiters — v1.0
- ✓ Scroll animations — sections fade in on scroll entry — v1.0
- ✓ Company logo per work entry (manual logo_url, briefcase fallback) — v1.1
- ✓ Vertical timeline — continuous left-side line + dot per job entry, filled/hollow dot distinction — v1.1
- ✓ Tech stack icons per experience entry (Devicons CDN, SLUG_MAP allowlist, zinc pill fallback) — v1.2
- ✓ Keyword highlighting in bullet points (`**bold**` → indigo-600 accent color) — v1.2
- ✓ Remove `output: 'export'` from next.config.ts — VERCEL-01 — v2.0
- ✓ Configure Vercel deployment (native Git integration, live at https://resume-ruddy-one-23.vercel.app/) — VERCEL-02 — v2.0
- ✓ Deploy via Vercel native Git integration (push to master triggers deployment) — VERCEL-03 — v2.0
- ✓ Decommission GitHub Pages — VERCEL-04 (baotoq.github.io/resume/ returns 404) — v2.0
- ✓ Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy) — SEC-01 — v2.0
- ✓ Server-only EMAIL/PHONE env vars (no NEXT_PUBLIC_ prefix) — CFG-01 — v2.0
- ✓ Clearbit remotePatterns for company logos — IMG-01 — v2.0
- ✓ shadcn/ui initialized on Next.js 16 + Tailwind v4 — SHAD-01, SHAD-02 — v4.0
- ✓ Section cards replaced with shadcn Card primitives — CARD-01, CARD-02, CARD-03 — v4.0
- ✓ Tech stack fallback pill replaced with shadcn Badge — BADGE-01 — v4.0
- ✓ Structural shadcn Separators between resume sections — SEP-01 — v4.0
- ✓ Semantic color tokens unified (text-foreground, bg-card, bg-popover, border-border) — TOKEN-01 — v4.0
- ✓ Typography/spacing consistent via shadcn token layer (subsumes v3.0 TYP-01..04) — TOKEN-02 — v4.0

### Active

(none — next milestone to be defined via `/gsd-new-milestone`)

### Future

- [ ] PDF download button — generates clean PDF from the page
- [ ] Dark/light mode toggle

### Out of Scope

- Projects section — not requested by user, can be added to v3
- Education section — not requested by user
- Contact form — static page, no backend needed
- CMS / admin panel — content managed in code
- Parallax / typing animations — distracting, signals student project
- Skill progress bars / ratings — meaningless to recruiters and engineers
- Custom domain — infrastructure concern, not blocking recruiter use
- ISR / on-demand revalidation — resume data is static YAML
- Server Actions — no forms or mutations needed
- Puppeteer / headless PDF — exceeds Vercel Lambda size limit

## Context

- Shipped v2.0 with full Next.js 16 runtime on Vercel — static export constraints removed
- Tech stack: Next.js 16.2.3 + React 19 + TypeScript + Tailwind v4 + framer-motion 12
- Deployment: Vercel native Git integration — push to master deploys automatically
- Content: gray-matter YAML frontmatter in `src/data/resume.md` — user fills in real data
- Note: `src/data/resume.md` still has placeholder experience entries — user must populate with real data before sharing
- Note: `logo_url` fields in resume.md point to placeholder — user must add real logo URLs

## Constraints

- **Tech Stack**: Next.js 16 + React 19 + TypeScript + Tailwind v4 — use existing stack, no new frameworks
- **Tailwind**: v4 syntax only (`@import "tailwindcss"` in CSS, no `tailwind.config.*`) — breaking change from v3
- **Next.js**: v16 has breaking changes from training data — read `node_modules/next/dist/docs/` before touching framework APIs
- **No backend**: Static content only — no database, no API routes needed for resume data
- **Vercel**: Deploying to Vercel — `output: 'export'` removed, full Next.js runtime available

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep existing Next.js stack | Already configured, GitHub Pages-ready | ✓ Good — no friction |
| gray-matter for data layer | YAML frontmatter in .md file — simple, no DB | ✓ Good — worked cleanly |
| Email/phone from env vars | Keeps secrets out of git | ✓ Good |
| Synchronous readFileSync in page.tsx | No async needed for static file read | ✓ Good |
| AnimateIn client wrapper pattern | Keeps page.tsx + section components as Server Components | ✓ Good — clean boundary |
| framer-motion whileInView + once:true | Sections animate in once, stay visible on scroll back | ✓ Good |
| Two-job GitHub Actions workflow | Separates build from deploy, allows environment protection | ✓ Good (replaced by Vercel native in v2.0) |
| OIDC auth for GitHub Pages deploy | No stored secrets in repo | ✓ Good (replaced by Vercel native in v2.0) |
| PDF via client-side generation | No server infra needed for static resume | — Deferred to v3 |
| Single page layout | Recruiters expect a scrollable resume, not multi-page nav | ✓ Good |
| Plain `<img>` over next/image for logos | next/image silently 404s with external URLs on static export | ✓ Good for v1 — replaced by next/image + remotePatterns in v2.0 |
| Inline SVG briefcase fallback | Avoids basePath routing issues and icon library bundle cost | ✓ Good |
| Single continuous timeline line vs per-entry segments | Per-entry `!isLast` approach left last card with no visible line; single rail-container element fixes this cleanly | ✓ Good — simpler and correct |
| Devicons via CDN (no npm) | No package to maintain; CDN covers all common tech slugs | ✓ Good — zero bundle cost |
| SLUG_MAP allowlist (30 entries) | Prevents user-authored strings from being injected into CSS class names | ✓ Good — security + control |
| Unknown techs → zinc pill | Never inject arbitrary strings into class attrs; legible fallback | ✓ Good |
| Bold parsed before italic | Safely handles `***triple***` edge case; stray `*` chars pass through as literal text | ✓ Good |
| span-only output in HighlightedBullet | Color and italic are decorative, not semantic — no strong/em/b/i | ✓ Good — accessibility |
| Vercel native Git integration over GitHub Actions + CLI | Fewer moving parts, no secrets management, same functional outcome | ✓ Good — simpler |
| Security headers via next.config.ts headers() | Vercel respects Next.js headers config natively | ✓ Good |
| readFileSync guarded with try/catch | App Router error boundary catches thrown Error, renders error page instead of server crash | ✓ Good |
| LogoImage props: HTMLAttributes not ButtonHTMLAttributes | div wrapper must not carry button-specific props | ✓ Good |
| shadcn/ui on Tailwind v4 with oklch tokens | Modern design system; oklch gives perceptually-uniform color math; merge preserves Geist fonts | ✓ Good — v4.0 shipped cleanly |
| Manual globals.css merge | `shadcn@latest init` destructively overwrites — must preserve `@theme inline` + Geist vars by hand | ✓ Good — one-time cost |
| Zero className overrides on shadcn Card | Trust D-03/04/05 defaults; keeps migration reversible and visual parity strict | ✓ Good — fewer surprises |
| Badge only for unknown-tech fallback | Recognized tech entries stay as SVG icon rows; Badge semantic = "pill for text token" | ✓ Good |
| Separator as block element between sections only | Would break flex layout if applied to inline contact-row dots | ✓ Good |
| Semantic tokens (`text-foreground`, `bg-card`, etc.) replace raw zinc/indigo | Single color source of truth; theming (dark mode, PDF variants) now trivial | ✓ Good — unlocks future work |

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
*Last updated: 2026-04-24 after v4.0 milestone shipped*
