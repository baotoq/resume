# Phase 13: shadcn Infrastructure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-24
**Phase:** 13-shadcn-infrastructure
**Areas discussed:** Font, Color merge approach, shadcn style preset

---

## Font — Geist or Inter?

| Option | Description | Selected |
|--------|-------------|----------|
| Keep Geist | No change — Geist already wired via next/font. Phase 13 preserves existing font vars. | ✓ |
| Switch to Inter now | Install Inter via next/font/google in Phase 13 alongside shadcn init. Resolves original TYP-04 goal early. | |

**User's choice:** Keep Geist
**Notes:** TYP-04 (Inter) was superseded by v4.0. Geist stays; font vars preserved during globals.css merge.

---

## Color Merge Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Replace hex with oklch | Standard shadcn approach — replace #fafafa/#18181b with oklch equivalents. Single clean color system. | ✓ |
| Keep hex, add oklch alongside | Keep existing hex vars, add shadcn oklch vars on top. Defers color migration to Phase 16. Risk: mixed systems. | |

**User's choice:** Replace hex with oklch
**Notes:** Single color system from Phase 13 onward. Phase 16 token unification works cleanly on top.

---

## shadcn Style Preset

| Option | Description | Selected |
|--------|-------------|----------|
| default | Neutral, most widely used. Clean and professional for a resume. | ✓ |
| new-york | Slightly tighter border-radius, more compact. More opinionated. | |

**User's choice:** default
**Notes:** Safe, neutral choice appropriate for a professional resume.

---

## Claude's Discretion

- Exact oklch values for --background/--foreground — match zinc-50/zinc-900 visually as close as possible
- `@import "shadcn/tailwind.css"` exact path — verify against installed package at execution time

## Deferred Ideas

- Inter font switch — deferred to Phase 16 or dropped (Geist kept)
- Dark mode — out of scope for v4.0
