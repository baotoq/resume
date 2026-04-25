# Add PDF Print Design

Date: 2026-04-25
Status: Approved (pending spec review)

## Goal

Let visitors download a PDF version of the resume site that looks identical to the rendered web page (resting state). Two paper sizes — A4 and US Letter. PDFs regenerate automatically as part of `npm run build` so they never go stale.

## Non-goals

- ATS-flat / text-only resume variant (different artifact, future work).
- Per-request PDF generation (overkill for a static site).
- PDF byte-level snapshot tests (flaky, low ROI).
- Migrating the project to static export (`output: "export"`). Current default Next.js server output is assumed throughout. (If the project later moves to static export, re-evaluate the build flow — see "Future static-export note".)

## Approach: pre-rendered with headless Chromium

Use Playwright (already a devDependency via `@playwright/test`) to render the running site in headless Chromium and capture two PDFs at build time. Same engine that renders the live site renders the PDF — so fonts, oklch colors, gradients, shadcn styles, and layout are 1:1 by construction.

The PDFs are written to `public/`. Default Next.js serves files in `public/` at the URL root, so the assets are reachable at `/to-quoc-bao-resume-a4.pdf` and `/to-quoc-bao-resume-letter.pdf` without any rebuild.

## Print mode signal: `data-print` attribute set by Playwright

The page does NOT read a query param. Instead, the Playwright capture script sets `<html data-print>` via `page.addInitScript(...)` BEFORE the page's own JavaScript runs, and emulates `prefers-reduced-motion: reduce` so framer-motion-driven animations skip to their end state automatically. CSS keys off `[data-print]` for the rest.

This sidesteps three problems flagged in spec review:
1. `src/app/page.tsx` has `export const dynamic = "force-static"`, which forces request-time APIs (including `searchParams`) to empty values. No server-side read is attempted, so the conflict is avoided entirely.
2. No URL contract means no risk of someone visiting `/?print=1` and accidentally landing in a half-styled state.
3. `AnimateIn` already honors `prefers-reduced-motion` (per commit `02f0682`); emulating `reducedMotion: "reduce"` reuses that path.

CSS additions split across two files (only `.hover-lift` and `.card-gradient-hover` are global utilities in `globals.css`; `.pageGrain` is a CSS Module class in `page.module.css` and must be addressed there):

`globals.css`:

```css
[data-print] .hover-lift { transform: none !important; transition: none; }
[data-print] .card-gradient-hover::after { opacity: 0.22 !important; }

/* Hide the download dropdown in PDF output */
[data-print] [data-pdf-trigger] { display: none; }

/* Page-break hygiene for the PDF output */
[data-print] section { break-inside: avoid; page-break-inside: avoid; }
[data-print] h2 { break-after: avoid; page-break-after: avoid; }
```

`page.module.css` (CSS Modules — use `:global([data-print])` so the attribute selector isn't scoped):

```css
:global([data-print]) .pageGrain::before { display: none; }
```

**Pulse ring is already handled.** `WorkExperience.module.css` already contains `@media (prefers-reduced-motion: reduce) { .animatePulseRing { animation: none; } }`. Playwright's `emulateMedia({ reducedMotion: "reduce" })` triggers that rule and the pulse stops. No new CSS needed for it.

**Hover and gradient freezing.** The `.hover-lift` and `.card-gradient-hover::after` rules above ensure those utilities sit at their default (non-hover) state during the capture, since `page.pdf()` doesn't simulate hover.

## UI: download dropdown pill

New component `src/components/DownloadResumePill.tsx`. Lives in the contact pill row in `Header.tsx` alongside Email/Phone/GitHub/LinkedIn.

```
[Download PDF ▾]
   ├─ A4
   └─ US Letter
```

Implementation:
- Run `npx shadcn add dropdown-menu` once. Files land in `src/components/ui/dropdown-menu.tsx` per AGENTS.md convention. Do not hand-edit.
- Match `ContactPill` styling: rounded-full border, same hover treatment, same focus ring.
- `ChevronDown` icon from `lucide-react` (already a dep).
- Items are native `<a href="/to-quoc-bao-resume-a4.pdf" download>` — no JS needed for the actual download. Browser save dialog triggered by `download` attribute.
- Trigger has `aria-label="Download resume as PDF"` and `data-pdf-trigger` so CSS can hide the entire pill when `[data-print]` is set.
- Keyboard-accessible via radix (shadcn's dropdown-menu wraps `@radix-ui/react-dropdown-menu`).

## Build script: `scripts/build-pdf.mjs`

Uses `next start` to serve the just-built app, then drives Playwright. No new server-side dependency required.

```js
// scripts/build-pdf.mjs
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { statSync, readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const PORT = 4321;
const BASE = `http://localhost:${PORT}`;

const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  stdio: ["ignore", "inherit", "inherit"],
  env: { ...process.env },
});

// Wait for server to accept connections
for (let i = 0; i < 60; i++) {
  try {
    const r = await fetch(BASE);
    if (r.ok) break;
  } catch {}
  await sleep(500);
}

try {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });

  // Apply BEFORE any page script runs
  await page.addInitScript(() => {
    document.documentElement.setAttribute("data-print", "");
  });
  await page.emulateMedia({ media: "screen", reducedMotion: "reduce" });

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready.then(() => true));

  const common = {
    printBackground: true,
    preferCSSPageSize: false,
    margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" },
  };
  const targets = [
    { format: "A4",     path: "public/to-quoc-bao-resume-a4.pdf" },
    { format: "Letter", path: "public/to-quoc-bao-resume-letter.pdf" },
  ];
  for (const t of targets) {
    await page.pdf({ ...common, ...t });
    // Verify: file exists, non-empty, starts with %PDF
    const head = readFileSync(t.path).subarray(0, 4).toString("ascii");
    if (head !== "%PDF" || statSync(t.path).size < 1024) {
      throw new Error(`Invalid PDF written: ${t.path}`);
    }
  }
  await browser.close();
} finally {
  server.kill("SIGTERM");
}
```

Notes:
- Imports `chromium` directly from `@playwright/test` — no new `playwright` direct dep needed.
- `printBackground: true` preserves gradients and accent colors.
- 12mm margins roughly match the site's existing `py-12 px-4` rhythm without feeling edge-tight.
- Viewport 900×1200 keeps the `max-w-3xl` (768px) container at full desktop layout — past Tailwind's `sm:` (640px) and `md:` (768px) breakpoints. PDF page width is governed by `format`, not viewport; viewport drives CSS breakpoint selection.
- The `%PDF` magic-byte + minimum-size check is the verifiable success criterion per AGENTS.md "Goal-Driven Execution."

## Package changes

`package.json`:

```json
{
  "scripts": {
    "build": "next build && node scripts/build-pdf.mjs",
    "build:pdf": "node scripts/build-pdf.mjs"
  }
}
```

No new runtime dependencies. No new direct devDependency — `chromium` is imported from the existing `@playwright/test`.

`build:pdf` is a convenience for local re-runs after `next build` has already produced `.next/`.

`.gitignore` additions:
```
public/to-quoc-bao-resume-*.pdf
```

PDFs are build artifacts, not source.

## CI

`.github/workflows/ci.yml` already runs `npm run build`. The build now invokes Playwright, so the chromium browser binary must be installed BEFORE `npm run build`, not after (the existing `Install Playwright browsers` step currently runs after build).

Update the workflow ordering:
```yaml
- run: npm ci
- run: npm run lint
- run: npm run test
- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium
- run: npm run build      # now needs chromium
- run: npm run test:e2e
```

Net build-time impact: ~10–15s for two `page.pdf()` captures plus `next start` boot. Browser binary already cached when E2E ran historically.

## Testing

Unit (vitest):
- `DownloadResumePill.test.tsx` — renders trigger, opens menu, both items have correct `href` + `download` attribute, trigger has `data-pdf-trigger`.

E2E (playwright, `e2e/`):
- `pdf.spec.ts` — driven against `next start`. Sets `data-print` and `reducedMotion: "reduce"` the same way the build script does. Asserts:
  - `<html>` has `data-print` attribute (sanity)
  - `[data-pdf-trigger]` is hidden (`expect(...).toBeHidden()`)
  - the pulse-ring element has computed `animation-name: none` (reduced-motion path engaged)
  - the page-grain `::before` is not visible (computed `display: none` on the pseudo can be probed via `getComputedStyle(el, '::before').display`)

Build verification (machine-checked, inside `scripts/build-pdf.mjs`):
- Each output file exists, size ≥ 1024 bytes, first four bytes are `%PDF`. Failure aborts the build.

Manual one-time review (after first successful build):
- Open both PDFs. Confirm: text selectable, no animation artifacts, gradients preserved, sections don't break awkwardly across pages.

## Files

New:
- `scripts/build-pdf.mjs`
- `src/components/DownloadResumePill.tsx`
- `src/components/DownloadResumePill.test.tsx`
- `src/components/ui/dropdown-menu.tsx` (added by `npx shadcn add dropdown-menu`)
- `e2e/pdf.spec.ts`
- `docs/superpowers/specs/2026-04-25-add-pdf-print-design.md` (this file)

Modified:
- `src/app/globals.css` — add `[data-print]` rules and page-break hygiene
- `src/app/page.module.css` — add `:global([data-print]) .pageGrain::before { display: none; }`
- `src/components/Header.tsx` — render `<DownloadResumePill />` in the pill row
- `package.json` — `build` and `build:pdf` scripts
- `.gitignore` — generated PDF paths
- `.github/workflows/ci.yml` — install Playwright browsers before `npm run build`

Notably NOT modified:
- `src/app/page.tsx` — no `searchParams` change, no print prop threading.
- `src/components/animation/AnimateIn.tsx` — animations skip via `prefers-reduced-motion: reduce` emulation; no code change.
- `src/components/WorkExperience.tsx` — pulse ring stays in markup; the existing `prefers-reduced-motion` rule in `WorkExperience.module.css` stops the animation when Playwright emulates reduced motion.
- `next.config.ts` — `headers()` block is fine because we're NOT switching to static export.

## Risks & open questions

- **`@playwright/test` exposes `chromium`?** Yes — the package re-exports `chromium`, `firefox`, `webkit` from `playwright-core`. The existing `e2e/` tests already import from it.
- **`next start` boot time on CI**: typically 1–3s after `next build`. The 60-iteration × 500ms wait loop tolerates up to 30s, with a fast path on first 200 OK.
- **Resume length**: current resume is likely 2 pages on A4. Page-break rules added upfront (`break-inside: avoid` on `section`, `break-after: avoid` on `h2`) cover the foreseeable cases without waiting for breakage.
- **Future static-export note**: if `output: "export"` is added later, `npm run build` produces `out/` instead of `.next/`, and `public/` files are copied into `out/` at build time. The PDF script would then need to either (a) write to `out/` directly after capture, or (b) run before a final `next build` pass. Out of scope for this work.
