# Phase 2 Context: Visual Refresh

> Design decisions captured on 2026-01-31

## Color Palette

| Decision | Choice |
|----------|--------|
| Direction | Warm, earthy tones with teal accent |
| Personality | Professional, warm, distinctive — not generic |

### Light Theme Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#FAFAF8` | Page background (warm off-white) |
| `--foreground` | `#1C1917` | Primary text (warm charcoal) |
| `--accent` | `#0D9488` | Links, highlights, buttons (teal) |
| `--accent-foreground` | `#FFFFFF` | Text on accent backgrounds |
| `--muted` | `#F5F5F4` | Secondary backgrounds, cards |
| `--muted-foreground` | `#78716C` | Secondary text |
| `--border` | `#E7E5E4` | Subtle borders |
| `--card` | `#FFFFFF` | Card backgrounds |
| `--card-foreground` | `#1C1917` | Card text |

### Dark Theme Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#0C0A09` | Page background (warm dark) |
| `--foreground` | `#FAFAF9` | Primary text (warm light) |
| `--accent` | `#2DD4BF` | Links, highlights, buttons (lighter teal) |
| `--accent-foreground` | `#0C0A09` | Text on accent backgrounds |
| `--muted` | `#1C1917` | Secondary backgrounds |
| `--muted-foreground` | `#A8A29E` | Secondary text |
| `--border` | `#292524` | Subtle borders |
| `--card` | `#1C1917` | Card backgrounds |
| `--card-foreground` | `#FAFAF9` | Card text |

**Implementation notes:**
- Replace current blue/purple gradients with teal accent
- Use warm Stone color scale from Tailwind as base
- Ensure 4.5:1 contrast ratio for all text

## Typography

| Decision | Choice |
|----------|--------|
| Font family | Plus Jakarta Sans (Google Fonts) |
| Fallback | system-ui, -apple-system, sans-serif |
| Personality | Modern, geometric, readable |

### Font Weights

| Usage | Weight | Size |
|-------|--------|------|
| Name (h1) | 700 (Bold) | 3rem / 48px |
| Job title | 600 (Semibold) | 1.5rem / 24px |
| Section titles | 600 (Semibold) | 1.25rem / 20px |
| Company names | 600 (Semibold) | 1rem / 16px |
| Body text | 400 (Regular) | 0.875rem / 14px |
| Skills/tags | 500 (Medium) | 0.75rem / 12px |

**Implementation notes:**
- Replace Inter with Plus Jakarta Sans in layout.tsx
- Import weights: 400, 500, 600, 700
- Update CSS variable `--font-sans`

## Visual Density

| Decision | Choice |
|----------|--------|
| Spacing | More whitespace, breathable layout |
| Cards | Soft shadows, 12-16px radius, no heavy borders |
| Sections | Increased gap between sections |
| Header | Remove decorative gradient line |

### Spacing Guidelines

| Element | Current | New |
|---------|---------|-----|
| Section gap | gap-8 (32px) | gap-12 (48px) |
| Card padding | p-5 (20px) | p-6 (24px) |
| Card radius | rounded-xl (12px) | rounded-2xl (16px) |
| Header bottom | gradient line | clean border or none |

### Card Styling

- Remove: Heavy borders, gradient backgrounds
- Add: Subtle shadow (`shadow-sm`), clean background
- Hover: Gentle lift (`hover:-translate-y-0.5 hover:shadow-md`)
- Dark mode: Slightly lighter card background than page

**Implementation notes:**
- Simplify card styles across all sections
- Use consistent shadow/radius throughout
- Remove decorative elements that don't serve function

## Animation Style

| Decision | Choice |
|----------|--------|
| Philosophy | Minimal, purposeful, not distracting |
| Timing | 150-200ms for interactions |

### Animation Specifications

| Trigger | Animation | Duration |
|---------|-----------|----------|
| Page load | Fade-in content | 300ms |
| Card hover | Lift + shadow increase | 200ms |
| Link hover | Color transition | 150ms |
| Button hover | Background transition | 150ms |
| Theme toggle | Already implemented | 200ms |

### What NOT to animate

- No staggered reveals on page load
- No parallax effects
- No bouncing or pulsing elements
- No attention-seeking animations
- No scroll-triggered animations

**Implementation notes:**
- Add `transition-transform` to cards
- Use `hover:-translate-y-0.5` for subtle lift
- Keep existing theme transition (200ms)

---

## Summary for Downstream Agents

**What to build:**
- Warm earth tone palette with teal accent
- Plus Jakarta Sans typography
- Cleaner, more spacious layout
- Soft shadows instead of heavy borders
- Minimal hover animations (lift effect)
- Remove decorative gradient line from header

**What NOT to build:**
- Blue/purple gradients
- Heavy borders or outlines
- Complex animations
- Staggered page load effects
- Parallax or scroll effects

**Contrast requirements:**
- All text must meet WCAG 2.1 AA (4.5:1 ratio)
- Test both light and dark themes
- Pay attention to muted text colors

---

*Created: 2026-01-31*

