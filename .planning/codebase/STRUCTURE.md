# Codebase Structure

**Analysis Date:** 2026-04-12

## Directory Layout

```
resume/                      # Project root
├── src/                     # All application source code
│   └── app/                 # Next.js App Router routes and layouts
│       ├── favicon.ico      # Browser favicon
│       ├── globals.css      # Global styles and Tailwind v4 base
│       ├── layout.tsx       # Root layout (wraps all routes)
│       └── page.tsx         # Home page route (/)
├── types/                   # Auto-generated Next.js type declarations (do not edit)
│   ├── cache-life.d.ts      # cacheLife() profile types for "use cache"
│   ├── routes.d.ts          # Route/param type map, PageProps/LayoutProps globals
│   └── validator.ts         # Export shape validators for pages and layouts
├── public/                  # Static assets served from /
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── .planning/               # GSD planning documents
│   └── codebase/            # Codebase analysis documents
├── .next/                   # Next.js build output (generated, do not commit)
├── node_modules/            # Dependencies (generated)
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── biome.json               # Biome linter/formatter configuration
├── postcss.config.mjs       # PostCSS config (Tailwind v4 plugin)
├── package.json             # Dependencies and scripts
└── next-env.d.ts            # Next.js TypeScript env types (generated)
```

## Directory Purposes

**`src/app/`:**
- Purpose: App Router route segments — every folder is a route segment, every `page.tsx` is a publicly accessible route
- Contains: Layouts, pages, error boundaries, loading states, route groups
- Key files: `layout.tsx` (root shell), `page.tsx` (home route)

**`types/`:**
- Purpose: Next.js auto-generated type declarations. Regenerated on `next build` and `next dev`
- Contains: Typed route maps, page/layout prop validators, cache API types
- Generated: Yes — do not edit manually

**`public/`:**
- Purpose: Static assets accessible at the root URL path (e.g., `/next.svg`)
- Contains: SVG icons and images
- Generated: No — commit all files here

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout — rendered for every route
- `src/app/page.tsx`: Home page at `/`

**Configuration:**
- `next.config.ts`: Next.js feature flags (React Compiler enabled)
- `tsconfig.json`: TypeScript settings; path alias `@/*` → `src/*`
- `biome.json`: Linter (Biome recommended + Next.js + React domains) and formatter (2-space indent)
- `postcss.config.mjs`: Tailwind v4 PostCSS integration

**Styles:**
- `src/app/globals.css`: Global CSS custom properties and Tailwind v4 import

**Types (auto-generated):**
- `types/routes.d.ts`: Global `PageProps<Route>` and `LayoutProps<Route>` type helpers
- `types/cache-life.d.ts`: `cacheLife()` profile overloads for `"use cache"` directive
- `types/validator.ts`: Compile-time shape checks for page/layout exports

## Naming Conventions

**Files:**
- Route pages: `page.tsx` (required name by Next.js)
- Route layouts: `layout.tsx` (required name by Next.js)
- Error boundaries: `error.tsx` (required name by Next.js)
- Loading states: `loading.tsx` (required name by Next.js)
- Components: PascalCase filename matching component name (e.g., `ResumeCard.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Styles: `globals.css` or module files `Component.module.css`

**Directories:**
- Route segments: kebab-case (e.g., `work-experience/`)
- Route groups (no URL impact): parentheses notation `(group)/`
- Private folders (not a route): underscore prefix `_components/`

## Where to Add New Code

**New Page Route:**
- Create `src/app/[route-name]/page.tsx` with a default export component
- Create `src/app/[route-name]/layout.tsx` if the route needs its own shell
- Use `PageProps<'/route-name'>` from the global type for props typing (auto-generated in `types/routes.d.ts` after build)

**New Shared Component:**
- Implementation: `src/components/ComponentName.tsx` (create `src/components/` directory)
- Prefer Server Components (no `"use client"`) unless interactivity requires it

**New Client Component:**
- Add `"use client"` directive at the top of the file
- Place in `src/components/` alongside server components

**New Utility/Helper:**
- Shared utilities: `src/lib/helperName.ts` (create `src/lib/` directory)
- Route-specific utilities: co-locate in the route's directory

**New Static Asset:**
- Place in `public/` — accessible at `/<filename>` URL path
- Reference via `next/image` `<Image>` component for optimization

**Path Alias:**
- Use `@/` to import from `src/`: `import { foo } from "@/lib/foo"`

## Special Directories

**`.next/`:**
- Purpose: Next.js build cache and output
- Generated: Yes
- Committed: No (in `.gitignore`)

**`.planning/`:**
- Purpose: GSD planning and codebase analysis documents
- Generated: No
- Committed: Yes

**`types/`:**
- Purpose: Auto-generated Next.js TypeScript declarations — regenerated during dev/build
- Generated: Yes (by Next.js)
- Committed: Yes (needed for type checking in CI without a build step)

---

*Structure analysis: 2026-04-12*
