# Phase 5: Tech Stack Icons - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-13
**Phase:** 05-tech-stack-icons
**Areas discussed:** Icon variant, Icon + label vs icon only, Text pill fallback style, Component architecture

---

## Icon Variant

| Option | Description | Selected |
|--------|-------------|----------|
| Colored | Brand colors per tech (React=blue, TypeScript=blue, Go=cyan). Uses `devicon-*-original colored` CSS class. | ✓ |
| Plain / monochrome | All icons render in current text color (zinc-700). Subtle, consistent with card palette. | |

**User's choice:** Colored
**Notes:** More visual; helps recognize icons at a glance.

---

## Icon + Label vs Icon Only

| Option | Description | Selected |
|--------|-------------|----------|
| Icon only | Just the Devicon glyph, no text. 24px icons, small gap. | ✓ |
| Icon + name below | Icon with tech name in ~9-10px text beneath. | |

**User's choice:** Icon only
**Notes:** Cleaner row; common pattern in portfolio sites.

---

## Text Pill Fallback Style

| Option | Description | Selected |
|--------|-------------|----------|
| Zinc text pill | `bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5 text-xs`. Stays quiet next to colored icons. | ✓ |
| Indigo accent pill | `bg-indigo-50 text-indigo-600`. More visible but may look like a tag/button. | |

**User's choice:** Zinc text pill
**Notes:** Low visual noise next to colored icons.

---

## Component Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| New TechStackIcons component | New `src/components/TechStackIcons.tsx` Server Component. WorkExperience calls it. CDN link in layout.tsx. | ✓ |
| Inline in WorkExperience.tsx | Map tech_stack directly in card JSX. Fewer files but larger component. | |

**User's choice:** New TechStackIcons component
**Notes:** Cleaner separation; consistent with LogoImage pattern from Phase 4.

---
