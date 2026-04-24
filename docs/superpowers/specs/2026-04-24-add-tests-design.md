# Add Tests — Design Spec

Date: 2026-04-24
Status: Approved (design)

## Goal

Add a pragmatic test suite to the Next.js 16 resume site. Catch the two high-value bug classes — silent data regressions and build/runtime breakage — without introducing brittle tests that break on styling churn.

## Scope

In scope:

- Unit tests for pure logic: markdown bullet parsing, icon/logo map lookups, resume frontmatter schema.
- One end-to-end smoke test that loads `/`, verifies major sections render, and verifies the email copy pill works.
- CI workflow gating PRs on lint + unit + E2E.

Out of scope:

- Component render/snapshot tests for sections (design churns often; low ROI).
- Visual regression tests.
- Accessibility/axe tests (can be added later).
- Performance tests.

## Architecture

Three isolated layers, each with its own config:

- **Unit** — Vitest + jsdom + React Testing Library. Co-located with source as `*.test.ts`.
- **E2E** — Playwright against production build (`next build && next start`) in CI, dev server locally.
- **CI** — GitHub Actions, single workflow runs lint, unit, E2E sequentially.

### Directory layout

```
resume/
├── vitest.config.ts
├── playwright.config.ts
├── src/
│   ├── components/
│   │   ├── HighlightedBullet.tsx
│   │   ├── HighlightedBullet.test.ts
│   │   ├── techstack-icons/
│   │   │   ├── TechStackIcons.tsx
│   │   │   └── TechStackIcons.test.ts
│   │   └── company-logos/
│   │       ├── LogoImage.tsx
│   │       └── LogoImage.test.ts
│   └── lib/
│       ├── parse-resume.ts          # NEW — extracted from page.tsx
│       └── parse-resume.test.ts
├── e2e/
│   └── smoke.spec.ts
└── .github/workflows/test.yml
```

### Refactor prerequisite

`src/app/page.tsx` currently inlines `fs.readFileSync` + `gray-matter`. Extract the parse step into `src/lib/parse-resume.ts`:

```ts
// src/lib/parse-resume.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ResumeData } from "@/types/resume";

export function parseResumeFile(filePath?: string): ResumeData {
  const resolved = filePath ?? path.join(process.cwd(), "src/data/resume.md");
  const raw = fs.readFileSync(resolved, "utf-8");
  const { data } = matter(raw);
  return data as ResumeData;
}

export function parseResumeString(raw: string): ResumeData {
  const { data } = matter(raw);
  return data as ResumeData;
}
```

`page.tsx` becomes a one-line call. Enables fixture-based unit tests without filesystem coupling.

## Units Under Test

| File | Cases |
|------|-------|
| `HighlightedBullet.test.ts` | `**bold**` → `<strong>`; `*italic*` → `<em>`; mixed bold + italic in one line; unmatched asterisks render as literal text; empty string renders nothing |
| `TechStackIcons.test.ts` | Render `<TechStackIcons stack={[...]}/>`: `"React"`, `" react "`, `"REACT"` all render the mapped icon (matches after `normalizeTech` → `.toLowerCase().trim()`); unknown tech renders `<Badge>` with the original (non-normalized) text; empty/undefined `stack` → component returns `null` |
| `LogoImage.test.ts` | `company="CoverGo"` (exact case) renders the registered `CoverGoLogo` SVG inside an `<a href={link}>`; unknown company (e.g., `"Acme"`) renders `<img src={logoUrl} alt={company}>` inside fallback div; `COMPANY_LOGO_MAP` keys are case-sensitive (`"covergo"` does NOT hit the SVG branch) |
| `parse-resume.test.ts` | **Schema guard:** `parseResumeFile()` on real `src/data/resume.md` returns object satisfying required `ResumeData` fields: `name: string`, `title: string`, `github: string`, `linkedin: string`, `experience: ExperienceEntry[]` (non-empty, each entry has `company`, `role`, `startDate`, `bullets`, `logo_url`, `link`), `skills: Record<string,string>` (object, values are strings). **Fixtures:** `parseResumeString()` with malformed YAML throws; a fixture missing `experience` fails a schema assertion with a message naming the field; `skills: {}` is valid (empty record allowed by type) |

## E2E Smoke Test

`e2e/smoke.spec.ts`:

- GET `/` → 200.
- No `console.error` / unhandled page error during load (fail on any).
- Assert visible: `role=banner` or header name text, work experience heading, education heading, certifications heading.
- Click email pill → assert clipboard text equals `process.env.EMAIL`. Skip this assertion if env unset.
- On failure: Playwright saves trace + screenshot to `playwright-report/`.

### Playwright config

- `webServer` local: `npm run dev`.
- `webServer` CI (controlled by env): `npm run build && npm start`.
- Single project: `chromium`. Can add firefox/webkit later if needed.

## Error Handling

- Unit test failures show field path / diff via Vitest assertion messages.
- Real `resume.md` schema guard fails loudly with the missing field name before build is attempted.
- E2E failures upload `playwright-report/` as CI artifact.
- Any console error during smoke test = test fails. Prevents silent hydration warnings.

## Dependencies and Scripts

Add to `devDependencies`:

```
vitest ^2
@vitest/ui ^2
jsdom ^25
@testing-library/react ^16
@testing-library/dom ^10
@playwright/test ^1.48
```

`package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"test:all": "npm run test && npm run test:e2e"
```

Biome config: exclude `playwright-report/`, `test-results/` from linting.

## CI

`.github/workflows/test.yml`:

- Trigger: push to `master`, PRs.
- Node 20, `npm ci`.
- Steps:
  1. `npm run lint`
  2. `npm run test`
  3. `npx playwright install --with-deps chromium`
  4. `CI=1 npm run test:e2e` (runs against prod build per Playwright config)
- Upload `playwright-report/` on failure.
- Env: `EMAIL`, `PHONE` set to test values via workflow env so header/pill tests aren't skipped.

## Out-of-Scope Reminders

Do not add during this work:

- Component render tests for `Header`, `WorkExperience`, `EducationSection`, `CertificationsSection`.
- Snapshot tests.
- Storybook.
- Coverage thresholds (can enforce after suite stabilizes).

## Success Criteria

- `npm run test` passes locally.
- `npm run test:e2e` passes locally against dev.
- GitHub Actions workflow runs green on PR.
- Editing `src/data/resume.md` to remove a required field causes `npm run test` to fail with a clear message naming the field.
- Removing a registered company from `COMPANY_LOGO_MAP` causes `LogoImage.test.ts` to fail.

## Notes / Ground Truth (verified against source)

- `TECH_ICON_MAP` lookup uses `normalizeTech(tech) = tech.toLowerCase().trim()`. Unknown key → `<Badge>` fallback (not `null`).
- `COMPANY_LOGO_MAP` keys are **case-sensitive** (`"CoverGo"`, `"Upmesh"`). Unknown company always renders an `<img>` — there is no "missing logo_url" special case; the image just has the given `logoUrl` src.
- `ResumeData` required fields: `name`, `title`, `github`, `linkedin`, `experience`, `skills`. Optional: `bio`, `education`, `certifications`.
- `parseResume*` helpers do not yet exist — extracting them from `src/app/page.tsx` is a prerequisite of this work.
