---
phase: 8
slug: cleanup
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-06
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | No test runner configured |
| **Config file** | None |
| **Quick run command** | `npm run lint && npm run build` |
| **Full suite command** | `npm run lint && npm run build && du -sh out/` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint && npm run build`
- **After every plan wave:** Run full suite + check build size
- **Before `/gsd:verify-work`:** Full suite must be green, build size <= 1.1M
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 1 | CLEAN-01 | automated | `ls public/*.svg 2>/dev/null; npm run build` | N/A | ⬜ pending |
| 08-01-02 | 01 | 1 | CLEAN-02,CLEAN-03 | automated | `npm run lint && npm run build` | N/A | ⬜ pending |
| 08-01-03 | 01 | 1 | CLEAN-04 | manual | Browser DevTools console check | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. Biome config fix is part of the cleanup tasks themselves.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No console errors | CLEAN-04 | Requires browser runtime | Open site in browser, check DevTools console for errors/warnings |
| All features still work | Success Criteria #4 | Visual regression | Navigate all sections, test theme toggle, PDF export, both themes |

---

## Pre/Post Metrics

| Metric | Before | After (expected) |
|--------|--------|-------------------|
| SVG files in public/ | 5 | 0 |
| Build output size | 1.1M | <= 1.1M |
| Lint status | FAILING | PASSING |
| Unused type exports | 1 | 0 |
| Dead component files | 1 | 0 |
| Stale print CSS rules | 3 | 0 |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
