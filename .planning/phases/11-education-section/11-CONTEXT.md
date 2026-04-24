# Phase 11: Education Section - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Build and render an `EducationSection` component below `WorkExperience`. Displays degree, institution, date range, and optional details/coursework text. Animates in on scroll entry consistent with other sections. No timeline rail, no logo, no duration label.

</domain>

<decisions>
## Implementation Decisions

### Logo
- **D-01:** No logo — skip entirely. No logo column, no LogoImage component, no fallback icon. Education card is text-only.

### Duration Label
- **D-02:** No duration label — show date range only (e.g. "Sep 2014 – Jun 2018"). `computeDuration` utility not used here.

### Coursework / Details Field
- **D-03 (Claude's Discretion):** Add `details?: string` to `EducationEntry` in `src/types/resume.ts` — a plain prose string rendered as a paragraph when present. Bullet list display is not needed for a single short detail line. If omitted in YAML, field renders nothing. YAML for Ton Duc Thang currently has no details — field is optional and backward-compatible.

### Card Layout
- **D-04 (Claude's Discretion):** Simplified two-column header: degree + institution stacked on the left, date range on the right — no duration row below date. No bullets list, no tech stack icons. Card style follows established pattern: `rounded-xl border border-zinc-200 bg-white p-6 shadow-sm`. Section heading follows WorkExperience pattern (`text-xl font-semibold`).

### Animation
- **D-05 (Claude's Discretion):** Wrap `<EducationSection>` in `<AnimateIn delay={0.2}>` in `page.tsx` — one step after WorkExperience (delay={0.1}), consistent with existing stagger pattern.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Files to modify
- `src/types/resume.ts` — add `details?: string` to `EducationEntry`
- `src/data/resume.md` — YAML already has one education entry; no changes required unless adding details
- `src/app/page.tsx` — import and render `<EducationSection>` wrapped in `<AnimateIn delay={0.2}>`

### Files to create
- `src/components/EducationSection.tsx` — new component, receives `education: EducationEntry[]`

### Existing patterns to follow
- `src/components/WorkExperience.tsx` — card style, section heading, `formatDateRange()` date formatting
- `src/components/animation/AnimateIn.tsx` — framer-motion whileInView wrapper
- `src/types/resume.ts` — `EducationEntry` interface shape
- `src/data/resume.md` — existing YAML structure for education array

### Requirements
- `EDU-01` — education section visible below work experience
- `EDU-02` — degree, institution, date range displayed
- `EDU-03` — details shown when present (optional `details` field)
- `EDU-04` — animates in on scroll entry

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `AnimateIn` — wrap section in `page.tsx`, same as Header and WorkExperience
- `formatDateRange()` in `WorkExperience.tsx` — reuse same function or copy pattern for date display
- `EducationEntry` interface — already defined in `src/types/resume.ts` (needs `details?` addition)
- Card style constant: `rounded-xl border border-zinc-200 bg-white p-6 shadow-sm`

### Established Patterns
- Section structure: `<section>` + `<h2 className="text-xl font-semibold ...">` heading + content
- Two-column header layout: left = name/title stack, right = date/meta — already in WorkExperience
- `src/app/page.tsx` renders sections as `<AnimateIn delay={N}><ComponentName ... /></AnimateIn>`

### Integration Points
- `page.tsx` — add `<AnimateIn delay={0.2}><EducationSection education={resume.education ?? []} /></AnimateIn>` after WorkExperience block
- `src/types/resume.ts` — `ResumeData.education?: EducationEntry[]` already present; only `EducationEntry.details?` needs adding

</code_context>

<specifics>
## Specific Ideas

- Date range uses same `formatDateRange()` pattern as work entries — "Sep 2014 – Jun 2018"
- No timeline rail (REQUIREMENTS.md Out of Scope: "Education timeline rail: Single entry — rail adds visual noise without benefit")
- No GPA/honors (REQUIREMENTS.md Out of Scope: "Education section GPA/honors")
- Current YAML entry: Bachelor of Computer Science, Ton Duc Thang University, 2014-09 → 2018-06

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 11-education-section*
*Context gathered: 2026-04-24*
