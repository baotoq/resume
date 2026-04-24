---
phase: 11-education-section
reviewed: 2026-04-24T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - src/components/EducationSection.tsx
  - src/types/resume.ts
  - src/app/page.tsx
findings:
  critical: 0
  warning: 1
  info: 2
  total: 3
status: issues_found
---

# Phase 11: Code Review Report

**Reviewed:** 2026-04-24
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

Reviewed the new `EducationSection` component and its supporting type definitions and page integration. The implementation is clean and follows established patterns in the codebase. One warning-level issue exists in the date-formatting helper: malformed `startDate`/`endDate` values produce a silent invalid-Date rendering instead of crashing or warning. Two info-level items cover dead interface fields and a pre-existing unsafe type assertion in `page.tsx`.

No critical issues found.

## Warnings

### WR-01: Silent invalid Date on malformed `YYYY-MM` input

**File:** `src/components/EducationSection.tsx:9-16`

**Issue:** `formatDateRange` splits on `"-"` and passes the parts directly to `new Date(Number(year), Number(month) - 1)`. If `startDate` or `endDate` arrives in any format other than exactly `"YYYY-MM"` (e.g., an empty string, `null` coerced to string, or extra date components), `year` and/or `month` will be `undefined` or unparseable. `Number(undefined)` is `NaN`, so `new Date(NaN, NaN)` produces an invalid Date object. `toLocaleDateString` on an invalid Date silently returns `"Invalid Date"` in most runtimes, which surfaces to the user without any console error or thrown exception.

The risk is low because data comes from static YAML, but the silent failure mode means a data-entry typo will render visible garbage rather than a build-time or runtime error.

**Fix:** Add a guard that throws (or falls back to the raw string) so bad data is caught early:

```ts
function formatMonth(d: string): string {
  const parts = d.split("-");
  if (parts.length < 2) return d; // fallback: return raw value
  const [year, month] = parts;
  const date = new Date(Number(year), Number(month) - 1);
  if (Number.isNaN(date.getTime())) return d; // fallback: return raw value
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
```

---

## Info

### IN-01: `logo_url` and `link` on `EducationEntry` are declared but never consumed

**File:** `src/types/resume.ts:18-19`

**Issue:** `EducationEntry` declares `logo_url?: string` and `link?: string`, but `EducationSection.tsx` never reads either field. No logo or link is rendered in the education cards. This is not a bug — the fields may be reserved for future use — but they add noise to the type and could mislead a reader into thinking the component supports these features.

**Fix:** If the fields are intentionally reserved, add a comment:

```ts
logo_url?: string; // reserved — not yet rendered
link?: string;     // reserved — not yet rendered
```

If they are not planned, remove them to keep the type minimal.

---

### IN-02: Unsafe `as ResumeData` cast on YAML parse result in `page.tsx`

**File:** `src/app/page.tsx:20`

**Issue:** `const resume = data as ResumeData` asserts the raw `gray-matter` parse result is a fully valid `ResumeData`. If the YAML is missing a required field (e.g., `experience`, `name`, `skills`), TypeScript's type system provides no protection at runtime. Downstream components that dereference these fields (e.g., `resume.experience.map(...)`) will throw at render time.

This is a pre-existing pattern in the codebase, not introduced in phase 11. Noting here for completeness.

**Fix:** Add a minimal runtime shape check after the cast, or use a validation library (e.g., `zod`). A lightweight guard:

```ts
if (!Array.isArray(data.experience)) {
  throw new Error("resume.md is missing required field: experience");
}
```

---

_Reviewed: 2026-04-24_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
