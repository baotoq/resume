---
gsd_state_version: 1.0
milestone: v4.0
milestone_name: shadcn/ui Full Design System Swap — Phases 13-16
status: planning
last_updated: "2026-04-24T08:50:58.360Z"
last_activity: 2026-04-24 — v4.0 roadmap created (Phases 13-16)
progress:
  total_phases: 8
  completed_phases: 3
  total_plans: 5
  completed_plans: 5
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-24)

**Core value:** A recruiter or engineer can open the link, immediately understand who you are and what you've built — all without friction.
**Current focus:** Phase 13 — shadcn Infrastructure

## Current Position

Phase: 13 (shadcn Infrastructure) — ready to execute
Plan: 2 plans (wave 1 + wave 2)
Status: Planned — ready to execute
Last activity: 2026-04-24 — Phase 13 planned (2 plans, verified)

Progress: ░░░░░░░░░░ 0/4 phases complete (v4.0)

## Performance Metrics

- Phases complete (v4.0): 0/4
- Requirements mapped: 9/9 (100%)

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
- v4.0: globals.css merge must be done manually — `npx shadcn@latest init` destructively overwrites the file; Geist font vars and `@theme inline` block must be preserved
- v4.0: All token hex values converted to oklch during merge — no mixed hex/oklch token system
- v4.0: Badge applies only to unknown-tech fallback pill in TechStackIcons — NOT to SVG icon entries
- v4.0: Separator must NOT replace inline `·` contact-row dots in Header — Separator is a block element, would break flex layout
- v4.0: Card and Badge are Server Component safe (no "use client"); Separator has "use client" but is a safe leaf node import
- v4.0: Plain `npm install` — no `--legacy-peer-deps` needed; all packages declare React 19 peer deps at current versions

### Pending Todos

- User must populate `src/data/resume.md` with real work history
- User must add real logo URLs to resume.md

### Blockers/Concerns

- (none — shadcn/ui Tailwind v4 compatibility confirmed HIGH confidence per research)
