---
phase: 14
slug: card-swap
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-24
---

# Phase 14 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — no test suite in this project |
| **Config file** | none |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~30s |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd-verify-work`:** Full build + lint must be green + manual browser visual check at 375px and 1280px
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 14-01-01 | 01 | 1 | CARD-01 | — | N/A (visual-only swap) | grep | `! grep -E 'rounded-xl border border-zinc-200 bg-white (px-6 py-6\|p-6) shadow-sm' src/components/Header.tsx` | ✅ src exists | ⬜ pending |
| 14-01-02 | 01 | 1 | CARD-01 | — | N/A | grep | `grep -E '<Card>\|<CardContent>' src/components/Header.tsx` | ✅ | ⬜ pending |
| 14-02-01 | 02 | 1 | CARD-02 | — | N/A | grep | `! grep 'rounded-xl border border-zinc-200 bg-white p-6 shadow-sm' src/components/WorkExperience.tsx` | ✅ | ⬜ pending |
| 14-02-02 | 02 | 1 | CARD-02 | — | N/A | grep | `grep -E '<Card>\|<CardContent>' src/components/WorkExperience.tsx` | ✅ | ⬜ pending |
| 14-03-01 | 03 | 1 | CARD-03 | — | N/A | grep | `! grep 'rounded-xl border border-zinc-200 bg-white p-6 shadow-sm' src/components/EducationSection.tsx` | ✅ | ⬜ pending |
| 14-03-02 | 03 | 1 | CARD-03 | — | N/A | grep | `grep -E '<Card>\|<CardContent>' src/components/EducationSection.tsx` | ✅ | ⬜ pending |
| 14-04-01 | 04 | 2 | all | — | N/A | build | `npm run build` exits 0 | ✅ | ⬜ pending |
| 14-04-02 | 04 | 2 | all | — | N/A | lint | `npm run lint` exits 0 | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements — no Wave 0 setup needed. `npm run build` and `npm run lint` already configured.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual parity at 375px mobile | CARD-01/02/03 SC4 | No visual regression suite in project | `npm run dev` → Chrome DevTools mobile emulation 375px → inspect Header, WorkExperience entries, EducationSection entries → confirm no layout shift, no content clipping, 14px radius accepted (per D-05) |
| Visual parity at 1280px desktop | CARD-01/02/03 SC4 | No visual regression suite | Same as above at 1280px viewport |
| Geist font preserved | — | Infrastructure sanity | Inspect computed styles on any card heading → `font-family` includes `__Geist` |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies (grep + build + lint)
- [x] Sampling continuity: every task has automated verify
- [x] Wave 0 covers all MISSING references (none needed)
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter (pending execution)

**Approval:** pending
