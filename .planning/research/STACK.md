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

---

## v3.0 Stack — Content & Design Features

**Researched:** 2026-04-23
**Confidence:** HIGH

### Summary: Zero New npm Dependencies

All four v3.0 features (bio/intro, duration labels, education section, typography overhaul) are implementable with the existing stack. No packages should be added to `package.json`.

---

### Feature 1: Duration Labels from Date Ranges

**Decision: Vanilla TypeScript utility function. No library.**

The existing `ExperienceEntry` type already stores `startDate: string` and `endDate: string | null` in `"YYYY-MM"` format. A pure TypeScript function of ~20 lines handles all cases correctly:

```typescript
// src/lib/duration.ts
export function computeDuration(start: string, end: string | null): string {
  const [sy, sm] = start.split("-").map(Number);
  const now = new Date();
  const [ey, em] = end
    ? end.split("-").map(Number)
    : [now.getFullYear(), now.getMonth() + 1];

  let months = (ey - sy) * 12 + (em - sm);
  const years = Math.floor(months / 12);
  months = months % 12;

  if (years === 0) return months === 1 ? "1 mo" : `${months} mos`;
  if (months === 0) return years === 1 ? "1 yr" : `${years} yrs`;
  return `${years} yr${years > 1 ? "s" : ""} ${months} mo${months > 1 ? "s" : ""}`;
}
```

This produces LinkedIn-style labels: "2 yrs 3 mos", "1 yr", "8 mos". The function is pure (no side effects, no DOM), runs in Server Components with no client boundary requirement, and has zero bundle cost.

**Why not `date-fns`:**

`date-fns` `intervalToDuration` + `formatDuration` would work but adds ~18.6KB minified+gzipped to the bundle even with tree-shaking (the function pair pulls in calendar utilities). For a computation that is 20 lines of arithmetic, the library cost is not justified. The vanilla approach is faster, fully typed, and has no version drift risk.

**Why not `Temporal` API:**

`Temporal` (the new JS date standard) is available natively in Safari 16+ and Chrome 129+ as of late 2024, but Node.js does not yet ship it unflagged as of Node 20/22. Since this computation runs server-side in Next.js (in `page.tsx` or a Server Component helper), `Temporal` is not reliably available. The vanilla Date arithmetic approach is portable across all Node versions.

**Integration point:**

The function runs in `WorkExperience.tsx` (already a Server Component). Call it alongside `formatDateRange` and render the result in a secondary line under the date range:

```tsx
// In WorkExperience.tsx — no new client boundary needed
import { computeDuration } from "@/lib/duration";

<span className="text-xs text-zinc-400">{computeDuration(entry.startDate, entry.endDate)}</span>
```

---

### Feature 2: Typography + Spacing Overhaul

**Decision: Extend `@theme` in `globals.css`. No new packages.**

Tailwind v4's `@theme` block in `globals.css` is the correct mechanism for typography customization. All `@theme` variables automatically become utility classes — no `tailwind.config.js` or plugin needed.

The existing `globals.css` already has an `@theme inline` block. Extend it with explicit type scale and spacing overrides:

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

  /* Explicit type scale for resume — override defaults for tighter professional look */
  --text-xs--line-height: 1.5;
  --text-sm--line-height: 1.5;
  --text-base--line-height: 1.6;
  --text-lg--line-height: 1.4;
  --text-xl--line-height: 1.3;
  --leading-snug: 1.35;
  --tracking-tight: -0.015em;
}
```

**Key Tailwind v4 typography facts (verified via official docs):**

- Font size utilities (`text-xs` through `text-9xl`) are defined as `--text-*` CSS variables in `:root`
- Each size has a companion `--text-*--line-height` variable that controls the default line height for that size class
- Letter spacing is `--tracking-*`; line height is `--leading-*`
- Font weight is `--font-weight-*`
- All overrides go in `@theme` (or `@theme inline` when referencing other variables) — NOT in `tailwind.config.js`
- The `@tailwindcss/typography` plugin (prose classes) is NOT needed here — that plugin is for rendering arbitrary markdown/CMS HTML, not for custom component spacing

**What changes in components:**

The overhaul is primarily a Tailwind class audit across `Header.tsx`, `WorkExperience.tsx`, and the new `Education.tsx`. No new CSS primitives are needed. Typical changes:

| Current | Improved | Why |
|---------|----------|-----|
| `text-[28px]` | `text-3xl` (1.875rem) or keep as-is | Use scale tokens, not arbitrary values |
| `leading-[1.1]` | `leading-tight` | Use named token |
| `gap-8` between sections | `gap-10` or `gap-12` | More breathing room |
| `p-6` on cards | `p-6 sm:p-8` | Responsive padding |
| Hard-coded color classes | Consistent zinc scale | Audit for stray grays |

**Why not `@tailwindcss/typography` plugin:**

The `prose` class family is designed for rendering unstructured HTML (from a CMS or markdown parser) with sensible defaults. Resume components are structured JSX with explicit Tailwind classes — `prose` would fight those explicit classes and require override work. The plugin adds ~10KB CSS and zero benefit here. Confirmed: community discussion on GitHub shows `@tailwindcss/typography` has compatibility issues with Tailwind v4 that require careful version pinning (`@plugin "@tailwindcss/typography"` in CSS rather than `plugins: []` in config). Not worth the complexity for this use case.

---

### Feature 3: Education Section — gray-matter YAML Schema

**Decision: Add `education` array to `ResumeData`. Zero new packages.**

gray-matter (v4.0.3, already installed) parses any YAML structure. No schema library or validator is needed — TypeScript interfaces provide all the typing needed at compile time.

**New TypeScript interface:**

```typescript
// src/types/resume.ts — add:
export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
  highlights?: string[]; // optional relevant coursework / achievements
}

// Extend ResumeData:
export interface ResumeData {
  name: string;
  title: string;
  github: string;
  linkedin: string;
  bio?: string;               // NEW — optional bio paragraph
  experience: ExperienceEntry[];
  education?: EducationEntry[]; // NEW — optional; renders section only when present
  skills: Record<string, string>;
}
```

**YAML schema extension in `resume.md`:**

```yaml
bio: >
  Senior Software Engineer with 6+ years building distributed systems...

education:
  - institution: "Ton Duc Thang University"
    degree: "Bachelor of Engineering"
    field: "Computer Science"
    startYear: 2014
    endYear: 2018
```

**Why `startYear`/`endYear` as numbers (not strings):**

Education dates are year-only — no month precision needed. YAML integers parse directly to TypeScript `number` without any conversion. Using `"YYYY-MM"` strings (the experience date format) would imply month precision that doesn't exist for education.

**Why `bio` is optional (`bio?`):**

gray-matter returns `undefined` for missing YAML fields. Making `bio` optional in the TypeScript interface means the existing `resume.md` placeholder (which lacks a bio field) continues to parse without error. The `Header` component conditionally renders the bio paragraph only when the value is truthy.

**Integration with page.tsx:**

No change to the data loading logic in `page.tsx`. `matter(raw).data` is cast to `ResumeData` — the new fields are present if defined in the YAML. Pass `resume.education` to a new `<Education>` Server Component, same pattern as `<WorkExperience>`.

---

### Full Stack Delta for v3.0

| Area | Change |
|------|--------|
| `package.json` dependencies | **None** |
| `globals.css` | Extend `@theme inline` with explicit line-height and tracking tokens |
| `src/types/resume.ts` | Add `EducationEntry` interface; add `bio?` and `education?` to `ResumeData` |
| `src/data/resume.md` | Add `bio` field and `education` array to YAML frontmatter |
| New files | `src/lib/duration.ts` (pure TS utility, ~20 lines) |
| New files | `src/components/Education.tsx` (Server Component) |
| Modified files | `src/components/Header.tsx` (render `bio` paragraph) |
| Modified files | `src/components/WorkExperience.tsx` (add duration label display) |
| Modified files | `src/app/page.tsx` (pass `resume.education` and `resume.bio` to components) |

---

### What NOT to Add for v3.0

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `date-fns` | ~18.6KB gzipped for `intervalToDuration` + `formatDuration`; overkill for 20 lines of arithmetic | Vanilla TS utility in `src/lib/duration.ts` |
| `dayjs` | Smaller than date-fns but still an unnecessary dependency for year/month arithmetic | Same vanilla approach |
| `@tailwindcss/typography` | Designed for CMS/markdown prose, not structured component layouts; compatibility quirks in v4; adds ~10KB CSS | Direct Tailwind utility classes |
| `zod` / `yup` for YAML validation | No runtime validation needed — TypeScript interfaces catch type errors at compile time; resume.md is author-controlled | TypeScript `as ResumeData` cast (existing pattern) |
| `gray-matter` upgrade | v4.0.3 is current stable; no new features needed | Keep as-is |
| Any React state for education | Education data is static YAML — Server Component, no interactivity | Server Component pattern (same as WorkExperience) |

---

### Sources (v3.0)

- [Tailwind v4 theme docs](https://tailwindcss.com/docs/theme) — `@theme` block, CSS variable generation, typography namespaces (HIGH confidence)
- [Tailwind v4 font-size docs](https://tailwindcss.com/docs/font-size) — `--text-*--line-height` companion variables confirmed (HIGH confidence)
- [Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide) — `text-opacity-*` removed, `theme()` replaced by CSS vars (HIGH confidence)
- [tailwindcss-typography GitHub](https://github.com/tailwindlabs/tailwindcss-typography) — v4 compatibility via `@plugin` directive (MEDIUM confidence — community reports of friction)
- [date-fns npm](https://www.npmjs.com/package/date-fns) — v4.1.0, 18.6KB minified+gzipped (MEDIUM confidence)
- MDN Date API — `getFullYear()`, `getMonth()` for year/month arithmetic (HIGH confidence)
- `src/types/resume.ts` — confirmed existing `startDate`/`endDate` as `"YYYY-MM"` strings (HIGH confidence, direct source read)
- `src/components/WorkExperience.tsx` — confirmed `formatDateRange` already exists; duration label is additive (HIGH confidence, direct source read)
- `src/app/globals.css` — confirmed `@theme inline` block exists and is the correct extension point (HIGH confidence, direct source read)
- gray-matter v4.0.3 — `package.json` confirms installed version; YAML arrays parse to JS arrays natively (HIGH confidence)

---

## v4.0 Stack — shadcn/ui Full Design System Integration

**Researched:** 2026-04-24
**Confidence:** HIGH (verified via Context7 shadcn/ui docs at /llmstxt/ui_shadcn_llms_txt; npm registry version checks performed live)

### Tailwind v4 Compatibility: Yes, Native Support

shadcn/ui fully supports Tailwind v4. The shadcn/ui Tailwind v4 migration was shipped in March 2025. Key changes from earlier shadcn/ui behavior:

- `tailwind.config.js` is **not used** with v4 — `components.json` sets `"tailwind": { "config": "" }` (empty string) to signal v4 mode
- Animation utilities use `tw-animate-css` (CSS import) instead of the deprecated `tailwindcss-animate` plugin
- Color tokens are defined in `:root` using `oklch()` values (consistent with Tailwind v4's default palette)
- The `@theme inline` block in `globals.css` bridges shadcn CSS variables to Tailwind utility classes — same pattern already used in this project

**Verdict:** This project's existing `@import "tailwindcss"` + `@theme inline` setup is exactly what shadcn/ui v4 expects.

---

### New npm Dependencies

| Package | Version | Purpose | Why |
|---------|---------|---------|-----|
| `shadcn` | 4.4.0 | CLI + runtime | Two roles: (1) the `npx shadcn` CLI installs/manages components; (2) provides `shadcn/tailwind.css` imported at runtime in globals.css |
| `class-variance-authority` | 0.7.1 | Variant styling engine | Used internally by every shadcn component to manage style variants (e.g. Badge `variant="outline"`) |
| `clsx` | 2.1.1 | Conditional class composition | Builds class strings from conditional expressions in `cn()` utility |
| `tailwind-merge` | 3.5.0 | Tailwind class deduplication | Resolves conflicts when Tailwind classes are merged (e.g., `p-4 p-6` → `p-6`); used in `cn()` utility |
| `tw-animate-css` | 1.4.0 | CSS animation keyframes | Replaces deprecated `tailwindcss-animate` plugin; provides `animate-in`, `animate-out` and related utilities used by shadcn components |
| `lucide-react` | 1.9.0 | Icon set | Required by shadcn components that render icons; also referenced in component templates |

**Installation:**

```bash
npm install shadcn class-variance-authority clsx tailwind-merge tw-animate-css lucide-react
```

**No `radix-ui` in manual install.** The `npx shadcn add` CLI command installs per-component Radix dependencies automatically. For the three target components:

| Component | Radix Dependency | CLI Installs It? |
|-----------|-----------------|-----------------|
| Card | None — pure Tailwind/CVA | N/A |
| Badge | None — pure Tailwind/CVA | N/A |
| Separator | `@radix-ui/react-separator` (via unified `radix-ui` package) | Yes, automatically |

Do not manually add `radix-ui` to `package.json`. The CLI handles it when `npx shadcn@latest add separator` is run.

---

### React 19 Compatibility: No Flags Required

All shadcn/ui dependencies explicitly list React 19 (`^19.0`) in their peer dependencies as of their current versions. The `radix-ui` unified package (v1.4.3) supports React 19 natively. No `--force` or `--legacy-peer-deps` flags are needed with npm when installing against this project's `react@19.2.4`.

---

### Two-Phase Installation Workflow

**Phase 1: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

The init command is interactive. It creates `components.json` at the project root and rewrites `globals.css`. **This destructively overwrites the current `globals.css`.** The existing custom variables (`--background`, `--foreground`, `@theme inline` block) must be merged back manually after init runs.

What init produces in `globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  /* ... full set of shadcn semantic color tokens ... */
  --radius-sm: calc(var(--radius) * 0.6);
  /* ... radius scale ... */
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... full shadcn color palette in oklch ... */
}
```

What must be preserved from the existing `globals.css`:

```css
/* Keep these — they override shadcn defaults with the project's custom values */
:root {
  --background: #fafafa;   /* override shadcn's oklch(1 0 0) if desired */
  --foreground: #18181b;   /* override shadcn's oklch(0.145 0 0) if desired */
}

@theme inline {
  --font-sans: var(--font-geist-sans);  /* MUST keep — wires Next.js font to Tailwind */
  --font-mono: var(--font-geist-mono);  /* MUST keep */
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), system-ui, sans-serif;
}
```

The `@custom-variant dark (&:is(.dark *));` line from shadcn's init output is worth keeping even though dark mode is listed as a Future feature — it is zero-cost and avoids a `globals.css` rewrite when dark mode is implemented.

**Recommended `components.json` for this project:**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

Note: `"tailwind": { "config": "" }` — empty string is the v4 signal. `"rsc": true` because this project uses Next.js App Router with Server Components. `"css"` path must match the actual globals.css location.

The init command also creates `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

This file does not conflict with anything in the current project (no existing `src/lib/utils.ts`).

**Phase 2: Add individual components**

```bash
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add separator
```

Each command copies the component source into `src/components/ui/` (e.g., `src/components/ui/card.tsx`). Components are source code — not black-box npm packages — so they are fully editable and customizable.

---

### `next.config.ts` Changes

**None required.** The current `next.config.ts` (reactCompiler + security headers) works as-is with shadcn/ui. shadcn does not require any Next.js config changes.

---

### `tsconfig.json` Changes

**None required.** The existing `"paths": { "@/*": ["./src/*"] }` alias in `tsconfig.json` is exactly what `components.json` expects for `"aliases": { "components": "@/components", ... }`.

---

### Note on `lucide-react` vs Previous Decision

The existing STACK.md (v1.1) explicitly rejected `lucide-react` for a single briefcase icon ("~40KB for one icon"). That decision was correct in isolation. The v4.0 decision reverses this because shadcn components reference `lucide-react` internally — Card, Badge, and Separator themselves do not, but other shadcn components do, and the project is committing to the full shadcn design system. Once `lucide-react` is installed for the design system, using it for other icons (e.g., replacing the inline BriefcaseIcon SVG) is a reasonable follow-on.

---

### Full Stack Delta for v4.0

| Area | Change |
|------|--------|
| `package.json` dependencies | Add: `shadcn`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `lucide-react` |
| `package.json` dependencies | CLI auto-adds: `radix-ui` (for Separator only, added by `shadcn add separator`) |
| `components.json` | New file at project root |
| `src/lib/utils.ts` | New file (created by `shadcn init`) |
| `src/app/globals.css` | Rewritten by `shadcn init` — must manually merge existing font/background vars back in |
| `src/components/ui/card.tsx` | New file (created by `shadcn add card`) |
| `src/components/ui/badge.tsx` | New file (created by `shadcn add badge`) |
| `src/components/ui/separator.tsx` | New file (created by `shadcn add separator`) |
| `next.config.ts` | No change |
| `tsconfig.json` | No change |

---

### What NOT to Add for v4.0

| Avoid | Why | Note |
|-------|-----|------|
| `@radix-ui/react-*` individually | CLI installs correct Radix deps per-component automatically | Let `shadcn add` handle it |
| `tailwindcss-animate` | Deprecated; replaced by `tw-animate-css` | shadcn's init uses `tw-animate-css` by default |
| `shadcn-ui` (old package name) | The package was renamed to `shadcn`; `shadcn-ui` is the obsolete npm package | Use `shadcn` (no hyphen) |
| Manual Radix primitives for Card/Badge | These two components are pure Tailwind — no Radix primitives needed | Only Separator needs Radix |
| `@tailwindcss/typography` | Still inappropriate for structured component layouts | Not used by any target component |

---

### Sources (v4.0)

- Context7 `/llmstxt/ui_shadcn_llms_txt` — shadcn/ui Tailwind v4 docs, manual install instructions, components.json schema, React 19 compatibility page (HIGH confidence)
- `npm show shadcn version` → 4.4.0 (HIGH confidence, live npm registry)
- `npm show class-variance-authority version` → 0.7.1 (HIGH confidence, live npm registry)
- `npm show clsx version` → 2.1.1 (HIGH confidence, live npm registry)
- `npm show tailwind-merge version` → 3.5.0 (HIGH confidence, live npm registry)
- `npm show tw-animate-css version` → 1.4.0 (HIGH confidence, live npm registry)
- `npm show lucide-react version` → 1.9.0 (HIGH confidence, live npm registry)
- `npm show radix-ui version` → 1.4.3 (HIGH confidence, live npm registry)
- [shadcn/ui Tailwind v4 guide](https://ui.shadcn.com/docs/tailwind-v4) — `tw-animate-css` replaces `tailwindcss-animate`, v4 config pattern (HIGH confidence)
- [shadcn/ui React 19 page](https://ui.shadcn.com/docs/react-19) — peer dep status table, no flags needed (HIGH confidence)
- `src/app/globals.css` — confirmed current state: `@import "tailwindcss"`, `@theme inline`, `:root` block (HIGH confidence, direct file read)
- `tsconfig.json` — confirmed `"paths": { "@/*": ["./src/*"] }` (HIGH confidence, direct file read)
- `next.config.ts` — confirmed no shadcn-conflicting settings (HIGH confidence, direct file read)
- `package.json` — confirmed current deps and absence of any shadcn packages (HIGH confidence, direct file read)
