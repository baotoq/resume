# Technology Stack — Resume/CV Page

**Project:** Resume/CV web page
**Researched:** 2026-04-12
**Research mode:** Ecosystem — what's the standard 2025 stack for a resume page with PDF export

---

## Existing Stack (Do Not Change)

| Technology | Version | Role |
|------------|---------|------|
| Next.js | 16.2.3 | Framework (App Router) |
| React | 19.2.4 | UI rendering |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Biome | 2.2.0 | Lint + format |

Tailwind v4 constraint: configuration is CSS-only (`@import "tailwindcss"` in CSS, no `tailwind.config.*`). The default palette uses `oklch` color space — this matters for PDF generation library choice (see below).

---

## v1.1 Stack Additions — Company Logos + Vertical Timeline

**Researched:** 2026-04-13
**Confidence:** HIGH (verified against Next.js 16 docs in `node_modules/next/dist/docs/` and existing source files)

### Verdict: Zero New Dependencies

Both v1.1 features (company logos with fallback, vertical timeline) are achievable with the existing stack. No packages should be added.

---

### Feature 1: Company Logo Display with Fallback

**Decision: Plain `<img>` tag. Do not use `next/image`.**

`next/image` with remote URLs is **unsupported** under `output: 'export'` with the default loader. This is explicitly listed as an unsupported feature in the Next.js 16 static export docs (`node_modules/next/dist/docs/01-app/02-guides/static-exports.md`, line 289). Company logo URLs come from `resume.md` at build time — they are remote URLs served from CDNs (Clearbit, company sites). The default image optimizer does not run on GitHub Pages. Using `next/image` here would break silently in production.

Workarounds (`unoptimized: true` globally, custom Cloudinary loader) add configuration complexity with zero benefit for small logo images.

**Use `<img>` with `onError` for fallback:**

```tsx
const [imgError, setImgError] = React.useState(false)

{entry.logo_url && !imgError ? (
  <img
    src={entry.logo_url}
    alt={`${entry.company} logo`}
    width={32}
    height={32}
    loading="lazy"
    onError={() => setImgError(true)}
    className="rounded object-contain"
  />
) : (
  <BriefcaseIcon className="w-8 h-8 text-zinc-400" />
)}
```

**Fallback icon: Inline SVG component, no icon library.**

Pulling in `lucide-react` or `@heroicons/react` for a single briefcase icon adds ~20–40KB to the bundle. Use a small `<BriefcaseIcon>` component with the SVG path inlined directly — approximately 15 lines of TSX.

**Client component requirement:**

`onError` and `useState` require a Client Component. The current `WorkExperience.tsx` is a Server Component. The correct pattern (consistent with the existing `AnimateIn` approach) is to extract a `CompanyLogo` Client Component (`'use client'`). The list and cards remain server-rendered; only the logo element is a client island.

**Type change required:**

Add `logo_url?: string` to `ExperienceEntry` in `src/types/resume.ts`. The field is optional — entries without it render the briefcase fallback.

| Layer | Change |
|-------|--------|
| Rendering | `<img>` tag (no change to build config) |
| Fallback icon | New `BriefcaseIcon` inline SVG component (~15 lines) |
| Client interactivity | New `CompanyLogo.tsx` client component |
| Type system | `logo_url?: string` added to `ExperienceEntry` |
| Build / deploy | No change — static export compatible |

---

### Feature 2: Vertical Timeline Layout

**Decision: Pure Tailwind v4 CSS. No new packages.**

Tailwind CSS 4.2.2 (confirmed installed) fully supports all utilities needed:

- `relative` / `absolute` positioning
- Arbitrary values: `w-[2px]`, `left-[15px]`, `h-[calc(100%-2rem)]`
- Pseudo-elements: `before:content-['']`, `before:absolute`, `before:rounded-full`
- `z-index` utilities for layering dot above line

The existing `WorkExperience.tsx` already uses the `before:` pseudo-element pattern for bullet dots (lines 39–41). The timeline dot is the same pattern applied to the entry wrapper; the line is an absolutely-positioned `<div>` or `before:` on the list container.

Implementation approach: wrap the entry list in a `relative` container; add the line as a child `<div className="absolute left-4 top-0 bottom-0 w-[2px] bg-zinc-200">` (or similar); each `<article>` gets a dot via a positioned element at `left-0`.

| Layer | Change |
|-------|--------|
| Timeline line | `<div>` with `absolute` + `w-[2px]` inside `relative` wrapper |
| Entry dot | Positioned element or `before:` pseudo on each entry |
| CSS config | No change to `globals.css` or any config file |

---

### Full Stack Delta for v1.1

| Area | Change |
|------|--------|
| `package.json` dependencies | **None** |
| `next.config.ts` | **None** |
| `globals.css` | **None** |
| `src/types/resume.ts` | Add `logo_url?: string` to `ExperienceEntry` |
| New files | `src/components/CompanyLogo.tsx` (client component) |
| Modified files | `src/components/WorkExperience.tsx` (timeline layout + logo slot) |

---

### Alternatives Rejected for v1.1

| Option | Reason Rejected |
|--------|----------------|
| `next/image` for logos | Unsupported with `output: 'export'` default loader — breaks on GitHub Pages. Confirmed in Next.js 16 docs. |
| `next/image` + `unoptimized: true` globally | Disables optimization project-wide; adds config for zero benefit on small logo images |
| `lucide-react` for briefcase icon | ~40KB bundle cost for one icon; inline SVG is 15 lines and zero cost |
| `@heroicons/react` | Same as lucide-react |
| Third-party timeline library | A left border + dot is 5 Tailwind classes; a library is unjustified |

---

### Sources (v1.1)

- Next.js 16 static export unsupported features: `node_modules/next/dist/docs/01-app/02-guides/static-exports.md` line 289
- Next.js 16 `<Image>` unoptimized prop: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` lines 391–415
- Tailwind CSS version: `node_modules/tailwindcss/package.json` — 4.2.2
- Existing pseudo-element pattern: `src/components/WorkExperience.tsx` lines 39–41
- Client component pattern reference: `src/components/AnimateIn.tsx`
- `next.config.ts`: `output: 'export'`, `basePath: '/resume'` confirmed active

---

## PDF Generation

### Recommendation: `jspdf` + `html2canvas-pro`

**Confidence: MEDIUM** (verified via npm, multiple sources; React 19 compatibility confirmed for jspdf 4.x; html2canvas-pro compatibility with oklch confirmed)

| Library | Version | Purpose |
|---------|---------|---------|
| `jspdf` | 4.2.1 | Builds the PDF document client-side |
| `html2canvas-pro` | latest | Renders the DOM section to canvas before jspdf embeds it |

**Why jspdf over `@react-pdf/renderer`:**

`@react-pdf/renderer` requires you to re-implement your entire layout using its own primitive components (`<View>`, `<Text>`, `<Image>`). This means maintaining two separate layout trees — one for the web and one for PDF. The project constraint is "PDF must match the web design — not a separate layout." jspdf captures the actual rendered DOM, so the PDF output is derived directly from the live web layout with zero duplication.

**Why `html2canvas-pro` over `html2canvas`:**

Tailwind CSS v4 switched its color palette from RGB to `oklch`. The original `html2canvas` (v1.4.1, last meaningful release 2022, maintenance-only) throws `Error: Attempting to parse an unsupported color function 'oklch'` on Tailwind v4 pages. `html2canvas-pro` is a maintained fork that explicitly adds `oklch`, `oklab`, `lch`, `lab`, and `color()` support. Since this project uses Tailwind v4, `html2canvas-pro` is the correct dependency — using `html2canvas` will produce broken screenshots.

**Why not `window.print()` / `@media print`:**

Browser print dialogs produce inconsistent output across Chrome, Safari, and Firefox. Margins, page breaks, and fonts vary by OS print driver. A download button that calls `window.print()` forces the user through a system dialog with no control over filename or PDF settings. jspdf produces a named `.pdf` file download with no dialog friction, which is the expected UX for a recruiter-facing download button.

**Why not `@react-pdf/renderer` at all:**

It is the right tool for invoice/report generation from scratch. It is the wrong tool when you need "this web page, as a PDF." It also requires a separate font registration step and cannot embed Tailwind CSS styles — you would write all layout and typography twice.

**SSR note:** Both jspdf and html2canvas-pro are browser-only. The download button must be in a `"use client"` component and the libraries should be dynamically imported inside the click handler to avoid the Next.js SSR `window is not defined` error. Do not put these imports at module scope.

```bash
npm install jspdf html2canvas-pro
```

---

## Fonts / Typography

### Recommendation: Keep existing Geist + add Inter for resume body

**Confidence: HIGH** (Inter is the dominant UI font for developer tooling; both are available via `next/font/google`; ATS compatibility confirmed)

| Font | Usage | Load Method |
|------|-------|-------------|
| `Inter` (variable) | Resume body text — experience entries, skills, dates | `next/font/google` |
| `Geist Mono` | Code/tech stack badges, monospaced details | Already configured in `layout.tsx` |

**Why Inter for body:**

Inter is the de-facto standard for developer-facing UI and SWE resumes. It was designed specifically for screen legibility at small sizes and exports cleanly to PDF as selectable vector text (not rasterized). ATS parsers can read it correctly. The variable font file covers weights 100–900 in a single request.

Geist (the current font) is visually similar to Inter and is fine. The tradeoff: Geist has lower recognition among hiring managers who visually scan hundreds of resumes; Inter reads as "clean and professional" without any visual novelty. Either is acceptable — use Inter if you want the safest ATS-friendly choice, keep Geist if brand consistency matters more.

**Font loading pattern:**

```typescript
// next/font/google self-hosts the font at build time — no Google CDN request at runtime
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: "variable", // loads all weights in one file
  display: "swap",
});
```

**PDF font embedding note:**

jspdf + html2canvas-pro captures text as a canvas raster, not embedded vector text. This means PDF text is not selectable or ATS-parseable when using the canvas approach. If ATS compatibility in the PDF matters, the alternative is to use `window.print()` with polished `@media print` CSS — browsers embed fonts as vector when printing to PDF. See the Print CSS section below for this path.

---

## Print CSS Optimization

### Recommendation: Always include `@media print` styles regardless of PDF approach

**Confidence: HIGH** (standard web practice, no library dependency)

Even if jspdf is used for the download button, clean `@media print` styles should be written so that users who use Ctrl+P / Cmd+P get a usable output. Also serves as the foundation if you later switch to a print-to-PDF approach.

Key `@media print` rules to include in `globals.css`:

```css
@media print {
  /* Remove UI chrome */
  header, footer, nav, .no-print { display: none !important; }

  /* Enforce paper margins */
  @page { margin: 0.75in; }

  /* Prevent section breaks mid-entry */
  .resume-entry { page-break-inside: avoid; break-inside: avoid; }

  /* Force white background, black text — some browsers print background-color: transparent */
  body { background: white !important; color: black !important; }

  /* Ensure links print their URL */
  a[href]::after { content: " (" attr(href) ")"; }
}
```

No third-party library is needed for print CSS. It is native CSS.

---

## Animation / Scroll

### Recommendation: `motion` (the rebranded Framer Motion)

**Confidence: HIGH** (npm latest confirmed 12.38.0; React 19 officially supported; import path change is the only migration needed)

| Library | Version | Purpose |
|---------|---------|---------|
| `motion` | 12.38.0 | Scroll-triggered entry animations, subtle hover effects |

**Why motion (not `framer-motion`):**

Framer Motion was rebranded to `motion` in 2025 when it became an independent project. The `framer-motion` package still exists on npm but is no longer actively developed. The `motion` package is the active successor. Import path is `motion/react` instead of `framer-motion`. API is otherwise identical — no rewrite required.

React 19 is fully supported as of `motion` v12. The React Compiler (enabled in this project via `reactCompiler: true` in `next.config.ts`) can auto-memoize motion components.

**Why motion over alternatives:**

- `react-spring`: Comparable power but more complex API for scroll-linked effects. No strong reason to prefer it here.
- `AOS` (Animate on Scroll): CSS class-toggling library, not React-native, harder to type-check, no spring physics.
- GSAP: Significantly more powerful than needed for a single-page resume. License is commercial for some features. Overkill.
- CSS transitions only: Viable for minimal polish but no scroll-triggered entry animations without JavaScript.

**Appropriate usage for a resume page (conservative):**

Use motion sparingly. A resume is a professional document, not a portfolio showcase. Recommended pattern:

- Fade-in + slight slide-up on section entry (`whileInView`, `once: true`)
- No parallax, no stagger chains longer than 3 items
- No animations that delay the recruiter from reading content

```typescript
import { motion } from "motion/react";

// Section entry — runs once when scrolled into view
<motion.section
  initial={{ opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-60px" }}
  transition={{ duration: 0.4, ease: "easeOut" }}
>
```

```bash
npm install motion
```

---

## Alternatives Considered

| Category | Recommended | Rejected | Reason Rejected |
|----------|-------------|----------|-----------------|
| PDF | `jspdf` + `html2canvas-pro` | `@react-pdf/renderer` | Requires duplicate layout in PDF primitives; violates "PDF matches web design" constraint |
| PDF | `jspdf` + `html2canvas-pro` | `html2canvas` (original) | Breaks on Tailwind v4 oklch colors |
| PDF | `jspdf` + `html2canvas-pro` | `window.print()` only | Inconsistent cross-browser output, no filename control, dialog friction |
| Animation | `motion` | `framer-motion` | Deprecated; `motion` is the active package |
| Animation | `motion` | GSAP | Overkill for a single-page resume; commercial licensing complexity |
| Animation | `motion` | CSS only | No scroll-triggered entry animations without JS |
| Fonts | Inter variable | Geist (existing) | Geist is acceptable; Inter is marginally safer for ATS and recruiter recognition |

---

## Installation Summary

```bash
# PDF generation (browser-only, client component only)
npm install jspdf html2canvas-pro

# Animation
npm install motion
```

No additional dependencies are needed. Fonts are loaded via the existing `next/font/google` infrastructure.

---

## Open Questions / Flags for Phase Research

1. **jspdf canvas text selectability**: The html2canvas approach rasterizes text. If the client later wants the PDF to have selectable/searchable text, the architecture shifts to `@media print` + `window.print()` or a server-side puppeteer approach. Confirm requirements before building the download button.

2. **motion bundle size**: The `motion` package adds ~35KB gzipped. For a static resume page this is acceptable, but if the page is meant to load in under 1s on mobile, consider whether animations are worth the tradeoff. Lazy-loading the motion import is possible.

3. **Next.js 16 specifics**: Read `node_modules/next/dist/docs/01-app/` before touching App Router APIs. Dynamic imports (`next/dynamic`) and the `"use client"` boundary behavior may differ from Next.js 14/15 training data.

---

## Sources

- [@react-pdf/renderer npm](https://www.npmjs.com/package/@react-pdf/renderer) — v4.4.1, React 19 supported since v4.1.0 (MEDIUM confidence)
- [jspdf npm](https://www.npmjs.com/package/jspdf) — v4.2.1 latest (MEDIUM confidence)
- [html2canvas-pro npm](https://www.npmjs.com/package/html2canvas-pro) — oklch support confirmed (MEDIUM confidence)
- [html2canvas oklch issue](https://github.com/niklasvh/html2canvas/issues/3235) — Tailwind v4 incompatibility (HIGH confidence)
- [Tailwind html2canvas text shift](https://hanki.dev/tailwind-html2canvas-text-shift-down/) — known Tailwind/html2canvas rendering bug (MEDIUM confidence)
- [motion npm](https://www.npmjs.com/package/motion) — v12.38.0, rebranded from framer-motion (HIGH confidence)
- [motion/react upgrade guide](https://motion.dev/docs/react-upgrade-guide) — migration from framer-motion confirmed (HIGH confidence)
- [motion React 19 support](https://motion.dev/docs/react) — officially supported (HIGH confidence)
- [Inter Google Fonts](https://fonts.google.com/specimen/Inter) — variable font, ATS-safe (HIGH confidence)
- [Next.js font optimization](https://nextjs.org/docs/app/getting-started/fonts) — next/font/google self-hosting (HIGH confidence)
- [JS PDF library comparison 2025](https://dmitriiboikov.com/posts/2025/01/pdf-generation-comarison/) — ecosystem overview (MEDIUM confidence)
- [Print CSS MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing) — @media print patterns (HIGH confidence)
- Next.js 16 static export unsupported features: `node_modules/next/dist/docs/01-app/02-guides/static-exports.md` line 289 (HIGH confidence)
- Next.js 16 `<Image>` unoptimized prop: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` lines 391–415 (HIGH confidence)
- Tailwind CSS installed version 4.2.2: `node_modules/tailwindcss/package.json` (HIGH confidence)

---

## v2.0 Stack — Vercel Migration

**Researched:** 2026-04-22
**Confidence:** HIGH (verified via Context7 Vercel docs; Vercel CLI version confirmed via npm registry)

### What Changes vs What Stays

This is a deployment infrastructure migration, not a new product stack. All application code (Next.js 16.2.3, React 19, TypeScript, Tailwind v4, framer-motion 12, gray-matter, Biome) stays untouched. The change is entirely in deployment config.

### No New npm Packages

Zero packages added to `package.json`. Vercel CLI is invoked via `npx vercel` in CI — no global install, no devDependency.

### Config Changes Required

#### 1. `next.config.ts` — Remove GitHub Pages workarounds

Current state has three GitHub Pages-specific constraints that must be removed:

| Setting | Remove | Why |
|---------|--------|-----|
| `output: 'export'` | Yes | Forces static HTML — disables Vercel runtime, ISR, image optimization, middleware |
| `basePath: isProd ? '/resume' : ''` | Yes | GitHub Pages served from `/resume` subpath; Vercel serves from domain root |
| `assetPrefix: isProd ? '/resume' : ''` | Yes | Same reason as basePath |
| `images: { unoptimized: true }` | Yes | Was required for static export; Vercel Image Optimization works natively |
| `const isProd = ...` | Yes | Only existed to toggle basePath/assetPrefix |

After migration `next.config.ts` becomes:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;
```

#### 2. `.github/workflows/deploy.yml` — Replace entirely

Current workflow is GitHub Pages-specific (uses `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`). Replace with Vercel CLI pattern.

Recommended replacement workflow:

```yaml
name: deploy

on:
  push:
    branches: ["master"]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - run: npx vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - run: npx vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

Three secrets required in GitHub repo Settings > Secrets:
- `VERCEL_TOKEN` — create at vercel.com/account/tokens
- `VERCEL_ORG_ID` — obtained from `.vercel/project.json` after running `npx vercel link`
- `VERCEL_PROJECT_ID` — obtained from `.vercel/project.json` after running `npx vercel link`

Note: `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are automatically picked up from `.vercel/project.json` when it's committed; `VERCEL_TOKEN` must always be a secret.

#### 3. `.vercel/project.json` — Created by `npx vercel link`

Run once locally to link the project:

```bash
npx vercel login
npx vercel link
```

This creates `.vercel/project.json` with `orgId` and `projectId`. Commit this file — it is not a secret. It tells the CLI which Vercel project to target without needing VERCEL_ORG_ID/VERCEL_PROJECT_ID env vars explicitly.

#### 4. `vercel.json` — Optional, recommended

Not required for a basic Next.js deploy (Vercel auto-detects Next.js). Useful for locking framework detection and enabling clean URLs:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "cleanUrls": true
}
```

Skip if you want zero config — Vercel's auto-detection handles Next.js correctly.

### GitHub Pages Decommission

After Vercel is live:
1. Disable GitHub Pages in repo Settings > Pages (set source to "None")
2. Remove `pages: write` and `id-token: write` permissions from workflow (already gone in replacement workflow above)
3. The GitHub Pages environment in repo settings can be deleted

### Deployment Approaches: CLI vs Dashboard Git Integration

| Approach | How it works | Pros | Cons |
|----------|-------------|------|------|
| **Vercel CLI in GitHub Actions** (recommended) | Workflow calls `vercel pull`, `vercel build`, `vercel deploy` | Full control, existing CI pattern preserved, can add pre-deploy steps | 3 secrets to configure, slightly more setup |
| **Vercel Git Integration** (simpler alternative) | Connect repo in Vercel dashboard; push = auto-deploy | Zero workflow file needed, zero secrets | Less control, can't add pre-deploy checks, deploys on every push including WIP |

**Recommendation: Vercel CLI in GitHub Actions.** The existing project already has a workflow file and the user is comfortable with the two-job pattern. The CLI approach is also what Vercel officially recommends for projects that need pre-deploy control.

### Version Compatibility

| Package | Version | Compatible With | Notes |
|---------|---------|-----------------|-------|
| Vercel CLI | 52.0.0 (current) | Next.js 16.x | Vercel CLI tracks Next.js releases; first-party support |
| Vercel CLI | 52.0.0 | Node 20 | Matches existing workflow `node-version: "20"` |
| next | 16.2.3 | Vercel platform | Next.js is Vercel's own framework — full native support |

### What NOT to Add

| Avoid | Why | Note |
|-------|-----|------|
| `vercel` in `package.json` devDependencies | Wastes install time on every `npm ci`; `npx vercel` in CI fetches exact version without polluting the project | Use `npx vercel` in workflow steps |
| `@vercel/analytics` | Performance monitoring — out of scope for this migration | Add later if wanted |
| `@vercel/speed-insights` | Same | Add later if wanted |
| `@vercel/og` | Dynamic OG image generation — no use case on a static resume | Skip |
| Both Git Integration AND GitHub Actions | Causes double deployments on every push | Pick one; CLI pattern is recommended |
| `images: { unoptimized: true }` after migration | Was required for `output: 'export'`; removing it on Vercel enables native Image Optimization | Remove it |

### Sources (v2.0)

- `/vercel/vercel` (Context7, HIGH confidence) — `vercel pull --yes`, `vercel build --prod`, `vercel deploy --prebuilt --prod` pattern; `vercel link`
- `/websites/vercel` (Context7, HIGH confidence) — VERCEL_TOKEN env var for CI/CD, GitHub Actions integration, vercel.json schema
- `npm show vercel version` (HIGH confidence) — Vercel CLI 52.0.0 current as of 2026-04-22
- Existing `next.config.ts` — confirmed `output: 'export'`, `basePath`, `assetPrefix`, `images.unoptimized` all present and all GitHub Pages-specific
- Existing `.github/workflows/deploy.yml` — confirmed uses `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v5` (all GitHub Pages tooling, all to be replaced)
