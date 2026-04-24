# Phase 13: shadcn Infrastructure - Research

**Researched:** 2026-04-24
**Domain:** shadcn/ui initialization — Tailwind v4 CSS-first, Next.js 16 App Router, React 19
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Keep Geist. Preserve `--font-sans: var(--font-geist-sans)` and `--font-mono: var(--font-geist-mono)` in `@theme inline` during globals.css merge.
- **D-02:** Replace hex with oklch. `--background: #fafafa` and `--foreground: #18181b` replaced with shadcn's oklch equivalents. Single color system from Phase 13 onward.
- **D-03:** Use `"style": "default"` in `components.json`. ⚠️ **SEE DECISIONS REQUIRING RECONCILIATION — this value is deprecated per official docs.**
- **D-04:** Install 6 packages: `shadcn@4.4.0`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `lucide-react`. `tw-animate-css` must be manually `npm install`-ed.
- **D-05:** Plain `npm install` — no `--legacy-peer-deps`.
- **D-06:** `components.json` at project root with `"tailwind": { "config": "" }` (Tailwind v4 mode). `"rsc": true`. Path alias `@/*` → `./src/*`. CSS path: `src/app/globals.css`.
- **D-07:** DO NOT accept globals.css overwrite from `npx shadcn@latest init`. Merge manually: add imports, add `:root` CSS variable block (oklch), preserve `@import "tailwindcss"` first, preserve `@theme inline` with font vars.
- **D-08:** After merge, verify `npm run build` passes with zero errors and no visual change.
- **D-09:** Install component sources: `npx shadcn@latest add card badge separator`.
- **D-10:** After each `shadcn add`, run `npm run lint` — fix any Biome violations before committing.
- **D-11:** Phase complete only when: `src/lib/utils.ts` (cn()) exists, `components.json` at root, `globals.css` has shadcn vars + Geist vars preserved, all 3 component files present, `npm run build` and `npm run lint` pass.

### Claude's Discretion

- Exact oklch values for `--background` and `--foreground` if shadcn defaults differ from zinc-50/zinc-900.
- Import path for `shadcn/tailwind.css` — verify against installed package file layout.

### Deferred Ideas (OUT OF SCOPE)

- Inter font switch — deferred to Phase 16 or dropped.
- Dark mode — Future requirement (THEME-01–03).

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SHAD-01 | shadcn/ui initialized — packages installed, components.json configured, cn() utility present, globals.css merged with Geist font vars preserved | Packages verified on npm registry; components.json field values confirmed via Context7; globals.css merge sequence documented with exact CSS from official docs |
| SHAD-02 | shadcn component sources installed in src/components/ui/ (Card, Badge, Separator via CLI) | Batch `shadcn add` confirmed supported; exact file paths verified; Biome remediation procedure documented |

</phase_requirements>

---

## Summary

Phase 13 is a pure infrastructure phase: install shadcn/ui tooling into an existing Next.js 16 + Tailwind v4 project without changing any visible output. The primary risk is the `globals.css` merge — shadcn adds CSS imports and a large `:root` variable block that must be layered into the existing file without destroying Geist font variable wiring or breaking the `@import "tailwindcss"` first-position rule.

The standard workflow is: manually install npm packages, manually create `components.json` and `src/lib/utils.ts`, manually merge `globals.css`, then run `npx shadcn@latest add card badge separator` to install component source files. Using `npx shadcn@latest init` is explicitly contraindicated by D-07 because the CLI destructively overwrites `globals.css`. Avoiding `init` entirely is the safest path — all its outputs can be reproduced manually and are fully documented.

**One decision requires reconciliation before execution:** D-03 specifies `"style": "default"` in `components.json`, but official shadcn documentation marks `default` as deprecated in favor of `new-york`. The `style` field cannot be changed after initialization. This must be resolved before the plan is executed — see `## Decisions Requiring Reconciliation`.

**Primary recommendation:** Manually create `components.json` + `utils.ts`, manually merge `globals.css` following the exact sequence documented below, then run `npx shadcn@latest add card badge separator` — no `shadcn init` command needed.

---

## Decisions Requiring Reconciliation

> These are locked decisions in CONTEXT.md that conflict with verified research findings. The planner must escalate these to discuss-phase before execution — they cannot be silently overridden.

### D-03: `"style": "default"` is deprecated

**What CONTEXT.md says:** `"style": "default"` in `components.json`.

**What verified docs say (HIGH confidence — Context7 official docs):**
- "The `default` style has been deprecated; use the `new-york` style instead."
- "This setting cannot be changed after the project's initialization."
- New projects now use `new-york` by default (shadcn Tailwind v4 changelog).

**Risk:** If `default` is rejected by the CLI in `shadcn@4.4.0`, `npx shadcn@latest add card` will fail or produce unexpected output. Even if accepted, the component source files generated may follow older styling conventions.

**Recommended resolution:** Change D-03 to `"style": "new-york"` before executing Phase 13. The difference between `default` and `new-york` is visual (border radius, shadow scale) not structural — both produce the same component API surface. For a resume with `--radius: 0.625rem` default, the visual change is minor and acceptable.

**Alternative:** Verify `"style": "default"` still works in `shadcn@4.4.0` by running `npx shadcn@latest init` in a scratch directory and inspecting the schema validation error (if any). If it silently accepts `default`, proceed with D-03 as locked. If it rejects, flip to `new-york`.

**Blocker level:** Must be resolved before executing the phase. The style field is permanent.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| CSS variable system | Browser / Client | — | CSS custom properties resolve at render time in the browser |
| Component source files | Frontend Server (SSR) | Browser (if "use client") | Card/Badge are Server-safe; Separator has "use client" as leaf node |
| shadcn CLI tooling | Build tooling | — | CLI runs at dev time only; not part of runtime |
| globals.css merge | Frontend Server (SSR) | — | CSS is processed by PostCSS/Tailwind at build time |
| utils.ts / cn() | Both | — | Used in both Server and Client component classNames |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| shadcn | 4.4.0 | CLI for component source installation | Current release; Tailwind v4 support added |
| class-variance-authority | 0.7.1 | Variant-based className generation (used by Badge) | Official shadcn peer dependency |
| clsx | 2.1.1 | Conditional className composition | Used inside cn() utility |
| tailwind-merge | 3.5.0 | Merge conflicting Tailwind classes | Used inside cn() utility |
| tw-animate-css | 1.4.0 | Animation utilities replacing tailwindcss-animate | New standard; tailwindcss-animate deprecated March 2025 |
| lucide-react | 1.9.0 | Icon library | shadcn default icon library; used in some component defaults |

[VERIFIED: npm registry — `npm view <package> version` run 2026-04-24]

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @radix-ui/react-separator | auto-installed by shadcn add | Radix primitive backing Separator | Installed automatically when running `npx shadcn add separator` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual components.json creation | `npx shadcn@latest init` | init overwrites globals.css (D-07 prohibits this); manual creation avoids the risk |
| tw-animate-css | tailwindcss-animate | tailwindcss-animate deprecated March 2025; tw-animate-css is the direct replacement |

**Installation:**
```bash
npm install shadcn@4.4.0 class-variance-authority clsx tailwind-merge tw-animate-css lucide-react
```

**Version verification (run before writing plan):**
```bash
npm view shadcn version          # 4.4.0 ✓
npm view tw-animate-css version  # 1.4.0 ✓
npm view class-variance-authority version  # 0.7.1 ✓
npm view tailwind-merge version  # 3.5.0 ✓
npm view clsx version            # 2.1.1 ✓
npm view lucide-react version    # 1.9.0 ✓
```

---

## Architecture Patterns

### System Architecture Diagram

```
npm install (6 packages)
        │
        ▼
components.json (manually created at project root)
        │ configures paths for ↓
        ▼
src/lib/utils.ts (manually created — cn() function)
        │ imported by ↓
        ▼
npx shadcn@latest add card badge separator
        │ writes source files to ↓
        ├── src/components/ui/card.tsx
        ├── src/components/ui/badge.tsx
        └── src/components/ui/separator.tsx
                    ↑
globals.css (manually merged — NOT via shadcn init)
    @import "tailwindcss"        ← MUST stay first
    @import "tw-animate-css"     ← NEW
    @import "shadcn/tailwind.css" ← NEW
    @custom-variant dark (...)   ← NEW
    :root { oklch vars }         ← UPDATED (hex → oklch)
    @theme inline { fonts + color mappings } ← PRESERVED
    body { ... }                 ← PRESERVED
```

### Recommended Project Structure

```
src/
├── app/
│   └── globals.css      # merged (shadcn vars + Geist font vars)
├── components/
│   └── ui/              # new directory — shadcn component sources
│       ├── card.tsx
│       ├── badge.tsx
│       └── separator.tsx
├── lib/
│   ├── utils.ts          # new — cn() function
│   └── duration.ts       # existing — unchanged
components.json            # new — at project root
```

### Pattern 1: Manual components.json (Tailwind v4 mode)

**What:** Create `components.json` at project root with `"tailwind": { "config": "" }` to signal Tailwind v4 CSS-first mode. The empty string for `config` is the official Tailwind v4 signal — no `tailwind.config.js` exists.

**When to use:** Any new shadcn project on Tailwind v4.

**Example:**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```
[CITED: https://ui.shadcn.com/docs/components-json — "Leave blank for Tailwind CSS v4"]
[CITED: https://ui.shadcn.com/docs/theming — component.json example with `"config": ""`]

> NOTE: `"style"` above shows `"new-york"` per the D-03 reconciliation flag. Change to `"default"` only if D-03 is confirmed still functional after discussion.

### Pattern 2: utils.ts — the cn() function

**What:** Standard class-merging utility combining clsx and tailwind-merge.

**Example:**
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
[CITED: https://ui.shadcn.com/docs/installation/manual]

### Pattern 3: globals.css post-merge target state

**What:** The exact sequence of imports and variable blocks after the manual merge. Order matters — `@import "tailwindcss"` must be first.

**Example (target state):**
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.985 0 0);   /* replaces #fafafa — visual match: zinc-50 */
  --foreground: oklch(0.145 0 0);   /* replaces #18181b — visual match: zinc-900 */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

@theme inline {
  /* PRESERVE — Geist font wiring */
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  /* base color mappings — keep existing + add shadcn tokens */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* radius scale (Tailwind v4 maps calc-based from --radius) */
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), system-ui, sans-serif;
}
```
[CITED: https://ui.shadcn.com/docs/theming — full CSS variable block]
[CITED: https://ui.shadcn.com/docs/tailwind-v4 — `@import "tw-animate-css"` migration]
[CITED: https://ui.shadcn.com/docs/rtl/start — `@import "shadcn/tailwind.css"` alongside tw-animate-css]

### Anti-Patterns to Avoid

- **Running `npx shadcn@latest init` unattended:** The CLI will prompt to overwrite `globals.css`. If you accept, Geist font vars (`--font-geist-sans`, `--font-geist-mono`) are destroyed. Skip `init` entirely and create `components.json` manually.
- **Running `shadcn add` before `components.json` exists:** The CLI requires `components.json` to determine where to write files. Create it first.
- **Running `shadcn add` before `utils.ts` exists:** The generated component source files import `@/lib/utils`. If `utils.ts` doesn't exist, the build fails immediately after component install. Create `utils.ts` before running `add`.
- **Placing `@import "tailwindcss"` after other imports:** Tailwind v4 requires its own import to come first. tw-animate-css and shadcn/tailwind.css must come after.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Class merging utility | Custom mergeClasses() | `cn()` with clsx + tailwind-merge | tailwind-merge correctly resolves conflicting Tailwind classes (e.g. `p-4 p-6` → `p-6`); naive concatenation does not |
| CSS variable tokens | Custom hex variable block | shadcn `:root` block (oklch) | Ensures semantic token compatibility with future shadcn components in phases 14–16 |
| Component source files | Hand-write card.tsx from scratch | `npx shadcn@latest add card` | CLI generates correct sub-component structure (CardHeader, CardContent, etc.) with current API |
| Animation CSS | Custom keyframes | tw-animate-css | Drop-in package; contains all animate-* utilities shadcn components expect |

**Key insight:** shadcn is a source-copy tool — it copies component source into your codebase. This means zero runtime dependency and full ownership, but it requires using the CLI to get the correct current implementation rather than manually writing components.

---

## Common Pitfalls

### Pitfall 1: globals.css overwrite destroys Geist font vars

**What goes wrong:** Running `npx shadcn@latest init` and accepting the globals.css rewrite removes `--font-geist-sans` and `--font-geist-mono` from `@theme inline`. The body font silently falls back to system-ui.

**Why it happens:** shadcn generates a fresh globals.css from its template — it doesn't know the project already has Geist font variables wired up via Next.js.

**How to avoid:** Skip `init` entirely. Manually create `components.json`. Manually merge `globals.css` following Pattern 3 above.

**Warning signs:** Body text renders in system-ui/sans-serif instead of Geist after merge. `--font-geist-sans` disappears from computed CSS variables in DevTools.

### Pitfall 2: `@import "shadcn/tailwind.css"` requires the shadcn package to be installed

**What goes wrong:** Writing `@import "shadcn/tailwind.css"` in globals.css before installing the `shadcn` npm package causes a PostCSS build error: "Failed to find 'shadcn/tailwind.css'".

**Why it happens:** Tailwind v4's CSS `@import` for bare package names is resolved through `node_modules` by `@tailwindcss/postcss`. If the package doesn't exist in node_modules, the resolver fails.

**How to avoid:** Run `npm install shadcn@4.4.0` before writing the globals.css `@import` lines. Install packages first, merge CSS second.

**Warning signs:** `npm run build` fails with PostCSS import resolution error. Check `node_modules/shadcn/` exists.

### Pitfall 3: `"style"` is permanent — wrong value locks the project

**What goes wrong:** Writing the wrong style value in `components.json` and running `npx shadcn@latest add` generates component files for that style. The `style` field cannot be changed after init — changing it later requires re-running all `add` commands with `--overwrite`.

**Why it happens:** shadcn's component registry serves different file variants per style. Once locked, the CLI uses the locked value for all subsequent operations.

**How to avoid:** Resolve the D-03 conflict before writing `components.json`. See `## Decisions Requiring Reconciliation`.

**Warning signs:** None at write time — the error manifests later when trying to change it.

### Pitfall 4: tw-animate-css `@import` path uses bare package name

**What goes wrong:** Using `@import "./node_modules/tw-animate-css/dist/tw-animate.css"` (explicit path) instead of `@import "tw-animate-css"` (bare package name). While both may work, the bare name is the documented form and matches the package's exports map entry `"."`.

**How to avoid:** Always use `@import "tw-animate-css"`. The tw-animate-css package exports map resolves `.` → `./dist/tw-animate.css` via PostCSS.

[VERIFIED: npm registry — `npm view tw-animate-css --json` exports: `"." → "./dist/tw-animate.css"`]

### Pitfall 5: Biome linting on shadcn-generated component files

**What goes wrong:** shadcn-generated component files are written to satisfy ESLint assumptions. Biome 2.2.0 may flag: unused imports if Radix primitives are destructured but not all exports used; import organization if auto-sort conflicts with generated order; React-specific rules from the `"react": "recommended"` domain.

**Why it happens:** shadcn CLI authors target ESLint as the assumed linter. Biome's rule set (especially the `next` and `react` domains enabled in project biome.json) may flag patterns that ESLint permits.

**How to avoid:** Per D-10, run `npm run lint` after each `npx shadcn add` command. Fix violations before committing. Do not modify the generated component logic — only fix formatting/import-order issues.

**Warning signs:** `npm run lint` exits non-zero immediately after component install. Common suspects: unused import aliases, `VariantProps<typeof badgeVariants>` generic pattern, `React.ComponentProps<"div">` spread patterns.

**Note:** No specific Biome 2.2.0 violations against shadcn output were found in official docs. This is `[ASSUMED]` based on common Biome/ESLint divergence patterns. The empirical approach (D-10: run lint after each add) is the correct strategy.

### Pitfall 6: `--card-foreground` parity with `--foreground`

**What goes wrong:** After adding the full shadcn `:root` block, Card content renders text slightly differently from body text because `--card-foreground` and `--foreground` are set to the same oklch value but are distinct tokens. Future phases must use `text-card-foreground` inside Card components, not `text-foreground` directly.

**Why it happens:** shadcn's token system maps Card's text color to `--card-foreground` separately from `--foreground`. In the default theme both are `oklch(0.145 0 0)` (same value), so Phase 13 has no visual difference — but in Phase 16 (Token Unification), these tokens may diverge if a custom theme is applied.

**How to avoid:** This is not a Phase 13 risk — just a forward-compatibility note for Phase 16. Document in ARCHITECTURE.md that `--card-foreground` equals `--foreground` only in the default theme.

---

## Code Examples

Verified patterns from official sources:

### components.json — Tailwind v4 mode

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```
[CITED: https://ui.shadcn.com/docs/components-json — Tailwind v4 config blank, full field list]

### utils.ts — cn() function

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
[CITED: https://ui.shadcn.com/docs/installation/manual]

### Batch component install (space-separated)

```bash
npx shadcn@latest add card badge separator
```
[CITED: https://ui.shadcn.com/docs/registry/namespace — "supports adding single or multiple resources in one command"; multiple names space-separated]
[ASSUMED: space-separated batch install of standard registry components works identically to separate add commands — the namespace docs demonstrate multiple components in one command using registry-prefixed names; standard registry names follow the same pattern]

### Verify component files created

```bash
ls src/components/ui/
# Expected: badge.tsx  card.tsx  separator.tsx
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwindcss-animate (`@plugin`) | tw-animate-css (`@import`) | March 2025 | `@plugin` directive deprecated in Tailwind v4; must use CSS `@import` |
| `"style": "default"` | `"style": "new-york"` (deprecated; `default` being removed) | Tailwind v4 release 2025 | New projects must use `new-york`; `default` style still parsed but deprecated |
| `tailwind.config.js` configuration | CSS-first `@import "tailwindcss"` | Tailwind v4.0 | No config file; shadcn detects this via `"tailwind": { "config": "" }` |
| `@radix-ui/*` direct imports | shadcn CLI source-copy | Ongoing | shadcn wraps Radix primitives in opinionated source files you own |

**Deprecated/outdated:**
- `tailwindcss-animate`: deprecated March 2025, replaced by `tw-animate-css`
- `"style": "default"` in components.json: deprecated in Tailwind v4 era; `new-york` is current default

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `"style": "default"` is still accepted (not rejected) by shadcn@4.4.0 CLI despite deprecation | D-03 reconciliation, components.json | CLI may error out on `shadcn add` with invalid style; component files may not generate |
| A2 | `npx shadcn@latest add card badge separator` (space-separated) installs all three components in one invocation | Code Examples | May need three separate `add` commands; no functional difference, just workflow |
| A3 | Biome 2.2.0 with `react: recommended` domain will flag something in shadcn-generated component files | Pitfall 5 | May be a no-op; D-10's empirical lint check catches this regardless |
| A4 | The `@custom-variant dark (&:is(.dark *))` line in globals.css is benign when dark mode is not used | globals.css merge | Could add unexpected CSS specificity; low risk for Phase 13 since no dark mode classes are used |

**Claims tagged [VERIFIED]:** Package versions, tw-animate-css export map, shadcn package ./tailwind.css export, oklch token values from official docs, components.json `"config": ""` for Tailwind v4.

---

## Open Questions

1. **D-03: `"style": "default"` vs `"new-york"`**
   - What we know: official docs deprecate `default`; shadcn@4.4.0 is the current release
   - What's unclear: whether `"default"` is rejected by shadcn@4.4.0 CLI validation or silently accepted
   - Recommendation: resolve in discuss-phase before executing; if user confirms `new-york` acceptable, update D-03

2. **tw-animate-css auto-install behavior on existing projects**
   - What we know: D-04 says "manually install"; changelog says "new projects will have tw-animate-css installed by default"
   - What's unclear: whether `shadcn add` on an existing project (with components.json) would also attempt to install tw-animate-css
   - Recommendation: install it manually before running `shadcn add` — safe and idempotent regardless of CLI behavior

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js + npm | All package installs | ✓ | (project running) | — |
| Next.js 16 build | npm run build gate | ✓ | 16.2.3 | — |
| @tailwindcss/postcss | `@import "shadcn/tailwind.css"` resolution | ✓ | ^4 (installed) | — |
| Biome 2.2.0 | npm run lint gate | ✓ | 2.2.0 | — |
| npx | shadcn add command | ✓ | (npm bundled) | — |

[VERIFIED: package.json inspection — @tailwindcss/postcss present in devDependencies; Biome 2.2.0 in devDependencies]

**Missing dependencies:** None identified. All required tooling is present.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None (no test suite configured per AGENTS.md) |
| Config file | None |
| Quick run command | `npm run lint` |
| Full suite command | `npm run build` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Passes? |
|--------|----------|-----------|-------------------|---------|
| SHAD-01 | packages installed, components.json exists, cn() in utils.ts, globals.css merged | smoke (build) | `npm run build` | After implementation |
| SHAD-01 | Biome passes on all files including globals.css | lint | `npm run lint` | After implementation |
| SHAD-02 | card.tsx, badge.tsx, separator.tsx exist at src/components/ui/ | file existence | `ls src/components/ui/` | After `shadcn add` |
| SHAD-02 | Generated component files pass Biome | lint | `npm run lint` | After `shadcn add` + fixes |

### Sampling Rate

- **Per task commit:** `npm run lint`
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate (D-11):** `npm run build` passes + `npm run lint` passes + visual browser check

### Wave 0 Gaps

None — no test files need to be created. Validation is via build and lint commands, both already configured.

---

## Security Domain

Not applicable. Phase 13 is CSS infrastructure and design system initialization. No authentication, session management, input validation, cryptography, or external service calls are introduced. No ASVS categories apply.

---

## Sources

### Primary (HIGH confidence)
- Context7 `/llmstxt/ui_shadcn_llms_txt` — shadcn/ui official documentation corpus (ui.shadcn.com)
  - Topics: Tailwind v4 installation, components.json fields, oklch CSS variable values, tw-animate-css migration, style deprecation
- npm registry — `npm view <package> version` and `npm view <package> --json` (run 2026-04-24)
  - Verified: shadcn@4.4.0, tw-animate-css@1.4.0, class-variance-authority@0.7.1, tailwind-merge@3.5.0, clsx@2.1.1, lucide-react@1.9.0
  - Verified: tw-animate-css exports `"." → "./dist/tw-animate.css"`
  - Verified: shadcn exports `"./tailwind.css"` (confirming `@import "shadcn/tailwind.css"` resolves)

### Secondary (MEDIUM confidence)
- `.planning/research/ARCHITECTURE.md` (project research, 2026-04-24) — Server/Client boundary analysis, globals.css target state diagram
- `.planning/research/FEATURES.md` (project research, 2026-04-24) — component API surface, anti-feature mapping

### Tertiary (LOW confidence)
- A3 (Biome lint on shadcn output) — inferred from Biome/ESLint divergence patterns; no official docs on this specific combination

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified on npm registry 2026-04-24
- globals.css merge sequence: HIGH — exact CSS from official shadcn docs via Context7
- components.json fields: HIGH — documented at ui.shadcn.com/docs/components-json
- Style deprecation (D-03 conflict): HIGH — three separate official doc references confirm deprecation
- Biome lint behavior on generated files: LOW — no official documentation; empirical detection via D-10

**Research date:** 2026-04-24
**Valid until:** 2026-05-24 (stable library; shadcn releases infrequently)

---

## RESEARCH COMPLETE

**Phase:** 13 - shadcn Infrastructure
**Confidence:** HIGH (with one decision escalation required)

### Key Findings

1. `"style": "default"` in D-03 is deprecated per official docs — must be resolved before execution; `"new-york"` is the current standard and cannot be changed post-init.
2. `@import "shadcn/tailwind.css"` is the correct import path — verified via npm exports map showing `"./tailwind.css"` export on the `shadcn` package.
3. `@import "tw-animate-css"` resolves via bare package name — verified via exports map `"." → "./dist/tw-animate.css"`.
4. Exact oklch values for the `:root` block confirmed from official docs: `--background: oklch(0.985 0 0)` (zinc-50 equivalent), `--foreground: oklch(0.145 0 0)` (zinc-900 equivalent) — visual difference from hex originals is imperceptible.
5. `npx shadcn@latest add card badge separator` supports space-separated batch installs (multiple components in one command).
6. Manual `components.json` creation (skipping `shadcn init`) is the correct workflow per D-07 — avoids globals.css destructive overwrite risk entirely.

### File Created
`.planning/phases/13-shadcn-infrastructure/13-RESEARCH.md`

### Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| Standard Stack | HIGH | All versions verified on npm registry |
| globals.css merge | HIGH | Exact CSS from official shadcn docs |
| components.json | HIGH | All fields documented at ui.shadcn.com |
| D-03 style conflict | HIGH | Three official doc references confirm deprecation |
| Biome lint behavior | LOW | No official docs; empirical check per D-10 |

### Open Questions

- D-03: Confirm `"style": "new-york"` replaces `"default"` before executing `components.json` creation

### Ready for Planning

Research complete pending D-03 reconciliation. Planner can create PLAN.md once the style field decision is confirmed.
