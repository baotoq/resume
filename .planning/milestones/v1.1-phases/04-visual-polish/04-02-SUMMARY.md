---
plan: 04-02
phase: 04-visual-polish
status: complete
---

# Summary: Visual QA — Logos, Timeline Dots, and Timeline Line

## What was verified

Human visual QA at 1280px viewport confirmed all 7 requirements pass.

During verification, two issues were found and fixed:
1. **Timeline line missing on last entry** — per-entry `!isLast` segments replaced with a single continuous absolute line in the rail container (`left-[3px] sm:left-[7px] top-[28px] bottom-0`)
2. **Line not centered on dot** — fixed horizontal offset to align line center (4px/8px from rail left) with dot center

Fix committed: `5b2d021`

## Requirements verified

| Req | Result |
|-----|--------|
| LOGO-01 | Logo image visible next to Company A at 1280px ✓ |
| LOGO-02 | Briefcase icon for Company B and C, no layout shift ✓ |
| LOGO-03 | Logo/fallback consistent in size and alignment ✓ |
| TIMELINE-01 | Continuous vertical line connects all 3 entries ✓ |
| TIMELINE-02 | Dot on each entry aligned with card header ✓ |
| TIMELINE-03 | Filled indigo dot on Company A, hollow on B and C ✓ |
| TIMELINE-04 | Line ends at Company C, no extra line below ✓ |
| Mobile | No horizontal scroll at 375px ✓ |

## Self-Check: PASSED
