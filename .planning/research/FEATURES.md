# Feature Landscape — v4.0 shadcn/ui Design System Swap

**Domain:** Personal resume website — replacing hand-rolled Tailwind styling with shadcn/ui primitives
**Researched:** 2026-04-24
**Confidence:** HIGH (codebase inspection + Context7 shadcn/ui official docs)

---

## Overview

The existing site has four hand-rolled card-shaped UI elements that all use the same pattern (`rounded-xl border border-zinc-200 bg-white p-6 shadow-sm`): the Header section, WorkExperience article cards, EducationSection article cards, and the Skills section. Additionally there are tech-stack fallback pills, a pure-CSS tooltip on tech icons, and inline `·` separators in the Header contact row. This file maps each to the appropriate shadcn/ui primitive and classifies them.

---

## Table Stakes

Features/components that the milestone explicitly requires. Missing any of these means the design system swap is incomplete.

| Feature | Existing Element | shadcn Component | Complexity | Notes |
|---------|-----------------|-----------------|------------|-------|
| Section card container | `<article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">` in WorkExperience, EducationSection, and Header | `Card` + `CardContent` | LOW | Direct structural swap; keep `p-6` spacing via CardContent |
| Tech stack fallback pills | `<span className="bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5 text-xs">` in TechStackIcons.tsx line 89 | `Badge variant="secondary"` | LOW | One-liner swap; `outline` variant also viable for a lighter look |
| Section dividers | No dividers currently exist; project goal says "replace hand-rolled dividers" | `Separator` | LOW | Install for structural use *between* sections only — not inline text |
| CSS variable token unification | Scattered zinc-* / blue-* / indigo-* hardcoded classes | shadcn CSS variable theme (`--background`, `--foreground`, `--primary`, `--muted`, `--border`) | MEDIUM | Requires init + `globals.css` `@theme inline` block; all existing color tokens must be audited and remapped |
| Typography system | Inconsistent manual Tailwind classes across Header, WorkExperience, EducationSection | shadcn Typography class recipes | LOW-MEDIUM | **Not a component** — see note below |

### Critical Note: Typography is Not an Installable Component

`npx shadcn@latest add typography` does not exist. Shadcn typography is a set of Tailwind class-name recipes documented at `https://ui.shadcn.com/docs/components/typography`. There is no component file to install. Unifying typography means adopting the class patterns from those docs (`scroll-m-20 text-4xl font-extrabold tracking-tight`, `leading-7`, etc.) and applying them consistently across existing components. Do not attempt to `add` typography.

---

## Differentiators

Nice-to-have components that add polish beyond the stated minimum. Build these if scope allows.

| Feature | Existing Element | shadcn Component | Value | Complexity | Notes |
|---------|-----------------|-----------------|-------|------------|-------|
| Tech icon tooltip | `group-hover:opacity-100` absolute-positioned span in TechStackIcons.tsx lines 80–83 | `Tooltip` + `TooltipProvider` + `TooltipTrigger` | Accessible hover tooltip with Radix focus/keyboard support | MEDIUM | Converts pure-CSS hover to a Radix JS client component — see tradeoff flag below |
| Contact link separators (structural) | n/a — not currently used | `Separator orientation="vertical"` | Visual dividers in sidebar-style layouts | LOW | Only relevant if layout changes to have vertical sections; current horizontal layout uses inline `·` text |
| Section header card enhancement | Plain `<section>` wrappers for WorkExperience, Education section headings | `CardHeader` + `CardTitle` | Consistent heading structure inside Card | LOW | If the section heading is placed inside the Card boundary |

### Tooltip Tradeoff Flag

The existing tech icon tooltip is pure CSS (`group-hover:opacity-100` span with `pointer-events-none`). Replacing it with shadcn `Tooltip` means:

- **Pro:** keyboard accessible (focus triggers tooltip), ARIA attributes, Radix portal avoids z-index battles
- **Con:** requires `"use client"` directive, `TooltipProvider` wrapper at a higher level, and a Radix JS bundle. TechStackIcons.tsx is currently a server-renderable component — adding `Tooltip` makes it a client component.
- **Recommendation:** Swap to Tooltip if accessibility is a priority; keep pure-CSS if server-component boundary is important to preserve. Either is valid for a resume site.

---

## Anti-Features

Components to explicitly NOT use for specific elements in this codebase.

| Anti-Feature | Specific Mis-use | Why Avoid | What to Do Instead |
|--------------|-----------------|-----------|-------------------|
| `Separator` for Header contact inline dots | The `·` between contact links in Header.tsx is inline text, rendered inside a `flex flex-wrap` span row | Separator renders as a block `<div>` (Radix `SeparatorPrimitive.Root` is `role="separator"` with `display: block`). It cannot be used inline between text links — it will break the horizontal flow. | Keep the existing `<span className="text-zinc-400"> · </span>` text separator. It works correctly and needs no change. |
| `ScrollArea` | The resume page content | Over-engineering — single-column scrollable page needs native browser scroll | Native scroll; no wrapper |
| `Avatar` for company logos | LogoImage component in WorkExperience | Avatar expects a circular profile photo. Company logos are rectangular and rendered via `next/image` with fallback. The existing `LogoImage` component handles this correctly. | Keep LogoImage as-is |
| `HoverCard` for tech stack entries | Tech icons in TechStackIcons | Over-engineered for simple icon labels; adds a card popup for what is just a text label | Use Tooltip if upgrading from pure CSS, or keep pure CSS |
| `Badge` for ALL pills | Tech stack icon entries that already have a real SVG icon | When the tech has a recognized icon in TECH_ICON_MAP, the icon is the display element, not a pill. Badge should only replace the fallback pill path (line 89 in TechStackIcons.tsx). | Badge replaces only the `else` branch (unknown techs) — do not wrap icon entries in Badge |
| shadcn `Button` | Contact links in Header, any links on the page | Resume links are semantic `<a>` elements. Button styling on links signals interactivity/action, which confuses the recruiter's mental model. | Keep `<a>` with `text-indigo-600 hover:underline` or restyle directly |
| Dark mode toggle via shadcn `Switch` | Page-level theme | Out of scope per PROJECT.md "Future" — deferred deliberately | Defer to a future milestone |

---

## Component-to-Existing-Element Mapping

Explicit mapping from every hand-rolled element to its shadcn replacement (or explicit "no change" decision).

### Card — `npx shadcn@latest add card`

| Existing Element | Location | Replacement |
|-----------------|----------|-------------|
| `<section className="rounded-xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">` | Header.tsx line 17 | `<Card><CardContent className="px-6 py-6">` |
| `<article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">` | WorkExperience.tsx line 56 | `<Card><CardContent className="p-6">` |
| `<article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">` | EducationSection.tsx line 33 | `<Card><CardContent className="p-6">` |

Card sub-components available: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`. For resume cards, `Card` + `CardContent` is sufficient. `CardHeader` + `CardTitle` can optionally be used if the role title or degree title is moved inside the card header boundary.

Card `size` prop: `"default"` | `"sm"` — use default for all resume cards.

### Badge — `npx shadcn@latest add badge`

| Existing Element | Location | Replacement |
|-----------------|----------|-------------|
| `<span className="bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5 text-xs">{tech}</span>` | TechStackIcons.tsx line 89 (fallback pill, `else` branch) | `<Badge variant="secondary">{tech}</Badge>` |

Badge props:
- `variant`: `"default"` (primary color fill) | `"secondary"` (muted bg) | `"outline"` (border only) | `"destructive"` (red fill)
- `asChild`: `boolean` — renders as a different element type via Radix Slot
- All standard HTML `<span>` attributes are passed through

For tech fallback pills, `variant="secondary"` matches the existing zinc-100 muted style. `variant="outline"` gives a cleaner, lighter look — valid alternative.

### Separator — `npx shadcn@latest add separator`

| Where to Use | Purpose |
|-------------|---------|
| Between major page sections (below Header, below WorkExperience, below Education) | Optional structural divider if the design calls for visual breaks between sections |
| Inside a card between the header area and bullet list | Thin horizontal rule between role info and bullets |

Separator props:
- `orientation`: `"horizontal"` (default, `h-px w-full`) | `"vertical"` (`w-px self-stretch`)
- `decorative`: `boolean` (default `true`) — when `true`, sets `aria-hidden` and `role="none"` (purely visual). Set `false` if the separator has semantic meaning.
- All standard `ComponentProps<typeof SeparatorPrimitive.Root>` passed through

**Do NOT use for:** Header contact dot separators (inline text, block element will break layout).

### Typography — No install, class-name recipes only

No `npx shadcn@latest add typography` command exists. Use these class patterns from the official shadcn typography docs:

| Element | Shadcn Recipe | Current Class (approximate) |
|---------|--------------|---------------------------|
| Page name (h1) | `text-4xl font-extrabold tracking-tight` | `text-[28px] font-semibold` — consider aligning |
| Section headings (h2) | `text-3xl font-semibold tracking-tight` + `border-b pb-2` | `text-xl font-semibold` — current size is fine for resume density |
| Role/degree title (h3) | `text-2xl font-semibold tracking-tight` | `text-lg font-bold` / `text-xl font-bold` |
| Body / bullets (p) | `leading-7 [&:not(:first-child)]:mt-6` | `text-base leading-relaxed` — already good |
| Secondary text (dates, duration) | `text-sm text-muted-foreground` | `text-sm text-zinc-500` — maps to `--muted-foreground` token |

Once CSS variables are initialized via shadcn, `text-muted-foreground` replaces `text-zinc-500`, `text-foreground` replaces `text-zinc-900`, `bg-card` replaces `bg-white`, `border-border` replaces `border-zinc-200`.

---

## Silent Dependency: `cn()` Utility

Every shadcn component imports `cn` from `@/lib/utils`. This file does not currently exist in the project. Running `npx shadcn@latest init` creates it automatically. The file exports a `cn(...inputs)` function that merges Tailwind classes using `clsx` + `tailwind-merge`.

This is a prerequisite — without it, no shadcn component can be installed. It must be set up before any component is added.

---

## Installation Commands (per component)

```bash
# Initialize shadcn/ui (creates components.json, lib/utils.ts, CSS variables)
npx shadcn@latest init

# Individual component installs
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add separator
npx shadcn@latest add tooltip   # differentiator only
```

---

## Feature Dependencies

```
shadcn/ui init (creates lib/utils.ts, updates globals.css, creates components.json)
    └──required by──> ALL shadcn component installs

Card
    └──replaces──> .rounded-xl.border.border-zinc-200.bg-white.shadow-sm pattern
    └──in──> Header.tsx, WorkExperience.tsx, EducationSection.tsx

Badge
    └──replaces──> fallback pill span in TechStackIcons.tsx (else branch only)
    └──does NOT replace──> SVG icon entries in TechStackIcons.tsx

Separator
    └──adds visual structure──> between page sections OR inside cards
    └──does NOT replace──> inline text · separators in Header.tsx contact row

Typography (no install)
    └──is an audit + class rename task──> across Header, WorkExperience, EducationSection
    └──depends on──> CSS variables being set up by shadcn init first
    └──maps zinc-* tokens──> to --foreground / --muted-foreground / --border CSS variables

Tooltip (differentiator)
    └──replaces──> pure-CSS group-hover tooltip in TechStackIcons.tsx
    └──forces──> "use client" on TechStackIcons.tsx (currently server-renderable)
    └──requires──> TooltipProvider wrapper in a parent component
```

---

## Complexity Notes Per Component

| Component | Install Complexity | Integration Complexity | Risk |
|-----------|------------------|----------------------|------|
| `Card` | LOW — one CLI command | LOW — structural swap only; identical visual result | LOW — no behavioral change |
| `Badge` | LOW — one CLI command | LOW — one-line swap in one component | LOW |
| `Separator` | LOW — one CLI command | LOW — additive; no existing element removed | LOW — only risk is misusing it for inline separators |
| Typography | NONE (no install) | MEDIUM — requires audit of all text classes across 3 components | MEDIUM — high surface area; easy to miss one |
| shadcn init | LOW — one CLI command | MEDIUM — modifies globals.css (CSS variable block added); must not conflict with existing Tailwind v4 `@import "tailwindcss"` | MEDIUM — Tailwind v4 compatibility requires careful review of generated CSS |
| `Tooltip` | LOW | MEDIUM — adds client boundary to TechStackIcons | LOW–MEDIUM — bundle size increase, architectural boundary change |

---

## MVP for v4.0

### Must Ship

1. `npx shadcn@latest init` — prerequisite for everything
2. `Card` — replaces all three card-pattern elements (Header, WorkExperience, EducationSection)
3. `Badge` — replaces TechStackIcons fallback pill
4. `Separator` — use structurally between sections (additive, not a replacement)
5. Typography audit — remap zinc-* colors to CSS variable tokens post-init

### Defer

- `Tooltip` for tech icons: architectural boundary change, not strictly required for design system swap
- Dark mode: explicitly deferred to Future in PROJECT.md

---

## Sources

- Context7 `/llmstxt/ui_shadcn_llms_txt` — Card, Badge, Separator, Tooltip API reference — HIGH confidence
- `https://ui.shadcn.com/docs/components/card` — Card sub-components and props — HIGH confidence
- `https://ui.shadcn.com/docs/components/badge` — Badge variants (`default`, `secondary`, `outline`, `destructive`) — HIGH confidence
- `https://ui.shadcn.com/docs/components/separator` — Separator orientation/decorative props, Radix `SeparatorPrimitive.Root` — HIGH confidence
- `https://ui.shadcn.com/docs/components/typography` — Typography is class recipes only, no installable component — HIGH confidence
- `https://ui.shadcn.com/docs/tailwind-v4` — Tailwind v4 compatibility (CSS variable syntax, `@theme inline`, `tw-animate-css`) — HIGH confidence
- Codebase inspection: `src/components/Header.tsx`, `src/components/WorkExperience.tsx`, `src/components/EducationSection.tsx`, `src/components/techstack-icons/TechStackIcons.tsx` — PRIMARY, HIGH confidence
- `.planning/PROJECT.md` — authoritative scope and constraints — PRIMARY, HIGH confidence

---
*Feature research for: v4.0 shadcn/ui Full Design System Swap*
*Researched: 2026-04-24*
