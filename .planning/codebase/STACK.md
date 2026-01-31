# Technology Stack

> Auto-generated codebase map - Last updated: 2026-01-31

## Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.10 | React framework with static export |
| React | 19.2.1 | UI component library |
| TypeScript | ^5 | Type-safe JavaScript |

## UI & Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | ^4 | Utility-first CSS framework |
| Ant Design | 6.1.1 | UI component library |
| @ant-design/icons | 6.1.0 | Icon library |
| @ant-design/nextjs-registry | 1.3.0 | Ant Design SSR support for Next.js |

## Build & Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| Biome | 2.2.0 | Linting and formatting |
| PostCSS | - | CSS processing (Tailwind integration) |

## Key Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| react-to-print | 3.2.0 | PDF export functionality via browser print |

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration (static export, base path) |
| `tsconfig.json` | TypeScript compiler options |
| `biome.json` | Linting and formatting rules |
| `postcss.config.mjs` | PostCSS/Tailwind configuration |

## Build Output

- **Output Type**: Static HTML export (`output: "export"`)
- **Base Path**: `/resume` (production only)
- **Asset Prefix**: `/resume` (production only)
- **Images**: Unoptimized (static export compatible)

## Font Stack

- **Primary**: Inter (Google Fonts)
- **Fallback**: system-ui, -apple-system, sans-serif

## Browser Support

- Modern browsers (ES2017 target)
- Print media support for PDF generation

