# Testing Patterns

**Analysis Date:** 2026-04-12

## Test Framework

**Runner:** Not configured

No test framework is installed or configured. The `package.json` at `/Users/baotoq/Work/resume/package.json` contains no test runner dependency (no Jest, Vitest, Playwright, Cypress, or similar) and no `test` script.

**Run Commands:**
```bash
# No test commands are available
```

## Test File Organization

No test files exist in the codebase. No `*.test.ts`, `*.test.tsx`, `*.spec.ts`, or `*.spec.tsx` files are present under `src/` or anywhere outside `node_modules`.

## Coverage

**Requirements:** None enforced — no coverage tooling configured.

## Test Types

**Unit Tests:** Not present.

**Integration Tests:** Not present.

**E2E Tests:** Not present.

## Recommended Setup (when adding tests)

Given the stack (Next.js 16, React 19, TypeScript strict, Biome for linting), the natural fit is:

**Unit/Component tests:**
- Vitest + React Testing Library
- Config file: `vitest.config.ts` at project root
- Test location: co-located alongside source files (e.g., `src/app/page.test.tsx` next to `src/app/page.tsx`)

**E2E tests:**
- Playwright
- Config file: `playwright.config.ts`
- Test location: `e2e/` directory at project root

**Biome compatibility:**
- Biome's `files.includes` already ignores `node_modules`, `.next`, `dist`, and `build`. Test files in `src/` or `e2e/` will be linted automatically.

---

*Testing analysis: 2026-04-12*
