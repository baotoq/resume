# Add `website` field to resume header

**Date:** 2026-05-05
**Status:** Approved

## Goal

Surface the personal site URL `https://baotoq.dev` in the resume header alongside the existing GitHub and LinkedIn pills.

## Scope

Three files touched. No new components. No new dependencies.

1. `src/data/resume.md` — frontmatter gets a `website` key.
2. `src/lib/resume-schema.ts` — `ResumeSchema` gets an optional `website` field.
3. `src/features/page/Header.tsx` — `pills` array gets a new entry positioned before GitHub.

## Design decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Field name | `website` | Generic; survives if domain changes. |
| Schema requirement | `optional` | Graceful if removed; matches `bio` precedent. |
| Pill order | Website → GitHub → LinkedIn | Personal site is the primary canonical destination. |
| Display text | `baotoq.dev` | Strip protocol; shorter, memorable. |
| Icon | `Globe` from `lucide-react` | Lucide already imported in `Header.tsx` (`Phone`); avoids adding another `react-icons` import for one pill. |

## Changes

### 1. `src/data/resume.md`

Add after the `linkedin:` line:

```yaml
website: "https://baotoq.dev"
```

### 2. `src/lib/resume-schema.ts`

In `ResumeSchema` (currently lines 42–54), add after `linkedin`:

```ts
website: z.string().min(1).optional(),
```

### 3. `src/features/page/Header.tsx`

Imports — add `Globe` to the `lucide-react` import:

```ts
import { Globe, Phone } from "lucide-react";
```

`pills` `useMemo` — insert as the first entry after the optional `phone` pill, before GitHub:

```ts
resume.website && {
  label: "Personal website",
  href: resume.website,
  text: resume.website.replace(/^https?:\/\//, "").replace(/\/$/, ""),
  Icon: Globe,
},
```

Update the `useMemo` dependency array to include `resume.website`.

## Verification

- `npm run lint` clean.
- `npm run test` — `parse-resume.test.ts` passes; update fixture if it asserts strict shape and rejects extra fields.
- `npm run dev` — header renders Website pill before GitHub, links to `https://baotoq.dev`, displays `baotoq.dev`.
- `npm run build` succeeds.

## Out of scope

- Deploying the site to baotoq.dev (DNS, hosting).
- Email/phone surfacing changes.
- Any styling change to existing pills.

---

## Amendment — 2026-05-05 (post-implementation)

**Pivot:** Drop the screen-mode Website pill (Task 2 work) and instead surface the URL in print/PDF only. Reason: PDF reader needs a way to find the current version of the resume; screen reader can use the GitHub/LinkedIn pills already there.

### Final behavior

- **Screen:** no Website pill. Download button visible. Header pill row identical to pre-branch state.
- **Print / PDF (`@media print` or `[data-print]` attribute):** Download button hidden (existing behavior). New text appears in its place: `Find latest version at baotoq.dev`, with `baotoq.dev` rendered as a real `<a href="https://baotoq.dev">` so the PDF preserves the hyperlink.

### Changes vs. original spec

| Layer | Original | Amended |
|-------|----------|---------|
| Schema (`resume-schema.ts`) | optional `website` | unchanged — keep optional `website` |
| Data (`resume.md`) | `website: "https://baotoq.dev"` | unchanged |
| Test (`parse-resume.test.ts`) | type + URL regex assertion | unchanged |
| `Header.tsx` import | add `Globe` from lucide | revert — no `Globe` |
| `Header.tsx` pills array | new Website pill before GitHub | revert pill; add print-only `<span data-pdf-only>` sibling after `<DownloadResumePill />` |
| `globals.css` | not touched | add `[data-pdf-only]` selector pair (screen-hidden, print-visible) |

### Print-only marker

Existing print convention uses `[data-pdf-trigger]` and `[data-pdf-hidden]` (both hidden in print). Inverse marker `[data-pdf-only]` is added with this rule set:

```css
[data-pdf-only] { display: none; }
[data-print] [data-pdf-only] { display: inline; }
@media print {
  [data-pdf-only] { display: inline !important; }
}
```

`!important` matches the surrounding print-CSS conventions in this file.

### Element

```tsx
{resume.website && (
  <span data-pdf-only className="text-sm text-muted-foreground">
    Find latest version at{" "}
    <a href={resume.website} className="underline">
      {resume.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
    </a>
  </span>
)}
```

Placement: inside the same `flex flex-wrap` pill row, after `<DownloadResumePill />`, inside the `TooltipProvider`.

### Verification additions

- `npm run dev` + `Cmd+P` (or render with `data-print` set on `<html>`): the new line appears, Download hidden.
- Existing e2e test `download pill is hidden` continues to pass.
- Optional: add `[data-pdf-only]` visibility check to e2e if straightforward.
