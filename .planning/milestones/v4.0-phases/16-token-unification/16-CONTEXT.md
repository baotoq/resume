# Phase 16: Token Unification - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning
**Mode:** `--auto` (recommended defaults selected for every gray area)

<domain>
## Phase Boundary

Replace every raw `zinc-*`, `indigo-*`, `blue-*`, and `bg-white` Tailwind color class in the four section components (`Header.tsx`, `WorkExperience.tsx`, `EducationSection.tsx`, `TechStackIcons.tsx`) with shadcn semantic tokens defined in `src/app/globals.css`. No structural/layout/typography-scale changes — pure color/token swap. Success = no raw color classes remain in these four files, resume still reads cohesively at 375px and 1280px, build + lint green.

**Out of scope:** Dark mode wiring (only `:root` tokens exist today, no `.dark` block). Token palette changes. Font swap (already Geist, no Inter migration). Page-level `page.tsx`. `AnimateIn`. New shadcn primitives. Header inline `·` separators (already locked in Phase 15 D-07).

</domain>

<decisions>
## Implementation Decisions

### Zinc Hierarchy Mapping (D-01 → D-04)
Canonical mapping applied across all four files. Grounded in `globals.css` `:root` token values.

- **D-01:** `text-zinc-900` → `text-foreground`. Primary body text. (Header H1, WorkExperience H2/H3, EducationSection H2/H3.)
- **D-02:** `text-zinc-700` → `text-foreground`. Secondary heavy text (subtitle, bullets, school name). Reason: `--foreground` is the single "dark ink" token; distinguishing 900/700 requires a token we don't have. Collapsing to one reads cohesive, not flat — weight/size already carries hierarchy.
- **D-03:** `text-zinc-600`, `text-zinc-500`, `text-zinc-400` → `text-muted-foreground`. Bio paragraph, date ranges, durations, middle-dot separator. Reason: all three zinc shades currently convey "de-emphasized metadata" — `--muted-foreground` (oklch 0.556) is the single de-emphasis token.
- **D-04:** `border-zinc-300`, `bg-zinc-300`, `bg-zinc-200` → `border-border`, `bg-border`. Timeline line, timeline dot border, bullet-point pseudo-element dot. Reason: `--border` (oklch 0.922) is the structural-line token already used by shadcn primitives (Card, Separator, Badge secondary outline).

### Indigo Accent (D-05)
- **D-05:** `text-indigo-600`, `hover:text-indigo-700`, `outline-indigo-600` (Header contact links, WorkExperience role title) → `text-primary`, `hover:text-primary/80`, `outline-primary`.
  - **Why:** `--primary` is currently oklch(0.205 0 0) (near-black). This shifts the accent from indigo-blue to near-black — matches the monochrome shadcn defaults and reads as "accent via weight/color-contrast, not hue." SC#1 explicitly lists `text-indigo-*` elimination. Keeping indigo would require adding a new token — out of scope.
  - **Trade-off acknowledged:** Loss of visual indigo accent. The resume becomes fully monochrome. If user wants the indigo back, Phase 17+ can customize `--primary` in `globals.css` to an indigo oklch value — ZERO component changes needed, proving the token abstraction worked.

### Blue Timeline Dot (D-06)
- **D-06:** `bg-blue-600` (WorkExperience.tsx:51, current-job dot) → `bg-primary`.
  - **Why:** Same monochrome logic as D-05. Current-job dot stays visually distinct from inactive dots (border-border bg-card) through fill vs outline, not hue.

### Tooltip Pill Recolor (D-07)
- **D-07:** `bg-zinc-800 text-white` (TechStackIcons.tsx:82, hover tooltip) → `bg-popover text-popover-foreground border border-border`.
  - **Why:** `--popover` + `--popover-foreground` are the semantic tokens for floating surfaces. Current values are identical to `--background`/`--foreground` (both white/near-black) — this INVERTS the tooltip contrast (dark pill on light bg → light pill on light bg). Need `border` to keep the pill visible. Alternative "keep high-contrast" approach: `bg-foreground text-background`. Recommended default picks popover semantics because that's the canonical shadcn pattern for this surface.

### bg-white on Inactive Timeline Dot (D-08)
- **D-08:** `bg-white` (WorkExperience.tsx:52, non-current dot inner) → `bg-background`.
  - **Why:** `--background` is oklch(0.985 0 0) — near-white, same visual result, now theme-aware. SC#2 requires `bg-white` removal.

### Files Locked OUT of Scope (D-09)
- **D-09:** Do NOT touch `src/app/page.tsx`, `src/components/animation/AnimateIn.tsx`, `src/components/ui/*.tsx` (shadcn primitives), `src/app/globals.css` (token definitions), `src/app/layout.tsx`. Phase 16 modifies exactly four files.

### Verification (D-10)
- **D-10:** `npm run build` + `npm run lint` green (SC#4). Plus ripgrep gate: `rg "text-zinc-|border-zinc-|bg-zinc-|text-indigo-|bg-indigo-|outline-indigo-|bg-blue-|text-blue-|bg-white" src/components/Header.tsx src/components/WorkExperience.tsx src/components/EducationSection.tsx src/components/techstack-icons/TechStackIcons.tsx` MUST return zero matches. Manual browser check at 375px + 1280px for visual cohesion (SC#5).

### Claude's Discretion
- `text-zinc-700` vs `text-zinc-900` collapse to same `text-foreground` — if downstream planning finds a weight/opacity variant reads better, Claude may use `text-foreground/90` as middle-tier.
- Tooltip alternative: if popover tokens produce unreadable contrast in practice, Claude may fall back to `bg-foreground text-background` (D-07 alternative noted).
- Order of file edits — no dependency between files.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Files to modify (4 files — scope lock)
- `src/components/Header.tsx` — 5 classes: L31 zinc-900, L34 zinc-700, L40 zinc-400, L43 indigo-600/700 + outline-indigo-600, L54 zinc-600
- `src/components/WorkExperience.tsx` — 10 classes: L30 zinc-900, L38 bg-zinc-200, L51 bg-blue-600, L52 border-zinc-300 + bg-white, L65 text-blue-600, L72 zinc-900, L77 zinc-500, L80 zinc-400, L94 zinc-700 + before:bg-zinc-300
- `src/components/EducationSection.tsx` — 5 classes: L27 zinc-900, L37 zinc-900, L40 zinc-700, L44 zinc-500, L49 zinc-700
- `src/components/techstack-icons/TechStackIcons.tsx` — 1 class set: L82 bg-zinc-800 text-white (tooltip)

### Files to read (don't modify)
- `src/app/globals.css` — `:root` token definitions. Authoritative list: foreground, muted-foreground, background, card, border, primary, primary-foreground, popover, popover-foreground, secondary, secondary-foreground.
- `src/components/ui/badge.tsx`, `src/components/ui/card.tsx`, `src/components/ui/separator.tsx` — reference for how shadcn primitives already use these tokens (pattern consistency check).

### Prior phase artifacts
- `.planning/phases/15-badge-and-separator/15-CONTEXT.md` — Phase 15 locked D-07: Header inline `·` stays untouched. D-09: shadcn primitives are client components.
- `.planning/REQUIREMENTS.md` — TOKEN-01 (color class swap), TOKEN-02 (supersedes TYP-01 through TYP-04 — typography/spacing already locked in prior phases, not re-litigated here).
- `.planning/ROADMAP.md` Phase 16 — 5 success criteria.

### No external specs
All requirements captured in REQUIREMENTS.md + ROADMAP.md. No ADRs. Token palette defined fully in `globals.css`.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Every shadcn token needed by the swap is already declared in `src/app/globals.css:7-26` — no token additions required.
- shadcn primitives (`Badge`, `Card`, `Separator`) already prove the token→class pattern: `bg-secondary text-secondary-foreground`, `bg-card`, `bg-border`.

### Established Patterns
- Section components use utility classes inline on JSX — no `cn()`/variant system for section components. Swap is a mechanical find/replace per file.
- Biome is the linter (`npm run lint`). Enforces formatting but not token usage — the ripgrep gate in D-10 is the real enforcement mechanism.

### Integration Points
- Zero runtime integration points change. Swap is pure class-string substitution. No imports added or removed. No props change.
- shadcn tokens auto-propagate through `@theme inline` block in `globals.css` — classes like `text-foreground` are generated by Tailwind from `--color-foreground: var(--foreground)`.

### Landmines
- `text-white` in the tooltip (TechStackIcons.tsx:82) is NOT a zinc class but IS a raw color — must be swapped per SC#1 spirit (D-07).
- `border-zinc-200` and `bg-zinc-200` should NOT both map to `bg-border` if one is a border and other a background — re-verify at plan time. Current audit shows `bg-zinc-200` is the timeline LINE (effectively a thin background rectangle used as a visual line) → `bg-border` is correct (same semantic).
- `page.tsx` has `bg-zinc-50` on the root `<main>`. NOT in scope (D-09 locks page.tsx out) but flag for Phase 17 if user wants full-page token coverage.

</code_context>

<specifics>
## Specific Ideas

- User explicitly confirmed in Phase 15 that Phase 16 consolidates TOKEN-01 + TOKEN-02. Typography scale (TYP-01) and spacing (TYP-02) were LOCKED in Phases 10-12; Phase 16 only touches color tokens, not type/spacing.
- Monochrome direction accepted via `--primary` token (near-black) as accent. User can recolor later by editing ONE line in `globals.css` — proves token abstraction.

</specifics>

<deferred>
## Deferred Ideas

- **Dark mode wiring** — `globals.css` declares `@custom-variant dark` but no `.dark` block. Would make Phase 16's token swap actually pay off. Candidate for new milestone.
- **Re-introduce indigo accent** — customize `--primary` oklch value in `globals.css` if monochrome feels sterile after visual check. Single-line change, zero component diff. Future phase or inline tweak.
- **`page.tsx` `bg-zinc-50`** — extend token coverage to page shell. Small follow-up phase.
- **Add dark-mode-aware shadow tokens** — Cards currently have no shadow; if added later, needs `--shadow` token not `shadow-zinc-*`.

</deferred>

---

*Phase: 16-token-unification*
*Context gathered: 2026-04-24*
