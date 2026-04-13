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
