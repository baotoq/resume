# Phase 16: Token Unification — Technical Research

**Date:** 2026-04-24
**Phase:** 16-token-unification
**Requirements:** TOKEN-01, TOKEN-02

## Scope

Pure class-string substitution across four section components. No library research, no API design, no data flow changes. All required tokens already exist in `src/app/globals.css:7-26` (Phase 13 infrastructure). The "research" here is a mapping table and an enforcement strategy, because the hard work was done by the earlier shadcn infra phase.

## Token Inventory

From `src/app/globals.css` `:root` block (verified, 2026-04-24):

| Token | oklch | Tailwind utility |
|---|---|---|
| `--background` | `0.985 0 0` | `bg-background`, `text-background` |
| `--foreground` | `0.21 0.006 286` | `bg-foreground`, `text-foreground` |
| `--card` | `1 0 0` | `bg-card`, `text-card-foreground` |
| `--muted-foreground` | `0.556 0 0` | `text-muted-foreground` |
| `--border` | `0.922 0 0` | `border-border`, `bg-border` |
| `--primary` | `0.205 0 0` | `bg-primary`, `text-primary`, `outline-primary` |
| `--popover` | `1 0 0` | `bg-popover`, `text-popover-foreground` |
| `--secondary` | `0.97 0 0` | `bg-secondary`, `text-secondary-foreground` |

`@theme inline` block at lines 28-52 wires `--color-foreground: var(--foreground)` etc., which is what lets Tailwind's JIT emit `text-foreground`-style utilities. Confirmed — no new Tailwind config changes required.

## Mapping Strategy (canonical — applied uniformly)

See `16-UI-SPEC.md` §"Design Tokens Used" for the authoritative per-class mapping table. Summary:

- **Text dark hierarchy** (zinc-900, zinc-700) → `text-foreground` (collapsed; weight/size carry residual hierarchy).
- **Text de-emphasis** (zinc-600, zinc-500, zinc-400) → `text-muted-foreground`.
- **Structural lines** (border-zinc-300, bg-zinc-300, bg-zinc-200) → `border-border` / `bg-border`.
- **Inactive timeline dot inner** (bg-white) → `bg-background`.
- **Accent** (indigo-600/700, blue-600) → `text-primary` / `bg-primary` / `hover:text-primary/80` / `outline-primary`.
- **Tooltip surface** (bg-zinc-800 text-white) → `bg-popover text-popover-foreground border border-border`.

## Key Questions Already Answered in CONTEXT.md

- **Two zinc tiers (900/700) collapsing to one token** — accepted tradeoff (CONTEXT D-01, D-02). Residual hierarchy via font-weight and font-size.
- **Indigo accent loss** — accepted as monochrome direction. One-line `globals.css` customization can restore indigo later (CONTEXT D-05, deferred).
- **Tooltip contrast inversion** — canonical shadcn popover pattern; `border border-border` is the only additive class to keep the near-white-on-near-white pill visible (UI-SPEC File 4).

No open questions.

## Risks & Landmines

| Risk | Severity | Mitigation |
|---|---|---|
| Tooltip unreadable (popover/foreground both near their page-counterpart) | Low | `border border-border` added; if browser check rejects, CONTEXT D-07 sanctions fallback to `bg-foreground text-background` |
| Monochrome resume reads sterile | Low (reversible) | Single-line `--primary` customization in `globals.css`; zero component diff |
| Partial swap (missed class) | Medium | Ripgrep gate in Phase Gate plan (Plan 05) — zero matches required |
| Biome import-order churn | Low | `npm run format` after edits is a no-op per file here (no new imports added) |
| Tailwind JIT missing a token utility | Low | `@theme inline` block in globals.css already emits all required utilities; Phase 13/14/15 PLAN runs confirm `bg-secondary`, `bg-border`, etc. work |

## Integration Points

Zero. No new imports, no new hooks, no runtime integration. Class strings are the only artifact changing. Shadcn primitives (`Card`, `Badge`, `Separator`) and `AnimateIn` are unaffected.

## Project Conventions (from AGENTS.md)

- Biome is linter/formatter (`npm run lint`, `npm run format`).
- No test suite configured — verification is build + lint + grep gate + browser.
- Next.js 16 App Router — these are all client or server components; no new directives required (no `"use client"` added or removed).

## Validation Architecture

**Not applicable for this phase.** Project has no test framework (per AGENTS.md). There are no behavioral changes to unit-test — this is a visual/structural-invariant refactor. Verification is enforced by:

1. Grep gate (hard automated block): no raw zinc/indigo/blue/white classes remain in the four files.
2. `npm run build` green.
3. `npm run lint` green.
4. Manual browser check at 375px + 1280px (user sign-off).

Nyquist VALIDATION.md is intentionally skipped — there's no test infrastructure to wire tasks into, and the grep gate serves as the automated verification pillar.

---

*Phase: 16-token-unification*
*Research: 2026-04-24*
