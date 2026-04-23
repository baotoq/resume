# Phase 10: Bio Paragraph + Duration Labels - Research

**Researched:** 2026-04-24
**Domain:** React Server Components, Tailwind CSS layout, pure TypeScript date arithmetic
**Confidence:** HIGH

---

## Summary

Phase 10 adds two self-contained UI elements: a bio paragraph inside the existing Header card, and stacked duration labels beneath each work experience date range. Both are pure server-render additions — no client-side JavaScript, no new npm packages, and no new React component files beyond one new `src/lib/duration.ts` utility.

The codebase is in a clean state. Phase 9 already populated `ResumeData.bio?: string` in `src/types/resume.ts` and seeded `src/data/resume.md` with the bio text verbatim. `ExperienceEntry.startDate`/`endDate` are typed as `"YYYY-MM"` / `null`. The current build passes with zero TypeScript errors (`npm run build` confirmed clean). The only file creations and modifications required are three targeted edits: extend `Header.tsx`, extend `WorkExperience.tsx`, and create `src/lib/duration.ts`.

The primary implementation risk is accidental hydration mismatch if `new Date()` is called inside a component that has a `'use client'` directive. `WorkExperience.tsx` has no such directive — it is a pure Server Component — so `new Date()` called at the top of its render function is safe and stable.

**Primary recommendation:** Implement `src/lib/duration.ts` as a standalone pure function first, verify arithmetic against real YAML entries, then wire it into `WorkExperience.tsx` and finally extend `Header.tsx` with the bio paragraph.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Bio paragraph lives inside the existing `Header` component card — extend `Header.tsx`, do NOT create a new BioSection component.
- **D-02:** Bio renders below the contact links row, with a top margin separating it from the links.
- **D-03:** Bio text is already populated in `src/data/resume.md` (added in Phase 9, approved verbatim). No new text needed.
- **D-04:** BIO-02 animation: bio is part of the Header card — it animates in with the Header's existing `AnimateIn` wrapper. No separate AnimateIn needed.
- **D-05:** Duration label is stacked on its own line below the date range — NOT inline. Display as two lines aligned to the right: date range on top, duration below in lighter/smaller style (`text-xs text-zinc-400`).
- **D-06:** Short tenure (< 1 year): skip years, show months only — e.g. "8 mos" not "0 yrs 8 mos".
- **D-07:** Format rules:
  - >= 1 year, with months remainder: "X yrs Y mos" (e.g. "4 yrs 3 mos")
  - >= 1 year, no months remainder: "X yrs" (e.g. "2 yrs")
  - < 1 year: "Y mos" (e.g. "8 mos")
  - < 1 month: "< 1 mo"
- **D-08:** Duration utility is a standalone pure function in `src/lib/duration.ts` — ~20 lines vanilla TypeScript, no npm packages.
- **D-09:** Duration computed at build time using the current date (Node.js `new Date()` at render time in the Server Component) for "Present" roles (`endDate === null`). Satisfies DUR-02 — no client JS.
- **D-10:** Duration label added inside the existing date range `<span>` area in `WorkExperience.tsx` — wrap date + duration in a `<div className="flex flex-col items-end">` to stack them.

### Claude's Discretion

- Exact top-margin value between contact links and bio paragraph in Header.
- Whether the duration line uses `text-xs` or `text-sm` — pick whichever looks balanced with the `text-sm font-bold text-zinc-500` date range above it.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BIO-01 | User can read a plain-text bio paragraph at the top of the resume page | `ResumeData.bio?: string` already typed and populated in YAML. `Header.tsx` is a Server Component — no `'use client'` directive. Bio renders from prop with zero JS. |
| BIO-02 | Bio section animates in on scroll entry | Bio inherits the `AnimateIn` wrapper already wrapping `<Header>` in `page.tsx` (delay 0). `AnimateIn` uses `framer-motion` `whileInView`. No additional wrapper needed. |
| DUR-01 | Each work experience entry displays a computed duration label ("X yrs Y mos") next to the date range | `computeDuration(startDate, endDate, now)` pure function in `src/lib/duration.ts`. Called inside the `.map()` in `WorkExperience.tsx`. Format rules in D-07 verified against all 4 YAML entries. |
| DUR-02 | Duration computed at build time (static — no client JS required) | `WorkExperience.tsx` has no `'use client'` directive. `new Date()` called at Server Component render time = build-time evaluation in static export. No hydration delta. |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Bio paragraph rendering | Frontend Server (RSC) | — | Pure data-to-markup transform; `resume.bio` arrives as string prop. No interactivity. |
| Bio animation | Browser / Client | Frontend Server (RSC) | `AnimateIn` is `'use client'` (framer-motion). The bio element is server-rendered HTML; the animation wrapper adds client-side motion. Bio is already inside Header's existing AnimateIn in page.tsx. |
| Duration computation | Frontend Server (RSC) | — | `new Date()` + arithmetic in Server Component = build-time static result. No client involvement. |
| Duration display layout | Frontend Server (RSC) | — | Flexbox column wrapping a text span. No interactivity. |
| Duration utility logic | — (src/lib) | Frontend Server (RSC) | Pure TypeScript function. No React. Called by WorkExperience Server Component. |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 19 | 19.2.4 [VERIFIED: package.json] | Component rendering | Project's React runtime |
| Next.js 16 | 16.2.3 [VERIFIED: package.json] | App Router, SSR/static | Project's framework |
| Tailwind CSS 4 | (project dep) | Utility classes | Established project styling system |
| TypeScript | (project dep) | Type safety | All project files use TypeScript |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| framer-motion | ^12.38.0 [VERIFIED: package.json] | Scroll animations | Already powers AnimateIn — bio reuses it indirectly |
| gray-matter | ^4.0.3 [VERIFIED: package.json] | YAML parse | page.tsx already uses this; bio arrives as parsed string |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vanilla TS date arithmetic | date-fns / Temporal | Overkill for ~20 lines; locked out by zero-new-packages constraint |

**No installation needed.** All dependencies already present.

---

## Architecture Patterns

### System Architecture Diagram

```
resume.md (YAML)
      |
      v
  page.tsx (Server Component)
  gray-matter parses bio string + experience[]
      |
      +---> <AnimateIn delay={0}>
      |       <Header resume={resume} email phone />
      |         [name, title, contacts]
      |         [bio paragraph — new, D-01/D-02]  <-- BIO-01 / BIO-02
      |     </AnimateIn>
      |
      +---> <AnimateIn delay={0.1}>
              <WorkExperience experience={resume.experience} />
                [for each entry]:
                  new Date() captured once at component render   <-- DUR-02
                  computeDuration(startDate, endDate, now)       <-- src/lib/duration.ts
                  [date range span] <- flex col items-end        <-- D-10 / DUR-01
                  [duration label below]
            </AnimateIn>

src/lib/duration.ts
  computeDuration(startDate: string, endDate: string | null, now: Date): string
  Pure function. No imports. ~20 lines.
```

### Recommended Project Structure

```
src/
├── app/
│   └── page.tsx              # unchanged
├── components/
│   ├── Header.tsx             # MODIFIED: add bio paragraph block
│   └── WorkExperience.tsx     # MODIFIED: import computeDuration, stack duration label
├── lib/
│   └── duration.ts            # NEW: pure computeDuration function
├── types/
│   └── resume.ts              # unchanged (bio?: string already present)
└── data/
    └── resume.md              # unchanged (bio already populated in Phase 9)
```

### Pattern 1: Server Component — `new Date()` for build-time "present"

**What:** Capture the current date once at the top of the Server Component's render function. Pass it as a regular `Date` argument to the pure utility. The component has no `'use client'` directive, so Node's `new Date()` executes at build time only.

**When to use:** Any time a Server Component needs "current date" for a static-output page.

**Example:**
```typescript
// Source: Next.js 16 static export docs — Server Components run at next build
// WorkExperience.tsx (no 'use client' directive)
import { computeDuration } from "@/lib/duration";

export function WorkExperience({ experience }: WorkExperienceProps) {
  const now = new Date(); // captured once per render = build time
  return (
    <>
      {experience.map((entry) => {
        const duration = computeDuration(entry.startDate, entry.endDate, now);
        // ...
      })}
    </>
  );
}
```

**Warning:** Do NOT call `new Date()` inside a component that carries `'use client'`. That would cause a date/time hydration mismatch between server HTML and client re-render. [VERIFIED: .agents/skills/next-best-practices/hydration-error.md]

### Pattern 2: Pure duration utility

**What:** A pure function that takes two date strings and a reference `Date`, returns a formatted string. No side effects. No imports. Fully testable.

**When to use:** Any date-arithmetic computation that must be deterministic and side-effect-free.

**Example — `src/lib/duration.ts`:**
```typescript
// Implements D-07 format rules. startDate / endDate = "YYYY-MM". endDate null = "Present".
export function computeDuration(
  startDate: string,
  endDate: string | null,
  now: Date
): string {
  const [sy, sm] = startDate.split("-").map(Number);
  const ey = endDate ? Number(endDate.split("-")[0]) : now.getFullYear();
  const em = endDate ? Number(endDate.split("-")[1]) : now.getMonth() + 1;

  const totalMonths = (ey - sy) * 12 + (em - sm);
  if (totalMonths < 1) return "< 1 mo";

  const yrs = Math.floor(totalMonths / 12);
  const mos = totalMonths % 12;

  if (yrs >= 1 && mos > 0) return `${yrs} yrs ${mos} mos`;
  if (yrs >= 1) return `${yrs} yrs`;
  return `${mos} mos`;
}
```

**Verified arithmetic against all 4 YAML entries** [VERIFIED: Node.js manual run]:
- CoverGo: 2025-02 → Present (2026-04) = 14 months → "1 yrs 2 mos"
- Upmesh: 2021-10 → 2025-01 = 39 months → "3 yrs 3 mos"
- AS White Global: 2021-01 → 2021-09 = 8 months → "8 mos" (short tenure, no years)
- NashTech Limited: 2018-12 → 2020-12 = 24 months → "2 yrs" (no months remainder)

### Pattern 3: Bio paragraph in Header

**What:** Conditional render of a `<p>` tag after the contacts row, using `resume.bio`. The `bio` field is typed `string | undefined` — use a guard to avoid rendering an empty paragraph.

**When to use:** Extending a server-rendered card component with optional text content.

**Example:**
```tsx
// Header.tsx — add after the contacts <div>
{resume.bio && (
  <p className="mt-4 text-base leading-relaxed text-zinc-600">
    {resume.bio}
  </p>
)}
```

Note: `mt-4` is Claude's discretion (D-02 specifies top margin, exact value is discretionary). `mt-4` (16px) matches the spacing used between name and title rows in the same component.

### Pattern 4: Stacked date + duration layout (D-10)

**What:** Replace the current single `<span>` around the date range with a `<div className="flex flex-col items-end">` containing the date range text and the duration label.

**When to use:** When stacking two lines of text right-aligned in a flex row that uses `sm:justify-between`.

**Example:**
```tsx
// WorkExperience.tsx — replace the single <span>
<div className="flex flex-col items-end">
  <span className="text-sm font-bold text-zinc-500">
    {formatDateRange(entry.startDate, entry.endDate)}
  </span>
  <span className="text-xs text-zinc-400">
    {computeDuration(entry.startDate, entry.endDate, now)}
  </span>
</div>
```

`text-xs` (12px) for the duration label was confirmed per D-05. The date range parent `text-sm font-bold text-zinc-500` stays unchanged.

### Anti-Patterns to Avoid

- **`new Date()` in a `'use client'` component:** Causes hydration mismatch — server date != client date. `WorkExperience.tsx` must NOT gain a `'use client'` directive. [VERIFIED: hydration-error.md]
- **Creating a new `BioSection` component:** Locked out by D-01. Extend `Header.tsx` directly.
- **Adding an extra `AnimateIn` wrapper around the bio:** Locked out by D-04. The existing `AnimateIn` in `page.tsx` already wraps the entire Header card.
- **Passing a `Date` object as a prop from Server to Client Component:** Non-serializable — Next.js RSC boundary restriction. The duration computation must happen inside the Server Component, not inside any client child. [VERIFIED: rsc-boundaries.md]
- **Markdown rendering for bio text:** Out of scope per REQUIREMENTS.md. Plain text only. `HighlightedBullet` is not appropriate here.
- **Negative total months:** If `endDate` is set but earlier than `startDate` (data error), `totalMonths` will be negative. The `< 1 mo` branch handles `totalMonths < 1`, which catches both zero and negative. Safe without an explicit negative guard.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Date arithmetic | Custom class or multi-file system | ~20-line pure function per D-08 | Single-purpose: months between two "YYYY-MM" strings. No need for full date library. |
| Animation wrapper | New AnimateIn variant | Existing AnimateIn in page.tsx | Bio reuses Header's existing wrapper per D-04. |
| Bio display component | Separate BioSection.tsx | Inline extension of Header.tsx | D-01 is locked — no new component file. |

**Key insight:** The duration problem space is precisely scoped to D-07's four format rules. Any general-purpose date library would bring significantly more surface area than the problem requires.

---

## Common Pitfalls

### Pitfall 1: Hydration mismatch from `new Date()` in Client Component

**What goes wrong:** If `WorkExperience.tsx` gains `'use client'` in the future (or if `computeDuration` is called inside a client component), `new Date()` will return a different value on the client than it did on the server, causing React to throw a hydration error and re-render.

**Why it happens:** Server renders at build time; client hydrates at browser load time (potentially hours/days later). Date values differ.

**How to avoid:** Keep `WorkExperience.tsx` as a Server Component (no `'use client'`). Call `new Date()` at the component render level, not inside a child client component.

**Warning signs:** "Hydration failed because the initial UI does not match" in dev overlay; duration text flickering on load. [VERIFIED: hydration-error.md]

### Pitfall 2: Bio renders even when `bio` is undefined

**What goes wrong:** `<p className="...">{ resume.bio }</p>` without a guard renders an empty `<p>` tag with its margin when `bio` is missing from the data, creating invisible whitespace.

**Why it happens:** TypeScript `bio?: string` means `undefined` at runtime. JSX renders `undefined` as nothing inside an element, but the element itself still renders.

**How to avoid:** Always guard with `{resume.bio && <p ...>{resume.bio}</p>}`.

**Warning signs:** Unexpected gap between contact links and the end of the Header card in a future environment where `bio` is not set.

### Pitfall 3: `items-end` vs `items-start` on duration column

**What goes wrong:** If `items-start` is used instead of `items-end`, the duration label left-aligns inside the flex column, which breaks the right-aligned position of the date+duration block in the row.

**Why it happens:** The parent row uses `sm:justify-between` — the date side should visually "stick to the right". Both the date range and duration label need to share the same right-alignment axis.

**How to avoid:** Use `flex flex-col items-end` per D-10.

**Warning signs:** Duration label appears left-aligned under the date range instead of right-aligned.

### Pitfall 4: `src/lib/` directory does not exist

**What goes wrong:** TypeScript and the build silently succeed if the import path is wrong, but at runtime or build time an "Cannot find module '@/lib/duration'" error appears.

**Why it happens:** `src/lib/` does not exist in the current project structure. [VERIFIED: ls src/ — only app/, components/, data/, types/]

**How to avoid:** Create `src/lib/` directory and `duration.ts` before referencing it. The `@/lib/duration` alias works as long as the file exists because `@` maps to `src/` per the project's tsconfig.

---

## Code Examples

### `src/lib/duration.ts` — complete implementation

```typescript
// Source: D-07/D-08 from CONTEXT.md, verified against 4 YAML entries
/**
 * Computes a human-readable duration between two "YYYY-MM" date strings.
 * endDate === null means the role is ongoing; `now` is used as the end point.
 */
export function computeDuration(
  startDate: string,
  endDate: string | null,
  now: Date
): string {
  const [sy, sm] = startDate.split("-").map(Number);
  const ey = endDate ? Number(endDate.split("-")[0]) : now.getFullYear();
  const em = endDate ? Number(endDate.split("-")[1]) : now.getMonth() + 1;

  const totalMonths = (ey - sy) * 12 + (em - sm);
  if (totalMonths < 1) return "< 1 mo";

  const yrs = Math.floor(totalMonths / 12);
  const mos = totalMonths % 12;

  if (yrs >= 1 && mos > 0) return `${yrs} yrs ${mos} mos`;
  if (yrs >= 1) return `${yrs} yrs`;
  return `${mos} mos`;
}
```

### WorkExperience.tsx — date+duration block

```tsx
// Source: D-05, D-10 from CONTEXT.md
// Replace current <span className="text-sm font-bold text-zinc-500">
<div className="flex flex-col items-end">
  <span className="text-sm font-bold text-zinc-500">
    {formatDateRange(entry.startDate, entry.endDate)}
  </span>
  <span className="text-xs text-zinc-400">
    {computeDuration(entry.startDate, entry.endDate, now)}
  </span>
</div>
```

### Header.tsx — bio paragraph

```tsx
// Source: D-01, D-02 from CONTEXT.md
// Add after the contacts <div>
{resume.bio && (
  <p className="mt-4 text-base leading-relaxed text-zinc-600">
    {resume.bio}
  </p>
)}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pass `Date` object across RSC boundary | Compute and format to string inside Server Component | React 19 / Next.js 15+ | Non-serializable `Date` objects cannot cross RSC boundaries; all date math stays server-side |

**Deprecated/outdated:**
- `getServerSideProps` / `getStaticProps` patterns: Not applicable — this project uses App Router with Server Components. `new Date()` at render time in a Server Component is the equivalent of `getStaticProps`-era build-time computation.

---

## Open Questions

1. **"Present" staleness**
   - What we know: `new Date()` at build time captures the date the site was last deployed. If no redeployment occurs, the "CoverGo: 1 yrs 2 mos" label will become stale over time.
   - What's unclear: Whether the user finds this acceptable long-term (STATE.md lists it as a pending todo: "accept static 'Present' staleness or use client `useEffect`?").
   - Recommendation: The CONTEXT.md decision (D-09) locks in the build-time approach and it satisfies DUR-02. No action required in this phase. Document as known limitation in plan.

2. **`text-xs` vs `text-sm` for duration label**
   - What we know: D-05 specifies `text-xs text-zinc-400`. D-05 is a locked decision.
   - What's unclear: Nothing — this is resolved.
   - Recommendation: Use `text-xs text-zinc-400` as specified.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 10 has no external dependencies. All changes are code-only modifications to existing TypeScript/TSX files. No external services, databases, CLIs, or runtimes beyond the existing Node.js + Next.js build toolchain, which is confirmed working (build passed).

---

## Validation Architecture

> `workflow.nyquist_validation: true` in `.planning/config.json` — section included.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None — AGENTS.md confirms "No test suite configured" |
| Config file | None |
| Quick run command | `npm run build` |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | Passes? |
|--------|----------|-----------|-------------------|---------|
| BIO-01 | Bio paragraph visible in rendered HTML | build smoke | `npm run build` — checks RSC renders without error | Wave 0 |
| BIO-02 | Bio animates in on scroll (inside Header's AnimateIn) | visual | Manual browser check — `npm run dev`, scroll to Header | Manual only |
| DUR-01 | Duration labels "X yrs Y mos" appear on all 4 entries | build smoke | `npm run build` — TypeScript must accept computeDuration return values | Wave 0 |
| DUR-02 | Duration is static, no client JS | lint + build | `npm run build` — WorkExperience.tsx must remain Server Component (no `'use client'`); verify with grep | Wave 0 |

**DUR-02 automation command:**
```bash
# Verify WorkExperience.tsx has no 'use client' directive
! grep -q "'use client'" /Users/baotoq/Work/resume/src/components/WorkExperience.tsx && echo "PASS: Server Component" || echo "FAIL: has use client"
```

**DUR-01 spot-check command (manual verification):**
```bash
# After build, check the generated HTML for duration strings
grep -r "yrs\|mos" /Users/baotoq/Work/resume/.next/server/app/ 2>/dev/null | head -20
```

**BIO-01 spot-check command:**
```bash
# After build, check generated HTML for bio text
grep -r "Senior backend engineer" /Users/baotoq/Work/resume/.next/server/app/ 2>/dev/null | head -5
```

### Sampling Rate
- **Per task commit:** `npm run build` (full static build, ~3 seconds)
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** Full build green + manual visual check at `npm run dev`

### Wave 0 Gaps

- [ ] Create `src/lib/` directory — not present in current project structure [VERIFIED: ls src/]
- [ ] Implement `src/lib/duration.ts` — new file, covers DUR-01/DUR-02
- [ ] No test framework install needed — project explicitly has no test suite

---

## Security Domain

> `security_enforcement` not set in config. Defaulting to enabled.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth features in this phase |
| V3 Session Management | No | No sessions |
| V4 Access Control | No | Static public page |
| V5 Input Validation | Yes (low risk) | `resume.bio` is a hardcoded string in a git-committed YAML file, not user input. No sanitization needed. |
| V6 Cryptography | No | No secrets or cryptographic operations |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via bio text | Spoofing/Tampering | React auto-escapes string children in JSX — `{resume.bio}` renders as text, not HTML. No `dangerouslySetInnerHTML`. [ASSUMED: standard React behavior] |

No meaningful security surface area introduced by this phase. Bio is developer-controlled YAML content. Duration is pure arithmetic.

---

## Project Constraints (from CLAUDE.md)

Extracted from `AGENTS.md` (canonical per CLAUDE.md indirection):

| Directive | Applies to This Phase |
|-----------|----------------------|
| Read `node_modules/next/dist/docs/` before writing any code | Confirmed read — App Router Server Component patterns verified |
| Always use Context7 for library docs | Used ctx7 CLI for Next.js 16 RSC/static-render confirmation |
| No test suite configured | Validation section uses build/lint commands only |
| Architecture: Next.js 16 App Router + React 19 + Tailwind CSS 4 + TypeScript | All patterns follow App Router RSC model |
| Zero new npm packages | Duration utility is vanilla TypeScript, no new imports |
| No client-side JavaScript for bio or duration | Both are Server Component renders — verified by absence of `'use client'` in target files |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | React auto-escapes string content in JSX (no XSS from `{resume.bio}`) | Security Domain | Low — standard React behavior, but if framework has a regression this could be an issue. Mitigated by bio being developer-controlled content. |

**One assumption.** All other claims were verified by reading the actual source files, running the build, or checking official documentation.

---

## Sources

### Primary (HIGH confidence)
- `/Users/baotoq/Work/resume/src/types/resume.ts` — `ResumeData.bio?: string` confirmed present
- `/Users/baotoq/Work/resume/src/components/Header.tsx` — current structure, no `'use client'`, bio extension point confirmed
- `/Users/baotoq/Work/resume/src/components/WorkExperience.tsx` — no `'use client'`, `formatDateRange` signature, date range `<span>` target confirmed
- `/Users/baotoq/Work/resume/src/data/resume.md` — `bio:` field populated, all 4 experience entries with `startDate`/`endDate` confirmed
- `/Users/baotoq/Work/resume/src/components/animation/AnimateIn.tsx` — `'use client'`, `whileInView` pattern confirmed
- `/Users/baotoq/Work/resume/src/app/page.tsx` — `AnimateIn delay={0}` wraps Header, no changes needed
- `/Users/baotoq/Work/resume/package.json` — versions: Next.js 16.2.3, React 19.2.4, framer-motion ^12.38.0
- `npm run build` — confirmed clean compile and TypeScript pass before Phase 10 changes
- Node.js manual arithmetic run — duration outputs for all 4 YAML entries verified
- `/Users/baotoq/Work/resume/.agents/skills/next-best-practices/hydration-error.md` — Date/time hydration mismatch cause documented
- `/Users/baotoq/Work/resume/.agents/skills/next-best-practices/rsc-boundaries.md` — non-serializable `Date` prop restriction confirmed
- Context7 `/vercel/next.js` — confirmed Server Components run at `next build` for static exports

### Secondary (MEDIUM confidence)
- `/Users/baotoq/Work/resume/.planning/phases/10-bio-paragraph-duration-labels/10-CONTEXT.md` — locked decisions D-01 through D-10

### Tertiary (LOW confidence)
- None.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified against package.json
- Architecture: HIGH — all files read, build confirmed passing
- Duration arithmetic: HIGH — manually verified against all 4 YAML entries with Node.js
- Pitfalls: HIGH — verified against official skill docs (hydration-error.md, rsc-boundaries.md)

**Research date:** 2026-04-24
**Valid until:** 2026-05-24 (stable stack — no fast-moving dependencies in scope)
