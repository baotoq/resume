---
phase: 09-type-system-data-foundation
reviewed: 2026-04-23T17:48:46Z
depth: standard
files_reviewed: 2
files_reviewed_list:
  - src/types/resume.ts
  - src/data/resume.md
findings:
  critical: 0
  warning: 2
  info: 2
  total: 4
status: issues_found
---

# Phase 9: Code Review Report

**Reviewed:** 2026-04-23T17:48:46Z
**Depth:** standard
**Files Reviewed:** 2
**Status:** issues_found

## Summary

Reviewed the new type definitions in `src/types/resume.ts` and the resume data file `src/data/resume.md`. The types are well-structured and the data is internally consistent with the interface contracts. No critical security issues found.

Two warnings are raised: the `ResumeData` interface lacks runtime validation (the consuming code in `page.tsx` uses an unchecked `as` cast, meaning malformed YAML will crash at render time rather than failing gracefully), and the `skills` field uses an overly loose `Record<string, string>` type with no enforcement of the comma-separated value convention described in the comment.

Two informational items are noted: an asymmetry between required `logo_url`/`link` in `ExperienceEntry` versus optional equivalents in `EducationEntry`, and a missing JSDoc/comment explaining the expected `logo_url` format (URL path vs. full URL).

---

## Warnings

### WR-01: Unsafe type cast of gray-matter output loses all runtime safety

**File:** `src/app/page.tsx:19` (contract defined in `src/types/resume.ts`)
**Issue:** `const resume = data as ResumeData` casts `gray-matter`'s `Record<string, unknown>` output directly to `ResumeData` without any runtime validation. If a required field is absent or mistyped in the YAML (e.g., `experience` is missing or `startDate` is in the wrong format), TypeScript will not catch it at runtime and the app will crash with an opaque JS error rather than a developer-friendly message. The type definition in `resume.ts` establishes a contract that is never verified.
**Fix:** Add a lightweight guard function alongside the type definitions to validate the parsed data:

```typescript
// src/types/resume.ts

export function isResumeData(data: unknown): data is ResumeData {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.name === "string" &&
    typeof d.title === "string" &&
    typeof d.github === "string" &&
    typeof d.linkedin === "string" &&
    Array.isArray(d.experience) &&
    typeof d.skills === "object" &&
    d.skills !== null
  );
}
```

Then in `page.tsx`:
```typescript
const parsed = matter(raw).data;
if (!isResumeData(parsed)) {
  throw new Error("resume.md is missing required fields");
}
const resume: ResumeData = parsed;
```

---

### WR-02: `skills` typed as `Record<string, string>` does not enforce the comma-separated value contract

**File:** `src/types/resume.ts:27`
**Issue:** The comment documents that values are "comma-separated values", but the type is `Record<string, string>` — any string is accepted. This means a consumer could accidentally assign a non-comma-separated string (e.g., a single value, or a newline-separated list) and TypeScript will not warn. More importantly, any component that splits on `,` without trimming whitespace will produce entries with leading spaces.
**Fix:** The comment-as-contract is fragile. Consider using a branded or structured type, or at minimum making the expectation explicit in the type name or a JSDoc:

```typescript
/** Maps skill category labels to comma-separated skill values, e.g. "C#, TypeScript, Go" */
skills: Record<string, string>;
```

If stricter enforcement is desired later, a `SkillCategory` type alias makes the intent machine-readable:
```typescript
type CommaSeparatedList = string; // e.g. "C#, TypeScript, Golang"
export interface ResumeData {
  // ...
  skills: Record<string, CommaSeparatedList>;
}
```

---

## Info

### IN-01: Asymmetry between required fields in `ExperienceEntry` vs `EducationEntry`

**File:** `src/types/resume.ts:7-8` vs `src/types/resume.ts:17-18`
**Issue:** `ExperienceEntry.logo_url` and `ExperienceEntry.link` are required fields, while `EducationEntry.logo_url` and `EducationEntry.link` are optional. This is consistent with the current data (all experience entries have both; the education entry has neither), but the asymmetry is undocumented. A future contributor adding an experience entry might not realize `logo_url` is mandatory and will get a TS error without understanding why.
**Fix:** Add a brief comment to make the intent explicit:

```typescript
export interface ExperienceEntry {
  // ...
  logo_url: string;  // required: path under /public, e.g. "/company_logo.svg"
  link: string;      // required: canonical URL for the company
}
```

---

### IN-02: `logo_url` format is undocumented — relative path vs. full URL is ambiguous

**File:** `src/types/resume.ts:7` and `src/data/resume.md:11`
**Issue:** `logo_url` is typed as `string` with no indication of whether it should be a relative path (e.g., `/covergo_logo.svg` pointing to `public/`) or a full URL. The data uses relative paths consistently, but `link` uses full URLs. A future contributor could accidentally use a full URL for `logo_url`, which would work in some environments but break relative-path assumptions if the app is deployed under a subpath.
**Fix:** Add a format note in the type definition:

```typescript
logo_url: string; // path relative to /public, e.g. "/company_logo.svg"
```

---

_Reviewed: 2026-04-23T17:48:46Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
