# Architecture Overview

> Auto-generated codebase map - Last updated: 2026-01-31

## System Type

**Static Single-Page Application (SPA)** - A resume/portfolio website built with Next.js static export.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Layout    │  │   Page      │  │   Print Styles      │ │
│  │  (layout)   │──│  (page)     │──│   (print.css)       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│         │                │                                   │
│         ▼                ▼                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Resume Components                        │   │
│  │  ┌────────┐ ┌─────────┐ ┌────────────┐ ┌─────────┐  │   │
│  │  │ Header │ │ Summary │ │ Experience │ │Education│  │   │
│  │  └────────┘ └─────────┘ └────────────┘ └─────────┘  │   │
│  │  ┌────────┐ ┌─────────────────────────────────────┐  │   │
│  │  │ Skills │ │           Section (shared)          │  │   │
│  │  └────────┘ └─────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│         │                                                    │
│         ▼                                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Data Layer                         │   │
│  │  ┌──────────────┐  ┌──────────────────────────────┐  │   │
│  │  │ resume.ts    │  │ types/resume.ts (interfaces) │  │   │
│  │  │ (static data)│  │                              │  │   │
│  │  └──────────────┘  └──────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **Static Data** (`src/data/resume.ts`) contains all resume content
2. **Page Component** (`src/app/page.tsx`) imports data and passes to components
3. **Resume Components** render data with Tailwind CSS styling
4. **PDF Export** uses browser print API via `react-to-print`

## Component Architecture

### Composition Pattern
- **Section**: Reusable wrapper component with title, icon, and content slot
- **Domain Components**: Header, Summary, Experience, Education, Skills
- **UI Components**: PDFExportButton

### Props Flow
```
page.tsx
  ├── Header ← { name, title, contact, pdfButton }
  ├── Summary ← { summary }
  ├── ExperienceSection ← { experiences[] }
  ├── EducationSection ← { education[] }
  └── SkillsSection ← { skills[] }
```

## Styling Architecture

### Layers
1. **Tailwind CSS**: Primary styling via utility classes
2. **CSS Variables**: Theme colors in `globals.css`
3. **Print Styles**: Separate `print.css` for PDF output
4. **Ant Design**: Component library styles (SSR-compatible)

### Responsive Design
- Mobile-first approach
- Breakpoints: `md:` (768px+) for desktop layouts
- Flex-based layouts with gap utilities

## Build Pipeline

```
Source (src/)
    │
    ▼ [next build]
Static Export (out/)
    │
    ▼ [deploy]
GitHub Pages (/resume)
```

## Key Patterns

1. **Static Export**: No server required, pure HTML/CSS/JS
2. **Client Components**: `"use client"` for interactivity (PDF button)
3. **Type Safety**: TypeScript interfaces for all data structures
4. **Text Parsing**: Custom markdown-like syntax (`**bold**`, `@@tech@@`)

