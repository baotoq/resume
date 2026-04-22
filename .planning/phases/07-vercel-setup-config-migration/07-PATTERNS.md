# Phase 7: Vercel Setup & Config Migration - Pattern Map

**Mapped:** 2026-04-22
**Files analyzed:** 4 (3 modified, 1 replaced)
**Analogs found:** 4 / 4

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `next.config.ts` | config | request-response | `next.config.ts` (current) | exact — same file, strip + extend |
| `.github/workflows/deploy.yml` | config (CI/CD) | event-driven | `.github/workflows/deploy.yml` (current) | role-match — same trigger/structure, different deploy target |
| `src/app/page.tsx` | component (Server) | request-response | `src/app/page.tsx` (current) | exact — same file, rename two vars only |
| `src/data/resume.md` | data | transform | `src/data/resume.md` (current) | exact — same file, update four `logo_url` values |

---

## Pattern Assignments

### `next.config.ts` (config, request-response)

**Analog:** `next.config.ts` (current file — strip and extend)

**Current file (lines 1–15) — read before editing:**
```typescript
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/resume" : "",
  assetPrefix: isProd ? "/resume" : "",
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

**Target shape — copy this exactly:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "logo.clearbit.com" },
    ],
  },
};

export default nextConfig;
```

**What to remove (never carry forward):**
- `const isProd = ...` — no longer referenced
- `output: "export"` — re-enables full Next.js runtime
- `basePath: isProd ? "/resume" : ""` — GitHub Pages subpath only
- `assetPrefix: isProd ? "/resume" : ""` — same
- `images.unoptimized: true` — was required for static export

**What to keep:**
- `reactCompiler: true` — do not modify (D-12)

**Key constraints:**
- `source: "/:path*"` — canonical catch-all from Next.js 16 docs (NOT `/(.*)`), per D-13
- `remotePatterns` hostname is `logo.clearbit.com` — Clearbit Logo API per D-02
- `reactCompiler` must remain (D-12)
- `images.remotePatterns` entry goes before any other entries (D-02: Clearbit first)

---

### `.github/workflows/deploy.yml` (config CI/CD, event-driven)

**Analog:** `.github/workflows/deploy.yml` (current file — replace entirely, do NOT amend)

**Current file structure to understand before replacing (lines 1–94):**
- Trigger: `push: branches: ["master"]` + `workflow_dispatch` — keep same trigger
- `permissions: pages: write, id-token: write` — DELETE this block entirely (D-09)
- `concurrency: group: "pages"` — replace group name (D-10)
- Multi-job structure (build + deploy) — replace with single-job structure
- Uses `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v5` — all removed

**Target shape — copy this exactly (source: Vercel KB, D-07):**
```yaml
name: deploy
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
on:
  push:
    branches: ["master"]
  workflow_dispatch:
concurrency:
  group: "vercel-production"
  cancel-in-progress: false
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
      - run: npm install --global vercel@latest
      - run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**Key constraints:**
- Branch is `master` (not `main`) — verified from current deploy.yml line 10 and git status (D-08)
- No `permissions:` block in new workflow (D-09)
- `concurrency.group: "vercel-production"`, `cancel-in-progress: false` (D-10)
- Three-step Vercel CLI pattern: `pull → build → deploy --prebuilt` (D-07)
- No marketplace action (`amondnet/vercel-action`) — use Vercel CLI directly
- `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` set as top-level `env:`, not per-step
- `VERCEL_TOKEN` passed inline via `--token=${{ secrets.VERCEL_TOKEN }}`

---

### `src/app/page.tsx` (component/Server, request-response)

**Analog:** `src/app/page.tsx` (current file — two-line rename only)

**Current env var usage (lines 16–17):**
```typescript
const email = process.env.NEXT_PUBLIC_EMAIL ?? "";
const phone = process.env.NEXT_PUBLIC_PHONE ?? "";
```

**Target (rename only — lines 16–17):**
```typescript
const email = process.env.EMAIL ?? "";
const phone = process.env.PHONE ?? "";
```

**No other changes to this file.** All imports (lines 1–8), component body (lines 10–15, 19–34) remain identical.

**Why this is safe:** File has no `"use client"` directive — confirmed Server Component. Server-only vars (`process.env.EMAIL`) are available at runtime on Vercel; they are never baked into the client bundle. (D-15, CFG-01)

**Local dev note:** If `.env.local` exists locally with `NEXT_PUBLIC_EMAIL`/`NEXT_PUBLIC_PHONE` keys, those must also be renamed to `EMAIL`/`PHONE` to preserve local dev. File is gitignored so it is not in the repo. (D-17)

---

### `src/data/resume.md` (data, transform)

**Analog:** `src/data/resume.md` (current file — update four `logo_url` values)

**Current `logo_url` values (lines 11, 23, 37, 48):**
```yaml
logo_url: "https://covergo.com"     # line 11
logo_url: "https://upmesh.io"       # line 23
logo_url: "#"                       # line 37 — keep as-is (D-03)
logo_url: "https://nashtech.com"    # line 48
```

**Target `logo_url` values:**
```yaml
logo_url: "https://logo.clearbit.com/covergo.com"     # line 11
logo_url: "https://logo.clearbit.com/upmesh.io"       # line 23
logo_url: "#"                                          # line 37 — unchanged (D-03)
logo_url: "https://logo.clearbit.com/nashtech.com"    # line 48
```

**Format:** `https://logo.clearbit.com/<domain>` — D-01, D-04

**Key constraint:** The `"#"` placeholder entry for AS White Global stays as `"#"` — LogoImage.tsx briefcase fallback already handles it (D-03, LogoImage.tsx lines 14–39).

---

## Shared Patterns

### LogoImage Component — no changes required
**Source:** `src/components/LogoImage.tsx`
**Apply to:** Reference only — explains why next.config.ts is the only change for IMG-01

```typescript
// src/components/LogoImage.tsx lines 43–52
// Already uses next/image <Image> with onError fallback.
// Only next.config.ts remotePatterns needs updating — no component code change.
return (
  <Image
    src={src}
    alt={alt}
    width={40}
    height={40}
    className="w-10 h-10 rounded-lg object-contain shrink-0"
    onError={() => setHasError(true)}
    {...props}
  />
);
```

### Vercel CLI three-step deploy sequence
**Source:** Vercel KB (canonical), reproduced in 07-RESEARCH.md Pattern 1
**Apply to:** `.github/workflows/deploy.yml` deploy job steps

```bash
vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Security headers catch-all source pattern
**Source:** `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md`
**Apply to:** `next.config.ts` `headers()` function

Use `source: "/:path*"` — canonical Next.js 16 form. Do NOT use `source: "/(.*)"`.

---

## No Analog Found

All files in this phase are modifications of existing files. No brand-new file needs a novel pattern from scratch. The GitHub Actions workflow is a full replacement but the trigger/structure pattern is carried from the existing deploy.yml.

| File | Role | Data Flow | Reason |
|---|---|---|---|
| — | — | — | All patterns have direct codebase analogs |

---

## Manual Prerequisites (not code — planner must include as tasks)

These are required before the first push can succeed. They have no code analog — they are user actions:

1. Run `npx vercel@latest link` in project root to create Vercel project
2. Extract `orgId` and `projectId` from `.vercel/project.json`
3. Add three GitHub repo secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
4. In Vercel project Settings > Git: set "Ignored Build Step" to `exit 1` to disable auto-deploy
5. In Vercel dashboard: set env vars `EMAIL` and `PHONE` (server-only, no `NEXT_PUBLIC_` prefix)

---

## Metadata

**Analog search scope:** `/Users/baotoquoc-covergo/Work/resume` — all source files read directly (small codebase, no glob needed)
**Files scanned:** `next.config.ts`, `.github/workflows/deploy.yml`, `src/app/page.tsx`, `src/data/resume.md`, `src/components/LogoImage.tsx`
**Pattern extraction date:** 2026-04-22
