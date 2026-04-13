# Architecture

**Analysis Date:** 2026-04-13

## Pattern Overview

**Overall:** Next.js App Router static site — single route, data-driven from a local Markdown file, deployed as a fully pre-rendered static export.

**Key Characteristics:**
- Single route (`/`) — all content rendered from one page
- React Server Components by default; Client Components used only where browser APIs or animation are required
- Resume content decoupled from code — stored as YAML frontmatter in `src/data/resume.md`, parsed at build time
- React Compiler enabled — automatic memoization; no manual `useMemo`/`useCallback`
- Static export (`output: "export"`) — no server runtime; output is plain HTML/CSS/JS in `out/`

## Layers

**Route / Page Layer:**
- Purpose: Reads resume data from the filesystem, resolves contact env vars, composes the page from section components
- Location: `src/app/page.tsx`
- Contains: Data loading (`fs.readFileSync` + `gray-matter`), env var resolution, component composition
- Depends on: `src/data/resume.md`, `src/types/resume.ts`, `src/components/*`
- Used by: Next.js App Router at the `/` route

**Layout Shell:**
- Purpose: HTML document shell applied to every route; loads fonts and global styles
- Location: `src/app/layout.tsx`
- Contains: Root `<html>` / `<body>`, Geist font variables injected as CSS custom properties, `metadata` export
- Depends on: `next/font/google`, `src/app/globals.css`
- Used by: Next.js App Router — wraps all pages automatically

**Section Components:**
- Purpose: Render individual resume sections; pure presentational Server Components
- Location: `src/components/Header.tsx`, `src/components/WorkExperience.tsx`, `src/components/Skills.tsx`
- Contains: Typed props interfaces, JSX markup, Tailwind utility classes
- Depends on: `src/types/resume.ts`
- Used by: `src/app/page.tsx`

**Client Components:**
- Purpose: Provide browser-side behaviour (animations, image error handling)
- Location: `src/components/AnimateIn.tsx`, `src/components/LogoImage.tsx`
- Contains: `"use client"` directive, React state hooks, Framer Motion
- Depends on: `framer-motion` (AnimateIn), React `useState` (LogoImage)
- Used by: `src/app/page.tsx` (AnimateIn wraps each section), `src/components/WorkExperience.tsx` (LogoImage per entry)

**Data Layer:**
- Purpose: Single source of truth for all resume content
- Location: `src/data/resume.md`
- Contains: YAML frontmatter only — no Markdown body is used; fields map directly to `ResumeData` interface
- Depends on: Nothing
- Used by: `src/app/page.tsx` via `gray-matter`

**Type Definitions:**
- Purpose: TypeScript contracts for resume data shapes
- Location: `src/types/resume.ts`
- Contains: `ExperienceEntry`, `ResumeData` interfaces
- Depends on: Nothing
- Used by: `src/app/page.tsx`, `src/components/Header.tsx`, `src/components/WorkExperience.tsx`

**Styles:**
- Purpose: Global CSS custom properties and Tailwind v4 base
- Location: `src/app/globals.css`
- Contains: `--background`/`--foreground` vars, `@theme inline` font and colour token bindings
- Depends on: Tailwind CSS v4 PostCSS plugin
- Used by: `src/app/layout.tsx` via direct import

## Data Flow

**Page Build (static export):**

1. `npm run build` triggers Next.js static generation
2. `src/app/page.tsx` runs on the server/build node process
3. `fs.readFileSync("src/data/resume.md")` reads the Markdown file
4. `gray-matter` parses the YAML frontmatter into a plain object
5. Object is cast to `ResumeData` (no runtime validation)
6. `NEXT_PUBLIC_EMAIL` and `NEXT_PUBLIC_PHONE` env vars are read
7. `<Header>`, `<WorkExperience>`, `<Skills>` receive typed props; each wrapped in `<AnimateIn>`
8. Pre-rendered HTML written to `out/index.html`

**Browser Rendering:**
1. Browser loads static HTML from GitHub Pages
2. React hydrates client components (`AnimateIn`, `LogoImage`)
3. Framer Motion drives entrance animations as sections enter the viewport

**State Management:**
- No global state — all data is props-drilled from `page.tsx` down to leaf components
- Only local state: `LogoImage` uses `useState(false)` to track image load errors

## Key Abstractions

**`ResumeData` / `ExperienceEntry`:**
- Purpose: Typed contracts between the YAML data file and rendering components
- Location: `src/types/resume.ts`
- Pattern: Plain TypeScript interfaces; cast (not validated) in `src/app/page.tsx`

**`AnimateIn`:**
- Purpose: Reusable entrance animation wrapper — wraps any subtree in a Framer Motion `div`
- Location: `src/components/AnimateIn.tsx`
- Pattern: Client Component accepting `children` and optional `delay` prop; `whileInView` fires once per element

**`LogoImage`:**
- Purpose: Resilient image component — renders company logo or falls back to a generic building icon
- Location: `src/components/LogoImage.tsx`
- Pattern: Client Component; `onError` sets error state, triggers fallback SVG

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every request to any route
- Responsibilities: HTML shell, font CSS variable injection, global styles, page `<title>` and description metadata

**Home Page:**
- Location: `src/app/page.tsx`
- Triggers: HTTP GET `/` (or static `index.html` load)
- Responsibilities: Read resume data, resolve env vars, compose and render all sections

**Next.js Config:**
- Location: `next.config.ts`
- Triggers: `next build` / `next dev` startup
- Responsibilities: Static export mode, base path `/resume`, React Compiler activation

**Resume Data:**
- Location: `src/data/resume.md`
- Triggers: Edited by the site owner to update resume content
- Responsibilities: Single source of truth for all displayed content; changes require a rebuild

## Error Handling

**Strategy:** Minimal — the site is static content with no user input or API calls.

**Patterns:**
- `LogoImage` handles image load failure via `useState` + `onError` fallback to inline SVG
- No `error.tsx` boundary file present
- No `not-found.tsx` present
- `ResumeData` cast is unchecked — malformed `resume.md` YAML will cause a runtime type error at build time

## Cross-Cutting Concerns

**Logging:** None — no logging library configured
**Validation:** None — `gray-matter` output is cast directly to `ResumeData` without runtime validation
**Authentication:** None — public static site, no auth required

---

*Architecture analysis: 2026-04-13*
