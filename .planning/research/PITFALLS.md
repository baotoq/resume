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

---

---

# v1.1 Addendum: Company Logos + Vertical Timeline Pitfalls

**Scope:** Adding logo images (manual `logo_url` + briefcase fallback) and a CSS vertical timeline to the existing static-export app.
**Researched:** 2026-04-13
**Confidence:** HIGH for Next.js Image constraints (verified in local docs); HIGH for Tailwind v4 pseudo-element rules (verified in official docs + known issue); MEDIUM for CSS timeline layout patterns.

---

## Critical Pitfalls (v1.1)

---

### Pitfall V1: `next/image` with External Logo URLs Silently Breaks in Static Export

**What goes wrong:** `next/image` uses a runtime image optimization server at `/_next/image`. `output: 'export'` produces no server. In `next dev` everything looks fine. After deploying to GitHub Pages, every logo `<img>` returns 404 with no build-time warning.

**Why it happens:** The optimization pipeline is a runtime feature. The build does not validate that optimization is compatible with static export when external URLs are used — it only fails at page load in the browser. Verified in local Next.js docs: `remotePatterns` controls which URLs the optimizer _accepts_, but does not fix the missing server.

**Consequence:** All company logos broken in production. No CI failure, no build error — silent regression.

**Prevention:** Use a plain `<img>` tag for external logo URLs. This is the correct choice here: external logos are user-supplied at content-editing time, come from arbitrary hostnames, and benefit nothing from image optimization.

```tsx
<img
  src={entry.logo_url}
  alt={`${entry.company} logo`}
  width={32}
  height={32}
  className="h-8 w-8 object-contain"
/>
```

If `next/image` is used for any local images elsewhere in the project, add `images: { unoptimized: true }` to `next.config.ts` globally — this disables the runtime proxy and passes `src` verbatim, which is correct for static export.

**Detection:** Deploy to GitHub Pages. Open DevTools Network tab. Any `/_next/image?url=...` requests returning 404 confirm the problem.

---

### Pitfall V2: `onError` Fallback Cannot Live in a Server Component

**What goes wrong:** `WorkExperience` is a Server Component. Adding `onError` (or `onLoad`) to any image element — whether `<img>` or `next/image` — inside a Server Component causes a build failure:

```
Error: Event handlers cannot be passed to Client Component props.
```

This is confirmed in the local Next.js image docs: "Using props like `onError`, which accept a function, requires using Client Components to serialize the provided function."

**Why it happens:** Functions are not serializable across the Server→Client boundary. React Server Components only pass serializable values as props.

**Consequence:** Build fails completely if `onError` is placed on an element in `WorkExperience.tsx` without `'use client'`.

**Prevention:** Extract a `LogoImage` Client Component that owns the `onError`/`useState` fallback logic. Keep `WorkExperience` as a Server Component. The boundary is small:

```tsx
// src/components/LogoImage.tsx
'use client'
import { useState } from 'react'

export function LogoImage({ src, company }: { src?: string; company: string }) {
  const [failed, setFailed] = useState(!src)
  if (failed || !src) {
    return <div className="h-8 w-8 flex items-center justify-center text-zinc-400">
      {/* briefcase SVG or lucide icon here */}
    </div>
  }
  return (
    <img
      src={src}
      alt={`${company} logo`}
      width={32}
      height={32}
      className="h-8 w-8 object-contain"
      onError={() => setFailed(true)}
    />
  )
}
```

**Detection:** Build error at `next build`. Identifiable immediately.

---

### Pitfall V3: Broken Logo URLs Show Image Placeholder on First Paint (SSR/Hydration Gap)

**What goes wrong:** Static export pre-renders HTML at build time. If a `logo_url` is invalid, the server-rendered HTML still contains the `<img src="https://broken.url/logo.png">`. On first paint the browser shows a broken image icon. The `onError` → `useState` fallback only fires after JS hydration — visible delay on slow connections.

**Why it happens:** `onError` is a browser DOM event. It does not run during server-side rendering. The static HTML snapshot always encodes the original `src`.

**Consequence:** Flash of broken image icon visible to recruiters on first paint when `logo_url` is invalid or slow to load.

**Prevention — Primary:** Validate every `logo_url` in `resume.md` before deploy. The static export's `page.tsx` runs at build time — a synchronous HEAD-check or URL format validation there can set `logoValid: false` and pass a signal to render the fallback icon directly in the HTML, bypassing the flash entirely.

**Prevention — Secondary:** Accept the flash as acceptable for a personal resume (logos are aesthetic, not functional). The fallback resolves within one hydration cycle.

Do not use `suppressHydrationWarning` — it hides the console warning but not the visual artifact.

---

## Moderate Pitfalls (v1.1)

---

### Pitfall V4: basePath Not Applied to Local Fallback Icon File Paths

**What goes wrong:** This project has `basePath: "/resume"` in `next.config.ts`. A fallback icon referenced as `src="/briefcase.svg"` from `public/` will 404 on GitHub Pages because the real path is `/resume/briefcase.svg`. Works in `next dev` (no basePath in dev server by default), breaks in production.

**Why it happens:** Plain `<img>` and CSS `url()` strings are not rewritten by Next.js. Only `next/image` and static module imports get `basePath` prepended automatically.

**Consequence:** Fallback icon broken in production. Worse than no fallback — the broken image icon replaces the intended briefcase icon.

**Prevention:** Use an inline SVG element or a React icon package for the fallback — no file path involved, nothing to break. If a file must be used, import it as a module:

```tsx
import briefcaseUrl from '@/public/briefcase.svg'
// <img src={briefcaseUrl.src} ... />
```

Static imports are resolved at build time with the correct `basePath`.

---

### Pitfall V5: Timeline Vertical Line Dangles Past the Last Entry

**What goes wrong:** A container-level `::before` pseudo-element with `height: 100%` draws the vertical line from the top of the container to its full height. The last entry's dot sits at the correct position, but the line continues below it into empty space — visually broken.

**Why it happens:** `height: 100%` is relative to the containing block, not the content. The container extends to its full height regardless of where the last card ends.

**Consequence:** Line "dangles" below the last job entry. Looks like an unfinished design.

**Prevention — Recommended:** Implement the line as a per-item segment rather than a container-level element. Put `::before` on each item's wrapper div, referencing its own height. Use Tailwind's `last:` variant to hide the segment on the final item:

```tsx
// On each item's outer wrapper:
className="relative pl-10 before:content-[''] before:absolute before:left-4 before:top-4 before:h-full before:w-0.5 before:bg-zinc-200 last:before:hidden"
```

`last:before:hidden` removes the line below the last dot. The dot itself is a separate element.

**Prevention — Alternative:** Single container line with `overflow: hidden` on the container. Less flexible when card heights vary.

---

### Pitfall V6: Timeline Dot Misaligns When Flex Container Uses `gap`

**What goes wrong:** The dot (positioned absolutely or as a pseudo-element) appears at the wrong vertical position relative to the card header row. In some browsers, the dot floats above or below the card title.

**Why it happens:** Absolute positioning resolves to the nearest non-static ancestor. In a flex column with `gap`, the item wrapper's box starts at the flex item boundary, not accounting for `gap` space. Additionally, `min-height` and intrinsic card heights affect where `top: 0` lands relative to visible card content.

**Consequence:** Dot appears misaligned relative to company name. Looks broken on cards with varying content lengths.

**Prevention:**
- Wrap each experience entry in an explicit `relative` container — do not rely on the flex item itself having position context.
- Align the dot using `top` offset matching the card's top padding (`pt-6` in the card → `top-6` on the dot, or use `mt-6` on the dot container).
- Prefer `translate-y-` utilities for fine-tuning vertical alignment — transforms do not depend on the containing block calculation.
- Test in both Chrome and Safari: absolute positioning inside flex containers with `gap` has had minor cross-browser inconsistencies historically.

---

### Pitfall V7: Tailwind v4 — `content-['']` Is Required, Not Optional, for Decorative Pseudo-Elements

**What goes wrong:** The vertical timeline line and dot are built with `::before`/`::after` pseudo-elements. In Tailwind v4, if `content` is not explicitly set, pseudo-elements do not render at all. No warning is produced — the element is simply invisible.

**Why it happens:** Tailwind v4 uses native CSS `@layer` and does not inject a baseline `content: ''` reset for pseudo-elements. CSS requires `content` to be set for `::before`/`::after` to render.

**Consequence:** Timeline line or dot completely invisible in the browser. No error or warning.

**Prevention:** Always include `before:content-['']` (or `after:content-['']`) when using pseudo-elements for decorative layout in Tailwind v4:

```tsx
// Required pattern in Tailwind v4:
className="before:content-[''] before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-zinc-200"
```

This is already done correctly in the existing codebase for bullet point dots in `WorkExperience.tsx`. Follow the same pattern exactly for all timeline pseudo-elements.

---

### Pitfall V8: Known Tailwind v4 Bug — `content` Property Emitted Twice

**What goes wrong:** When combining a `content-[...]` utility with a `before:` or `after:` variant in Tailwind v4 (tracked as issue #18178, present at least through v4.1.8), the generated CSS contains the `content` property twice. Example output: `content: ''; content: '';`.

**Why it happens:** The `before:` variant automatically injects `content: ''`, and the explicit `content-['']` class adds it again. This is a known framework bug.

**Consequence:** Benign — last-write-wins CSS means the element renders correctly. However, it can generate Biome or linter warnings when auditing CSS output.

**Prevention:** No action required. Do not remove `content-['']` to fix it — that would trigger Pitfall V7 (invisible pseudo-element). Leave it as-is and suppress any linter noise if it surfaces.

---

## Minor Pitfalls (v1.1)

---

### Pitfall V9: Logo Image Dimensions Cause CLS or Aspect Ratio Distortion

**What goes wrong:** External logo URLs point to images of arbitrary intrinsic dimensions (100×100, 400×200, tall SVG viewBox, etc.). Without a reserved container, logos distort the card header row or shift layout as they load.

**Prevention:**
- Set both `width` and `height` HTML attributes on `<img>` to let the browser reserve space before the image loads.
- Add `object-contain` to scale within the reserved box without cropping.
- Use a fixed-size container div (`h-8 w-8` or `h-10 w-10`) with `overflow: hidden` so card header layout is stable regardless of logo source dimensions.
- Set `loading="lazy"` if logos are below the fold.

---

### Pitfall V10: Mobile — Timeline Left Channel Squeezes Card Content

**What goes wrong:** On narrow screens (375px, iPhone SE), adding a left-side timeline channel (dot + line, ~32px) and keeping the card as a flex sibling can leave very little horizontal space for card content, or require wrapping.

**Why it happens:** Flex children default to `min-width: auto` — they will not shrink below their content's intrinsic width. Without `min-w-0`, the card refuses to shrink and causes overflow.

**Consequence:** Horizontal scroll on mobile, or card content overflows out of the viewport.

**Prevention:**
- Add `min-w-0` to the card flex child to allow it to shrink below content width.
- Keep the left channel thin: 32px max.
- The existing cards use `px-6 py-6` (48px horizontal padding inside the card) — that is fine as long as the outer timeline wrapper does not add further horizontal padding.
- Test at 375px viewport before shipping.

---

### Pitfall V11: Framer Motion Transform Creates New Stacking/Containing Block Context

**What goes wrong:** The existing `AnimateIn` wrapper uses framer-motion transforms (translate, opacity) for scroll animations. CSS `transform` creates a new containing block for `position: fixed` children, and a new stacking context. If timeline dots or the vertical line are positioned `fixed` (unlikely but possible if someone reaches for `fixed` to work around a positioning issue), they will behave as `absolute` inside the animated wrapper.

**Why it happens:** CSS specification: elements with non-`none` `transform` establish a containing block for absolutely-positioned descendants and a stacking context.

**Consequence:** Dots rendered at wrong position when animations run, visible during the scroll-in animation.

**Prevention:** Use only `position: absolute` (not `fixed`) for timeline elements. Verify rendering with animations active, not just in static HTML. If `AnimateIn` is removed as a wrapper for individual entries (e.g., the timeline section animates as a whole instead), confirm the positioning context is re-established on a parent wrapper.

---

## Phase-Specific Warnings (v1.1)

| Phase Topic | Pitfall | Mitigation |
|-------------|---------|------------|
| Logo `<img>` in static export | V1 — `next/image` 404 at runtime | Use plain `<img>`; set `images: { unoptimized: true }` globally if `next/image` used elsewhere |
| Logo fallback `onError` | V2 — event handler in Server Component fails build | Extract `LogoImage` as `'use client'` component |
| Broken `logo_url` first-paint | V3 — SSR/hydration gap shows broken image | Validate URLs at build time in `page.tsx` |
| Local fallback icon path | V4 — `basePath` not applied to string paths | Use inline SVG or module import |
| Timeline line last entry | V5 — line dangles past last card | Per-item line segments with `last:before:hidden` |
| Timeline dot vertical alignment | V6 — misalign in flex+gap layout | Explicit `relative`, `top` matching card padding, test cross-browser |
| Any timeline pseudo-element | V7 — invisible without `content-['']` | Always include `before:content-['']` |
| Mobile layout | V10 — card content squeezes or overflows | `min-w-0` on card flex child, test 375px |
| Framer motion integration | V11 — transform stacking context | Use `absolute` only, test with animations active |

---

## Sources (v1.1)

- Next.js Image component docs (local, authoritative): `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` — HIGH confidence
- [Next.js static export image optimization error](https://nextjs.org/docs/messages/export-image-api) — official — HIGH confidence
- [next/image `onError` requires Client Component](https://nextjs.org/docs/app/api-reference/components/image#onerror) — local docs confirmed — HIGH confidence
- [SSR `img` `onError` hydration gap](https://github.com/code-soubhik/react-nextjs-ssr-onerror-img-issue-fix) — MEDIUM confidence
- [Tailwind CSS `content` utility docs](https://tailwindcss.com/docs/content) — official — HIGH confidence
- [Tailwind issue #18178 — `content` property doubled with `before:`/`after:` variants](https://github.com/tailwindlabs/tailwindcss/issues/18178) — MEDIUM confidence
- [next/image basePath discussion](https://github.com/vercel/next.js/discussions/34173) — MEDIUM confidence
- CSS vertical timeline per-item line approach — multiple sources, MEDIUM confidence

---

---

# v2.0 Addendum: Static Export to Vercel Migration Pitfalls

**Scope:** Migrating from `output: 'export'` + GitHub Pages to Vercel deployment.
**Researched:** 2026-04-22
**Confidence:** HIGH (verified against actual codebase: `next.config.ts`, `page.tsx`, `TechStackIcons.tsx`, `AnimateIn.tsx`, `.github/workflows/deploy.yml`, `node_modules/react-devicons`)

---

## Critical Pitfalls (v2.0)

---

### Pitfall M1: basePath and assetPrefix Still Active on Vercel — Site Silently Serves at Wrong URL

**What goes wrong:**
`next.config.ts` uses `const isProd = process.env.NODE_ENV === "production"` to conditionally set `basePath: "/resume"` and `assetPrefix: "/resume"`. On Vercel, `NODE_ENV` is `"production"` during both build and runtime. After deploying, the site is only accessible at `yourdomain.vercel.app/resume/` — not at root. Vercel's default routing has no knowledge of the subpath. The deployment appears to succeed (green checkmark) while the root URL returns 404.

**Why it happens:**
The `isProd` conditional was introduced specifically for GitHub Pages, which hosts project repos at `github.com/user/resume` requiring a `/resume` subpath. Developers assume "remove `output: 'export'`" is the entire migration and miss the conditional guarding `basePath`.

**How to avoid:**
Remove the entire `basePath`, `assetPrefix`, and `images.unoptimized` block. On Vercel the site deploys at root. The conditional and all three options become unnecessary:

```ts
// next.config.ts after migration
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;
```

**Warning signs:**
- Vercel deployment shows green but production URL 404s at root
- Preview deployments at `*.vercel.app` return 404 at root but work at `*.vercel.app/resume/`
- Browser DevTools shows 404 on `/_next/static/...` assets

**Phase to address:**
Phase 1 — VERCEL-01 (remove `output: 'export'`). Must be done atomically with removing `basePath`/`assetPrefix`, not as a separate step.

---

### Pitfall M2: Contact Info Silently Blank in Production

**What goes wrong:**
`page.tsx` reads `process.env.NEXT_PUBLIC_EMAIL ?? ""` and `process.env.NEXT_PUBLIC_PHONE ?? ""`. If these environment variables are not configured in the Vercel dashboard, the build succeeds, deployment succeeds, and the live resume shows blank contact fields. Zero errors are surfaced — the fallback empty string is completely valid from Next.js's perspective. For a resume site this is a critical silent failure.

**Why it happens:**
`.env.local` is gitignored and never uploaded. Developers set the vars locally, confirm dev works, and forget that Vercel runs its own build with only variables explicitly configured in the dashboard. `NEXT_PUBLIC_` vars are inlined at build time — if they are absent at Vercel build time, the inlined value is `""`.

**How to avoid:**
Before the first Vercel production deployment, add `NEXT_PUBLIC_EMAIL` and `NEXT_PUBLIC_PHONE` in Vercel Project Settings > Environment Variables > Production. After deployment, open the live URL and visually verify the header shows real values.

**Warning signs:**
- Header shows blank email and phone on the Vercel URL
- No build error, no deploy error — CI is fully green
- Local dev works because `.env.local` is loaded automatically by Next.js

**Phase to address:**
Phase 2 — VERCEL-02 (configure Vercel deployment). Add env vars to dashboard before triggering first production deploy.

---

### Pitfall M3: GitHub Actions Double-Deploy Creates Conflicting CI Failures

**What goes wrong:**
Once the project is linked to Vercel's GitHub integration, every push to master triggers a Vercel deployment automatically. The existing `deploy.yml` workflow also runs on push to master and attempts to build with `output: 'export'` and deploy to GitHub Pages. After `output: 'export'` is removed from `next.config.ts`, the Pages workflow fails at `next build` (because GitHub Pages requires `output: 'export'` and `next build` no longer produces an `out/` directory). Every push creates a failing CI run alongside a successful Vercel deployment.

**Why it happens:**
Vercel's onboarding adds the GitHub integration but does not touch existing workflow files. Most migration tutorials say "link your project" without saying "delete the old workflow." Two systems targeting the same push event is the default state until explicitly cleaned up.

**How to avoid:**
Delete `.github/workflows/deploy.yml` in the same commit that removes `output: 'export'`. Do not leave both systems active for even one push to master.

If a custom GitHub Actions workflow is wanted for Vercel (e.g., run Biome lint as a required check before Vercel deploys), use `vercel deploy --prebuilt` with a `VERCEL_TOKEN` repository secret. Note: Vercel does not support OIDC token-less deployments from GitHub Actions as of 2025 — the OIDC pattern used by the current Pages workflow cannot be reused for Vercel.

**Warning signs:**
- GitHub Actions tab shows failing runs after Vercel integration is added
- Two concurrent deployment events visible in GitHub Deployments tab
- `next build` fails in CI with no change to application code

**Phase to address:**
Phase 3 — VERCEL-03 (replace GitHub Actions workflow). Delete the old workflow before or atomically with removing `output: 'export'`.

---

### Pitfall M4: GitHub Pages Still Live After Vercel Migration

**What goes wrong:**
GitHub Pages continues serving the old static export from the `gh-pages` environment even after Vercel is live and confirmed working. The old `github.com/user/resume` URL keeps serving a frozen copy of the v1.x site. Anyone who has that URL bookmarked sees stale content. If a custom domain pointed to GitHub Pages, it continues resolving there.

**Why it happens:**
Vercel deployment succeeding does not automatically disable GitHub Pages. The GitHub Pages environment remains active until explicitly disabled in repository Settings.

**How to avoid:**
After confirming the Vercel URL serves correctly: go to repository Settings > Pages > Source and set it to "None" (disabled). If GitHub Pages had a custom domain configured, remove the CNAME from Pages settings before re-adding the domain to Vercel to avoid DNS conflicts and verification errors.

**Warning signs:**
- Two live URLs serving different content simultaneously
- Old resume visible at `https://username.github.io/resume/` after migration is declared complete
- DNS records still point to GitHub Pages servers alongside a new Vercel deployment

**Phase to address:**
Phase 4 — VERCEL-04 (decommission GitHub Pages). Explicit final step after Vercel is confirmed.

---

## Technical Debt Patterns (v2.0)

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keep `images.unoptimized: true` on Vercel | No config changes | Misses Vercel Image Optimization (auto WebP, CDN caching, size negotiation) | Acceptable now — logos use plain `<img>`, no `next/image` in codebase |
| Skip custom domain, use `*.vercel.app` | Zero DNS work | Non-professional URL on a resume shared with recruiters | Never — configure a real domain before sharing URL publicly |
| Leave `out/` directory in repo | Zero cleanup work | Dead build artifact; `next build` without `output: 'export'` no longer writes to `out/`; confuses future devs | Never — delete `out/` post-migration |
| Use Vercel auto-integration instead of custom Actions workflow | Zero workflow setup | Cannot enforce Biome lint as a required gate before deployment | Acceptable for solo dev personal resume |

---

## Integration Gotchas (v2.0)

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Vercel + `basePath: "/resume"` | Removing `output: 'export'` without removing `basePath` | Remove both in the same commit; they were paired for GitHub Pages and are both unnecessary on Vercel |
| Vercel env vars (`NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_PHONE`) | Setting only in `.env.local` | Must be added in Vercel dashboard Project Settings > Environment Variables before first production build |
| GitHub Actions `deploy.yml` + Vercel integration | Leaving old workflow active after linking Vercel | Delete `deploy.yml` atomically with removing `output: 'export'` |
| `react-devicons` npm package in `TechStackIcons.tsx` | Assuming SVG icon components need `'use client'` | `react-devicons` v2.16.2 are pure `React.createElement` CJS with no hooks or browser APIs — they render fine in Server Components. The memory file claiming "Devicons via CDN" is stale; current code uses npm. Do not add `'use client'` unless a Server Component boundary error appears at build time |
| `framer-motion` in `AnimateIn.tsx` | Assuming `whileInView` causes SSR errors | `AnimateIn` already has `'use client'` and wraps Server Component children. `whileInView` requires `IntersectionObserver` (browser-only) but is correctly isolated. No change needed |
| `gray-matter` + `readFileSync` in `page.tsx` | Worrying about Vercel serverless file system restrictions | `page.tsx` has no dynamic APIs (`cookies()`, `headers()`, `searchParams`), so Next.js statically generates it at build time. `readFileSync` runs during build, not request time. No `outputFileTracingIncludes` config is needed |
| `next/font/google` (Geist, Geist_Mono) | Worrying about external font requests on Vercel | `next/font` self-hosts font files at build time. No external Google requests. Works identically to static export. No change needed |
| `reactCompiler: true` in `next.config.ts` | Assuming React Compiler causes Vercel build failures | React Compiler is stable in Next.js 16 and fully supported on Vercel. Slightly longer build times due to Babel usage, but no failures |
| Vercel GitHub OIDC | Trying to reuse the existing OIDC pattern from the Pages workflow | Vercel does not support OIDC token-less deploys from GitHub Actions as of 2025. Custom CI workflows require a `VERCEL_TOKEN` secret stored in GitHub repository secrets |

---

## "Looks Done But Isn't" Checklist (v2.0)

- [ ] **Root URL works:** Open the Vercel preview URL — page loads at `/`, not at `/resume/`. Confirm in browser address bar.
- [ ] **Contact info visible:** Live Vercel URL shows real email and phone in the header, not blank fields.
- [ ] **Old workflow deleted:** `.github/workflows/deploy.yml` does not exist in the repository after migration.
- [ ] **GitHub Pages disabled:** Repository Settings > Pages > Source shows "None". GitHub Deployments tab shows no active Pages environment.
- [ ] **`out/` directory deleted:** Stale static export artifact removed from repo — `next build` no longer writes to `out/`.
- [ ] **Animations work on Vercel:** Scroll through the live URL — `whileInView` animations trigger on scroll entry. Confirms SSR + hydration working correctly.
- [ ] **Tech icons render:** All `TechStackIcons` render on the live URL — confirms `react-devicons` Server Component compatibility on Vercel runtime.
- [ ] **No double-deploy:** Push a commit and check GitHub Actions tab — only Vercel's integration deployment runs, no failing Pages workflow.

---

## Recovery Strategies (v2.0)

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| basePath still set — root URL 404s | LOW | Remove `basePath`/`assetPrefix` from `next.config.ts`, push. Vercel auto-redeploys in ~1 min |
| Env vars missing — blank contact info | LOW | Add vars in Vercel dashboard > Environment Variables, click "Redeploy" |
| Double-deploy conflict — CI failing | LOW | Delete `.github/workflows/deploy.yml`, push. Vercel integration continues independently |
| GitHub Pages still live | LOW | Repository Settings > Pages > Source > None. Takes effect immediately |
| Custom domain pointing to old Pages | MEDIUM | Remove CNAME from Pages settings, add domain in Vercel dashboard, update DNS records; propagation takes up to 48h |

---

## Pitfall-to-Phase Mapping (v2.0)

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| basePath/assetPrefix still active (M1) | Phase 1 — VERCEL-01 | Vercel preview URL loads page at `/` not `/resume/` |
| Env vars missing in Vercel dashboard (M2) | Phase 2 — VERCEL-02 | Live URL header shows real email and phone |
| Double-deploy from old workflow (M3) | Phase 3 — VERCEL-03 | GitHub Actions tab shows zero failing runs after push |
| GitHub Pages still serving old build (M4) | Phase 4 — VERCEL-04 | `github.com/user/resume` Pages URL returns 404 or is disabled |

---

## Sources (v2.0)

- [next.config.js: basePath | Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath) — HIGH confidence
- [next.config.js: assetPrefix | Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/assetPrefix) — HIGH confidence
- [Common mistakes with the Next.js App Router | Vercel Blog](https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them) — HIGH confidence
- [How can I use GitHub Actions with Vercel? | Vercel KB](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel) — HIGH confidence
- [Feature Request: Token-less OIDC deployments | Vercel Community](https://community.vercel.com/t/feature-request-token-less-github-actions-deployments-via-oidc/15908) — confirms no OIDC support — MEDIUM confidence
- [NEXT_PUBLIC_ vars inlined at build time | vercel/next.js discussion](https://github.com/vercel/next.js/discussions/44628) — HIGH confidence
- [How can I use files in Vercel Functions? | Vercel KB](https://vercel.com/kb/guide/how-can-i-use-files-in-serverless-functions) — supports readFileSync-at-build-time analysis — MEDIUM confidence
- [next.config.js: reactCompiler | Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler) — HIGH confidence
- Codebase direct inspection: `next.config.ts`, `src/app/page.tsx`, `src/components/TechStackIcons.tsx`, `src/components/AnimateIn.tsx`, `.github/workflows/deploy.yml`, `node_modules/react-devicons/go/original/index.js`, `package.json` — HIGH confidence

---

---

# v3.0 Addendum: Bio, Duration Labels, Education Section, Typography Overhaul Pitfalls

**Scope:** Adding bio/intro paragraph, computed duration labels, education section, and typography + spacing overhaul to existing Next.js 16 + React 19 + Tailwind v4 + framer-motion 12 resume site on Vercel.
**Researched:** 2026-04-23
**Confidence:** HIGH — verified against live codebase (`src/types/resume.ts`, `src/data/resume.md`, `src/app/page.tsx`, `src/app/globals.css`, `src/components/WorkExperience.tsx`, `src/components/Header.tsx`, `src/components/animation/AnimateIn.tsx`); HIGH for Next.js 16 server/client boundary (local docs); HIGH for Tailwind v4 theme/typography behavior (Context7 official docs); MEDIUM for date math edge cases.

---

## Critical Pitfalls (v3.0)

---

### Pitfall N1: Adding `bio` to `ResumeData` Without Updating `resume.md` Causes a Runtime Cast Error

**What goes wrong:**
`page.tsx` uses `const resume = data as ResumeData` — a TypeScript `as` cast, not a validated parse. If `ResumeData` is updated to add a `bio` field but `resume.md` YAML frontmatter is not updated simultaneously, TypeScript is silently satisfied at build time (the cast always succeeds), but the live component receives `undefined` instead of a string. If the component renders `{resume.bio}` without a null guard, it renders nothing — or throws if it expects a string.

**Why it happens:**
`gray-matter` + `as` cast does not validate schema. Missing YAML keys return `undefined`, not an error. TypeScript `as` casts are a developer assertion, not a runtime check. The mismatch is invisible at build time.

**Consequences:**
Bio section renders blank on the live site. No build error, no runtime error in Next.js error boundary (undefined renders as nothing). The silence makes this hard to diagnose.

**Prevention:**
Make `bio` optional in the type (`bio?: string`) and guard the render with a conditional (`{resume.bio && <BioSection bio={resume.bio} />}`). Add the field to `resume.md` in the same commit as the type change. Check the live page visually after deploy — the bio section must be visible.

**Phase to address:** Bio/intro paragraph phase. Update type, YAML, and component atomically.

---

### Pitfall N2: Duration Calculation Using `new Date()` Gives Wrong Results for "YYYY-MM" Strings

**What goes wrong:**
The existing `formatDateRange` function in `WorkExperience.tsx` constructs dates as `new Date(Number(year), Number(month) - 1)`. Duration arithmetic that computes elapsed months between two `"YYYY-MM"` strings using `Date` subtraction (milliseconds divided by average month length) produces off-by-one errors for month boundaries. Using `new Date("YYYY-MM")` directly (without the explicit constructor) causes timezone-dependent parsing — the ISO-8601 month-only string is parsed as UTC midnight, which in negative-offset timezones (e.g., UTC-5) shifts to the previous day/month on the local clock.

**Why it happens:**
JavaScript's `Date` handles partial date strings inconsistently across runtimes. `new Date("2025-02")` parses as `2025-02-01T00:00:00Z` (UTC). In a UTC-5 timezone, `new Date("2025-02").getMonth()` returns 0 (January), not 1 (February). The explicit constructor pattern `new Date(year, month - 1)` used in the existing code avoids this, but is not used consistently in all new duration math.

**Consequences:**
A job that ran from Feb 2025 to Apr 2026 displays as "13 months" when the correct answer is 14 months. Off-by-one errors in month counts undercount tenure.

**Prevention:**
Implement duration calculation using the explicit constructor pattern already in the codebase: `new Date(Number(year), Number(month) - 1)`. Never parse `"YYYY-MM"` strings directly as `new Date(str)`. Compute elapsed months as `(endYear - startYear) * 12 + (endMonth - startMonth)`, then format as years + months. Add simple inline test cases in a comment next to the function: e.g., `// "2025-02" to "2026-04" = 14 months`.

**Phase to address:** Duration labels phase. Test against several real date ranges from `resume.md`.

---

### Pitfall N3: Duration Label for "Present" Entries Bakes In a Stale Date at Build Time

**What goes wrong:**
`page.tsx` is a Server Component that runs at build time on Vercel (it has no dynamic APIs: no `cookies()`, `headers()`, or `searchParams`). Next.js statically generates the page once during `next build`. The build-time `new Date()` for the "Present" end date is frozen into the generated HTML. If the page is not redeployed for six months, the duration label still shows the value from the last deploy date — not the actual current date.

**Why it happens:**
Static generation in Next.js 16 is the default behavior for pages with no dynamic APIs. The resume is intentionally static (confirmed in the existing PROJECT.md: "resume data is static YAML"), so there is no per-request recomputation.

**Consequences:**
The duration label for the current job drifts silently — it underreports tenure over time. A recruiter visiting the live URL 3 months after a deploy will see a number that is 3 months stale.

**Prevention — Option A (recommended):** Accept the limitation. The site is intentionally static. Add a small visual cue like "Updated April 2026" in the bio or footer to set expectations. The site redeploys on every push to master (Vercel git integration), so any resume.md content update refreshes all durations.

**Prevention — Option B:** Compute "as of today" duration on the client side. Extract the duration label into a `'use client'` component that calls `new Date()` on mount via `useEffect`. This adds client-side hydration for one small string — acceptable cost for correctness.

**Prevention — Option C:** Add a `revalidate` export to `page.tsx` to enable ISR (incremental static regeneration) so Vercel rebuilds the page periodically. However, PROJECT.md explicitly calls out "ISR / on-demand revalidation — resume data is static YAML" as out of scope. Avoid unless requirements change.

**Phase to address:** Duration labels phase. Choose Option A or B before shipping.

---

### Pitfall N4: Education Section Added to Page Without `AnimateIn` Wrapping Breaks Visual Consistency

**What goes wrong:**
The existing page layout wraps every section in `<AnimateIn delay={N}>` to produce the fade-in-on-scroll animation. If an `Education` component is added to `page.tsx` without an `AnimateIn` wrapper, it renders immediately (no animation) while all other sections animate in. This is visually jarring.

**Why it happens:**
`page.tsx` is a Server Component. `AnimateIn` is already a correctly placed `'use client'` wrapper. Developers sometimes skip the `AnimateIn` wrap when adding a new section in a hurry, thinking the animation is "just cosmetic."

**Consequences:**
Education section pops in without animation while all other sections fade in on scroll. The inconsistency is obvious to any viewer who scrolls the page.

**Prevention:** Every section added to `page.tsx` must be wrapped with `<AnimateIn delay={N}>`. Increment the delay value (each existing section uses 0, 0.1) — use 0.2 for a third section, 0.3 for a fourth. Check the rendered page by scrolling from fresh — confirm the education section fades in.

**Phase to address:** Education section phase.

---

### Pitfall N5: Typography Overhaul Breaks Existing Component-Level Spacing Assumptions

**What goes wrong:**
A global typography overhaul that changes `font-size`, `line-height`, or spacing tokens in `globals.css` via `@theme { }` can break the carefully tuned card layout in `WorkExperience.tsx`. Specifically: the timeline dot is positioned using absolute offsets (`top-5.5`, `-left-5.5`) that are calibrated to the existing card header's intrinsic height. If the typography overhaul changes font sizes or padding on the header row, the dot drifts off-alignment without any error.

**Why it happens:**
Tailwind v4 custom theme tokens set in `@theme {}` affect all utilities derived from those tokens globally. A change to `--text-base` or `--spacing` propagates to every component that uses `text-base`, `p-4`, etc. The timeline dot's absolute position was set empirically to match the current layout — it is not computed from the card's actual height.

**Consequences:**
Timeline dot misaligns vertically relative to company name. This is a visual regression that only appears after the typography overhaul is applied, not before.

**Prevention:** After any typography or spacing changes in `globals.css` or `@theme {}`, visually inspect the `WorkExperience` timeline at both mobile (375px) and desktop (1280px) widths to confirm dot alignment. Treat the timeline dot position values (`top-5.5`, `-left-5.5`) as fragile — they may need to be re-tuned after spacing changes.

**Phase to address:** Typography overhaul phase. Perform timeline alignment verification as the final check before shipping.

---

### Pitfall N6: New Sections in `ResumeData` Are Not Reflected in `resume.md` YAML — Build Succeeds but Data Is Missing

**What goes wrong:**
`resume.ts` type can be updated with `education?: EducationEntry[]`. The build succeeds. `resume.md` is not updated with an `education:` YAML key. `page.tsx` passes `resume.education` to the new `Education` component. The component renders an empty list silently. No error is thrown.

**Why it happens:**
gray-matter's `data as ResumeData` cast assigns `undefined` to any missing YAML key. Optional array fields (`field?: T[]`) allow `undefined` without TypeScript error. The component may guard with `if (!education?.length) return null` — correct defensively but means missing data is silent.

**Consequences:**
Education section silently absent on the live site despite the component being rendered in `page.tsx`. A common deploy error that only shows up visually.

**Prevention:** Add the `education:` block to `resume.md` in the same commit that adds the `EducationEntry` type and `Education` component. After deploy, open the live URL and verify the section is visible. Add a development guard in `page.tsx` to log a warning when `resume.education` is undefined: `if (!resume.education) console.warn("education missing from resume.md")`.

**Phase to address:** Education section phase.

---

## Moderate Pitfalls (v3.0)

---

### Pitfall N7: Bio Text with Markdown Bold/Italic Not Handled by `HighlightedBullet` Outside of `<li>` Context

**What goes wrong:**
`HighlightedBullet` takes a `children: string` prop and outputs `<span>` elements — it is designed to render inside an `<li>`. If a bio paragraph uses `**bold**` or `*italic*` syntax and is passed to `HighlightedBullet`, the component renders correctly but its parent must be a block element (`<p>`, `<div>`) not an inline one — otherwise the span chain produces unexpected rendering artifacts. More critically, if the bio content is rendered directly as `{resume.bio}` without parsing, the raw asterisk syntax appears as literal characters.

**Why it happens:**
`HighlightedBullet` was designed and tested in the context of `<li>` items. The component works outside that context, but the calling code needs to wrap it in a `<p>` or `<div>`, not an inline element.

**Prevention:** Re-use `HighlightedBullet` for bio text if bold/italic is desired. Wrap in `<p>` not a `<span>`. If bio should be plain text only, render `{resume.bio}` directly without the parser component. Decide which approach is used before implementing — do not mix both in the same codebase.

**Phase to address:** Bio/intro paragraph phase.

---

### Pitfall N8: `@theme inline` in `globals.css` — Custom Font Tokens Must Use Correct CSS Variable Naming Convention

**What goes wrong:**
The existing `globals.css` uses `@theme inline { --font-sans: var(--font-geist-sans); }`. If a typography overhaul adds new font-size or spacing tokens using incorrect variable naming (e.g., `--font-size-body` instead of the Tailwind v4 convention `--text-base`), the utilities do not generate. There are no errors — the `@theme` directive silently ignores unrecognized token patterns.

**Why it happens:**
Tailwind v4 has a specific naming convention for theme tokens. `--text-{scale}` generates `text-{scale}` utilities. `--color-{name}` generates color utilities. Custom variable names that do not match the pattern produce CSS variables but no utility classes.

**Prevention:** Follow Tailwind v4 naming conventions exactly when adding tokens to `@theme`:
- Font sizes: `--text-{scale}` (e.g., `--text-resume-body: 0.9375rem`)
- Colors: `--color-{name}`
- Spacing: `--spacing` (single multiplier in v4, not named steps)
Verify the utility generates by using it in a component and checking whether the browser applies the style.

**Phase to address:** Typography overhaul phase.

---

### Pitfall N9: Education Section Layout Reuses WorkExperience Patterns But Has Different Data Shape

**What goes wrong:**
Developers copy-paste the `WorkExperience` card structure for the `Education` component because the layout is similar. The `EducationEntry` type has a different shape (no `tech_stack`, no `bullets`, has `degree`, `institution`, `gpa` or `coursework`). TypeScript catches the field mismatches at compile time, but UI gaps — like an empty `<ul>` or a missing fallback — only appear at runtime.

**Why it happens:**
Code reuse instinct. The card markup is identical (border, shadow, padding) but the data binding differs.

**Prevention:** Copy the card's structural markup (border, rounded corners, shadow) but write fresh data binding for `EducationEntry` fields. Do not attempt to share the full component — only the CSS pattern. Define `EducationEntry` in `resume.ts` before implementing the component so TypeScript guides the correct field names from the start.

**Phase to address:** Education section phase.

---

### Pitfall N10: Tailwind v4 `@layer components` for Typography Overrides Conflicts with Utility Class Precedence

**What goes wrong:**
A common pattern for a typography overhaul is to add base styles in `globals.css` via `@layer base` or `@layer components` — for example, setting `h1`, `h2`, `h3`, `p` default styles. In Tailwind v4, the layer ordering is `base` < `components` < `utilities`. If `@layer base` sets `h2 { font-size: 1.25rem; }` but a component uses `className="text-xl font-semibold"`, the utility class (`text-xl`) wins as expected. However, if the overhaul uses `@layer components` (not `@layer base`) for element selectors, the precedence is less predictable when utilities are also applied.

**Why it happens:**
Tailwind v4's cascade model: utilities always win over `@layer base` and `@layer components`. However, non-layered CSS (CSS not inside any `@layer`) has higher specificity than layered CSS in Tailwind v4. Writing bare element selectors outside any layer will beat utility classes.

**Prevention:** Apply the typography overhaul exclusively through Tailwind utility classes in the component markup. If base styles are truly needed, put them in `@layer base` (not components, not unlayered). Never write element selectors outside `@layer` — they will override utility classes unexpectedly.

**Phase to address:** Typography overhaul phase.

---

## Minor Pitfalls (v3.0)

---

### Pitfall N11: `AnimateIn` Delay Values Produce Staggered Animation That Feels Slow With Many Sections

**What goes wrong:**
Current delays are 0 and 0.1. Adding an education section at 0.2 and a bio at the top with delay 0 (pushing others to 0.1, 0.2, 0.3) produces a stagger gap that feels sluggish on desktop, especially for users who scroll fast. With 4 sections at 0.4 seconds apart, a fast scroller sees sections still animating in as they reach the bottom of the page.

**Why it happens:**
The delay design was calibrated for 2 sections. Adding more sections extends the total animation time linearly.

**Prevention:** Keep stagger increments small: 0.05–0.08 seconds per section is sufficient for a perceptible cascade without slowness. With 4 sections: 0, 0.05, 0.10, 0.15 works well. The `duration` (currently 0.4s) is the dominant time — keep it, just tighten stagger gaps.

**Phase to address:** Education and bio phases — when the number of sections changes.

---

### Pitfall N12: Education Section Placed After Skills Instead of After Work Experience Disrupts Reading Order

**What goes wrong:**
Recruiters and hiring engineers expect resume content in this order: intro/bio → experience → skills → education. Placing the education section before skills (or at the very bottom after everything else) creates a non-standard reading flow. This is not a technical bug but a UX regression.

**Why it happens:**
Component ordering in `page.tsx` is arbitrary during implementation. Developers add the new section at the bottom of `page.tsx` for convenience.

**Prevention:** In `page.tsx`, add the education section in the correct canonical order: Header → Bio → WorkExperience → Skills (if present) → Education. The education section goes at the end per standard resume convention for senior engineers (experience is the primary selling point).

**Phase to address:** Education section phase.

---

### Pitfall N13: Bio `line-clamp` or Truncation Cuts Off Text on Mobile

**What goes wrong:**
A bio paragraph set with `line-clamp-3` (or `overflow: hidden; max-height: ...`) renders fine on desktop but truncates awkwardly on mobile due to narrower column width causing more line wrapping. The truncation may cut mid-sentence.

**Why it happens:**
Line count varies by viewport width. 3 lines at 1280px desktop may be 5 lines at 375px mobile. `line-clamp` operates on line count, not character count.

**Prevention:** Do not use `line-clamp` on the bio — show the full text. If the bio is long (more than 3–4 sentences), trim the content itself in `resume.md`. The web resume should always show the full bio without truncation.

**Phase to address:** Bio/intro paragraph phase.

---

## Technical Debt Patterns (v3.0)

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| `as ResumeData` cast without validation | Zero parsing code | Any new field mismatch is silent — blank UI, no error | Acceptable for solo dev controlling both type and YAML, but update both atomically |
| Hardcode "Present" end date from `new Date()` in Server Component | Zero client JS | Duration label drifts stale between deploys | Acceptable if redeploys happen on content updates; add client-side computation if staleness is unacceptable |
| Copy-paste card markup from WorkExperience to Education | Fast implementation | Duplicate markup diverges — style changes must be applied in two places | Acceptable for this milestone; extract a shared `ResumeCard` wrapper in a future cleanup pass |
| Empirical `top-5.5` dot offset in timeline | Exact visual alignment now | Breaks silently if typography or padding changes | Acceptable now — document it as fragile and check it after every typography change |

---

## Integration Gotchas (v3.0)

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `gray-matter` + `ResumeData` type | Adding new type fields without updating `resume.md` YAML | Update YAML and type in the same commit; visually verify section appears on live site |
| Tailwind v4 `@theme inline` | Using non-standard token names that do not generate utilities | Follow `--text-*`, `--color-*`, `--spacing` naming conventions exactly |
| `AnimateIn` wrapper | Adding sections without wrapping in `AnimateIn` | Every section in `page.tsx` must be wrapped with `<AnimateIn delay={N}>` |
| Duration math with `"YYYY-MM"` strings | Parsing with `new Date("YYYY-MM")` directly | Use explicit constructor: `new Date(Number(year), Number(month) - 1)` |
| `HighlightedBullet` in bio context | Wrapping in inline `<span>` as parent | Always wrap `HighlightedBullet` in a block element (`<p>` or `<div>`) outside of `<li>` |
| Static generation + `new Date()` for "Present" | Assuming `new Date()` in `page.tsx` runs at request time | On Vercel with no dynamic APIs, `page.tsx` is statically generated at build time — `new Date()` runs once at deploy |

---

## "Looks Done But Isn't" Checklist (v3.0)

- [ ] **Bio visible:** Open live URL — bio paragraph renders below name/title, above work experience. Not blank.
- [ ] **Duration labels correct:** Check each work entry — duration label shows correct year/month count. Manually verify one entry against known dates.
- [ ] **Education section visible:** Education section renders with degree, institution, and date range. Not blank or missing.
- [ ] **Timeline dot alignment intact:** After typography changes, scroll through WorkExperience — all timeline dots align with card title rows. Test at 375px and 1280px.
- [ ] **All sections animate:** Scroll from top on fresh page load — bio, work experience, and education all fade in with stagger animation. Education is not a static pop-in.
- [ ] **No raw asterisks:** Check bio and any markdown-formatted text — no `**bold**` or `*italic*` literal syntax visible in browser.
- [ ] **`resume.md` has all new fields:** Verify YAML frontmatter contains `bio:` and `education:` keys with real data.
- [ ] **TypeScript strict passes:** `npm run build` completes without type errors — confirms `ResumeData` type matches the data being passed.

---

## Recovery Strategies (v3.0)

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Bio blank on live site (missing YAML key) | LOW | Add `bio:` to `resume.md`, push — Vercel redeploys in ~1 min |
| Duration label off-by-one | LOW | Fix arithmetic in the duration function, push |
| Education section blank (missing YAML) | LOW | Add `education:` block to `resume.md`, push |
| Timeline dot misaligned after typography change | LOW | Adjust `top-*` and `-left-*` values on the dot element in `WorkExperience.tsx` |
| Missing `AnimateIn` wrapper on new section | LOW | Wrap the section in `<AnimateIn delay={N}>` in `page.tsx`, push |

---

## Pitfall-to-Phase Mapping (v3.0)

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Missing bio YAML key (N1) | Bio/intro paragraph phase | Live URL shows bio text below title |
| Duration off-by-one from `new Date()` (N2) | Duration labels phase | Manual spot-check of 2+ entries against calendar |
| Stale "Present" duration after deploy (N3) | Duration labels phase | Document limitation or implement client-side fallback |
| Missing `AnimateIn` on education section (N4) | Education section phase | Scroll test on live URL — education fades in |
| Typography overhaul breaks timeline dot (N5) | Typography overhaul phase (final check) | Visual inspection at 375px and 1280px |
| Education YAML missing from `resume.md` (N6) | Education section phase | Live URL shows education section with real data |
| Bio rendered without markdown parsing (N7) | Bio/intro paragraph phase | No raw asterisks visible in browser |
| Wrong `@theme` token names (N8) | Typography overhaul phase | Browser devtools confirms utility class applies expected value |
| Education reuses WorkExperience shape incorrectly (N9) | Education section phase | TypeScript build passes; no empty `<ul>` rendered |
| Typography `@layer` conflicts with utilities (N10) | Typography overhaul phase | All component utility classes take effect as expected |

---

## Sources (v3.0)

- Codebase direct inspection: `src/types/resume.ts`, `src/data/resume.md`, `src/app/page.tsx`, `src/app/globals.css`, `src/components/WorkExperience.tsx`, `src/components/Header.tsx`, `src/components/HighlightedBullet.tsx`, `src/components/animation/AnimateIn.tsx` — HIGH confidence
- Next.js 16 Server Components docs (local): `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — HIGH confidence
- Next.js 16 upgrading guide (local): `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` — confirmed static generation behavior for pages with no dynamic APIs — HIGH confidence
- Tailwind v4 `@theme` directive docs: Context7 `/tailwindlabs/tailwindcss.com` query "v4 custom theme CSS variables @theme" — HIGH confidence
- Tailwind v4 upgrade guide (breaking changes): Context7 `/tailwindlabs/tailwindcss.com` query "v4 breaking changes renamed utilities removed" — HIGH confidence
- JavaScript `Date` constructor timezone behavior with `"YYYY-MM"` strings — MDN Web Docs standard — HIGH confidence
- `gray-matter` YAML parsing behavior (undefined keys) — known library behavior, MEDIUM confidence

---

---

# v4.0 Addendum: shadcn/ui Full Design System Integration Pitfalls

**Scope:** Adding shadcn/ui (Card, Badge, Separator) to existing Next.js 16.2.3 + React 19.2.4 + Tailwind v4 + Biome resume site on Vercel.
**Researched:** 2026-04-24
**Confidence:** HIGH for Tailwind v4 compatibility and React 19 support (Context7 + official shadcn docs confirmed); LOW for Next.js 16 specifics (shadcn targets Next.js 15; 16 is untested in official docs).

---

## Tailwind v4 Compatibility — Official Status

**shadcn/ui IS fully compatible with Tailwind v4. Confirmed HIGH confidence.**

As of February 2025, all shadcn/ui components were comprehensively updated for Tailwind v4 and React 19. The `npx shadcn@latest init` CLI detects Tailwind v4 and generates a CSS-first configuration automatically — no `tailwind.config.js` is needed or created. The `tailwind.config` field in `components.json` must be left blank for v4 projects.

Source: https://ui.shadcn.com/docs/tailwind-v4 | https://ui.shadcn.com/docs/changelog/2025-02-tailwind-v4

---

## Critical Pitfalls (v4.0)

---

### Pitfall S1: `shadcn init` Overwrites `globals.css` — Destroys Geist Font Mappings

**Phase:** Init (Phase 1 of milestone)

**What goes wrong:** `npx shadcn@latest init` rewrites `globals.css` with its own `:root` CSS variable block and `@theme inline` directives. The current `globals.css` has this `@theme inline` block:
```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

Running `init` without a backup plan will destroy the `--font-sans` and `--font-mono` Geist mappings. After init, `layout.tsx` still injects `--font-geist-sans` / `--font-geist-mono` as CSS variables on `<html>`, but without the `@theme inline` bridge, the Tailwind `font-sans` utility no longer resolves to Geist — the body reverts to `system-ui`.

**Why it happens:** shadcn's init performs a merge-then-write on `globals.css`. The merge logic is designed for its own expected schema and does not preserve arbitrary `@theme inline` entries.

**Consequences:** Body font reverts to `system-ui`. The font change is subtle and easy to miss unless specifically checked.

**Prevention:**
1. Commit all changes before running `init` so `git diff` shows exactly what changed.
2. After init, manually restore the Geist font mappings in `@theme inline`:
   ```css
   @theme inline {
     /* shadcn color mappings -- keep all of these */
     --color-background: var(--background);
     /* ... all shadcn color variables ... */

     /* Manually restore these */
     --font-sans: var(--font-geist-sans);
     --font-mono: var(--font-geist-mono);
   }
   ```
3. After init, check body font in DevTools — confirm `font-family` resolves to Geist, not system-ui.

**Detection:** Open the site after init. If the font changes visibly to a system sans-serif (Inter-ish → system default), the Geist mapping was dropped.

---

### Pitfall S2: Existing Hex Color Variables Incompatible With shadcn's HSL Color System

**Phase:** Init (Phase 1 of milestone)

**What goes wrong:** shadcn/ui v4 expects CSS color variables in `hsl()` format inside `:root`, then maps them via `@theme inline` without the `hsl()` wrapper. The current `globals.css` uses raw hex values:
```css
--background: #fafafa;
--foreground: #18181b;
```

shadcn components reference `bg-background`, `text-foreground`, etc. through the `--color-*` variables in `@theme inline`. If shadcn's init generates:
```css
@theme inline {
  --color-background: hsl(var(--background));
}
```
...but `--background` is `#fafafa` (a hex value), then `hsl(#fafafa)` is invalid CSS. Component backgrounds render transparent or incorrect.

**Why it happens:** shadcn's theming convention bridges CSS variables to Tailwind utilities using `hsl()` wrapping. Hex values are not valid inside `hsl()`.

**Consequences:** Components render with wrong or transparent colors. The issue is silent — no build error, components simply look wrong.

**Prevention:** Before or immediately after init, convert existing color variables to HSL format:
```css
/* Before */
--background: #fafafa;
--foreground: #18181b;

/* After (shadcn-compatible) */
--background: hsl(0 0% 98%);      /* #fafafa */
--foreground: hsl(240 3.7% 15.9%); /* #18181b */
```

The shadcn v4 pattern uses the full `hsl()` value in `:root`, then maps directly:
```css
@theme inline {
  --color-background: var(--background); /* no hsl() wrapper here */
}
```

**Detection:** Inspect a shadcn component in browser DevTools. If `background-color: hsl(#fafafa)` appears (invalid CSS), the format mismatch is present.

---

### Pitfall S3: `tw-animate-css` Package Not Auto-Installed for Existing Projects

**Phase:** Init (Phase 1 of milestone)

**What goes wrong:** shadcn/ui migrated from `tailwindcss-animate` to `tw-animate-css` in early 2025. When init runs on an existing project, it adds `@import "tw-animate-css"` to `globals.css` but may not install the package itself. Adding any animated component (Accordion, Dialog, Sheet, Tooltip, etc.) then fails:
```
Error: Can't resolve 'tw-animate-css'
```

This is confirmed in GitHub Issue #6970 affecting existing projects.

**Why it happens:** The init script's dependency install step may skip `tw-animate-css` if it considers the CSS import sufficient. The package isn't in `package.json` so the bundler can't resolve it.

**Consequences:** Build fails on any component using CSS animations — which is most interactive shadcn components. The error only surfaces after adding a component, not at init time.

**Prevention:** After `shadcn init`, immediately check that `tw-animate-css` appears in `package.json`. If absent:
```bash
npm install tw-animate-css
```
Also verify `globals.css` has the import and NOT the old plugin syntax:
```css
/* Correct */
@import "tw-animate-css";

/* Wrong (old) — remove if present */
@plugin 'tailwindcss-animate';
```

**Detection:** `npm run build` fails with `Can't resolve 'tw-animate-css'`. Or proactively check `package.json` after init.

---

### Pitfall S4: React 19 Peer Dependency ERESOLVE Blocks `npm install` During Init

**Phase:** Init (Phase 1 of milestone)

**What goes wrong:** This project uses React 19.2.4. Some shadcn dependencies (Radix UI packages, `@radix-ui/react-icons`) still declare peer dependencies only up to `react@"^18.0"`. npm's strict resolver rejects this:
```
npm error ERESOLVE unable to resolve dependency tree
npm error peer react@"^16.8 || ^17.0 || ^18.0" from @radix-ui/react-dialog
```

**Why it happens:** Peer dependency ranges haven't universally been updated to include `^19.0`. pnpm and bun handle this silently; npm strict mode rejects it.

**Consequences:** Init fails entirely, leaving no `components.json` and no installed dependencies.

**Prevention:** Use `--legacy-peer-deps` with npm for init and ALL subsequent `shadcn add` commands:
```bash
npx shadcn@latest init --legacy-peer-deps
npx shadcn@latest add badge --legacy-peer-deps
```

Or add to `.npmrc` in the project root to apply globally:
```
legacy-peer-deps=true
```

Alternatively, switch to pnpm — it handles peer dep conflicts without flags and is officially recommended for React 19 projects by the shadcn docs.

**Detection:** npm install output contains `ERESOLVE` and mentions `react@"^18"` peer requirement.

---

## Moderate Pitfalls (v4.0)

---

### Pitfall S5: `components.json` Alias Misconfiguration for `src/` Directory

**Phase:** Init (Phase 1 of milestone)

**What goes wrong:** The shadcn init prompt asks for path aliases. If the generated `components.json` aliases don't match the project's `tsconfig.json` path mappings, component imports fail at build time with module-not-found errors. The most common misconfiguration: the aliases default to `@/components` but the project's `@/` maps to `./src/` — which is correct and expected.

**Prevention:** Verify `tsconfig.json` has the `src/` alias configured:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
The correct `components.json` for this project:
```json
{
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css"
  }
}
```

Note: `tailwind.config` must be empty string (not a path) for Tailwind v4 projects.

---

### Pitfall S6: Server Component vs Client Component — Interactive shadcn Components Need `"use client"` Boundaries

**Phase:** Component replacement phases (ongoing)

**What goes wrong:** Many shadcn components include `"use client"` at the top of their file because they use React hooks or event handlers internally. When `rsc: true` is set in `components.json` (required for App Router), the CLI adds `"use client"` automatically to components that need it. Problems arise when:

1. Developers assume all shadcn components are server-safe and import interactive ones directly into Server Components.
2. The `"use client"` boundary is placed too deep — a component file without `"use client"` imports from a shadcn file that has it, causing React to complain about client-only APIs being used in a server context.

**Prevention:** The three target components for this milestone — Card, Badge, and Separator — are all non-interactive presentational primitives. They do NOT require `"use client"` and are safe to import directly into Server Components. This is the low-risk path.

The existing `AnimateIn` client wrapper pattern is the right model for any future interactive shadcn components: wrap them at the section boundary, keep Server Components clean.

**Detection:** Build error: "You're importing a component that needs `useState`. It only works in a Client Component..." — this means `"use client"` is missing from the importing file.

---

### Pitfall S7: Biome Linter Flags shadcn-Generated Component Code

**Phase:** Init and each component addition (ongoing)

**What goes wrong:** This project uses Biome instead of ESLint. shadcn generates standard TypeScript/TSX targeting ESLint assumptions. Generated components may include patterns Biome flags as errors:
- Unused imports (e.g., `import * as React from "react"` when JSX transform is configured)
- Explicit `any` types in utility functions
- Import ordering violations
- `class` attribute instead of `className` (rare but possible in some templates)

**Why it happens:** The shadcn CLI does not detect or respect Biome configuration. It generates ESLint-compatible code.

**Consequences:** `npm run lint` fails after adding components, blocking any CI gate that checks lint.

**Prevention:** After adding each component, run `npm run lint` immediately. Use `npm run format` to auto-fix formatting issues first. For remaining errors in generated files that are false positives, add targeted Biome suppression comments rather than disabling rules globally:
```tsx
// biome-ignore lint/style/useImportType: shadcn generated
import * as React from "react"
```

---

### Pitfall S8: `cn()` Custom Class Groups — `tailwind-merge` Doesn't Know About Project's Custom Utilities

**Phase:** Component replacement phases (ongoing)

**What goes wrong:** shadcn/ui uses `tailwind-merge` via the `cn()` utility in `src/lib/utils.ts`. When passing className overrides to shadcn components, `tailwind-merge` resolves conflicting Tailwind class groups. However, `tailwind-merge` only knows about standard Tailwind class groups by default. Custom utilities defined via `@utility` in `globals.css` (or project-specific patterns like `bg-zinc-pill`) are unknown to `tailwind-merge` and may be incorrectly dropped when they appear alongside standard background utilities.

**Why it happens:** `tailwind-merge` maintains a class group registry. Custom utilities outside the standard Tailwind scale are not registered.

**Consequences:** Custom class names may be silently dropped when merged with standard classes via `cn()`. Visual regressions with no error.

**Prevention:** For a resume site this is a minor risk — the custom utilities (`bg-zinc-pill`) are applied without competing standard background classes. If conflicts surface, configure a custom `twMerge` using `extendTailwindMerge`:
```ts
import { extendTailwindMerge } from "tailwind-merge"
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "bg-color": [{ bg: ["zinc-pill"] }],
    },
  },
})
```

---

### Pitfall S9: Next.js 16 Untested With shadcn CLI — Potential Detection Failures

**Phase:** Init (Phase 1 of milestone)

**Confidence:** LOW — no official documentation or community reports specifically address Next.js 16 + shadcn compatibility. This is extrapolated from known Next.js 15 support.

**What goes wrong:** shadcn/ui documentation targets Next.js 15. This project runs 16.2.3. The shadcn CLI detects the Next.js version during init to configure `rsc`, `tsx`, and other settings. If it doesn't recognize Next.js 16, it may:
- Default to older behavior (RSC disabled)
- Misconfigure `components.json`
- Generate components with deprecated patterns from Next.js 14/15

**Prevention:** During init, explicitly verify the generated `components.json` has `"rsc": true`. If the CLI auto-configures it incorrectly, set it manually before adding any components. After init, add one simple component (Badge) and confirm it renders correctly in a Server Component before doing a full swap.

---

## Minor Pitfalls (v4.0)

---

### Pitfall S10: `forwardRef` Removal in React 19 — Type Signature Differences

**Phase:** Component replacement phases (ongoing)

**What goes wrong:** React 19 removed `forwardRef`. New shadcn components no longer use it. However, if the project somehow has older cached shadcn component versions or uses `shadcn-ui@latest` (old package) instead of `shadcn@latest` (new package), generated components may use the old `forwardRef` pattern, which works but TypeScript types differ for `ref` prop passing.

**Prevention:** Always use `npx shadcn@latest` (not `npx shadcn-ui@latest` — that package is deprecated). The `--overwrite` flag updates existing components to the latest version when needed:
```bash
npx shadcn@latest add badge --overwrite
```

---

### Pitfall S11: Dark Mode CSS Variables Need Complete Redefinition in `.dark`

**Phase:** Future dark mode work (not current milestone, but plant the flag)

**What goes wrong:** When dark mode is added later (listed as a future requirement in PROJECT.md), shadcn's `.dark` class requires that ALL theme variables in `:root` be redefined with dark values. Tailwind v4 uses `@theme inline` to bridge CSS variables to utilities — missing variables in `.dark` cause components to inherit light-mode colors in dark mode, appearing washed out or unreadable.

**Prevention:** This is a future concern. When implementing dark mode, follow shadcn's complete `.dark` variable set from the official theming docs exactly. Do not partially define `.dark` variables.

---

### Pitfall S12: Tailwind Preflight Reset Changes Inherited Browser Styles

**Phase:** After init (visual audit)

**What goes wrong:** If shadcn init adds Tailwind Preflight-based resets to `globals.css` (or if Preflight was not previously active), browser defaults are normalized — removing default margins on headings, normalizing `<ul>` list styles, setting `box-sizing: border-box`. Existing components that relied on inherited browser defaults may visually regress.

**Prevention:** After init, do a full visual pass through the page before touching any components. Identify any regressions from Preflight and add explicit Tailwind classes to restore the intended behavior. Note: since this project already uses Tailwind v4 which applies Preflight by default, this risk is LOW — Preflight is likely already active.

---

## Phase-Specific Warnings (v4.0)

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|----------------|------------|
| `shadcn init` | `globals.css` overwrite destroys Geist font mappings (S1) | Commit first; manually restore `--font-sans`/`--font-mono` in `@theme inline` after init |
| `shadcn init` | Hex color variables break shadcn HSL system (S2) | Convert `--background`/`--foreground` to `hsl()` format before or after init |
| `shadcn init` | `tw-animate-css` not installed (S3) | Run `npm install tw-animate-css` explicitly after init |
| `shadcn init` with npm + React 19 | ERESOLVE peer dep blocks install (S4) | Use `--legacy-peer-deps` or add to `.npmrc` |
| `shadcn init` | `components.json` alias misconfigured (S5) | Verify `tailwind.config` is blank string; verify CSS path points to `src/app/globals.css` |
| Card replacement | Low risk — Card is Server Component safe (S6 N/A) | No `"use client"` needed |
| Badge replacement | Low risk — Badge is Server Component safe (S6 N/A) | No `"use client"` needed |
| Separator replacement | Low risk — Separator is Server Component safe (S6 N/A) | No `"use client"` needed |
| After each `shadcn add` | Biome lint fails on generated code (S7) | Run `npm run lint` immediately; add targeted `biome-ignore` comments |
| Custom utility classes in `cn()` | `tailwind-merge` drops project-specific utilities (S8) | Test zinc-pill and other custom utilities explicitly |
| Next.js 16 detection | CLI may not recognize v16 correctly (S9) | Manually verify `"rsc": true` in `components.json` |
| Future dark mode | `.dark` class requires complete variable redefinition (S11) | Follow shadcn theming docs exactly when adding dark mode |

---

## "Looks Done But Isn't" Checklist (v4.0)

- [ ] **Font still Geist:** After init, confirm body font renders in Geist (not system-ui) in browser DevTools.
- [ ] **Color variables correct:** Add a shadcn Badge to a test page — confirm `bg-primary`, `text-primary-foreground` render with correct colors.
- [ ] **`tw-animate-css` installed:** Check `package.json` — `tw-animate-css` appears in dependencies.
- [ ] **`components.json` correct:** `tailwind.config` is `""` (not a path); `css` points to `src/app/globals.css`; `rsc` is `true`.
- [ ] **No ERESOLVE errors:** `npm install` (or `shadcn add`) completes without ERESOLVE. Use `--legacy-peer-deps` if needed.
- [ ] **Biome passes:** `npm run lint` succeeds after each component addition.
- [ ] **Shadcn Card renders correctly:** Replace one hand-rolled card with shadcn Card — confirms full integration working before bulk replacement.
- [ ] **No raw asterisks or broken content:** Existing `HighlightedBullet`, tech stack icons, and timeline elements all render correctly after shadcn styles are applied.
- [ ] **Build succeeds:** `npm run build` completes without errors after all component replacements.

---

## Recovery Strategies (v4.0)

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Geist font lost after init | LOW | Add `--font-sans: var(--font-geist-sans)` back to `@theme inline` in `globals.css`, push |
| Color variables broken | LOW | Convert hex values to `hsl()` format in `:root`, push |
| `tw-animate-css` missing | LOW | `npm install tw-animate-css`, push |
| ERESOLVE during install | LOW | Add `legacy-peer-deps=true` to `.npmrc`, re-run init |
| Wrong `components.json` aliases | LOW | Edit `components.json` manually, re-add components |
| Biome lint failures in generated files | LOW | Add targeted `biome-ignore` comments, `npm run format` |
| Wrong component renders after replacement | LOW | `npx shadcn@latest add <component> --overwrite` to get latest version |

---

## Sources (v4.0)

- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) — PRIMARY: confirms v4 compatibility, CSS variable migration, tw-animate-css migration — HIGH confidence
- [shadcn/ui React 19 docs](https://ui.shadcn.com/docs/react-19) — confirms React 19 support, `--legacy-peer-deps` workaround — HIGH confidence
- [shadcn/ui Changelog February 2025](https://ui.shadcn.com/docs/changelog/2025-02-tailwind-v4) — confirms all components updated for v4 + React 19 — HIGH confidence
- [shadcn/ui components.json docs](https://ui.shadcn.com/docs/components-json) — confirms `tailwind.config` blank for v4; `rsc` behavior — HIGH confidence
- [GitHub Issue #6970: tw-animate-css not found on existing projects](https://github.com/shadcn-ui/ui/issues/6970) — confirms missing package bug — HIGH confidence (reproduced bug)
- [GitHub Discussion #6646: CLI overwrites CSS variables](https://github.com/shadcn-ui/ui/discussions/6646) — confirms init overwrites globals.css — MEDIUM confidence
- [shadcn/ui Troubleshooting](https://eastondev.com/blog/en/posts/dev/20260402-shadcn-ui-troubleshooting/) — style conflicts, TypeScript errors breakdown — MEDIUM confidence
- [Tailwind v4 + shadcn Dropdown transparent after upgrade](https://github.com/tailwindlabs/tailwindcss/discussions/17137) — real-world CSS variable conflict example — MEDIUM confidence
- Context7 `/shadcn-ui/ui` — React 19 peer dependency docs — HIGH confidence
- Context7 `/llmstxt/ui_shadcn_llms_txt` — components.json, `cn()` utility, RSC/client boundaries — HIGH confidence
- Codebase direct inspection: `src/app/globals.css`, `src/app/layout.tsx`, `package.json` — HIGH confidence
