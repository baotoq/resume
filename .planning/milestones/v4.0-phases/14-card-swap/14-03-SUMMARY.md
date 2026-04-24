---
phase: 14-card-swap
plan: 03
subsystem: ui-components
tags:
  - shadcn
  - card
  - refactor
  - visual-parity
  - education
requires:
  - src/components/ui/card.tsx (Card, CardContent primitives — installed in plan 13-02)
  - src/components/EducationSection.tsx (pre-existing hand-rolled card wrapper)
provides:
  - EducationSection using shadcn <Card><CardContent> per entry
  - CARD-03 requirement satisfied
affects:
  - src/components/EducationSection.tsx (one file, JSX-only change)
tech-stack:
  added: []
  patterns:
    - "Wrap list-item landmark <article> around shadcn Card so key={index} stays on the landmark (Pitfall #3)"
key-files:
  created: []
  modified:
    - src/components/EducationSection.tsx
decisions:
  - "Key prop placement: kept key={index} on <article>, NOT on <Card>, to preserve list reconciliation stability against React's default-shallow key semantics (D-01 + Pitfall #3)"
  - "No className overrides on Card/CardContent — accept shadcn default tokens verbatim (D-03/04/05)"
  - "Inner layout wrappers, headings, date span, and mt-4 details paragraph preserved verbatim"
metrics:
  duration_minutes: 2
  tasks_completed: 1
  files_modified: 1
  completed_date: 2026-04-24
requirements:
  - CARD-03
---

# Phase 14 Plan 03: EducationSection Card Swap Summary

**One-liner:** Swapped the hand-rolled card wrapper on EducationSection entries for shadcn `<Card><CardContent>`, keeping `<article key={index}>` as the outer landmark per Pitfall #3.

## Diff Applied

### Import (src/components/EducationSection.tsx, top)

BEFORE:
```tsx
import type { EducationEntry } from "@/types/resume";
```

AFTER:
```tsx
import type { EducationEntry } from "@/types/resume";
import { Card, CardContent } from "@/components/ui/card";
```

### Per-entry JSX

BEFORE (lines 30-50):
```tsx
<article
  key={index}
  className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
>
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-0">
    <div className="flex flex-col gap-1">
      <h3 className="text-lg font-semibold text-zinc-900">{entry.degree}</h3>
      <p className="text-base text-zinc-700">{entry.institution}</p>
    </div>
    <span className="text-sm font-semibold text-zinc-500 sm:text-right">
      {formatDateRange(entry.startDate, entry.endDate)}
    </span>
  </div>
  {entry.details && (
    <p className="mt-4 text-base leading-relaxed text-zinc-700">
      {entry.details}
    </p>
  )}
</article>
```

AFTER:
```tsx
<article key={index}>
  <Card>
    <CardContent>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-0">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-zinc-900">{entry.degree}</h3>
          <p className="text-base text-zinc-700">{entry.institution}</p>
        </div>
        <span className="text-sm font-semibold text-zinc-500 sm:text-right">
          {formatDateRange(entry.startDate, entry.endDate)}
        </span>
      </div>
      {entry.details && (
        <p className="mt-4 text-base leading-relaxed text-zinc-700">
          {entry.details}
        </p>
      )}
    </CardContent>
  </Card>
</article>
```

## Grep Verification Results

| Check | Expected | Actual |
|-------|----------|--------|
| `grep -c 'rounded-xl border border-zinc-200 bg-white p-6 shadow-sm'` | `0` | `0` ✓ |
| `grep -c '<Card>'` | `>= 1` | `1` ✓ |
| `grep -c '<CardContent>'` | `>= 1` | `1` ✓ |
| `grep -c 'from "@/components/ui/card"'` | `1` | `1` ✓ |
| `grep -c '<article key={index}>'` | `>= 1` | `1` ✓ (key on article, Pitfall #3 respected) |
| `grep -c 'mt-4'` | `>= 1` | `1` ✓ (details margin preserved) |
| `grep -E 'Card key='` | no match | no match ✓ (key NOT moved to Card) |
| `grep -E 'Card className=\|CardContent className='` | no match | no match ✓ (no overrides, D-03/04/05) |
| `grep -E 'CardHeader\|CardTitle\|CardDescription\|CardFooter'` | no match | no match ✓ (D-02 — content-only primitives) |

## Lint Result

`npm run lint` — EducationSection.tsx produces zero diagnostics. All 15 errors / 28 warnings are pre-existing issues in `.next/types/validator.ts` (Next.js generated file) and `types/validator.ts` — entirely out of scope for this plan. None are caused by this change.

## Deviations from Plan

None — plan executed exactly as written.

## Commits

- `985d1ca` refactor(14-03): swap EducationSection card wrapper to shadcn Card primitive

## Self-Check: PASSED

- File exists: `src/components/EducationSection.tsx` — FOUND
- Commit exists: `985d1ca` — FOUND in `git log`
- All acceptance-criteria greps pass (see table above)
- EducationSection.tsx is clean under `npm run lint`
