# Phase 2: Layout & Polish — Context

**Gathered:** 2026-04-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the resume page responsive on all viewports (LAYOUT-01) and add scroll-entry animations to each section (LAYOUT-02). No new content or data changes — purely presentation layer on top of Phase 1 components.

</domain>

<decisions>
## Implementation Decisions

### Animation Library
- **D-01:** Use **Framer Motion** for scroll-entry animations. Most popular library (10x more downloads than alternatives), familiar ecosystem, sufficient for this use case.
  - Install: `npm install framer-motion`
  - Framer Motion requires `'use client'` — wrap section cards in thin client components or create a generic `AnimateIn` wrapper.

### Animation Style
- **D-02:** **Fade + slide up** — `initial={{ opacity: 0, y: 16 }}` → `whileInView={{ opacity: 1, y: 0 }}`, `transition={{ duration: 0.4, ease: 'easeOut' }}`.
- **D-03:** **Stagger** — sections animate sequentially with a small delay between each (Header → WorkExperience → Skills). Use `transition={{ delay: index * 0.1 }}` or Framer Motion's `staggerChildren` pattern.
- **D-04:** **Once only** — `viewport={{ once: true }}`. Sections animate in once on first scroll entry, stay visible.

### Mobile Layout
- **D-05:** Existing `sm:` breakpoint classes are sufficient. No structural changes needed. Current setup: `max-w-3xl` container, `px-4 sm:px-8` page padding, `sm:flex-row` in WorkExperience, `sm:grid-cols-2` in Skills.

### Claude's Discretion
- Exact stagger delay value (0.1s–0.15s suggested)
- Whether to create a generic `AnimateIn` wrapper or animate each section component individually
- Whether to wrap the entire section card or just the motion.div around existing section JSX

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Next.js 16
- `node_modules/next/dist/docs/` — Breaking changes; read before touching framework APIs

### Tailwind CSS v4
- `src/app/globals.css` — v4 syntax in use; no `tailwind.config.*`

### Framer Motion
- Context7 / npm docs for Framer Motion — `whileInView`, `viewport`, `staggerChildren` API

### Phase 1 outputs (required reading)
- `src/app/page.tsx` — current page structure and section composition
- `src/components/Header.tsx` — Server Component, receives resume/email/phone props
- `src/components/WorkExperience.tsx` — Server Component, receives experience[]
- `src/components/Skills.tsx` — Server Component, receives skills Record
- `.planning/phases/01-content/01-CONTEXT.md` — locked design decisions (palette, card style)
- `.planning/REQUIREMENTS.md` — LAYOUT-01, LAYOUT-02 acceptance criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Current Layout State
- `src/app/page.tsx`: `<main className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-8">` with `<div className="mx-auto max-w-3xl flex flex-col gap-8">`
- All three section components are Server Components — Framer Motion's `motion.*` cannot be used directly on them
- Card style locked: `rounded-xl border border-zinc-200 bg-white px-6 py-6 shadow-sm`

### Integration Points
- Animation wrappers needed: thin `'use client'` components that wrap Server Component output
- `src/app/page.tsx` is the composition point — stagger delays set here or in a parent motion container

</code_context>

<specifics>
## Specific Implementation Notes

- Framer Motion's `whileInView` + `viewport={{ once: true }}` is the right API for one-time scroll animations
- Stagger: wrap all three sections in a `motion.div` with `staggerChildren`, or pass `delay` prop to each individually
- Since section components are Server Components, the motion wrapper must be a separate `'use client'` file — do NOT add `'use client'` to Header/WorkExperience/Skills themselves

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.
</deferred>
