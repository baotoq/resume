# Phase 16: Token Unification — UI Design Contract

**Date:** 2026-04-24
**Phase:** 16-token-unification
**Scope:** Visual contract for swapping raw Tailwind color classes (`zinc-*`, `indigo-*`, `blue-*`, `bg-white`, `text-white`) with shadcn semantic tokens across four section components. No layout, typography-scale, spacing, or interaction changes. Visual parity contract: final render must read as cohesive and not visually regress from current Phase 15 state. Derived from 16-CONTEXT.md.

## Design Principle

**Token-trust policy.** All tokens needed for this swap already exist in `src/app/globals.css` `:root` block. No token additions, no token overrides, no `className` adjustments beyond the class-name substitution itself.

## Design Tokens Used

| Current Raw Class | Replacement Token Class | Underlying Token | oklch Value | Role |
|---|---|---|---|---|
| `text-zinc-900` | `text-foreground` | `--foreground` | `0.21 0.006 286` | Primary ink |
| `text-zinc-700` | `text-foreground` | `--foreground` | same | Secondary heavy text (collapsed to foreground) |
| `text-zinc-600` | `text-muted-foreground` | `--muted-foreground` | `0.556 0 0` | Bio / de-emphasized body |
| `text-zinc-500` | `text-muted-foreground` | same | same | Date ranges, secondary metadata |
| `text-zinc-400` | `text-muted-foreground` | same | same | Middle-dot separator, duration tags |
| `border-zinc-300` | `border-border` | `--border` | `0.922 0 0` | Timeline dot outline |
| `bg-zinc-300` | `bg-border` | `--border` | same | Bullet pseudo-dot fill |
| `bg-zinc-200` | `bg-border` | `--border` | same | Timeline vertical line |
| `bg-white` | `bg-background` | `--background` | `0.985 0 0` | Timeline dot inner fill |
| `text-indigo-600` | `text-primary` | `--primary` | `0.205 0 0` | Contact links, role-title accent |
| `hover:text-indigo-700` | `hover:text-primary/80` | `--primary` @ 80% | same | Link hover |
| `outline-indigo-600` | `outline-primary` | `--primary` | same | Focus ring |
| `bg-blue-600` | `bg-primary` | `--primary` | same | Current-job timeline dot fill |
| `text-blue-600` | `text-primary` | `--primary` | same | Role-title accent |
| `bg-zinc-800` | `bg-popover` | `--popover` | `1 0 0` | Tooltip surface |
| `text-white` (on tooltip) | `text-popover-foreground` | `--popover-foreground` | `0.21 0.006 286` | Tooltip text |

**New class added (not a token swap):** `border border-border` on the tooltip `<span>` — required because `--popover` is near-white and needs an explicit edge to remain visible on the near-white page background. This is the only additive class in the phase.

No new tokens. No custom classes. No `className` arithmetic beyond the 1:1 substitutions above.

## Expected Visual Impact

**Invariant (MUST NOT change):**
- Layout: card widths, grid, flex direction, `gap-*`, `p-*`, `mx-auto max-w-3xl` — all preserved.
- Typography: `text-2xl`, `text-xl`, `text-lg`, `text-base`, `text-sm`, `font-semibold`, `font-bold` — all preserved.
- Component structure: no JSX added/removed except the tooltip gains one `border border-border` utility.
- Shadcn primitives (`Card`, `Badge`, `Separator`) from Phases 13-15 — untouched.
- Header inline `·` row (Phase 15 D-07) — untouched.
- `src/app/page.tsx` — out of scope (`bg-zinc-50` on `<main>` deferred to a future phase).
- `AnimateIn` behavior, delays — untouched.

**Expected change (visible):**
- Indigo accent (`indigo-600`) on contact links and current-role title shifts to near-black (`--primary` oklch 0.205). **The resume becomes monochrome.** This is intentional per 16-CONTEXT.md D-05 and SC#1. Can be reverted to indigo later by editing ONE line in `globals.css` — zero component changes.
- Current-job timeline dot shifts from blue-600 to `--primary` (near-black). Same monochrome direction.
- Tooltip pill inverts: was dark pill on light page; now light pill with visible border on light page. Reading contrast preserved via border + `popover-foreground`.

**Expected change (invisible):**
- All zinc→foreground/muted-foreground/border swaps land on oklch values within 0.01 of their zinc counterparts. No perceivable shift.

## Per-File Contracts

### File 1: `src/components/Header.tsx`

| Line | Current | Replace with |
|---|---|---|
| 31 | `className="... text-zinc-900"` (H1 name) | `text-foreground` |
| 34 | `className="... text-zinc-700 mt-1"` (subtitle `<p>`) | `text-foreground` |
| 40 | `<span className="text-zinc-400"> · </span>` | `text-muted-foreground` |
| 43 | `text-indigo-600 hover:text-indigo-700 ... focus-visible:outline-indigo-600 ...` | `text-primary hover:text-primary/80 ... focus-visible:outline-primary ...` (three class replacements on the same attribute) |
| 54 | `className="mt-4 text-base leading-relaxed text-zinc-600"` (bio) | `text-muted-foreground` |

**Preservation:** All non-color classes (`text-[28px]`, `font-semibold`, `leading-[1.1]`, `text-xl`, `mt-1`, `mt-4`, `text-base`, `leading-relaxed`, `hover:underline`, `focus-visible:outline`, `focus-visible:outline-2`, `focus-visible:outline-offset-2`, the `flex flex-wrap` row, `<address>` wrapper) unchanged.

### File 2: `src/components/WorkExperience.tsx`

| Line | Current | Replace with |
|---|---|---|
| 30 | `text-zinc-900 mb-6` (H2) | `text-foreground` |
| 38 | `bg-zinc-200` (timeline line) | `bg-border` |
| 51 | `"bg-blue-600"` (current-job dot ternary true-branch) | `"bg-primary"` |
| 52 | `"border-2 border-zinc-300 bg-white"` (inactive-dot ternary false-branch) | `"border-2 border-border bg-background"` |
| 65 | `font-bold text-blue-600 text-lg` (role title H3) | `text-primary` |
| 72 | `text-xl font-bold text-zinc-900` (company name) | `text-foreground` |
| 77 | `text-sm font-bold text-zinc-500` (date range) | `text-muted-foreground` |
| 80 | `text-xs text-zinc-400` (duration tag) | `text-muted-foreground` |
| 94 | `text-base leading-relaxed text-zinc-700 pl-4 relative before:... before:bg-zinc-300` (bullet `<li>`) | `text-foreground` on main, `before:bg-border` on pseudo-element |

**Preservation:** Timeline geometry (`absolute left-0.75 sm:left-1.75 top-7 bottom-0 w-0.5`, `absolute z-10 -left-5.5 sm:-left-6.5 top-5.5 w-3 h-3 rounded-full`, bullet pseudo-element `before:absolute before:left-0 before:top-[10px] before:h-1.5 before:w-1.5 before:rounded-full`), font weights, spacing utilities, `mb-6`, `text-xl`, `text-lg`, `text-base`, `text-sm`, `text-xs`, `leading-relaxed`, `pl-4`, `relative` — all unchanged.

### File 3: `src/components/EducationSection.tsx`

| Line | Current | Replace with |
|---|---|---|
| 27 | `text-zinc-900 mb-6` (H2) | `text-foreground` |
| 37 | `text-lg font-semibold text-zinc-900` (degree/program H3) | `text-foreground` |
| 40 | `text-base text-zinc-700` (school name `<p>`) | `text-foreground` |
| 44 | `text-sm font-semibold text-zinc-500 sm:text-right` (date range `<span>`) | `text-muted-foreground` |
| 49 | `mt-4 text-base leading-relaxed text-zinc-700` (description `<p>`) | `text-foreground` |

**Preservation:** Layout (`sm:text-right`, `mt-4`), typography (`text-lg`, `text-base`, `text-sm`, `font-semibold`, `leading-relaxed`, `mb-6`) — unchanged.

### File 4: `src/components/techstack-icons/TechStackIcons.tsx`

**Scope:** Tooltip `<span>` (line 82) ONLY. Icon-hit branch structure unchanged. Fallback branch (already uses shadcn `Badge` from Phase 15) unchanged.

| Line | Current | Replace with |
|---|---|---|
| 82 | `className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none z-10"` | Replace `bg-zinc-800 text-white` with `bg-popover text-popover-foreground border border-border`. All other classes unchanged. |

**Result:** `className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground border border-border text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none z-10"`

**Preservation:** Positioning (`absolute -top-8 left-1/2 -translate-x-1/2`), sizing (`text-xs px-2 py-1`), radius (`rounded`), animation (`opacity-0 group-hover:opacity-100 transition-opacity duration-150`), layout safety (`whitespace-nowrap pointer-events-none z-10`) — all unchanged.

## Interaction Contract

Unchanged. No new interactions. Links still navigate. Focus ring still appears on `focus-visible`. Tooltip still fades in on `group-hover`. No keyboard, motion, or assistive-tech behavior changes.

## Responsive Contract

Unchanged. No media-query classes modified. Breakpoints (`sm:`) preserved on timeline dot offsets and date-range alignment. Rendering at 375px and 1280px must match Phase 15 geometry exactly.

## Accessibility Contract

- **Contrast requirement:** Every replacement token MUST meet WCAG AA contrast against its surface.
  - `foreground` (0.21) on `background` (0.985) → ~13:1 (AA + AAA pass).
  - `muted-foreground` (0.556) on `background` (0.985) → ~4.8:1 (AA pass for normal text).
  - `primary` (0.205) on `background` (0.985) → ~13:1 (AA + AAA pass).
  - `popover-foreground` (0.21) on `popover` (1.0) → ~13:1 (AA + AAA pass).
- **Focus indicator:** `focus-visible:outline-primary` on contact links MUST remain visible — `--primary` (0.205) against `--background` (0.985) clears 3:1 non-text AA requirement.
- **Keyboard:** No keyboard-reachable element loses its focus style. Tooltip remains hover-only (not in keyboard tab order today; unchanged).

## Verification Contract

Two enforcement layers:

1. **Automated grep gate (hard block):**
   ```bash
   rg "text-zinc-|border-zinc-|bg-zinc-|text-indigo-|bg-indigo-|outline-indigo-|bg-blue-|text-blue-|bg-white|text-white" \
      src/components/Header.tsx \
      src/components/WorkExperience.tsx \
      src/components/EducationSection.tsx \
      src/components/techstack-icons/TechStackIcons.tsx
   ```
   MUST return zero matches.

2. **Build + lint gate:**
   - `npm run build` → green
   - `npm run lint` → green (no new Biome violations)

3. **Manual visual check (user sign-off):**
   - Render at 375px and 1280px in browser.
   - Confirm: monochrome reads cohesive, no mid-page color flash, tooltip visible on hover, timeline dots distinguishable between current vs inactive.
   - If monochrome reads sterile, defer to follow-up phase that customizes `--primary` oklch in `globals.css` (zero component impact).

## Locked Decisions (inherited from 16-CONTEXT.md)

- D-01 through D-10 from 16-CONTEXT.md are LOCKED. UI-SPEC is consistent with CONTEXT; in case of conflict, CONTEXT wins.

## Out of Scope (UI-Spec enforcement)

- `src/app/page.tsx` (`bg-zinc-50` on `<main>`)
- `src/app/layout.tsx`
- `src/app/globals.css` (token values)
- `src/components/ui/*.tsx` (shadcn primitives)
- `src/components/animation/AnimateIn.tsx`
- Dark mode (`.dark` variant)
- Font family / font weight / line-height / letter-spacing
- Any spacing, margin, padding, gap changes

---

*Phase: 16-token-unification*
*UI design contract: 2026-04-24*
