# Phase 13: shadcn Infrastructure - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Initialize shadcn/ui into the existing Next.js 16 + Tailwind v4 project. Install all required npm packages, configure `components.json`, manually merge `globals.css` (preserving Geist font vars, replacing hex with oklch), install Card/Badge/Separator component sources into `src/components/ui/`. Zero visual change — this phase is an infrastructure gate only.

</domain>

<decisions>
## Implementation Decisions

### Font
- **D-01:** Keep Geist. No font switch in this phase. During the `globals.css` merge, preserve the existing `--font-sans: var(--font-geist-sans)` and `--font-mono: var(--font-geist-mono)` entries in the `@theme inline` block.

### Color System
- **D-02:** Replace hex with oklch. The existing `--background: #fafafa` and `--foreground: #18181b` hex values are replaced with shadcn's generated oklch equivalents during the `globals.css` merge. Single color system from Phase 13 onward — no mixed hex/oklch.

### shadcn Style Preset
- **D-03:** Use `"style": "new-york"` in `components.json`. Current official standard per shadcn docs for Tailwind v4 era — `"default"` is deprecated and cannot be changed after components.json is created.

### Package Installation
- **D-04:** Install these 6 packages: `shadcn@4.4.0`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `lucide-react`. `tw-animate-css` must be manually `npm install`-ed — it is NOT auto-installed by the shadcn CLI.
- **D-05:** Plain `npm install` — no `--legacy-peer-deps` required. All packages declare React 19 peer deps at current versions.

### components.json
- **D-06:** `components.json` at project root with `"tailwind": { "config": "" }` (Tailwind v4 mode, no config file). `"rsc": true` for App Router. Path alias `@/*` → `./src/*` (matches existing `tsconfig.json`). CSS path: `src/app/globals.css`.

### globals.css Merge
- **D-07:** DO NOT accept the default file overwrite from `npx shadcn@latest init`. Merge manually:
  1. Add shadcn's `@import "tw-animate-css"` line
  2. Add shadcn's `@import "shadcn/tailwind.css"` (or equivalent import from installed package)
  3. Add shadcn's `:root` CSS variable block using oklch values
  4. Preserve `@import "tailwindcss"` (must stay first)
  5. Preserve `@theme inline { --font-sans: var(--font-geist-sans); --font-mono: var(--font-geist-mono); }` — Geist font wiring must not be removed
  6. Replace `--background: #fafafa` and `--foreground: #18181b` with shadcn's oklch equivalents
- **D-08:** After merge, verify `npm run build` passes with zero errors and no visual change is observable in browser.

### Component Sources
- **D-09:** Install component sources using: `npx shadcn@latest add card badge separator`. This copies source files to `src/components/ui/card.tsx`, `badge.tsx`, `separator.tsx`.
- **D-10:** After each `shadcn add`, run `npm run lint` — CLI-generated code targets ESLint assumptions and may fail Biome rules. Fix any Biome violations before committing.

### Success Gate
- **D-11:** Phase is complete ONLY when: `src/lib/utils.ts` exists with `cn()`, `components.json` at root, `globals.css` has shadcn vars AND Geist font vars preserved, all 3 component source files present, `npm run build` and `npm run lint` both pass.

### Claude's Discretion
- Exact oklch values to use for `--background` and `--foreground` if shadcn's defaults are too far from the original zinc-50/zinc-900 values — match as close as possible visually.
- Import path for `shadcn/tailwind.css` — verify against the installed package's actual file layout before writing.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Files to modify
- `src/app/globals.css` — manual merge (shadcn vars + preserve Geist font vars, replace hex with oklch)
- `package.json` — 6 new packages added

### Files to create
- `components.json` — shadcn config at project root
- `src/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)
- `src/components/ui/card.tsx` — Card primitive
- `src/components/ui/badge.tsx` — Badge primitive
- `src/components/ui/separator.tsx` — Separator primitive

### Existing files to NOT modify
- `src/app/layout.tsx` — Geist font wiring stays unchanged
- All section components (Header, WorkExperience, EducationSection) — zero changes in this phase
- `tsconfig.json`, `next.config.ts` — no changes needed

### Research
- `.planning/research/STACK.md` — exact package versions, globals.css merge requirements
- `.planning/research/FEATURES.md` — component API surface, install commands
- `.planning/research/ARCHITECTURE.md` — Server/Client boundary analysis, components.json config
- `.planning/research/PITFALLS.md` — globals.css overwrite risk, hex color conflict, tw-animate-css gap

### Requirements
- `SHAD-01` — shadcn/ui initialized (packages, components.json, cn(), globals.css merged)
- `SHAD-02` — Card, Badge, Separator sources in src/components/ui/

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/globals.css` — existing Tailwind v4 file with `@import "tailwindcss"`, `@theme inline` with Geist vars, and hex `--background`/`--foreground` — must be manually merged, not overwritten
- `tsconfig.json` — already has `"@/*": ["./src/*"]` path alias — matches what `components.json` expects

### Established Patterns
- Tailwind v4 CSS-first config (`@import "tailwindcss"` in globals.css, no `tailwind.config.*` file)
- Next.js App Router Server Components by default — `components.json` must set `"rsc": true`
- Biome for linting — shadcn-generated files may need formatting fixes

### Integration Points
- `src/app/globals.css` — single CSS entry point; all shadcn CSS vars go here
- `src/lib/` — `utils.ts` will be created here alongside existing `duration.ts`
- `src/components/ui/` — new directory, will contain all shadcn component sources

</code_context>

<specifics>
## Specific Ideas

- Manual globals.css merge is the highest-risk operation — do it as a single careful edit, verify with `npm run build` immediately after
- Biome lint pass is required after each `npx shadcn add` command before committing
- Phase 13 should produce zero visible changes in the browser — verify this before marking complete

</specifics>

<deferred>
## Deferred Ideas

- Inter font switch — was TYP-04 in v3.0, now deferred to Phase 16 (Token Unification) if desired, or dropped entirely since Geist is kept
- Dark mode — Future requirement (THEME-01–03), out of scope for v4.0

</deferred>

---

*Phase: 13-shadcn-infrastructure*
*Context gathered: 2026-04-24*
