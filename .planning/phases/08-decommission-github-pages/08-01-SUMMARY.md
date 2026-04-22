---
phase: "08-decommission-github-pages"
plan: "08-01"
subsystem: "core"
tags: ["bugfix", "typescript", "lint", "error-handling"]
dependency_graph:
  requires: []
  provides: ["guarded-file-read", "correct-logo-props"]
  affects: ["src/app/page.tsx", "src/components/LogoImage.tsx"]
tech_stack:
  added: []
  patterns: ["try/catch error boundary", "correct TypeScript interface extension"]
key_files:
  created: []
  modified:
    - "src/app/page.tsx"
    - "src/components/LogoImage.tsx"
decisions:
  - "WR-01: wrap readFileSync in try/catch, throw Error('Resume data unavailable') on failure — Next.js App Router catches it"
  - "WR-02: change ButtonHTMLAttributes<HTMLDivElement> to HTMLAttributes<HTMLDivElement> — div wrapper must not carry button-specific props"
metrics:
  duration: "~10 minutes"
  completed: "2026-04-22"
---

# Phase 8 Plan 1: Code Review Fixes (WR-01, WR-02) Summary

**One-liner:** Guarded readFileSync with try/catch in page.tsx and corrected LogoImage props from ButtonHTMLAttributes to HTMLAttributes<HTMLDivElement>.

## What Was Built

Two targeted fixes resolving Phase 7 code review warnings:

1. **WR-01 (page.tsx):** The bare `fs.readFileSync` call that would crash the server process on a missing file is now wrapped in a `try/catch`. On failure it logs the error and throws `Error("Resume data unavailable")`, which Next.js App Router catches and renders as a default error page instead of an unhandled crash.

2. **WR-02 (LogoImage.tsx):** `LogoImageProps` was extending `React.ButtonHTMLAttributes<HTMLDivElement>`, which is semantically wrong — it's a div wrapper, not a button. Changed to `React.HTMLAttributes<HTMLDivElement>`.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | 34e8b7a | fix(08-01): guard readFileSync in page.tsx with try/catch (WR-01) |
| Task 2 | d4c8448 | fix(08-01): correct LogoImage props interface to HTMLAttributes (WR-02) |
| Task 3 (deviation) | b15f236 | style(08-01): fix import order in LogoImage.tsx per biome organizeImports |

## Verification

- `grep "try {" src/app/page.tsx` — match on line 13
- `grep 'throw new Error("Resume data unavailable")' src/app/page.tsx` — match on line 17
- `grep "React.HTMLAttributes<HTMLDivElement>" src/components/LogoImage.tsx` — match on line 6
- `grep "ButtonHTMLAttributes" src/components/LogoImage.tsx` — no match
- `npm run lint` — no errors on src/app/page.tsx or src/components/LogoImage.tsx
- `npm run build` — exits 0, TypeScript clean, all static pages generated

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Style] Fixed pre-existing import order in LogoImage.tsx**
- **Found during:** Task 3 (lint verification)
- **Issue:** Biome `organizeImports` flagged `import { useState } from "react"` appearing before `import Image from "next/image"` in LogoImage.tsx. This was pre-existing but surfaced as a lint error on a file I modified.
- **Fix:** Reordered imports alphabetically (next/image before react).
- **Files modified:** src/components/LogoImage.tsx
- **Commit:** b15f236

## Known Stubs

None. No placeholder data or stub patterns in modified files.

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes introduced. The try/catch in page.tsx is purely defensive — it narrows an existing filesystem read, not a new one.

## Self-Check: PASSED
