# Phase 4: GitHub Projects - Research

**Researched:** 2026-03-06
**Domain:** GitHub API integration, build-time data fetching, static site data pipeline
**Confidence:** HIGH

## Summary

Phase 4 adds a GitHub Projects section to the resume, fetching repository data at build time via the GitHub REST API and rendering it as cards with stats (stars, forks, language). The key architectural constraint is that this is a statically exported Next.js site (`output: "export"`) with a `"use client"` main page, meaning data must be fetched before or during build and baked into the bundle as static imports.

The recommended approach is a **prebuild script** that fetches repos from the GitHub API, filters/transforms them, and writes a TypeScript data file (`src/data/github.ts`). This follows the existing data layer pattern where all content lives in `src/data/` as typed exports. The component then imports this data identically to how `resume.ts` data is consumed today.

GitHub language colors should be embedded as a static lookup map rather than fetched at runtime, using the canonical `github-linguist/linguist` YAML source converted to a TypeScript object covering the languages the user actually uses.

**Primary recommendation:** Use a prebuild script (`scripts/fetch-github.ts`) that runs via `npx tsx` before `next build`, writes fetched repos to `src/data/github.ts`, and includes a checked-in fallback file so builds succeed even when the API is down.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PROJ-01 | Display GitHub repositories in a dedicated Projects section | New `Projects` component using `Section` wrapper, same pattern as `SkillsSection` |
| PROJ-02 | Show repo name with link to GitHub | `html_url` field from API response, render as `<a target="_blank" rel="noopener noreferrer">` |
| PROJ-03 | Show repo description | `description` field from API response |
| PROJ-04 | Show primary programming language with color indicator | `language` field + static color map from linguist data |
| PROJ-05 | Show star count | `stargazers_count` field from API response |
| PROJ-06 | Show fork count | `forks_count` field from API response |
| PROJ-07 | Show last updated date | `pushed_at` field (more accurate than `updated_at` for code activity) |
| PROJ-08 | Filter repos by configurable criteria | Prebuild script config: min stars, exclude forks, exclude archived, topic filter |
| PROJ-09 | Repos fetched at build time (no runtime API calls) | Prebuild script writes static TS file, imported at build |
| PROJ-10 | Graceful fallback if GitHub API unavailable | Checked-in fallback data file; script catches errors and preserves existing data |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Node.js built-in `fetch` | N/A | GitHub API calls in prebuild script | No extra dependency needed; Node 18+ has global fetch |
| `tsx` | (devDependency) | Run TypeScript prebuild script | Already common in Next.js projects; zero-config TS execution |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@ant-design/icons` | ^6.1.0 | Section icon (GithubOutlined, StarOutlined, ForkOutlined) | Already installed; use for project card icons |
| `date-fns` or native `Intl` | N/A | Format "last updated" dates | Use native `Intl.DateTimeFormat` to avoid new dependency |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Prebuild script | Server Component async fetch | Would require refactoring page.tsx from "use client" to server component; larger change |
| Prebuild script | Route Handler (app/api/repos/route.ts) | Works for static export but adds unnecessary abstraction for simple data |
| Static color map | npm `github-colors` package | Extra dependency for ~20 color values; overkill |
| `tsx` for script | `ts-node` | tsx is faster, zero-config, better ESM support |

**Installation:**
```bash
npm install -D tsx
```

## Architecture Patterns

### Recommended Project Structure
```
scripts/
  fetch-github.ts        # Prebuild script: fetches repos, writes data file
src/
  data/
    github.ts            # Generated + fallback: typed GitHub repo data
    githubColors.ts      # Static map: language -> hex color
  types/
    resume.ts            # Updated: new GitHubRepo interface (replaces old Project)
  components/
    resume/
      Projects.tsx       # New component: renders project cards
```

### Pattern 1: Prebuild Data Pipeline
**What:** A TypeScript script runs before `next build`, fetches data from an external API, and writes a typed data file that components import statically.
**When to use:** When you need external data in a static export site without server components.
**Example:**
```typescript
// scripts/fetch-github.ts
const GITHUB_USERNAME = "baotoq";
const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

interface GitHubApiRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  topics: string[];
}

async function fetchRepos(): Promise<GitHubApiRepo[]> {
  const params = new URLSearchParams({
    sort: "pushed",
    direction: "desc",
    per_page: "100",
    type: "owner",
  });

  const response = await fetch(`${API_URL}?${params}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}
```

### Pattern 2: Fallback-First Data File
**What:** The generated data file is checked into git so builds work offline. The prebuild script overwrites it when the API is available but preserves the existing file on failure.
**When to use:** When build reliability matters more than data freshness (PROJ-10).
**Example:**
```typescript
// In fetch-github.ts
try {
  const repos = await fetchRepos();
  const filtered = filterRepos(repos);
  writeDataFile(filtered);
  console.log(`Updated ${filtered.length} repos`);
} catch (error) {
  console.warn("GitHub API unavailable, using cached data");
  // Don't overwrite existing file - build continues with stale data
}
```

### Pattern 3: Card Grid Layout (Consistent with Existing Design)
**What:** Project cards in a responsive grid using the existing design system (CSS vars, rounded corners, hover effects).
**When to use:** Always - matches Skills section grid pattern.
**Example:**
```typescript
// Follows SkillsSection pattern
<Section title="Projects" icon={<GithubOutlined />}>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    {repos.map((repo) => (
      <a
        key={repo.name}
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-5 rounded-2xl bg-[var(--muted)] border border-[var(--border)] hover:shadow-md hover:border-[var(--accent)]/50 transition-all duration-200"
      >
        {/* repo name, description, stats */}
      </a>
    ))}
  </div>
</Section>
```

### Anti-Patterns to Avoid
- **Runtime API calls:** Never fetch GitHub data in the browser. It wastes rate limits, shows loading states, and breaks static export.
- **Hardcoding repo data in resume.ts:** Keep GitHub data separate from manually curated resume data. Different update cadences.
- **Using `updated_at` for "last updated":** This field changes when repo metadata changes (e.g., starring). Use `pushed_at` for actual code activity.
- **Fetching all 100+ repos without filtering:** Apply filters in the prebuild script, not in the component.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Language colors | Custom color mapping | Static map from linguist YAML | GitHub's canonical source; covers 600+ languages |
| Date formatting | Custom date formatter | `Intl.DateTimeFormat` or `toLocaleDateString` | Built into every browser; handles i18n |
| Star/fork formatting | Manual number formatting | `Intl.NumberFormat` with `notation: "compact"` | Handles 1.2k, 1M automatically |
| API pagination | Custom pagination logic | Single `per_page=100` call | User has <100 repos; no need for pagination |

**Key insight:** The GitHub API response already contains all needed data in a single call for users with fewer than 100 repos. Don't over-engineer pagination, caching, or incremental updates.

## Common Pitfalls

### Pitfall 1: GitHub API Rate Limiting
**What goes wrong:** Unauthenticated requests are limited to 60/hour. CI builds that run frequently can hit this.
**Why it happens:** No auth token provided; multiple builds in succession.
**How to avoid:** (1) Fallback file means rate limiting doesn't break builds. (2) Optionally support `GITHUB_TOKEN` env var for authenticated requests (5000/hour). (3) The prebuild script only runs during `npm run build`, not on every dev server restart.
**Warning signs:** Build logs show "GitHub API error: 403" or "API rate limit exceeded."

### Pitfall 2: Missing or null fields
**What goes wrong:** Some repos have `null` description, `null` language, or empty topics.
**Why it happens:** Not all repos have descriptions or detectable languages (e.g., config-only repos).
**How to avoid:** Handle all nullable fields in both the data transformation and the component. Show "No description" or hide the language indicator when null.
**Warning signs:** TypeScript errors about null checks; blank cards in the UI.

### Pitfall 3: Stale fallback data
**What goes wrong:** The checked-in fallback data becomes very outdated, showing wrong star counts or missing new repos.
**Why it happens:** Developer forgets to run the prebuild script before committing.
**How to avoid:** Add the prebuild step to the `build` script in package.json: `"build": "tsx scripts/fetch-github.ts && next build"`. This ensures data is refreshed on every build.
**Warning signs:** Star counts on the deployed site differ significantly from actual GitHub profile.

### Pitfall 4: Empty projects section
**What goes wrong:** Section renders with no repos, looking broken.
**Why it happens:** Too aggressive filtering (e.g., min 10 stars when user has no popular repos).
**How to avoid:** (1) Start with lenient filters. (2) Component handles empty state gracefully (hide section or show message). (3) Test with 0, 3, and 10+ repos as specified in success criteria.
**Warning signs:** Projects section is empty on first deploy.

### Pitfall 5: Existing Project type conflict
**What goes wrong:** `src/types/resume.ts` already has a `Project` interface with different fields (`name`, `technologies`, `achievements`).
**Why it happens:** Phase was planned before implementation; existing type doesn't match GitHub API data.
**How to avoid:** Create a new `GitHubRepo` interface for the API data. The old `Project` type and `projects` export in `resume.ts` can be removed (CLEAN-02 tracks this, but safe to handle now).
**Warning signs:** Type errors when trying to reuse the existing `Project` interface.

## Code Examples

### GitHub API Response (verified via live API call)
```typescript
// GET https://api.github.com/users/baotoq/repos?sort=pushed&type=owner
// Returns array of objects with these relevant fields:
interface GitHubApiRepo {
  name: string;              // "resume"
  html_url: string;          // "https://github.com/baotoq/resume"
  description: string | null; // "Personal resume website"
  language: string | null;    // "TypeScript"
  stargazers_count: number;   // 5
  forks_count: number;        // 0
  pushed_at: string;          // "2026-03-06T06:52:22Z"
  fork: boolean;              // false
  archived: boolean;          // false
  topics: string[];           // ["nextjs", "portfolio"]
}
```

### GitHubRepo type for the app
```typescript
// src/types/resume.ts - new interface
export interface GitHubRepo {
  name: string;
  url: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string; // ISO date string
}
```

### Language color map
```typescript
// src/data/githubColors.ts
// Source: https://github.com/github-linguist/linguist/blob/main/lib/linguist/languages.yml
// Only include languages the user actually uses
export const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  "C#": "#178600",
  Go: "#00ADD8",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Vue: "#41b883",
  HCL: "#844FBA",
};
```

### Build script integration
```json
// package.json - update build script
{
  "scripts": {
    "prebuild": "tsx scripts/fetch-github.ts",
    "build": "next build"
  }
}
```
Note: npm automatically runs `prebuild` before `build`. This is cleaner than chaining with `&&`.

### Filtering config
```typescript
// scripts/fetch-github.ts
const FILTER_CONFIG = {
  username: "baotoq",
  excludeForks: true,
  excludeArchived: true,
  minStars: 0,
  maxRepos: 6,
  excludeRepos: ["baotoq"], // Exclude GitHub profile repo
  includeTopics: [],        // Empty = no topic filter
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `getStaticProps` (Pages Router) | Server Components or prebuild scripts (App Router) | Next.js 13+ (2023) | Different data fetching patterns |
| `node-fetch` package | Built-in `fetch` in Node.js | Node 18+ (2023) | No extra dependency needed |
| GitHub API v3 REST | Still v3 REST (GraphQL also available) | Ongoing | REST is simpler for this use case |

**Deprecated/outdated:**
- `getStaticProps` / `getServerSideProps`: Pages Router only; this project uses App Router
- `node-fetch`: Unnecessary in Node 18+; use global `fetch`

## Open Questions

1. **Which repos to showcase?**
   - What we know: User has repos at github.com/baotoq. The API returns them sorted by push date.
   - What's unclear: Whether user wants to manually curate the list or auto-filter.
   - Recommendation: Start with auto-filter (exclude forks, archived, profile repo) and cap at 6. Add an `excludeRepos` list for manual control. The config lives in the prebuild script.

2. **Section placement on page?**
   - What we know: Current order is Header > Summary > Experience > Education > Skills.
   - What's unclear: Where Projects section should appear.
   - Recommendation: Place after Skills, as a supplementary "show your work" section. Or between Experience and Education to highlight technical output.

## Validation Architecture

> No test runner is configured (per CLAUDE.md). QA is `npm run lint` + `npm run build` + manual browser check.

### Verification Approach

| Req ID | Behavior | Verification Method | Command |
|--------|----------|---------------------|---------|
| PROJ-01 | Projects section renders | Build succeeds + manual check | `npm run build` |
| PROJ-02 | Repo name links to GitHub | Manual: click link opens new tab | Manual browser check |
| PROJ-03 | Description shown | Manual: visible on card | Manual browser check |
| PROJ-04 | Language color indicator | Manual: colored dot matches language | Manual browser check |
| PROJ-05 | Star count displayed | Manual: matches GitHub | Manual browser check |
| PROJ-06 | Fork count displayed | Manual: matches GitHub | Manual browser check |
| PROJ-07 | Last updated shown | Manual: reasonable date | Manual browser check |
| PROJ-08 | Configurable filtering | Modify config, rebuild, verify output changes | `npm run build` |
| PROJ-09 | Build-time fetch | No network calls in browser DevTools | `npm run build` + DevTools Network tab |
| PROJ-10 | Graceful fallback | Disconnect network, build succeeds | `npm run build` (offline) |

### Automated Checks
- `npm run lint` -- Code quality (Biome)
- `npm run build` -- Static export succeeds (catches import errors, type errors)

### Wave 0 Gaps
- None -- no test framework, QA is lint + build + manual (per project convention)

## Sources

### Primary (HIGH confidence)
- Live GitHub API call to `https://api.github.com/users/baotoq/repos` - verified response structure and available fields
- `github-linguist/linguist` languages.yml - canonical source for language colors
- Next.js official docs on static exports - verified build-time behavior

### Secondary (MEDIUM confidence)
- Next.js 16 static export guide (https://nextjs.org/docs/app/guides/static-exports) - confirmed fetch runs at build time

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - verified API response live, confirmed Node.js fetch works, confirmed prebuild pattern
- Architecture: HIGH - follows existing project patterns (data in src/data/, typed exports, Section wrapper)
- Pitfalls: HIGH - rate limiting and null fields are well-documented GitHub API behaviors

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (GitHub REST API v3 is stable; no breaking changes expected)
