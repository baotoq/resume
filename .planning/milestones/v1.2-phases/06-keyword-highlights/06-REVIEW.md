---
phase: 06-keyword-highlights
reviewed: 2026-04-14T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - src/components/HighlightedBullet.tsx
  - src/components/WorkExperience.tsx
  - src/data/resume.md
findings:
  critical: 1
  warning: 2
  info: 2
  total: 5
status: issues_found
---

# Phase 06: Code Review Report

**Reviewed:** 2026-04-14
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

Three files were reviewed: the new `HighlightedBullet` component, the updated `WorkExperience` component, and the `resume.md` data file. The markdown parsing logic in `HighlightedBullet` is functionally correct for the data format used in this project, but it references `React.ReactNode` without importing the `React` namespace — a compile error. `WorkExperience` has a silent failure path in `formatDateRange` when a date string is malformed, and uses array index keys for both experience entries and bullets. The data file has no issues.

---

## Critical Issues

### CR-01: `React` namespace used without import — compile error

**File:** `src/components/HighlightedBullet.tsx:8`
**Issue:** `React.ReactNode` is referenced as a type on line 8, but there is no `import React from 'react'` or `import type { ReactNode } from 'react'`. The project uses `"jsx": "react-jsx"` (automatic transform), which does not inject the `React` namespace into scope. All other components in the codebase that need React types import them explicitly (e.g., `AnimateIn.tsx` imports `{ ReactNode }`). This will cause a TypeScript compile error: `Cannot find name 'React'`.

**Fix:**
```tsx
import type { ReactNode } from 'react'

interface HighlightedBulletProps {
  children: string;
}

export function HighlightedBullet({ children }: HighlightedBulletProps) {
  const boldSegments = children.split(/\*\*([^*]+)\*\*/g);

  const elements: ReactNode[] = [];
  // ...rest unchanged
```

---

## Warnings

### WR-01: Silent `Invalid Date` if `startDate`/`endDate` is malformed

**File:** `src/components/WorkExperience.tsx:12-13`
**Issue:** `formatDateRange` calls `d.split("-")` and destructures to `[year, month]`. If the string does not contain `"-"` (e.g., an empty string, a plain year `"2022"`, or a typo in the data), `month` is `undefined`, `Number(undefined)` is `NaN`, and `new Date(NaN, NaN)` produces `"Invalid Date"` — which renders silently in the UI with no error thrown. The type system accepts any string for `startDate`, so malformed data reaches this function without a type-level guard.

**Fix:** Add a guard and fall back gracefully:
```ts
function formatDateRange(start: string, end: string | null): string {
  const formatMonth = (d: string) => {
    const parts = d.split("-")
    if (parts.length < 2) return d // return raw string if not "YYYY-MM"
    const [year, month] = parts
    const date = new Date(Number(year), Number(month) - 1)
    if (isNaN(date.getTime())) return d
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`
}
```

### WR-02: Array index used as React `key` for experience entries and bullets

**File:** `src/components/WorkExperience.tsx:37, 67`
**Issue:** Both `key={index}` (experience entries, line 37) and `key={i}` (bullets, line 67) use array position as the React reconciliation key. If the list order changes (e.g., re-sorting entries, prepending a new job), React will re-use DOM nodes incorrectly, potentially causing stale state or animation artifacts. The experience entries already have a natural stable key — the combination of `company` and `startDate`.

**Fix:**
```tsx
// Line 37 — experience entry key
<div key={`${entry.company}-${entry.startDate}`} className="relative">

// Line 67 — bullet key (content is stable per entry, so content hash is acceptable)
<li key={`${bullet.slice(0, 40)}-${i}`} ...>
```
Using `startDate` as part of the experience key is safe because two entries at the same company would have different start dates.

---

## Info

### IN-01: Bold regex `[^*]` prevents matching text containing a literal `*`

**File:** `src/components/HighlightedBullet.tsx:6`
**Issue:** The regex `/\*\*([^*]+)\*\*/g` uses `[^*]` which excludes any asterisk inside bold delimiters. Text like `**O(n*log n)**` or `**C++ operator***` would not be matched and would render as literal `**...**` in the output. For the current resume data this is not a problem, but it is a latent fragility.

**Fix:** If support for asterisks inside bold text is ever needed, change the capture group to a lazy match:
```ts
const boldSegments = children.split(/\*\*(.+?)\*\*/g);
```
The lazy `+?` matches the shortest possible string between `**` delimiters, handling embedded `*` characters.

### IN-02: Italic regex in `HighlightedBullet` can match a lone `*` in plain text

**File:** `src/components/HighlightedBullet.tsx:20`
**Issue:** The italic regex `/\*([^*]+)\*/g` is applied to the plain-text segments produced after the bold split. If a plain-text segment contains an isolated `*` (e.g., a bullet like `"supports C* and Go"`), the regex will not match (requires content between two `*`), so this is safe. However, a bullet with two isolated asterisks (e.g., `"score 3*2 = 6* points"`) would incorrectly render `2 = 6` as italic. This is low risk given the content domain (resume bullets) but worth noting.

**Fix:** Constrain the italic pattern to disallow whitespace-only content and require at least one non-space character:
```ts
const italicSegments = segment.split(/\*([^*\s][^*]*)\*/g);
```

---

_Reviewed: 2026-04-14_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
