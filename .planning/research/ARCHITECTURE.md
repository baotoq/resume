# Architecture Patterns: shadcn/ui Integration

**Domain:** Personal resume site — Next.js 16 App Router, shadcn/ui design system swap (v4.0)
**Researched:** 2026-04-24
**Confidence:** HIGH (Context7 + official docs + GitHub source discussion + direct codebase inspection)

---

## Server/Client Boundary Analysis

### The central question answered

shadcn/ui components are NOT uniformly Client Components. They fall into three categories relevant to this project:

| Component | Has `"use client"` | Reason | Can render inside Server Component |
|-----------|-------------------|--------|--------------------------------------|
| `Card`, `CardHeader`, `CardContent`, `CardFooter` | No | Pure HTML div wrappers, no hooks, no Radix primitive | YES — used directly |
| `Badge` | No | Pure styled span, no hooks, no Radix primitive | YES — used directly |
| `Separator` | Yes | Wraps Radix UI Separator, which calls `useEffect` internally | YES — as a leaf node import |

**Source:** GitHub discussion [shadcn-ui/ui #2562](https://github.com/shadcn-ui/ui/discussions/2562) confirms Separator requires `"use client"` due to Radix's `useEffect` registering `window['radix-ui']`. Card and Badge are vanilla React with no Radix dependency.

### The leaf node rule (HIGH confidence)

React's Server/Client boundary propagates *down*, not *up*. A Server Component can import a Client Component as a child — the Client Component becomes a leaf. The parent stays a Server Component.

```
page.tsx (Server)
  └── AnimateIn (Client — framer-motion)
        └── WorkExperience (Server)
              ├── Card (no "use client" — Server fine)
              ├── Badge (no "use client" — Server fine)
              └── Separator (Client leaf — Server Component importing it is fine)
```

`WorkExperience`, `Header`, and `EducationSection` do NOT need to become Client Components. They import shadcn primitives the same way they currently import plain divs.

### What would force a section component to become a Client Component

Nothing in the v4.0 scope does this. Card, Badge, and Separator are all pure display components — no interactive state. If future phases add Dialog, DropdownMenu, or Tooltip, those components would force the file they live in to have `"use client"`, but they would still be leaf nodes, not contagious to the Server Component parent.

### The AnimateIn pattern is unaffected

`AnimateIn` wraps Server Component output by accepting `children` as props. In React's model, children passed from a Server Component parent remain serializable server output — they are not pulled into the Client Component's bundle. This pattern is already proven in the codebase and shadcn integration does not change it.

```tsx
// page.tsx (Server) — unchanged
<AnimateIn delay={0.1}>
  <WorkExperience experience={resume.experience} />  {/* stays Server */}
</AnimateIn>
```

---

## CSS Variable Integration with Tailwind v4

### Current state of globals.css

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

### What shadcn adds to globals.css

shadcn's Tailwind v4 setup requires two additional imports and a large `:root` variable block. The target state after manual merge:

```css
@import "tailwindcss";
@import "tw-animate-css";           /* NEW — shadcn animation library */
@import "shadcn/tailwind.css";      /* NEW — shadcn base styles */

@custom-variant dark (&:is(.dark *));   /* NEW — dark mode variant */

:root {
  /* UPDATED — shadcn uses oklch() for color values */
  --background: oklch(0.985 0 0);
  --foreground: oklch(0.145 0 0);

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
  /* KEEP — existing font and base color mappings */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  /* NEW shadcn token mappings */
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

### Color system coexistence decision

The existing codebase uses Tailwind's built-in zinc/indigo/blue palette classes directly (e.g., `text-zinc-900`, `border-zinc-200`, `text-indigo-600`, `bg-blue-600`). shadcn tokens are additive — they do not remove built-in Tailwind colors.

Recommended approach: keep both systems in parallel during migration. Existing hand-rolled classes continue working unchanged. New shadcn component props (`variant`, `className` overrides) use shadcn tokens. This allows incremental replacement without a big-bang rewrite. After all components are migrated, do a final pass to unify remaining raw zinc/indigo/blue references to shadcn semantic tokens.

### Critical: Do NOT blindly run `shadcn init` on globals.css

`shadcn@latest init` will attempt to rewrite globals.css. The project's existing `@import "tailwindcss"`, `@theme inline` block, and Geist font variables must be preserved. Perform the globals.css merge manually, or run `init` and then restore the overwritten sections. Blindly accepting the CLI's file overwrite destroys the existing font and base color setup.

---

## Component Boundaries: New vs Modified Files

### New files — created by shadcn CLI (`npx shadcn@latest add`)

```
src/components/ui/
  card.tsx        — Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription, CardAction
  badge.tsx       — Badge (with variant prop: default | secondary | destructive | outline)
  separator.tsx   — Separator (has "use client" — Radix UI primitive)
```

### New files — created manually

```
components.json   — shadcn CLI configuration (project root)
src/lib/utils.ts  — cn() utility function (clsx + tailwind-merge)
```

### Modified files

```
src/app/globals.css               — add tw-animate-css, shadcn/tailwind.css imports + CSS variable expansion
src/components/Header.tsx         — wrap section content in Card/CardContent
src/components/WorkExperience.tsx — article → Card; tech pills → Badge
src/components/EducationSection.tsx — article → Card
src/components/techstack-icons/TechStackIcons.tsx — zinc fallback pills → Badge
```

### Untouched files

```
src/app/page.tsx                          — Server Component, data flow unchanged
src/components/animation/AnimateIn.tsx    — no change
src/components/HighlightedBullet.tsx      — no change
src/components/company-logos/LogoImage.tsx — no change
src/types/resume.ts                       — no change
src/data/resume.md                        — no change
```

---

## Data Flow Changes

None. The data pipeline (`resume.md` → gray-matter → page.tsx → typed props → section components) is purely about data. shadcn primitives are presentational wrappers that accept `className` and `children`. No prop signatures change at the page level. The `ResumeData` type is unchanged.

---

## Recommended Build Order

Dependencies flow from infrastructure upward. Complete each step before the next to isolate integration issues.

### Step 1 — Infrastructure (zero visual change, unblocks everything)

1. Install npm packages:
   ```bash
   npm install shadcn class-variance-authority clsx tailwind-merge tw-animate-css
   ```
2. Create `components.json` at project root with `rsc: true`, Tailwind v4 paths:
   ```json
   {
     "$schema": "https://ui.shadcn.com/schema.json",
     "style": "base-nova",
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
3. Create `src/lib/utils.ts` with the `cn()` function.
4. Manually merge shadcn CSS variables into `globals.css` — preserve existing `@theme inline` and font vars.

Gate: `npm run build` passes, no visual change in browser.

### Step 2 — shadcn component source files

Run `npx shadcn@latest add card badge separator`. This copies component source into `src/components/ui/`. Review each file after the CLI runs. Do not let the CLI overwrite `globals.css` a second time if it prompts.

Gate: Files exist at `src/components/ui/`, TypeScript compiles, build passes.

### Step 3 — Card replacement (Header, WorkExperience, EducationSection)

Replace hand-rolled `<article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">` patterns with `<Card><CardContent>` (or `<CardHeader>` / `<CardContent>` substructure). Three files, same structural pattern.

Gate: Visual parity — cards look equivalent to before or improved. No layout regressions on mobile or desktop.

### Step 4 — Badge replacement (TechStackIcons)

Replace zinc pill fallbacks and styled spans in `src/components/techstack-icons/TechStackIcons.tsx` with `<Badge variant="secondary">` or `<Badge variant="outline">`. The Devicons CDN icon elements remain unchanged — Badge wraps the pill text/fallback label only.

Gate: Tech stack section renders correctly. Both icon-present and fallback-pill cases handled.

### Step 5 — Separator (optional dividers)

Add `<Separator />` between sections or within card layouts where horizontal rules add visual structure. Since Separator has `"use client"`, verify it renders as a leaf inside Server Component files (it does — see boundary analysis above). No SSR errors or hydration warnings expected.

Gate: Dividers render, no console errors.

### Step 6 — Token unification pass (polish)

After all shadcn components are in place, audit remaining raw `text-zinc-*`, `border-zinc-*`, `text-indigo-*`, `bg-blue-*` classes. Map to shadcn semantic tokens (`text-foreground`, `text-muted-foreground`, `border`, `text-primary`) where appropriate for consistency. This is polish — no functional change.

---

## Architecture Diagram

```
page.tsx (Server Component)
│  reads resume.md via gray-matter
│  reads EMAIL/PHONE env vars
│
├── AnimateIn (Client — framer-motion)
│   └── Header (Server Component)
│         └── Card, CardContent           ← shadcn (no "use client")
│               └── name, title, contacts, bio (plain JSX)
│
├── AnimateIn (Client — framer-motion)
│   └── WorkExperience (Server Component)
│         └── Card, CardContent           ← shadcn (no "use client")
│               ├── LogoImage             ← existing (unchanged)
│               ├── HighlightedBullet     ← existing (unchanged)
│               └── TechStackIcons        ← existing wrapper (modified)
│                     └── Badge           ← shadcn (no "use client")
│                         or DevIcon      ← CDN (unchanged)
│
├── AnimateIn (Client — framer-motion)
│   └── EducationSection (Server Component)
│         └── Card, CardContent           ← shadcn (no "use client")
│
└── Separator (if used)                   ← shadcn ("use client", leaf node — fine)
```

---

## Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Keep section components as Server Components | Card and Badge have no `"use client"` — no boundary change required |
| Separator as leaf import inside Server Components | Server Components can import and render Client Component leaves without becoming Client Components |
| Manual globals.css merge instead of `shadcn init` rewrite | Prevents loss of Geist font variables and existing `@theme inline` setup |
| `rsc: true` in components.json | CLI auto-adds `"use client"` to components that need it (like Separator) |
| Parallel color systems during migration | Avoids big-bang token swap; existing zinc/indigo classes continue to work during incremental replacement |
| Source-copy model (shadcn adds to `src/components/ui/`) | No runtime package; full ownership; components can be customized without forking |

---

## Anti-Patterns to Avoid

### Converting section components to Client Components

There is no need. Card, Badge, and Separator all work inside Server Components. Adding `"use client"` to `WorkExperience.tsx` or `Header.tsx` is unnecessary and would increase client bundle size.

### Running `shadcn init` and accepting all file overwrites

The CLI will attempt to rewrite `globals.css`. The project already has a configured Tailwind v4 CSS setup with Geist font variables. Blindly accepting overwrites destroys those settings. Always merge manually or restore after CLI runs.

### Adding shadcn as a runtime npm dependency

shadcn is a source-copy tool — it adds component source files to your codebase. The `shadcn` package itself is a dev/CLI tool. Do not add it to `dependencies` in package.json, only `devDependencies` (or run via `npx`).

---

## Confidence Assessment

| Area | Confidence | Basis |
|------|------------|-------|
| Card/Badge have no "use client" | HIGH | Official shadcn docs: display-only components, no Radix dependency |
| Separator requires "use client" | HIGH | GitHub discussion #2562 with maintainer confirmation |
| Leaf node pattern (Server imports Client) | HIGH | React 19 + Next.js App Router documented behaviour |
| globals.css merge approach | HIGH | shadcn Tailwind v4 docs at ui.shadcn.com/docs/tailwind-v4 |
| AnimateIn pattern unaffected | HIGH | Direct codebase inspection of existing pattern |
| Build order | MEDIUM | Derived from dependency analysis; no single authoritative source |

---

## Sources

- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) — CSS variable structure and `@theme inline` integration
- [shadcn/ui Manual Installation](https://ui.shadcn.com/docs/installation/manual) — components.json and utils setup
- [shadcn/ui components.json reference](https://ui.shadcn.com/docs/components-json) — `rsc` flag, Tailwind v4 config path
- [Why does Separator need "use client"? — GitHub Discussion #2562](https://github.com/shadcn-ui/ui/discussions/2562) — Radix useEffect cause
- [Next.js Server and Client Components guide](https://nextjs.org/docs/app/getting-started/server-and-client-components) — leaf node boundary behaviour
- Context7 `/llmstxt/ui_shadcn_llms_txt` — shadcn/ui full documentation corpus
- Direct codebase inspection: `src/app/globals.css`, `src/app/page.tsx`, `src/components/*.tsx`

---

*Architecture research for: v4.0 shadcn/ui Full Design System Swap*
*Researched: 2026-04-24*
