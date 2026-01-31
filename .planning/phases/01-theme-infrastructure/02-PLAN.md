# Plan 02: Add CSS Variables for Dark Mode

---
wave: 1
depends_on: []
files_modified:
  - src/app/globals.css
autonomous: true
---

## Objective

Define CSS custom properties for light and dark themes, replacing the current `prefers-color-scheme` media query approach with class-based theming that works with next-themes.

## Tasks

<task id="2.1">
Update `src/app/globals.css` to use class-based dark mode

Replace the current `@media (prefers-color-scheme: dark)` block with a `.dark` class selector.

Current structure:
```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

New structure:
```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --muted: #f3f4f6;
  --muted-foreground: #6b7280;
  --border: #e5e7eb;
  --card: #ffffff;
  --card-foreground: #171717;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
  --muted: #1f2937;
  --muted-foreground: #9ca3af;
  --border: #374151;
  --card: #111827;
  --card-foreground: #f9fafb;
}
```
</task>

<task id="2.2">
Add smooth color transition styles

```css
/* Smooth theme transitions */
*,
*::before,
*::after {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: ease-in-out;
  transition-duration: 200ms;
}

/* Disable transitions on page load to prevent flash */
html.no-transitions *,
html.no-transitions *::before,
html.no-transitions *::after {
  transition: none !important;
}
```
</task>

<task id="2.3">
Update @theme inline block for Tailwind v4 compatibility

Ensure CSS variables are available to Tailwind:
```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --font-sans: var(--font-inter), system-ui, -apple-system, sans-serif;
}
```
</task>

## Verification

- [ ] `:root` defines light theme variables
- [ ] `.dark` class defines dark theme variables
- [ ] Transition styles added for smooth theme switching
- [ ] @theme inline block updated with new color variables
- [ ] No CSS syntax errors
- [ ] Variables work in both themes (test by adding `dark` class to html manually)

## Must-Haves (Goal-Backward)

- Class-based dark mode (not media query)
- Smooth 200ms color transitions
- Extended color palette (muted, border, card)
- Tailwind v4 compatible configuration

---

*Plan created: 2026-01-31*

