# Codebase Review Fixes — Design

Date: 2026-04-25
Scope: targeted improvements surfaced during a review of the resume site. Six items bundled into one design. No new features, no unrelated refactors.

## Goals

- Make build-time failures loud when resume data is malformed.
- Serve the page statically (no per-request filesystem reads).
- Close two small accessibility/correctness gaps (reduced motion, map keys).
- Remove minor cruft (hard-coded color, empty `<head>`).

## Non-Goals

- Consolidating icon libraries (`react-icons`, `lucide-react`, `react-devicons`).
- Rendering the unused `skills` frontmatter section.
- Replacing `<img>` fallback in `LogoImage`.
- SEO additions (`sitemap.ts`, `robots.ts`).
- Richer JSON-LD (`worksFor`, `image`, `telephone`).

Those remain tracked but deferred.

## Changes

### 1. Static rendering (`src/app/page.tsx`)

Add:

```ts
export const dynamic = "force-static";
```

Effect: Next.js 16 runs `parseResumeFile()` at build, caches output. Env vars `EMAIL`, `PHONE`, `NEXT_PUBLIC_SITE_URL` must be present at build time (already the case — `.env.local` consumed by `next build`).

No revalidation — resume changes require a rebuild/redeploy, which matches current workflow.

### 2. Zod schema for frontmatter (`src/lib/resume-schema.ts` — new)

Add `zod` dependency.

Define one schema per existing interface from `src/types/resume.ts`:

- `ExperienceEntrySchema` — strict object. `startDate` matches `^\d{4}-\d{2}$`. `endDate` nullable with same regex. `tech_stack` optional `z.array(z.string())`. `bullets` non-empty `z.array(z.string())`.
- `EducationEntrySchema` — strict object. Same date handling.
- `CertificationEntrySchema` — strict object. `year` `z.number().int()`. `abbrev` optional string with `.max(4)`.
- `ResumeSchema` — strict object composing the above. `skills` `z.record(z.string(), z.string())`.

All nested objects use `.strict()` so unknown keys fail.

Export `ResumeData = z.infer<typeof ResumeSchema>` as the single source of truth.

Delete hand-written interfaces in `src/types/resume.ts` and replace file contents with a re-export from the schema module:

```ts
export type { ResumeData, ExperienceEntry, EducationEntry, CertificationEntry } from "@/lib/resume-schema";
```

(Keeps existing `@/types/resume` import paths working; zero downstream edits.)

### 3. Validation in `parseResumeString` (`src/lib/parse-resume.ts`)

Replace:

```ts
return data as ResumeData;
```

With:

```ts
const result = ResumeSchema.safeParse(data);
if (!result.success) {
  const issues = result.error.issues
    .map((i) => `${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error(`Invalid resume frontmatter:\n${issues}`);
}
return result.data;
```

Build fails with field-level paths when `resume.md` is wrong.

### 4. Tests (`src/lib/parse-resume.test.ts`)

Add two cases:

- Malformed frontmatter (e.g., `startDate: "Jan 2025"`) → `parseResumeString` throws, error message contains the field path.
- Unknown top-level key (e.g., `foo: bar`) → throws with `foo` in message.

### 5. Stable keys in `WorkExperience.tsx`

- Remove `biome-ignore-all` header.
- Replace outer `key={index}` with `key={\`${entry.company}-${entry.startDate}\`}`.
- Replace inner bullet `key={i}` with `key={bullet}`. Assumption: no two identical bullet strings within one entry. Acceptable for this content.

### 6. React icon color + Vue icon cleanup (`TechStackIcons.tsx`)

- Module-level constant: `const REACT_BLUE = "#0380A2";` just above `TECH_ICON_MAP`.
- `react: ({ size }) => <ReactIcon size={size} color={REACT_BLUE} />` (color still inline but named).
- `vue: Vuejs` direct assignment (drop the `size={38}` wrapper so passed `size={40}` flows through, matching siblings).
- Audit the other ad-hoc wrappers in the map: leave them unless they are pure passthroughs. This change stays narrow.

### 7. Drop empty `<head>` (`src/app/layout.tsx`)

Delete `<head></head>` from the JSX. Next.js injects from `metadata`.

### 8. Reduced motion in `AnimateIn.tsx`

Import `useReducedMotion` from `framer-motion`. If true, return `<div>{children}</div>` (no wrapper motion). Else existing behavior.

```tsx
const reduce = useReducedMotion();
if (reduce) return <div>{children}</div>;
return <motion.div ...>{children}</motion.div>;
```

No new test required — framer-motion's hook reads `window.matchMedia`, which is jsdom-mockable but not worth the setup for a three-line branch. Manual verify via OS reduced-motion toggle in dev.

## Commit Plan (atomic, in order)

1. `chore: force-static render on resume page` — change #1.
2. `refactor: validate resume frontmatter with zod` — changes #2, #3, #4; `package.json` + lockfile.
3. `refactor: stable keys in WorkExperience map` — change #5.
4. `refactor: extract react icon color, simplify vue icon entry` — change #6.
5. `chore: drop empty head element from root layout` — change #7.
6. `a11y: honor prefers-reduced-motion in AnimateIn` — change #8.

## Verification

Per commit: `npm run lint && npm run test && npm run build`.
Final commit + after all: `npm run test:e2e`.

## Risks

- Zod schema rejecting the current `resume.md` — mitigated by running `npm run build` after commit 2 and fixing schema until it validates real data. Schema is derived from existing types so mismatches should be narrow.
- `useReducedMotion` needs `"use client"` — `AnimateIn` already has it. ✓
- `force-static` + env vars — build host must have them. `.env.local` already checked in (placeholder values per memory), so local build stays green. CI/deploy secrets separate concern, out of scope.

## Out of Scope (tracked, deferred)

| ID | Item |
|----|------|
| 1  | `skills` dead data — render or remove |
| 4  | Three icon libs — consolidate |
| 5  | TECH_ICON_MAP wrapper noise (partial cleanup done in #6 here) |
| 6  | `sitemap.ts` / `robots.ts` |
| 7  | JSON-LD enrichment |
| 8  | `metadataBase` fail-loud on missing env |
| 9  | `<img>` → `next/image unoptimized` |
