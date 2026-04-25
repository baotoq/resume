# Add PDF Print Design

Date: 2026-04-25
Status: Approved (pending spec review)

## Goal

Let visitors download a PDF version of the resume site that looks identical to the rendered web page (resting state). Two paper sizes — A4 and US Letter. PDFs regenerate automatically as part of `npm run build` so they never go stale.

## Non-goals

- ATS-flat / text-only resume variant (different artifact, future work).
- Per-request PDF generation (overkill for a static site).
- PDF byte-level snapshot tests (flaky, low ROI).

## Approach: pre-rendered with headless Chromium

Use Playwright (already a devDependency via `@playwright/test`) to render the built site in headless Chromium and capture two PDFs at build time. Same engine that renders the live site renders the PDF — so fonts, oklch colors, gradients, shadcn styles, and layout are 1:1 by construction.

The PDFs ship as static assets in `public/`, served from the same static export as the rest of the site.

## Architecture & build flow

```
npm run build
  ├─ next build              → out/ static export
  ├─ node scripts/build-pdf.mjs
  │     1. start static server on out/
  │     2. launch playwright chromium
  │     3. navigate to http://localhost:PORT/?print=1
  │     4. await network idle + document.fonts.ready
  │     5. page.pdf({ format: "A4",     path: "public/to-quoc-bao-resume-a4.pdf" })
  │     6. page.pdf({ format: "Letter", path: "public/to-quoc-bao-resume-letter.pdf" })
  │     7. shutdown server + browser
  └─ next build              → out/ now contains the two PDFs in static export
```

Two `next build` passes: PDFs must live in `public/` so the static export copies them to `out/`. First build renders the site → PDF script writes to `public/` → second build packages PDFs as routable assets. Adds ~10–15s to total build.

The `?print=1` query param signals print mode. The page itself is also visitable at `/?print=1` in a normal browser to preview the exact PDF look without downloading.

## Print mode detection (`?print=1`)

`page.tsx` is a server component; it reads `searchParams.print` and threads `isPrint` into the tree:

```tsx
export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const isPrint = sp.print === "1";
  // ...
  return <main data-print={isPrint || undefined} ...>
}
```

Component changes:
- `<AnimateIn>` — when `isPrint`, render children directly (skip framer-motion). Static end-state.
- `<WorkExperience>` — drop the pulse ring node when `isPrint`.
- `<DownloadResumePill>` — not rendered when `isPrint` (PDFs shouldn't advertise their own download button).

CSS — additions in `globals.css`:

```css
[data-print] .page-grain { display: none; }
[data-print] .hover-lift { transform: none !important; transition: none; }
[data-print] .card-gradient-hover::after { opacity: 0.22 !important; }
```

No `@media print` rules — Playwright runs `emulateMedia({ media: "screen" })` so what we see at `?print=1` IS what the PDF captures. Single source of truth.

## UI: download dropdown pill

New component `src/components/DownloadResumePill.tsx`. Lives in the contact pill row in `Header.tsx` alongside Email/Phone/GitHub/LinkedIn.

```
[Download PDF ▾]
   ├─ A4
   └─ US Letter
```

Implementation:
- Use `radix-ui` `DropdownMenu` (already a dep) — or run `npx shadcn add dropdown-menu` for the shadcn wrapper.
- Match `ContactPill` styling: rounded-full border, same hover treatment, same focus ring.
- `ChevronDown` icon from `lucide-react` (already a dep).
- Items are native `<a href="/to-quoc-bao-resume-a4.pdf" download>` — no JS needed for the actual download. Browser save dialog triggered by `download` attribute.
- Trigger has `aria-label="Download resume as PDF"`. Keyboard-accessible via radix.

In `?print=1` mode the pill is not rendered.

## Build script: `scripts/build-pdf.mjs`

```js
import { chromium } from "playwright";
import { createServer } from "node:http";
import handler from "serve-handler";

const PORT = 4321;
const OUT_DIR = "out";
const PUBLIC_DIR = "public";

const server = createServer((req, res) =>
  handler(req, res, { public: OUT_DIR })
);
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
await page.emulateMedia({ media: "screen" });
await page.goto(`http://localhost:${PORT}/?print=1`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

const common = {
  printBackground: true,
  preferCSSPageSize: false,
  margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" },
};

await page.pdf({ ...common, format: "A4",     path: `${PUBLIC_DIR}/to-quoc-bao-resume-a4.pdf` });
await page.pdf({ ...common, format: "Letter", path: `${PUBLIC_DIR}/to-quoc-bao-resume-letter.pdf` });

await browser.close();
server.close();
```

Notes:
- `printBackground: true` preserves gradients and accent colors.
- 12mm margins roughly match the site's existing `py-12 px-4` rhythm without feeling edge-tight.
- Viewport 900×1200 keeps the `max-w-3xl` (768px) container at full desktop layout — no mobile breakpoint.

## Package changes

`package.json`:

```json
{
  "scripts": {
    "build": "next build && node scripts/build-pdf.mjs && next build",
    "build:pdf": "node scripts/build-pdf.mjs"
  },
  "dependencies": {
    // ...
    "serve-handler": "^6.x"
  },
  "devDependencies": {
    // promote playwright from transitive (@playwright/test) to direct dep
    "playwright": "^1.x"
  }
}
```

`build:pdf` is a convenience for local re-runs after the first `next build` already produced `out/`.

`.gitignore`:
```
public/to-quoc-bao-resume-a4.pdf
public/to-quoc-bao-resume-letter.pdf
```

PDFs are build artifacts, not source.

## Testing

Unit (vitest):
- `DownloadResumePill.test.tsx` — renders trigger, opens menu, both items have correct `href` + `download` attribute.
- Existing `page` test (or new) — when `searchParams.print === "1"`, `data-print` attribute is set, `AnimateIn` renders static children, no pulse ring node.

E2E (playwright, `e2e/`):
- `pdf.spec.ts` — navigate to `/?print=1`, assert page-grain hidden, no pulse ring node, dropdown pill not rendered.

Manual one-time build verification:
- After first successful `npm run build`, open both PDFs.
- Confirm: text selectable, no animation artifacts, gradients preserved, fits cleanly across pages.

CI:
- GitHub Actions already runs `npm run build`. Chromium binary downloads on first cache miss (~30s), cached after. Net build-time impact ~15s.

## Files

New:
- `scripts/build-pdf.mjs`
- `src/components/DownloadResumePill.tsx`
- `src/components/DownloadResumePill.test.tsx`
- `src/components/ui/dropdown-menu.tsx` (if added via shadcn CLI)
- `e2e/pdf.spec.ts`
- `docs/superpowers/specs/2026-04-25-add-pdf-print-design.md` (this file)

Modified:
- `src/app/page.tsx` — read `searchParams.print`, thread `isPrint`, set `data-print` attribute
- `src/app/globals.css` — add `[data-print]` rules
- `src/components/Header.tsx` — render `<DownloadResumePill />` in pill row when not in print mode
- `src/components/animation/AnimateIn.tsx` — accept/respect `isPrint` (or read via context)
- `src/components/WorkExperience.tsx` — drop pulse ring when `isPrint`
- `package.json` — scripts + deps
- `.gitignore` — generated PDF paths

## Risks & open questions

- **`AnimateIn` prop threading**: passing `isPrint` to every `AnimateIn` site is noisy. Consider a small `PrintModeContext` provider in `page.tsx` that components read via `useContext`. Decide during implementation.
- **Two-pass build**: doubles `next build` cost. If unacceptable, fallback is writing PDFs directly to `out/` after the first build (skip the second build) — accepted tradeoff is that PDFs aren't browsable in `next dev` until `next build` has run once.
- **Font loading on headless Chromium**: Geist fonts are loaded via `next/font/google`. They should be inlined into the static export, but `document.fonts.ready` after `networkidle` is the safety net.
- **Resume length**: current resume likely runs 2 pages on A4 with the chosen margins. Page break behavior is delegated to Chromium's default; if a section breaks awkwardly, add `break-inside: avoid` rules under `[data-print]` for `<Card>` elements (deferred until observed).
