---
phase: 7
slug: accessibility
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-06
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | No test runner configured |
| **Config file** | None |
| **Quick run command** | `npm run lint && npm run build` |
| **Full suite command** | `npm run lint && npm run build` + manual Lighthouse audit |
| **Estimated runtime** | ~30 seconds (build) |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint && npm run build`
- **After every plan wave:** Run full build + Lighthouse accessibility audit in browser
- **Before `/gsd:verify-work`:** Full suite must be green, Lighthouse a11y >= 95
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | A11Y-01 | manual | Lighthouse a11y audit | N/A | ⬜ pending |
| 07-01-02 | 01 | 1 | A11Y-02 | manual | Tab through page | N/A | ⬜ pending |
| 07-01-03 | 01 | 1 | A11Y-03 | manual | Lighthouse / axe | N/A | ⬜ pending |
| 07-01-04 | 01 | 1 | A11Y-04 | manual | Lighthouse contrast | N/A | ⬜ pending |
| 07-01-05 | 01 | 1 | A11Y-05 | manual | Tab through page | N/A | ⬜ pending |
| 07-01-06 | 01 | 1 | A11Y-06 | manual | Keyboard activate | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework to set up — all verification is through Lighthouse and manual keyboard/screen reader testing.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Skip link visible on focus, targets #resume-content | A11Y-01 | Requires visual + DOM verification | Tab once from page load, verify skip link appears and jumps to content |
| Focus indicators visible on all interactive elements | A11Y-02 | Visual check required | Tab through all interactive elements, verify visible focus ring |
| Icon buttons announced by screen reader | A11Y-03 | Screen reader behavior | Use VoiceOver/NVDA, verify all buttons announced |
| Color contrast meets AA | A11Y-04 | Lighthouse automated but needs browser | Run Lighthouse in Chrome DevTools |
| Full keyboard navigation | A11Y-05 | Requires interactive testing | Navigate entire page with keyboard only |
| Theme toggle keyboard accessible | A11Y-06 | Interactive behavior | Tab to toggle, press Enter/Space, verify theme changes |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
