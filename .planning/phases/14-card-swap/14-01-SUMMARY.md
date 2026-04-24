---
phase: 14
plan: 01
subsystem: ui/header
tags: [shadcn, card, refactor, visual-parity]
requires: [13-02]  # shadcn card primitive installed
provides: [CARD-01]
affects: [src/components/Header.tsx]
tech-stack:
  added: []
  patterns: ["shadcn Card primitive adoption"]
key-files:
  created: []
  modified:
    - src/components/Header.tsx
decisions:
  - "No className overrides on Card/CardContent (D-03/04/05)"
  - "Outer <section> landmark preserved (D-01)"
  - "Only Card + CardContent used — no CardHeader/Title/etc (D-02)"
metrics:
  duration_minutes: ~3
  completed: 2026-04-24
---

# Phase 14 Plan 01: Header.tsx Card Swap Summary

Swapped the hand-rolled card wrapper in `src/components/Header.tsx` for the shadcn `<Card><CardContent>` primitive installed in Phase 13, satisfying CARD-01.

## What Changed

- **Added import:** `import { Card, CardContent } from "@/components/ui/card"` at top of file.
- **Replaced line 17** `<section className="rounded-xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">` with `<section><Card><CardContent>`.
- **Replaced closing `</section>`** with `</CardContent></Card></section>`.
- **Biome auto-formatted** the file (added semicolons, reflowed children, sorted imports) — standard project style.

All children (`<h1>`, `<p>`, contact `<div>`, bio `<p>`) preserved verbatim. No className props on `<Card>` or `<CardContent>`.

## Verification

### Automated Grep Results
```
hand-rolled pattern count: 0      ✅ (expected 0)
<Card> count: 1                    ✅ (expected ≥ 1)
<CardContent> count: 1             ✅ (expected ≥ 1)
import count: 1                    ✅ (expected 1)
<section> count: 1                 ✅ (expected ≥ 1, D-01 landmark preserved)
Card/CardContent className= check: (none) ✅ (D-03/04/05 no overrides)
CardHeader/CardTitle/etc check:    (none) ✅ (D-02 scope)
```

### Lint
- `npx biome check src/components/Header.tsx` → **clean** (0 errors)
- Project-wide `npm run lint` has 15 pre-existing errors (baseline verified via `git stash`; count unchanged after this plan) — all in files outside D-07 scope (e.g. `.next/types/routes.d.ts`, `src/components/HighlightedBullet.tsx`, `src/components/EducationSection.tsx`, `src/app/globals.css`). Not introduced by this plan, not in scope to fix here. Plan 14-04 or a separate cleanup phase should address.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Ran `npx biome check --write src/components/Header.tsx` after edit**
- **Found during:** Task 1 verification (lint step)
- **Issue:** Biome flagged import ordering + formatting on the edited file (new import needed alphabetical sort vs existing import; semicolons + JSX reflow).
- **Fix:** Ran biome auto-fix on the single file (scope-locked to Header.tsx only).
- **Files modified:** src/components/Header.tsx (formatting only, no semantic change)
- **Commit:** 6977a45

### Claude's Discretion Exercised
None — no className overrides added, defaults used throughout (as D-03/04/05 mandate).

## Commits

| Task | Message | Hash |
| ---- | ------- | ---- |
| 1 | `refactor(14-01): swap Header.tsx to shadcn Card primitive` | 6977a45 |

## Threat Flags

None — visual-only JSX refactor, no new surface introduced. T-14-01 and T-14-02 mitigations verified (landmark preserved, no className overrides).

## Self-Check: PASSED

- ✅ src/components/Header.tsx exists and contains `<Card><CardContent>`
- ✅ commit 6977a45 exists in git log
- ✅ All 8 acceptance criteria grep checks pass
- ✅ Biome lint clean on modified file
