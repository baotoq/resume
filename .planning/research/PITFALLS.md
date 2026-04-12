# Domain Pitfalls: Resume/CV Page

**Domain:** Software engineer resume/CV page with PDF export
**Stack:** Next.js 16.2.3 + React 19 + Tailwind v4
**Researched:** 2026-04-12

---

## Critical Pitfalls

Mistakes that cause rewrites or fundamentally broken output.

---

### Pitfall 1: PDF via html2canvas produces an image, not selectable text

**What goes wrong:** The html2canvas + jsPDF pipeline (and html2pdf.js) rasterizes the DOM into a PNG before embedding it into the PDF. The resulting file has no selectable or searchable text. Recruiters cannot copy a phone number, Ctrl+F for a skill, or paste an email. ATS systems that scrape text from PDFs extract nothing.

**Why it happens:** html2canvas works by screenshotting the rendered page. jsPDF then embeds that screenshot as an image. It's a shortcut that avoids the hard problem of mapping CSS to PDF primitives.

**Consequences:** PDF looks fine visually but is functionally broken for every non-visual use case. Text cannot be parsed by ATS, copied by recruiters, or indexed by search engines.

**Prevention:** Use `@react-pdf/renderer` instead. It renders to real PDF primitives (text, lines, boxes) using its own layout engine. Text is searchable and selectable. Alternatively, use the browser's native `window.print()` → Save as PDF, which preserves text properly.

**Detection:** Open the generated PDF, try to select text. If you can only select the entire page as a single image region, you have the image-PDF problem.

---

### Pitfall 2: @react-pdf/renderer crashes on the server (SSR)

**What goes wrong:** `@react-pdf/renderer` uses browser-only APIs (`canvas`, `Blob`, etc.) internally. Importing it at the module level in a Next.js Server Component or without SSR guard causes a build crash or runtime error on the server.

**Why it happens:** Next.js 16 App Router components are Server Components by default. The PDF library has no server-compatible code path.

**Consequences:** `next build` fails, or the page throws at runtime with "canvas is not defined" or similar errors.

**Prevention:** Two things are both required — not either/or:
1. Put the PDF component in a file with `'use client'` at the top.
2. Use `dynamic(() => import('./PDFDownloadButton'), { ssr: false })` at the import site.

The `'use client'` directive alone is not enough — Next.js still prerendering the component during `next build` will reach the browser API. The `ssr: false` dynamic import is what actually prevents server execution.

Also add to `next.config.ts`:
```ts
serverExternalPackages: ['@react-pdf/renderer']
```
Without this, the server bundle may receive the Node.js version of the package via wrong module resolution conditions, breaking `usePDF` and other hooks even in client components.

**Detection:** Run `next build`. If it succeeds locally, check that the PDF button actually appears in the deployed Vercel build — the error sometimes only surfaces in production builds.

---

### Pitfall 3: Tailwind v4 shadow, border-radius, and outline classes silently produce wrong results

**What goes wrong:** Classes that compiled to expected values in Tailwind v3 now produce different values in v4 due to scale renaming. The code appears to work but renders at the wrong size.

**Specific renames (v3 → v4):**
- `shadow-sm` → `shadow-xs`, `shadow` → `shadow-sm`
- `rounded-sm` → `rounded-xs`, `rounded` → `rounded-sm`
- `blur-sm` → `blur-xs`, `blur` → `blur-sm`
- `ring` (3px in v3) → `ring` (1px in v4) — must use `ring-3` to restore prior size
- `outline-none` → `outline-hidden` (different semantics; `outline-none` now actually sets `outline-style: none` which is different from the v3 behavior)

**Why it happens:** Tailwind v4 restructured the scale so every tier has a named value (xs/sm/md/lg) and bare `shadow`/`rounded` no longer exist as shorthand for the small variant.

**Consequences:** UI elements look subtly wrong. Cards have unexpected shadow depths. Rounded corners are larger or smaller than intended. Focus rings are invisible because `ring` is now 1px wide. No error is thrown.

**Prevention:** Audit all uses of bare `shadow`, `rounded`, `ring`, and `blur` classes in the codebase. Update them to their explicit v4 equivalents. Do not copy v3 examples from older blog posts.

**Detection:** Visual comparison between dev intent and rendered output. Check the Tailwind v4 upgrade guide against any v3 class names you use: https://tailwindcss.com/docs/upgrade-guide

---

### Pitfall 4: Tailwind v4 border and divide utilities default to currentColor, not gray

**What goes wrong:** In v3, `<div class="border">` produced a gray-200 border. In v4, the same class produces a border in the current text color — typically black. Dividers between resume sections appear as harsh black lines.

**Why it happens:** v4 changed the default `border-color` to `currentColor` to match CSS defaults. The v3 behavior was an override via Tailwind's base styles that no longer exists.

**Consequences:** Any border or divider added without an explicit color class will look wrong — usually too dark or too heavy for resume typography.

**Prevention:** Always specify the border color explicitly: `border border-gray-200`. Never rely on the default border color.

**Detection:** Add a `<hr>` or `<div class="border-t">` and check if it's the expected subtle color.

---

### Pitfall 5: print: variant specificity conflicts with hidden

**What goes wrong:** The pattern `hidden print:block` (show only on print) fails in some cases — the element stays hidden when printing. The `print:` variant is built into Tailwind v4 and does not need configuration, but specificity conflicts arise when `hidden` (`display: none`) wins over `print:block`.

**Why it happens:** Both `hidden` and `print:block` are Tailwind utilities. Which one wins depends on source order in the generated CSS. In v4 the CSS cascade does not guarantee that `print:block` overrides `hidden` in all conditions.

**Consequences:** Elements intended to appear only in print (e.g., "Generated by..." footer, page header) remain invisible. Elements intended to be hidden in print (e.g., the Download button) still appear in the PDF.

**Prevention:** Use the `!` (important) modifier as a workaround when specificity issues occur: `hidden print:block!`. Also test print styles actively using Chrome DevTools: Rendering panel → Emulate CSS media type → print.

**Alternative approach:** Control print visibility via a `@media print` block in `globals.css` rather than Tailwind classes, which avoids the specificity issue entirely and gives explicit cascade control.

---

## Moderate Pitfalls

---

### Pitfall 6: Resume designed at fixed pixel width breaks on mobile

**What goes wrong:** A resume page built to look exactly like a paper document (fixed 8.5"×11" viewport) scales down on mobile to an unreadable zoomed-out mess, or triggers horizontal scroll.

**Why it happens:** Resume designers anchor layout to paper dimensions (e.g., `max-w-[816px]`). Without responsive Tailwind breakpoints, the layout does not reflow for narrow viewports.

**Consequences:** Mobile visitors (hiring managers checking a link on their phone) see a miniaturized desktop layout. Recruiter bounces.

**Prevention:** Design the web view as a responsive layout first, then use `@media print` or a separate print stylesheet to enforce paper dimensions. The two rendering contexts have different constraints and should be handled separately.

---

### Pitfall 7: Google Fonts not embedded in print/PDF output

**What goes wrong:** `next/font/google` loads fonts at build time and injects them into the page. When the browser prints or generates a PDF, the font may not be embedded in the output file — especially on machines where the font is not installed locally.

**Why it happens:** Browser PDF generation via `window.print()` embeds fonts based on whether they have been fully loaded before the print dialog opens. If the print event fires before font face loading completes (or the browser decides not to embed certain fonts), the PDF falls back to a system font like Times New Roman or Arial.

**Consequences:** PDF looks different on different recipient machines. A carefully chosen font (Geist, Inter, etc.) on the web version is replaced by a default serif in the PDF.

**Prevention:**
- For `window.print()` approach: preload fonts and use `document.fonts.ready` to ensure fonts are loaded before triggering print.
- For `@react-pdf/renderer`: use `Font.register()` with explicit font file URLs — the library handles embedding properly.
- Test the PDF on a machine where the font is not installed to catch substitution failures.

---

### Pitfall 8: Large bundle from PDF library loaded on initial page load

**What goes wrong:** `@react-pdf/renderer` is ~2-3 MB when bundled. If it loads on the initial page render, the resume page is slow to become interactive for all visitors — including those who never click the PDF download button.

**Why it happens:** Without lazy loading, Next.js bundles PDF dependencies into the main JS chunk.

**Consequences:** Poor Core Web Vitals, slower Time to Interactive. Recruiters on slow connections may bounce before the page loads.

**Prevention:** Use `dynamic(() => import('./PDFButton'), { ssr: false })` — this is required anyway for SSR reasons (see Pitfall 2). The dynamic import also produces a separate chunk that only loads when the component mounts. The PDF library is deferred until the user visits the page rather than bundled into the initial load.

---

### Pitfall 9: Page breaks cut through content mid-element

**What goes wrong:** A work experience entry, skill list, or multi-line role description is split by a PDF page break — e.g., the company name appears at the bottom of page 1 and the bullet points appear at the top of page 2.

**Why it happens:** Neither the browser's print engine nor `@react-pdf/renderer` knows where logical content boundaries are unless told explicitly.

**Prevention:**
- For `window.print()`: use `break-inside: avoid` on each discrete resume section block. In Tailwind v4: `break-inside-avoid`.
- For `@react-pdf/renderer`: use `wrap={false}` on the View components containing each job entry.
- Apply `break-before: avoid` on headings within sections to prevent orphaned headings.

**Detection:** Generate a PDF with enough content to span two pages and inspect all page boundaries.

---

### Pitfall 10: Next.js Image Optimization incompatible with static export

**What goes wrong:** If the project is configured with `output: 'export'` in `next.config.ts` for static hosting, `next/image` stops working with its default loader. The build fails with "Image Optimization using Next.js' default loader is not compatible with `next export`."

**Why it happens:** Next.js image optimization requires a server to resize images on-demand. Static exports have no server.

**Consequences:** Build fails, or images are omitted.

**Prevention:** For a resume page, avoid `next/image` entirely for static assets (use a plain `<img>` tag) unless you configure a custom loader or use Vercel hosting (which provides image optimization without `output: 'export'`). The project is already configured for Vercel deployment, so `output: 'export'` is not needed — but do not add it thinking it will speed up deploys, because it disables the image optimizer and other Vercel-specific features.

---

### Pitfall 11: Tailwind important modifier syntax changed (! prefix moved to suffix)

**What goes wrong:** v3 used `!` as a prefix: `!flex`. v4 moved it to a suffix: `flex!`. Code written from v3 muscle memory or copied from pre-v4 examples produces a class that Tailwind v4 does not recognize and silently ignores.

**Why it happens:** Tailwind v4 changed the `!important` modifier position to avoid conflicts with CSS nesting selectors.

**Consequences:** The intended override does not apply. No error is thrown. The class exists in the markup but generates no CSS.

**Prevention:** In v4, always write `flex!`, `hidden!`, `text-sm!`. Never use the `!` prefix.

---

### Pitfall 12: CSS variable syntax in arbitrary values changed

**What goes wrong:** v3 arbitrary values used CSS variables as `bg-[--brand-color]`. v4 requires parentheses: `bg-(--brand-color)`. If custom theme tokens are referenced with bracket syntax, they silently produce no output.

**Why it happens:** v4 changed the syntax to distinguish CSS variable references from other arbitrary values.

**Prevention:** When referencing CSS custom properties in arbitrary values, use `(--variable-name)` not `[--variable-name]`.

---

## Minor Pitfalls

---

### Pitfall 13: Variant stacking order reversed in v4

**What goes wrong:** v3 applied stacked variants right-to-left: `first:*:pt-0` meant "first child's pt-0". v4 applies variants left-to-right: `*:first:pt-0`. The selectors produce opposite results.

**Prevention:** When using compound variants like `*:hover:` or `first:*:`, reverse the order when migrating from v3 patterns or examples. This is rarely needed on a resume page but can catch you when copying layout patterns from older sources.

---

### Pitfall 14: ATS does not parse the web page URL — only the downloaded PDF

**What goes wrong:** Engineers sometimes design a beautifully semantic HTML resume expecting ATS systems to parse it from the URL. ATS systems do not crawl personal resume URLs. They only parse files that applicants upload directly.

**Why it happens:** ATS receives uploaded documents, not crawled URLs. The web page is for human readers.

**Consequences:** No consequence to ATS compatibility from the web page itself. The ATS pitfall lives entirely in the downloaded PDF: if the PDF contains rasterized images instead of text (see Pitfall 1), ATS extracts nothing.

**Implication:** Invest in text-based PDF output. The web page's semantic HTML is irrelevant to ATS. The PDF must have real text.

---

### Pitfall 15: Browser print dialog default settings discard backgrounds

**What goes wrong:** When a user triggers `window.print()` and the browser print dialog opens, the "Background graphics" / "Print backgrounds" option defaults to unchecked in most browsers. Background colors and images — including colored section headers or skill badge backgrounds — disappear in the output.

**Prevention:**
- Do not use background colors to convey structural meaning. Rely on borders, typography weight, and whitespace instead.
- If backgrounds are important, add a `@media print` CSS block with `-webkit-print-color-adjust: exact; print-color-adjust: exact;` on the relevant containers to force background printing, and document that users must enable background graphics in their print dialog.

---

### Pitfall 16: globals.css has a body font-family override that nullifies next/font

**What goes wrong:** The existing `globals.css` sets `font-family: Arial, Helvetica, sans-serif` on the `body` rule, which overrides the Geist font loaded via `next/font/google` in `layout.tsx`. The project CONCERNS.md already flagged this.

**Prevention:** Remove the `font-family` override from the `body` rule in `globals.css`. Use the Tailwind `font-sans` utility class (which maps to `--font-sans`, which maps to Geist) instead of inline font declarations.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| PDF download button | Library SSR crash (#2) | `dynamic` + `ssr: false` is mandatory, not optional |
| PDF output quality | Image-based PDF (#1) | Validate text selectability before shipping |
| Print CSS | print: specificity (#5), background strip (#15) | Test in Chrome DevTools Rendering panel with print emulation |
| Section styling | Border color default change (#4) | Always specify explicit border color |
| Font in PDF | Font not embedded (#7) | Test on machine without the font installed |
| Tailwind utilities | Shadow/radius renames (#3), ! suffix (#11) | Cross-check any v3 examples against v4 upgrade guide |
| Mobile layout | Fixed width layout (#6) | Build responsive-first; enforce paper width only in @media print |
| Bundle performance | PDF library weight (#8) | Dynamic import (already required for SSR fix) covers this |

---

## Sources

- Tailwind CSS v4 Upgrade Guide: https://tailwindcss.com/docs/upgrade-guide
- Tailwind print specificity discussion: https://github.com/tailwindlabs/tailwindcss/discussions/12887
- Jacob Paris — CSS print styles with Tailwind: https://www.jacobparis.com/content/css-print-styles
- @react-pdf/renderer Next.js SSR discussion: https://github.com/diegomura/react-pdf/issues/2624
- Next.js 16 static exports doc: `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`
- HTML to PDF page break issues: https://dev.to/resumemind/htmlcss-to-pdf-how-i-solved-the-page-break-nightmare-mdg
- PDF generation library comparison 2025: https://dmitriiboikov.com/posts/2025/01/pdf-generation-comarison/
- ATS formatting mistakes 2026: https://www.jobscan.co/blog/ats-formatting-mistakes/
- JavaScript PDF rendering issues: https://html2pdfapi.com/blog/javascript-pdf-rendering-5-common-issues-fixed
- React-to-print Tailwind issue: https://github.com/MatthewHerbst/react-to-print/issues/784
