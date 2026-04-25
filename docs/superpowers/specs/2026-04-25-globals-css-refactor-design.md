# globals.css Refactor Design

**Date:** 2026-04-25  
**Goal:** Cleaner globals.css + colocated component styles via CSS Modules

## Context

`src/app/globals.css` contains custom utility classes mixing genuinely shared styles with single-component styles. Gradient colors `#14b8a6` and `#10b981` are hardcoded in 6+ hex instances plus additional `rgba()` forms. `link-underline` is dead code (zero usages).

## Approach: Hybrid CSS Variables + CSS Modules

### 1. globals.css Changes

**Add to `:root`:**
```css
--color-accent-start: #14b8a6;
--color-accent-end: #10b981;
```

**Replace all hardcoded hex** `#14b8a6` / `#10b981` in globals with `var(--color-accent-start)` / `var(--color-accent-end)`. This applies to every kept class: `accent-gradient-bg`, `card-gradient-hover::after`. Do not replace in `link-underline` — that block is deleted wholesale.

Note: `rgba()` forms of these colors (e.g. `rgba(20, 184, 166, 0.18)`) appear in `accent-glow` / `accent-glow-bottom` — these classes are moving to `Header.module.css`, so they are out of scope for hex replacement. The rgba values move as-is into the module file. Success criterion for "no hardcoded hex" applies to globals only.

**Delete:**
- `link-underline` block (unused)
- In the `@media (prefers-reduced-motion: reduce)` block, the selector is a comma list: `.hover-lift, .link-underline::after { transition: none; }`. Remove only `, .link-underline::after` from the comma list — the `.hover-lift { transition: none; }` and `.hover-lift:hover { transform: none; }` rules must be preserved.
- `animate-pulse-ring` entry in the `@media (prefers-reduced-motion: reduce)` block (moves to module)

**Remove from globals** (move to modules): `accent-glow`, `accent-glow-bottom`, `accent-gradient-text`, `page-grain`, `animate-pulse-ring` + `@keyframes pulse-ring`.

**Keep in globals:**
- `accent-gradient-bg` — used in `CertificationsSection.tsx`, `badge.tsx`, `WorkExperience.tsx`
- `hover-lift` — used in `Header.tsx`, `CertificationsSection.tsx`, `LogoImage.tsx`, `TechStackIcons.tsx`, `WorkExperience.tsx`
- `card-gradient-hover` — used in `src/components/ui/card.tsx`, a shadcn-generated file. AGENTS.md prohibits hand-editing generated files; it must remain a global class.

### 2. CSS Modules to Create

CSS module files use **kebab-case** class selectors (e.g. `.accent-glow`). Next.js auto-converts these to camelCase for JS access (e.g. `styles.accentGlow`).

| File | Classes |
|------|---------|
| `src/app/page.module.css` | `.page-grain` |
| `src/components/Header.module.css` | `.accent-glow`, `.accent-glow-bottom`, `.accent-gradient-text` |
| `src/components/WorkExperience.module.css` | `.animate-pulse-ring` + `@keyframes pulse-ring` + reduced-motion reset |

`WorkExperience.module.css` must include the `prefers-reduced-motion` reset for the moved class:
```css
@media (prefers-reduced-motion: reduce) {
  .animate-pulse-ring {
    animation: none;
  }
}
```

`Header.module.css` uses `rgba()` forms for the glow opacities — these remain as hardcoded rgba values since CSS `rgba()` cannot consume a hex CSS variable directly.

### 3. Component Import Changes

Add `import styles from './ComponentName.module.css'` and merge module classes with Tailwind using `cn()`.

**`src/app/page.tsx`:**
```ts
import styles from './page.module.css';
// "page-grain ..." → cn(styles.pageGrain, "...")
```

**`src/components/Header.tsx`:**
```ts
import styles from './Header.module.css';
// "accent-glow" → styles.accentGlow
// "accent-glow-bottom" → styles.accentGlowBottom
// "accent-gradient-text ..." → cn(styles.accentGradientText, "...")
```

**`src/components/WorkExperience.tsx`:**
```ts
import styles from './WorkExperience.module.css';
// "accent-gradient-bg animate-pulse-ring" → cn("accent-gradient-bg", styles.animatePulseRing)
// line ~39: inline style gradient "linear-gradient(180deg, #14b8a6 0%, ...)"
//   → replace #14b8a6 with var(--color-accent-start), #10b981 with var(--color-accent-end)
```

### 4. Inline Style Fix

`WorkExperience.tsx` line ~39 has a JSX `style` prop with hardcoded hex in a gradient. Replace with CSS variables:
```
"linear-gradient(180deg, #14b8a6 0%, #10b981 30%, var(--border) 60%)"
→ "linear-gradient(180deg, var(--color-accent-start) 0%, var(--color-accent-end) 30%, var(--border) 60%)"
```

## Success Criteria

- `globals.css` contains only `:root` vars, `@theme inline`, shared utilities (used 3+ components or shadcn-generated), and `body` styles
- No hardcoded `#14b8a6` or `#10b981` hex in `globals.css` (only CSS var references)
- No hardcoded `#14b8a6` or `#10b981` hex in `WorkExperience.tsx` inline styles
- Each moved class lives in a `.module.css` next to its component
- `animate-pulse-ring` reduced-motion reset lives in `WorkExperience.module.css`
- `link-underline` removed entirely (class + reduced-motion entry)
- `npm run test:e2e` passes (Playwright smoke — catches gross visual regressions)

## Implementation Order

Apply in this sequence — component files reference CSS variables that must exist in globals first:

1. `src/app/globals.css` — add `:root` vars, replace hex, delete dead code, remove moved classes
2. Create module files (`page.module.css`, `Header.module.css`, `WorkExperience.module.css`)
3. Update component imports (`page.tsx`, `Header.tsx`, `WorkExperience.tsx`)

## Files Changed

- `src/app/globals.css` — modified
- `src/app/page.tsx` — modified
- `src/app/page.module.css` — created
- `src/components/Header.tsx` — modified
- `src/components/Header.module.css` — created
- `src/components/WorkExperience.tsx` — modified
- `src/components/WorkExperience.module.css` — created
