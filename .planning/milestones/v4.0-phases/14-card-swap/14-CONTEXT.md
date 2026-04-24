# Phase 14: Card Swap - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the hand-rolled card pattern `rounded-xl border border-zinc-200 bg-white p-6 shadow-sm` in three components (Header, WorkExperience, EducationSection) with the shadcn `<Card><CardContent>` primitive installed in Phase 13. Visual parity priority — no restructuring, no new UI, no new capabilities. Requirements CARD-01/02/03.

</domain>

<decisions>
## Implementation Decisions

### Semantic Element Preservation
- **D-01:** Preserve existing semantic landmarks. shadcn `Card` renders `<div>` with no `asChild` prop. Wrap `<Card>` inside the existing outer `<section>` (Header.tsx) and `<article>` (WorkExperience.tsx per-entry, EducationSection.tsx per-entry) tags.
  - **Why:** HTML5 landmark semantics matter for a resume site (accessibility, SEO). Losing `<section>`/`<article>` in exchange for a `<div>` regresses a11y.
  - **How to apply:** Structure becomes `<section><Card><CardContent>...existing children...</CardContent></Card></section>`. Outer wrapper carries no visual classes (all styling moves to Card).

### Sub-primitive Scope
- **D-02:** Use only `<Card>` and `<CardContent>` from the card primitive. Do NOT introduce `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardFooter>` in this phase.
  - **Why:** CardTitle renders a `<div>` — replacing existing `<h1>`/`<h2>`/`<h3>` with CardTitle would lose heading semantics AND require typography re-tuning. Phase goal is visual parity, not structural rework.
  - **How to apply:** Move existing markup untouched into `<CardContent>`. Keep all `<h1>`/`<h2>`/`<h3>`/`<p>` tags and classes intact.

### Padding Parity
- **D-03:** Card default `py-6` + CardContent default `px-6` sums to `p-6` on all sides — matches the hand-rolled `p-6` exactly. No padding overrides needed for WorkExperience or EducationSection entries.
  - **Edge case:** Header.tsx currently uses `px-6 py-6` (same as `p-6`). Same result — no override needed.
  - **How to apply:** Default `<Card><CardContent>` with no extra padding classes.

### Color Token Parity
- **D-04:** Trust shadcn theme tokens from Phase 13 (`--card: oklch(1 0 0)` = pure white, `--border: oklch(0.922 0 0)` ≈ zinc-200). Do NOT add `bg-white` / `border-zinc-200` overrides on `<Card>`.
  - **Why:** Phase 13 D-02 committed to single color system. Adding utility overrides defeats the token swap and re-introduces mixed color sources.
  - **Acceptable delta:** `--border: oklch(0.922 0 0)` is hue-neutral; zinc-200 is `#e4e4e7` ≈ `oklch(0.92 0 286)`. Visually indistinguishable on a white card at 1px border width.

### Border Radius Delta (Accepted)
- **D-05:** Accept shadcn's `rounded-xl` = `calc(0.625rem * 1.4)` = `0.875rem` (14px) instead of Tailwind default `0.75rem` (12px).
  - **Why:** Phase 13 globals.css already overrides `--radius-xl` via `@theme inline`. Phase 13 D-11 gate passed with this radius active. Reverting would require a theme token fight.
  - **How to apply:** No `rounded-*` override on `<Card>`. Same 14px radius applies site-wide for consistency.

### Timeline Dot (WorkExperience)
- **D-06:** The timeline dot at `WorkExperience.tsx:46-53` sits OUTSIDE the card wrapper and is unaffected. It remains a sibling `<div>` inside the parent `div.relative` along with the new `<article><Card>`.
  - **How to apply:** Touch only line 56's `<article className="rounded-xl ...">`. Do not touch the dot markup.

### Scope Lock
- **D-07:** Only the three files listed below are modified. No changes to HighlightedBullet, TechStackIcons, animation wrappers, or any other component. No changes to `src/components/ui/card.tsx`.

### Verification Method
- **D-08:** Visual parity verified manually in browser at 375px (mobile) and 1280px (desktop) — screenshot comparison before/after. Plus `npm run build` and `npm run lint` must pass. No automated visual regression suite in this project.

### Claude's Discretion
- Exact `className` prop passthrough on `<Card>` if a specific site needs an override (e.g., `gap-0` to kill Card's default `gap-6` if a flex-col gap conflict surfaces). Default: no overrides.
- Whether to remove now-redundant `flex flex-col gap-4` wrapper inside WorkExperience card — Card itself is flex-col with gap-6. Discretion call during planning.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Files to modify
- `src/components/Header.tsx` — line 17, swap `<section className="rounded-xl ...">` for `<section><Card><CardContent>...`
- `src/components/WorkExperience.tsx` — line 56, swap `<article className="rounded-xl ...">` for `<article><Card><CardContent>...`. Preserve timeline dot sibling (lines 46-53).
- `src/components/EducationSection.tsx` — line 32, swap `<article className="rounded-xl ...">` (or equivalent wrapping element) for `<article><Card><CardContent>...`

### Files to read (don't modify)
- `src/components/ui/card.tsx` — shadcn primitive API; confirms default classes `flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm` on Card and `px-6` on CardContent
- `src/app/globals.css` — confirms `--card: oklch(1 0 0)` and `--border: oklch(0.922 0 0)` tokens available
- `src/types/resume.ts` — ResumeData shape (no changes)

### Prior phase artifacts
- `.planning/phases/13-shadcn-infrastructure/13-CONTEXT.md` — D-02 (oklch color system), D-09 (card/badge/separator installed), D-11 (build+lint gate)
- `.planning/phases/13-shadcn-infrastructure/13-VERIFICATION.md` — Phase 13 gate verification (infrastructure ready)

### Requirements
- `.planning/REQUIREMENTS.md` — CARD-01 (Header), CARD-02 (WorkExperience), CARD-03 (EducationSection)

### Roadmap
- `.planning/ROADMAP.md` — Phase 14 Success Criteria 1-5

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/card.tsx` — shadcn Card + CardContent primitives, already installed and gated in Phase 13
- `cn()` from `@/lib/utils` — available if className merging needed on Card
- Theme tokens `--card`, `--border`, `--radius-xl` — wired in globals.css

### Established Patterns
- Server Components by default (Header, WorkExperience, EducationSection all SSR) — shadcn Card is a plain `<div>` forwardRef-free, safe in RSC
- Tailwind v4 utilities + theme tokens (no tailwind.config.*)
- Biome lint — shadcn files already pass per Phase 13

### Integration Points
- Three components, all rendered from `src/app/page.tsx`. No data layer changes. No route changes.

</code_context>

<specifics>
## Specific Ideas

- Visual parity is the north star. Any observable change in browser (even a 2px radius bump) must be explicitly accepted (D-05) or rejected. If D-05's 12px→14px radius is a regression in the user's eye, revisit with a per-site `rounded-[12px]` override before implementation locks in.
- Before/after screenshots at 375px and 1280px are the verification artifact.

</specifics>

<deferred>
## Deferred Ideas

- Using `CardHeader` + `CardTitle` to standardize section headings — would require heading semantic rework. Defer to a later typography/structure phase if ever.
- Dark mode variants via `--card` dark-theme tokens — out of scope; no dark mode in this project yet.
- Hover/focus states on cards (shadcn supports them) — not in requirements.

</deferred>

---

*Phase: 14-card-swap*
*Context gathered: 2026-04-24*
