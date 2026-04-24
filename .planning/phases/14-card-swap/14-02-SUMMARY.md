---
phase: 14
plan: 02
subsystem: WorkExperience card swap
tags: [shadcn, card, refactor, visual-parity]
requires: [CARD-01 infra from Phase 13]
provides: [CARD-02 satisfied]
affects: [src/components/WorkExperience.tsx]
tech-stack:
  added: ["@/components/ui/card imports in WorkExperience.tsx"]
  patterns: ["shadcn Card primitive per-entry, <article> landmark preserved, timeline dot sibling preserved"]
key-files:
  created: []
  modified:
    - src/components/WorkExperience.tsx
decisions:
  - "Applied D-01 (article landmark kept), D-02 (no Card subcomponents), D-03/04/05 (no className overrides), D-06 (timeline dot sibling), Finding #2 (inner flex flex-col gap-4 wrapper kept)"
metrics:
  duration: "~5 min"
  completed: "2026-04-24"
  tasks: 1
  files: 1
---

# Phase 14 Plan 02: WorkExperience Card Swap Summary

Swapped the hand-rolled per-entry card wrapper in `src/components/WorkExperience.tsx` for the shadcn `<Card><CardContent>` primitive while preserving the `<article>` landmark, the timeline dot sibling, and the inner `flex flex-col gap-4` spacing wrapper.

## Diff Applied

**Imports added:**
```tsx
import { Card, CardContent } from "@/components/ui/card";
```
(Biome auto-sorted all imports.)

**Per-entry wrapper — BEFORE:**
```tsx
<article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
  <div className="flex flex-col gap-4">
    ...
  </div>
</article>
```

**Per-entry wrapper — AFTER:**
```tsx
<article>
  <Card>
    <CardContent>
      <div className="flex flex-col gap-4">
        ...
      </div>
    </CardContent>
  </Card>
</article>
```

Inner block was reindented (two extra levels of spacing) — Biome then reformatted the `computeDuration(...)` call to split args across lines due to the deeper indentation. No semantic change.

## Grep Verification Results

| Check | Expected | Got |
|-------|----------|-----|
| `grep -c 'rounded-xl border border-zinc-200 bg-white p-6 shadow-sm' WorkExperience.tsx` | 0 | 0 |
| `grep -c '<Card>' WorkExperience.tsx` | ≥1 | 1 |
| `grep -c '<CardContent>' WorkExperience.tsx` | ≥1 | 1 |
| `grep -c 'from "@/components/ui/card"' WorkExperience.tsx` | 1 | 1 |
| `grep -c '<article>' WorkExperience.tsx` | ≥1 | 1 |
| `grep -c 'flex flex-col gap-4' WorkExperience.tsx` | ≥1 | 1 |
| `grep -c 'absolute z-10 -left-5.5' WorkExperience.tsx` | ≥1 | 1 |
| `grep -cE 'Card className=\|CardContent className=' WorkExperience.tsx` | 0 | 0 |
| `grep -cE 'CardHeader\|CardTitle\|CardDescription\|CardFooter' WorkExperience.tsx` | 0 | 0 |

All acceptance criteria pass.

## Lint / Build Result

- `npx biome check src/components/WorkExperience.tsx` → 1 warning (pre-existing `biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation>` placeholder on line 1 — not introduced by this plan), 0 errors.
- `npm run lint` (whole repo) → pre-existing errors in generated `types/validator.ts` (Next.js `noExplicitAny`) and `.next/types/` — out of scope per AGENTS.md / CLAUDE.md (generated Next.js 16 files). None were introduced by this change; repo was already in this state pre-task (confirmed via `git stash` baseline).
- `npm run build` → exits 0. Next.js build + static generation succeed.

## Inner Wrapper Preservation (Finding #2)

The `<div className="flex flex-col gap-4">` wrapper inside `<CardContent>` was **KEPT** per RESEARCH Finding #2. Card's own `gap-6` applies only to direct children of `Card` (in this case `<CardContent>`, which is a sole child). The inner `gap-4` is the sole source of vertical rhythm between the header row, the `<ul>` bullets, and `<TechStackIcons />`. Grep confirms `flex flex-col gap-4` match count is ≥1.

## Decisions Honored

- **D-01** — `<article>` landmark preserved (grep confirms).
- **D-02** — no `CardHeader`/`CardTitle`/`CardDescription`/`CardFooter` used.
- **D-03/04/05** — no `className` prop on `Card` or `CardContent`; theme tokens trusted for visual parity.
- **D-06** — timeline dot remains a sibling of `<article>` inside the parent `<div key={index} className="relative">`; lines 47–54 unchanged.
- **D-07** — scope locked to `src/components/WorkExperience.tsx`; no other files touched.
- **Finding #2** — inner `flex flex-col gap-4` wrapper retained.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Biome import sort**
- **Found during:** Task 1 post-edit lint check
- **Issue:** Adding the `@/components/ui/card` import made existing imports out of sort order (Biome `assist/source/organizeImports`, fixable).
- **Fix:** Ran `npx biome check --write src/components/WorkExperience.tsx` to auto-sort imports.
- **Files modified:** `src/components/WorkExperience.tsx`
- **Commit:** f452fd6 (folded into task commit)

**2. [Rule 3 — Blocking] Biome `computeDuration` argument reformat**
- **Issue:** After reindenting the JSX block two levels deeper, the `{computeDuration(entry.startDate, entry.endDate, now)}` call exceeded line width; Biome reformatted it to split args across lines.
- **Fix:** Accepted the automatic formatter change — no semantic difference.
- **Commit:** f452fd6

No architectural deviations. No Rule 4 checkpoints.

## Commits

- `f452fd6` — refactor(14-02): swap WorkExperience card wrapper to shadcn Card primitive

## Self-Check: PASSED

- FOUND: `src/components/WorkExperience.tsx` modified (commit f452fd6)
- FOUND: commit `f452fd6` in `git log`
- FOUND: `.planning/phases/14-card-swap/14-02-SUMMARY.md` (this file)
