# Phase 9: Type System & Data Foundation - Pattern Map

**Mapped:** 2026-04-23
**Files analyzed:** 2 (modified files only — no new files)
**Analogs found:** 2 / 2

---

## File Classification

| Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/types/resume.ts` | model (type definitions) | transform | `src/types/resume.ts` — `ExperienceEntry` interface | exact (same file, same pattern) |
| `src/data/resume.md` | config (static data) | batch | `src/data/resume.md` — existing `experience` YAML array | exact (same file, same convention) |

---

## Pattern Assignments

### `src/types/resume.ts` (model, transform)

**Analog:** `src/types/resume.ts` — `ExperienceEntry` interface and `ResumeData` interface (lines 1-19)

**Current file state** (lines 1-19):
```typescript
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

export interface ResumeData {
  name: string;
  title: string;
  github: string;
  linkedin: string;
  experience: ExperienceEntry[];
  skills: Record<string, string>; // category label -> comma-separated values
}
```

**Interface shape pattern** — copy from `ExperienceEntry` (lines 1-10):
- Required fields: plain `fieldName: Type` — no `?`
- Optional fields: `fieldName?: Type` — e.g., `tech_stack?: string[]` on line 9
- Date fields: `startDate: string` and `endDate: string | null` — camelCase, `null` for "present", NOT `endDate?: string`
- Comment convention: inline `// "YYYY-MM" format` and `// null renders as "Present"` on date fields

**New `EducationEntry` interface to insert** (above `ResumeData`, after `ExperienceEntry`):
```typescript
export interface EducationEntry {
  degree: string;
  institution: string;
  startDate: string; // "YYYY-MM" format
  endDate: string | null; // null renders as "Present"
  logo_url?: string;
  link?: string;
}
```

**`ResumeData` extension pattern** — append two optional fields to existing interface (lines 12-19):
- Pattern: `fieldName?: Type` for optional top-level data
- Analog: `experience: ExperienceEntry[]` on line 17 shows array field convention
- New fields follow the same pattern:
```typescript
bio?: string;
education?: EducationEntry[];
```

**Field ordering rule** (from `ExperienceEntry`): required fields first, optional fields last. Apply to `EducationEntry`: `degree`, `institution`, `startDate`, `endDate` (all required) before `logo_url?`, `link?` (both optional).

---

### `src/data/resume.md` (config, batch)

**Analog:** `src/data/resume.md` — existing YAML frontmatter (lines 1-65)

**Current YAML structure** (lines 1-6, top-level keys):
```yaml
---
name: "To Quoc Bao"
title: "Senior Software Engineer"
github: "https://github.com/baotoq"
linkedin: "https://www.linkedin.com/in/baotoq"
experience:
```

**String field quoting pattern** (lines 2-4): all string scalar values wrapped in double quotes.

**Array entry pattern** (lines 7-19, first experience entry):
```yaml
experience:
  - company: "CoverGo"
    role: "Senior Software Engineer"
    startDate: "2025-02"
    endDate: null
    logo_url: "/covergo_logo.svg"
    link: "https://covergo.com"
    tech_stack: [".NET", "GraphQL", ...]
    bullets:
      - "**Developed** *quotation features*..."
```

Key conventions to copy:
- Key names are camelCase (`startDate`, `endDate`) — not snake_case
- `endDate: null` (bare YAML null, not quoted `"null"`) for present/open-ended entries
- `endDate: "2025-01"` (quoted string) for terminated entries
- Optional fields (`tech_stack`) are absent from the YAML when not populated — not set to `null` or `""`
- Two-space indentation for array entries; four-space for nested keys under `-`

**New `bio` field pattern** — plain top-level quoted string. The value contains an em-dash (`—`) which requires double-quote wrapping to be parsed safely by gray-matter:
```yaml
bio: "Senior backend engineer with 7+ years building distributed systems — .NET, Go, and Kubernetes-native architectures across insurance, e-commerce, and enterprise platforms. Designed high-throughput event pipelines, owned systems end-to-end from implementation to production, and actively integrates AI tooling to accelerate team delivery."
```

**New `education` array pattern** — follows same YAML list-of-maps structure as `experience`. Optional fields (`logo_url`, `link`) omitted entirely since no values are provided (matches convention on line 9 — not every entry has `tech_stack`):
```yaml
education:
  - degree: "Bachelor of Computer Science"
    institution: "Ton Duc Thang University"
    startDate: "2014-09"
    endDate: "2018-06"
```

**Placement:** Append `bio` and `education` keys after the existing `skills` block (line 64), before the closing `---` (line 65). Order within the frontmatter does not affect parsing.

---

## Shared Patterns

### gray-matter Consumption (no change required)
**Source:** `src/app/page.tsx` lines 18-19
**Apply to:** Understanding how new fields flow — no code change needed in page.tsx for Phase 9
```typescript
const { data } = matter(raw);
const resume = data as ResumeData;
```
The `as ResumeData` cast means new fields in YAML automatically become available on `resume.bio` and `resume.education` once the types and YAML are updated. No transformation layer, no mapping step.

### Optional Field Convention
**Source:** `src/types/resume.ts` line 9 (TypeScript) and `src/data/resume.md` lines 13-14 (YAML)
**Apply to:** Both `bio?: string` in ResumeData and `logo_url?`/`link?` in EducationEntry

TypeScript side — use `?` suffix:
```typescript
tech_stack?: string[]; // optional — field may be absent
```

YAML side — omit the key entirely when no value:
```yaml
# tech_stack is simply absent from entries that don't have it
# Do NOT write: tech_stack: null  or  tech_stack: ""
```

### Date String Convention
**Source:** `src/types/resume.ts` lines 4-5 and `src/data/resume.md` lines 9-10
**Apply to:** `EducationEntry.startDate` and `EducationEntry.endDate`

TypeScript:
```typescript
startDate: string; // "YYYY-MM" format
endDate: string | null; // null renders as "Present"
```

YAML:
```yaml
startDate: "2025-02"  # quoted "YYYY-MM" string
endDate: null         # bare null for current/present
# or:
endDate: "2021-09"   # quoted "YYYY-MM" for a completed period
```

---

## No Analog Found

None. Both files being modified are their own analogs — `ExperienceEntry` directly patterns `EducationEntry`, and the existing `experience` YAML block directly patterns the new `education` YAML block.

---

## Metadata

**Analog search scope:** `src/types/resume.ts`, `src/data/resume.md`, `src/app/page.tsx`
**Files scanned:** 3
**Pattern extraction date:** 2026-04-23
