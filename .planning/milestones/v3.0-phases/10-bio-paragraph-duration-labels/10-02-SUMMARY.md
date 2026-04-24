---
phase: 10-bio-paragraph-duration-labels
plan: "02"
subsystem: WorkExperience
status: complete
tags:
  - duration-labels
  - server-component
  - tailwind
dependency_graph:
  requires:
    - "10-01"
  provides:
    - duration-label-ui
  affects:
    - src/components/WorkExperience.tsx
tech_stack:
  added: []
  patterns:
    - stacked-flex-column
    - server-component-static-render
key_files:
  modified:
    - src/components/WorkExperience.tsx
decisions:
  - "const now = new Date() placed at component scope (not inside map) — one call per render, satisfies DUR-02"
  - "items-end preserves right-aligned layout in sm:justify-between row — not items-start"
metrics:
  duration: "~5 min"
  completed_date: "2026-04-24"
  tasks_completed: 2
  tasks_total: 2
---

# Phase 10 Plan 02: Duration Labels in WorkExperience Summary

## One-liner

Stacked date+duration label in each WorkExperience card using computeDuration from Plan 01, rendered as a Server Component with no client JS.

## What Was Built

WorkExperience.tsx was modified to display a stacked date range and duration label on every work experience card:

- Added `import { computeDuration } from "@/lib/duration"` at top of file
- Added `const now = new Date()` at component render scope (before the map, satisfies DUR-02)
- Replaced bare `<span>` date range with `<div className="flex flex-col items-end">` wrapping both date range and duration label
- Duration label uses `text-xs text-zinc-400` (12px, lighter zinc-400 = #a1a1aa)
- Date range retains `text-sm font-bold text-zinc-500` — unchanged
- No `'use client'` directive added — component remains a pure Server Component

## Task Status

| Task | Name | Status | Commit |
|------|------|--------|--------|
| 1 | Wire computeDuration into WorkExperience.tsx | Complete | 02a68c9 |
| 2 | Visual verification checkpoint | Complete — human approved | — |

## Deviations from Plan

None — plan executed exactly as written. Task 1 changes were already present in commit `02a68c9` (combined 10-02/10-03 commit from prior execution wave).

## Acceptance Criteria Verification

- Import present: PASS — `import { computeDuration } from "@/lib/duration"`
- `const now = new Date()` at component scope: PASS
- `flex flex-col items-end` wrapper: PASS
- `text-xs text-zinc-400` duration span: PASS
- `computeDuration(entry.startDate, entry.endDate, now)` call: PASS
- No `'use client'` directive: PASS
- `npm run build` exits 0: PASS
- Duration strings in .next/server/app/ HTML: PASS (grep confirmed "yrs"/"mos" in output HTML)
- `npm run lint`: Pre-existing errors in `types/validator.ts` (from project init commits) — not introduced by this plan; WorkExperience.tsx is lint-clean

## Known Stubs

None — computeDuration is fully wired with real startDate/endDate values from resume.md data.

## Threat Surface

No new threat surface — analysis matches plan's threat_model. All inputs are developer-controlled YAML. computeDuration output is a React text child (auto-escaped).

## Self-Check: PASSED

- src/components/WorkExperience.tsx: FOUND
- Commit 02a68c9: FOUND in git log
- Duration strings in build output: FOUND
