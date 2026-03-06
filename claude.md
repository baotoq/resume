# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal resume/portfolio website for To Quoc Bao (Senior Software Engineer). Static single-page Next.js app deployed to GitHub Pages at `https://baotoq.github.io/resume`.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Static export build (outputs to /out)
npm run lint     # Biome check (linting + formatting validation)
npm run format   # Biome format --write (auto-fix formatting)
```

No test runner is configured. QA is `npm run lint` + `npm run build` + manual browser check.

## Architecture

**Stack**: Next.js 16, React 19, TypeScript 5, Tailwind CSS v4, Ant Design v6 (icons only), Biome 2.x

**Static export**: `next.config.ts` sets `output: "export"` for GitHub Pages. No server components with data fetching, no API routes. `basePath` and `assetPrefix` are `/resume` in production.

**Single route**: App Router with one page at `src/app/page.tsx` (client component). All resume sections render on this page.

**Data layer**: All content lives in `src/data/resume.ts` as typed TypeScript exports — no CMS, no API calls.

**Theme system**: CSS custom properties in `globals.css` define light/dark palettes. `next-themes` manages the `.dark` class on `<html>`. Tailwind v4 maps CSS vars via `@theme inline` directive (no `tailwind.config.*` file).

**Custom text markup** in experience descriptions: `**bold**` → `<strong>`, `@@tech@@` → accent-colored `<span>`. Parsed by `parseTextWithHighlights()` in `Experience.tsx`.

**PDF export**: `react-to-print` triggers browser print on `#resume-content`. Print styles in `src/styles/print.css`.

## Key Conventions

- **Named exports only** — no default exports for components
- **`"use client"` only where needed** — interactivity (useState, event handlers)
- **Path alias**: `@/*` → `./src/*`
- **Component props**: interface suffix `Props`, destructured in function signature
- **File naming**: PascalCase components, camelCase data/utils, kebab-case styles
- **Type imports**: `import type { X }` for interfaces
- **Tailwind class order**: layout → spacing → sizing → colors → typography → effects → states
- **No `I` prefix** on interfaces

## Project Structure (key paths)

```
src/app/layout.tsx        # Root layout: fonts, metadata, ThemeProvider + AntdRegistry
src/app/page.tsx          # Main page: assembles all resume sections
src/app/globals.css       # Theme variables + Tailwind @theme inline config
src/components/resume/    # Domain components: Header, Summary, Experience, Education, Skills, Section
src/components/ui/        # PDFExportButton, ThemeToggle
src/components/providers/ # ThemeProvider wrapper
src/data/resume.ts        # All resume content data
src/types/resume.ts       # TypeScript interfaces for data structures
src/styles/print.css      # @media print styles
public/logos/             # Company logo PNGs
```

## Planning System

Project uses structured planning in `.planning/` with roadmap phases. Check `.planning/STATE.md` for current progress and `.planning/ROADMAP.md` for the full plan. Phases 1-3 (theme, visual refresh, company logos) are complete; phases 4-8 remain.
