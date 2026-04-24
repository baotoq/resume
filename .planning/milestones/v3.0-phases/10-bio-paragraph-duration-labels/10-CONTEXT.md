# Phase 10: Bio Paragraph + Duration Labels - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Render two new UI elements: (1) a bio intro paragraph inside the Header card, and (2) a stacked duration label below the date range on each work experience card. No new npm packages. No client-side JavaScript — all computation at build time.

</domain>

<decisions>
## Implementation Decisions

### Bio Section
- **D-01:** Bio paragraph lives inside the existing `Header` component card — extend `Header.tsx`, do NOT create a new BioSection component.
- **D-02:** Bio renders below the contact links row, with a top margin separating it from the links.
- **D-03:** Bio text is already populated in `src/data/resume.md` (added in Phase 9, approved verbatim). No new text needed.
- **D-04:** BIO-02 animation: bio is part of the Header card — it animates in with the Header's existing `AnimateIn` wrapper. No separate AnimateIn needed.

### Duration Labels
- **D-05:** Duration label is stacked on its own line below the date range — NOT inline. Display as two lines aligned to the right: date range on top, duration below in lighter/smaller style (`text-xs text-zinc-400`).
- **D-06:** Short tenure (< 1 year): skip years, show months only — e.g. "8 mos" not "0 yrs 8 mos".
- **D-07:** Format rules:
  - ≥ 1 year, with months remainder: "X yrs Y mos" (e.g. "4 yrs 3 mos")
  - ≥ 1 year, no months remainder: "X yrs" (e.g. "2 yrs")
  - < 1 year: "Y mos" (e.g. "8 mos")
  - < 1 month: "< 1 mo"
- **D-08:** Duration utility is a standalone pure function in `src/lib/duration.ts` — ~20 lines vanilla TypeScript, no npm packages (from STATE.md locked decision).
- **D-09:** Duration computed at build time using the current date (Node.js `new Date()` at render time in the Server Component) for "Present" roles (`endDate === null`). Satisfies DUR-02 — no client JS.
- **D-10:** Duration label added inside the existing date range `<span>` area in `WorkExperience.tsx` — wrap date + duration in a `<div className="flex flex-col items-end">` to stack them.

### Claude's Discretion
- Exact top-margin value between contact links and bio paragraph in Header.
- Whether the duration line uses `text-xs` or `text-sm` — pick whichever looks balanced with the `text-sm font-bold text-zinc-500` date range above it.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Files to modify
- `src/components/Header.tsx` — extend to render `resume.bio` paragraph below contact links
- `src/components/WorkExperience.tsx` — extend date range span to stack duration label below

### Files to create
- `src/lib/duration.ts` — pure function computing "X yrs Y mos" from two date strings

### Existing patterns to follow
- `src/components/animation/AnimateIn.tsx` — framer-motion wrapper pattern (bio reuses existing Header AnimateIn)
- `src/types/resume.ts` — `ResumeData.bio?: string` and `ExperienceEntry.startDate`/`endDate` shape
- `src/components/WorkExperience.tsx` — `formatDateRange()` function for date formatting conventions

### Requirements
- `BIO-01` — bio paragraph visible at page load, no JS required
- `BIO-02` — bio section animates in on scroll entry
- `DUR-01` — each work experience entry displays computed "X yrs Y mos" duration label
- `DUR-02` — duration computed at build time (static, no client JS)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `AnimateIn` in `src/components/animation/AnimateIn.tsx` — framer-motion whileInView wrapper; bio reuses Header's existing AnimateIn (no new wrapper needed)
- `formatDateRange()` in `WorkExperience.tsx` — existing date formatter; duration utility follows same input convention (`"YYYY-MM"` strings, `null` for present)
- `ExperienceEntry.startDate` / `endDate` — already typed and populated in YAML

### Established Patterns
- Server Components read data at render time — `new Date()` in `WorkExperience.tsx` (Server Component) gives build-time current date for "Present" duration
- Card style: `rounded-xl border border-zinc-200 bg-white p-6 shadow-sm` — Header already uses this; bio renders inside same card, no new card
- Date range span: `text-sm font-bold text-zinc-500` — currently a single `<span>`; needs to become a `<div className="flex flex-col items-end">` to stack duration below

### Integration Points
- `page.tsx` — passes `resume` (with `bio?`) to Header; no changes needed in page.tsx
- `WorkExperience.tsx` — receives `experience: ExperienceEntry[]`; duration utility called inside the map, passing `entry.startDate`, `entry.endDate`, and current date

</code_context>

<specifics>
## Specific Ideas

- Duration stacked layout: right-aligned column — date range top, duration bottom in lighter style. Matches right-side position of the existing date span.
- Bio text: plain prose paragraph, no markdown rendering needed (REQUIREMENTS.md Out of Scope: "Markdown rendering in bio").

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 10-bio-paragraph-duration-labels*
*Context gathered: 2026-04-24*
