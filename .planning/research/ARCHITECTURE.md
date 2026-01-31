# Architecture Research: Portfolio Enhancement

> How should the enhanced portfolio be structured?

## Current Architecture

```
src/
├── app/
│   ├── layout.tsx      # Root layout, fonts, AntdRegistry
│   ├── page.tsx        # Main page (client component)
│   └── globals.css     # Global styles
├── components/
│   ├── resume/         # Domain components
│   │   ├── Header.tsx
│   │   ├── Summary.tsx
│   │   ├── Experience.tsx
│   │   ├── Education.tsx
│   │   ├── Skills.tsx
│   │   └── Section.tsx
│   └── ui/             # Generic UI
│       └── PDFExportButton.tsx
├── data/
│   └── resume.ts       # Static resume data
├── styles/
│   └── print.css       # Print media styles
└── types/
    └── resume.ts       # TypeScript interfaces
```

**Assessment:** Clean, well-organized. Extend rather than restructure.

## Proposed Architecture Changes

### New Components

```
src/components/
├── resume/
│   ├── ... (existing)
│   └── Projects.tsx        # NEW: GitHub projects section
├── ui/
│   ├── PDFExportButton.tsx
│   ├── ThemeToggle.tsx     # NEW: Dark mode toggle
│   ├── CompanyLogo.tsx     # NEW: Logo with fallback
│   └── LanguageBadge.tsx   # NEW: Programming language indicator
└── providers/
    └── ThemeProvider.tsx   # NEW: next-themes wrapper
```

### New Data Files

```
src/data/
├── resume.ts           # Existing
├── github-config.ts    # NEW: Repo filtering config
└── theme.ts            # NEW: Color tokens
```

### New Types

```
src/types/
├── resume.ts           # Existing
└── github.ts           # NEW: GitHub API types
```

### Static Assets

```
public/
├── logos/              # NEW: Company logos
│   ├── covergo.webp
│   ├── upmesh.webp
│   ├── aswhite.webp
│   └── nashtech.webp
└── og-image.png        # NEW: Social sharing image
```

## Data Flow

### Current Flow
```
resume.ts (static) ──► page.tsx ──► Components ──► Rendered HTML
```

### Enhanced Flow
```
                    ┌─── resume.ts (static)
                    │
page.tsx ───────────┼─── github-repos.json (build-time fetched)
                    │
                    └─── theme context (next-themes)
                              │
                              ▼
                        Components
                              │
                              ▼
                      Rendered HTML + CSS variables
```

### GitHub Data Strategy

**Option A: Build-time fetch (Recommended)**
```
Build time:
  1. Fetch from GitHub API
  2. Filter repos
  3. Write to src/data/github-repos.json
  4. Import as static data

Runtime:
  - Pure static, no API calls
  - No rate limit concerns
```

**Option B: Client-side fetch**
```
Runtime:
  1. Fetch from GitHub API
  2. Handle loading/error states
  3. Cache in memory

Drawbacks:
  - Rate limits (60/hour unauthenticated)
  - Loading spinner on page load
  - Potential failures
```

**Recommendation:** Option A (build-time) with manual refresh script.

## Component Architecture

### Theme System

```typescript
// theme.ts - Color tokens
export const lightTheme = {
  background: '#ffffff',
  foreground: '#171717',
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  muted: '#f3f4f6',
  border: '#e5e7eb',
  // ... more tokens
};

export const darkTheme = {
  background: '#0a0a0a',
  foreground: '#ededed',
  primary: '#60a5fa',
  secondary: '#a78bfa',
  muted: '#1f2937',
  border: '#374151',
  // ... more tokens
};
```

**CSS Variables Approach:**
```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  /* ... */
}

[data-theme='dark'] {
  --background: #0a0a0a;
  --foreground: #ededed;
  /* ... */
}
```

### Projects Component

```typescript
interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

interface ProjectsProps {
  repos: GitHubRepo[];
}
```

### Company Logo Component

```typescript
interface CompanyLogoProps {
  company: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Fallback to first letter avatar if image fails
```

## Build Order (Dependencies)

```
1. Theme Infrastructure
   └── CSS variables, ThemeProvider, ThemeToggle
   └── No dependencies

2. Visual Refresh
   └── Depends on: Theme Infrastructure
   └── New colors, typography, layouts

3. Company Logos
   └── Depends on: Visual Refresh (for styling)
   └── Download images, create component

4. GitHub Projects
   └── Depends on: Visual Refresh (for styling)
   └── API integration, filtering, component

5. SEO & Analytics
   └── Depends on: Content complete
   └── Structured data, OG image, Plausible

6. Accessibility & Cleanup
   └── Depends on: All features complete
   └── Audit, fixes, remove dead code
```

## File Changes Summary

| Action | Files |
|--------|-------|
| **Create** | `ThemeProvider.tsx`, `ThemeToggle.tsx`, `Projects.tsx`, `CompanyLogo.tsx`, `github-config.ts`, `theme.ts`, `github.ts` |
| **Modify** | `layout.tsx`, `page.tsx`, `globals.css`, `Experience.tsx`, `resume.ts` |
| **Delete** | Unused SVGs in `public/` |

---

## Summary

**Key Architectural Decisions:**
1. Extend existing structure (don't restructure)
2. Use CSS variables for theming (works with Tailwind)
3. Fetch GitHub data at build time (static JSON)
4. Add providers layer for theme context
5. Keep single-page architecture

