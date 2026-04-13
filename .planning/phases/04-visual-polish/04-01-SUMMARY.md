---
phase: 04-visual-polish
plan: 01
subsystem: work-experience
tags: [logo, timeline, client-component, tailwind]
dependency_graph:
  requires: []
  provides: [LogoImage component, timeline rail, logo_url type field]
  affects: [src/components/WorkExperience.tsx, src/types/resume.ts, src/components/LogoImage.tsx, src/data/resume.md]
tech_stack:
  added: []
  patterns: [use-client-for-interactivity, server-component-composition, inline-svg-fallback, plain-img-over-next-image]
key_files:
  created:
    - src/components/LogoImage.tsx
  modified:
    - src/types/resume.ts
    - src/components/WorkExperience.tsx
    - src/data/resume.md
decisions:
  - Plain img tag used instead of next/image — next/image external URLs silently 404 on GitHub Pages static export
  - Inline SVG briefcase fallback — avoids basePath routing issues and icon library bundle cost
  - Per-entry line segments with !isLast guard — line stops exactly at last entry, no empty space
  - LogoImage gets use client for onError + useState; WorkExperience stays Server Component
metrics:
  duration: ~5 minutes
  completed: "2026-04-13T14:49:18Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 1
  files_modified: 3
---

# Phase 04 Plan 01: Company Logos and Timeline Rail Summary

**One-liner:** Company logos with inline-SVG briefcase fallback and vertical timeline rail (filled indigo dot for current role, hollow dot for past) wired into WorkExperience cards.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add logo_url type and create LogoImage client component | b3af8da | src/types/resume.ts, src/components/LogoImage.tsx |
| 2 | Add timeline rail to WorkExperience and wire LogoImage into card header | e25cb8e | src/components/WorkExperience.tsx, src/data/resume.md |

## What Was Built

### ExperienceEntry type extension (src/types/resume.ts)
Added `logo_url?: string` optional field to `ExperienceEntry`. No other fields changed.

### LogoImage client component (src/components/LogoImage.tsx)
- `'use client'` directive with `useState` for error tracking
- Props: `{ src: string | undefined; alt: string }`
- Guard: renders briefcase SVG fallback when `!src || hasError`
- Fallback: 40x40 zinc-100 rounded container with inline briefcase SVG (aria-label, text-zinc-400)
- Image: plain `<img>` with `onError` handler — no `next/image` (static export incompatibility)
- No `useMemo` or `useCallback` (React Compiler handles memoization)

### WorkExperience restructured with timeline rail (src/components/WorkExperience.tsx)
- Stays a Server Component (no `'use client'`)
- `relative pl-5 sm:pl-7` rail wrapper — 20px mobile, 28px desktop left padding
- Per-entry `<div className="relative">` with:
  - Vertical line segment (`w-0.5 bg-zinc-200`) only when `!isLast` — stops at last entry
  - Timeline dot: filled `bg-indigo-600` for current role (`endDate === null`), hollow `border-2 border-zinc-300 bg-white` for past
  - Both line and dot have `aria-hidden="true"`
- Card header restructured: `flex items-start gap-3` with LogoImage left of company/role/date

### Smoke-test data (src/data/resume.md)
- Added `logo_url` to first entry (Company A) pointing to Google logo on Wikimedia Commons CDN
- Second and third entries have no `logo_url` — display briefcase fallback to verify LOGO-02

## Requirements Addressed

| Requirement | Description | Status |
|-------------|-------------|--------|
| LOGO-01 | Each work entry displays company logo when logo_url set | Done |
| LOGO-02 | Briefcase icon fallback when logo_url absent or image fails | Done |
| LOGO-03 | ExperienceEntry type has logo_url optional field | Done |
| TIMELINE-01 | Continuous vertical line down left side of all entries | Done |
| TIMELINE-02 | Each entry has a dot on the timeline line | Done |
| TIMELINE-03 | Current role (no endDate) has filled indigo dot; past roles hollow | Done |
| TIMELINE-04 | Vertical line ends at last entry, does not extend into empty space | Done |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

- `src/data/resume.md` still contains placeholder company names (Company A, B, C) and example bullet content. User must populate with real work history before sharing. This is expected and documented in PROJECT.md — not a stub introduced by this plan.

## Threat Surface Scan

All threat surface covered by the plan's threat model:
- T-04-01: `logo_url` is author-controlled in checked-in resume.md, not runtime user input
- T-04-02: External logo URL fetch — standard browser behavior, no credentials sent
- T-04-03: Large/slow logo — author controls URLs, static export, no server DoS risk

No new unplanned threat surface introduced.

## Self-Check: PASSED
