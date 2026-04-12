---
phase: 1
slug: content
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-13
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` (or `package.json` scripts) |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 0 | CONT-01 | — | N/A | build | `npm run build` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | CONT-01 | — | N/A | build | `npm run build` | ❌ W0 | ⬜ pending |
| 1-01-03 | 01 | 2 | CONT-02 | — | N/A | build | `npm run build` | ❌ W0 | ⬜ pending |
| 1-01-04 | 01 | 2 | CONT-03 | — | N/A | build | `npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `gray-matter` installed — required for data parsing before any component work

*All other infrastructure (Next.js 16, React 19, Tailwind v4, TypeScript) already installed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Header renders name, title, email, GitHub, LinkedIn | CONT-01 | Visual layout check | Load dev server, inspect header section |
| Work experience shows reverse-chronological order | CONT-02 | Content ordering verification | Load dev server, verify entries newest-first |
| Skills grouped into labeled categories | CONT-03 | Visual grouping check | Load dev server, verify category labels visible |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
