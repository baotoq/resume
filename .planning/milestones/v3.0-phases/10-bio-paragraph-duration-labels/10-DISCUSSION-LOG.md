# Phase 10: Bio Paragraph + Duration Labels - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-24
**Phase:** 10-bio-paragraph-duration-labels
**Areas discussed:** Bio section placement, Duration label style, Short-tenure display

---

## Bio Section Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Extend Header card | Bio paragraph added inside existing Header card, below contact links. No new component — extend Header.tsx. | ✓ |
| Separate Bio card | New BioSection card between Header and WorkExperience, same card style. Gets its own AnimateIn delay. | |

**User's choice:** Extend Header card
**Notes:** Bio renders below the contact links inside the same Header card. No new component needed.

---

## Duration Label Style

| Option | Description | Selected |
|--------|-------------|----------|
| Inline dot separator | Same line as date range — "Jan 2020 – Present · 4 yrs 3 mos" | |
| Parenthetical | Same line, duration in parens — "Jan 2020 – Present (4 yrs 3 mos)" | |
| Stacked below | Duration on its own line below the date range, lighter style (text-xs text-zinc-400) | ✓ |

**User's choice:** Stacked below
**Notes:** Date range stays on its own line; duration label stacks below it, right-aligned, in a lighter/smaller style.

---

## Short-Tenure Display

| Option | Description | Selected |
|--------|-------------|----------|
| Skip years, just months | "8 mos" instead of "0 yrs 8 mos" | ✓ |
| Always show both | "0 yrs 8 mos" — consistent but awkward | |
| You decide | Claude picks most readable format | |

**User's choice:** Skip years, just months
**Notes:** Standard pattern — cleaner for short stints. < 1 month shows "< 1 mo".

---

## Claude's Discretion

- Exact top-margin between contact links and bio paragraph in Header
- Whether duration line uses `text-xs` or `text-sm` — pick whichever balances with the date range above

## Deferred Ideas

None.
