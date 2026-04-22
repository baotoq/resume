---
phase: 08-decommission-github-pages
reviewed: 2026-04-22T00:00:00Z
depth: standard
files_reviewed: 2
files_reviewed_list:
  - src/app/page.tsx
  - src/components/LogoImage.tsx
findings:
  critical: 0
  warning: 3
  info: 1
  total: 4
status: issues_found
---

# Phase 8: Code Review Report

**Reviewed:** 2026-04-22
**Depth:** standard
**Files Reviewed:** 2
**Status:** issues_found

## Summary

Two files reviewed: the root page Server Component (`page.tsx`) and the logo image component (`LogoImage.tsx`). No critical security vulnerabilities were found. Three warnings were identified — two involve missing runtime guards on fields derived from an unchecked type cast, and one is a type/attribute mismatch in `LogoImage` where `HTMLDivElement` attributes are spread onto a `next/image` `<Image>`. One informational item covers a `className` override hazard from the same spread.

## Warnings

### WR-01: Unchecked cast of resume frontmatter silently passes undefined to child components

**File:** `src/app/page.tsx:20`
**Issue:** `const resume = data as ResumeData` is an unchecked cast. `gray-matter` returns `data` as `Record<string, unknown>`. If `resume.md` frontmatter omits or misspells `experience` or `skills`, the cast succeeds at the type level, but the downstream components receive `undefined` at runtime. `WorkExperience` and `Skills` are not shown here, so their null-tolerance is unknown — this is a silent failure path.
**Fix:** Add a lightweight guard before rendering. Example using a minimal assertion:

```typescript
const resume = data as ResumeData;
if (!Array.isArray(resume.experience)) {
  throw new Error("resume.md is missing required 'experience' field");
}
if (!resume.skills || typeof resume.skills !== "object") {
  throw new Error("resume.md is missing required 'skills' field");
}
```

Alternatively, use a validation library (zod) to parse and validate the frontmatter at build time, which provides a clear error message rather than a downstream crash or silent empty render.

---

### WR-02: `resume.experience` and `resume.skills` passed without null checks

**File:** `src/app/page.tsx:32,35`
**Issue:** `resume.experience` (line 32) and `resume.skills` (line 35) are passed directly as props with no guard. These are derived from the unvalidated cast on line 20 (see WR-01). If either field is absent from the frontmatter, child components receive `undefined` for a required prop, likely causing a runtime crash or silent broken render that is hard to debug.
**Fix:** Apply guards as described in WR-01. If validation is added there, these lines become safe. Alternatively, provide a safe default:

```typescript
experience={resume.experience ?? []}
skills={resume.skills ?? {}}
```

Note: the `??` default approach masks bad data silently — explicit validation (WR-01) is preferable.

---

### WR-03: `HTMLDivElement` attributes spread onto `next/image` `<Image>` component

**File:** `src/components/LogoImage.tsx:61`
**Issue:** `LogoImageProps` extends `React.HTMLAttributes<HTMLDivElement>`. In the success path (lines 52-62), the same `{...props}` is spread onto a `next/image` `<Image>` component, which renders an `<img>` element. `HTMLDivElement`-specific attributes (e.g., `ref` typed as `RefObject<HTMLDivElement>`, event handlers with `HTMLDivElement` as `currentTarget`) are invalid on an `<img>`. TypeScript may not catch this at the call site because `HTMLAttributes<HTMLDivElement>` and `HTMLAttributes<HTMLImageElement>` share most attributes. This is a type contract violation that can surface subtle runtime bugs or React warnings if callers pass div-specific props.
**Fix:** Separate the prop types, or use a neutral base:

```typescript
// Option A: use HTMLAttributes<HTMLElement> as a neutral base
interface LogoImageProps extends React.HTMLAttributes<HTMLElement> {
  src: string | undefined;
  alt: string;
}

// Option B: define only the props you actually intend to forward
interface LogoImageProps {
  src: string | undefined;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}
```

## Info

### IN-01: `className` in spread props will silently override layout classes on `<Image>`

**File:** `src/components/LogoImage.tsx:58,61`
**Issue:** The `<Image>` has a hardcoded `className="w-10 h-10 rounded-lg object-contain shrink-0"` at line 58, followed by `{...props}` at line 61. If a caller passes `className` in props, it overwrites the layout classes entirely, breaking the component's expected sizing. The fallback `<div>` on line 27 has the same pattern but `{...props}` comes after the hardcoded `className`, so it has the same behaviour — callers can override layout.
**Fix:** Merge classNames explicitly if forwarding is intentional:

```typescript
import { cn } from "@/lib/utils"; // or clsx/tailwind-merge

<Image
  ...
  className={cn("w-10 h-10 rounded-lg object-contain shrink-0", props.className)}
  {...props}
  // remove className from spread to avoid double-application
/>
```

Or document that `className` forwarding is intentional and callers are responsible for layout.

---

_Reviewed: 2026-04-22_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
