---
phase: 10
slug: bio-paragraph-duration-labels
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-24
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — AGENTS.md confirms "No test suite configured" |
| **Config file** | None |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 10-01-01 | 01 | 1 | DUR-01, DUR-02 | — | Duration computed server-side only (no useEffect) | build smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 10-01-02 | 01 | 1 | DUR-02 | — | WorkExperience.tsx has no `'use client'` directive | grep | `! grep -q "'use client'" src/components/WorkExperience.tsx && echo PASS` | ✅ | ⬜ pending |
| 10-02-01 | 02 | 1 | BIO-01, BIO-02 | — | Bio renders in SSR HTML (Server Component) | build smoke | `npm run build` | ✅ | ⬜ pending |
| 10-02-02 | 02 | 1 | BIO-01 | — | Bio text present in generated HTML | grep | `grep -r "Senior backend" .next/server/app/ 2>/dev/null \| head -3` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/duration.ts` — create directory `src/lib/` and implement `computeDuration()` pure function
- [ ] Build passes green before any Wave 1 work begins

*Wave 0 is a single task: create `src/lib/` directory and the duration utility. All other files exist.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Bio animates in on scroll entry | BIO-02 | No E2E test suite; animation requires browser scroll event | `npm run dev`, open browser, scroll to Header, confirm bio fades/slides in with Header's AnimateIn wrapper |
| Duration labels display correctly in UI | DUR-01 | Visual layout check | `npm run dev`, open browser, inspect each work experience card for stacked date + duration label |
| Duration stacking right-aligned | DUR-01 | CSS layout | `npm run dev`, verify `flex flex-col items-end` produces date range top / duration label bottom |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
