# Phase 1: Content - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Render the full resume on the page: header (name, title, contact links), work experience (reverse-chronological, company/role/dates/bullets), and skills (categorized plain-text lists). No layout responsiveness, no animations — those are Phase 2.

</domain>

<decisions>
## Implementation Decisions

### Design Aesthetic
- **D-01:** Modern / card-based style — section cards with subtle shadow/border, not a flat paper resume look
- **D-02:** Light / neutral palette — zinc-50 background, white cards, zinc-900 header text, zinc-700 body text, indigo-600 or slate-700 accent, zinc-400 muted section headers

### Resume Data Source
- **D-03:** Single Markdown file with YAML frontmatter — `src/data/resume.md`. Frontmatter holds all structured data (name, title, github, linkedin, experience entries, skills). Parsed at build time with `gray-matter`.
- **D-04:** Email and phone number are NOT in the data file — read from environment variables (`NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_PHONE`) to keep them out of the public GitHub repo. Both are baked into static HTML at build time (acceptable for a resume page).

### Component Structure
- **D-05:** Split section components — `src/components/Header.tsx`, `src/components/WorkExperience.tsx`, `src/components/Skills.tsx`. `src/app/page.tsx` composes them. Isolates sections for Phase 2 animation work.

### Claude's Discretion
- TypeScript interfaces for the parsed resume data shape (e.g. `ResumeData`, `ExperienceEntry`) — Claude decides structure
- Exact card styling details (border radius, shadow level, padding) — Claude decides within the light/neutral palette
- How `null` end dates render (e.g. "Present") — Claude decides

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Next.js 16
- `node_modules/next/dist/docs/` — Breaking changes from training data; read before touching any framework APIs

### Tailwind CSS v4
- `src/app/globals.css` — v4 syntax in use (`@import "tailwindcss"`, `@theme inline`); no `tailwind.config.*` file exists

### Project requirements
- `.planning/REQUIREMENTS.md` — CONT-01, CONT-02, CONT-03 define exact acceptance criteria for this phase

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/layout.tsx` — Geist Sans + Geist Mono fonts loaded via `next/font/google`, available via CSS variables `--font-geist-sans` / `--font-geist-mono`
- `src/app/globals.css` — Tailwind v4 base + `@theme inline` with `--color-background`, `--color-foreground`, `--font-sans`, `--font-mono` already defined

### Established Patterns
- Tailwind v4 CSS-only config — no `tailwind.config.*`; add custom tokens via `@theme inline` in `globals.css`
- React Compiler enabled — no manual `useMemo`/`useCallback` needed
- `@/*` path alias maps to `./src/*`

### Integration Points
- `src/app/page.tsx` — replace default scaffold content with resume page; import section components here
- `src/data/resume.md` — new file, parsed in `page.tsx` (server component) at build time

</code_context>

<specifics>
## Specific Ideas

- Resume data lives in `src/data/resume.md` (YAML frontmatter only — no Markdown body content needed)
- Contact fields (email, phone) sourced from `process.env.NEXT_PUBLIC_EMAIL` and `process.env.NEXT_PUBLIC_PHONE`
- Skills rendered as plain-text category labels with comma-separated or tag-style values (CONT-03 says "plain-text categories")

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-content*
*Context gathered: 2026-04-12*
