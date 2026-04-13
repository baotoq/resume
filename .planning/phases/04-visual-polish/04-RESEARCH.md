# Phase 4: Visual Polish - Research

**Researched:** 2026-04-13
**Domain:** React / Next.js 16 static export — client component image fallback + CSS timeline layout
**Confidence:** HIGH

---

## Summary

Phase 4 adds two visual features to `WorkExperience.tsx`: company logo images with a briefcase SVG fallback, and a vertical timeline rail with per-entry dots. All decisions are locked in CONTEXT.md. The technical surface is small — one new client component (`LogoImage.tsx`), one modified server component (`WorkExperience.tsx`), one type extension, and one data fixture change.

The main implementation risks are (1) the timeline line extending past the last entry (TIMELINE-04) — Tailwind's `absolute` positioning on a `relative` outer wrapper requires careful scoping so the line terminates at the last card, not below it; and (2) the `LogoImage` component receiving `src={undefined}` and immediately rendering the briefcase without firing a network request. Both patterns are well-understood in this stack.

No new packages are required. Everything needed is already installed: React 19 `useState`/`onError`, Tailwind v4, and inline SVG. The phase is purely additive and carries no migration complexity.

**Primary recommendation:** Build in the order in STATE.md — type → `LogoImage` client component → `WorkExperience` timeline markup → data fixture → dev/build verify.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** `logo_url?: string` added to `ExperienceEntry` in `src/types/resume.ts` (LOGO-03)
- **D-02:** Plain `<img>` tag — not `next/image` — because `next/image` with external URLs silently 404s on GitHub Pages static export
- **D-03:** `onError` + `useState` in a `'use client'` `LogoImage.tsx` component handles failed loads; triggers briefcase fallback
- **D-04:** Briefcase fallback is an inline SVG — no icon library (bundle cost not justified for one icon); avoids basePath routing issues
- **D-05:** Logo size: 40x40px, rounded square clip (matches the card's `rounded-xl` aesthetic)
- **D-06:** Logo position: left of company name in the card header. Layout: `[Logo] Company / Role ... Date`
- **D-07:** When no `logo_url` is set or the image fails, the briefcase SVG occupies the same 40×40 slot so layout doesn't shift
- **D-08:** Outside-card rail layout — cards shift right, a narrow column on the left holds the vertical line + dots
- **D-09:** Current role (`endDate === null`) → filled indigo dot; past roles → hollow/outlined dot (TIMELINE-03)
- **D-10:** Vertical line ends at the last entry — does not extend past it (TIMELINE-04)
- **D-11:** Mobile (375px) behavior → Claude's discretion — rail collapses to 12px; cards do not hide the timeline
- **D-12:** `LogoImage.tsx` — new `'use client'` component; handles onError + state only
- **D-13:** `WorkExperience.tsx` — stays a Server Component; adds timeline wrapper and per-entry dot/line markup
- **D-14:** `src/data/resume.md` — add `logo_url` to one entry as a smoke-test placeholder

### Claude's Discretion

- Mobile timeline behavior (D-11): rail width or hide-on-mobile — optimise for readability at 375px with no horizontal scroll.
- Tailwind classes for line color, dot border, rail width — match existing zinc/indigo palette.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LOGO-01 | Visitor sees company logo image next to each work entry when `logo_url` is set | Plain `<img>` renders at 40×40, `rounded-lg`; `LogoImage` receives `src` prop from entry |
| LOGO-02 | Visitor sees a briefcase icon when no `logo_url` is provided or image fails to load | `useState(false)` tracks load error; `onError` flips state; inline SVG renders in same 40×40 slot |
| LOGO-03 | `ExperienceEntry` type accepts optional `logo_url` field | One-line change: `logo_url?: string` in `src/types/resume.ts` |
| TIMELINE-01 | Visitor sees a vertical line on the left side connecting all work experience entries | Absolute-positioned `div` inside a `relative` outer wrapper spanning from top-0 to bottom of last entry |
| TIMELINE-02 | Visitor sees a dot at the start of each job entry on the timeline line | Per-entry absolutely positioned `div` aligned to card header level |
| TIMELINE-03 | Current role (no `endDate`) shows filled indigo dot; past roles show hollow/outlined dot | Conditional class: `bg-indigo-600` vs `border-2 border-zinc-300 bg-white` |
| TIMELINE-04 | Vertical line does not extend past the last entry | Line scoped to end at last card's height — see Architecture Patterns section |
</phase_requirements>

---

## Project Constraints (from CLAUDE.md / AGENTS.md)

- This is Next.js 16 — read `node_modules/next/dist/docs/` before touching any framework APIs (breaking changes vs training data) [VERIFIED: AGENTS.md directive]
- Always use Context7 for library/API docs without being asked [VERIFIED: AGENTS.md directive]
- Tailwind v4 syntax only: `@import "tailwindcss"` in CSS, no `tailwind.config.*` [VERIFIED: globals.css]
- No `next/image` for external URLs on static export [VERIFIED: CONTEXT.md D-02, PROJECT.md Key Decisions]
- Inline SVG for briefcase fallback — no icon library [VERIFIED: CONTEXT.md D-04, REQUIREMENTS.md Out of Scope]
- `output: 'export'` in `next.config.ts` — GitHub Pages static build [VERIFIED: next.config.ts]
- `basePath: '/resume'` in `next.config.ts` — affects any path references [VERIFIED: next.config.ts]
- Server Components default; `'use client'` only when browser APIs needed [VERIFIED: code_context, AnimateIn.tsx pattern]
- React Compiler (`reactCompiler: true`) is active — do not add `useMemo`/`useCallback` manually [VERIFIED: next.config.ts]

---

## Standard Stack

### Core (already installed — no new packages)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | `useState`, `onError` for `LogoImage` client component | Already in project |
| Tailwind CSS | ^4 (v4 syntax) | All layout/visual classes — timeline rail, dots, logo slot | Already in project, v4 syntax locked |
| TypeScript | ^5 | Type extension (`logo_url?: string`) | Already in project |
| framer-motion | ^12.38.0 | Available if dot entrance animation desired — likely unnecessary | Already in project |

### No New Installations Required

All implementation uses existing dependencies. [VERIFIED: package.json]

**Version verification:** `next@16.2.3`, `react@19.2.4`, `tailwindcss@^4`, `framer-motion@^12.38.0` — confirmed from `package.json` [VERIFIED: package.json].

---

## Architecture Patterns

### Current Component Structure

```
src/
├── app/
│   ├── page.tsx          # Server Component — reads resume.md, passes data down
│   ├── layout.tsx        # Root layout (Geist font, globals.css)
│   └── globals.css       # @import "tailwindcss"; CSS variables
├── components/
│   ├── WorkExperience.tsx # Server Component — MODIFIED: timeline wrapper + dots
│   ├── AnimateIn.tsx     # 'use client' — framer-motion scroll animation wrapper
│   ├── Header.tsx        # Server Component
│   ├── Skills.tsx        # Server Component
│   └── LogoImage.tsx     # NEW 'use client' — onError + useState + briefcase SVG
├── types/
│   └── resume.ts         # MODIFIED: logo_url?: string added to ExperienceEntry
└── data/
    └── resume.md         # MODIFIED: logo_url added to one entry
```

### Pattern 1: LogoImage Client Component

**What:** Minimal client component that renders a plain `<img>` with an `onError` handler. When load fails (or `src` is undefined), renders inline briefcase SVG in identical 40×40 container.

**When to use:** Any time browser-only APIs (`onError`, `useState`) are needed while keeping the parent a Server Component.

**Key implementation notes:**
- `src={undefined}` must not attempt a network request — check `src` before rendering `<img>` at all
- `onError` fires once and sets `hasError` state to `true`; never resets
- The fallback container must be `w-10 h-10` (40px) `flex items-center justify-center` to prevent layout shift (D-07)
- Briefcase SVG: `aria-label="Company logo unavailable"` or `role="img"` with `<title>` for accessibility
- Logo `<img>`: `alt="{company} logo"` — passed as `alt` prop from parent

```tsx
// Source: CONTEXT.md D-02, D-03, D-04, D-07; UI-SPEC Component Inventory
'use client'
import { useState } from 'react'

interface LogoImageProps {
  src: string | undefined
  alt: string
}

export function LogoImage({ src, alt }: LogoImageProps) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-400"
          aria-label="Company logo unavailable"
          role="img"
        >
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="w-10 h-10 rounded-lg object-contain flex-shrink-0"
      onError={() => setHasError(true)}
    />
  )
}
```

### Pattern 2: Outside-Card Timeline Rail

**What:** `WorkExperience` wraps all cards in a `relative` container that has a left padding column. The vertical line is absolutely positioned within that wrapper. Each entry's dot is positioned at the card header level.

**When to use:** Classic resume/LinkedIn-style timeline — clear visual hierarchy, line does not overlap card content.

**TIMELINE-04 implementation — line termination:**

The vertical line must end at the last entry, not extend below it. Two clean approaches:

**Option A — Scoped wrapper per entry pair (recommended):**
- The `relative` container is per-entry's left rail slot
- The line `div` inside each entry's rail cell has `top-0 bottom-0` except the last entry, where it has `top-0 bottom-1/2`
- Use `index === experience.length - 1` to detect last entry

**Option B — Single line with explicit height:**
- The outer `relative` container ends at the last card's bottom
- `bottom-0` on the line naturally ends at the parent's bottom
- Requires the outer `relative` div to have no padding-bottom beyond the last card

Option A is safer because it makes the termination explicit per-entry regardless of outer spacing. [ASSUMED — both approaches are idiomatic Tailwind; Option A is more explicit]

**Desktop layout (Tailwind classes):**

```tsx
// Source: CONTEXT.md D-08, D-09, D-10; UI-SPEC Component Inventory
// Outer wrapper — shifts cards right to make room for rail
<div className="relative pl-7">   {/* pl-7 = 28px rail width on desktop */}

  {/* Vertical line — positioned within outer wrapper */}
  {/* Left: 5px (dot center) minus half dot width */}
  {/* Scoped to not extend below last entry via last-entry check */}
  <div className="absolute left-[5px] top-0 w-0.5 bg-zinc-200"
       style={{ bottom: ... }} />

  {/* Per-entry */}
  {experience.map((entry, index) => {
    const isCurrent = entry.endDate === null
    const isLast = index === experience.length - 1
    return (
      <div key={index} className="relative">
        {/* Dot — positioned at card header level */}
        <div className={`absolute -left-7 top-[22px] w-3 h-3 rounded-full
          ${isCurrent
            ? 'bg-indigo-600'
            : 'border-2 border-zinc-300 bg-white'
          }`}
          aria-hidden="true"
        />
        {/* Card */}
        <article ...>
          {/* header with LogoImage + company/role + date */}
        </article>
      </div>
    )
  })}
</div>
```

**Mobile (375px) — Claude's Discretion resolved:**
- Rail collapses from `pl-7` (28px) to `pl-5` (20px) using `sm:pl-7 pl-5`
- Timeline line and dots remain visible at all widths — do not hide on mobile
- Logo 40×40 fits: 375 - 2×16(page px-4) - 20(rail) - 40(logo) - 12(gap) = 271px for text — sufficient
- Date wraps below company/role using existing `flex-col sm:flex-row` pattern

### Pattern 3: Card Header Restructure

**What:** Existing card header is `flex-col sm:flex-row sm:items-baseline sm:justify-between`. Phase 4 prepends the `LogoImage` so the company/role column is middle and date stays right.

```tsx
// Source: CONTEXT.md D-06; UI-SPEC Component Inventory; existing WorkExperience.tsx line 26-34
<div className="flex items-start gap-3">
  <LogoImage src={entry.logo_url} alt={`${entry.company} logo`} />
  <div className="flex flex-col flex-1 gap-1 sm:flex-row sm:items-baseline sm:justify-between">
    <div>
      <h3 className="text-sm font-normal text-zinc-700">{entry.company}</h3>
      <p className="text-sm font-normal text-zinc-700">{entry.role}</p>
    </div>
    <span className="text-sm font-normal text-zinc-400">
      {formatDateRange(entry.startDate, entry.endDate)}
    </span>
  </div>
</div>
```

Note: `items-start` (not `items-center`) on outer flex so logo aligns to top of text block, not mid-height of potentially tall multi-line role text.

### Anti-Patterns to Avoid

- **`next/image` for logos:** Silently 404s on GitHub Pages static export with external URLs — locked as out of scope [VERIFIED: REQUIREMENTS.md, CONTEXT.md D-02]
- **Icon library (lucide, heroicons):** Not justified for single icon — increases bundle, avoids basePath routing complexity [VERIFIED: REQUIREMENTS.md Out of Scope]
- **Async client component:** `LogoImage` must NOT be `async` — React client components cannot be async functions [VERIFIED: rsc-boundaries.md skill rule]
- **Passing functions as props from Server → Client:** Do not pass `onError` from `WorkExperience.tsx` to `LogoImage` — keep error handling fully inside the client component [VERIFIED: rsc-boundaries.md skill rule]
- **Adding `useMemo`/`useCallback` manually:** React Compiler (`reactCompiler: true`) handles memoisation — manual annotations interfere [VERIFIED: next.config.ts]
- **`tailwind.config.*` files:** Tailwind v4 uses `@import "tailwindcss"` only — no config file [VERIFIED: globals.css]
- **Vertical line extending below last entry:** Must explicitly terminate — do not rely on overflow:hidden [ASSUMED — common pitfall with absolutely positioned decorative lines]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image load failure detection | Custom event listener, MutationObserver | React `onError` prop on `<img>` | Native browser event; fires synchronously on network failure or HTTP error [VERIFIED: React 19 docs behavior] |
| Conditional dot styling | Complex CSS pseudo-selectors | Simple ternary on `entry.endDate === null` in JSX | Already have data access in Server Component map; simpler and type-safe |
| Timeline vertical line | SVG path, canvas, CSS gradient | Absolutely positioned `div` with `bg-zinc-200 w-0.5` | Pure Tailwind, no layout recalculation, performant |

**Key insight:** Everything in this phase is presentational layout that Tailwind handles natively with utility classes. No custom CSS needed beyond what's already in `globals.css`.

---

## Common Pitfalls

### Pitfall 1: Vertical Line Extends Into Empty Space (TIMELINE-04)

**What goes wrong:** Line `div` with `absolute top-0 bottom-0` inside a `relative` wrapper that has `gap-6` — the wrapper's height includes the gap after the last card, so the line extends 24px below the last entry.

**Why it happens:** CSS `gap` adds space between flex children but the `relative` parent height includes it if there's nothing after the last item. Alternatively, if the line is scoped to the outer section wrapper (`<section>`), it extends through the section heading too.

**How to avoid:** Scope the `relative` wrapper to only the `flex flex-col gap-6` cards container, not the `<section>`. Use per-entry line segments with `isLast` check to stop the line at `top-0 bottom-1/2` for the last entry, OR use a single line scoped to end where the last card ends.

**Warning signs:** Line visually extends 24px below last card in dev — easily spotted.

### Pitfall 2: Logo Request Fires Even When `src` Is `undefined`

**What goes wrong:** Passing `src={undefined}` to `<img>` causes the browser to request the current page URL as the image source on some browsers.

**Why it happens:** An `<img>` with `src=""` or `src={undefined}` (which becomes `src=""` in HTML) triggers a same-origin GET request.

**How to avoid:** In `LogoImage`, check `if (!src || hasError)` first and render the SVG fallback immediately — never render `<img>` at all when `src` is falsy. [VERIFIED: standard React pattern — guards before render]

### Pitfall 3: Layout Shift When Image Loads / Fails

**What goes wrong:** Logo slot is not reserved — card header jumps when image loads (or disappears when it fails) because no dimensions are set.

**Why it happens:** Browser doesn't know image dimensions before network response.

**How to avoid:** Always render the 40×40 container (either `<img className="w-10 h-10">` or fallback `<div className="w-10 h-10">`). The `flex-shrink-0` class prevents the slot from collapsing in the flex row. [VERIFIED: UI-SPEC D-07]

### Pitfall 4: Dot Vertical Alignment

**What goes wrong:** Dot floats in the middle of a tall card instead of aligning to the card's header text level.

**Why it happens:** `top-[X]` needs to account for card padding (`py-6` = 24px) + approximate header text center.

**How to avoid:** Use `top-[22px]` (24px card padding - 2px visual offset for 12px dot centering). Verify visually in dev at multiple screen sizes. [ASSUMED — exact value requires visual tuning; 22px is a reasonable starting estimate given `py-6`]

### Pitfall 5: Dot and Line Occluded by Card Shadow

**What goes wrong:** Card `shadow-sm` visually overlaps the dot if both are at the same z-level.

**Why it happens:** Cards stack on top of absolutely positioned rail elements at default z-index.

**How to avoid:** Add `z-10` to dots, or adjust rail positioning so dots are outside the card's shadow boundary. In the outside-card rail layout (D-08), dots are in the left rail column, not overlapping the card — so this is not an issue as long as cards don't have negative margin that pulls them into the rail. [ASSUMED — visual inspection in dev required]

### Pitfall 6: `basePath` Breaks Local Image References

**What goes wrong:** If `logo_url` values in `resume.md` use relative paths like `/company-logo.png`, they break because `basePath: '/resume'` is not prepended.

**Why it happens:** `basePath` is only automatically prepended by `next/image` and `next/link` — not plain `<img>`.

**How to avoid:** All `logo_url` values should be absolute external URLs (e.g., `https://...`). Document this in `resume.md` comments. This is why external URLs are the intended pattern (D-02). [VERIFIED: next.config.ts basePath + CONTEXT.md D-02 rationale about static export]

---

## Code Examples

### LogoImage with Graceful Fallback

```tsx
// Source: CONTEXT.md D-02 through D-07; UI-SPEC Component Inventory
'use client'
import { useState } from 'react'

interface LogoImageProps {
  src: string | undefined
  alt: string
}

export function LogoImage({ src, alt }: LogoImageProps) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div
        className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0"
        role="img"
        aria-label="Company logo unavailable"
      >
        {/* Briefcase icon — inline SVG, no icon library */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-400"
          aria-hidden="true"
        >
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="w-10 h-10 rounded-lg object-contain flex-shrink-0"
      onError={() => setHasError(true)}
    />
  )
}
```

### Timeline Rail Structure (WorkExperience.tsx)

```tsx
// Source: CONTEXT.md D-08 through D-11; UI-SPEC Component Inventory
// WorkExperience.tsx — Server Component (no 'use client')
export function WorkExperience({ experience }: WorkExperienceProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold leading-[1.2] text-zinc-900 mb-6">
        Work Experience
      </h2>

      {/* Rail wrapper — relative context for line + dots */}
      <div className="relative pl-5 sm:pl-7 flex flex-col gap-6">

        {experience.map((entry, index) => {
          const isCurrent = entry.endDate === null
          const isLast = index === experience.length - 1

          return (
            <div key={index} className="relative">
              {/* Vertical line segment — extends to next entry except on last */}
              {!isLast && (
                <div
                  className="absolute -left-[19px] sm:-left-[23px] top-[28px] bottom-[-24px] w-0.5 bg-zinc-200"
                  aria-hidden="true"
                />
              )}

              {/* Timeline dot */}
              <div
                className={`absolute -left-[22px] sm:-left-[26px] top-[22px] w-3 h-3 rounded-full
                  ${isCurrent
                    ? 'bg-indigo-600'
                    : 'border-2 border-zinc-300 bg-white'
                  }`}
                aria-hidden="true"
              />

              {/* Card */}
              <article className="rounded-xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <LogoImage src={entry.logo_url} alt={`${entry.company} logo`} />
                  <div className="flex flex-col flex-1 gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <h3 className="text-sm font-normal text-zinc-700">{entry.company}</h3>
                      <p className="text-sm font-normal text-zinc-700">{entry.role}</p>
                    </div>
                    <span className="text-sm font-normal text-zinc-400">
                      {formatDateRange(entry.startDate, entry.endDate)}
                    </span>
                  </div>
                </div>
                {/* Bullets */}
                <ul className="mt-4 flex flex-col gap-2">
                  {entry.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="text-base leading-relaxed text-zinc-700 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[10px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-zinc-300"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          )
        })}
      </div>
    </section>
  )
}
```

**Note on dot/line positioning:** The exact pixel offsets (`-left-[22px]`, `top-[22px]`, `bottom-[-24px]`) are estimates based on `py-6` card padding and `gap-6` between cards. Planner should flag these as requiring visual verification in dev — they are tunable without logic changes.

### Type Extension

```typescript
// Source: CONTEXT.md D-01; src/types/resume.ts
export interface ExperienceEntry {
  company: string
  role: string
  startDate: string        // "YYYY-MM" format
  endDate: string | null   // null renders as "Present"
  bullets: string[]
  logo_url?: string        // ADD: optional company logo URL (external absolute URL)
}
```

### Data Fixture (resume.md)

```yaml
# Source: CONTEXT.md D-14; src/data/resume.md
experience:
  - company: "Company A"
    role: "Senior Software Engineer"
    startDate: "2022-01"
    endDate: null
    logo_url: "https://via.placeholder.com/40"   # smoke-test placeholder
    bullets:
      - ...
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` | `@import "tailwindcss"` in CSS | Tailwind v4 | No config file — CSS-first config |
| `next/image` for all images | Plain `<img>` for external URLs on static export | Next.js static export constraint | `next/image` optimization requires server; static export can't optimize external URLs |
| Class-based error boundaries for images | `onError` + `useState` in functional component | React hooks era | Simpler, no class boilerplate |

**Deprecated/outdated:**
- `tailwind.config.ts`: Not used in this project — v4 is CSS-first. Do not create one.
- `next/image` with external `src` + `output: 'export'`: Unsupported — produces 404. Locked out of scope.

---

## Runtime State Inventory

Step 2.5: SKIPPED — This is a greenfield additive phase, not a rename/refactor/migration.

---

## Environment Availability

Step 2.6: No new external dependencies. All required tools are already in use.

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|---------|
| Node.js | `next dev`, `next build` | ✓ | project in use | — |
| Next.js | framework | ✓ | 16.2.3 | — |
| React | hooks (`useState`) | ✓ | 19.2.4 | — |
| Tailwind CSS v4 | layout classes | ✓ | ^4 | — |

[VERIFIED: package.json]

---

## Validation Architecture

### Test Framework

No test framework is currently installed in the project. [VERIFIED: package.json — no jest, vitest, playwright, or testing-library dependencies]

| Property | Value |
|----------|-------|
| Framework | None installed |
| Config file | None |
| Quick run command | `npm run build` (build-time type check) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LOGO-01 | Logo image renders when `logo_url` set | smoke (manual) | `npm run dev` — visual inspect | ❌ Wave 0 (no test infra) |
| LOGO-02 | Briefcase renders on missing/failed logo | smoke (manual) | `npm run dev` — visual inspect + block network | ❌ Wave 0 |
| LOGO-03 | TypeScript accepts `logo_url?: string` | type check | `npm run build` | ❌ Wave 0 (build validates) |
| TIMELINE-01 | Vertical line renders left of cards | smoke (manual) | `npm run dev` — visual inspect | ❌ Wave 0 |
| TIMELINE-02 | Dot at each entry header | smoke (manual) | `npm run dev` — visual inspect | ❌ Wave 0 |
| TIMELINE-03 | Filled vs hollow dot by endDate | smoke (manual) | `npm run dev` — visual inspect | ❌ Wave 0 |
| TIMELINE-04 | Line ends at last entry | smoke (manual) | `npm run dev` — visual inspect | ❌ Wave 0 |

All requirements are **visual/presentational** — they cannot be meaningfully automated without a browser testing framework. `npm run build` serves as the automated gate (TypeScript type errors + lint errors fail the build).

### Sampling Rate

- **Per task commit:** `npm run lint` (Biome)
- **Per wave merge:** `npm run build` (TypeScript + Next.js build)
- **Phase gate:** `npm run build` green + manual visual verification at 375px and 1280px before `/gsd-verify-work`

### Wave 0 Gaps

No test infrastructure to install — all verification is build-time + manual visual. The plan should include an explicit "dev visual verify" task after implementation.

*(If a test framework is desired in future, vitest + @testing-library/react would be the appropriate choice for this stack — deferred, not in scope for Phase 4)*

---

## Security Domain

Phase 4 introduces no authentication, session management, access control, or data processing beyond rendering user-controlled `logo_url` strings.

**Applicable concern:** `logo_url` values are external URLs rendered in plain `<img>` tags. This is a static resume page — there is no XSS vector from `src` attributes on `<img>` tags. CSS injection via `logo_url` is not possible since the value is passed only to `src`.

No ASVS controls apply to this phase's scope. [ASSUMED — no server-side processing, no user input at runtime, static export only]

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Option A (per-entry line segments with `isLast` check) is cleaner than a single absolute line for TIMELINE-04 | Architecture Patterns — Pattern 2 | Minor: alternative approach (single line) is equally valid; switch if planner prefers |
| A2 | `top-[22px]` for dot vertical alignment is visually correct given `py-6` card padding | Architecture Patterns — Pattern 2, Common Pitfalls 4 | Low: exact pixel value requires dev visual tuning; logic is unaffected |
| A3 | `bottom-[-24px]` for per-entry line segment (bridging `gap-6`) is correct | Code Examples — Timeline Rail | Low: exact pixel value requires dev visual tuning; adjust if gap changes |
| A4 | No ASVS controls apply (static export, no runtime user input) | Security Domain | Low: correct for current scope; reassess if auth or form input is added in future |
| A5 | React Compiler active (`reactCompiler: true`) makes manual `useMemo`/`useCallback` unnecessary | Project Constraints | Low: verified from next.config.ts; behavior matches documented React Compiler intent |

---

## Open Questions

1. **Exact dot/line pixel offsets for perfect vertical alignment**
   - What we know: Card uses `py-6` (24px top padding); dot is 12px (`w-3 h-3`); estimated `top-[22px]` for dot
   - What's unclear: Exact visual center of company name text given Geist Sans line-height on this card
   - Recommendation: Treat as tunable in dev — plan should include a visual QA step

2. **Logo URL source for smoke test**
   - What we know: D-14 says add `logo_url` to one entry as smoke-test placeholder
   - What's unclear: Whether to use `https://via.placeholder.com/40` (may be slow/unreliable) or a CDN-hosted logo
   - Recommendation: Use a real static CDN URL for a well-known company (e.g., `https://upload.wikimedia.org/wikipedia/commons/...`) to ensure reliable smoke test

---

## Sources

### Primary (HIGH confidence)
- CONTEXT.md — all locked decisions (D-01 through D-14), confirmed authoritative for this phase
- `src/types/resume.ts` — exact ExperienceEntry type structure [VERIFIED: codebase]
- `src/components/WorkExperience.tsx` — existing card classes and structure [VERIFIED: codebase]
- `src/app/globals.css` — Tailwind v4 CSS-first config confirmed [VERIFIED: codebase]
- `next.config.ts` — `output: 'export'`, `basePath: '/resume'`, `reactCompiler: true` [VERIFIED: codebase]
- `package.json` — exact dependency versions, no test framework installed [VERIFIED: codebase]
- `.agents/skills/next-best-practices/rsc-boundaries.md` — Server/Client component boundary rules [VERIFIED: skills]
- `.planning/phases/04-visual-polish/04-UI-SPEC.md` — Tailwind classes, component specs, mobile behavior [VERIFIED: planning]

### Secondary (MEDIUM confidence)
- REQUIREMENTS.md — LOGO-01..03, TIMELINE-01..04 acceptance criteria
- PROJECT.md — Key Decisions table (no `next/image` for external URLs confirmed)
- STATE.md — recommended build order and accumulated decisions

### Tertiary (LOW confidence)
- None — all findings verified against codebase or locked decisions

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified from package.json
- Architecture: HIGH — locked decisions in CONTEXT.md + verified existing code
- Pitfalls: MEDIUM/HIGH — Pitfalls 1-3 and 6 verified; Pitfalls 4-5 are [ASSUMED] based on common patterns
- Test strategy: HIGH — no test framework confirmed by package.json inspection

**Research date:** 2026-04-13
**Valid until:** 2026-05-13 (30 days — stable stack)
