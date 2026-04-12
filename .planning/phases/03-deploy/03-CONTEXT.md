# Phase 3: Deploy — Context

**Gathered:** 2026-04-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Configure Next.js static export and ship the resume to GitHub Pages via GitHub Actions. One-time CI setup so every push to main auto-deploys. Phase delivers DEPLOY-01: a public URL anyone can open and share.

</domain>

<decisions>
## Implementation Decisions

### Deployment Method
- **D-01:** **GitHub Actions** — CI pipeline triggers on push to `main`, runs `next build`, and deploys the `out/` directory to GitHub Pages. Zero-click deploys after one-time setup.

### URL Structure
- **D-02:** **Root domain** — Repo is named `username.github.io` (not `resume`). No `basePath` or `assetPrefix` needed in `next.config.ts`. URL is clean: `https://username.github.io`.

### Next.js Static Export Config
- **D-03:** Add `output: 'export'` to `next.config.ts` to enable static HTML export (required for GitHub Pages — no SSR at runtime).
- No `basePath` or `assetPrefix` needed (root domain, D-02).

### GitHub Actions Workflow
- **D-04:** Use the official `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages` actions. Standard pattern for Next.js + GitHub Pages.
- Trigger: `push` to `main` branch.
- Build step: `npm ci && npm run build`.
- Artifact: `out/` directory (Next.js static export output).

### Claude's Discretion
- Exact workflow YAML structure and action versions
- Whether to add a `deploy` job separate from `build` job or combine them

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Next.js 16
- `node_modules/next/dist/docs/` — Breaking changes; check `output: 'export'` API before writing config

### Project requirements
- `.planning/REQUIREMENTS.md` — DEPLOY-01 defines acceptance criteria

### Prior phase outputs
- `next.config.ts` — Add `output: 'export'` here
- `.planning/phases/01-content/01-CONTEXT.md` — locked design decisions
- `.planning/phases/02-layout-polish/02-CONTEXT.md` — Framer Motion decisions (ensure build succeeds with client components)

</canonical_refs>

<code_context>
## Existing Code Insights

### Current State
- `next.config.ts`: Has `reactCompiler: true` but NO `output: 'export'` — must be added
- `package.json`: No `deploy` script, no `gh-pages` dependency — not needed (using Actions)
- `.github/workflows/`: Does not exist — must be created

### Integration Points
- `next.config.ts` — add `output: 'export'`
- `.github/workflows/deploy.yml` — new file, CI/CD pipeline

</code_context>

<specifics>
## Specific Implementation Notes

- Root domain repo (`username.github.io`) means no basePath config changes needed
- GitHub Pages must be configured to deploy from GitHub Actions source (not from a branch) — done in repo Settings > Pages
- `npm run build` with `output: 'export'` writes static files to `out/` by default in Next.js
- Framer Motion `'use client'` components must be compatible with static export — `whileInView` works fine in static HTML (client-side JS runs after hydration)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.
</deferred>

---

*Phase: 03-deploy*
*Context gathered: 2026-04-13*
