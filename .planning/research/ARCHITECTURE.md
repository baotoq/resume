# Architecture Patterns

**Domain:** Company logos + vertical timeline — v1.1 milestone integration into existing resume page
**Researched:** 2026-04-13

---

## Integration Question

Two new features are being added to the existing Server Component architecture:

1. `logo_url` optional field on `ExperienceEntry` — an `<img>` in the card header, briefcase icon fallback when absent.
2. Vertical timeline — left-side continuous line with a dot per job entry, connecting all `WorkExperience` cards.

Both features integrate without any new files. The existing `WorkExperience.tsx` Server Component absorbs both changes. The type definition file changes by one field. Nothing else needs to touch.

---

## Existing Architecture (as shipped v1.0)

```
resume.md (YAML frontmatter)
  → gray-matter in page.tsx (Server Component, synchronous readFileSync at build time)
    → ResumeData typed object
      → Header({ resume }) [Server Component]
      → WorkExperience({ experience }) [Server Component]
      → Skills({ skills }) [Server Component]
        each wrapped in AnimateIn [Client Component, framer-motion boundary]
```

`page.tsx` is the only file that reads data. It casts `data as ResumeData` from gray-matter and passes typed props down. All section components are pure Server Components. `AnimateIn` is the only `'use client'` boundary in the tree.

---

## File-Level Change Map

| File | Status | What Changes |
|------|--------|--------------|
| `src/types/resume.ts` | **MODIFIED** | Add `logo_url?: string` to `ExperienceEntry` |
| `src/components/WorkExperience.tsx` | **MODIFIED** | Timeline wrapper layout + logo/fallback rendering per card |
| `src/data/resume.md` | **MODIFIED** | Optionally add `logo_url` keys to experience entries |
| `src/app/page.tsx` | **UNCHANGED** | Already passes `resume.experience` to WorkExperience |
| `src/app/globals.css` | **UNCHANGED** | Tailwind v4 utility classes handle all new styling |
| `src/components/AnimateIn.tsx` | **UNCHANGED** | Still wraps the WorkExperience section as before |
| `src/components/Header.tsx` | **UNCHANGED** | Unrelated |
| `src/components/Skills.tsx` | **UNCHANGED** | Unrelated |
| `src/app/layout.tsx` | **UNCHANGED** | Unrelated |

**New files: none.**

---

## Component Boundaries — No New Boundaries Needed

`WorkExperience` is a Server Component (no `'use client'`, no hooks). Both new features — a CSS timeline layout and a conditional `<img>` — are pure markup decisions. They do not introduce browser APIs, event handlers, or state. The component stays a Server Component.

A `<CompanyLogo>` sub-component could be extracted within `WorkExperience.tsx` as a local function if the logo/fallback block grows beyond ~8–10 lines, but it must not be a separate file. There is no reason to create a `src/components/CompanyLogo.tsx` — it would be an abstraction for a single use case with no reuse elsewhere.

---

## Architecture for Each Feature

### Feature 1: logo_url + briefcase fallback

**Type change** in `src/types/resume.ts`:

The `ExperienceEntry` interface gains one optional field:

```typescript
logo_url?: string
```

gray-matter already passes unknown YAML keys through as-is. Adding a real typed field lets TypeScript narrow the conditional render without a type assertion.

**Rendering** inside `WorkExperience.tsx`:

The card header `<div>` currently holds company name and role in a flex row. The logo or fallback icon sits to the left of that text block. Conditional:

- `entry.logo_url` present → `<img src={entry.logo_url} alt={entry.company} className="h-8 w-8 rounded object-contain" />`
- absent → a briefcase SVG or a `<span>` containing a Unicode briefcase character as fallback

**Static export note:** Use standard `<img>`, not Next.js `<Image>`. `<Image>` with external `src` requires `remotePatterns` in `next.config.ts` listing every logo domain. At static export time, the Next.js image optimisation pipeline does not run anyway — images are served as-is. Plain `<img>` is correct and avoids config churn.

### Feature 2: Vertical timeline

**Approach:** CSS layout change inside `WorkExperience.tsx`. No new component, no JavaScript.

The list container `<div>` (currently `className="flex flex-col gap-6"`) becomes a relative-positioned column with left padding. A continuous vertical line and per-entry dots are added using Tailwind pseudo-element utilities.

Structural sketch:

```
<div className="relative flex flex-col gap-6 pl-8">
  {/* vertical line — spans the full column height */}
  <div className="absolute left-3 top-2 bottom-2 w-px bg-zinc-200" aria-hidden="true" />

  {experience.map((entry, index) => (
    <div key={index} className="relative">
      {/* timeline dot — aligned to the line */}
      <span className="absolute -left-5 top-6 h-2.5 w-2.5 rounded-full bg-white border-2 border-zinc-300" aria-hidden="true" />

      {/* existing article card — internals unchanged */}
      <article className="rounded-xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">
        {/* ... */}
      </article>
    </div>
  ))}
</div>
```

The `pl-8` on the container pushes all cards right, creating space for the line and dot on the left. The dot's `border-2 border-white` gives a "ring" effect that visually separates it from the line. The exact pixel values (left offset, dot size, top alignment) are tuning details — the structural pattern is correct.

**No JavaScript. No new component. Static export compatible.**

---

## Suggested Build Order

Dependencies run in this order:

**Step 1 — `src/types/resume.ts`**
Add `logo_url?: string` to `ExperienceEntry`. Do this first. TypeScript will immediately enforce the field downstream when it is referenced in the component.

**Step 2 — `src/components/WorkExperience.tsx`**
Implement both features in a single edit pass:
- Add relative container + left padding + vertical line `<div>` around the experience list.
- Add per-entry wrapper `<div>` with positioned dot `<span>`.
- Add logo `<img>` / briefcase fallback in the card header.

These two sub-tasks are independent of each other within the component (the timeline is the outer structure, the logo is the card interior), but doing them in one edit avoids a second round-trip through the same file.

**Step 3 — `src/data/resume.md`**
Add `logo_url` to one or more entries. This is a content change, not code. It requires Step 1 (typed field) and Step 2 (render logic) to already exist. Can be a placeholder URL for development verification.

**Step 4 — Visual verification**
Run `npm run dev`. Confirm:
- Timeline line appears down the left side of all experience cards.
- Dot appears at the top-left of each card, aligned with the line.
- Logo renders when `logo_url` is set.
- Briefcase fallback renders when `logo_url` is absent.
- Mobile layout (narrow viewport): line and dots still align, logo does not overflow card.
- Existing card layout (company, role, date range, bullets) is undisturbed.

**Step 5 — `npm run build`**
Confirm static export succeeds (`next build`). TypeScript strict mode must pass with no errors. The build output should still show the page as statically rendered.

---

## Static Export Compatibility

| Concern | Assessment |
|---------|------------|
| `<img>` with external `src` | Compatible — static export does not restrict `<img>` |
| Next.js `<Image>` with external URLs | Avoid — requires `remotePatterns` config and optimisation does not apply at export time |
| Timeline as pure Tailwind CSS | Compatible — zero runtime JavaScript, no server features used |
| `WorkExperience` stays a Server Component | Compatible — no hooks or browser APIs introduced |
| gray-matter passes `logo_url` through | Compatible — unknown YAML keys are passed through as strings already; adding the typed field makes it explicit |

---

## Anti-Patterns to Avoid

**Do not use Next.js `<Image>` for logos.** The image optimiser does not run during `output: 'export'` static builds. External URLs require `remotePatterns` configuration. Plain `<img>` is the right call for this use case.

**Do not create a separate `Timeline` component** that wraps `WorkExperience` as children. The timeline is a layout property of the work experience list, not a general-purpose layout primitive. Extracting it into a wrapper component adds indirection and file overhead for a feature used exactly once.

**Do not add `'use client'` to `WorkExperience`.** The logo and timeline are entirely static markup. Adding a client boundary would unnecessarily hydrate the entire work experience section in the browser.

**Do not use a CSS `background-image` or `border-left` trick for the vertical line.** A real positioned `<div>` is easier to reason about in Tailwind v4, inherits color tokens correctly, and is trivially adjustable.

---

## Sources

- Direct codebase inspection — all findings are from reading the live files:
  - `src/types/resume.ts` (lines 1–16)
  - `src/components/WorkExperience.tsx` (lines 1–50)
  - `src/app/page.tsx` (lines 1–34)
  - `src/app/globals.css` (lines 1–20)
  - `src/data/resume.md` (lines 1–36)
  - `src/components/AnimateIn.tsx` (lines 1–22)
- Confidence: HIGH — all findings from direct inspection of the live codebase; no external sources needed for this integration-scoped analysis.
