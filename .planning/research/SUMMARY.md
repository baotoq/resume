# Research Summary — v1.1 Visual Polish
# Company Logos + Vertical Timeline

**Milestone:** v1.1
**Synthesized:** 2026-04-13
**Confidence:** HIGH (all findings verified against live codebase and local Next.js 16 docs)

---

## Stack Additions

**Zero new dependencies for v1.1.**

| Area | Decision | Rationale |
|------|----------|-----------|
| Logo images | Plain `<img>` tag | `next/image` with external URLs is unsupported under `output: 'export'` — silently 404s on GitHub Pages |
| Fallback icon | Inline SVG in a new `LogoImage` client component | Avoids icon library (~20–40KB) for one icon |
| Timeline layout | Pure Tailwind v4 CSS | `relative`/`absolute` + `before:content-['']` pattern already used in codebase |
| `onError` state | New `LogoImage.tsx` client component (`'use client'`) | Event handlers cannot live in Server Components — build fails if you try |

Contrast with future phases: PDF (adds `jspdf` + `html2canvas-pro`), animations (existing `framer-motion` → rename import to `motion`).

---

## Feature Table Stakes

### Company Logos — must-haves
- Logo renders next to company name in card header
- Briefcase fallback when `logo_url` is absent from YAML (most entries initially)
- `onError` fallback to briefcase when image 404s or fails to load
- Fixed container size (`h-8 w-8`) with `object-contain` — logo never breaks card layout
- `alt={entry.company}` set for accessibility

### Vertical Timeline — must-haves
- Continuous vertical line down the left of the WorkExperience section
- Filled circle dot at each entry's header level, aligned with the line
- Line does not extend past the last entry (`last:before:hidden`)
- Left padding on cards (`pl-8`) keeps text clear of the timeline channel
- Mobile works at 375px without horizontal scroll

### Do not build
- Auto-fetching logos from Clearbit/Brandfetch API
- Animated timeline line draw on scroll
- Year labels on the timeline
- Per-card stagger animation (section-level AnimateIn is sufficient)
- Logo larger than `h-10` (40px)

---

## Architecture Changes

### Files modified
| File | Change |
|------|--------|
| `src/types/resume.ts` | Add `logo_url?: string` to `ExperienceEntry` interface |
| `src/components/WorkExperience.tsx` | Timeline wrapper layout + logo/fallback slot in card header |
| `src/data/resume.md` | Add optional `logo_url` keys to experience entries |

### New files
| File | Purpose |
|------|---------|
| `src/components/LogoImage.tsx` | `'use client'` component — owns `onError` + `useState` fallback to briefcase SVG |

### Files unchanged
`page.tsx`, `globals.css`, `AnimateIn.tsx`, `Header.tsx`, `Skills.tsx`, `layout.tsx`, `next.config.ts`

### Key constraint
`WorkExperience.tsx` stays a Server Component. Only `LogoImage.tsx` gets `'use client'`. Mirrors the existing `AnimateIn` island pattern.

---

## Top Pitfalls to Watch

### 1. `next/image` breaks silently in production (CRITICAL)
Using `next/image` for external logo URLs builds and dev-previews fine, then 404s on every logo after GitHub Pages deploy. No build error. **Fix:** Use `<img>` tag only.

### 2. `onError` in a Server Component fails the build (CRITICAL)
Event handler props cannot cross the Server→Client boundary. Build error: "Event handlers cannot be passed to Client Component props." **Fix:** All `onError`/`useState` logic must live in `LogoImage.tsx` with `'use client'`.

### 3. Timeline line dangles past last entry (MODERATE)
Container-level line with `height: 100%` extends into empty space below the final card. **Fix:** Per-item line segments using `last:before:hidden` (or `group-last:hidden` on an explicit `<div>`).

### 4. `before:content-['']` is required for pseudo-elements (MODERATE)
Tailwind v4 does not inject `content: ''` by default. Omitting it makes the pseudo-element invisible with no warning. **Fix:** Always include `before:content-['']` — the existing codebase already does this correctly for bullet dots.

### 5. `basePath` not applied to string file paths (MODERATE)
`basePath: '/resume'` in `next.config.ts` means `/briefcase.svg` resolves incorrectly on GitHub Pages. **Fix:** Inline SVG (no path) or module import (resolved at build time).

---

## Recommended Build Order

1. `src/types/resume.ts` — add `logo_url?: string` to `ExperienceEntry`. TypeScript enforces downstream immediately.
2. `src/components/LogoImage.tsx` — new client component with `onError` + briefcase SVG fallback.
3. `src/components/WorkExperience.tsx` — single edit pass: timeline wrapper + per-entry dot/line + `<LogoImage>` in card header.
4. `src/data/resume.md` — add `logo_url` to one entry as a smoke-test placeholder.
5. Visual verification — `npm run dev`: confirm line, dots, logo, fallback, mobile at 375px.
6. `npm run build` — confirm static export succeeds, TypeScript strict passes, no new lint errors.

---

## Confidence Assessment

| Area | Confidence | Basis |
|------|------------|-------|
| No new dependencies needed | HIGH | Verified: Tailwind 4.2.2 supports all needed utilities; `<img>` confirmed correct for static export |
| `next/image` incompatibility | HIGH | Confirmed in local Next.js 16 docs (`static-exports.md` line 289) |
| `onError` requires client component | HIGH | Confirmed in local Next.js 16 image docs |
| Timeline CSS approach | HIGH | Pattern already exists in codebase (`WorkExperience.tsx` lines 39–41) |
| `last:before:hidden` line termination | HIGH | Verified via Cruip Tailwind timeline implementation |
| Mobile layout at 375px | MEDIUM | Inferred from column-oriented layout; requires browser verification |
| Dot alignment cross-browser | MEDIUM | Absolute positioning in flex+gap has minor Safari/Chrome differences; test needed |
