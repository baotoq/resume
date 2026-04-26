# Personal Resume Site

A single-page, statically generated resume site built with modern web technologies to be fast, accessible, and easily printable/exportable to PDF.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Language:** TypeScript
- **Animations:** Framer Motion
- **Testing:** Vitest (Unit) + Playwright (E2E)

## Architecture & Data Flow

The content of the resume is completely decoupled from the UI components.
- **Resume Data:** The primary data source is `src/data/resume.md`. It uses YAML frontmatter (parsed via `gray-matter`) to populate the site's content at request/build time. 
- **Type Safety:** The parsed data is validated and typed against a Zod schema (`src/lib/resume-schema.ts`) and injected into the page as `ResumeData`.
- **Environment Variables:** Sensitive contact information (`EMAIL` and `PHONE`) are injected via environment variables (`.env.local`) rather than hardcoded in the repository.

## Commands

```bash
# Development
npm run dev         # start dev server on http://localhost:3000

# Building
npm run build       # production static build
npm run build:pdf   # generate a PDF version of the resume locally

# Formatting & Linting
npm run lint        # biome check (linter)
npm run format      # biome format --write

# Testing
npm run test        # vitest unit tests (single run)
npm run test:watch  # vitest watch mode
npm run test:e2e    # playwright e2e (smoke)
npm run test:all    # run both unit and e2e tests
```

## Customizing the Resume

### Editing Content
To update job experience, education, or bio, modify the YAML frontmatter inside `src/data/resume.md`. The UI will automatically reflect the changes.

### Adding a New Tech Icon
1. Find or create the SVG component (e.g., using `react-devicons`).
2. Add a new entry to `TECH_ICON_MAP` in `src/components/techstack-icons/TechStackIcons.tsx`. 
   *(Note: The key must match the `tech_stack` value in your YAML file after it is `.toLowerCase().trim()`'d).*

### Adding a Company/Education Logo
1. Save the new logo (preferably SVG or an optimized format).
2. Add a new component in `src/components/company-logos/` or reference the URL directly in the YAML `logo_url` field (such as in Education entries).
3. If using an SVG component, register it in the `COMPANY_LOGO_MAP` inside `src/components/company-logos/LogoImage.tsx` (the key must exactly match the `company` string from your resume data). If it's not registered, the component will fall back to using a standard `<img src={logo_url} />`.

## PDF Generation

The project includes a print-optimized stylesheet. You can generate a pixel-perfect PDF version of the resume by running:
```bash
npm run build:pdf
```
This uses Playwright under the hood to render the page and export it, outputting the file to the `public/` directory so it can be hosted and downloaded by visitors directly from the web interface.
