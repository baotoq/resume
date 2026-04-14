---
gsd_state_version: 1.0
milestone: v1.2
milestone_name: Tech Stack Icons + Keyword Highlights
status: complete
last_updated: "2026-04-14T00:00:00.000Z"
last_activity: 2026-04-14
progress:
  total_phases: 2
  completed_phases: 2
  total_plans: 2
  completed_plans: 2
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-14)

**Core value:** A recruiter or engineer can open the link, immediately understand who you are and what you've built — all without friction.
**Current focus:** v1.2 shipped — ready for `/gsd-new-milestone` or real content population

## Current Position

Milestone: v1.2 — SHIPPED 2026-04-14
Status: All phases complete, milestone archived
Last activity: 2026-04-14 — v1.2 milestone archived

Progress: [██████████] 100%

## Accumulated Context

### Decisions

- Company logos sourced from manual `logo_url` field in resume.md (not Clearbit API — no external dep)
- Generic briefcase icon fallback when no logo_url provided or image fails to load
- Vertical timeline: left-side line + dot per job entry; current role = filled indigo dot, past roles = hollow dot
- Use plain `<img>` tag (not next/image) — next/image with external URLs silently 404s on GitHub Pages static export
- `LogoImage.tsx` gets `'use client'` for onError + useState; WorkExperience.tsx stays a Server Component
- Inline SVG for briefcase fallback — avoids basePath routing issues and icon library bundle cost
- Tech stack icons: Devicons via CDN (no npm install), rendered below role/date header above bullets
- SLUG_MAP allowlist (30 entries) prevents user-authored strings from being injected into CSS class names
- Keyword highlighting: **bold** markdown in resume.md bullets → rendered as indigo-600 accent color spans
- span-only output in HighlightedBullet (no strong/em/b/i) — decorative, not semantic

### Pending Todos

- User must populate `src/data/resume.md` with real work history
- User must enable GitHub Pages in repo Settings → Pages → Source: GitHub Actions

### Blockers/Concerns

None.
