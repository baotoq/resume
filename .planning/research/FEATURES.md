# Feature Landscape — v3.0 Content & Polish

**Domain:** Software engineer resume / CV personal page — content completeness and design quality
**Researched:** 2026-04-23
**Confidence:** HIGH (codebase inspection + official sources + widely-established conventions)

---

## Overview

Four features are being added to the existing site. The site already has: work experience section with timeline, tech stack icons, bullet highlights, skills section, scroll animations (framer-motion), and responsive layout. Features below are assessed against that baseline.

---

## Feature 1 — Bio / Intro Paragraph

### Table Stakes

These are the minimum behaviors that recruiters and engineers expect. Omitting them makes the section feel incomplete.

| Behavior | Why Expected | Complexity | Notes |
|----------|--------------|------------|-------|
| Placed at top of page, above work experience | Recruiters expect to understand who you are before reading your history | LOW | Slot it between Header and WorkExperience in `page.tsx` |
| 2–5 sentence prose summary | A short paragraph (50–150 words) is the universal convention for bio sections | LOW | YAML string field in `resume.md`; rendered as `<p>` |
| Reflects current role / seniority signal | Engineers want to read a confident professional identity statement, not a generic intro | LOW | Content responsibility, not implementation |
| Consistent card styling with rest of page | Should use the same `rounded-xl border border-zinc-200 bg-white shadow-sm` card style the other sections use | LOW | CSS only |

### Differentiators

These make the bio stand out above the baseline.

| Behavior | Value | Complexity | Notes |
|----------|-------|------------|-------|
| Fade-in scroll animation matching other sections | Visual consistency with framer-motion AnimateIn wrappers already used throughout | LOW | Wrap with existing `AnimateIn` component |
| One sentence of personal texture at end | "I care about X" or a side interest humanizes the profile — used on high-quality portfolios like Brittany Chiang's | LOW | Content choice only |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Typing / typewriter animation on the bio | Signals student project, distracts from reading the text, explicitly out of scope per PROJECT.md | Static text |
| Embedded profile photo | Resume sites for engineers do not conventionally include photos; in some regions it creates legal risk for employers | Omit |
| Multiple bio length variants / tabs | Over-engineering for a personal resume page | Single bio string |
| HTML markup inside the bio string | Creates XSS surface and complicates data model | Plain string in YAML; no markdown parsing needed in bio |

### Dependencies on Existing Features

- Requires a new `bio` field added to `ResumeData` interface in `src/types/resume.ts`
- Requires a new `bio` string in `resume.md` YAML frontmatter
- Uses existing `AnimateIn` wrapper in `src/components/animation/`
- Placement in `page.tsx` between `<Header>` and `<WorkExperience>` — no structural changes to other sections

---

## Feature 2 — Duration Labels on Experience Entries

### Table Stakes

| Behavior | Why Expected | Complexity | Notes |
|----------|--------------|------------|-------|
| Duration displayed alongside the date range | LinkedIn established this as the dominant convention; recruiters read it to assess tenure quickly | LOW | Pure calculation, no UI library needed |
| Format: "X yrs Y mos" or "Y mos" | LinkedIn's exact abbreviated format; familiar to all recruiters; "2 yrs 3 mos" for ≥1 year, "8 mos" when < 1 year | LOW | Single utility function |
| Computed from `startDate` / `endDate` fields that already exist | Data already present in `ExperienceEntry`; no schema change needed | LOW | `endDate: null` means "use today's date" |
| Current-role duration updates automatically | "Present" entries should calculate against today, not a hardcoded date | LOW | `new Date()` for null endDate |

### Differentiators

| Behavior | Value | Complexity | Notes |
|----------|-------|------------|-------|
| Muted/secondary styling distinct from the date range | Duration is secondary information to the "Jan 2021 – Sep 2021" range — styling it smaller or in zinc-400/zinc-500 vs zinc-500 creates hierarchy | LOW | Tailwind class tweak only |
| Render duration on same line as date range, parenthetical | "Jan 2021 – Sep 2021 · 8 mos" avoids adding a second line | LOW | A `·` separator or wrapping in parentheses both work |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Showing days ("2 yrs 3 mos 14 days") | Noise; no recruiter cares about day precision on job tenure | Cap at months |
| Computing "total years of experience" across all entries | Not requested; aggregate calculations are ambiguous (overlapping roles, etc.) | Duration per entry only |
| Server-side date logic that breaks on Vercel edge | None needed — this is pure arithmetic on YYYY-MM strings; no date library required | Vanilla JS `Date` arithmetic |

### Implementation Note

The existing `formatDateRange` function in `WorkExperience.tsx` already formats the display range. A parallel `formatDuration(start, end)` function is the correct pattern — keeps concerns separate and leaves `formatDateRange` unchanged.

Calculation logic:
- Parse YYYY-MM strings to `Date` objects (set day to 1 for consistent month math)
- Compute total months: `(endYear - startYear) * 12 + (endMonth - startMonth)`
- Convert: years = `Math.floor(months / 12)`, remainder months = `months % 12`
- Format: if years > 0 → `"X yr[s] Y mo[s]"` (drop zero month remainder); if years === 0 → `"Y mo[s]"`
- Edge: if total months < 1 → `"< 1 mo"`

### Dependencies on Existing Features

- No schema changes — `startDate` and `endDate` already exist on `ExperienceEntry`
- Modifies `WorkExperience.tsx` only (or extracts a `formatDuration` util)
- No new packages needed

---

## Feature 3 — Education Section

### Table Stakes

| Behavior | Why Expected | Complexity | Notes |
|----------|--------------|------------|-------|
| Degree title, institution name, graduation year | The three irreducible fields every recruiter expects | LOW | Three YAML fields |
| Placed below work experience | Senior engineers (4+ years exp) conventionally place education at the bottom; work experience is the differentiator | LOW | Order in `page.tsx` |
| Consistent card styling with work experience section | Visual consistency with the rest of the page | LOW | Reuse card CSS pattern |
| Section heading "Education" matching "Work Experience" heading style | Typographic consistency | LOW | Match `text-xl font-semibold` heading |

### Differentiators

| Behavior | Value | Complexity | Notes |
|----------|-------|------------|-------|
| Date range shown in same format as work experience ("Sep 2014 – Jun 2018") | Consistency signal; aligns visual rhythm with the experience section | LOW | Reuse or share `formatDateRange` logic |
| Relevant coursework as a light secondary line | Optional but adds substance for a CS degree; keeps education from looking sparse | LOW | Optional YAML array field `relevant_coursework`; rendered as a comma-separated line, not a bullet list |
| Scroll animation consistent with other sections | AnimateIn wrapper | LOW | Same as all other sections |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| GPA display | Irrelevant for a 7+ year experienced engineer; can actively signal insecurity | Omit entirely |
| Vertical timeline applied to education | Over-engineered for a single institution; timeline is meaningful when there are 3+ entries | Simple card without timeline rail |
| Multiple education entries | Not needed for this user (one degree); over-engineering the data model | Single entry; array can be supported in type but one entry is fine for v3 |
| Honors, activities, publications list | Out of scope; adds noise for a senior engineering resume; education is intentionally brief | Plain degree/institution/dates card |

### Schema Required

```typescript
// New type
export interface EducationEntry {
  degree: string;          // "Bachelor of Science in Computer Science"
  institution: string;     // "Ton Duc Thang University"
  startDate: string;       // "YYYY-MM" or "YYYY"
  endDate: string;         // "YYYY-MM" or "YYYY"
  relevant_coursework?: string[]; // optional
}

// Addition to ResumeData
education: EducationEntry[];
```

### Dependencies on Existing Features

- New `EducationEntry` type in `src/types/resume.ts`
- New `education` array field in `resume.md` YAML
- New `Education` component (new file `src/components/Education.tsx`)
- Placed in `page.tsx` after `<WorkExperience>` (before or after Skills — conventional order is Skills then Education for senior engineers, but either works)
- Can reuse `formatDateRange` from WorkExperience — consider extracting to a shared util

---

## Feature 4 — Typography + Spacing Overhaul

### Table Stakes

| Behavior | Why Expected | Complexity | Notes |
|----------|--------------|------------|-------|
| Consistent type scale: name > section-heading > role-title > body > secondary | Without a clear hierarchy the page reads as flat; recruiters need to scan in 6 seconds | MEDIUM | Audit all text classes across Header, WorkExperience, Skills |
| Adequate vertical rhythm between sections | Cramped sections signal rushed design; each section needs breathing room | LOW | Gap/margin audit in `page.tsx` layout wrapper |
| Body text legible at default zoom | 16px (Tailwind `text-base`) is the safe floor; do not go below 14px for bullet text | LOW | Check all `text-sm` usages — are any body text? |
| Consistent font weight usage | Bold for names/roles, medium/regular for secondary info, no weight chaos | LOW | Audit class list across components |

### Differentiators

| Behavior | Value | Complexity | Notes |
|----------|-------|------------|-------|
| Inter or similar geometric sans-serif | Professional-grade readability at screen sizes; engineers recognize it as the de facto modern UI font | LOW | Tailwind v4: define `--font-sans: 'Inter', sans-serif` in `@theme` block in CSS; add Google Fonts import |
| Section spacing 32–48px between major sections | "Breathing room" is the single highest-ROI spacing fix; sections at 24px or less feel packed | LOW | `gap-8` to `gap-12` on the page column wrapper |
| Card internal padding 24px (p-6) consistent across all cards | WorkExperience already uses `p-6`; ensure Header and future Education use the same | LOW | Audit Header.tsx — it already uses `px-6 py-6` |
| Secondary text (dates, duration, institution) in zinc-500 consistently | Creates a reliable hierarchy signal: primary=zinc-900, secondary=zinc-500, accent=blue-600 | LOW | Audit and standardize color tokens |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Custom font hosted in repo | Binary asset in git, slow loading, maintenance burden | Google Fonts or system font stack |
| Fluid/clamp typography scaling | Resume is a single-column document, not a marketing site; fluid type adds complexity with no user benefit | Fixed Tailwind scale at two breakpoints max |
| Tailwind `prose` plugin | Designed for long-form article content, not resume cards; overrides too many things | Direct Tailwind utility classes |
| Dark mode in this milestone | Independent feature, higher complexity; out of scope per PROJECT.md | Defer to Future |
| Animation overhaul alongside typography | Two orthogonal concerns; mixing them creates a large, hard-to-review diff | Typography/spacing changes only; keep existing framer-motion setup |

### Scope Clarity

"Typography + spacing overhaul" risks being unbounded. The correct scope is:

1. Establish a 4-value type scale: `text-2xl` (name) → `text-xl` (section headings) → `text-lg` (role titles) → `text-base` (body/bullets) → `text-sm` (secondary: dates, duration, tech tags)
2. Standardize spacing: `gap-10` or `gap-12` between page sections; `p-6` on all cards; `gap-2` between bullets
3. Standardize color tokens: zinc-900 primary, zinc-700 body, zinc-500 secondary, blue-600 accent
4. Optional: add Inter via Google Fonts + CSS `@theme` variable

### Dependencies on Existing Features

- Touches `Header.tsx`, `WorkExperience.tsx`, and `Skills` component (wherever it lives)
- No new packages unless adding Inter (in which case: `next/font/google` or a CSS `@import`)
- The `AnimateIn` wrappers in `src/components/animation/` are unaffected
- Tailwind v4 syntax (`@theme` in CSS, no `tailwind.config.*`) must be respected — no config file changes

---

## Feature Dependencies Summary

```
Bio/Intro paragraph
    └──requires──> new bio field in ResumeData + resume.md
    └──uses──> existing AnimateIn wrapper
    └──uses──> existing card CSS pattern

Duration Labels
    └──uses──> existing startDate / endDate on ExperienceEntry (no schema change)
    └──modifies──> WorkExperience.tsx (additive only)

Education Section
    └──requires──> new EducationEntry type + education[] in ResumeData
    └──requires──> new Education.tsx component
    └──can share──> formatDateRange utility from WorkExperience.tsx
    └──uses──> existing AnimateIn wrapper

Typography / Spacing Overhaul
    └──touches──> Header.tsx, WorkExperience.tsx, Skills component, page.tsx
    └──independent of──> all three content features above
    └──no new packages required (Inter is optional)
```

**Recommended implementation order:** Duration labels → Bio → Education → Typography. Reason: duration and bio are purely additive. Education requires a new component. Typography touches everything — doing it last means you audit the final component set, not an intermediate one.

---

## MVP for v3.0

### Must Ship

- Bio paragraph (new YAML field + new component + AnimateIn)
- Duration labels (pure calculation, no schema change)
- Education section (new type + new component + YAML data)
- Typography audit: type scale + section spacing + color token consistency

### Defer

- Inter font: low effort but requires a Google Fonts decision; can be done after content is in
- Relevant coursework in education: depends on user deciding what to list

---

## Sources

- Project codebase inspection (`src/types/resume.ts`, `src/components/WorkExperience.tsx`, `src/components/Header.tsx`, `src/data/resume.md`) — PRIMARY, HIGH confidence
- PROJECT.md — authoritative scope and out-of-scope decisions — PRIMARY, HIGH confidence
- [Brittany Chiang portfolio](https://brittanychiang.com/) — reference implementation for bio structure and date range display — MEDIUM confidence (single example but widely cited)
- [Tech Interview Handbook — resume guide](https://www.techinterviewhandbook.org/resume/) — consensus on education section placement for senior engineers — MEDIUM confidence
- [LinkedIn duration display convention](https://community.clay.com/x/support/pmvtmuip83w4/how-to-calculate-job-duration-on-linkedin-profiles) — "X yrs Y mos" format provenance — MEDIUM confidence (LinkedIn is de facto industry standard)
- [NovoResume — how to list education](https://novoresume.com/career-blog/how-to-list-education-on-resume) — education section content conventions — MEDIUM confidence
- [Tailwind CSS typography docs](https://tailwindcss.com/docs/font-size) — font-size scale and spacing utilities — HIGH confidence

---
*Feature research for: v3.0 Content & Polish — resume site*
*Researched: 2026-04-23*
