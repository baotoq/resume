# Phase 15: Badge and Separator — Technical Research

**Date:** 2026-04-24
**Phase:** 15-badge-and-separator
**Requirements:** BADGE-01, SEP-01

## Scope

Two primitive swaps informed by Phase 13 infrastructure and Phase 14 trust-the-tokens precedent:

1. **BADGE-01** — Replace hand-rolled fallback pill `<span className="bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5 text-xs">{tech}</span>` in `src/components/techstack-icons/TechStackIcons.tsx:88-92` with shadcn `<Badge variant="secondary">{tech}</Badge>`.
2. **SEP-01** — Insert two horizontal shadcn `<Separator>` elements between the three top-level resume sections in `src/app/page.tsx`, animation-coupled via `AnimateIn` wrappers with matching delays (0.1, 0.2).

## Component API Survey

### Badge (`src/components/ui/badge.tsx`)

- Renders `<span>` (or `<Slot>` if `asChild`).
- Default classes: `inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow]`.
- `variant="secondary"` adds `bg-secondary text-secondary-foreground`.
- No `"use client"` directive → RSC-safe.
- Children: `tech` string, no transformation needed.

**Visual parity analysis:**
- Hand-rolled: `bg-zinc-100` (`#f4f4f5`) / `text-zinc-600` (`#52525b`) / `rounded-full` / `px-2 py-0.5` / `text-xs`.
- Badge secondary: `bg-secondary` (`oklch(0.97 0 0)` ≈ zinc-50) / `text-secondary-foreground` (`oklch(0.205 0 0)` ≈ zinc-900) / `rounded-full` / `px-2 py-0.5` / `text-xs`.
- Background: slightly lighter (~0.03 oklch lightness delta). Foreground: noticeably darker (zinc-900 vs zinc-600). Accepted token-driven delta per Phase 14 D-04 precedent.

### Separator (`src/components/ui/separator.tsx`)

- Renders `SeparatorPrimitive.Root` from `radix-ui`.
- File declares `"use client"` — but Separator is a pass-through primitive that accepts no client-only props in our usage. Safe to render inside Server Components; React handles the client boundary.
- Default: `orientation="horizontal"`, `decorative={true}`.
- Default classes: `shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full`.
- `bg-border` token = `oklch(0.922 0 0)` ≈ zinc-200 (matches Card borders from Phase 14).

## Integration Analysis

### File 1: `src/components/techstack-icons/TechStackIcons.tsx`

Current structure (lines 73-93):
```tsx
function TechIcon({ tech }: { tech: string }) {
  const key = normalizeTech(tech);
  const Icon = TECH_ICON_MAP[key];

  if (Icon) {
    return (
      <div className="relative group">
        <Icon size={40} />
        <span className="absolute -top-8 ...">{tech}</span>
      </div>
    );
  }

  return (
    <span className="bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5 text-xs">
      {tech}
    </span>
  );
}
```

Only the `else` return branch changes. The `if (Icon)` branch (icon row + tooltip) is locked by SC#2 — must NOT apply Badge. The tooltip `<span>` inside the icon branch is also unchanged (it is absolute-positioned tooltip markup, not a badge).

### File 2: `src/app/page.tsx`

Current structure:
```tsx
<div className="mx-auto max-w-3xl flex flex-col gap-8">
  <AnimateIn delay={0}><Header ... /></AnimateIn>
  <AnimateIn delay={0.1}><WorkExperience ... /></AnimateIn>
  <AnimateIn delay={0.2}><EducationSection ... /></AnimateIn>
</div>
```

Target structure:
```tsx
<div className="mx-auto max-w-3xl flex flex-col gap-8">
  <AnimateIn delay={0}><Header ... /></AnimateIn>
  <AnimateIn delay={0.1}><Separator /></AnimateIn>
  <AnimateIn delay={0.1}><WorkExperience ... /></AnimateIn>
  <AnimateIn delay={0.2}><Separator /></AnimateIn>
  <AnimateIn delay={0.2}><EducationSection ... /></AnimateIn>
</div>
```

**Rationale for AnimateIn wrapping:** A bare `<Separator />` renders at t=0 (fully visible) while the following `AnimateIn` card is still fading in from `opacity: 0`. Wrapping the Separator in its own `AnimateIn` with the same delay as the card below keeps the divider and card entering as a coordinated unit — no orphan line preceding an empty space.

**Gap spacing:** Parent `flex flex-col gap-8` = 32px between every child. With separators inserted, every child (including Separators) gets 32px above and below. Visually: 32px + 1px line + 32px = ~65px breathing band between cards. Acceptable.

## Header Inline Dots (SC#4 Lock Verification)

`src/components/Header.tsx:40` renders `·` as inline text between contact links inside a `flex flex-wrap` row. Replacing with `<Separator orientation="vertical">` would:
- Require fixed-height container (vertical Separator is `h-full`).
- Break `flex-wrap` — line breaks would leave orphaned separators.
- Introduce client-boundary for each contact dot (performance micro-regression).

**Conclusion:** Keep text `·`. Header.tsx is NOT in scope for Phase 15 modifications.

## Dependency Check

- shadcn Badge primitive: installed Phase 13 ✓
- shadcn Separator primitive: installed Phase 13 ✓
- `radix-ui` package: installed Phase 13 ✓
- Theme tokens (`--secondary`, `--secondary-foreground`, `--border`): wired in Phase 13 ✓
- `AnimateIn` component: pre-existing from Phase 3 ✓

No new dependencies. No lockfile changes expected.

## Validation Architecture

**Test strategy:** Match Phase 14 approach — grep-based acceptance criteria + build/lint gate + manual browser verification.

### Validation dimensions

1. **Structural** — shadcn primitives present, hand-rolled pattern absent (grep).
2. **Semantic** — `<section>`/`<article>` landmarks untouched (grep).
3. **Scope lock** — Header.tsx unchanged, only fallback branch in TechStackIcons modified (git diff scope).
4. **Build** — `npm run build` passes.
5. **Lint** — `npm run lint` (Biome) passes with no errors.
6. **Visual** — Manual check at 375px / 1280px: fallback Badge visible, two horizontal lines between cards.

### Automatable vs manual

- **Automatable (CI-checkable):** #1, #2, #3, #4, #5 via grep + npm commands.
- **Manual only:** #6 visual parity — no visual regression suite in this project (same as Phase 14 D-08).

## Risk Register

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Secondary token contrast too low on white bg | Low | oklch L=0.97 bg + L=0.205 fg = strong contrast. WCAG AA likely met. Verify manually. |
| Separator `"use client"` breaks RSC streaming | Low | Radix Separator is a pass-through; React handles boundary. Phase 13 installed it, build gate passed. |
| AnimateIn delay stacking causes jank | Low | Same delay values already used for cards; separator animates in parallel with following card — no new timing. |
| Header `·` replaced by mistake | Med | SC#4 lock + scope-lock D-07 in CONTEXT. Acceptance criterion greps Header.tsx for no diff. |
| Badge children string re-rendered differently | Low | `{tech}` is plain string prop, no transformation. |

## Implementation Notes

- Two files changed: `src/components/techstack-icons/TechStackIcons.tsx`, `src/app/page.tsx`.
- `AnimateIn` is already imported in `page.tsx` — no new import needed for it.
- `Separator` needs new import in `page.tsx`: `import { Separator } from "@/components/ui/separator"`.
- `Badge` needs new import in `TechStackIcons.tsx`: `import { Badge } from "@/components/ui/badge"`.
- Biome import-order rule: run `npm run format` after edits to auto-sort imports (Phase 14-03 precedent).

## RESEARCH COMPLETE
