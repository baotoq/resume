# Phase 9: Type System & Data Foundation - Research

**Researched:** 2026-04-23
**Domain:** TypeScript interface extension + YAML frontmatter data authoring
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Add `bio?: string` to `ResumeData` interface in `src/types/resume.ts`.
- **D-02:** Populate `bio` in `resume.md` with this exact text:
  > "Senior backend engineer with 7+ years building distributed systems — .NET, Go, and Kubernetes-native architectures across insurance, e-commerce, and enterprise platforms. Designed high-throughput event pipelines, owned systems end-to-end from implementation to production, and actively integrates AI tooling to accelerate team delivery."
- **D-03:** Tone: results-focused, no first-person pronouns, 2 sentences.
- **D-04:** Define a new `EducationEntry` interface — distinct from `ExperienceEntry`.
- **D-05:** Required fields: `degree: string`, `institution: string`, `startDate: string`, `endDate: string | null`.
- **D-06:** Optional fields: `logo_url?: string`, `link?: string`.
- **D-07:** No `details` / coursework field — EDU-03 (relevant coursework display) is dropped.
- **D-08:** Date field naming follows ExperienceEntry convention: camelCase (`startDate`, `endDate`), matching existing YAML keys.
- **D-09:** Add `education?: EducationEntry[]` to `ResumeData` interface.
- **D-10:** Populate `resume.md` with one education entry: degree "Bachelor of Computer Science", institution "Ton Duc Thang University", startDate "2014-09", endDate "2018-06", no `link` or `logo_url`.
- **D-11:** `src/types/resume.ts` and `src/data/resume.md` must be updated in the same commit. Do not split across two commits.

### Claude's Discretion

- Field ordering within `EducationEntry` — follow ExperienceEntry conventions for consistency.
- Whether `endDate: string | null` or `endDate?: string` — match ExperienceEntry's `endDate: string | null` pattern.

### Deferred Ideas (OUT OF SCOPE)

- **EDU-03 (coursework display)** — User decided no coursework field. If needed in future, add `details?: string[]` at that time.
- **logo_url for education** — No university logo URL provided. Can be added to YAML later without a type change.
- **link for education** — No university link provided. Can be added to YAML later without a type change.

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BIO-01 (data layer) | Bio paragraph visible at top of resume — Phase 9 provides the `bio?: string` field in `ResumeData` and YAML value that Phase 10 will render | D-01, D-02: type field + YAML value fully specified |
| DUR-01 (data layer) | Duration labels computed from dates — Phase 9 ensures `startDate`/`endDate` date format is consistent across experience and education entries | Existing `ExperienceEntry` dates already in "YYYY-MM" format; no schema change needed |
| EDU-01 (data layer) | Education section visible below work experience — Phase 9 provides `education?: EducationEntry[]` in `ResumeData` | D-09: field added to ResumeData |
| EDU-02 (data layer) | Education entry shows degree, institution, date range — Phase 9 defines the `EducationEntry` shape with exactly these fields | D-04 through D-08: interface fully specified |
| EDU-03 | Dropped — user decided no coursework field (D-07) | Out of scope for this phase and all future phases unless revisited |

</phase_requirements>

---

## Summary

Phase 9 is a pure data-layer change: extend `src/types/resume.ts` with one new interface (`EducationEntry`) and two new fields on `ResumeData` (`bio?`, `education?`), then populate `src/data/resume.md` with the corresponding YAML values. No new npm packages, no component work, no routing changes.

The existing codebase is in excellent shape for this extension. The current `ExperienceEntry` interface provides an exact pattern to follow for `EducationEntry` — same camelCase date field names, same `string | null` nullable convention for `endDate`, same optional field syntax. The `gray-matter` parsing in `page.tsx` uses a direct `data as ResumeData` cast with no transformation layer, meaning new fields automatically flow through once the types and YAML are updated together.

The build baseline is clean: `npm run build` produces zero TypeScript errors and zero lint errors as of 2026-04-23. The TypeScript compiler runs in strict mode (`"strict": true` in `tsconfig.json`), so the new interface additions must be syntactically correct and structurally consistent. The atomicity rule (D-11) is the only operational constraint — both files must land in the same commit.

**Primary recommendation:** Two file edits, one commit. Add `EducationEntry` interface above `ResumeData` in `src/types/resume.ts`, extend `ResumeData` with `bio?` and `education?`, then append `bio` and `education` blocks to `src/data/resume.md` frontmatter. Run `npm run build` to verify zero errors before committing.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Bio text storage | Static data file (`resume.md`) | — | Plain string value, no transformation; YAML frontmatter is the data source |
| Education data storage | Static data file (`resume.md`) | — | Structured entry with known fields; same pattern as experience |
| Type contracts for bio + education | TypeScript types (`src/types/resume.ts`) | — | Type safety enforced at build time via `npm run build` |
| Runtime data access | Server component (`src/app/page.tsx`) | — | gray-matter parses and casts at request time; new fields flow automatically |
| Component rendering (bio, education) | Frontend components | — | Out of scope for Phase 9 — Phases 10 and 11 responsibility |

---

## Standard Stack

### Core (existing — no new packages)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | 5.x (tsconfig strict) | Type system — `ExperienceEntry`, `ResumeData`, new `EducationEntry` | Already in use; project constraint |
| gray-matter | 4.0.3 | YAML frontmatter parsing — `data as ResumeData` pattern | Already in use; no transformation layer |
| Next.js | 16.2.3 | Build system — runs TypeScript check via `npm run build` | Already in use |

**No new packages.** Project-level decision: zero new npm packages for v3.0 data work (STATE.md).

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `endDate: string | null` | `endDate?: string` | `string | null` is explicit about "present" vs "absent"; matches ExperienceEntry — use `string | null` per D-05 and Claude's Discretion resolution |
| Inline `EducationEntry` in `ResumeData` | Separate top-level interface | Top-level interface is more readable and reusable across Phase 11 components — match ExperienceEntry pattern |

---

## Architecture Patterns

### System Architecture Diagram

```
resume.md (YAML frontmatter)
    |
    | bio: "..."
    | education: [{degree, institution, startDate, endDate}]
    |
    v
gray-matter (page.tsx)
    |
    | data as ResumeData
    |
    v
ResumeData (src/types/resume.ts)
    |-- bio?: string
    |-- education?: EducationEntry[]   <-- Phase 9 adds these two fields
    |-- experience: ExperienceEntry[]  (existing)
    |-- ...
    |
    v
page.tsx passes resume to components
    |-- <Header resume={resume} ...>       (existing)
    |-- <BioSection bio={resume.bio}>      (Phase 10)
    |-- <WorkExperience ...>               (existing)
    |-- <EducationSection education={resume.education}>  (Phase 11)
```

### Recommended Project Structure

No new directories. Both changes are in-place edits to existing files:

```
src/
├── types/
│   └── resume.ts        # Add EducationEntry interface + extend ResumeData
└── data/
    └── resume.md        # Add bio field + education array to YAML frontmatter
```

### Pattern 1: EducationEntry Interface Shape

**What:** New interface following ExperienceEntry conventions exactly.
**When to use:** Define above `ResumeData` in `src/types/resume.ts`, just as `ExperienceEntry` is defined above `ResumeData`.

```typescript
// Source: [VERIFIED: src/types/resume.ts — ExperienceEntry as pattern]
export interface EducationEntry {
  degree: string;
  institution: string;
  startDate: string;    // "YYYY-MM" format — matches ExperienceEntry convention
  endDate: string | null; // null = present — matches ExperienceEntry convention
  logo_url?: string;    // optional — same syntax as ExperienceEntry.tech_stack?
  link?: string;        // optional
}
```

### Pattern 2: ResumeData Extension

**What:** Two optional fields appended to the existing `ResumeData` interface.
**When to use:** Optional fields (`?`) so existing YAML without these keys does not cause a TypeScript error.

```typescript
// Source: [VERIFIED: src/types/resume.ts — ResumeData current shape]
export interface ResumeData {
  name: string;
  title: string;
  github: string;
  linkedin: string;
  experience: ExperienceEntry[];
  skills: Record<string, string>;
  bio?: string;                    // new — Phase 9
  education?: EducationEntry[];    // new — Phase 9
}
```

### Pattern 3: YAML Frontmatter Additions

**What:** New top-level keys in `resume.md` following existing YAML style.

```yaml
# Source: [VERIFIED: src/data/resume.md — existing YAML style]
bio: "Senior backend engineer with 7+ years building distributed systems — .NET, Go, and Kubernetes-native architectures across insurance, e-commerce, and enterprise platforms. Designed high-throughput event pipelines, owned systems end-to-end from implementation to production, and actively integrates AI tooling to accelerate team delivery."
education:
  - degree: "Bachelor of Computer Science"
    institution: "Ton Duc Thang University"
    startDate: "2014-09"
    endDate: "2018-06"
```

Note: `logo_url` and `link` are omitted — optional fields are absent from YAML when not populated, matching the existing convention (e.g., not all ExperienceEntry items have `tech_stack`).

### Anti-Patterns to Avoid

- **Splitting the commit:** D-11 prohibits updating `resume.ts` and `resume.md` in separate commits. A type-only commit compiles; a YAML-only commit is untyped — both partial states must be avoided.
- **Using `endDate?: string` instead of `endDate: string | null`:** Optional (`?`) means "field may be absent from the object". `string | null` means "field is present but value is null". For education (completed degree), `endDate` is always provided — the null form signals "still enrolled", which is semantically consistent with `ExperienceEntry`. Per Claude's Discretion, use `string | null`.
- **Adding a `details` field:** EDU-03 is explicitly dropped (D-07). Do not add even as optional — deferred to future phase if needed.
- **Placing `bio` inside `experience`:** `bio` is a top-level field on `ResumeData`, not nested under any entry.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| YAML parsing | Custom parser | gray-matter (already installed) | Handles edge cases, quoting, multiline strings |
| TypeScript strict checking | Manual null checks at runtime | `strict: true` in tsconfig — already enabled | Compiler catches type mismatches at build time |

**Key insight:** This phase is entirely declarative — no logic to implement. The TypeScript compiler and gray-matter do all the heavy lifting.

---

## Common Pitfalls

### Pitfall 1: YAML Multiline String for Bio

**What goes wrong:** If `bio` value contains special YAML characters (em-dash `—`, colon, or quotes), the YAML parser may choke or silently truncate.
**Why it happens:** The bio text (D-02) contains an em-dash (`—`). Unquoted YAML scalars treat `—` as a block sequence indicator in some parsers.
**How to avoid:** Wrap the bio value in double quotes in the YAML frontmatter (already shown in Pattern 3 above). gray-matter handles quoted strings correctly.
**Warning signs:** gray-matter returns `bio: undefined` or a partial string — verify by logging `resume.bio` in `page.tsx` during `npm run build`.

### Pitfall 2: Optional vs. Required TypeScript Fields

**What goes wrong:** Marking `bio` and `education` as required (no `?`) means any consumer that passes `ResumeData` without these fields gets a TypeScript error — and existing YAML without these keys would fail type checking.
**Why it happens:** The `data as ResumeData` cast in `page.tsx` bypasses the check at parse time, but type-aware components in Phases 10 and 11 will pass `resume.bio` directly — if defined as required but absent from YAML, the type is technically `undefined` at runtime even though TypeScript thinks it's `string`.
**How to avoid:** Use `bio?: string` and `education?: EducationEntry[]` (optional) — then Phase 10/11 components can handle the `undefined` case with a guard.
**Warning signs:** Phase 10/11 component receives `undefined` when bio/education fields are present in YAML — indicates a field name mismatch between TypeScript and YAML.

### Pitfall 3: YAML Key Name Mismatch

**What goes wrong:** YAML key names must exactly match TypeScript field names — gray-matter does no key transformation.
**Why it happens:** Easy to write `start_date` in YAML (snake_case) when the TypeScript field is `startDate` (camelCase). The build would succeed (due to `as ResumeData`), but `resume.startDate` would be `undefined` at runtime.
**How to avoid:** The existing convention is already camelCase in YAML (`startDate`, `endDate` in experience entries — verified in `resume.md`). Use the same camelCase keys for education entries.
**Warning signs:** `educationEntry.startDate` is `undefined` at runtime despite YAML having a date value — check for key casing mismatch.

---

## Code Examples

### Complete `src/types/resume.ts` After Phase 9

```typescript
// Source: [VERIFIED: src/types/resume.ts current state + CONTEXT.md decisions]
export interface ExperienceEntry {
  company: string;
  role: string;
  startDate: string; // "YYYY-MM" format
  endDate: string | null; // null renders as "Present"
  bullets: string[];
  logo_url: string;
  link: string;
  tech_stack?: string[]; // optional tech stack for Devicon icons
}

export interface EducationEntry {
  degree: string;
  institution: string;
  startDate: string; // "YYYY-MM" format
  endDate: string | null; // null renders as "Present"
  logo_url?: string;
  link?: string;
}

export interface ResumeData {
  name: string;
  title: string;
  github: string;
  linkedin: string;
  experience: ExperienceEntry[];
  skills: Record<string, string>; // category label -> comma-separated values
  bio?: string;
  education?: EducationEntry[];
}
```

### YAML Additions for `src/data/resume.md`

```yaml
# Source: [VERIFIED: src/data/resume.md current style + CONTEXT.md D-02, D-10]
# Add these keys alongside name, title, github, linkedin, experience, skills:

bio: "Senior backend engineer with 7+ years building distributed systems — .NET, Go, and Kubernetes-native architectures across insurance, e-commerce, and enterprise platforms. Designed high-throughput event pipelines, owned systems end-to-end from implementation to production, and actively integrates AI tooling to accelerate team delivery."
education:
  - degree: "Bachelor of Computer Science"
    institution: "Ton Duc Thang University"
    startDate: "2014-09"
    endDate: "2018-06"
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `WorkEntry` type name (referenced in success criteria) | `ExperienceEntry` (actual type name in codebase) | Established at project start | Success criteria wording in ROADMAP.md is slightly wrong; the actual type is `ExperienceEntry` — Phase 9 must match the real name, not the roadmap wording |

**Note:** The ROADMAP.md Phase 9 success criteria says "distinct from `WorkEntry`" but the actual type in `src/types/resume.ts` is `ExperienceEntry`. The CONTEXT.md correctly identifies this discrepancy (canonical_refs section). `EducationEntry` must be distinct from `ExperienceEntry`.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| — | — | — | — |

**All claims in this research were verified or cited — no user confirmation needed.** The current codebase state, YAML conventions, TypeScript configuration, and build health were all verified by direct file inspection and `npm run build` execution.

---

## Open Questions

None. All decisions are locked in CONTEXT.md. Implementation is fully specified.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 9 is purely code/config changes with no external dependencies beyond the already-working TypeScript build toolchain (verified: `npm run build` passes, TypeScript 5.x, Node 24).

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None — project has no test suite (AGENTS.md: "No test suite configured") |
| Config file | n/a |
| Quick run command | `npm run build` (TypeScript type check + Next.js compilation) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TYPE-CHECK | `EducationEntry` and `ResumeData` extensions compile with zero errors | build-time | `npm run build` | n/a — build runs TypeScript |
| YAML-SHAPE | `bio` and `education` keys parse correctly via gray-matter | manual-smoke | `npm run build` (page.tsx renders without crash) | n/a |
| LINT | No lint errors introduced | lint | `npm run lint` | n/a |

### Sampling Rate

- **Per task commit:** `npm run build`
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** `npm run build` green with zero TypeScript errors before closing phase

### Wave 0 Gaps

None — no test files to create. Build system is the type safety gate.

---

## Security Domain

Phase 9 introduces no new security surface: no user input, no HTTP endpoints, no authentication, no secrets, no external services. It is purely static type and data file edits. ASVS categories V2-V6 do not apply.

---

## Sources

### Primary (HIGH confidence)

- `[VERIFIED: src/types/resume.ts]` — current ExperienceEntry and ResumeData shapes; naming conventions; optional field syntax; `string | null` pattern for endDate
- `[VERIFIED: src/data/resume.md]` — current YAML structure; camelCase key naming (startDate, endDate confirmed in experience entries); optional field omission convention
- `[VERIFIED: src/app/page.tsx]` — `data as ResumeData` cast pattern; no transformation layer; new fields flow automatically
- `[VERIFIED: tsconfig.json]` — `"strict": true`; TypeScript 5.x; `noEmit: true`; `skipLibCheck: true`
- `[VERIFIED: npm run build]` — clean baseline confirmed 2026-04-23; TypeScript check passes in 1309ms
- `[VERIFIED: .planning/phases/09-type-system-data-foundation/09-CONTEXT.md]` — all locked decisions (D-01 through D-11)
- `[VERIFIED: .planning/STATE.md]` — zero new npm packages constraint; atomicity rule; ExperienceEntry type name

### Secondary (MEDIUM confidence)

- `[CITED: gray-matter 4.0.3 npm registry]` — version confirmed; YAML double-quote handling for special characters is standard behavior

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against actual installed packages and tsconfig
- Architecture: HIGH — verified against actual source files; no assumptions about file locations
- Pitfalls: HIGH — derived from verified code patterns and known gray-matter/TypeScript behaviors
- Implementation spec: HIGH — all values locked in CONTEXT.md, verified verbatim

**Research date:** 2026-04-23
**Valid until:** 2026-05-23 (stable domain — TypeScript and gray-matter are not fast-moving)
