# Phase 4: Visual Polish - Context

**Gathered:** 2026-04-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Add company logos and a vertical timeline to the work experience section. Each `ExperienceEntry` gains an optional `logo_url` field; a `LogoImage` client component renders the image with a briefcase SVG fallback; `WorkExperience.tsx` gets a timeline rail and per-entry dots. No new sections, no new data sources, no backend changes.

</domain>

<decisions>
## Implementation Decisions

### Logo Data & Fallback
- **D-01:** `logo_url?: string` added to `ExperienceEntry` in `src/types/resume.ts` (LOGO-03)
- **D-02:** Plain `<img>` tag — not `next/image` — because `next/image` with external URLs silently 404s on GitHub Pages static export
- **D-03:** `onError` + `useState` in a `'use client'` `LogoImage.tsx` component handles failed loads; triggers briefcase fallback
- **D-04:** Briefcase fallback is an inline SVG — no icon library (bundle cost not justified for one icon); avoids basePath routing issues

### Logo Visual
- **D-05:** Logo size: **40×40px**, **rounded square** clip (matches the card's `rounded-xl` aesthetic; better for wordmarks/wide logos)
- **D-06:** Logo position: **left of company name** in the card header. Layout: `[Logo] Company / Role ... Date`
- **D-07:** When no `logo_url` is set or the image fails, the briefcase SVG occupies the same 40×40 slot so the layout doesn't shift

### Timeline
- **D-08:** **Outside-card rail** layout — cards shift right, a narrow column on the left holds the vertical line + dots. Clean separation, classic resume timeline.
- **D-09:** Current role (`endDate === null`) → **filled indigo dot**; past roles → **hollow/outlined dot** (TIMELINE-03)
- **D-10:** Vertical line ends at the last entry — does not extend past it (TIMELINE-04)
- **D-11:** Mobile (375px) behavior → **Claude's discretion** — pick whichever rail width / collapse behavior maximises readability at 375px without horizontal scroll

### Component Architecture
- **D-12:** `LogoImage.tsx` — new `'use client'` component; handles onError + state only
- **D-13:** `WorkExperience.tsx` — stays a Server Component; adds timeline wrapper and per-entry dot/line markup around existing card JSX
- **D-14:** `src/data/resume.md` — add `logo_url` to one entry as a smoke-test placeholder

### Claude's Discretion
- Mobile timeline behaviour (D-11): Claude chooses rail width or hide-on-mobile, optimising for readability at 375px with no horizontal scroll.
- Tailwind classes for line color, dot border, rail width — match existing zinc/indigo palette; keep consistent with card's `border-zinc-200` and existing `indigo` usage.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — LOGO-01..03 and TIMELINE-01..04 acceptance criteria (authoritative spec)

### Project Constraints
- `.planning/PROJECT.md` — Key Decisions table (especially: no next/image for external URLs, inline SVG, static export constraint)

### Existing Code
- `src/types/resume.ts` — current `ExperienceEntry` and `ResumeData` types (add `logo_url?` here)
- `src/components/WorkExperience.tsx` — existing card JSX and Tailwind classes to extend
- `src/data/resume.md` — YAML frontmatter schema for experience entries

### Framework
- `node_modules/next/dist/docs/` — Next.js 16 docs; read before touching any framework APIs (breaking changes vs training data)

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `WorkExperience.tsx`: existing card structure (`rounded-xl border border-zinc-200 bg-white px-6 py-6 shadow-sm`) — timeline wrapper wraps around `experience.map(...)`, dots overlay the left rail
- `AnimateIn.tsx`: scroll animation wrapper — already applied to sections; no change needed for Phase 4
- `src/types/resume.ts`: `ExperienceEntry` — only `logo_url?: string` needs adding

### Established Patterns
- Tailwind v4 syntax only (`@import "tailwindcss"` in CSS, no `tailwind.config.*`)
- Server Components default; `'use client'` only when browser APIs (onError, useState) are needed
- zinc palette for borders/text; indigo for accent (existing usage in page)
- framer-motion 12 for animations — already installed; available if needed for dot transitions (but likely unnecessary)

### Integration Points
- `page.tsx` renders `<WorkExperience experience={data.experience} />` — no change needed there
- `resume.md` frontmatter → `gray-matter` → `ExperienceEntry[]` — adding `logo_url` to the type and one entry is the full data-layer change

</code_context>

<specifics>
## Specific Ideas

- Outside-card rail timeline is the classic resume/LinkedIn timeline pattern — dot sits at the card header level, line runs through the gap between cards
- 40×40 rounded square logo left-anchors the card header: `flex items-start gap-3` with logo on left, `[company / role]` text in the middle column, date right-aligned

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-visual-polish*
*Context gathered: 2026-04-13*
