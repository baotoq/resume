---
gsd_state_version: 1.0
milestone: v4.0
milestone_name: shadcn/ui Full Design System Swap
status: defining_requirements
last_updated: "2026-04-24T00:00:00.000Z"
last_activity: 2026-04-24 -- Milestone v4.0 started
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-24)

**Core value:** A recruiter or engineer can open the link, immediately understand who you are and what you've built — all without friction.
**Current focus:** Defining requirements for v4.0

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-04-24 — Milestone v4.0 started

Progress: ░░░░░░░░░░ 0/? phases complete

## Performance Metrics

- Phases complete (v4.0): 0/?
- Requirements mapped: 0/?

## Accumulated Context

### Decisions

- v2.0: Vercel native Git integration chosen over GitHub Actions + Vercel CLI — fewer moving parts
- v2.0: All static-export constraints removed atomically in Phase 7
- v2.0: Quick wins (IMG-01, SEC-01, CFG-01) bundled into Phase 7 alongside migration
- v2.0: GitHub Pages decommission isolated to Phase 8 — irreversible, verify Vercel healthy first
- v3.0: Zero new npm packages — duration utility is ~20-line vanilla TS; no date-fns, no Temporal
- v3.0: `EducationEntry` is a dedicated interface (not reusing `WorkEntry`) — different shape
- v3.0: Type + YAML atomicity rule — `src/types/resume.ts` and `src/data/resume.md` must be updated in the same commit
- v3.0: Phase 12 (Typography & Spacing Overhaul) superseded by v4.0 shadcn adoption — TYP-01–04 requirements absorbed into v4.0 scope
- v4.0: Full design system swap — all hand-rolled component styling replaced with shadcn/ui primitives

### Pending Todos

- User must populate `src/data/resume.md` with real work history
- User must add real logo URLs to resume.md

### Blockers/Concerns

- shadcn/ui Tailwind v4 compatibility needs verification — shadcn traditionally targets Tailwind v3 CSS variable approach
