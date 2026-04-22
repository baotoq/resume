# Feature Research — v2.0 Vercel Migration

**Domain:** Software engineer resume / CV personal page — GitHub Pages static export → Vercel
**Researched:** 2026-04-22
**Confidence:** HIGH (based on Next.js official docs + project codebase inspection)

---

## What Changes When `output: 'export'` Is Removed

With `output: 'export'` set, Next.js produces a static HTML file bundle. Every Next.js feature that requires a Node.js server — image optimization, route handlers, middleware, server actions, redirects/rewrites in config — is unavailable. Removing it and deploying to Vercel restores the full Next.js runtime.

The current config also has `basePath: isProd ? "/resume" : ""` and `assetPrefix: isProd ? "/resume" : ""`. These exist because GitHub Pages serves the repo under a subpath (`/resume`). On Vercel the site deploys at the domain root — `basePath` and `assetPrefix` must be removed entirely or all assets will 404.

---

## Table Stakes — Migration Must-Haves

These are not features, they are correctness requirements. If any are skipped, the Vercel deployment is broken.

| Item | Why Required | Complexity | Notes |
|------|--------------|------------|-------|
| Remove `output: 'export'` from next.config.ts | Without this, Vercel still builds as static export, defeating the purpose | LOW | One line deletion |
| Remove `basePath` and `assetPrefix` from next.config.ts | GitHub Pages needed `/resume` subpath; Vercel deploys at root — leaving these makes all routes/assets 404 | LOW | Two lines deleted; also remove the `isProd` const if no longer used |
| Remove `images: { unoptimized: true }` from next.config.ts | This was required by static export; leaving it permanently disables optimization that Vercel now provides | LOW | One line deletion |
| Configure Vercel project (link repo, set environment) | Vercel needs to know the repo + build settings | LOW | `vercel link` or dashboard; auto-detected as Next.js |
| Migrate env vars to Vercel dashboard | `NEXT_PUBLIC_EMAIL` and `NEXT_PUBLIC_PHONE` are currently passed via GitHub Actions environment; must be added to Vercel project settings | LOW | Dashboard UI; no code change |
| Replace GitHub Actions Pages workflow | Current `deploy.yml` builds static output and pushes to GitHub Pages; must be replaced with Vercel's GitHub integration or a Vercel-aware workflow | LOW | Vercel's native GitHub integration (no Actions needed) or `vercel deploy` in CI |
| Decommission GitHub Pages | Having two live URLs causes confusion; old URL should either redirect to new Vercel domain or be disabled | MEDIUM | GitHub Pages settings + optionally a redirect from old URL |
| Redirect old GitHub Pages URL | Recruiters may have `username.github.io/resume` bookmarked; a 301 from old URL to new Vercel domain prevents dead links | MEDIUM | Cannot do this within the repo — GitHub Pages redirection is not configurable; best communicated as a DNS/shareability concern |

**Existing env var improvement (minor, can do in same phase):**
`NEXT_PUBLIC_EMAIL` and `NEXT_PUBLIC_PHONE` are read in `page.tsx`, which is a Server Component. Post-migration, they can drop the `NEXT_PUBLIC_` prefix and become server-only secrets. This keeps contact info out of the client JavaScript bundle. Low effort, meaningful privacy improvement.

---

## Quick Wins — Low-Effort Improvements Unlocked

Features now possible that are trivially enabled post-migration.

| Feature | Value | Complexity | Dependency | Notes |
|---------|-------|------------|------------|-------|
| `next/image` for company logos (replace `<img>` in LogoImage.tsx) | Automatic WebP/AVIF conversion, lazy loading, size optimization, blur placeholder — all the things `<img>` can't do | LOW | `basePath` and `images.unoptimized` must be removed first; add `remotePatterns` in config for external logo URLs | The sole reason plain `<img>` was chosen was static export (documented in Key Decisions); this reverts that tradeoff |
| HTTP security headers via next.config.ts | `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` — industry standard for any web property | LOW | `output: 'export'` removed | `headers()` in next.config.ts; Vercel respects these at CDN level |
| Dynamic OG image (`opengraph-image.tsx`) | Generates a branded 1200×630 social share card automatically; makes shared links look professional | MEDIUM | No static export constraint; needs `next/og` (`ImageResponse`) | Requires `app/opengraph-image.tsx` with JSX layout; Vercel renders it serverlessly at request time |
| Proper `metadata` export with canonical URL | `<title>`, `<meta name="description">`, `<link rel="canonical">` — currently may be minimal or missing | LOW | None | App Router `generateMetadata` or static `export const metadata` in `layout.tsx` |

---

## Future Enhancements — Higher-Effort, Now Possible

These were impossible under `output: 'export'`. They remain out of scope for the migration milestone but are now viable.

| Feature | Value | Complexity | Why Possible Now | Notes |
|---------|-------|------------|-----------------|-------|
| Server-side PDF generation via API Route | Biggest unlock. Currently deferred because "No server infra needed for static resume" (PROJECT.md). An API route running Puppeteer or a PDF library can render the page and stream a clean PDF | HIGH | API routes require Node.js server | Options: Puppeteer (heavyweight, Vercel size limits apply), `@react-pdf/renderer` (React-based, lighter), or redirect to a print stylesheet + browser print. Vercel serverless function max size is a constraint for Puppeteer. |
| Server Actions for contact form | Could add a contact/email form without a separate backend | MEDIUM | Server Actions unavailable in static export | Out of scope per PROJECT.md ("Contact form — static page, no backend needed") |
| Middleware for analytics or A/B | Edge middleware intercepts requests before rendering | HIGH | Middleware requires Edge runtime, unavailable in static export | Not relevant to a resume site |
| ISR (Incremental Static Regeneration) | Revalidates cached pages on a schedule | N/A | Was unavailable in static export | **Not applicable to this project.** Resume data is in a YAML file built at deploy time; there is no external data source to poll. ISR solves a problem this site does not have. |

---

## Anti-Features

Features that seem like natural next steps but create problems.

| Anti-Feature | Why Requested | Why Problematic | Alternative |
|--------------|---------------|-----------------|-------------|
| Puppeteer for PDF generation | Full-fidelity PDF from the rendered page | Puppeteer binary is ~170MB; Vercel max Lambda size is 50MB (compressed) — will fail to deploy | Use `@react-pdf/renderer` (no binary) or `html2pdf.js` client-side, or redirect to print stylesheet |
| ISR on the resume page | Seems like a best practice for hybrid sites | Resume data is static YAML at build time; ISR adds complexity with no benefit; deploy triggers rebuild automatically | Keep as SSR with no caching config; build on push |
| API route for serving resume data | Separates data from rendering | Unnecessarily complex for a personal resume; gray-matter in page.tsx is sufficient | Keep `readFileSync` in the Server Component |
| Multiple pages / router navigation | A projects page, blog, contact page | Out of scope per PROJECT.md; fragments the recruiter's attention | Keep single-page scrollable layout |

---

## Feature Dependencies

```
Remove output: 'export'
    └──enables──> next/image optimization
    └──enables──> Security headers via next.config.ts
    └──enables──> Dynamic OG image (opengraph-image.tsx)
    └──enables──> API routes (PDF generation, etc.)

Remove basePath / assetPrefix
    └──required for──> next/image (remotePatterns, paths resolve correctly)
    └──required for──> All asset URLs resolving at domain root

Remove images: { unoptimized: true }
    └──required for──> next/image optimization to actually run

Vercel project configured + env vars migrated
    └──required for──> CI/CD workflow replacement
    └──required for──> Live Vercel URL existing to test against

GitHub Actions Pages workflow replaced
    └──enables──> Decommissioning GitHub Pages
```

### Dependency Notes

- **next/image requires all three config removals:** `output: 'export'`, `basePath`, and `images: { unoptimized: true }` must all be gone before `next/image` works correctly with external URLs and Vercel optimization.
- **Env var migration must happen before decommissioning:** The old GitHub Actions workflow passes env vars. New Vercel deployment must have them before the old workflow is retired.
- **OG image is independent of PDF:** Both are unlocked by removing static export, but they have no dependency on each other.

---

## MVP Definition for v2.0 Migration

### Ship in v2.0 (Migration Milestone)

The migration is complete when the site is live on Vercel, serving correctly, with GitHub Pages decommissioned.

- [ ] Remove `output: 'export'`, `basePath`, `assetPrefix`, `images: { unoptimized: true }` from next.config.ts
- [ ] Configure Vercel project (link repo, configure env vars `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_PHONE`)
- [ ] Replace GitHub Actions Pages workflow with Vercel deployment (native GitHub integration preferred — zero YAML)
- [ ] Decommission GitHub Pages
- [ ] Verify site loads correctly at Vercel URL with no 404s, no missing assets

**Optionally in v2.0 (low effort, same phase):**
- [ ] Swap `NEXT_PUBLIC_EMAIL`/`NEXT_PUBLIC_PHONE` to server-only env vars (drop `NEXT_PUBLIC_` prefix) — contact info stays out of client bundle
- [ ] Add HTTP security headers to next.config.ts
- [ ] Swap `<img>` in LogoImage.tsx to `next/image` with `remotePatterns`

### Add After v2.0 (v2.x)

- [ ] Dynamic OG image (`opengraph-image.tsx`) — trigger: want professional social share previews
- [ ] Proper metadata (`generateMetadata`) with name, title, canonical URL — trigger: SEO or sharing
- [ ] PDF download via API route — trigger: recruiters asking for PDF, or user populates real data

### Future (v3+)

- [ ] Server-side PDF generation (Puppeteer alternative) — depends on solving Lambda size constraint
- [ ] Dark mode — independent of Vercel, was always possible, just deferred

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Remove static export + config cleanup | HIGH (site won't work without it) | LOW | P1 |
| Configure Vercel project + env vars | HIGH | LOW | P1 |
| Replace CI/CD workflow | HIGH | LOW | P1 |
| Decommission GitHub Pages | HIGH (single source of truth) | LOW | P1 |
| next/image for logos | MEDIUM (better images, lazy load) | LOW | P1 (do in same phase) |
| HTTP security headers | MEDIUM (best practice) | LOW | P1 (do in same phase) |
| Server-only env vars (drop NEXT_PUBLIC_) | MEDIUM (privacy) | LOW | P1 (do in same phase) |
| Dynamic OG image | MEDIUM (professional sharing) | MEDIUM | P2 |
| Metadata / canonical URL | LOW-MEDIUM (SEO minimal for resume) | LOW | P2 |
| PDF generation API route | HIGH when user wants it | HIGH | P3 |

---

## Sources

- [Next.js static exports — unsupported features](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/static-exports.mdx) — official docs; confirms rewrites, redirects, headers, Server Actions, Route Handlers unavailable in static export (HIGH confidence)
- [Next.js deploying to Vercel](https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/17-deploying.mdx) — official docs (HIGH confidence)
- [Next.js image optimization — Vercel automatic](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/self-hosting.mdx) — confirms Vercel provides image optimization with zero config (HIGH confidence)
- [Next.js OG image generation](https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/04-functions/generate-image-metadata.mdx) — `ImageResponse` / `opengraph-image.tsx` pattern (HIGH confidence)
- [Existing project Key Decisions](/.planning/PROJECT.md) — documents why `<img>` was chosen over `next/image`, why PDF was deferred, why `NEXT_PUBLIC_` prefix was used (PRIMARY SOURCE)

---
*Feature research for: v2.0 Vercel Migration — Next.js 16 resume site*
*Researched: 2026-04-22*
