# Phase 6: Keyword Highlights - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Parse `**bold**` and `*italic*` markdown syntax in bullet text from `resume.md` and render them with styled inline spans. Bold (`**text**`) renders in indigo-600 accent color (color only, same weight). Italic (`*text*`) renders in italic style. All other syntax passes through as literal text. Bullets with no markup render identically to today. No npm packages added — pure regex parsing in a new Server Component.

</domain>

<decisions>
## Implementation Decisions

### Bold text style
- **D-01:** Bold keywords (`**text**`) render as **indigo-600 text color only** — font weight unchanged. Subtle accent that makes keywords pop without feeling heavy.

### Parsing scope
- **D-02:** Support two markdown patterns: `**bold**` → indigo-600 span, `*italic*` → italic span.
- **D-03:** All other syntax (links `[text](url)`, headers `#`, etc.) passes through as literal text — no transformation.
- **D-04:** No npm markdown parser added — pure regex split within the component.

### Component structure
- **D-05:** New `src/components/HighlightedBullet.tsx` — Server Component. Accepts `children: string` prop (raw bullet text). Parses and renders inline spans. Follows TechStackIcons.tsx pattern.
- **D-06:** `WorkExperience.tsx` replaces `{bullet}` with `<HighlightedBullet>{bullet}</HighlightedBullet>` inside the `<li>` render.

### Claude's Discretion
- Regex parsing order (bold before italic to handle `***triple***` edge case correctly).
- Whether `***bold italic***` (triple asterisk) should be treated as bold+italic or passed through — pick the simpler safe path.
- Exact Tailwind class for indigo-600: `text-indigo-600` (matches existing accent usage in codebase).
- Exact Tailwind class for italic: `italic` (standard Tailwind utility).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — KW-01, KW-02, KW-03 acceptance criteria (authoritative spec for this phase)

### Project Constraints
- `.planning/PROJECT.md` — Key Decisions table; Constraints section (Tailwind v4 syntax, static export, no new npm packages implied by Phase 5 precedent)

### Existing Code
- `src/components/WorkExperience.tsx` — bullet render at line 68 (`{bullet}`); replace with `<HighlightedBullet>` here
- `src/types/resume.ts` — `ExperienceEntry` interface; `bullets: string[]` field (no type change needed)
- `src/data/resume.md` — YAML frontmatter bullets; planner should add sample `**bold**` and `*italic*` markup to at least one entry for smoke-test

### Phase 5 Reference
- `.planning/phases/05-tech-stack-icons/05-CONTEXT.md` — established component pattern (TechStackIcons.tsx); HighlightedBullet.tsx follows same structure

### Framework
- `node_modules/next/dist/docs/` — Next.js 16 docs; read before touching framework APIs

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `TechStackIcons.tsx`: reference pattern for a focused Server Component with a single prop — HighlightedBullet.tsx mirrors this structure
- `WorkExperience.tsx` line 68: `{bullet}` inside `<li>` — this is the exact integration point

### Established Patterns
- Tailwind v4 syntax only (`@import "tailwindcss"` in CSS, no `tailwind.config.*`)
- Server Components by default; no `'use client'` needed (no browser APIs required for regex parsing)
- React Compiler active — no manual `useMemo`/`useCallback`
- indigo-600 is the established accent color (used for current-role dot, active states)
- zinc-700 is the bullet text color — indigo-600 highlights contrast cleanly against it

### Integration Points
- `WorkExperience.tsx`: import `HighlightedBullet` and wrap `{bullet}` — single-line change per bullet render
- `src/data/resume.md`: add `**bold**` markup to sample bullets for dev smoke-test

</code_context>

<specifics>
## Specific Ideas

- Bold+italic order: parse `**bold**` first, then `*italic*` within remaining segments — avoids `***` ambiguity
- The existing `text-zinc-700` on `<li>` provides base color; `text-indigo-600` on `<span>` overrides just the keyword

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-keyword-highlights*
*Context gathered: 2026-04-14*
