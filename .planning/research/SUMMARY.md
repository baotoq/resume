# Research Summary: v3.0 Content & Polish

**Synthesized:** 2026-04-23
**Milestone:** v3.0 — Bio paragraph, Duration labels, Education section, Typography overhaul

---

## Executive Summary

All four v3.0 features are achievable with zero new npm dependencies. The existing stack (Next.js 16 App Router, React 19, TypeScript, Tailwind v4, gray-matter, framer-motion 12) covers every implementation need. Duration labels require a ~20-line vanilla TypeScript utility. Education requires a new type interface, YAML data, and one Server Component. Typography changes are pure Tailwind v4 utility class edits with `@theme` token additions in `globals.css`.

**Build order:** types first → bio/duration (parallel) → education → typography pass last.

The primary risk is silent YAML/type mismatches — gray-matter's `as ResumeData` cast never throws at build time. Every new field must be added to both the TypeScript interface and `resume.md` in the same commit.

---

## Stack Additions

**Zero new npm packages required.**

| Need | Solution |
|------|----------|
| Duration computation | `src/lib/duration.ts` — ~20-line pure TS; explicit `new Date(Number(y), Number(m)-1)` constructor |
| Typography tokens | `globals.css` `@theme inline` — `--text-*--line-height`, `--tracking-tight`, `--leading-snug` |
| Education data | Extend `ResumeData` with `bio?: string`, `EducationEntry`, `education?: EducationEntry[]` |
| New section animation | Reuse existing `AnimateIn` wrapper — mandatory for all new page sections |

**Do NOT add:** `date-fns`, `@tailwindcss/typography` (wrong use case, v4 friction), `Temporal` API (unreliable in Node 20 server-side).

---

## Feature Table Stakes

### Bio/Intro Paragraph
- 2–5 sentence plain-text string in YAML (`bio: |`)
- Conditional `<p>` added to `Header.tsx` — no new component
- Existing card styles; `AnimateIn` wrap
- No photo, no markdown rendering in bio

### Duration Labels
- "X yrs Y mos" format (LinkedIn convention — recruiter-standard)
- Additive `<span>` in WorkExperience card header alongside existing date range
- No schema change — uses existing `start_date`/`end_date` fields
- Pure arithmetic, no library

### Education Section
- Degree + institution + date range (irreducible minimum)
- New `EducationSection.tsx` Server Component
- Placed **below WorkExperience** in `page.tsx` (senior engineer convention)
- No timeline rail, no GPA
- `AnimateIn` wrap
- Relevant coursework: optional conditional field

### Typography Overhaul
- 4-level type scale: `text-2xl` (name) → `text-xl` (section heads) → `text-lg` (role titles) → `text-base` (body) → `text-sm` (secondary)
- Color tokens: zinc-900 / zinc-700 / zinc-500 / indigo-600 accent
- Section spacing: `gap-10`/`gap-12` between sections; `p-6` on all cards
- Cross-cutting pass — touches Header, WorkExperience, EducationSection, page.tsx

---

## Architecture — Build Order

```
1. src/types/resume.ts + src/data/resume.md  (same commit — atomicity)
   └─ Unblocks all component work

2a. Header.tsx — bio paragraph          (additive, lowest risk)
2b. WorkExperience.tsx — duration label (additive, parallel with 2a)
    └─ src/lib/duration.ts utility

3.  EducationSection.tsx + page.tsx wiring
    └─ Depends on step 1

4.  Typography pass across all components  (must be last — cross-cutting)
    └─ Verify timeline dot alignment after any spacing change
```

**New files:** `src/lib/duration.ts`, `src/components/EducationSection.tsx`
**Modified files:** `src/types/resume.ts`, `src/data/resume.md`, `src/components/Header.tsx`, `src/components/WorkExperience.tsx`, `src/app/page.tsx`, `src/app/globals.css`

---

## Critical Pitfalls

| # | Pitfall | Prevention | Phase |
|---|---------|------------|-------|
| N1 | YAML schema atomicity — `as ResumeData` never throws; undefined silently renders blank | Same-commit rule: type + YAML always together; visual verify after deploy | 1 |
| N2 | Timezone off-by-one — `new Date("YYYY-MM")` parses UTC, shifts in negative-offset zones | Use `new Date(Number(year), Number(month) - 1)` constructor only | 2 |
| N3 | Stale "Present" — `page.tsx` statically generated at build time; `new Date()` frozen at deploy | Accept limitation + document, OR move duration to `'use client'` hydration component | 2 |
| N4 | Missing AnimateIn wrap — new section pops in while others animate | Treat as mandatory invariant for every new `page.tsx` section | 3 |
| N5 | Timeline dot misalignment — `top-5.5`/`-left-5.5` offsets are empirically tuned | Mandatory visual check at 375px + 1280px as final step of typography phase | 4 |
| N6 | Education YAML different shape — reusing WorkEntry type causes silent gaps | Dedicated `EducationEntry` interface; do not reuse `WorkEntry` type | 1+3 |

---

## Suggested Phase Structure

| Phase | Name | Scope |
|-------|------|-------|
| 1 | Type System & Data Foundation | `ResumeData` extensions + `resume.md` YAML data |
| 2 | Bio Paragraph + Duration Labels | Header bio `<p>` + `lib/duration.ts` + WorkExperience label |
| 3 | Education Section | `EducationSection.tsx` + `page.tsx` wiring |
| 4 | Typography & Spacing Overhaul | `@theme` tokens + utility class audit across all components |

**4 phases. No new packages. All independently deployable.**

---

## Open Decisions (resolve at phase start)

- **N3 "Present" staleness:** Accept static limitation (simpler) or client `useEffect` (always fresh)?
- **Font:** Keep Geist (default Next.js font) or switch to Inter via `next/font/google`?
- **Coursework display:** Show `details` as paragraph or as bullet list in education card?

---
*Research complete: 2026-04-23 — 4 parallel researchers + synthesis*
