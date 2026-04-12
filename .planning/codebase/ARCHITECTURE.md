# Architecture

**Analysis Date:** 2026-04-12

## Pattern Overview

**Overall:** Next.js App Router single-page application (SPA scaffold)

**Key Characteristics:**
- File-system based routing via Next.js App Router (`src/app/`)
- React Server Components as the default component model
- React Compiler enabled (`reactCompiler: true` in `next.config.ts`) — automatic memoization, no manual `useMemo`/`useCallback` needed
- Single route (`/`) — currently a scaffold/starter with no application logic implemented
- Tailwind CSS v4 for styling (imported via `@import "tailwindcss"` in CSS, not `@tailwind` directives)

## Layers

**Routing / Page Layer:**
- Purpose: Defines URL routes and their React component trees
- Location: `src/app/`
- Contains: `page.tsx` (route components), `layout.tsx` (shared shell)
- Depends on: Next.js runtime, React
- Used by: End users via the browser

**Layout Shell:**
- Purpose: Wraps all pages with HTML document structure, fonts, and global styles
- Location: `src/app/layout.tsx`
- Contains: Root `<html>` and `<body>`, font variable injection, metadata export
- Depends on: `next/font/google` (Geist Sans, Geist Mono), `globals.css`
- Used by: All page routes automatically by Next.js

**Styles:**
- Purpose: Global CSS custom properties, Tailwind v4 base, dark mode theming
- Location: `src/app/globals.css`
- Contains: `--background` / `--foreground` CSS variables, `@theme inline` Tailwind token overrides
- Depends on: Tailwind CSS v4 PostCSS plugin
- Used by: `layout.tsx` via direct import

**Type Declarations (Generated):**
- Purpose: Auto-generated Next.js type safety for routes, page props, and cache APIs
- Location: `types/`
- Contains: `routes.d.ts` (route/param maps), `validator.ts` (page/layout export shape checks), `cache-life.d.ts` (`cacheLife` profiles for `"use cache"`)
- Depends on: Next.js build process — do not edit manually
- Used by: TypeScript compiler for type checking across the app

## Data Flow

**Page Request:**

1. Browser requests `/`
2. Next.js matches route to `src/app/page.tsx`
3. Root layout `src/app/layout.tsx` wraps the page component
4. Server renders HTML (React Server Component by default)
5. Response delivered; client hydrates if needed

**State Management:**
- No client-side state management library present
- React Server Components handle rendering server-side
- React Compiler handles automatic client-side memoization when client components are introduced

## Key Abstractions

**RootLayout:**
- Purpose: Persistent shell applied to every route
- Location: `src/app/layout.tsx`
- Pattern: Named export `metadata`, default export `RootLayout` function accepting `children: React.ReactNode`

**Page Component:**
- Purpose: Route-specific UI
- Location: `src/app/page.tsx`
- Pattern: Default export server component function, no props for root route

**Global Type Helpers (auto-generated):**
- Purpose: Provide typed `PageProps<Route>` and `LayoutProps<Route>` generics for use in page/layout files
- Location: `types/routes.d.ts`
- Pattern: Declared globally — use as `PageProps<'/'>` in component signatures

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every HTTP request to any route
- Responsibilities: HTML shell, font loading, global CSS, metadata defaults

**Home Page:**
- Location: `src/app/page.tsx`
- Triggers: HTTP GET `/`
- Responsibilities: Renders the root page UI

**Next.js Config:**
- Location: `next.config.ts`
- Triggers: Build and dev server startup
- Responsibilities: Enables React Compiler, Next.js feature flags

## Error Handling

**Strategy:** Not yet implemented (scaffold state)

**Patterns:**
- No `error.tsx` boundary files present
- No `not-found.tsx` present
- Add `src/app/error.tsx` for route-level error boundaries
- Add `src/app/not-found.tsx` for 404 handling

## Cross-Cutting Concerns

**Logging:** None — no logging library configured
**Validation:** None — no runtime validation library present
**Authentication:** None — no auth provider configured

---

*Architecture analysis: 2026-04-12*
