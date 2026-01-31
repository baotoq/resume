# File Structure

> Auto-generated codebase map - Last updated: 2026-01-31

## Directory Layout

```
resume/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout (fonts, metadata, AntdRegistry)
│   │   ├── page.tsx            # Main resume page (client component)
│   │   ├── globals.css         # Global styles & CSS variables
│   │   └── favicon.ico         # Site favicon
│   │
│   ├── components/
│   │   ├── resume/             # Resume-specific components
│   │   │   ├── Header.tsx      # Name, title, contact info
│   │   │   ├── Summary.tsx     # Professional summary section
│   │   │   ├── Experience.tsx  # Work experience timeline
│   │   │   ├── Education.tsx   # Education section
│   │   │   ├── Skills.tsx      # Skills grid by category
│   │   │   └── Section.tsx     # Reusable section wrapper
│   │   │
│   │   └── ui/                 # Generic UI components
│   │       └── PDFExportButton.tsx  # Print/PDF trigger button
│   │
│   ├── data/
│   │   └── resume.ts           # All resume content (static data)
│   │
│   ├── styles/
│   │   └── print.css           # Print media styles for PDF
│   │
│   └── types/
│       └── resume.ts           # TypeScript interfaces
│
├── public/                     # Static assets (copied to output)
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── out/                        # Build output (static export)
│   ├── index.html
│   ├── 404.html
│   └── _next/                  # Compiled assets
│
├── .planning/                  # Project planning docs
│   └── codebase/               # Codebase documentation
│
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── biome.json                  # Linting & formatting
├── postcss.config.mjs          # PostCSS (Tailwind)
├── package.json                # Dependencies & scripts
└── README.md                   # Project documentation
```

## File Responsibilities

### Entry Points
| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout, fonts, metadata, Ant Design SSR |
| `src/app/page.tsx` | Main page, assembles all resume sections |

### Components (src/components/)
| File | Lines | Purpose |
|------|-------|---------|
| `resume/Header.tsx` | 87 | Name, title, contact links with icons |
| `resume/Summary.tsx` | 18 | Professional summary with quote styling |
| `resume/Experience.tsx` | 140 | Work history with timeline, text parsing |
| `resume/Education.tsx` | 37 | Education cards |
| `resume/Skills.tsx` | 51 | Skills grid with category colors |
| `resume/Section.tsx` | 28 | Reusable section wrapper with icon |
| `ui/PDFExportButton.tsx` | 28 | Print trigger button |

### Data & Types (src/data/, src/types/)
| File | Purpose |
|------|---------|
| `data/resume.ts` | Static resume content (experiences, skills, etc.) |
| `types/resume.ts` | TypeScript interfaces for resume data |

### Styles (src/styles/, src/app/)
| File | Purpose |
|------|---------|
| `app/globals.css` | CSS variables, Tailwind import, Ant Design fixes |
| `styles/print.css` | Print media queries for PDF export |

## Import Aliases

```typescript
// Configured in tsconfig.json
"@/*" → "./src/*"

// Usage examples:
import { Header } from "@/components/resume/Header";
import type { Experience } from "@/types/resume";
import { experiences } from "@/data/resume";
```

## Key Files by Concern

### To Add New Resume Section
1. Create component in `src/components/resume/`
2. Add type in `src/types/resume.ts`
3. Add data in `src/data/resume.ts`
4. Import and render in `src/app/page.tsx`

### To Modify Styling
- **Colors/Theme**: `src/app/globals.css`
- **Component styles**: Tailwind classes in component files
- **Print/PDF**: `src/styles/print.css`

### To Update Resume Content
- Edit `src/data/resume.ts` only

