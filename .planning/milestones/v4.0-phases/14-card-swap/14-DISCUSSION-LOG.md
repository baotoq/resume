# Phase 14: Card Swap - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-24
**Phase:** 14-card-swap
**Mode:** `--auto` (Claude auto-selected recommended options)
**Areas discussed:** Semantic preservation, Sub-primitive scope, Padding parity, Color tokens, Border radius, Timeline dot, Scope lock, Verification

---

## Semantic Preservation

| Option | Description | Selected |
|--------|-------------|----------|
| Wrap Card in existing `<section>`/`<article>` | Card renders div; outer tag keeps landmark semantics | ✓ |
| Replace wrapper with Card only | Lose `<section>`/`<article>` semantics for pure shadcn | |
| Add `asChild` pattern | Card has no asChild; would require primitive fork | |

**User's choice:** [auto] Wrap Card in existing semantic tag
**Notes:** Preserves a11y/SEO. Outer tag carries no visual classes.

---

## Sub-primitive Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Card + CardContent only | Minimal change, keep existing headings | ✓ |
| Card + CardHeader + CardTitle + CardContent | Full shadcn idiom, but CardTitle is `<div>` | |

**User's choice:** [auto] Card + CardContent only
**Notes:** Preserves `<h1>`/`<h2>`/`<h3>` semantics and typography.

---

## Padding Parity

| Option | Description | Selected |
|--------|-------------|----------|
| Use Card defaults (py-6 + CardContent px-6 = p-6) | Matches hand-rolled p-6 exactly | ✓ |
| Override to p-0 and add p-6 inside | Redundant, breaks primitive contract | |

**User's choice:** [auto] Defaults
**Notes:** Mathematical match.

---

## Color Token Parity

| Option | Description | Selected |
|--------|-------------|----------|
| Trust shadcn tokens (`bg-card`, `border`) | Single color system from Phase 13 | ✓ |
| Override with `bg-white border-zinc-200` | Defeats token swap | |

**User's choice:** [auto] Trust tokens
**Notes:** `--card: oklch(1 0 0)` = pure white. `--border` ≈ zinc-200 visually.

---

## Border Radius Delta

| Option | Description | Selected |
|--------|-------------|----------|
| Accept 14px (theme `--radius-xl`) | Phase 13 already shipped this token | ✓ |
| Override to `rounded-[12px]` | Reverts to Tailwind default, fights theme | |

**User's choice:** [auto] Accept 14px
**Notes:** Phase 13 D-11 gate passed with this radius. Consistent site-wide.

---

## Timeline Dot (WorkExperience)

| Option | Description | Selected |
|--------|-------------|----------|
| Leave dot outside Card (sibling of `<article>`) | Zero change to dot markup | ✓ |
| Move dot inside Card | Risks z-index and absolute positioning regression | |

**User's choice:** [auto] Leave outside
**Notes:** Touch only the card wrapper line.

---

## Scope Lock

**User's choice:** [auto] Three files only: Header, WorkExperience, EducationSection.

---

## Verification Method

**User's choice:** [auto] Manual browser check at 375px + 1280px + `npm run build` + `npm run lint`.

---

## Claude's Discretion

- className passthrough on Card if a specific override needed during implementation.
- Whether to collapse inner `flex flex-col gap-4` wrapper in WorkExperience entry given Card is already flex-col gap-6.

## Deferred Ideas

- CardHeader + CardTitle idiomatic usage (semantic rework required).
- Dark mode variants.
- Hover/focus card states.
