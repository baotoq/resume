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

Tailwind v4 constraint: configuration is CSS-only (`@import "tailwindcss"`, no `tailwind.config.*`). The default palette uses `oklch` color space — this matters for PDF generation library choice (see below).

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
