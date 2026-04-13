# Technology Stack

**Analysis Date:** 2026-04-13

## Languages

**Primary:**
- TypeScript 5.x - All source files under `src/`, all config files (`next.config.ts`, `postcss.config.mjs`)

**Secondary:**
- CSS (Tailwind v4 syntax) - `src/app/globals.css`
- YAML frontmatter (in Markdown) - `src/data/resume.md`

## Runtime

**Environment:**
- Node.js 22 (pinned in `.github/workflows/deploy.yml`)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.2.3 - App Router, configured for static export (`output: "export"`)
- React 19.2.4 - UI rendering
- React DOM 19.2.4 - DOM binding

**Animation:**
- Framer Motion 12.38.0 - Entrance animations; used only in `src/components/AnimateIn.tsx`

**Build/Dev:**
- Tailwind CSS v4 - Utility-first styling configured entirely via `src/app/globals.css` and `postcss.config.mjs`; no `tailwind.config.*` file
- `@tailwindcss/postcss` v4 - PostCSS plugin for Tailwind v4
- Biome 2.2.0 - Linting and formatting (replaces ESLint + Prettier); config at `biome.json`
- TypeScript 5.x - Strict type checking; config at `tsconfig.json`

**Compiler:**
- React Compiler (babel-plugin-react-compiler 1.0.0) - Enabled via `reactCompiler: true` in `next.config.ts`; automatic memoization, no manual `useMemo`/`useCallback` needed

## Key Dependencies

**Critical:**
- `gray-matter` 4.0.3 - Parses YAML frontmatter from `src/data/resume.md` into structured `ResumeData` at build time in `src/app/page.tsx`
- `next/font/google` (built into Next.js) - Self-hosted Geist Sans and Geist Mono fonts, loaded in `src/app/layout.tsx`
- `framer-motion` 12.38.0 - Required for animated section entrances; note this is a Client Component boundary

## Configuration

**Environment:**
- No `.env` file committed to repository
- Two optional `NEXT_PUBLIC_*` vars read in `src/app/page.tsx`:
  - `NEXT_PUBLIC_EMAIL` - Rendered as `mailto:` link in Header; defaults to `""`
  - `NEXT_PUBLIC_PHONE` - Rendered as `tel:` link in Header; defaults to `""`
- Both are conditionally rendered — omitting them produces a valid build with no contact links shown

**Build:**
- `next.config.ts` - `output: "export"`, `basePath: "/resume"`, `reactCompiler: true`
- `tsconfig.json` - Strict mode, path alias `@/*` → `./src/*`, `moduleResolution: "bundler"`
- `biome.json` - 2-space indent, recommended rules, Next.js and React domain rules, auto import organization
- `postcss.config.mjs` - Single plugin: `@tailwindcss/postcss`

**Tailwind:**
- v4 syntax: configured via `@import "tailwindcss"` and `@theme inline` in `src/app/globals.css`; CSS custom property tokens (`--font-sans`, `--font-mono`, `--color-background`, `--color-foreground`) defined there

## Platform Requirements

**Development:**
- Node.js 22
- `npm install` then `npm run dev`

**Production:**
- Static export to `out/` directory via `npm run build`
- Deployed to GitHub Pages at `/<username>/resume` path
- No server runtime required — fully static HTML/CSS/JS bundle

---

*Stack analysis: 2026-04-13*
