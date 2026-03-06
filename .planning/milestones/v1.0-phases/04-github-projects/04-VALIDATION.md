---
phase: 4
slug: github-projects
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-06
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — project uses lint + build + manual QA |
| **Config file** | biome.json (linting) |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run lint && npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run lint && npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | PROJ-09 | build | `npm run build` | ✅ | ⬜ pending |
| 04-01-02 | 01 | 1 | PROJ-10 | build | `npm run build` (offline) | ✅ | ⬜ pending |
| 04-01-03 | 01 | 1 | PROJ-08 | build | `npm run build` | ✅ | ⬜ pending |
| 04-02-01 | 02 | 1 | PROJ-01 | build+manual | `npm run build` | ✅ | ⬜ pending |
| 04-02-02 | 02 | 1 | PROJ-02 | manual | Manual browser check | N/A | ⬜ pending |
| 04-02-03 | 02 | 1 | PROJ-03 | manual | Manual browser check | N/A | ⬜ pending |
| 04-02-04 | 02 | 1 | PROJ-04 | manual | Manual browser check | N/A | ⬜ pending |
| 04-02-05 | 02 | 1 | PROJ-05 | manual | Manual browser check | N/A | ⬜ pending |
| 04-02-06 | 02 | 1 | PROJ-06 | manual | Manual browser check | N/A | ⬜ pending |
| 04-02-07 | 02 | 1 | PROJ-07 | manual | Manual browser check | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

No test framework to install — project convention is lint + build + manual browser check.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Repo link opens GitHub in new tab | PROJ-02 | Requires browser interaction | Click repo card, verify new tab opens to correct GitHub URL |
| Description displayed on card | PROJ-03 | Visual check | Verify description text visible on project cards |
| Language color matches GitHub | PROJ-04 | Visual comparison | Compare colored dot to GitHub repo page language indicator |
| Star count matches GitHub | PROJ-05 | Data accuracy | Compare displayed stars with GitHub repo page |
| Fork count matches GitHub | PROJ-06 | Data accuracy | Compare displayed forks with GitHub repo page |
| Last updated is reasonable | PROJ-07 | Judgment required | Verify date is recent and formatted correctly |
| Section looks good with 0, 3, 10 repos | PROJ-01 | Layout visual check | Modify data file with different counts, check layout |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
