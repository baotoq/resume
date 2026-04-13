---
phase: 03-deploy
plan: 01
subsystem: deployment
tags: [next.js, github-actions, github-pages, static-export, ci-cd]
dependency_graph:
  requires: []
  provides: [static-export, github-pages-deployment]
  affects: [next.config.ts, .github/workflows/deploy.yml]
tech_stack:
  added: [GitHub Actions]
  patterns: [static-export, two-job-workflow, OIDC-auth]
key_files:
  created:
    - .github/workflows/deploy.yml
  modified:
    - next.config.ts
key_decisions:
  - "output: 'export' in next.config.ts — root domain deployment, no basePath or assetPrefix needed per D-02"
  - "Two-job workflow (build + deploy) separates concerns and allows deploy environment protection"
  - "OIDC via id-token:write — no secrets needed in repo"
  - "cancel-in-progress: false — ensures in-flight deploys complete, preventing partial publishes"
metrics:
  duration: "~5 minutes"
  completed: "2026-04-13T12:33:42Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 1
  files_modified: 1
---

# Phase 03 Plan 01: Static Export + GitHub Actions Deploy Summary

**One-liner:** Next.js static export via `output: 'export'` with a two-job GitHub Actions workflow using OIDC authentication to deploy to GitHub Pages on every push to main.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Enable Next.js static export | 6c99b9b | next.config.ts |
| 2 | Create GitHub Actions deploy workflow | a89bea1 | .github/workflows/deploy.yml |

## What Was Built

**Task 1 — Static export configuration:**
- Added `output: "export"` to `nextConfig` in `next.config.ts`
- Verified `npm run build` exits 0 and produces `out/index.html`
- No `basePath` or `assetPrefix` added (root domain deployment per D-02)
- `reactCompiler: true` retained

**Task 2 — GitHub Actions workflow:**
- Created `.github/workflows/deploy.yml` with two jobs: `build` and `deploy`
- Build job: checkout, setup Node 22, `npm ci`, `npm run build`, configure-pages, upload artifact from `out/`
- Deploy job: `actions/deploy-pages@v4` with environment URL output
- Triggers: `push` to `main` + `workflow_dispatch` for manual runs
- Security: minimal permissions (`contents:read`, `pages:write`, `id-token:write`), OIDC, no stored secrets
- Concurrency: `group: pages`, `cancel-in-progress: false` prevents partial deploys

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None.

## Threat Surface Scan

All security surfaces were addressed inline per the plan's threat model:

| Threat | Mitigation Applied |
|--------|-------------------|
| T-03-01 Tampering (action versions) | All actions pinned to major version tags (v4/v5) |
| T-03-02 Info Disclosure (CI logs) | No secrets used — pure OIDC, no env vars |
| T-03-03 Elevation of Privilege | Minimal permissions block enforced |
| T-03-04 DoS (concurrent deploys) | concurrency group with cancel-in-progress: false |

## Post-Deployment User Action Required

The repository owner must enable GitHub Pages via GitHub Actions source:

1. Go to Repository Settings > Pages > Build and deployment
2. Set Source to "GitHub Actions"
3. Push to `main` to trigger the first deploy
4. The resume will be live at `https://{username}.github.io/{repo}/`

## Self-Check: PASSED

- [x] `next.config.ts` contains `output: "export"` — confirmed
- [x] `out/index.html` exists after build — confirmed
- [x] `.github/workflows/deploy.yml` exists — confirmed
- [x] Commit 6c99b9b exists — confirmed
- [x] Commit a89bea1 exists — confirmed
