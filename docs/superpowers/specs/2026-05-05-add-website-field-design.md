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
