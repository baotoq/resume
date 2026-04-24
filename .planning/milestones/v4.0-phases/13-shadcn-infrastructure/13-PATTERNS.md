# Phase 13: shadcn Infrastructure - Pattern Map

**Mapped:** 2026-04-24
**Files analyzed:** 7 (2 modified, 5 created)
**Analogs found:** 4 / 7

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/app/globals.css` | config | transform | itself (existing) | self — merge target |
| `package.json` | config | — | itself (existing) | self — append target |
| `components.json` | config | — | none in codebase | no analog |
| `src/lib/utils.ts` | utility | transform | `src/lib/duration.ts` | role-match |
| `src/components/ui/card.tsx` | component | request-response | `src/components/WorkExperience.tsx` (article pattern) | partial |
| `src/components/ui/badge.tsx` | component | request-response | `src/components/HighlightedBullet.tsx` | partial |
| `src/components/ui/separator.tsx` | component | request-response | none in codebase | no analog |

---

## Pattern Assignments

### `src/app/globals.css` (config, transform — manual merge)

**Analog:** itself — the existing file is the merge base, not a pattern source.

**Current file state** (lines 1–19, all lines):
```css
@import "tailwindcss";

:root {
  --background: #fafafa;
  --foreground: #18181b;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), system-ui, sans-serif;
}
```

**Merge target state** (from RESEARCH.md Pattern 3 — exact post-merge content):
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.985 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
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
  /* PRESERVE — Geist font wiring (from layout.tsx: --font-geist-sans, --font-geist-mono) */
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  /* color token mappings */
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
```

**Critical constraints:**
- `@import "tailwindcss"` MUST stay on line 1 — Tailwind v4 requirement
- `--font-geist-sans` and `--font-geist-mono` come from `src/app/layout.tsx` (lines 5–12); the CSS vars are injected as HTML class attributes and consumed here — removing them silently breaks body font
- `--background` and `--foreground` hex values are replaced in `@theme inline` block — no hex values survive in the merged file

---

### `package.json` (config — append 6 dependencies)

**Analog:** itself — append to existing dependencies object.

**Current dependencies block** (lines 12–19):
```json
"dependencies": {
  "framer-motion": "^12.38.0",
  "gray-matter": "^4.0.3",
  "next": "16.2.3",
  "react": "19.2.4",
  "react-devicons": "^2.16.2",
  "react-dom": "19.2.4"
}
```

**6 packages to add** (verified versions from RESEARCH.md):
```json
"class-variance-authority": "0.7.1",
"clsx": "2.1.1",
"lucide-react": "1.9.0",
"shadcn": "4.4.0",
"tailwind-merge": "3.5.0",
"tw-animate-css": "1.4.0"
```

**Install command** (all 6 in one invocation):
```bash
npm install shadcn@4.4.0 class-variance-authority clsx tailwind-merge tw-animate-css lucide-react
```

---

### `components.json` (config — create at project root)

**Analog:** None in codebase — new file type.

**Pattern source:** RESEARCH.md Pattern 1 (verified against official shadcn docs).

**Full file content** (no existing analog; use verbatim from research):
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

**Key field rationale:**
- `"tailwind": { "config": "" }` — empty string signals Tailwind v4 CSS-first mode (no `tailwind.config.js`)
- `"rsc": true` — App Router; matches `src/app/layout.tsx` pattern (no `"use client"` at root)
- `@/*` aliases match `tsconfig.json` path alias `"@/*": ["./src/*"]`
- `"style": "new-york"` — D-03 resolved; `default` is deprecated and permanent once set

---

### `src/lib/utils.ts` (utility, transform — create)

**Analog:** `src/lib/duration.ts`

**Import/export pattern from analog** (`src/lib/duration.ts`, lines 11–29):
```typescript
// Pattern: named export function, no default export, no external imports
export function computeDuration(
  startDate: string,
  endDate: string | null,
  now: Date,
): string {
  // ...
}
```

**New file must follow the same convention:** named export, no default export.

**Full file content** (from RESEARCH.md Pattern 2, matches lib analog structure):
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Biome formatting note:** The analog `duration.ts` uses double-quoted strings throughout. The `cn()` import uses double quotes — consistent. No `"use client"` directive — this is a pure utility, used in both Server and Client components.

---

### `src/components/ui/card.tsx` (component, request-response — CLI-generated)

**Analog:** `src/components/WorkExperience.tsx` — closest match because `WorkExperience` already renders a card-shaped `article` with border, bg-white, rounded, shadow, and padding (lines 56–56):
```tsx
<article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
```

**Import pattern from analog** (`src/components/WorkExperience.tsx`, lines 1–7):
```tsx
import type { ExperienceEntry } from "@/types/resume";
import { HighlightedBullet } from "@/components/HighlightedBullet";
import { LogoImage } from "@/components/company-logos/LogoImage";
import { TechStackIcons } from "@/components/techstack-icons/TechStackIcons";
import { computeDuration } from "@/lib/duration";
```

**Key pattern for CLI-generated file:** The shadcn CLI will generate `card.tsx` with sub-components (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter). These import `cn` from `@/lib/utils`. Do NOT write this file manually — use `npx shadcn@latest add card`.

**Post-install Biome fix pattern** (based on Pitfall 5 in RESEARCH.md):
- Run `npm run lint` immediately after `npx shadcn@latest add card badge separator`
- Fix import order violations only — do not alter component logic
- Common fix: `biome check --write src/components/ui/` for auto-fixable formatting

---

### `src/components/ui/badge.tsx` (component, request-response — CLI-generated)

**Analog:** `src/components/HighlightedBullet.tsx` — closest role match as a small inline display primitive.

**Import pattern from analog** (`src/components/HighlightedBullet.tsx`, lines 1–2):
```tsx
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import type { ReactNode } from "react";
```

**Project Biome suppression pattern:** When Biome flags generated code that cannot be safely changed (e.g., array index keys, CVA variant patterns), use `biome-ignore` inline comments with an explanation string. The existing codebase uses `/** biome-ignore-all ... */` at file top for pervasive issues.

**Key pattern for CLI-generated file:** Badge uses `class-variance-authority` (cva) for variant management. The generated file will have a `badgeVariants` const with `cva(...)` and a `Badge` component that accepts a `variant` prop. Do NOT write this file manually — use `npx shadcn@latest add badge`.

**Expected generated structure:**
```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva("...", {
  variants: { variant: { default: "...", secondary: "...", ... } },
  defaultVariants: { variant: "default" }
})

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
```

---

### `src/components/ui/separator.tsx` (component, request-response — CLI-generated)

**Analog:** None in codebase — no divider or separator primitive exists.

**Key pattern:** Separator is backed by `@radix-ui/react-separator` (auto-installed by `shadcn add separator`). It requires `"use client"` as a leaf node because Radix primitives use React context internally.

**Do NOT write manually.** Use `npx shadcn@latest add separator`. The `@radix-ui/react-separator` package will be installed automatically by the CLI.

**Expected generated structure:**
```tsx
"use client"

import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className,
      )}
      {...props}
    />
  )
}
```

---

## Shared Patterns

### TypeScript import style
**Source:** `src/lib/duration.ts` (line 1), `src/components/WorkExperience.tsx` (line 1), `src/components/HighlightedBullet.tsx` (line 2)
**Apply to:** `src/lib/utils.ts`, any Biome fixes on CLI-generated files

The project uses `import type { ... }` for type-only imports — Biome enforces this via `useImportType` rule. CLI-generated files may use `import { type X }` inline form (TypeScript 5 style) — both forms are accepted by Biome 2.2.0.

### Path alias convention
**Source:** `src/components/WorkExperience.tsx` (lines 1–6)
**Apply to:** `src/lib/utils.ts` (imports), all `src/components/ui/*.tsx` files
```tsx
import { something } from "@/lib/utils";  // @/ resolves to ./src/
```
All internal imports use `@/` prefix — matches `tsconfig.json` `"@/*": ["./src/*"]` and `components.json` aliases.

### Named exports (no default exports)
**Source:** `src/lib/duration.ts` (line 11), `src/components/WorkExperience.tsx` (line 24), `src/components/HighlightedBullet.tsx` (line 8)
**Apply to:** `src/lib/utils.ts`

All project utilities and components use named exports. The `cn()` utility in `utils.ts` must follow this — `export function cn(...)` not `export default function cn(...)`.

### Biome suppression pattern
**Source:** `src/components/WorkExperience.tsx` (line 1), `src/components/HighlightedBullet.tsx` (line 1)
**Apply to:** CLI-generated `src/components/ui/*.tsx` files if Biome flags unfixable patterns
```tsx
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
```
Use `biome-ignore` with explanation strings when generated code cannot be safely reformatted without breaking component behavior.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `components.json` | config | — | New file type; no JSON config files of this kind exist in the project |
| `src/components/ui/separator.tsx` | component | request-response | No divider/separator primitive exists; closest would be a CSS `<hr>` which is not in the codebase |

---

## Execution Order (Dependency Chain)

The following order is enforced by hard dependencies — each step requires the previous:

1. `npm install` (6 packages) — packages must exist in `node_modules` before any import or CSS `@import` can resolve
2. `globals.css` manual merge — requires `shadcn` and `tw-animate-css` in `node_modules` (PostCSS import resolution)
3. `components.json` manual creation — required by CLI before any `shadcn add` command
4. `src/lib/utils.ts` manual creation — required by CLI-generated component files (`import { cn } from "@/lib/utils"`)
5. `npx shadcn@latest add card badge separator` — writes `src/components/ui/*.tsx`
6. `npm run lint` + fix Biome violations — must pass before commit
7. `npm run build` — final gate (D-11)

---

## Metadata

**Analog search scope:** `src/` (all files, 23 total)
**Files scanned:** 6 source files read (`globals.css`, `layout.tsx`, `duration.ts`, `HighlightedBullet.tsx`, `WorkExperience.tsx`, `package.json`)
**Pattern extraction date:** 2026-04-24
