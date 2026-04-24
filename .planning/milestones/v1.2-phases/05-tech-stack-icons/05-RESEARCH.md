# Phase 5: Tech Stack Icons - Research

**Researched:** 2026-04-14
**Domain:** Devicons CDN icon font, Next.js App Router head injection, React Server Components, TypeScript interface extension
**Confidence:** HIGH

## Summary

This phase is a focused, additive UI layer with no new npm packages. All architectural decisions were locked in the discuss phase (CONTEXT.md). Research confirmed the Devicons CDN URL is valid, but uncovered one critical correction: the UI spec and CONTEXT.md use `original` as the variant for several icons (Go, Python, Node.js, Next.js, Git) that do NOT have a non-wordmark `original` variant in the current CDN stylesheet. The slug map must use `plain` or `line` for these icons.

The implementation is four targeted file changes plus one new file: `src/types/resume.ts` (add field), `src/data/resume.md` (add sample data), `src/app/layout.tsx` (add CDN link), `src/components/WorkExperience.tsx` (insert component), and the new `src/components/TechStackIcons.tsx`. The React 19 + Next.js 16 stack allows direct `<link>` tags inside the root `<html>` element in `layout.tsx` — the Metadata API is for `<title>`/`<meta>` deduplication, not a hard ban on `<link>` elements in the JSX tree.

**Primary recommendation:** Build exactly as designed in CONTEXT.md, using the corrected slug-to-variant map below. All five requirements are achievable with under ~80 lines of new code.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Use colored Devicon variant — CSS class `devicon-{slug}-original colored` — so icons render in their brand colors
- **D-02:** Icon only — no text label beneath each icon. Clean row of 24px glyphs with small gap.
- **D-03:** Icons load via the Devicons CDN stylesheet added to `layout.tsx` as a `<link rel="stylesheet">` tag — no npm package.
- **D-04:** Unknown tech names render as a zinc muted text pill: `bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5 text-xs`.
- **D-05:** New `src/components/TechStackIcons.tsx` — Server Component. Accepts `stack?: string[]` prop. Renders icon row or null.
- **D-06:** `WorkExperience.tsx` calls `<TechStackIcons stack={entry.tech_stack} />` between the header block and the bullets `<ul>`.
- **D-07:** `layout.tsx` gets a `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />` in `<head>`.
- **D-08:** `ExperienceEntry` in `src/types/resume.ts` gets `tech_stack?: string[]`.
- **D-09:** At least one entry in `resume.md` should have a sample `tech_stack` field.

### Claude's Discretion

- Icon size and gap between icons (likely `text-2xl` / 24px icons with `gap-2` or `gap-3`).
- Devicon slug mapping logic — maintain a lookup map `{ React: "react", TypeScript: "typescript", ... }` inside `TechStackIcons.tsx`; anything not in the map falls back to the zinc pill. Initial map should cover common web tech.
- `mt-3 mb-4` or similar spacing between header and icons row, and between icons row and bullets.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TECH-01 | User can add `tech_stack: [React, TypeScript, Go]` to any experience entry in resume.md | gray-matter parses YAML arrays natively; `ExperienceEntry` type extension is a 1-line additive change |
| TECH-02 | Each experience card renders Devicon icons below role/date header, above bullets | `TechStackIcons.tsx` Server Component renders icon row; `WorkExperience.tsx` insertion point confirmed (after line 60, before `<ul>`) |
| TECH-03 | Icons load via Devicons CDN — no npm package added | CDN URL `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css` verified live; `<link>` in `layout.tsx` is the correct injection point |
| TECH-04 | Experience entries with no `tech_stack` field render no icon row | `stack` prop is `string[] | undefined`; component returns `null` when undefined or empty — no DOM node, no layout impact |
| TECH-05 | Unknown tech names render as a plain text pill fallback | Slug map lookup with fallback to zinc pill span confirmed as the correct pattern |
</phase_requirements>

---

## Standard Stack

### Core (no new packages needed)

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| Devicons CDN | `@latest` (jsDelivr) | Icon font providing brand-colored tech icons | CDN only — no npm install |
| Next.js | 16.2.3 | App Router framework | Already installed |
| React | 19.2.4 | Server Component rendering | Already installed |
| TypeScript | ^5 | Type safety | Already installed |
| Tailwind v4 | ^4 | Utility classes for icon row, pill fallback | Already installed |

[VERIFIED: package.json in codebase, CDN URL fetched and confirmed returning valid CSS]

### Supporting

No additional supporting packages. gray-matter (already installed at `^4.0.3`) handles YAML array parsing for `tech_stack` fields without any changes.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Devicons CDN font | `devicon` npm package | npm install avoids CDN dependency but contradicts D-03 (locked decision) |
| Devicons CDN font | SVG sprite | More resilient but requires hosting SVGs — contradicts D-03 |
| Slug lookup map in component | Dynamic slug derivation from tech name | Derivation can't encode variant differences per icon — lookup map is correct |

**Installation:** None required.

---

## Architecture Patterns

### Recommended Project Structure

No new directories needed. One new file:

```
src/
├── components/
│   ├── TechStackIcons.tsx    ← NEW: Server Component, icon row or null
│   ├── WorkExperience.tsx    ← MODIFIED: insert <TechStackIcons> between header and <ul>
│   ├── LogoImage.tsx         ← UNCHANGED (reference pattern)
│   └── ...
├── types/
│   └── resume.ts             ← MODIFIED: add tech_stack?: string[] to ExperienceEntry
├── data/
│   └── resume.md             ← MODIFIED: add tech_stack to at least one entry
└── app/
    └── layout.tsx            ← MODIFIED: add Devicons <link> stylesheet
```

### Pattern 1: Server Component with Null Guard

`TechStackIcons.tsx` is a Server Component (no browser APIs, no state). It accepts `stack?: string[]` and returns `null` when the array is undefined or empty — this is the idiomatic React pattern for graceful omission with zero DOM impact.

```tsx
// Source: React docs + 05-CONTEXT.md D-05
export function TechStackIcons({ stack }: { stack?: string[] }) {
  if (!stack || stack.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3 mb-3" aria-label="Tech stack">
      {stack.map((tech) => {
        const entry = SLUG_MAP[tech.toLowerCase()]
        if (entry) {
          return (
            <i
              key={tech}
              className={`devicon-${entry.slug}-${entry.variant} colored text-2xl`}
              title={tech}
              aria-label={tech}
            />
          )
        }
        return (
          <span key={tech} className="bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5 text-xs">
            {tech}
          </span>
        )
      })}
    </div>
  )
}
```

[CITED: 05-UI-SPEC.md Component Contract section; 05-CONTEXT.md D-05]

### Pattern 2: Slug Map with Per-Entry Variant

Each entry in the map encodes both the CDN slug and the correct variant suffix. This is required because different icons support different variant names — not all have `original`. The `colored` class modifier is always appended separately.

```tsx
const SLUG_MAP: Record<string, { slug: string; variant: string }> = {
  react:        { slug: 'react',               variant: 'original' },
  typescript:   { slug: 'typescript',           variant: 'plain' },
  javascript:   { slug: 'javascript',           variant: 'plain' },
  go:           { slug: 'go',                   variant: 'plain' },      // ← no original (only original-wordmark)
  docker:       { slug: 'docker',               variant: 'plain' },
  kubernetes:   { slug: 'kubernetes',           variant: 'plain' },
  python:       { slug: 'python',               variant: 'plain' },      // ← no original (only plain)
  'node.js':    { slug: 'nodejs',               variant: 'plain' },      // ← no original
  postgresql:   { slug: 'postgresql',           variant: 'plain' },
  mysql:        { slug: 'mysql',                variant: 'original' },
  redis:        { slug: 'redis',                variant: 'plain' },
  aws:          { slug: 'amazonwebservices',     variant: 'plain' },
  graphql:      { slug: 'graphql',              variant: 'plain' },
  git:          { slug: 'git',                  variant: 'plain' },      // ← no original (only original-wordmark)
  terraform:    { slug: 'terraform',            variant: 'plain' },
  nginx:        { slug: 'nginx',                variant: 'original' },
  linux:        { slug: 'linux',                variant: 'plain' },
  figma:        { slug: 'figma',                variant: 'plain' },
  'next.js':    { slug: 'nextjs',               variant: 'plain' },      // ← no original (only original-wordmark)
  vue:          { slug: 'vuejs',                variant: 'plain' },
  swift:        { slug: 'swift',                variant: 'plain' },
  kotlin:       { slug: 'kotlin',               variant: 'plain' },
}
```

The lookup key should be `tech.toLowerCase()` to allow `"React"`, `"react"`, `"REACT"` in resume.md to all resolve to the same entry.

[VERIFIED: CDN stylesheet fetched at `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css` — class existence confirmed]

### Pattern 3: CDN Link in Root Layout

In Next.js 16 (React 19), placing a `<link>` tag inside the `<html>` element in `layout.tsx` is valid. The Metadata API guideline ("don't manually add `<head>` tags") applies specifically to `<title>` and `<meta>` deduplication — `<link rel="stylesheet">` for external CSS is a standard use case.

```tsx
// Source: [CITED: nextjs.org/docs/app/api-reference/file-conventions/layout] + GitHub discussion #49014
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
```

The current `layout.tsx` does not have an explicit `<head>` element — adding one is valid in React when the component renders the root `<html>` element.

[VERIFIED: nextjs.org layout.tsx docs fetched 2026-04-14; GitHub discussion #49014 confirmed approach works]

### Pattern 4: WorkExperience Insertion Point

Insert `<TechStackIcons stack={entry.tech_stack} />` between the closing `</div>` of the header block (line 60) and the `<ul className="mt-4 ...">` bullets (line 62). The component owns its own margin (`mt-3 mb-3`) — no wrapper needed.

[VERIFIED: WorkExperience.tsx read from codebase — insertion between lines 60 and 62]

### Anti-Patterns to Avoid

- **Using `devicon-{slug}-original` blindly:** Not all icons have an `original` (non-wordmark) variant. `go`, `python`, `nodejs`, `nextjs`, and `git` all lack a plain `original` — using it produces a broken/missing glyph. Use `plain` for these.
- **Omitting `colored` class:** Without the `colored` modifier, icons render in a single foreground color (inheriting from CSS), not brand colors. Always append `colored` to the class.
- **Uppercased map keys:** Resume.md entries like `"React"` or `"TypeScript"` — the lookup must normalize with `.toLowerCase()`.
- **Rendering empty `<div>` when stack is empty:** Return `null`, not an empty container. An empty container leaves a gap in the card layout (violates TECH-04).
- **Adding `'use client'` to TechStackIcons:** No browser APIs needed — keep it a Server Component. Adding `'use client'` unnecessarily increases client bundle size.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tech icon rendering | Custom SVG icon set | Devicons CDN font | 150+ icons maintained by community; brand colors already correct |
| Icon variant lookup | String manipulation from tech name | Static lookup map with slug+variant | Variant names are inconsistent across icons — no algorithmic derivation is reliable |
| YAML array parsing | Custom frontmatter parser | gray-matter (already installed) | Already handles `tech_stack: [React, TypeScript]` syntax |

**Key insight:** The slug map IS the custom piece — but it is a simple data structure, not logic. The complexity that must NOT be hand-rolled is the icon font rendering itself.

---

## Common Pitfalls

### Pitfall 1: Wrong Devicon Variant Causes Missing Glyph

**What goes wrong:** Icons for `go`, `python`, `nodejs`, `nextjs`, and `git` don't have a non-wordmark `original` variant. Using `devicon-go-original colored` produces a blank space or a broken character.

**Why it happens:** The UI spec (05-CONTEXT.md Specifics section) noted "not all icons have `original` variant" but the slug table in 05-UI-SPEC.md still listed `go | go | original`. CDN stylesheet verification confirms `devicon-go-original` does not exist — only `devicon-go-original-wordmark`, `devicon-go-plain`, and `devicon-go-line`.

**How to avoid:** Use the corrected slug map in Pattern 2 above. Use `plain` as the safe default variant; only use `original` when CDN verification confirms it exists.

**Warning signs:** Icon renders as blank space or box character; browser DevTools shows no matching CSS rule for the class.

[VERIFIED: CDN stylesheet at `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css` fetched 2026-04-14]

### Pitfall 2: CDN Stylesheet Loaded After App CSS

**What goes wrong:** When `<link rel="stylesheet">` is added inside `<html>` without a `<head>` element, React/Next.js may inject it after the app's own CSS, which can cause cascade ordering issues.

**Why it happens:** React 19 has built-in stylesheet hoisting support, but the ordering depends on where the `<link>` appears relative to other stylesheets.

**How to avoid:** Add an explicit `<head>` element in `layout.tsx` and place the Devicons link there. Devicons uses font-face declarations and prefixed class names (`devicon-*`) — unlikely to conflict with Tailwind utility classes.

**Warning signs:** Icons render without brand colors (Devicons `colored` class not being applied). Check DevTools → Elements → head to confirm stylesheet order.

### Pitfall 3: Case Sensitivity in Slug Map Lookup

**What goes wrong:** `resume.md` has `tech_stack: [React, TypeScript]` (capitalized), but map key is `react` (lowercase). Lookup fails; falls through to zinc pill for every entry.

**Why it happens:** YAML string values preserve case; JavaScript object keys are case-sensitive.

**How to avoid:** Normalize lookup key: `SLUG_MAP[tech.toLowerCase()]` or `SLUG_MAP[tech.trim().toLowerCase()]`.

**Warning signs:** All tech entries render as zinc pills even for React/TypeScript that are in the map.

### Pitfall 4: Forgetting `tech_stack` in gray-matter Type Cast

**What goes wrong:** `page.tsx` does `const resume = data as ResumeData` — if `ExperienceEntry` type doesn't include `tech_stack`, TypeScript won't catch missing field propagation, and `entry.tech_stack` will be `any` at runtime.

**Why it happens:** gray-matter returns `any` typed data; the `as ResumeData` cast bypasses type checking.

**How to avoid:** Add `tech_stack?: string[]` to `ExperienceEntry` in `src/types/resume.ts` first. TypeScript will then type-check `entry.tech_stack` as `string[] | undefined` in `WorkExperience.tsx`, which matches the `TechStackIcons` prop type.

[VERIFIED: src/types/resume.ts and src/app/page.tsx read from codebase]

---

## Code Examples

### Complete TechStackIcons.tsx

```tsx
// Source: 05-UI-SPEC.md Component Contract + CDN variant verification 2026-04-14

const SLUG_MAP: Record<string, { slug: string; variant: string }> = {
  react:        { slug: 'react',              variant: 'original' },
  typescript:   { slug: 'typescript',          variant: 'plain' },
  javascript:   { slug: 'javascript',          variant: 'plain' },
  go:           { slug: 'go',                  variant: 'plain' },
  docker:       { slug: 'docker',              variant: 'plain' },
  kubernetes:   { slug: 'kubernetes',          variant: 'plain' },
  python:       { slug: 'python',              variant: 'plain' },
  'node.js':    { slug: 'nodejs',              variant: 'plain' },
  postgresql:   { slug: 'postgresql',          variant: 'plain' },
  mysql:        { slug: 'mysql',               variant: 'original' },
  redis:        { slug: 'redis',               variant: 'plain' },
  aws:          { slug: 'amazonwebservices',    variant: 'plain' },
  graphql:      { slug: 'graphql',             variant: 'plain' },
  git:          { slug: 'git',                 variant: 'plain' },
  terraform:    { slug: 'terraform',           variant: 'plain' },
  nginx:        { slug: 'nginx',               variant: 'original' },
  linux:        { slug: 'linux',               variant: 'plain' },
  figma:        { slug: 'figma',               variant: 'plain' },
  'next.js':    { slug: 'nextjs',              variant: 'plain' },
  vue:          { slug: 'vuejs',               variant: 'plain' },
  swift:        { slug: 'swift',               variant: 'plain' },
  kotlin:       { slug: 'kotlin',              variant: 'plain' },
}

interface TechStackIconsProps {
  stack?: string[]
}

export function TechStackIcons({ stack }: TechStackIconsProps) {
  if (!stack || stack.length === 0) return null

  return (
    <div
      className="flex flex-wrap items-center gap-2 mt-3 mb-3"
      aria-label="Tech stack"
    >
      {stack.map((tech) => {
        const entry = SLUG_MAP[tech.toLowerCase()]
        if (entry) {
          return (
            <i
              key={tech}
              className={`devicon-${entry.slug}-${entry.variant} colored text-2xl`}
              title={tech}
              aria-label={tech}
            />
          )
        }
        return (
          <span
            key={tech}
            className="bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5 text-xs"
          >
            {tech}
          </span>
        )
      })}
    </div>
  )
}
```

### layout.tsx head addition

```tsx
// Add explicit <head> with CDN link (insert between <html> and <body> opening tags)
// Source: nextjs.org layout.tsx docs + GitHub discussion #49014 [CITED]
<html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
  <head>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
    />
  </head>
  <body className="min-h-full flex flex-col">{children}</body>
</html>
```

### resume.ts type extension

```ts
// Source: src/types/resume.ts (read from codebase) [VERIFIED]
export interface ExperienceEntry {
  company: string
  role: string
  startDate: string
  endDate: string | null
  bullets: string[]
  logo_url?: string
  tech_stack?: string[]    // ← add this line
}
```

### resume.md sample tech_stack entry

```yaml
# Source: 05-CONTEXT.md D-09 [CITED]
experience:
  - company: "Company A"
    role: "Senior Software Engineer"
    startDate: "2022-01"
    endDate: null
    logo_url: "https://..."
    tech_stack: [React, TypeScript, Go, Docker, Kubernetes]
    bullets:
      - "..."
```

### WorkExperience.tsx insertion

```tsx
// Source: WorkExperience.tsx lines 60-62 (read from codebase) + 05-UI-SPEC.md [VERIFIED]
// After closing </div> of header block:
</div>
{/* Tech stack icons row — renders null if no tech_stack field */}
<TechStackIcons stack={entry.tech_stack} />
{/* Bullets */}
<ul className="mt-4 flex flex-col gap-2">
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Devicons via npm install | Devicons via CDN font | Always supported | No bundle cost; no npm version pinning needed |
| Direct `<head>` injection (Next.js 13) | `<link>` inside root layout `<html>` element | Next.js 15+ / React 19 | Direct approach works; no Metadata API workaround needed |
| All icons use `original` variant | Per-icon variant in slug map | Always true in Devicons | `original` does not exist for go, python, nodejs, nextjs, git |

**Corrected from UI spec:**
- `go | original` → `go | plain` (no standalone `original` variant exists)
- `python | original` → `python | plain` (no standalone `original` variant exists)
- `nodejs | plain` → confirmed correct (already `plain` in UI spec)
- `git | original` → `git | plain` (no standalone `original` variant exists; `original-wordmark` only)
- `nextjs | original` → `nextjs | plain` (no standalone `original` variant exists; `original-wordmark` only)
- `react | original` → confirmed correct (`devicon-react-original` exists)
- `typescript | plain` → confirmed correct
- `mysql | original` → confirmed correct (`devicon-mysql-original` exists)
- `nginx | original` → confirmed correct (`devicon-nginx-original` exists)

[VERIFIED: CDN stylesheet fetched 2026-04-14]

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `devicon-react-original` (non-wordmark) exists in current CDN stylesheet | Standard Stack, Code Examples | React icon would render blank — needs correction to `plain` |
| A2 | `devicon-mysql-original` exists in current CDN stylesheet | Code Examples (slug map) | MySQL icon renders blank — correct to `plain` |
| A3 | `devicon-nginx-original` exists in current CDN stylesheet | Code Examples (slug map) | Nginx icon renders blank — correct to `plain` |

Note: A1, A2, A3 are based on the CDN stylesheet fetch performed during this research session. The stylesheet was fetched from the `@latest` tag — if the CDN updates the version, variant availability could change. The smoke test in Wave 0 (visual check) will surface any blank icons immediately.

All other slug-to-variant mappings were confirmed against the live CDN stylesheet [VERIFIED: 2026-04-14].

---

## Open Questions

1. **`devicon-react-original` vs `devicon-react-plain` color rendering**
   - What we know: Both classes exist. The `colored` modifier applies brand colors to both.
   - What's unclear: Whether `original` vs `plain` renders a visually different icon (original is typically the full-color logo, plain is a simplified monochrome shape).
   - Recommendation: Use `original` for react (as specified in D-01, confirmed to exist), `plain` for typescript/javascript/go per CDN verification.

2. **Node.js lookup key: `"Node.js"` vs `"NodeJS"` vs `"node.js"`**
   - What we know: resume.md users may write any capitalization. The map has `"node.js"` as key.
   - What's unclear: What users will actually type in their `tech_stack` arrays.
   - Recommendation: Add multiple aliases in the slug map: `nodejs`, `node.js`, `node` all map to the same entry. Simple key duplication in the map is cleaner than regex matching.

---

## Environment Availability

Step 2.6: SKIPPED — this phase makes no use of external CLI tools, databases, or services beyond the jsDelivr CDN (which is a browser-side resource, not a build-time dependency). CDN availability was confirmed by fetching `devicon.min.css` during research.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no test config files in codebase |
| Config file | None (no jest.config.*, vitest.config.*, pytest.ini found) |
| Quick run command | `npm run build` (type-check + static export as smoke test) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TECH-01 | `tech_stack` parsed from YAML and typed correctly | type-check | `npm run build` — TypeScript compiler validates types | Build step |
| TECH-02 | Icons render for known techs | visual smoke | `npm run build` then inspect output HTML for `devicon-*` class | Build step |
| TECH-03 | No npm package added | manual | `cat package.json` — confirm devicon not in dependencies | Manual |
| TECH-04 | No icon row when no `tech_stack` field | type-check + visual | `npm run build` — null guard prevents DOM node; inspect HTML | Build step |
| TECH-05 | Unknown tech renders zinc pill | visual smoke | `npm run build` + add unrecognized tech in resume.md | Manual add |

### Sampling Rate

- **Per task commit:** `npm run lint` (Biome check)
- **Per wave merge:** `npm run build`
- **Phase gate:** `npm run build` green + visual spot check in browser before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] Add `tech_stack: [React, TypeScript, Go, Docker, Kubernetes, UnknownTech]` to at least one entry in `resume.md` — enables visual smoke test for both known icons AND unknown-tech pill fallback (covers TECH-01, TECH-02, TECH-04, TECH-05 in one dev run)
- [ ] No test framework installation needed — existing `npm run build` pipeline is sufficient for this phase

*(No new test files required — validation is build-time type checking + visual inspection)*

---

## Security Domain

This phase has no authentication, user input processing, data persistence, or API routes. The only external dependency is a read-only CDN stylesheet loaded by the browser. ASVS categories V2/V3/V4/V6 do not apply.

| ASVS Category | Applies | Rationale |
|---------------|---------|-----------|
| V2 Authentication | no | No auth in this phase |
| V3 Session Management | no | No sessions |
| V4 Access Control | no | Static content |
| V5 Input Validation | partial | `tech_stack` strings from user-controlled `resume.md` are rendered as CSS class names and `title` attributes — but this is a static build (not runtime user input), so XSS via class name injection is not a runtime concern |
| V6 Cryptography | no | No cryptographic operations |

**V5 note:** `entry.tech_stack` values come from `resume.md` (user-authored, committed to git, read at build time). The slug map lookup acts as an allowlist — only pre-approved class names are constructed. Unknown values render as text content in a `<span>`, not as HTML. This is safe. [ASSUMED — standard static site reasoning, not OWASP-verified]

---

## Sources

### Primary (HIGH confidence)
- [VERIFIED: CDN stylesheet] `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css` — fetched 2026-04-14, confirmed class names for react, typescript, go, python, nodejs, nextjs, git, docker, kubernetes, postgresql, mysql, redis, amazonwebservices, graphql, terraform, nginx, linux, figma, vuejs, swift, kotlin
- [VERIFIED: codebase] `src/types/resume.ts` — `ExperienceEntry` interface; field addition target confirmed
- [VERIFIED: codebase] `src/components/WorkExperience.tsx` — insertion point between lines 60 and 62 confirmed
- [VERIFIED: codebase] `src/app/layout.tsx` — current structure; no existing `<head>` element
- [VERIFIED: codebase] `src/app/page.tsx` — gray-matter parse pattern; `as ResumeData` cast
- [VERIFIED: codebase] `package.json` — Next.js 16.2.3, React 19.2.4, no devicon dependency

### Secondary (MEDIUM confidence)
- [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/layout] — layout.tsx root layout patterns; `<link>` in `<html>` confirmed valid in Next.js 16 (fetched 2026-04-14)
- [CITED: https://github.com/vercel/next.js/discussions/49014] — CDN stylesheet in App Router root layout; confirmed working approach

### Tertiary (LOW confidence)
- WebSearch results for Devicons CDN URL and class patterns — cross-verified against actual CDN stylesheet fetch

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — CDN URL fetched live, class names verified from CDN stylesheet
- Architecture: HIGH — all patterns derived from existing codebase (read confirmed) + locked decisions from CONTEXT.md
- Pitfalls: HIGH — slug variant pitfall VERIFIED against live CDN; others derived from codebase inspection
- Slug map variant corrections: HIGH — directly verified from CDN stylesheet fetch 2026-04-14

**Research date:** 2026-04-14
**Valid until:** 2026-05-14 (Devicons CDN `@latest` tag may change — re-verify variants if implementation is delayed more than 30 days)
