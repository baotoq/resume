<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Always use Context7 when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

## Commands

```bash
npm run dev         # start dev server on http://localhost:3000
npm run build       # production build
npm run lint        # biome check (linter)
npm run format      # biome format --write
npm run test        # vitest unit tests (single run)
npm run test:watch  # vitest watch mode
npm run test:e2e    # playwright e2e (smoke)
npm run test:all    # unit + e2e
```

Unit tests are co-located with source as `*.test.tsx`. E2E tests live in `e2e/`. CI runs lint → unit → build → e2e on PRs.

## Architecture

Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + TypeScript. Single-page resume site.

**Data flow:** `src/data/resume.md` (YAML frontmatter, no body) → parsed in `src/app/page.tsx` via `gray-matter` at request time → typed as `ResumeData` from `src/types/resume.ts` → passed to components.

**Contact info** (`EMAIL`, `PHONE`) comes from environment variables, not the markdown file.

**`skills` field** in `ResumeData` is `Record<string, string>` — keys are category labels, values are comma-separated skill strings.

**Adding a new tech icon:** Add entry to `TECH_ICON_MAP` in `src/components/techstack-icons/TechStackIcons.tsx`. Key must match `tech_stack` values after `.toLowerCase().trim()`. Use `react-devicons` if available; otherwise create a custom SVG component in `src/components/techstack-icons/`.

**Adding a company logo:** Add an SVG component in `src/components/company-logos/` and register it in `COMPANY_LOGO_MAP` in `LogoImage.tsx` (key = exact `company` string from resume data). Falls back to `<img src={logo_url}>` for unregistered companies.

**shadcn/ui:** Style `new-york`, base color `neutral`, CSS variables enabled. Add components via `npx shadcn add <component>`; they land in `src/components/ui/`. Do not hand-edit generated files — re-run the CLI instead.

**Bullet formatting:** Supports `**bold**` and `*italic*` markdown inline — rendered via `HighlightedBullet` component.

**Animations:** Wrap sections in `<AnimateIn delay={n}>` (framer-motion). Delay is in seconds; stagger by 0.1 between sections.
