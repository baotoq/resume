---
phase: 13
slug: shadcn-infrastructure
status: draft
shadcn_initialized: false
preset: none
created: 2026-04-24
---

# Phase 13 — UI Design Contract

> Visual and interaction contract for Phase 13: shadcn Infrastructure.
> This is a **zero-visual-change infrastructure phase**. The contract documents what must not change,
> the CSS variable surface being introduced, and constraints for downstream phases 14–16.

---

## Purpose of This Spec

Phase 13 installs shadcn/ui infrastructure — packages, `components.json`, `src/lib/utils.ts`, three
component source files, and a merged `globals.css`. No user-facing elements change. This spec defines:

1. **Preservation contracts** — what must be visually identical before and after Phase 13
2. **Token surface introduced** — the CSS variables phases 14–16 will consume
3. **Downstream mapping table** — how hand-rolled classes map to shadcn tokens
4. **Infrastructure constraints** — non-visual contracts the executor must satisfy

---

## Design System

| Property | Value | Source |
|----------|-------|--------|
| Tool | shadcn (CLI only in this phase — no components rendered yet) | CONTEXT.md D-03 |
| Style preset | `"default"` | CONTEXT.md D-03 |
| Component library | radix-ui (Separator only; Card and Badge are vanilla) | ARCHITECTURE.md |
| Icon library | lucide-react (installed but unused in Phase 13) | CONTEXT.md D-04 |
| Font | Geist Sans + Geist Mono (preserved, unchanged) | CONTEXT.md D-01 |

**Note:** `components.json` style is `"default"`. ARCHITECTURE.md mentions `"base-nova"` in one code
example — that is a stale suggestion. CONTEXT.md D-03 is authoritative: use `"default"`.

---

## Preservation Contract (Phase 13 Gate)

The following must be visually and structurally identical before and after Phase 13 completes.
Any deviation from this contract means Phase 13 is incomplete.

### Visual Preservation

| Element | Current State | Must Remain |
|---------|---------------|-------------|
| Page background | `#fafafa` (zinc-50) | oklch equivalent `oklch(0.985 0 0)` — matches exactly |
| Page foreground text | `#18181b` (zinc-900) | `oklch(0.210 0.006 286)` — see Color section for rationale |
| Body font | Geist Sans via `var(--font-geist-sans)` | Unchanged — `--font-sans: var(--font-geist-sans)` preserved in `@theme inline` |
| Mono font | Geist Mono via `var(--font-geist-mono)` | Unchanged — `--font-mono: var(--font-geist-mono)` preserved in `@theme inline` |
| Header card | `rounded-xl border border-zinc-200 bg-white p-6 shadow-sm` | No DOM change in Phase 13 — card swap is Phase 14 |
| WorkExperience article cards | `rounded-xl border border-zinc-200 bg-white p-6 shadow-sm` | No DOM change in Phase 13 |
| EducationSection article cards | `rounded-xl border border-zinc-200 bg-white p-6 shadow-sm` | No DOM change in Phase 13 |
| TechStackIcons fallback pill | `bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5 text-xs` | No DOM change in Phase 13 — Badge swap is Phase 15 |
| Section separators | None exist | None added in Phase 13 — Separator is Phase 15 |

### Structural Preservation

| File | Allowed Change | Forbidden Change |
|------|----------------|-----------------|
| `src/app/globals.css` | Add shadcn imports and CSS variables; replace hex with oklch | Remove `@import "tailwindcss"` (must stay first); remove `@theme inline` font vars; remove `body` block |
| `src/app/layout.tsx` | None | Any modification |
| `src/components/Header.tsx` | None | Any modification |
| `src/components/WorkExperience.tsx` | None | Any modification |
| `src/components/EducationSection.tsx` | None | Any modification |
| `src/components/techstack-icons/TechStackIcons.tsx` | None | Any modification |
| `tsconfig.json` | None | Any modification |
| `next.config.ts` | None | Any modification |

### Build Gate

Phase 13 complete only when all of these pass:

- `npm run build` exits 0, zero TypeScript errors
- `npm run lint` exits 0, zero Biome violations
- Browser shows no visual change from pre-Phase-13 state
- `src/lib/utils.ts` exists and exports `cn()`
- `components.json` exists at project root with `"style": "default"` and `"rsc": true`
- All 3 component files exist: `src/components/ui/card.tsx`, `badge.tsx`, `separator.tsx`

---

## CSS Variable Token Surface (What Phase 13 Introduces)

The following `:root` block is what `globals.css` must contain after the manual merge.
Phases 14–16 will consume these tokens via Tailwind utility classes.

### Token Inventory

| CSS Variable | oklch Value | Tailwind Utility Class | Semantic Meaning |
|-------------|-------------|----------------------|-----------------|
| `--background` | `oklch(0.985 0 0)` | `bg-background` | Page background (zinc-50 equivalent) |
| `--foreground` | `oklch(0.210 0.006 286)` | `text-foreground` | Primary text (zinc-900 equivalent — see note) |
| `--card` | `oklch(1 0 0)` | `bg-card` | Card surface (pure white) |
| `--card-foreground` | `oklch(0.145 0 0)` | `text-card-foreground` | Text inside cards |
| `--primary` | `oklch(0.205 0 0)` | `text-primary`, `bg-primary` | Primary action color |
| `--primary-foreground` | `oklch(0.985 0 0)` | `text-primary-foreground` | Text on primary surfaces |
| `--secondary` | `oklch(0.97 0 0)` | `bg-secondary` | Secondary/muted surface |
| `--secondary-foreground` | `oklch(0.205 0 0)` | `text-secondary-foreground` | Text on secondary surfaces |
| `--muted` | `oklch(0.97 0 0)` | `bg-muted` | Muted background (replaces `bg-zinc-100`) |
| `--muted-foreground` | `oklch(0.556 0 0)` | `text-muted-foreground` | Secondary text (replaces `text-zinc-500`) |
| `--accent` | `oklch(0.97 0 0)` | `bg-accent` | Accent surface |
| `--accent-foreground` | `oklch(0.205 0 0)` | `text-accent-foreground` | Text on accent surfaces |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `text-destructive` | Error/destructive state color |
| `--border` | `oklch(0.922 0 0)` | `border-border` | Borders (replaces `border-zinc-200`) |
| `--input` | `oklch(0.922 0 0)` | `border-input` | Form input borders |
| `--ring` | `oklch(0.708 0 0)` | `ring` | Focus ring |
| `--radius` | `0.625rem` | (used by shadcn components internally) | Base border radius |

**Foreground value note:** The shadcn default `--foreground: oklch(0.145 0 0)` is significantly darker
than the existing `#18181b` (zinc-900). Computed precise equivalent is `oklch(0.210 0.006 286)`. The
executor must use `oklch(0.210 0.006 286)` to preserve zero visual change on the foreground color.
The background default `oklch(0.985 0 0)` matches `#fafafa` exactly — no adjustment needed there.

### globals.css Merge — Target State

After manual merge, the file structure must be in this exact order:

```css
@import "tailwindcss";           /* MUST be first — existing */
@import "tw-animate-css";        /* NEW — shadcn animation library */
@import "shadcn/tailwind.css";   /* NEW — shadcn base styles */

@custom-variant dark (&:is(.dark *));   /* NEW — zero-cost dark mode prep */

:root {
  /* UPDATED from hex to oklch — see Token Inventory above */
  --background: oklch(0.985 0 0);
  --foreground: oklch(0.210 0.006 286);

  /* NEW shadcn semantic tokens */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

@theme inline {
  /* KEEP — existing Tailwind v4 color bridges */
  --color-background: var(--background);
  --color-foreground: var(--foreground);

  /* KEEP — existing font wiring (critical — must not be removed) */
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  /* NEW — shadcn token bridges to Tailwind utilities */
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), system-ui, sans-serif;
}
```

---

## Spacing Scale

Phase 13 introduces no new spacing values. The existing Tailwind v4 spacing scale is unchanged.

| Token | Value | Status |
|-------|-------|--------|
| xs | 4px | Preserved (Tailwind default) |
| sm | 8px | Preserved (Tailwind default) |
| md | 16px | Preserved (Tailwind default) |
| lg | 24px | Preserved (Tailwind default) |
| xl | 32px | Preserved (Tailwind default) |
| 2xl | 48px | Preserved (Tailwind default) |
| 3xl | 64px | Preserved (Tailwind default) |

The `--radius: 0.625rem` token is introduced by shadcn but not applied to any component in Phase 13.
Phases 14–16 will consume it through shadcn Card's internal border-radius styling.

Exceptions: none in Phase 13.

---

## Typography

Phase 13 introduces no typography changes. The type scale is preserved from the existing implementation.

| Role | Size | Weight | Line Height | Status |
|------|------|--------|-------------|--------|
| Display (name h1) | 28px (`text-[28px]`) | 600 (semibold) | 1.2 | Preserved |
| Heading (section h2) | 20px (`text-xl`) | 600 (semibold) | 1.4 | Preserved |
| Subheading (role h3) | 18px (`text-lg`) | 700 (bold) | 1.4 | Preserved |
| Body (bullets, bio) | 16px (`text-base`) | 400 (regular) | 1.6 | Preserved |
| Secondary (dates, labels) | 14px (`text-sm`) | 400 (regular) | 1.5 | Preserved |

Font: Geist Sans (body), Geist Mono (code/badges) — unchanged. No Inter swap in this phase.

---

## Color

Phase 13 migrates the color system from hex to oklch. **Visual output is preserved.**

| Role | Before (hex) | After (oklch) | Tailwind Utility | Usage |
|------|-------------|---------------|-----------------|-------|
| Dominant (60%) | `#fafafa` | `oklch(0.985 0 0)` | `bg-background` | Page background |
| Secondary (30%) | `#ffffff` (bg-white on cards) | `oklch(1 0 0)` | `bg-card` | Card surfaces (Phase 14 will use) |
| Accent (10%) | `text-indigo-600` / `bg-blue-600` | No token — preserved as-is | N/A | Links, tech tags (unchanged in Phase 13) |
| Foreground | `#18181b` | `oklch(0.210 0.006 286)` | `text-foreground` | Primary text |
| Muted text | `text-zinc-500` | `oklch(0.556 0 0)` | `text-muted-foreground` | Dates, secondary labels (Phase 16 will consume) |
| Border | `border-zinc-200` | `oklch(0.922 0 0)` | `border-border` | Card borders (Phase 14 will use) |
| Destructive | Not used | `oklch(0.577 0.245 27.325)` | `text-destructive` | No destructive actions in resume |

Accent reserved for: links in Header contact row (`text-indigo-600`), tech badge icon fallback text.
These are unchanged in Phase 13. Token unification happens in Phase 16 (TOKEN-01).

**Indigo accent is not mapped to a shadcn token in this phase.** The shadcn `--primary` token is a
neutral dark (`oklch(0.205 0 0)`). Phases 16 may override `--primary` to an indigo equivalent, or
leave accent colors as raw Tailwind zinc/indigo classes. That decision is deferred to Phase 16.

---

## Downstream Mapping Table (Phases 14–16 Reference)

When phases 14–16 replace hand-rolled classes with shadcn tokens, use this table:

| Hand-Rolled Class | Replace With | shadcn Token | Notes |
|-------------------|-------------|--------------|-------|
| `bg-white` | `bg-card` | `--card` | Card surface background |
| `border-zinc-200` | `border-border` | `--border` | Card borders, dividers |
| `text-zinc-900` | `text-foreground` | `--foreground` | Primary body text |
| `text-zinc-700` | `text-foreground` | `--foreground` | Slightly lighter body — map to foreground |
| `text-zinc-500` | `text-muted-foreground` | `--muted-foreground` | Dates, duration labels, secondary text |
| `text-zinc-400` | `text-muted-foreground` | `--muted-foreground` | Very light secondary text |
| `bg-zinc-100` | `bg-muted` | `--muted` | Badge/pill backgrounds |
| `text-zinc-600` | `text-muted-foreground` | `--muted-foreground` | Pill text |
| `rounded-xl` | Keep as-is | N/A | shadcn `--radius` is 0.625rem (10px). Card uses `rounded-xl` (0.75rem). Keep `rounded-xl` explicit — do NOT rely on `--radius` alone. |
| `shadow-sm` | Keep as-is | N/A | Tailwind v4 `shadow-sm` is the renamed `shadow` from v3. Verify before changing (see PITFALLS: shadow renames). |

**Radius note for Phase 14:** shadcn Card internally styles `rounded-lg` (not `rounded-xl`). When
swapping `<article>` to `<Card>`, the card will use `rounded-lg` from the component source.
If the current `rounded-xl` is intentional, override by adding `className="rounded-xl"` to the
Card or edit `src/components/ui/card.tsx` post-install.

**Separator border color note for Phase 15:** shadcn `separator.tsx` uses `bg-border` internally.
This maps to `--border: oklch(0.922 0 0)` — the same visual value as `border-zinc-200`. This is
correct and intentional. Separator will NOT use `currentColor` (see PITFALLS: Tailwind v4 border
default). Verify `separator.tsx` source after `npx shadcn add separator` to confirm it uses
`bg-border` not a raw `border` class.

---

## Copywriting Contract

N/A — infrastructure phase. No user-facing copy is introduced in Phase 13.
No CTAs, empty states, error states, or destructive actions exist in this phase.
All existing copy on the resume page is preserved unchanged.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official (ui.shadcn.com) | `card`, `badge`, `separator` | Not required — official registry |

No third-party registries declared. Vetting gate not applicable.

All three blocks are sourced from the official shadcn registry at `ui.shadcn.com`. Source is open
and auditable. No network-access, `eval`, or environment-variable patterns are present in
Card, Badge, or Separator source (they are pure Tailwind + CVA + Radix wrappers).

---

## Component Architecture Constraints

These are non-visual contracts the executor must honor to avoid downstream breakage.

| Component | Has `"use client"` | Server Component Safe | Notes |
|-----------|-------------------|----------------------|-------|
| `Card`, `CardContent`, `CardHeader`, `CardFooter` | No | Yes — render directly | No Radix dependency |
| `Badge` | No | Yes — render directly | Pure styled span |
| `Separator` | Yes | Yes — as leaf import | Radix `useEffect` internally; import inside Server Components fine (leaf node rule) |

`WorkExperience.tsx`, `Header.tsx`, and `EducationSection.tsx` must NOT gain `"use client"` in
Phase 13. They remain Server Components. The shadcn components they will eventually host (Phase 14+)
do not require the parent to become a Client Component.

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS (N/A — infrastructure phase, no copy introduced)
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
