# Plan 02: Color Palette Update

---
wave: 1
depends_on: []
files_modified:
  - src/app/globals.css
autonomous: true
---

## Objective

Update CSS variables with warm earth tones and teal accent, replacing the current blue/purple scheme.

## Tasks

<task id="2.1">
Update `src/app/globals.css` with new color palette

Replace current :root and .dark color values:

```css
:root {
  --background: #FAFAF8;
  --foreground: #1C1917;
  --muted: #F5F5F4;
  --muted-foreground: #78716C;
  --border: #E7E5E4;
  --card: #FFFFFF;
  --card-foreground: #1C1917;
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
  --accent: #2DD4BF;
  --accent-foreground: #0C0A09;
}
```
</task>

<task id="2.2">
Update @theme inline block to include accent colors

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --font-sans: var(--font-plus-jakarta), system-ui, -apple-system, sans-serif;
}
```
</task>

## Verification

- [ ] Light theme uses warm off-white background (#FAFAF8)
- [ ] Dark theme uses warm dark background (#0C0A09)
- [ ] Accent color is teal (#0D9488 light, #2DD4BF dark)
- [ ] All color variables defined in both themes
- [ ] @theme inline includes accent colors
- [ ] Font variable updated to plus-jakarta

## Must-Haves (Goal-Backward)

- Warm earth tone palette applied
- Teal accent color defined
- Both light and dark themes updated
- Tailwind can access all color variables

---

*Plan created: 2026-01-31*

