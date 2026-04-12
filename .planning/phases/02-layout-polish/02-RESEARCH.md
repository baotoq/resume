# Phase 2: Layout & Polish — Research

**Researched:** 2026-04-13
**Phase Goal:** The resume is readable on any device and sections animate into view on scroll
**Requirements:** LAYOUT-01, LAYOUT-02

---

## Summary

Phase 2 has two narrow, well-defined concerns:

1. **LAYOUT-01 — Responsive layout:** Existing Tailwind `sm:` breakpoint classes in the Phase 1 components already handle this. No structural changes needed.
2. **LAYOUT-02 — Scroll-entry animations:** Install Framer Motion, create a thin `AnimateIn` client wrapper component, and apply it around the three section cards in `page.tsx`.

Total new files: 1 (`src/components/AnimateIn.tsx`).
Total modified files: 1 (`src/app/page.tsx`).
Total new npm dependencies: 1 (`framer-motion`).

---

## LAYOUT-01: Responsive Layout

### Current State (from code audit)

`src/app/page.tsx`:
```tsx
<main className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-8">
  <div className="mx-auto max-w-3xl flex flex-col gap-8">
```

- `px-4` on mobile, `px-8` at `sm:` (640px+) — correct horizontal padding
- `max-w-3xl` constrains content width on desktop
- `flex-col gap-8` stacks sections vertically

`src/components/WorkExperience.tsx` (from Phase 1 plan):
- Role/date header uses `sm:flex-row` for two-column layout on wider screens

`src/components/Skills.tsx`:
- `grid-cols-1 gap-4 sm:grid-cols-2` — single column mobile, two columns desktop

### Finding

**No code changes needed for LAYOUT-01.** The existing classes already satisfy "readable on mobile without horizontal scrolling or clipped content" and "well-proportioned on desktop." This phase's work on LAYOUT-01 is verification only: confirm no horizontal scroll or clipped content at 375px and 1280px viewport widths.

---

## LAYOUT-02: Scroll-Entry Animations

### Framer Motion — `whileInView` API

Confirmed via Context7 docs (version compatible with React 18 / Next.js 16):

```tsx
// Declarative in-view animation
<motion.div
  initial={{ opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
  {children}
</motion.div>
```

- `whileInView` triggers animate when element enters viewport
- `viewport={{ once: true }}` — fires once, stays visible on scroll up
- Reduced motion: Framer Motion automatically respects `prefers-reduced-motion` — no extra code needed

### Stagger Pattern

Two implementation options:

**Option A — Individual delays (simpler, chosen per CONTEXT.md):**
```tsx
// page.tsx
<AnimateIn delay={0}>    <Header ... />    </AnimateIn>
<AnimateIn delay={0.1}>  <WorkExperience ... /> </AnimateIn>
<AnimateIn delay={0.2}>  <Skills ... />    </AnimateIn>
```

**Option B — Parent staggerChildren:**
```tsx
<motion.div variants={{ visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" whileInView="visible" viewport={{ once: true }}>
  {/* children use shared variants */}
</motion.div>
```

CONTEXT.md D-03 allows either. Option A is simpler (no shared variants needed) and aligns with the UI-SPEC spec: `transition={{ delay: index * 0.1 }}`. **Use Option A.**

### Server Component Constraint

- `Header`, `WorkExperience`, `Skills` are Server Components (no `'use client'`)
- Framer Motion's `motion.*` requires `'use client'`
- **Solution:** Create `src/components/AnimateIn.tsx` with `'use client'` — wraps `children: React.ReactNode` in a `motion.div`
- Server Components pass their rendered output as children to the client `AnimateIn` wrapper — this is the canonical Next.js pattern (confirmed in Next.js 16 `use-client.md`: "Nest Client Components within Server Components as needed")

### AnimateIn Component Spec (from UI-SPEC)

```tsx
'use client'

import { motion } from 'framer-motion'

interface AnimateInProps {
  children: React.ReactNode
  delay?: number
}

export function AnimateIn({ children, delay = 0 }: AnimateInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
```

### Installation

```bash
npm install framer-motion
```

Framer Motion is compatible with Next.js 16 (React 18/19). No additional configuration needed. It is a standard npm package, not a shadcn registry block.

---

## Validation Architecture

### Test Strategy

| Requirement | Verification Method |
|-------------|---------------------|
| LAYOUT-01 mobile | `dev` server running → resize browser to 375px → confirm no horizontal scroll, no clipped text |
| LAYOUT-01 desktop | Resize to 1280px → confirm proportional layout, no broken sections |
| LAYOUT-02 fade-in | Scroll page → confirm sections fade + slide up on entry |
| LAYOUT-02 once | Scroll back up → confirm sections remain visible (don't re-animate) |
| LAYOUT-02 stagger | Confirm 0.1s delay between Header, WorkExperience, Skills |
| Build | `npm run build` exits 0 with no TypeScript errors |

### Files to Verify Post-Execution

- `src/components/AnimateIn.tsx` exists with `'use client'` directive
- `src/app/page.tsx` imports and uses `AnimateIn` with delays `0`, `0.1`, `0.2`
- `package.json` contains `"framer-motion"` in dependencies
- `node_modules/framer-motion` exists (install ran)

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Framer Motion not installed before use | HIGH | Plan must include `npm install framer-motion` as first task |
| `motion.*` used in Server Component | HIGH | `AnimateIn` wrapper pattern avoids this entirely |
| `whileInView` not triggering (SSR) | LOW | Framer Motion handles SSR gracefully — elements render at final state server-side, animate client-side |
| Horizontal scroll introduced by `motion.div` | LOW | `motion.div` is block-level with no overflow by default — won't introduce scroll |

---

## RESEARCH COMPLETE

Phase 2 is narrowly scoped. All technical decisions were pre-made in CONTEXT.md and UI-SPEC. Research confirms:
- LAYOUT-01 requires only verification (no code changes)
- LAYOUT-02 requires: install framer-motion + create AnimateIn.tsx + update page.tsx
- 1 plan is sufficient to cover both requirements
