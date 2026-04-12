---
phase: 2
slug: layout-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-13
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler (`tsc --noEmit`) + Next.js build (`next build`) |
| **Config file** | `tsconfig.json` / `next.config.ts` |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~15 seconds |

Note: Phase 2 has no unit-testable logic — it is a presentation layer (animation wrapper + responsive CSS). Validation is via TypeScript compilation + build success + manual visual check.

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd-verify-work`:** Full build must be green + manual viewport check
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | LAYOUT-02 | — | N/A | build | `npm run build` | ✅ after task | ⬜ pending |
| 02-01-02 | 01 | 1 | LAYOUT-02 | — | N/A | build | `npm run build` | ✅ after task | ⬜ pending |
| 02-01-03 | 01 | 1 | LAYOUT-01, LAYOUT-02 | — | N/A | build + manual | `npm run build` | ✅ after task | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test framework or stubs needed — build + TypeScript check is sufficient for a presentation-only phase.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No horizontal scroll on mobile | LAYOUT-01 | Visual browser check — no automated DOM scroll width assertion | Open `localhost:3000` in Chrome DevTools → set viewport 375×812 → confirm no horizontal scrollbar, no clipped text |
| Well-proportioned desktop layout | LAYOUT-01 | Visual check | Set viewport to 1280×800 → confirm layout looks proportional, no broken sections |
| Sections fade+slide on scroll entry | LAYOUT-02 | Animation is visual — not assertable with build tools | Load page → scroll down slowly → confirm Header, WorkExperience, Skills each fade in (opacity 0→1, y 16→0) |
| Sections stay visible after scrolling back | LAYOUT-02 | Visual check for `once: true` | After sections animate in, scroll back to top → confirm sections remain visible |
| Stagger timing 0.1s between sections | LAYOUT-02 | Visual check | Observe that WorkExperience starts 0.1s after Header, Skills starts 0.1s after WorkExperience |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
