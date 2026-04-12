# Coding Conventions

**Analysis Date:** 2026-04-12

## Naming Patterns

**Files:**
- React page components: `page.tsx` (Next.js App Router convention)
- React layout components: `layout.tsx` (Next.js App Router convention)
- Global styles: `globals.css`
- Config files: `next.config.ts`, `postcss.config.mjs`

**Functions/Components:**
- React components: PascalCase (e.g., `Home`, `RootLayout`)
- Default exports for page/layout components are PascalCase function declarations

**Variables:**
- Font instances: camelCase (e.g., `geistSans`, `geistMono`)
- CSS custom properties: kebab-case (e.g., `--font-geist-sans`, `--color-background`)

**Types:**
- TypeScript interfaces/types: PascalCase (e.g., `Metadata`)
- Use `type` imports where possible: `import type { Metadata } from "next"`

## Code Style

**Formatter:**
- Tool: Biome 2.2.0 (`biome.json`)
- Indent style: spaces
- Indent width: 2
- Config: `/Users/baotoq/Work/resume/biome.json`

**Linting:**
- Tool: Biome 2.2.0
- Rule sets: `recommended`, Next.js domain rules (`next: recommended`), React domain rules (`react: recommended`)
- `suspicious.noUnknownAtRules` is disabled (allows Tailwind CSS `@theme`, `@import` directives)
- Run: `npm run lint` (`biome check`)

**Import Organization:**
- Biome's `organizeImports` assist action is enabled — imports are auto-sorted
- Type imports use the `import type` syntax (e.g., `import type { Metadata } from "next"`)

## Import Organization

**Order (enforced by Biome):**
1. External packages (e.g., `next`, `react`)
2. Internal modules using `@/*` alias (e.g., `@/components/Foo`)
3. Relative imports

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)

## TypeScript

**Strict mode:** Enabled (`"strict": true` in `tsconfig.json`)

**Key settings:**
- `noEmit: true` — TypeScript is used for type checking only; Next.js/Turbopack handles compilation
- `moduleResolution: bundler` — modern bundler-aware resolution
- `isolatedModules: true` — each file treated as an isolated module; avoid `const enum`
- `target: ES2017`

**Patterns:**
- Props typed inline with `Readonly<{}>` for layout component children: `Readonly<{ children: React.ReactNode }>`
- Use `export const` for non-default named exports (e.g., `export const metadata: Metadata`)
- Default export for page/layout components

## CSS / Styling

**Framework:** Tailwind CSS v4 via `@tailwindcss/postcss`

**Approach:**
- Utility classes applied directly in JSX via `className`
- CSS custom properties defined in `:root` within `globals.css`
- Tailwind theme tokens registered via `@theme inline` block in `globals.css`
- Dark mode via `prefers-color-scheme: dark` media query (CSS-side) and `dark:` Tailwind variants

**Pattern:**
- Responsive variants: `sm:`, `md:` prefixes (e.g., `sm:items-start`, `md:w-[158px]`)
- Dark mode variants: `dark:` prefix (e.g., `dark:bg-black`, `dark:text-zinc-50`)
- Arbitrary values: bracket notation (e.g., `bg-black/[.04]`, `hover:bg-[#383838]`)

## React

**React Compiler:** Enabled (`reactCompiler: true` in `next.config.ts`). Do NOT manually wrap with `useMemo`/`useCallback` for memoization — the compiler handles it.

**Component style:**
- Function declarations with `export default` for page/layout components
- No class components

**JSX:**
- Multi-line JSX uses consistent indentation (2 spaces)
- Attributes on separate lines when component has multiple props

## Error Handling

**Not explicitly established** — codebase is a minimal scaffold. No error boundary patterns or custom error pages present yet.

## Comments

**Auto-generated files:** Marked with `// This file is generated automatically by Next.js` header; do not edit manually.

**JSDoc/TSDoc:** Not used in application code at this stage.

## Module Design

**Exports:** Pages and layouts use `export default`. Metadata uses named `export const`.

**Barrel files:** None present.

---

*Convention analysis: 2026-04-12*
