---
phase: 07-vercel-setup-config-migration
reviewed: 2026-04-22T09:40:36Z
depth: standard
files_reviewed: 4
files_reviewed_list:
  - next.config.ts
  - src/app/page.tsx
  - src/data/resume.md
  - src/components/LogoImage.tsx
findings:
  critical: 0
  warning: 3
  info: 1
  total: 4
status: issues_found
---

# Phase 07: Code Review Report

**Reviewed:** 2026-04-22T09:40:36Z
**Depth:** standard
**Files Reviewed:** 4
**Status:** issues_found

## Summary

Four files from the Vercel config migration were reviewed. `next.config.ts` is clean — security headers and `remotePatterns` are correctly scoped. The three issues found are: an unguarded synchronous file read that crashes the page on missing file, a wrong TypeScript interface on `LogoImage` props, and a stale placeholder `"#"` logo URL in resume data.

## Warnings

### WR-01: Unguarded `fs.readFileSync` crashes entire page render on missing file

**File:** `src/app/page.tsx:12`
**Issue:** `fs.readFileSync(filePath, "utf-8")` throws a Node `ENOENT` error if `src/data/resume.md` is absent or the working directory is not what is expected. In a Vercel deployment the file is bundled at build time and `process.cwd()` resolves correctly, but there is no try/catch — any I/O failure surfaces as an unhandled exception that takes down the entire page instead of rendering a graceful fallback.
**Fix:**
```ts
let raw: string;
try {
  raw = fs.readFileSync(filePath, "utf-8");
} catch (err) {
  console.error("Failed to read resume.md:", err);
  // Return a minimal error UI or throw to the nearest error boundary
  throw new Error("Resume data unavailable");
}
const { data } = matter(raw);
```

### WR-02: `LogoImage` props interface extends `ButtonHTMLAttributes<HTMLDivElement>` but component renders a `<div>`

**File:** `src/components/LogoImage.tsx:6`
**Issue:** `interface LogoImageProps extends React.ButtonHTMLAttributes<HTMLDivElement>` combines a button's attribute set with a div element. `ButtonHTMLAttributes` adds props such as `type`, `disabled`, `name`, `value`, and `formAction` that are not valid on `<div>` elements. If a caller spreads those props (or TypeScript allows them because the interface permits them), the rendered HTML will contain invalid attributes. The correct base type for a div wrapper is `React.HTMLAttributes<HTMLDivElement>`.
**Fix:**
```ts
interface LogoImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string | undefined;
  alt: string;
}
```

### WR-03: Placeholder `"#"` logo URL for AS White Global will silently render a fallback icon in production

**File:** `src/data/resume.md:37`
**Issue:** `logo_url: "#"` is not a valid image URL. `isValidSrc` in `LogoImage` correctly rejects it (the `new URL("#")` call throws, returning `false`), so it falls back to the placeholder SVG without a crash. However, this means the AS White Global entry intentionally (or accidentally) has no logo in production — the `"#"` value is semantically a placeholder that was never replaced with a real URL.
**Fix:** Either supply the real Clearbit URL `"https://logo.clearbit.com/aswhiteglobal.com"` or remove the field to rely on the `undefined` fallback path, which is handled identically:
```yaml
logo_url: "https://logo.clearbit.com/aswhiteglobal.com"
```
Or omit the field entirely:
```yaml
# logo_url field removed — component handles undefined with fallback SVG
```

## Info

### IN-01: `next.config.ts` missing `Content-Security-Policy` header

**File:** `next.config.ts:9`
**Issue:** Three security headers are present (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`). A `Content-Security-Policy` header is absent. For a resume site that loads external images from `logo.clearbit.com`, adding a CSP would prevent unexpected script injection and constrain `img-src` to the known domain. This is an improvement suggestion, not a blocking issue.
**Fix:**
```ts
{
  key: "Content-Security-Policy",
  value: "default-src 'self'; img-src 'self' https://logo.clearbit.com data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
}
```
Tune `script-src` and `style-src` directives based on actual inline script/style usage.

---

_Reviewed: 2026-04-22T09:40:36Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
