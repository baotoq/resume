# globals.css Refactor Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move single-use CSS classes from `globals.css` into colocated CSS Modules, extract hardcoded gradient colors to CSS variables, and delete dead code.

**Architecture:** Update `globals.css` first (defines CSS vars that components will reference), then create three `.module.css` files colocated with their components, then update the three component files to import and use the module classes.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS 4, CSS Modules (built-in to Next.js — zero config needed)

**Spec:** `docs/superpowers/specs/2026-04-25-globals-css-refactor-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/app/globals.css` | Add CSS vars, replace hex in kept classes, delete dead code, remove moved classes |
| Create | `src/app/page.module.css` | `page-grain` class (grain texture overlay) |
| Modify | `src/app/page.tsx` | Import and use `page.module.css` |
| Create | `src/components/Header.module.css` | `accent-glow`, `accent-glow-bottom`, `accent-gradient-text` |
| Modify | `src/components/Header.tsx` | Import and use `Header.module.css` |
| Create | `src/components/WorkExperience.module.css` | `animate-pulse-ring`, keyframes, reduced-motion reset |
| Modify | `src/components/WorkExperience.tsx` | Import module, fix inline style hex |

---

## Chunk 1: globals.css + Module Files

### Task 1: Update globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace globals.css with the refactored version**

The final content of `src/app/globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.985 0 0);
  --foreground: oklch(0.21 0.006 286);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.21 0.006 286);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.21 0.006 286);
  --primary: oklch(0.704 0.1248 178.87);
  --primary-foreground: oklch(1 0 0);
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
  --color-accent-start: #14b8a6;
  --color-accent-end: #10b981;
}

@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
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

  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), system-ui, sans-serif;
}

@layer utilities {
  .accent-gradient-bg {
    background: linear-gradient(135deg, var(--color-accent-start), var(--color-accent-end));
  }
  .card-gradient-hover {
    position: relative;
  }
  .card-gradient-hover::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, var(--color-accent-start), var(--color-accent-end));
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.22;
    transition:
      opacity 200ms ease,
      padding 200ms ease;
    pointer-events: none;
    z-index: 1;
  }
  .card-gradient-hover:hover::after {
    opacity: 1;
    padding: 1.5px;
  }
  .hover-lift {
    transition: transform 200ms ease;
  }
  .hover-lift:hover {
    transform: translateY(-2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hover-lift {
    transition: none;
  }
  .hover-lift:hover {
    transform: none;
  }
}
```

What changed vs the original:
- Added `--color-accent-start` and `--color-accent-end` to `:root`
- `accent-gradient-bg`: hex → `var(--color-accent-start/end)`
- `card-gradient-hover::after`: hex → `var(--color-accent-start/end)`
- Deleted: `page-grain`, `accent-gradient-text`, `accent-glow`, `accent-glow-bottom`, `animate-pulse-ring`, `@keyframes pulse-ring`, `link-underline`
- Reduced-motion block: removed `link-underline::after` from comma selector and `animate-pulse-ring` entry; `.hover-lift` entries remain

- [ ] **Step 2: Verify lint passes**

```bash
npm run lint
```
Expected: no errors (biome should be happy with valid CSS)

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: extract accent color tokens, remove dead css, scope single-use classes"
```

---

### Task 2: Create page.module.css

**Files:**
- Create: `src/app/page.module.css`

- [ ] **Step 1: Create the file**

Create `src/app/page.module.css` with this content:

```css
.page-grain {
  position: relative;
}

.page-grain::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' stitchTiles='stitch'/><feColorMatrix values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.module.css
git commit -m "refactor: colocate page-grain style in page.module.css"
```

---

### Task 3: Create Header.module.css

**Files:**
- Create: `src/components/Header.module.css`

- [ ] **Step 1: Create the file**

Create `src/components/Header.module.css` with this content:

```css
.accent-gradient-text {
  background: linear-gradient(135deg, #14b8a6, #10b981);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.accent-glow {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 260px;
  height: 160px;
  background: radial-gradient(
    ellipse at top right,
    rgba(20, 184, 166, 0.18),
    transparent 65%
  );
  pointer-events: none;
}

.accent-glow-bottom {
  position: absolute;
  bottom: -40px;
  left: -40px;
  width: 280px;
  height: 180px;
  background: radial-gradient(
    ellipse at bottom left,
    rgba(16, 185, 129, 0.16),
    transparent 65%
  );
  pointer-events: none;
}
```

Note: `rgba()` values cannot consume a hex CSS variable, so they remain as hardcoded rgba. This is intentional per spec.

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.module.css
git commit -m "refactor: colocate header-specific styles in Header.module.css"
```

---

### Task 4: Create WorkExperience.module.css

**Files:**
- Create: `src/components/WorkExperience.module.css`

- [ ] **Step 1: Create the file**

Create `src/components/WorkExperience.module.css` with this content:

```css
@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.45);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(20, 184, 166, 0);
  }
}

.animate-pulse-ring {
  animation: pulse-ring 2s ease-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-pulse-ring {
    animation: none;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/WorkExperience.module.css
git commit -m "refactor: colocate animate-pulse-ring in WorkExperience.module.css"
```

---

## Chunk 2: Component Updates + Verification

### Task 5: Update page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add module import and update className**

In `src/app/page.tsx`:

Add import after existing imports:
```ts
import styles from "./page.module.css";
```

Change line 28 from:
```tsx
<main className="page-grain min-h-screen bg-zinc-50 py-12 px-4 sm:px-8">
```
to:
```tsx
<main className={`${styles.pageGrain} min-h-screen bg-zinc-50 py-12 px-4 sm:px-8`}>
```

- [ ] **Step 2: Verify lint passes**

```bash
npm run lint
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "refactor: use page.module.css for page-grain in page.tsx"
```

---

### Task 6: Update Header.tsx

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Add module import and update classNames**

In `src/components/Header.tsx`:

Add import after existing imports:
```ts
import styles from "./Header.module.css";
```

Change line 63 from:
```tsx
<div className="accent-glow" aria-hidden="true" />
```
to:
```tsx
<div className={styles.accentGlow} aria-hidden="true" />
```

Change line 64 from:
```tsx
<div className="accent-glow-bottom" aria-hidden="true" />
```
to:
```tsx
<div className={styles.accentGlowBottom} aria-hidden="true" />
```

Change line 66 from:
```tsx
<h1 className="accent-gradient-text text-[28px] font-semibold leading-[1.1]">
```
to:
```tsx
<h1 className={`${styles.accentGradientText} text-[28px] font-semibold leading-[1.1]`}>
```

- [ ] **Step 2: Verify lint passes**

```bash
npm run lint
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.tsx
git commit -m "refactor: use Header.module.css for header-specific styles"
```

---

### Task 7: Update WorkExperience.tsx

**Files:**
- Modify: `src/components/WorkExperience.tsx`

- [ ] **Step 1: Add module import**

In `src/components/WorkExperience.tsx`:

Add import after existing imports:
```ts
import styles from "./WorkExperience.module.css";
```

- [ ] **Step 2: Update animate-pulse-ring className**

Change lines 55–59 from:
```tsx
className={`absolute z-10 -left-5.5 sm:-left-6.5 top-5.5 w-3 h-3 rounded-full ${
  isCurrent
    ? "accent-gradient-bg animate-pulse-ring"
    : "border-2 border-border bg-background"
}`}
```
to:
```tsx
className={`absolute z-10 -left-5.5 sm:-left-6.5 top-5.5 w-3 h-3 rounded-full ${
  isCurrent
    ? `accent-gradient-bg ${styles.animatePulseRing}`
    : "border-2 border-border bg-background"
}`}
```

- [ ] **Step 3: Fix inline style gradient hex**

Change lines 39–41 from:
```tsx
style={{
  background:
    "linear-gradient(180deg, #14b8a6 0%, #10b981 30%, var(--border) 60%)",
}}
```
to:
```tsx
style={{
  background:
    "linear-gradient(180deg, var(--color-accent-start) 0%, var(--color-accent-end) 30%, var(--border) 60%)",
}}
```

- [ ] **Step 4: Verify lint passes**

```bash
npm run lint
```
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/components/WorkExperience.tsx
git commit -m "refactor: use WorkExperience.module.css and CSS vars in WorkExperience"
```

---

### Task 8: Verify end-to-end

- [ ] **Step 1: Run full build**

```bash
npm run build
```
Expected: successful build, no TypeScript or CSS errors

- [ ] **Step 2: Start dev server and visually inspect**

```bash
npm run dev
```
Open `http://localhost:3000`. Check:
- Header name renders with teal-to-green gradient text
- Header card has subtle glow effects in top-right and bottom-left corners
- Page has grain texture overlay
- Work Experience timeline dot for current role pulses (disable reduced-motion to see it)
- Timeline gradient line renders (teal top fading to border color)
- Card hover shows gradient border on hover
- All cards lift on hover

- [ ] **Step 3: Run e2e smoke tests**

```bash
npm run test:e2e
```
Expected: all Playwright tests pass

- [ ] **Step 4: Verify no hardcoded accent hex in globals or WorkExperience**

```bash
grep -n "#14b8a6\|#10b981" src/app/globals.css
```
Expected: no output (zero matches)

```bash
grep -n "#14b8a6\|#10b981" src/components/WorkExperience.tsx
```
Expected: no output (zero matches)

- [ ] **Step 5: Final commit if anything remains unstaged**

```bash
git status
```
If clean: done. If any files remain: stage and commit with appropriate message.
