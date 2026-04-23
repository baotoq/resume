# Architecture Research

**Domain:** Next.js 16 App Router — v3.0 feature integration into existing resume site
**Researched:** 2026-04-23
**Confidence:** HIGH (based on direct code inspection of all affected files)

## System Overview

The existing data flow is a straight line with no branches:

```
src/data/resume.md (YAML frontmatter)
    ↓  gray-matter readFileSync at request time
src/app/page.tsx (Server Component)
    ↓  typed as ResumeData
    ├── <Header resume={} email={} phone={} />
    └── <WorkExperience experience={} />
         ├── <LogoImage />
         ├── <HighlightedBullet />
         └── <TechStackIcons />
```

Each new feature either extends this line (new data → new component) or modifies an existing node (richer display in existing component). No new data sources. No API routes. No client state.

---

## Current State — What Exists

| File | What It Does | v3.0 Status |
|------|-------------|-------------|
| `src/data/resume.md` | YAML source: name, title, github, linkedin, experience[], skills{} | Needs new fields: `bio`, `education[]` |
| `src/types/resume.ts` | `ResumeData` and `ExperienceEntry` interfaces | Needs `bio?: string`, `EducationEntry` interface, `education?: EducationEntry[]` |
| `src/app/page.tsx` | Server Component — parses YAML, renders Header + WorkExperience | Needs EducationSection and Skills added to render tree |
| `src/components/Header.tsx` | Renders name, title, contact links | Needs bio paragraph below contacts |
| `src/components/WorkExperience.tsx` | Renders timeline cards; has `formatDateRange()` already | Needs computed duration label alongside date range |
| `src/components/HighlightedBullet.tsx` | Parses **bold** and *italic* inline markdown | No change required |
| `src/components/animation/AnimateIn.tsx` | framer-motion whileInView wrapper | No change required — wrap new sections with it |
| `src/components/techstack-icons/TechStackIcons.tsx` | Maps tech strings to icons | No change required for v3.0 |

**Observation:** `skills` data exists in resume.md and is typed in `ResumeData`, but no Skills component is rendered in `page.tsx`. This is an existing gap — v3.0 is not responsible for it but the Education section placement decision should account for it.

---

## Feature Integration Analysis

### Feature 1: Bio / Intro Paragraph

**Integration type:** Extend existing component + extend type + extend data

**Data change:** Add optional `bio` field to resume.md YAML frontmatter.
```yaml
bio: "Sentence or two about who you are and what you bring."
```

**Type change:** Add to `ResumeData` interface in `src/types/resume.ts`:
```typescript
bio?: string;
```

**Component change — `Header.tsx` (MODIFIED):**
Render `bio` below the contact links row if present. One conditional `<p>` block. The component already receives the full `resume: ResumeData` object, so no prop signature change is needed — `resume.bio` is available.

```
Header
  ├── name (h1)
  ├── title (p)
  ├── contact links (div)
  └── bio paragraph (p) ← NEW, conditional on resume.bio
```

**No new component needed.** Header enhancement is sufficient and keeps the bio visually attached to the identity block.

---

### Feature 2: Duration Labels on Experience Entries

**Integration type:** Computed display change — existing component, existing data

**Data change:** None. `startDate` and `endDate` already exist on `ExperienceEntry`.

**Type change:** None.

**Component change — `WorkExperience.tsx` (MODIFIED):**
`formatDateRange()` already exists in this file and produces "Feb 2025 – Present". A `computeDuration()` helper function needs to be added in the same file. It takes `startDate: string` and `endDate: string | null` and returns a human-readable label like "3 yr 2 mo" or "9 mo".

The duration label renders alongside the existing date range string in the card header. Both are display-only — no props change, no data change.

**Duration computation logic:**
- Diff in months = (endYear * 12 + endMonth) - (startYear * 12 + startMonth)
- endDate null → use current date (Date.now())
- Convert: years = Math.floor(months / 12), remainder months
- Format: "X yr Y mo", "X yr", "Y mo" (omit zero parts)

**No new component needed.** The helper is a pure function added to the top of WorkExperience.tsx.

---

### Feature 3: Education Section

**Integration type:** New data section + new type + new component + page.tsx wiring

**Data change:** Add `education` array to resume.md YAML frontmatter:
```yaml
education:
  - institution: "Ton Duc Thang University"
    degree: "Bachelor of Computer Science"
    startDate: "2014"
    endDate: "2018"
    coursework:
      - "Data Structures & Algorithms"
      - "Operating Systems"
```

Dates can be year-only strings ("2014") or "YYYY-MM" for consistency with experience entries. Year-only is simpler for education and sufficient.

**Type change:** Add to `src/types/resume.ts`:
```typescript
export interface EducationEntry {
  institution: string;
  degree: string;
  startDate: string;   // "YYYY" or "YYYY-MM"
  endDate: string;     // "YYYY" or "YYYY-MM" — education is always complete
  coursework?: string[];
}
```

Add to `ResumeData`:
```typescript
education?: EducationEntry[];
```

**New component — `src/components/EducationSection.tsx` (NEW):**
Mirrors the visual language of WorkExperience cards without the timeline rail (education is typically a single entry — no need for the vertical timeline chrome). Receives `education: EducationEntry[]`.

```
EducationSection
  └── for each entry:
       └── <article> card (same card style as WorkExperience)
            ├── institution (h3)
            ├── degree (p)
            ├── date range (span) — "2014 – 2018"
            └── coursework list (ul, optional)
```

**page.tsx change (MODIFIED):**
Import `EducationSection` and add it to the render tree. Education conventionally appears below Work Experience:

```tsx
<AnimateIn delay={0.2}>
  <EducationSection education={resume.education} />
</AnimateIn>
```

Guard with `resume.education?.length` to avoid rendering an empty section if the field is absent.

---

### Feature 4: Typography Overhaul

**Integration type:** Styling changes across existing components — no new files, no data changes, no type changes

**Scope:** All components that render visible text. This is a cross-cutting change.

**Components affected:**
| Component | What Changes |
|-----------|-------------|
| `Header.tsx` | Heading sizes, spacing, font weights, contact link styling |
| `WorkExperience.tsx` | Card padding, role/company font treatment, date range sizing, bullet spacing |
| `page.tsx` | Outer layout: `gap-8` → tighter or looser, `py-12` → adjusted |
| `EducationSection.tsx` (new) | Apply final typography system from day one |

**Tailwind v4 constraint:** No `tailwind.config.*` — all customization via CSS custom properties in the global stylesheet and utility classes directly. Existing code uses inline Tailwind utilities (e.g., `text-[28px]`, `leading-[1.1]`) — continue this pattern for one-off values.

**No new libraries.** Typography overhaul is pure Tailwind v4 utility class replacement.

---

## New Components

| Component | Path | Receives | Notes |
|-----------|------|----------|-------|
| `EducationSection` | `src/components/EducationSection.tsx` | `education: EducationEntry[]` | New — no analog in existing codebase |

---

## Modified Components and Files

| File | Modification | Scope |
|------|-------------|-------|
| `src/data/resume.md` | Add `bio` string field; add `education[]` array | Data only |
| `src/types/resume.ts` | Add `bio?: string` to `ResumeData`; add `EducationEntry` interface; add `education?: EducationEntry[]` to `ResumeData` | Types only |
| `src/app/page.tsx` | Import + render `EducationSection` inside `AnimateIn`; optionally import + render `Skills` if it exists by then | Wiring only |
| `src/components/Header.tsx` | Add bio paragraph below contact links | Additive — no existing lines removed |
| `src/components/WorkExperience.tsx` | Add `computeDuration()` helper; render duration label in card header alongside date range | Additive to logic; replace/extend JSX in header area |

---

## Data Flow After v3.0

```
src/data/resume.md (YAML frontmatter)
    bio: "..."                          ← NEW
    experience: [...]                   (unchanged; startDate/endDate already present)
    education: [...]                    ← NEW
    skills: {...}                       (unchanged; still unrendered after v3.0 unless Skills added)
    ↓  gray-matter readFileSync
src/app/page.tsx (Server Component)
    ↓  typed as ResumeData
    ├── <Header resume={} email={} phone={} />
    │       └── bio paragraph (NEW)
    ├── <WorkExperience experience={} />
    │       └── duration label per entry (NEW)
    └── <EducationSection education={} />   ← NEW
```

---

## Component Boundaries

| Component | Responsibility | Pure? | Server/Client |
|-----------|---------------|-------|---------------|
| `page.tsx` | Reads file, parses YAML, passes typed data down | No (I/O) | Server |
| `Header` | Renders identity block (name, title, contacts, bio) | Yes | Server |
| `WorkExperience` | Renders timeline with cards; computes date ranges + durations | Yes | Server |
| `EducationSection` | Renders education cards | Yes | Server |
| `AnimateIn` | framer-motion scroll animation wrapper | Yes | Client (`'use client'`) |

All new and modified components remain Server Components. No new client boundary is required for any v3.0 feature. `AnimateIn` already handles the client/server split via its wrapper pattern.

---

## Build Order

Dependencies flow in this order. Each step unblocks the next.

### Step 1 — Types + Data (foundation, no dependencies)

Update `src/types/resume.ts`:
- Add `bio?: string` to `ResumeData`
- Add `EducationEntry` interface
- Add `education?: EducationEntry[]` to `ResumeData`

Update `src/data/resume.md`:
- Add `bio` value
- Add `education` array with real data

**Why first:** Every component that reads these fields requires the types to compile. No component work can be type-safe until this step is done.

### Step 2 — Bio in Header (depends on Step 1)

Modify `src/components/Header.tsx`:
- Add conditional bio `<p>` below contact links
- `resume.bio` is already in scope via the existing `resume: ResumeData` prop

**Why second:** Isolated change to an existing component. No new files. Fast to verify visually. Lowest risk of breaking existing layout.

### Step 3 — Duration Labels in WorkExperience (depends on Step 1; independent of Step 2)

Modify `src/components/WorkExperience.tsx`:
- Add `computeDuration(start, end)` pure function
- Add duration label in card header JSX

**Why third (can run parallel with Step 2):** Purely additive — no existing functionality removed. The `formatDateRange` helper shows the pattern to follow.

### Step 4 — EducationSection component (depends on Step 1)

Create `src/components/EducationSection.tsx`:
- New component, no dependencies on Header or WorkExperience changes
- Wire into `page.tsx` with `AnimateIn` wrapper

**Why fourth:** Requires types from Step 1. Component creation is self-contained. Wire into page.tsx after the component is stable.

### Step 5 — Typography Overhaul (depends on Steps 2, 3, 4)

Update Tailwind utility classes across:
- `src/app/page.tsx` — outer layout spacing
- `src/components/Header.tsx` — identity block typography
- `src/components/WorkExperience.tsx` — card typography and spacing
- `src/components/EducationSection.tsx` — match typography system

**Why last:** All components must exist in final form before a holistic typography pass. Doing typography early means touching files multiple times. Doing it last means one focused pass over the complete visual surface.

---

## Integration Risks

| Risk | Likelihood | Mitigation |
|------|------------|-----------|
| Duration label overflow in card header on mobile | MEDIUM | Use `flex-col` on small viewports; check the existing `sm:flex-row` pattern in WorkExperience — duration label should follow the same responsive treatment as the date range span |
| `education` field optional in YAML causes TS error | LOW | `education?: EducationEntry[]` with optional chaining in page.tsx — `resume.education?.length` guard before rendering EducationSection |
| Bio paragraph breaks Header card layout on long strings | LOW | Constrain with `max-w-prose` or let natural card width govern; test with ~2 sentence bio |
| Typography pass regresses existing layout | LOW | Work Experience section is visually complex (timeline, dots, cards) — test on both mobile and desktop after every class change |

---

## Anti-Patterns to Avoid

### Anti-Pattern: Creating a `DurationLabel` sub-component

`computeDuration()` is a pure function returning a string. It does not need to be a React component. Keep it as a module-level function in `WorkExperience.tsx` alongside `formatDateRange()`.

### Anti-Pattern: Separate `BioSection` component

Bio is one paragraph semantically belonging to the identity block. Extracting it into a standalone component over-engineers a single `<p>` tag. Extend Header instead.

### Anti-Pattern: Reusing ExperienceEntry type shape for EducationEntry

Education dates are year-only and there is no `endDate: null` (education entries are complete). A distinct `EducationEntry` interface is cleaner than repurposing `ExperienceEntry` or making education dates nullable.

### Anti-Pattern: Adding Skills section as part of this milestone

`skills` data already exists in YAML and is typed in `ResumeData`, but no Skills component exists and `page.tsx` does not render one. This is an existing gap. Building Skills as part of the typography overhaul milestone conflates two concerns. Leave it out of scope unless explicitly added to the milestone.

---

## Sources

- Direct inspection: `src/app/page.tsx`, `src/types/resume.ts`, `src/data/resume.md`, `src/components/Header.tsx`, `src/components/WorkExperience.tsx`, `src/components/animation/AnimateIn.tsx` (HIGH — current codebase)
- Direct inspection: `.planning/PROJECT.md` v3.0 milestone context (HIGH)
- Prior architecture research: `.planning/research/ARCHITECTURE.md` v2.0 (HIGH — same repo)

---
*Architecture research for: v3.0 Content & Polish — feature integration*
*Researched: 2026-04-23*
