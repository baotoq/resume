---
phase: 05-tech-stack-icons
plan: "01"
subsystem: experience-cards
tags: [devicons, tech-stack, icons, server-component, cdn]
dependency_graph:
  requires: []
  provides: [TechStackIcons component, tech_stack data field, Devicons CDN stylesheet]
  affects: [WorkExperience card layout]
tech_stack:
  added: []
  patterns: [Server Component with null guard, allowlist slug map, zinc pill fallback]
key_files:
  created:
    - src/components/TechStackIcons.tsx
  modified:
    - src/types/resume.ts
    - src/app/layout.tsx
    - src/components/WorkExperience.tsx
    - src/data/resume.md
decisions:
  - Devicons loaded via CDN stylesheet link in layout.tsx head — no npm package added
  - SLUG_MAP allowlist with 30 entries controls which CSS class names are constructed (T-05-02 mitigation)
  - Unknown tech names render as zinc text pills — never injected into class attributes
  - TechStackIcons returns null for undefined/empty stack — zero layout shift on entries without tech_stack
metrics:
  duration_minutes: 35
  completed_date: "2026-04-14"
  tasks_completed: 2
  tasks_total: 2
  files_created: 1
  files_modified: 4
---

# Phase 5 Plan 01: Tech Stack Icons Summary

**One-liner:** Devicons CDN icon row on experience cards with 30-entry SLUG_MAP allowlist and zinc pill fallback for unknown techs.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add tech_stack type, CDN link, and sample data | f6d2dd7 | src/types/resume.ts, src/app/layout.tsx, src/data/resume.md |
| 2 | Create TechStackIcons component and wire into WorkExperience | 3f771af | src/components/TechStackIcons.tsx, src/components/WorkExperience.tsx |

## What Was Built

- `ExperienceEntry` in `src/types/resume.ts` gains `tech_stack?: string[]` optional field
- `src/app/layout.tsx` loads `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css` via `<link>` in `<head>` — no npm package
- `src/components/TechStackIcons.tsx` — new Server Component with 30-entry `SLUG_MAP` allowlist mapping normalized tech names to Devicon slug/variant pairs; renders colored icon row or null; unknown techs fall back to zinc pill `<span>`
- `src/components/WorkExperience.tsx` imports and renders `<TechStackIcons stack={entry.tech_stack} />` between the header block and the bullets `<ul>`
- `src/data/resume.md` has `tech_stack` arrays on all 3 experience entries, including `Microservices` as an unknown tech name to exercise the pill fallback

## Verification

- `npm run build` exits 0 — TypeScript compilation and static export succeed
- All acceptance criteria from both tasks satisfied
- Security mitigation T-05-02 implemented: slug allowlist ensures no user-authored strings are injected into CSS class names

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Missing npm dependencies prevented build**
- **Found during:** Task 2 build verification
- **Issue:** `framer-motion`, `gray-matter`, and `babel-plugin-react-compiler` were in `package.json` but not installed in `node_modules`; worktree also lacked a `node_modules` symlink
- **Fix:** Ran `npm install` in the main repo and symlinked `node_modules` into the worktree
- **Files modified:** None (package.json unchanged, node_modules not tracked)
- **Commit:** N/A (runtime environment fix)

**2. [Rule 1 - Formatting] Biome formatter required semicolons in resume.ts**
- **Found during:** Task 1 lint verification
- **Issue:** Pre-existing interface style used no semicolons; biome formatter required them for the file to pass
- **Fix:** Applied `biome format --write` to `src/types/resume.ts`; updated write to include semicolons
- **Files modified:** src/types/resume.ts
- **Commit:** f6d2dd7

## Known Stubs

None — all tech_stack data is wired through from resume.md YAML to the TechStackIcons component. Placeholder company names ("Company A", "Company B", "Company C") are pre-existing user-TODO content, not stubs introduced by this plan.

## Threat Flags

None — no new network endpoints, auth paths, or file access patterns introduced. Devicons CDN stylesheet was the planned addition (T-05-01: accepted, T-05-02: mitigated via SLUG_MAP allowlist).

## Self-Check: PASSED

- [x] `src/components/TechStackIcons.tsx` exists
- [x] `src/types/resume.ts` contains `tech_stack?: string[]`
- [x] `src/app/layout.tsx` contains CDN link
- [x] `src/components/WorkExperience.tsx` contains `TechStackIcons`
- [x] `src/data/resume.md` contains `tech_stack:` and `Microservices`
- [x] Commits f6d2dd7 and 3f771af exist on worktree-agent-a99efc0c branch
- [x] Build passes
