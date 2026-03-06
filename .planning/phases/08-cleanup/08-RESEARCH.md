# Phase 8: Cleanup - Research

**Researched:** 2026-03-06
**Domain:** Dead code removal, asset cleanup, build hygiene
**Confidence:** HIGH

## Summary

This phase is a straightforward cleanup pass over a well-structured, small codebase. Investigation of the current state reveals several concrete items: 5 unused SVG files from the Next.js starter template in `public/`, the `Project` interface and `projects` export that are unused (the `showProjects` flag is hardcoded `false`), a `--secondary` CSS variable referenced in `Projects.tsx` but never defined in `globals.css`, stale print CSS selectors referencing `bg-clip-text` and `ant-card` classes no longer in use, and a broken Biome config line (`!!**/.git`).

No external library research is needed -- this is purely a codebase audit and removal task. The build currently succeeds, and there are no `console.*` statements in source code.

**Primary recommendation:** Systematically remove identified dead code, fix the Biome config, clean stale print CSS selectors, and verify build output is same size or smaller.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CLEAN-01 | Remove unused SVG files from public/ directory | 5 SVGs identified: file.svg, globe.svg, next.svg, vercel.svg, window.svg (Next.js starter defaults, zero references in src/) |
| CLEAN-02 | Remove unused Project type if not used | `Project` interface in types/resume.ts, `projects` export in data/resume.ts, and `Projects.tsx` component + imports are all dead code (`showProjects = false`) |
| CLEAN-03 | Remove dark mode CSS variables if replaced | No old dark mode variables remain in globals.css (already cleaned). However `--secondary` is referenced in Projects.tsx but never defined -- will be removed with CLEAN-02. Stale print.css selectors reference `.bg-clip-text` and `.ant-card` classes no longer used in components. |
| CLEAN-04 | Ensure no console errors or warnings | No `console.*` calls in source. Biome config has a broken glob pattern (`!!**/.git`) causing lint to fail. Build succeeds but shows `baseline-browser-mapping` warnings (npm dependency, low priority). |
</phase_requirements>

## Inventory of Dead Code

### Unused Public Assets (CLEAN-01)

| File | Size | Origin | Referenced? |
|------|------|--------|-------------|
| `public/file.svg` | 391 B | Next.js starter template | No |
| `public/globe.svg` | 1,035 B | Next.js starter template | No |
| `public/next.svg` | 1,375 B | Next.js starter template | No |
| `public/vercel.svg` | 128 B | Next.js starter template | No |
| `public/window.svg` | 385 B | Next.js starter template | No |

**Verified:** Grep for `file.svg|globe.svg|next.svg|vercel.svg|window.svg` across `src/` returns zero matches.

**Keep:** `public/.nojekyll` (required for GitHub Pages), `public/logos/*` (company logos, actively used), `public/opengraph-image.png` + `.alt.txt` (SEO).

### Unused Types and Exports (CLEAN-02)

| Item | Location | Why Unused |
|------|----------|------------|
| `Project` interface | `src/types/resume.ts:41-45` | Only imported in `resume.ts` for the empty `projects` array |
| `projects` export | `src/data/resume.ts:150` | Never imported anywhere (`page.tsx` does not import it) |
| `ProjectsSection` component | `src/components/resume/Projects.tsx` | Imported in `page.tsx` but gated behind `showProjects = false` |
| `ProjectsSection` import | `src/app/page.tsx:9` | Dead import due to `showProjects = false` |
| `githubRepos` data | `src/data/github.ts` | Only consumed by the disabled `ProjectsSection` |
| `githubColors` data | `src/data/githubColors.ts` | Only consumed by `Projects.tsx` |
| `showProjects` flag | `src/app/page.tsx:18` | Gating constant, remove with the rest |
| `prebuild` script | `package.json:7` | Runs `fetch-github.ts` which generates data for unused Projects |
| `scripts/fetch-github.ts` | `scripts/` | Generates `github.ts` for unused Projects section |

**Decision needed by planner:** Whether to remove the entire GitHub Projects feature (Projects.tsx, github.ts, githubColors.ts, fetch-github.ts, prebuild script) or keep it for potential future use. The requirements say "Remove unused Project type **if not used**" -- it is currently not used (hardcoded off). Recommendation: remove it all. It is in git history if needed later.

### Stale CSS (CLEAN-03)

| Item | Location | Issue |
|------|----------|-------|
| `--secondary` variable reference | `Projects.tsx:41,42` | Variable never defined in globals.css. Will be removed with CLEAN-02. |
| `.bg-clip-text` print rule | `print.css:121-127` | No element in any component uses `bg-clip-text` class |
| `.ant-card` print rules | `print.css:130-144` | No Ant Design Card component used anywhere; only icons are used |
| `section.avoid-break` print rule | `print.css:36-38` | No element has `avoid-break` class |

### Build/Lint Issues (CLEAN-04)

| Issue | Location | Fix |
|-------|----------|-----|
| Broken Biome glob | `biome.json:16` `!!**/.git` | Remove this line (invalid pattern causing lint failure) |
| `baseline-browser-mapping` warning | Build output | Run `npm i baseline-browser-mapping@latest -D` or ignore (cosmetic) |

## Architecture Patterns

### Safe Deletion Checklist

For each file/export to remove:

1. **Grep all references** in `src/`, `scripts/`, config files
2. **Remove imports** from consuming files
3. **Remove the file/export** itself
4. **Run `npm run lint`** (after fixing biome.json first)
5. **Run `npm run build`** to verify static export still works
6. **Compare build output size** (`du -sh out/`)

### Removal Order

The correct order matters because of import dependencies:

1. Fix `biome.json` first (unblocks lint verification for all subsequent steps)
2. Remove SVG files from `public/` (no code dependencies)
3. Remove Projects feature chain: `page.tsx` imports/usage -> `Projects.tsx` -> `github.ts` -> `githubColors.ts` -> `Project` interface -> `projects` export -> `scripts/fetch-github.ts` -> `prebuild` script from package.json
4. Clean stale print.css rules
5. Final verification: lint + build + size check

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Finding unused exports | Manual grep | Biome lint (once config fixed) + grep verification | Biome can detect unused imports automatically |
| Verifying no regressions | Manual testing only | `npm run build` + compare output size | Static export build catches all import/reference errors |

## Common Pitfalls

### Pitfall 1: Removing files still referenced in config
**What goes wrong:** Deleting a file that is referenced in `next.config.ts`, `tsconfig.json`, or `package.json` scripts
**How to avoid:** Check all config files, not just `src/`, before deleting

### Pitfall 2: Removing the prebuild script incorrectly
**What goes wrong:** Removing `fetch-github.ts` but leaving `"prebuild": "tsx scripts/fetch-github.ts"` in package.json causes build failure
**How to avoid:** Remove the `prebuild` script entry from package.json when removing the fetch script

### Pitfall 3: Breaking print layout
**What goes wrong:** Removing CSS rules from print.css that are actually needed, breaking PDF export
**How to avoid:** Only remove rules targeting selectors confirmed absent from all components (`.ant-card`, `.bg-clip-text`, `section.avoid-break`)

### Pitfall 4: Forgetting the Biome config fix
**What goes wrong:** All lint commands fail due to the `!!**/.git` pattern, making verification impossible
**How to avoid:** Fix biome.json as the very first step

## Validation Architecture

> No test framework configured. QA relies on `npm run lint` + `npm run build` + manual browser check.

### Verification Commands

| Check | Command | Expected |
|-------|---------|----------|
| Lint passes | `npm run lint` | Exit 0, no errors |
| Build passes | `npm run build` | Exit 0, static pages generated |
| Build size | `du -sh out/` | Same or smaller than current 1.1M |
| No unused SVGs | `ls public/*.svg` | No files (all removed) |
| No console errors | Manual: open in browser, check DevTools console | Clean console |

### Pre/Post Metrics

| Metric | Before | After (expected) |
|--------|--------|-------------------|
| SVG files in public/ | 5 | 0 |
| Build output size | 1.1M | <= 1.1M |
| Lint status | FAILING (biome.json broken) | PASSING |
| Unused type exports | 1 (`Project`) | 0 |
| Unused data exports | 2 (`projects`, `githubRepos`) | 0 |
| Dead component files | 1 (`Projects.tsx`) | 0 |
| Stale print CSS rules | 3 selectors | 0 |

## Sources

### Primary (HIGH confidence)
- Direct codebase investigation via grep and file reading
- `npm run build` output verified (succeeds, 1.1M)
- `npm run lint` output verified (fails due to biome.json glob error)
- All file references cross-checked with grep across entire `src/` tree

## Metadata

**Confidence breakdown:**
- Unused assets: HIGH - grep confirms zero references
- Unused types/exports: HIGH - grep confirms full dependency chain is dead
- Stale CSS: HIGH - grep confirms classes not used in any component
- Biome fix: HIGH - error message is explicit about the broken pattern
- No regressions: HIGH - build verification is deterministic for static export

**Research date:** 2026-03-06
**Valid until:** No expiry (codebase-specific findings, not library-dependent)
