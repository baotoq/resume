# Project Research Summary

**Project:** Resume / CV Page — v4.0 shadcn/ui Full Design System Swap
**Domain:** Personal resume site — design system integration on Next.js 16 + Tailwind v4
**Researched:** 2026-04-24
**Confidence:** HIGH

## Executive Summary

This milestone replaces every hand-rolled card, pill, and divider element in the existing resume site with shadcn/ui primitives (Card, Badge, Separator) and unifies the color/token system via shadcn's CSS variable layer. The existing stack — Next.js 16 App Router, React 19, Tailwind v4, TypeScript — is fully compatible with shadcn/ui's current release (v4.4.0), which shipped native Tailwind v4 support in March 2025. No framework changes are needed; this is purely a UI-layer swap.

The recommended approach is a six-step build order: install npm dependencies first, manually merge the shadcn CSS variable block into `globals.css` (never blindly accept the CLI overwrite), install component source files via `npx shadcn@latest add`, then do Card replacement, Badge replacement, Separator addition, and a final token unification pass. Section components (`Header`, `WorkExperience`, `EducationSection`) stay as Server Components throughout — Card and Badge have no `"use client"` directive. Separator does, but it works as a leaf import inside Server Components without propagating the boundary.

The critical risk is `globals.css` corruption. The `npx shadcn@latest init` command will destructively overwrite `globals.css`, destroying the existing Geist font wiring and `@theme inline` block that the project depends on. This must be done manually or the file must be restored immediately after init runs. The second risk is the hex color conflict: the project's existing `:root` variables use hex values (`#fafafa`, `#18181b`) while shadcn generates oklch values. Both work, but they must be merged deliberately — convert the project's hex values to oklch during the merge rather than leaving a mixed token system.

---

## Key Findings

### Stack Additions (v4.0 only)

Six packages are added. No existing packages change.

| Package | Version | Role |
|---------|---------|------|
| `shadcn` | 4.4.0 | CLI tool + provides `shadcn/tailwind.css` base import |
| `class-variance-authority` | 0.7.1 | Variant system used inside every shadcn component |
| `clsx` | 2.1.1 | Conditional class composition for the `cn()` utility |
| `tailwind-merge` | 3.5.0 | Deduplicates conflicting Tailwind classes in `cn()` |
| `tw-animate-css` | 1.4.0 | CSS animation keyframes — replaces deprecated `tailwindcss-animate` |
| `lucide-react` | 1.9.0 | Icon set required by shadcn component templates |

`radix-ui` (for Separator) is installed automatically by `npx shadcn@latest add separator` — do not add it manually. Card and Badge have zero Radix dependencies.

`tsconfig.json` and `next.config.ts` require no changes. The existing `"@/*": ["./src/*"]` path alias and `reactCompiler: true` config both work as-is.

New config files created:
- `components.json` at project root (shadcn CLI config; `"tailwind": { "config": "" }` empty string signals v4 mode; use `"style": "default"`)
- `src/lib/utils.ts` (the `cn()` function — does not currently exist, no conflict)

### Component Table Stakes

**Card** replaces the repeated `rounded-xl border border-zinc-200 bg-white p-6 shadow-sm` pattern in three files. Direct structural swap using `<Card><CardContent>`. Header.tsx line 17, WorkExperience.tsx line 56, and EducationSection.tsx line 33 all use the identical pattern.

**Badge** replaces only the fallback pill `<span className="bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5 text-xs">` in TechStackIcons.tsx line 89 (the `else` branch). Use `variant="secondary"`. Badge must NOT wrap the SVG icon entries — only the unknown-tech text fallback.

**Separator** is additive, not a replacement. Use horizontally between page sections or inside cards above bullet lists. Must NOT be used for the Header contact row inline dots (`·`) — Separator is a block element and will break that horizontal flex layout. Keep the existing `<span> · </span>` text separators.

**Typography** is not an installable component. `npx shadcn@latest add typography` does not exist. It is a set of class-name recipes. After shadcn init, replace raw `text-zinc-500` with `text-muted-foreground`, `text-zinc-900` with `text-foreground`, `border-zinc-200` with `border-border`, `bg-white` with `bg-card`.

### Architecture Approach

The Server/Client component boundary is unchanged by this migration. Card and Badge are pure HTML div/span wrappers with no hooks — they render inside Server Components without any boundary change. Separator has `"use client"` (Radix uses `useEffect` internally), but it is a leaf node: a Server Component can import and render a Client Component leaf without becoming a client component itself.

`page.tsx`, `WorkExperience`, `Header`, and `EducationSection` all stay as Server Components. `AnimateIn` stays as the only client wrapper. The data flow (`resume.md` → gray-matter → typed props → components) has zero changes. `ResumeData` type is unchanged.

**Recommended build order:**
1. npm install + manual `globals.css` merge + `components.json` + `src/lib/utils.ts` (zero visual change, gates everything)
2. `npx shadcn@latest add card badge separator` (copies source files to `src/components/ui/`)
3. Card replacement in Header, WorkExperience, EducationSection
4. Badge replacement in TechStackIcons (fallback branch only)
5. Separator addition between sections
6. Token unification pass (zinc/indigo/blue → shadcn semantic tokens)

### Critical Pitfalls

**1. globals.css destructive overwrite** — `npx shadcn@latest init` rewrites `globals.css`, destroying Geist font wiring (`--font-sans: var(--font-geist-sans)`) and the existing `@theme inline` block. Without these, Next.js font optimization is silently lost. Mitigation: perform the globals.css merge manually rather than relying on the CLI.

**2. Hex color conflict** — The existing `:root` block uses hex values (`--background: #fafafa`). shadcn generates oklch values (`--background: oklch(0.985 0 0)`). Mixing them creates an inconsistent token system. Mitigation: convert the project's hex values to their oklch equivalents during the merge. Tailwind v4 and shadcn's `@theme inline` both handle oklch natively.

**3. `tw-animate-css` vs `tailwindcss-animate`** — shadcn's Tailwind v4 setup uses `@import "tw-animate-css"` in globals.css. The older `tailwindcss-animate` plugin is deprecated and produces no animation utilities in v4. Do not substitute it. The import is a CSS file import, not a PostCSS plugin — no plugin config needed.

**4. `--legacy-peer-deps` is NOT needed** — All v4.0 dependencies declare React 19 (`^19.0`) in their peer deps at current versions. Using `--legacy-peer-deps` signals outdated package versions. Install with plain `npm install`.

**5. Badge applied to wrong TechStackIcons elements** — Wrapping SVG icon entries in Badge adds markup around items that already have a visual representation. Badge replaces only the `else` branch (unknown tech fallback pill). The `TECH_ICON_MAP` hit path is unchanged.

---

## Implications for Roadmap

The six-step build order maps directly to phases. Each step has a clear gate condition and is independently deployable.

### Phase 1: Infrastructure Setup
**Rationale:** `cn()` utility and a correctly merged `globals.css` are hard prerequisites for all subsequent component installs. Zero visual change makes this safe to ship and verify in isolation.
**Delivers:** `components.json` (`"style": "default"`, `"tailwind": { "config": "" }`), `src/lib/utils.ts`, updated `globals.css` with shadcn CSS variables merged, all npm packages installed.
**Avoids:** globals.css overwrite pitfall and hex/oklch token conflict — both are resolved in this phase by design.
**Gate:** `npm run build` passes, no visual change in browser.

### Phase 2: Install shadcn Component Sources
**Rationale:** After infrastructure is stable, install component source files and verify TypeScript compilation before touching any existing files.
**Delivers:** `src/components/ui/card.tsx`, `badge.tsx`, `separator.tsx`.
**Gate:** TypeScript compiles, no import errors, build passes.

### Phase 3: Card Replacement
**Rationale:** Card has the highest surface area (three files, identical pattern) and zero behavioral risk. Structural swap — visual parity is the target.
**Delivers:** Header, WorkExperience, EducationSection all use `<Card><CardContent>`.
**Gate:** Visual parity on mobile and desktop, no layout regressions.

### Phase 4: Badge and Separator
**Rationale:** Both are single-file changes with low complexity. Badge targets one branch in TechStackIcons. Separator is purely additive.
**Delivers:** Tech fallback pills use shadcn Badge (`variant="secondary"`). Horizontal Separator dividers added between sections.
**Avoids:** Do not touch inline `·` separators in Header contact row.
**Gate:** TechStackIcons renders correctly for both icon-present and fallback cases.

### Phase 5: Token Unification Pass
**Rationale:** After all shadcn components are in place, audit and remap raw zinc/indigo/blue classes to shadcn semantic tokens. Polish pass with no functional change.
**Delivers:** Consistent token system. `text-foreground`, `text-muted-foreground`, `border-border`, `bg-card` replace raw color classes across Header, WorkExperience, EducationSection.
**Gate:** No raw `text-zinc-*` / `border-zinc-*` color classes remain in section components. Build and lint pass.

### Phase Ordering Rationale

- Infrastructure before components because `cn()` is a compile-time prerequisite — shadcn component files import it, so they cannot be installed cleanly before `src/lib/utils.ts` exists.
- Component file install before integration to confirm CLI ran correctly and TypeScript is clean before touching existing files.
- Card before Badge/Separator because it has the highest blast radius; isolating it first makes regression diagnosis easier.
- Token pass last because the full scope of raw color classes is only visible after all components are in place.

### Research Flags

All phases have standard, well-documented patterns. No phase needs a `/gsd-research-phase` call. shadcn/ui is extremely well-documented via Context7 and official docs at HIGH confidence.

Deferred decision to track: the pure-CSS tech icon tooltip (`group-hover:opacity-100`) can be upgraded to shadcn `Tooltip` in a future milestone. It is explicitly out of scope for v4.0 because it forces `TechStackIcons.tsx` to become a Client Component. Do not attempt it here.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All package versions live-checked against npm registry 2026-04-24. Tailwind v4 + shadcn compatibility verified via official docs and Context7. |
| Features | HIGH | Direct codebase inspection of all affected files. Anti-features explicitly mapped. |
| Architecture | HIGH | Server/Client boundary analysis from official shadcn docs + React 19 App Router docs + GitHub discussion #2562 (Separator `"use client"` cause confirmed by maintainer). |
| Pitfalls | HIGH | globals.css overwrite and hex/oklch conflict are documented behaviors. `tw-animate-css` distinction is from official shadcn Tailwind v4 migration docs. |

**Overall confidence: HIGH**

### Gaps to Address

- **Biome formatting on generated files:** shadcn CLI generates component source with formatting that may not match the project's Biome config. Run `npm run format` after each `shadcn add` command and commit the reformatted output.
- **`style` field in `components.json`:** Use `"default"`. It is the canonical shadcn style, matches all official documentation examples, and has the largest community support surface. `"base-nova"` is a newer style with sparse documentation — avoid it.

---

## Sources

### Primary (HIGH confidence)
- Context7 `/llmstxt/ui_shadcn_llms_txt` — shadcn/ui Tailwind v4 docs, component API reference, React 19 compatibility table, `components.json` schema
- `ui.shadcn.com/docs/tailwind-v4` — `tw-animate-css` import pattern, `@theme inline` integration, oklch token format
- `ui.shadcn.com/docs/react-19` — peer dependency status, no `--legacy-peer-deps` needed
- `ui.shadcn.com/docs/installation/manual` — `components.json` fields, `cn()` utility setup
- GitHub discussion shadcn-ui/ui #2562 — Separator `"use client"` cause confirmed by maintainer
- Direct codebase reads: `src/app/globals.css`, `src/components/Header.tsx`, `src/components/WorkExperience.tsx`, `src/components/EducationSection.tsx`, `src/components/techstack-icons/TechStackIcons.tsx`
- Live npm registry — all package versions confirmed 2026-04-24

### Secondary (MEDIUM confidence)
- `ui.shadcn.com/docs/components/typography` — typography is class recipes only, no installable component
- Build order sequence — derived from dependency analysis, not a single authoritative source

---
*Research completed: 2026-04-24*
*Ready for roadmap: yes*
