---
phase: 4
slug: visual-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-13
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None installed (no jest/vitest/playwright) |
| **Config file** | None |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd-verify-work`:** `npm run build` green + manual visual at 375px and 1280px
- **Max feedback latency:** ~30 seconds (build)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 1 | LOGO-03 | — | N/A | type check | `npm run build` | ✅ existing | ⬜ pending |
| 4-01-02 | 01 | 1 | LOGO-01, LOGO-02 | — | N/A | smoke (manual) | `npm run dev` + visual inspect | ❌ W0 (no test infra) | ⬜ pending |
| 4-02-01 | 02 | 2 | TIMELINE-01, TIMELINE-02, TIMELINE-03, TIMELINE-04 | — | N/A | smoke (manual) | `npm run dev` + visual inspect | ❌ W0 (no test infra) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

No test framework to install — all verification is build-time type checking + manual visual QA. No Wave 0 setup tasks required.

*Existing infrastructure (`npm run build`, `npm run lint`) covers automated gates. All visual/presentational requirements require manual verification.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Logo image renders at 40×40 next to entry with `logo_url` | LOGO-01 | No browser test framework | `npm run dev` → open localhost → confirm logo visible left of company name |
| Briefcase SVG renders when `logo_url` absent or image fails | LOGO-02 | Requires network blocking or missing URL | `npm run dev` → remove `logo_url` from fixture entry → confirm briefcase in same 40×40 slot |
| Vertical line connects all work entries on left | TIMELINE-01 | Visual CSS layout | `npm run dev` → confirm continuous line left of all work cards |
| Dot at each entry header level | TIMELINE-02 | Visual positioning | `npm run dev` → confirm dot aligned with company name row |
| Filled indigo dot for current role, hollow for past | TIMELINE-03 | Visual state | `npm run dev` → confirm first entry (no endDate) has filled indigo dot; others have hollow dot |
| Line ends at last entry, no overflow | TIMELINE-04 | Visual boundary | `npm run dev` → confirm line stops at bottom of last work card |
| No horizontal scroll at 375px | LOGO-01–LOGO-03, TIMELINE-01–04 | Responsive layout | DevTools → 375px viewport → confirm no horizontal scroll |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
