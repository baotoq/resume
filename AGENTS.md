<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Always use Context7 when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

## Commands

```bash
npm run dev      # start dev server on http://localhost:3000
npm run build    # production build
npm run lint     # biome check (linter)
npm run format   # biome format --write
```

No test suite configured.

## Architecture

Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + TypeScript. Single-page resume site.

**Data flow:** `src/data/resume.md` (YAML frontmatter, no body) → parsed in `src/app/page.tsx` via `gray-matter` at request time → typed as `ResumeData` from `src/types/resume.ts` → passed to components.

**Contact info** (`EMAIL`, `PHONE`) comes from environment variables, not the markdown file.

**Adding a new tech icon:** Add entry to `TECH_ICON_MAP` in `src/components/TechStackIcons.tsx`. Key must match `tech_stack` values lowercased. Use `react-devicons` if available; otherwise create a custom SVG component in `src/components/icons/`.

**Bullet formatting:** Supports `**bold**` and `*italic*` markdown inline — rendered via `HighlightedBullet` component.
