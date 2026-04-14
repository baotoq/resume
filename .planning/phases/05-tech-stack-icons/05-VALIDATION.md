---
phase: 5
slug: tech-stack-icons
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-14
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no test config detected; `npm run build` (TypeScript + Next.js static export) is the primary validation gate |
| **Config file** | none — no jest/vitest/playwright config |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~15 seconds (lint ~3s, build ~12s) |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 5-01-01 | 01 | 1 | TECH-08 | — | N/A | type-check | `npm run build` | ✅ src/types/resume.ts | ⬜ pending |
| 5-01-02 | 01 | 1 | TECH-03 | — | N/A | build | `npm run build` | ✅ src/app/layout.tsx | ⬜ pending |
| 5-01-03 | 01 | 1 | TECH-01, TECH-02, TECH-04, TECH-05 | — | Slug map acts as allowlist; unknown values render as text, not HTML | build + visual | `npm run build` | ❌ W0 (new file) | ⬜ pending |
| 5-01-04 | 01 | 1 | TECH-02, TECH-04 | — | N/A | type-check + build | `npm run build` | ✅ src/components/WorkExperience.tsx | ⬜ pending |
| 5-01-05 | 01 | 1 | TECH-01, TECH-04 | — | N/A | build | `npm run build` | ✅ src/data/resume.md | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/TechStackIcons.tsx` — new file (Task 5-01-03); no stub needed — component is the deliverable itself

*Existing infrastructure (`npm run build`) covers all automated verification. No test framework installation required.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Devicon brand colors render correctly (colored class applied) | TECH-02 | Visual — CSS class presence cannot confirm color rendering | `npm run dev`, open browser, inspect experience cards with `tech_stack` field — icons should render in brand colors (React = blue, TypeScript = blue, Go = teal, etc.) |
| Unknown tech renders as zinc pill | TECH-05 | Visual — pill style cannot be confirmed by build output alone | Add `tech_stack: [React, UnknownTech]` to any resume.md entry; `npm run dev`; confirm "UnknownTech" renders as a muted zinc pill next to the React icon |
| No npm package added | TECH-03 | Cannot be enforced by build step | `cat package.json` — confirm `devicon` is NOT in `dependencies` or `devDependencies` |
| CDN stylesheet loads in browser (no 404) | TECH-03 | Network request — build doesn't validate CDN availability | Open browser DevTools → Network → filter by `devicon.min.css` — confirm 200 response |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
