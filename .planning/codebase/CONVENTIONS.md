# Code Conventions

> Auto-generated codebase map - Last updated: 2026-01-31

## Formatting & Linting

### Biome Configuration
- **Indent**: 2 spaces
- **Quotes**: Double quotes (default)
- **Semicolons**: Required (default)
- **Line Width**: Default (80)
- **Organize Imports**: Enabled

### Scripts
```bash
npm run lint    # biome check
npm run format  # biome format --write
```

## TypeScript Conventions

### Strict Mode Enabled
- `strict: true` in tsconfig.json
- All types must be explicit for exports

### Type Imports
```typescript
// Use type imports for interfaces
import type { Experience } from "@/types/resume";
```

### Interface Naming
- No `I` prefix (e.g., `ContactInfo` not `IContactInfo`)
- Descriptive names matching domain concepts

## Component Conventions

### File Naming
- **Components**: PascalCase (`Header.tsx`, `PDFExportButton.tsx`)
- **Data/Utils**: camelCase (`resume.ts`)
- **Styles**: kebab-case (`print.css`)

### Component Structure
```typescript
// 1. Imports
import type { SomeType } from "@/types/...";
import { SomeComponent } from "@/components/...";

// 2. Types/Interfaces (if component-specific)
interface ComponentProps {
  prop: string;
}

// 3. Helper functions (if any)
function helperFunction() { ... }

// 4. Component export
export function ComponentName({ prop }: ComponentProps) {
  return ( ... );
}
```

### Export Style
- Named exports preferred: `export function Component()`
- No default exports for components

### Client Components
- Use `"use client"` directive only when needed (interactivity)
- Currently used in: `page.tsx`, `PDFExportButton.tsx`

## Styling Conventions

### Tailwind CSS
- Utility-first approach
- Responsive: Mobile-first with `md:` breakpoints
- Color gradients: `bg-gradient-to-r from-X to-Y`
- Spacing: Consistent use of gap utilities

### Class Organization
```tsx
// Order: layout → spacing → sizing → colors → typography → effects → states
className="flex flex-col gap-4 p-5 bg-white rounded-xl border hover:shadow-lg transition-all"
```

### Color Palette
- **Primary gradient**: blue-500 → purple-500/600
- **Text**: gray-700 (body), gray-900 (headings)
- **Accents**: blue-600, purple-600
- **Backgrounds**: gray-50, white, gradient overlays

## Data Conventions

### Resume Data Format
```typescript
// Text with highlights using custom markers
"**bold text** and @@technology@@ mentions"

// Dates as Date objects
period: {
  start: new Date("2025-02-01"),
  end: new Date(),
  current: true,
}
```

### Text Parsing
- `**text**` → Bold (semibold, gray-900)
- `@@text@@` → Technology highlight (semibold, blue-600)
- Parsed in `Experience.tsx` via `parseTextWithHighlights()`

## Naming Conventions

### Variables & Functions
- camelCase: `formatPeriod`, `calculateDuration`
- Descriptive names: `parseTextWithHighlights`

### Props
- Suffix with `Props`: `HeaderProps`, `SectionProps`
- Use destructuring: `function Header({ name, title }: HeaderProps)`

### CSS Classes
- Tailwind utilities (no custom class names except for print targeting)
- Print-specific: `.no-print`, `.experience-item`

## Import Order

1. React/Next.js imports
2. Third-party libraries
3. Internal components (`@/components/...`)
4. Internal data/types (`@/data/...`, `@/types/...`)
5. Styles (`@/styles/...`)

