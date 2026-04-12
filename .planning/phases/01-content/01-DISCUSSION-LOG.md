# Phase 1: Content - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-12
**Phase:** 1-content
**Areas discussed:** Design aesthetic, Resume data source, Component structure

---

## Design Aesthetic

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal / paper-like | White background, near-black text, section dividers. Traditional CV look. | |
| Modern / card-based | Subtle background, section cards with shadow/border, accent color. | ✓ |

**User's choice:** Modern / card-based

---

| Option | Description | Selected |
|--------|-------------|----------|
| Dark / slate | slate-950 bg, slate-800 cards, indigo/sky accent | |
| Light / neutral | zinc-50 bg, white cards, zinc-900 text, indigo-600 accent | ✓ |
| You decide | Claude picks palette | |

**User's choice:** Light / neutral

---

## Resume Data Source

| Option | Description | Selected |
|--------|-------------|----------|
| TypeScript data file | `src/data/resume.ts` with typed interfaces | |
| Inline in JSX | Content hardcoded in page.tsx | |
| Markdown data source | User-requested alternative | |

**User's choice:** Single `.md` file with YAML frontmatter (`gray-matter`)

**Notes:** User requested Markdown as data source. Compared frontmatter vs heading-sections vs MDX. Chose frontmatter (Option 1) for structured fields. User also noted the project is public on GitHub — email and phone must not be in the repo. Decision: both sourced from `NEXT_PUBLIC_EMAIL` and `NEXT_PUBLIC_PHONE` env vars.

---

## Component Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Split section components | Header.tsx, WorkExperience.tsx, Skills.tsx in src/components/ | ✓ |
| Single page.tsx | All markup in one file | |

**User's choice:** Split section components

---
