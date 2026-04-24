---
phase: 15
slug: badge-and-separator
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-24
---

# Phase 15 — Validation Strategy

> Grep-based acceptance criteria + build/lint gate + manual visual verification. Matches Phase 14 precedent — this project has no automated visual regression suite.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Biome (lint) + Next.js build |
| **Config file** | `biome.json` (lint), `next.config.ts` (build) |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run lint && npm run build` |
| **Estimated runtime** | ~25 seconds (lint ~2s, build ~23s) |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint` on touched files (grep acceptance already runs per-task)
- **After every plan wave:** Run full suite — `npm run lint && npm run build`
- **Before `/gsd-verify-work`:** Full suite green + manual browser check at 375px/1280px
- **Max feedback latency:** 25 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 15-01-01 | 01 | 1 | BADGE-01 | T-15-01 | Badge variant=secondary pill replaces hand-rolled zinc span in fallback branch only | unit (grep) | `grep -c 'bg-zinc-100 text-zinc-600 rounded-full' src/components/techstack-icons/TechStackIcons.tsx` → 0; `grep -c '<Badge variant="secondary">' src/components/techstack-icons/TechStackIcons.tsx` → ≥ 1; `npm run lint` → 0 | ✅ | ⬜ pending |
| 15-02-01 | 02 | 1 | SEP-01 | T-15-02 | Two `<Separator />` elements present in page.tsx, wrapped in AnimateIn with matching delays | unit (grep) | `grep -c '<Separator />' src/app/page.tsx` → 2; `grep -c 'from "@/components/ui/separator"' src/app/page.tsx` → 1; `npm run lint` → 0 | ✅ | ⬜ pending |
| 15-03-01 | 03 | 2 | BADGE-01, SEP-01 | — | Build + lint green, Header.tsx unchanged | integration | `npm run build && npm run lint && git diff --name-only HEAD~3 HEAD \| grep -c 'components/Header.tsx'` → 0 | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*None — Biome and Next.js build infrastructure already configured. No test framework installation needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Fallback Badge renders with readable contrast on white resume card | BADGE-01 | No automated visual regression suite | `npm run dev` → browse to `/` → inspect any tech pill not in TECH_ICON_MAP (e.g., add test string) at 375px and 1280px; confirm secondary-token pill reads clearly on white Card bg |
| Two horizontal Separator lines visible between Header/Work and Work/Education sections | SEP-01 | No automated visual regression suite | `npm run dev` → browse to `/` → scroll through resume, confirm two distinct horizontal 1px lines (zinc-border token) between the three Card sections at both 375px and 1280px |
| Header inline `·` dots remain as text (not replaced by Separator) | SC#4 | Visual + semantic check | Inspect Header contact row — dots flow inline with text links, line-breaks do not orphan separators |
| No animation jank (Separator fades in with following card) | D-05 | Animation timing is subjective | Refresh page, confirm each Separator appears as part of the stagger, not solo before empty card space |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify — grep + npm commands
- [x] Sampling continuity: 3 tasks, each has automated verify (no gaps)
- [x] Wave 0 not needed (existing infrastructure)
- [x] No watch-mode flags
- [x] Feedback latency < 25s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-24
