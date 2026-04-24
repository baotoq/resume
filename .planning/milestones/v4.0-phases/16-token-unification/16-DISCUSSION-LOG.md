# Phase 16: Token Unification - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-24
**Phase:** 16-token-unification
**Mode:** `--auto` (Claude auto-selected recommended defaults for all gray areas)
**Areas discussed:** Zinc hierarchy mapping, Indigo accent strategy, Blue timeline dot, Tooltip recolor, bg-white handling, Verification method

---

## Zinc Hierarchy Mapping

| Option | Description | Selected |
|--------|-------------|----------|
| Collapse 900/700 → foreground; 600/500/400 → muted-foreground; 300/200 → border | Matches available `:root` tokens 1:1, no new tokens | ✓ |
| Keep 900 → foreground, add new `--text-secondary` token for 700 | Preserves 2-tier dark hierarchy but requires token additions | |
| Use opacity variants (foreground/90, foreground/70) | Finer granularity without new tokens | |

**Claude's choice (recommended):** Collapse. Weight/size already carry hierarchy; single-token per role is shadcn-idiomatic.
**Notes:** Claude's discretion left open to introduce `text-foreground/90` if visual check shows flatness.

---

## Indigo Accent Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| `text-primary` (current `--primary` is near-black → monochrome) | Eliminates raw indigo, inherits shadcn mono default | ✓ |
| Add custom `--accent-indigo` token and new utility | Preserves indigo accent, adds 1 token | |
| Keep `text-indigo-600` as "accent exception" | Violates SC#1 literal reading | |

**Claude's choice (recommended):** `text-primary`. SC#1 explicit. Monochrome reversal is one-line `globals.css` tweak if rejected visually.
**Notes:** Flagged in Deferred Ideas — user may want indigo back.

---

## Blue Timeline Dot (`bg-blue-600`)

| Option | Description | Selected |
|--------|-------------|----------|
| `bg-primary` | Consistent with D-05 monochrome direction | ✓ |
| `bg-foreground` | Near-identical oklch, more semantic as "ink" | |
| Keep blue as scoped exception | Violates SC#1 | |

**Claude's choice:** `bg-primary`. Same token used for accent links preserves "active/current" semantic across the app.

---

## Tooltip Recolor (`bg-zinc-800 text-white`)

| Option | Description | Selected |
|--------|-------------|----------|
| `bg-popover text-popover-foreground border border-border` | Canonical shadcn pattern for floating surfaces | ✓ |
| `bg-foreground text-background` | Inverted dark pill — visually closest to current | |
| `bg-card text-card-foreground border` | Similar to popover but less semantic | |

**Claude's choice:** popover tokens. Semantic fit beats visual fidelity. `text-white` is flagged as a raw color per SC#1 spirit even though it's not a zinc class.
**Notes:** Fallback to `bg-foreground text-background` allowed if contrast fails in browser check.

---

## `bg-white` on Inactive Timeline Dot

| Option | Description | Selected |
|--------|-------------|----------|
| `bg-background` | Theme-aware, near-identical oklch | ✓ |
| `bg-card` | `--card` is pure white (oklch 1 0 0), matches original exactly | |
| Remove fill, rely on border only | Visual change (hollow dot) | |

**Claude's choice:** `bg-background`. SC#2 says "replaced with `bg-card` or `bg-background`" — either acceptable; `bg-background` is what the main page actually sits on so the dot visually "blends" correctly.

---

## Verification Method

| Option | Description | Selected |
|--------|-------------|----------|
| build + lint + ripgrep gate + manual browser check | Automated + visual sign-off | ✓ |
| build + lint only | Fast but won't catch missed classes | |
| Add Biome custom rule blocking raw color classes | Over-engineered for 4 files | |

**Claude's choice:** Multi-layer. Ripgrep gate is the hard enforcement; browser check catches visual regressions.

---

## Claude's Discretion

- Mid-tier foreground opacity if single `text-foreground` reads flat.
- Tooltip fallback to inverted-contrast pattern.
- Edit order across the 4 files.

## Deferred Ideas

- Dark mode wiring (no `.dark` block in globals.css).
- Re-introduce indigo accent via `--primary` token customization.
- `bg-zinc-50` on `page.tsx` — not in scope for Phase 16.
- Shadow tokens for future Card elevations.
