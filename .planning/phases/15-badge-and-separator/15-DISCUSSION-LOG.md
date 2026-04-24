# Phase 15: Badge and Separator - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-24
**Phase:** 15-badge-and-separator
**Mode:** --auto (all gray areas auto-resolved with recommended defaults)
**Areas discussed:** Badge swap, Separator placement, Separator animation coupling, Separator styling, Scope locks

---

## Badge Swap (BADGE-01)

| Option | Description | Selected |
|--------|-------------|----------|
| `<Badge variant="secondary">` | Token-driven neutral pill, matches SC#1 | ✓ |
| `<Badge variant="outline">` | Border-only neutral, less chromatic weight | |
| Keep hand-rolled span | Rejected — violates SC#1 | |

**Auto choice:** secondary — locked by SC#1.
**Notes:** Fallback branch only. Icon rows (TECH_ICON_MAP hits) untouched per SC#2.

---

## Separator Placement

| Option | Description | Selected |
|--------|-------------|----------|
| 2 separators between 3 sections | Between Header/Work and Work/Edu | ✓ |
| 3 separators (incl. top or bottom) | Visually heavier, redundant with card borders | |
| 1 separator (single divider) | Under-delimits — fails "between sections" spirit | |

**Auto choice:** 2 separators.

---

## Separator Animation Coupling

| Option | Description | Selected |
|--------|-------------|----------|
| Wrap each Separator in AnimateIn, delay matches following card | No orphan line before card enters | ✓ |
| Bare Separator sibling, no AnimateIn | Simpler but visible at t=0 while card below still hidden | |
| Single AnimateIn wraps separator + card together | Couples timing, harder to tune | |

**Auto choice:** Wrap with matching delay (0.1 before Work, 0.2 before Edu).

---

## Separator Styling

| Option | Description | Selected |
|--------|-------------|----------|
| shadcn defaults (`h-px w-full bg-border`) | Token-driven, parent gap-8 spacing | ✓ |
| Add `my-4` margin override | Redundant given parent gap-8 | |
| Thicker (`h-[2px]`) or colored | Breaks Card border parity | |

**Auto choice:** Defaults.

---

## Header Inline Dots (SC#4 Lock)

| Option | Description | Selected |
|--------|-------------|----------|
| Keep `·` text spans | Inline flex row requires text separators | ✓ |
| Replace with Separator orientation="vertical" | Would break flex-wrap row flow — rejected by SC#4 | |

**Auto choice:** Keep.

---

## Claude's Discretion

- Exact structure for separator animation wrapper (separate AnimateIn vs baked into next card's AnimateIn)
- Whether fallback Badge needs tooltip parity with icon rows (deferred)

## Deferred Ideas

- Fallback Badge hover tooltip
- Vertical Separator in Header contact row (permanently deferred by SC#4)
- Dark mode token tuning
