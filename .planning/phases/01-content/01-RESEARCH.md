# Phase 1: Content - Research

**Researched:** 2026-04-13
**Domain:** Next.js 16 App Router / Tailwind v4 / gray-matter / Static content rendering
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Modern / card-based style — section cards with subtle shadow/border, not a flat paper resume look
- **D-02:** Light / neutral palette — zinc-50 background, white cards, zinc-900 header text, zinc-700 body text, indigo-600 or slate-700 accent, zinc-400 muted section headers
- **D-03:** Single Markdown file with YAML frontmatter — `src/data/resume.md`. Frontmatter holds all structured data (name, title, github, linkedin, experience entries, skills). Parsed at build time with `gray-matter`.
- **D-04:** Email and phone are NOT in the data file — read from `process.env.NEXT_PUBLIC_EMAIL` and `process.env.NEXT_PUBLIC_PHONE`. Baked into static HTML at build time.
- **D-05:** Split section components — `src/components/Header.tsx`, `src/components/WorkExperience.tsx`, `src/components/Skills.tsx`. `src/app/page.tsx` composes them.

### Claude's Discretion

- TypeScript interfaces for the parsed resume data shape (e.g. `ResumeData`, `ExperienceEntry`) — Claude decides structure
- Exact card styling details (border radius, shadow level, padding) — Claude decides within the light/neutral palette
- How `null` end dates render (e.g. "Present") — Claude decides

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-01 | Visitor can see a header with name, job title, email, GitHub, and LinkedIn link | Server component reads NEXT_PUBLIC_EMAIL env var + gray-matter frontmatter; renders Header.tsx |
| CONT-02 | Visitor can read work experience in reverse-chronological order with company, role, date range, and 3-4 metric-driven bullets per entry | gray-matter parses experience array from frontmatter; WorkExperience.tsx maps entries in order they appear (data file owner maintains reverse-chron order) |
| CONT-03 | Visitor can read skills organized into plain-text categories (Languages, Frameworks, Databases, Tools/Cloud) | gray-matter parses skills object from frontmatter; Skills.tsx renders category labels with comma-separated values |
</phase_requirements>

---

## Summary

Phase 1 is a pure static-rendering task: parse a YAML-frontmatter Markdown file at build time, thread the data through Server Components, and render three section cards with Tailwind v4 utility classes. No client interactivity exists in this phase — every component can remain a Server Component.

The critical technical facts are: (1) `gray-matter` is not yet installed and must be added; (2) Tailwind v4 is already wired up via `@import "tailwindcss"` in `globals.css` with `@theme inline` — there is no `tailwind.config.*` file, so custom color tokens must be declared in `globals.css`; (3) Next.js 16 is in use with the App Router and React Compiler enabled — no manual `useMemo`/`useCallback` is needed.

The UI contract (01-UI-SPEC.md) is fully approved and provides exact color values, typography scale, spacing tokens, card styling, and interaction states. The planner can treat those values as locked implementation details.

**Primary recommendation:** Install `gray-matter`, create `src/data/resume.md`, define TypeScript interfaces in `src/types/resume.ts`, parse in `page.tsx` (server component), and compose `Header`, `WorkExperience`, and `Skills` components — all as Server Components with no `'use client'` boundary needed.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.3 (installed) | App Router, SSG, font loading | Already in project |
| React | 19.2.4 (installed) | UI rendering | Already in project |
| Tailwind CSS | ^4 (installed) | Utility styling | Already in project via `@tailwindcss/postcss` |
| gray-matter | 4.0.3 (npm latest) | Parse YAML frontmatter from resume.md | Locked by D-03; standard frontmatter parser |

[VERIFIED: npm registry — gray-matter 4.0.3 is current latest, ships own `gray-matter.d.ts`, no `@types/gray-matter` package needed or exists]

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| TypeScript | ^5 (installed) | Type safety for resume data shape | Always — already configured |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| gray-matter | js-yaml + manual fs.readFile | More boilerplate, no frontmatter-specific API; gray-matter is locked by D-03 |
| Tailwind utilities | CSS Modules | Not needed — no naming collision risk on a single-page resume; Tailwind covers all needs |

**Installation (gray-matter only — everything else is installed):**
```bash
npm install gray-matter
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   ├── globals.css        # Tailwind v4 entry + @theme inline tokens (exists)
│   ├── layout.tsx         # Root layout with Geist fonts (exists, update metadata)
│   └── page.tsx           # Server component — parses resume.md, composes sections
├── components/
│   ├── Header.tsx         # Server component — name, title, contact links (D-05)
│   ├── WorkExperience.tsx # Server component — experience list (D-05)
│   └── Skills.tsx         # Server component — categorized skills (D-05)
├── data/
│   └── resume.md          # YAML frontmatter only — all resume content (D-03)
└── types/
    └── resume.ts          # TypeScript interfaces (ResumeData, ExperienceEntry, etc.)
```

Note: `src/components/` and `src/data/` and `src/types/` directories do not yet exist and must be created. [VERIFIED: `ls src/` shows only `app/`]

### Pattern 1: Server Component Data Parsing

**What:** `page.tsx` reads `resume.md` from the filesystem using `fs.readFileSync` and `gray-matter` at build time. No `fetch`, no external API.
**When to use:** Any build-time static data source; works because `page.tsx` is a Server Component by default in Next.js App Router.

```typescript
// src/app/page.tsx
// Source: node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { ResumeData } from '@/types/resume'
import { Header } from '@/components/Header'
import { WorkExperience } from '@/components/WorkExperience'
import { Skills } from '@/components/Skills'

export default function Page() {
  const filePath = path.join(process.cwd(), 'src/data/resume.md')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data } = matter(raw)
  const resume = data as ResumeData

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-8">
      <div className="mx-auto max-w-3xl flex flex-col gap-8">
        <Header resume={resume} />
        <WorkExperience experience={resume.experience} />
        <Skills skills={resume.skills} />
      </div>
    </main>
  )
}
```

[VERIFIED: Next.js App Router docs confirm `page.tsx` is a Server Component by default; `fs` module available without 'use client']

### Pattern 2: YAML Frontmatter Data Shape

**What:** All structured resume data lives in YAML frontmatter. No Markdown body content is needed (per CONTEXT.md specifics).

```yaml
# src/data/resume.md
---
name: "Jane Smith"
title: "Senior Software Engineer"
github: "https://github.com/janesmith"
linkedin: "https://linkedin.com/in/janesmith"
experience:
  - company: "Acme Corp"
    role: "Senior Software Engineer"
    startDate: "2022-01"
    endDate: null        # null → renders as "Present"
    bullets:
      - "Reduced API latency by 40% by migrating to edge caching"
      - "Led team of 4 engineers shipping 3 major features per quarter"
skills:
  Languages: "TypeScript, Go, Python"
  Frameworks: "Next.js, React, Gin"
  Databases: "PostgreSQL, Redis"
  Tools/Cloud: "AWS, Docker, Terraform"
---
```

[ASSUMED — YAML schema is Claude's design decision per D-03; the locked constraint is gray-matter + frontmatter, not the exact schema]

### Pattern 3: TypeScript Interface for ResumeData

```typescript
// src/types/resume.ts
export interface ExperienceEntry {
  company: string
  role: string
  startDate: string        // "YYYY-MM" format
  endDate: string | null   // null renders as "Present" (UI-SPEC copywriting contract)
  bullets: string[]
}

export interface ResumeData {
  name: string
  title: string
  github: string
  linkedin: string
  experience: ExperienceEntry[]
  skills: Record<string, string>   // category label → comma-separated values
}
```

[ASSUMED — interface design is Claude's discretion per CONTEXT.md]

### Pattern 4: Tailwind v4 Theme Extension

**What:** Custom color tokens added via `@theme inline` in `globals.css`. No `tailwind.config.*` file exists or should be created.

```css
/* src/app/globals.css — append to existing @theme inline block */
/* Source: CONTEXT.md code_context, 01-UI-SPEC.md */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

All phase colors are standard Tailwind v4 zinc/indigo palette — no custom tokens are needed beyond what already exists. Use utility classes directly: `bg-zinc-50`, `bg-white`, `text-zinc-900`, `text-zinc-700`, `text-zinc-400`, `text-indigo-600`.

[VERIFIED: `globals.css` read directly — `@import "tailwindcss"` + `@theme inline` already present; standard zinc/indigo classes available without additional config]

### Pattern 5: Null End Date Rendering

Per UI-SPEC copywriting contract: when `endDate` is `null` or absent, render "Present".

```typescript
// Inside WorkExperience.tsx
const dateRange = `${entry.startDate} – ${entry.endDate ?? 'Present'}`
```

[VERIFIED: UI-SPEC.md copywriting contract section explicitly specifies "Present"]

### Anti-Patterns to Avoid

- **Adding `'use client'` to section components:** None of Header, WorkExperience, or Skills require browser APIs, hooks, or event handlers. Keep all as Server Components. The React Compiler is enabled — it handles memoization automatically.
- **Fetching data in child components:** Parse once in `page.tsx`, pass as props. Avoids waterfall and is the canonical RSC pattern.
- **Creating `tailwind.config.*`:** Tailwind v4 is CSS-config-only. Creating a config file could break the build or cause conflicts.
- **Storing email in resume.md:** D-04 explicitly prohibits this. Email must come from `process.env.NEXT_PUBLIC_EMAIL` only.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| YAML/frontmatter parsing | Custom regex/split parser | `gray-matter` | Handles edge cases, multi-line strings, special chars |
| Font loading | Manual `<link>` tags | `next/font/google` (already configured in layout.tsx) | Already wired up; avoids FOUT, layout shift |
| TypeScript interfaces | JSON Schema / Zod at parse time | Simple `as ResumeData` cast | Build-time file, no untrusted input; validation overhead not warranted |

**Key insight:** This phase has no network calls, no user input, and no runtime state. Every "complex" problem is solved at build time with a single `fs.readFileSync` + `matter()` call.

---

## Common Pitfalls

### Pitfall 1: `process.cwd()` vs `__dirname` for File Path

**What goes wrong:** Using `__dirname` or relative paths to locate `resume.md` causes the file not to be found during `next build`.
**Why it happens:** Next.js sets `cwd` to the project root during both `next dev` and `next build`.
**How to avoid:** Always use `path.join(process.cwd(), 'src/data/resume.md')`.
**Warning signs:** `ENOENT: no such file or directory` error at build time.

### Pitfall 2: Dark Mode Override from globals.css

**What goes wrong:** The existing `globals.css` has a `@media (prefers-color-scheme: dark)` block that sets `--background: #0a0a0a`. The `body` also sets `background: var(--background)`. This conflicts with the locked `bg-zinc-50` design.
**Why it happens:** The default Next.js scaffold includes dark mode CSS.
**How to avoid:** Remove or scope the dark mode block in `globals.css`, OR ensure `page.tsx` sets `bg-zinc-50` on the outermost element (Tailwind utility overrides the CSS variable). The simplest fix: replace the `body { background: var(--background) }` rule since the page sets its own background via Tailwind.
**Warning signs:** Page shows dark background on macOS/system dark mode despite `bg-zinc-50` being correct on paper.

### Pitfall 3: gray-matter Not Installed

**What goes wrong:** `import matter from 'gray-matter'` throws at build time.
**Why it happens:** `gray-matter` is decided in CONTEXT.md but is NOT in `package.json` or `node_modules`. [VERIFIED: `node_modules/gray-matter` does not exist]
**How to avoid:** `npm install gray-matter` must be the first task.
**Warning signs:** `Module not found: Can't resolve 'gray-matter'`.

### Pitfall 4: NEXT_PUBLIC_ Env Vars Absent at Build

**What goes wrong:** `process.env.NEXT_PUBLIC_EMAIL` is `undefined`, email renders as empty string.
**Why it happens:** `NEXT_PUBLIC_*` vars are baked at build time — they must be set in `.env.local` (or CI env) before running `next build`. Missing vars silently become empty string (Next.js behavior confirmed in docs).
**How to avoid:** Document that a `.env.local` file with `NEXT_PUBLIC_EMAIL` and `NEXT_PUBLIC_PHONE` must be created. Per CONTEXT.md D-04, empty string is acceptable for Phase 1 (no error state needed).
**Warning signs:** Header renders contact row with empty text for email/phone.

### Pitfall 5: Async Component Where Sync Suffices

**What goes wrong:** Making `page.tsx` an `async` component for no reason, or making child components async.
**Why it happens:** Habit from examples that use `fetch()`. `fs.readFileSync` is synchronous.
**How to avoid:** `page.tsx` can be a plain (non-async) function since `readFileSync` is sync. If async is used, it is fine too — but do NOT add `'use client'` then try to make it async (invalid per RSC rules).
**Warning signs:** Type error from trying `async` + `'use client'` on same component.

---

## Code Examples

### gray-matter Usage Pattern

```typescript
// Source: gray-matter 4.0.3 API (gray-matter.d.ts ships with package)
import matter from 'gray-matter'
import fs from 'node:fs'
import path from 'node:path'

const raw = fs.readFileSync(path.join(process.cwd(), 'src/data/resume.md'), 'utf-8')
const { data, content } = matter(raw)
// data = YAML frontmatter object
// content = Markdown body (empty in this project — frontmatter only)
```

### Card Component Pattern (Tailwind v4 + UI-SPEC values)

```tsx
// Source: 01-UI-SPEC.md Cards section
// border-radius: 12px (rounded-xl), border: zinc-200, shadow-sm equivalent, padding: lg (24px)
<section className="rounded-xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">
  {/* section content */}
</section>
```

### Contact Link Hover/Focus Pattern

```tsx
// Source: 01-UI-SPEC.md Interaction States + Accessibility Contract
<a
  href={`mailto:${email}`}
  className="text-indigo-600 hover:text-indigo-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
>
  {email}
</a>
```

### Contact Separator Pattern

```tsx
// Source: 01-UI-SPEC.md Copywriting Contract — " · " (middle dot with spaces)
const contacts = [email, github, linkedin].filter(Boolean)
contacts.map((item, i) => (
  <span key={i}>
    {i > 0 && <span className="text-zinc-400"> · </span>}
    {/* anchor or text */}
  </span>
))
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` | `@theme inline` in CSS | Tailwind v4 | No JS config file; tokens declared in CSS |
| `middleware.ts` | `proxy.ts` | Next.js 16 | Rename only — not relevant to this phase |
| Manual `useMemo` | React Compiler auto-memoization | React Compiler enabled | Do not add manual memoization |

**Deprecated/outdated:**
- `tailwind.config.*`: Does not exist and must not be created in this project (v4 CSS-only).
- `@tailwindcss/typography` plugin: Not needed for this phase (no Markdown body rendering).

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | YAML frontmatter schema (field names: `name`, `title`, `github`, `linkedin`, `experience`, `skills`) | Architecture Patterns — Pattern 2 | Wrong field names would cause TypeScript type errors at parse; easy to fix before/during implementation |
| A2 | `experience` array in YAML is already in reverse-chronological order (data author's responsibility, not code's) | Architecture Patterns — Pattern 2 | If wrong, code would need to sort by `startDate` descending |
| A3 | TypeScript interface shape (ResumeData, ExperienceEntry) | Architecture Patterns — Pattern 3 | Interface mismatch with actual YAML keys; caught immediately at compile time |

---

## Open Questions

1. **Should `NEXT_PUBLIC_PHONE` render in the header?**
   - What we know: D-04 defines both `NEXT_PUBLIC_EMAIL` and `NEXT_PUBLIC_PHONE`; CONT-01 requires only email, GitHub, and LinkedIn in the header.
   - What's unclear: Whether phone number should appear alongside email in the header contact row.
   - Recommendation: Include phone in contact row if env var is set; omit if not set (filter(Boolean) pattern). Safe to decide at implementation time.

2. **`src/data/` vs `data/` (project root) location**
   - What we know: CONTEXT.md D-03 specifies `src/data/resume.md`; `@/*` alias maps to `./src/*`.
   - What's unclear: Nothing — `src/data/resume.md` is locked.
   - Recommendation: No action needed; location is decided.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `fs.readFileSync` in server component | ✓ | System Node (Next.js 16 requires Node 18+) | — |
| npm | `npm install gray-matter` | ✓ | bundled with Node | — |
| gray-matter | D-03, data parsing | ✗ (not installed) | — | None — must install |
| `.env.local` with NEXT_PUBLIC_EMAIL | CONT-01 email display | ✗ (file absent) | — | Empty string (acceptable per D-04) |

**Missing dependencies with no fallback:**
- `gray-matter` — must be installed before any other task. Wave 0 task.

**Missing dependencies with fallback:**
- `.env.local` — email/phone render as empty string without it. Acceptable for Phase 1.

---

## Validation Architecture

`nyquist_validation` is enabled (config.json).

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no test runner installed or configured |
| Config file | None |
| Quick run command | N/A until framework installed |
| Full suite command | N/A until framework installed |

No test framework is present in `package.json` (only `next`, `react`, `react-dom`, `biome`, `tailwindcss`, `typescript`). [VERIFIED: package.json read directly]

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONT-01 | Header renders name, title, email link, GitHub link, LinkedIn link | smoke (browser) OR build-output check | `next build && grep -r "linkedin" .next/server` | ❌ Wave 0 |
| CONT-02 | Work experience entries appear in correct order with company, role, date, bullets | smoke (browser) | manual dev server verify | ❌ Wave 0 |
| CONT-03 | Skills render with category labels and comma-separated values | smoke (browser) | manual dev server verify | ❌ Wave 0 |

For a single-page static resume with no interactive logic, the validation approach is:
1. `next build` succeeds without error — confirms gray-matter parse and RSC rendering work.
2. `next dev` visual review — confirms UI-SPEC compliance.

A unit test framework (e.g., Vitest) would be disproportionate overhead for this phase's pure-rendering tasks. Recommend deferring test infrastructure to a later phase if needed.

### Sampling Rate

- **Per task commit:** `npm run build` (verifies SSG renders without error)
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** `npm run build` green + visual review of rendered page before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] No test files needed for this phase — build-success + visual review is sufficient validation for CONT-01 through CONT-03
- [ ] `npm install gray-matter` — required before implementation begins

---

## Security Domain

`security_enforcement` is not explicitly disabled in config.json, so this section is included.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Static public page — no auth |
| V3 Session Management | no | No sessions |
| V4 Access Control | no | Public read-only page |
| V5 Input Validation | no | No user input in Phase 1; data from local file, not network |
| V6 Cryptography | no | No secrets transmitted or stored |

### Known Threat Patterns for Static Next.js SSG

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| NEXT_PUBLIC_ env var leakage | Information Disclosure | By design — email is intentionally public on resume page; phone is optional |
| Path traversal in fs.readFile | Tampering | Hardcoded `path.join(process.cwd(), 'src/data/resume.md')` — no user input in path |
| XSS via resume.md content | Tampering | React JSX escapes strings by default; no `dangerouslySetInnerHTML` used |

**Assessment:** Phase 1 has minimal security surface. The data source is a local file with no user input pathway. Standard React XSS protections apply automatically via JSX.

---

## Sources

### Primary (HIGH confidence)
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — Server vs Client component rules, RSC patterns
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` — Tailwind v4 CSS-only setup, `@import "tailwindcss"`, `@theme inline`
- `.agents/skills/next-best-practices/rsc-boundaries.md` — Invalid RSC patterns
- `.agents/skills/next-best-practices/directives.md` — `'use client'`, `'use server'`, `'use cache'`
- `.agents/skills/next-best-practices/file-conventions.md` — Next.js 16 file conventions, proxy.ts rename
- `src/app/globals.css` — Verified Tailwind v4 setup in this project
- `src/app/layout.tsx` — Verified Geist font setup, CSS variable names
- `package.json` — Verified installed packages and versions
- `next.config.ts` — Verified React Compiler enabled
- `.planning/phases/01-content/01-UI-SPEC.md` — Locked color values, typography, spacing, card styles, interaction states
- `.planning/phases/01-content/01-CONTEXT.md` — Locked decisions D-01 through D-05
- npm registry — gray-matter 4.0.3 is latest; ships `gray-matter.d.ts`; no `@types/gray-matter` exists

### Secondary (MEDIUM confidence)
- `.agents/skills/premium-frontend-ui/SKILL.md` — UI craftsmanship patterns (informational context only; Phase 1 has no animations)
- `.agents/skills/vercel-composition-patterns/SKILL.md` — Composition patterns, React 19 API notes

### Tertiary (LOW confidence)
- None.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified via npm registry and filesystem inspection
- Architecture: HIGH — patterns derived from verified Next.js 16 docs and existing project files
- Pitfalls: HIGH for items 1-3 (verified from code/docs); MEDIUM for items 4-5 (documented Next.js behavior, [ASSUMED] for silent empty string)

**Research date:** 2026-04-13
**Valid until:** 2026-05-13 (gray-matter 4.x is stable; Next.js 16 docs are local)
