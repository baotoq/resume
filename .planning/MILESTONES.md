# Milestones

## v2.0 Vercel Migration (Shipped: 2026-04-22)

**Phases completed:** 2 phases, 4 plans, 4 tasks

**Key accomplishments:**

- Stripped GitHub Pages static export config; added Vercel-compatible security headers and Clearbit remotePatterns; replaced GitHub Actions workflow; renamed env vars to server-only
- Verified live Vercel deployment at https://resume-ruddy-one-23.vercel.app/ — all Phase 7 requirements confirmed via native Git integration (deviation: native integration chosen over Vercel CLI, same outcome)
- Guarded readFileSync with try/catch in page.tsx; corrected LogoImage props from ButtonHTMLAttributes to HTMLAttributes<HTMLDivElement>
- GitHub Pages disabled — baotoq.github.io/resume/ returns 404; Vercel confirmed sole live deployment (VERCEL-04)

Known deferred items at close: 1 (see STATE.md Deferred Items)

---

## v1.2 Tech Stack Icons + Keyword Highlights (Shipped: 2026-04-14)

**Phases completed:** 2 phases, 2 plans, 0 tasks

**Key accomplishments:**

- Devicons CDN icon row on experience cards with 30-entry SLUG_MAP allowlist and zinc pill fallback for unknown techs
- Inline regex parser renders `**bold**` as indigo-600 spans and `*italic*` as italic spans inside WorkExperience bullet `<li>` elements

---

## v1.1 Visual Polish (Shipped: 2026-04-13)

**Phases completed:** 1 phase, 2 plans, 4 tasks

**Key accomplishments:**

- `LogoImage` client component — 40×40 company logo with inline-SVG briefcase fallback, `onError` error tracking, plain `<img>` (no next/image — static export incompatible with external URLs)
- Vertical timeline rail — single continuous absolute line through all work entries, per-entry dots (filled indigo for current role, hollow outlined for past roles), line ends at last card
- All 7 v1.1 requirements (LOGO-01→03, TIMELINE-01→04) human-verified at desktop (1280px) and mobile (375px)
- Fixed timeline line centering on dots during visual QA — replaced per-entry `!isLast` segments with single rail-container line

---

## v1.0 MVP (Shipped: 2026-04-13)

**Phases completed:** 3 phases, 4 plans, 3 tasks

**Key accomplishments:**

- gray-matter YAML frontmatter data layer wired into Next.js 16 Server Component with typed ResumeData interfaces
- Header, WorkExperience, Skills Server Components rendered with zinc-50 light palette and indigo-600 accents
- framer-motion AnimateIn client wrapper with whileInView scroll animations (stagger 0s/0.1s/0.2s)
- Next.js static export (`output: 'export'`) with GitHub Actions two-job CI/CD via OIDC auth to GitHub Pages

---
