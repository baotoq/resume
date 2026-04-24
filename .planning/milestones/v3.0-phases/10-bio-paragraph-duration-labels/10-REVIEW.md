---
phase: 10-bio-paragraph-duration-labels
reviewed: 2026-04-24T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - src/lib/duration.ts
  - src/components/WorkExperience.tsx
  - src/components/Header.tsx
findings:
  critical: 0
  warning: 0
  info: 2
  total: 2
status: issues_found
---

# Phase 10: Code Review Report

**Reviewed:** 2026-04-24
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

Reviewed three files introduced or modified in phase 10: the `computeDuration` pure utility, the `WorkExperience` component that consumes it, and the `Header` component that renders the new bio paragraph. No critical or warning-level issues were found. Two info-level items are noted in `duration.ts`: a singular/plural grammatical edge case and the absence of input validation on the date string format. The components themselves are correct and consistent with project conventions.

## Info

### IN-01: Plural-only abbreviations produce grammatically awkward output for singular values

**File:** `src/lib/duration.ts:26-28`
**Issue:** The format strings `"${yrs} yrs"` and `"${mos} mos"` always use plural abbreviations regardless of count. A duration of exactly 1 year renders as `"1 yrs"` and 1 month as `"1 mos"`. The docstring spec does not define singular forms, so this may be intentional, but it reads oddly on a resume where precise phrasing matters.
**Fix:** Add a ternary for singular vs. plural:
```ts
const yrsLabel = yrs === 1 ? "yr" : "yrs";
const mosLabel = mos === 1 ? "mo" : "mos";

if (yrs >= 1 && mos > 0) return `${yrs} ${yrsLabel} ${mos} ${mosLabel}`;
if (yrs >= 1) return `${yrs} ${yrsLabel}`;
return `${mos} ${mosLabel}`;
```

### IN-02: No validation for malformed date strings — silent NaN propagation

**File:** `src/lib/duration.ts:16-18`
**Issue:** `startDate` and `endDate` are split on `"-"` and parsed with `Number()`. A value missing the separator (e.g., `"202501"` or an empty string) produces `NaN` for year or month, which silently propagates through the arithmetic and returns `"< 1 mo"` rather than surfacing the data error. Input is sourced from typed YAML via `gray-matter`, so the risk is low in practice, but the function has no defensive guard.
**Fix:** Add a format guard at the top of the function:
```ts
const DATE_RE = /^\d{4}-\d{2}$/;
if (!DATE_RE.test(startDate)) {
  throw new Error(`computeDuration: invalid startDate "${startDate}"`);
}
if (endDate !== null && !DATE_RE.test(endDate)) {
  throw new Error(`computeDuration: invalid endDate "${endDate}"`);
}
```

---

_Reviewed: 2026-04-24_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
