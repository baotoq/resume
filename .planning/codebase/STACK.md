# Technology Stack

**Analysis Date:** 2026-04-12

## Languages

**Primary:**
- TypeScript 5.x - All source files in `src/` and configuration files
- CSS - `src/app/globals.css` using Tailwind v4 `@import "tailwindcss"` syntax

**Secondary:**
- JavaScript (allowJs: true in tsconfig) - permitted but not currently used

## Runtime

**Environment:**
- Node.js v25.9.0

**Package Manager:**
- npm 11.12.1
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.2.3 - Full-stack React framework using App Router. Config at `next.config.ts`
- React 19.2.4 - UI rendering
- React DOM 19.2.4 - DOM bindings

**Build/Dev:**
- Biome 2.2.0 - Linting and formatting (replaces ESLint + Prettier). Config at `biome.json`
- Tailwind CSS 4.x - Utility-first CSS via PostCSS. Config at `postcss.config.mjs`
- `@tailwindcss/postcss` ^4 - PostCSS integration for Tailwind v4
- TypeScript 5.x - Static typing. Config at `tsconfig.json`
- `babel-plugin-react-compiler` 1.0.0 - React Compiler Babel plugin (enabled via `reactCompiler: true` in `next.config.ts`)

## Key Dependencies

**Critical:**
- `next` 16.2.3 - Framework; note this is a breaking-change version beyond typical training data. Read `node_modules/next/dist/docs/` before touching framework APIs.
- `react` 19.2.4 - Concurrent features and React Compiler compatibility required
- `react-dom` 19.2.4 - Must match React version

**Infrastructure:**
- `next/font/google` - Used in `src/app/layout.tsx` to load Geist and Geist Mono fonts via Google Fonts CDN at build time
- `next/image` - Used in `src/app/page.tsx` for optimized image rendering

## Configuration

**TypeScript:**
- Strict mode enabled
- Path alias `@/*` maps to `./src/*`
- `moduleResolution: "bundler"` — use bundler-style imports
- `jsx: "react-jsx"` — no need to import React in every file
- Next.js plugin included under `plugins`

**Build:**
- `next.config.ts` — React Compiler enabled (`reactCompiler: true`)
- `postcss.config.mjs` — Tailwind v4 PostCSS plugin only, no other PostCSS plugins
- `biome.json` — 2-space indent, recommended rules, Next.js and React domain rules enabled, auto import organization on

**Tailwind:**
- v4 syntax: configured entirely via CSS `@import "tailwindcss"` and `@theme inline` blocks in `src/app/globals.css`; no `tailwind.config.*` file

## Platform Requirements

**Development:**
- Node.js 25.x
- `npm run dev` — starts Next.js dev server

**Production:**
- `npm run build` then `npm run start`
- Intended for Vercel deployment (Vercel branding in default page, Vercel template links present)

---

*Stack analysis: 2026-04-12*
