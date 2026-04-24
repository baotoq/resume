# Phase 9: Type System & Data Foundation - Context

**Gathered:** 2026-04-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Extend `src/types/resume.ts` and `src/data/resume.md` to support bio and education — unblocking Phase 10 (bio paragraph + duration labels) and Phase 11 (education section). No component work in this phase.

</domain>

<decisions>
## Implementation Decisions

### Bio Field
- **D-01:** Add `bio?: string` to `ResumeData` interface in `src/types/resume.ts`.
- **D-02:** Populate `bio` in `resume.md` with this exact text:
  > "Senior backend engineer with 7+ years building distributed systems — .NET, Go, and Kubernetes-native architectures across insurance, e-commerce, and enterprise platforms. Designed high-throughput event pipelines, owned systems end-to-end from implementation to production, and actively integrates AI tooling to accelerate team delivery."
- **D-03:** Tone: results-focused, no first-person pronouns, 2 sentences.

### EducationEntry Interface
- **D-04:** Define a new `EducationEntry` interface — distinct from `ExperienceEntry` (already decided in project planning).
- **D-05:** Required fields: `degree: string`, `institution: string`, `startDate: string`, `endDate: string | null`.
- **D-06:** Optional fields: `logo_url?: string`, `link?: string`.
- **D-07:** No `details` / coursework field — EDU-03 (relevant coursework display) is dropped. Education card shows degree, institution, and dates only.
- **D-08:** Date field naming follows ExperienceEntry convention: camelCase (`startDate`, `endDate`), matching the existing YAML keys in resume.md.

### ResumeData Extension
- **D-09:** Add `education?: EducationEntry[]` to `ResumeData` interface.

### Education YAML Data
- **D-10:** Populate `resume.md` with one education entry:
  - `degree`: "Bachelor of Computer Science"
  - `institution`: "Ton Duc Thang University"
  - `startDate`: "2014-09"
  - `endDate`: "2018-06"
  - No `link` or `logo_url` — omit optional fields (no values provided).

### Atomicity Rule (from project planning)
- **D-11:** `src/types/resume.ts` and `src/data/resume.md` must be updated in the same commit. Do not split across two commits.

### Claude's Discretion
- Field ordering within `EducationEntry` — follow ExperienceEntry conventions for consistency.
- Whether `endDate: string | null` or `endDate?: string` — match ExperienceEntry's `endDate: string | null` pattern.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Files to modify
- `src/types/resume.ts` — existing type file; add `EducationEntry` interface and extend `ResumeData`
- `src/data/resume.md` — YAML frontmatter; add `bio` field and `education` array

### Existing patterns to follow
- `src/types/resume.ts` — `ExperienceEntry` interface shape as the pattern for field naming and optionality
- `src/app/page.tsx` — how `ResumeData` is consumed (parsed via gray-matter, typed, passed to components)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ExperienceEntry` in `src/types/resume.ts` — reference for date field naming convention (`startDate`/`endDate` as camelCase strings) and optional field pattern (`tech_stack?`)
- `ResumeData` in `src/types/resume.ts` — the interface to extend with `bio?` and `education?`

### Established Patterns
- YAML keys in `resume.md` match TypeScript field names exactly — no transformation layer
- Dates stored as `"YYYY-MM"` strings; `null` for current/present roles
- Optional fields omitted from YAML when not populated (not `null`, just absent)

### Integration Points
- `src/app/page.tsx` reads `resume.md` via gray-matter, types the result as `ResumeData` — new fields flow automatically once types and YAML are updated
- Phase 10 will consume `bio` from `ResumeData` directly
- Phase 11 will consume `education: EducationEntry[]` from `ResumeData` directly

</code_context>

<specifics>
## Specific Ideas

- Bio text approved verbatim — use exactly as written in D-02.
- Education entry is minimal (no coursework) by explicit user decision — don't add details field even if EDU-03 is referenced elsewhere.

</specifics>

<deferred>
## Deferred Ideas

- **EDU-03 (coursework display)** — User decided no coursework field. If needed in future, add `details?: string[]` to `EducationEntry` at that time.
- **logo_url for education** — No university logo URL provided. Can be added to YAML later without a type change (field already optional).
- **link for education** — No university link provided. Can be added to YAML later without a type change.

</deferred>

---

*Phase: 09-type-system-data-foundation*
*Context gathered: 2026-04-23*
