# Phase 5: Tech Stack Icons - Context

**Gathered:** 2026-04-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Add a `tech_stack` array field to each `ExperienceEntry` in `resume.md`. Render colored Devicon icons for each tech in the array, positioned below the role/date header and above the bullet list on each experience card. No new npm packages — icons load from the Devicons CDN stylesheet. Cards with no `tech_stack` field render identically to today. Unknown tech names render as a zinc text pill fallback.

</domain>

<decisions>
## Implementation Decisions

### Icon Rendering
- **D-01:** Use **colored** Devicon variant — CSS class `devicon-{slug}-original colored` — so icons render in their brand colors (React=blue, TypeScript=blue, Go=cyan, Docker=blue, etc.)
- **D-02:** **Icon only** — no text label beneath each icon. Clean row of 24px glyphs with small gap.
- **D-03:** Icons load via the Devicons CDN stylesheet added to `layout.tsx` as a `<link rel="stylesheet">` tag — no npm package.

### Text Pill Fallback
- **D-04:** Unknown tech names (no matching Devicon) render as a **zinc muted text pill**: `bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5 text-xs`. Stays visually quiet next to colored icons.

### Component Architecture
- **D-05:** New `src/components/TechStackIcons.tsx` — Server Component. Accepts `stack?: string[]` prop. Renders icon row or null (when `stack` is undefined/empty).
- **D-06:** `WorkExperience.tsx` calls `<TechStackIcons stack={entry.tech_stack} />` between the header block and the bullets `<ul>`.
- **D-07:** `layout.tsx` gets a `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />` in `<head>`.

### Data Layer
- **D-08:** `ExperienceEntry` in `src/types/resume.ts` gets `tech_stack?: string[]` (optional array of tech name strings).
- **D-09:** At least one entry in `resume.md` should have a sample `tech_stack` field for smoke-test during dev.

### Claude's Discretion
- Icon size and gap between icons — pick values that look balanced at the card width (likely `text-2xl` / 24px icons with `gap-2` or `gap-3`).
- Devicon slug mapping logic — maintain a lookup map `{ React: "react", TypeScript: "typescript", Go: "go", ... }` inside `TechStackIcons.tsx`; anything not in the map falls back to the zinc pill. Initial map should cover common web tech.
- `mt-3 mb-4` or similar spacing between header and icons row, and between icons row and bullets — match card's existing internal rhythm.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — TECH-01..05 acceptance criteria (authoritative spec for this phase)

### Project Constraints
- `.planning/PROJECT.md` — Key Decisions table; Constraints section (Tailwind v4 syntax, no next/image for external URLs, static export, React Compiler active)

### Existing Code
- `src/types/resume.ts` — `ExperienceEntry` interface; add `tech_stack?: string[]` here
- `src/components/WorkExperience.tsx` — card JSX; insert `<TechStackIcons>` between header block and `<ul>` bullets
- `src/app/layout.tsx` — add Devicons CDN `<link>` to `<head>`
- `src/data/resume.md` — YAML frontmatter; add `tech_stack` to at least one entry

### Framework
- `node_modules/next/dist/docs/` — Next.js 16 docs; read before touching framework APIs

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `WorkExperience.tsx`: card structure already has a `flex items-start gap-3` header block followed by `<ul>` bullets — `<TechStackIcons>` slots between these two naturally
- `LogoImage.tsx`: reference pattern for a small focused Server/Client Component scoped to a single card element
- `src/types/resume.ts`: `ExperienceEntry` — add `tech_stack?: string[]` alongside existing `logo_url?: string`

### Established Patterns
- Tailwind v4 syntax only (`@import "tailwindcss"` in CSS, no `tailwind.config.*`)
- Server Components are default; `'use client'` only when browser APIs (state, event handlers) are needed — `TechStackIcons` needs neither → Server Component
- React Compiler active — no manual `useMemo`/`useCallback`
- zinc palette for muted elements; indigo for accent — pill fallback uses zinc; icons use their own brand colors

### Integration Points
- `layout.tsx` `<head>`: add Devicons CDN stylesheet link once here (affects all pages, but this is a single-page app)
- `WorkExperience.tsx`: import and render `<TechStackIcons stack={entry.tech_stack} />` between header and bullets
- `src/types/resume.ts`: optional field addition only — no existing consumers break

</code_context>

<specifics>
## Specific Ideas

- Devicons CDN URL: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css`
- CSS class pattern: `devicon-{slug}-original colored` (e.g. `devicon-react-original colored`, `devicon-typescript-plain colored`)
- Note: not all icons have `original` variant — some techs only have `plain` or `line` variants; the slug map should encode the correct variant suffix per tech rather than always guessing `original`

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-tech-stack-icons*
*Context gathered: 2026-04-13*
