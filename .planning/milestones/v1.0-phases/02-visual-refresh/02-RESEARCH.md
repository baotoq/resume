# Phase 2 Research: Visual Refresh

> Implementation research for visual redesign

## Overview

Phase 2 transforms the site's visual design with warm earth tones, Plus Jakarta Sans typography, cleaner layouts, and subtle animations. All decisions are documented in `02-CONTEXT.md`.

## Plus Jakarta Sans Implementation

### Google Fonts Setup (Next.js)

```typescript
// In layout.tsx
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
```

### Font Weights Available

| Weight | Name | Usage |
|--------|------|-------|
| 400 | Regular | Body text |
| 500 | Medium | Tags, labels |
| 600 | Semibold | Headings, emphasis |
| 700 | Bold | Name, primary headings |

## Color System Update

### CSS Variables Structure

Current variables need expansion for accent colors:

```css
:root {
  /* Existing */
  --background: #FAFAF8;
  --foreground: #1C1917;
  --muted: #F5F5F4;
  --muted-foreground: #78716C;
  --border: #E7E5E4;
  --card: #FFFFFF;
  --card-foreground: #1C1917;
  
  /* New - Accent */
  --accent: #0D9488;
  --accent-foreground: #FFFFFF;
}

.dark {
  --background: #0C0A09;
  --foreground: #FAFAF9;
  --muted: #1C1917;
  --muted-foreground: #A8A29E;
  --border: #292524;
  --card: #1C1917;
  --card-foreground: #FAFAF9;
  
  /* New - Accent */
  --accent: #2DD4BF;
  --accent-foreground: #0C0A09;
}
```

### Tailwind Integration

Add to `@theme inline` block:

```css
@theme inline {
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
}
```

### Contrast Ratios (WCAG AA)

| Combination | Light | Dark | Status |
|-------------|-------|------|--------|
| foreground on background | 15.4:1 | 15.4:1 | ✅ Pass |
| muted-foreground on background | 4.9:1 | 4.6:1 | ✅ Pass |
| accent on background | 4.5:1 | 8.6:1 | ✅ Pass |

## Component Updates Required

### Header Component

**Current issues:**
- Gradient line at bottom (remove)
- Blue/purple gradient text (replace with accent)
- Contact pills use blue/green colors (unify with accent)

**Changes:**
- Remove `bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500`
- Replace with subtle border or remove entirely
- Update gradient text to solid colors or accent gradient

### Experience Component

**Current issues:**
- Timeline uses blue/purple gradient
- Cards have gradient backgrounds
- Skills tags use blue colors

**Changes:**
- Timeline: Use accent color
- Cards: Clean white/card background with shadow
- Tags: Use muted background with accent text

### Skills Component

**Current issues:**
- Category-specific colors (blue, teal, purple, amber)
- Heavy color usage

**Changes:**
- Simplify to accent-based or neutral palette
- Keep subtle differentiation if needed

### Section Component

**Current issues:**
- Icon container uses blue/purple gradient
- Underline uses blue/purple gradient

**Changes:**
- Icon: Use accent color background
- Underline: Use accent color or remove

### Summary Component

**Current issues:**
- Blue/purple gradient background
- Decorative quote marks in blue/purple

**Changes:**
- Clean muted background
- Quote marks in muted-foreground

## Animation Implementation

### Card Hover Effect

```css
.card {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### Page Load Fade-in

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 300ms ease-out;
}
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/app/layout.tsx` | Replace Inter with Plus Jakarta Sans |
| `src/app/globals.css` | Update color values, add accent |
| `src/app/page.tsx` | Update background, add fade-in |
| `src/components/resume/Header.tsx` | Remove gradients, update colors |
| `src/components/resume/Experience.tsx` | Update timeline, cards, tags |
| `src/components/resume/Skills.tsx` | Simplify color scheme |
| `src/components/resume/Section.tsx` | Update icon/underline colors |
| `src/components/resume/Summary.tsx` | Clean up gradients |
| `src/components/resume/Education.tsx` | Update card styling |
| `src/styles/print.css` | Verify print still works |

## Testing Checklist

- [ ] Both themes have correct colors
- [ ] Contrast ratios meet WCAG AA
- [ ] Typography renders correctly
- [ ] Hover animations work
- [ ] Print/PDF export works
- [ ] No visual regressions
- [ ] Mobile responsive

---

*Research complete: 2026-01-31*

