# Architecture Patterns: Resume/CV Page

**Domain:** Personal software engineer resume/CV page
**Researched:** 2026-04-12
**Stack context:** Next.js 16.2.3 + React 19 + TypeScript strict + Tailwind v4 + Vercel

---

## Recommended Architecture

A statically rendered single-page resume, with resume content stored as typed TypeScript data objects co-located in `src/data/`, UI components organized by section in `src/components/resume/`, and PDF export handled client-side via `@react-pdf/renderer` loaded with `ssr: false` dynamic import.

### Why This Specific Shape

- The page renders the same content to every visitor. This makes it a perfect static export candidate.
- Resume data changes infrequently and is authored by the engineer, not a CMS user. TypeScript data objects give compile-time type safety with zero runtime overhead and no external dependency.
- PDF output must match the web design. The shared data layer achieves this — one source of truth, two rendering targets (browser DOM and `@react-pdf/renderer`'s PDF primitives).
- No headless browser server is viable on Vercel's free tier or in a static site context. `@react-pdf/renderer` generates PDF entirely in the browser using its own layout engine, no server required.

---

## Component Boundaries

| Component | Responsibility | Type | Communicates With |
|-----------|---------------|------|-------------------|
| `src/app/page.tsx` | Route entry point, assembles section components | React Server Component | Section components |
| `src/app/layout.tsx` | HTML shell, fonts, global meta | React Server Component | `page.tsx` |
| `src/components/resume/Header.tsx` | Name, title, contact links | Server Component | `resumeData` |
| `src/components/resume/Experience.tsx` | Job list, roles, dates, bullets | Server Component | `resumeData` |
| `src/components/resume/Skills.tsx` | Tech stack, tools | Server Component | `resumeData` |
| `src/components/pdf/PdfDownloadButton.tsx` | Download trigger, PDF document definition | Client Component (`"use client"`) | `resumeData` |
| `src/data/resume.ts` | Typed data object — single source of truth | Pure data module | Imported by both web and PDF components |
| `src/types/resume.ts` | TypeScript interface definitions | Type module | Imported everywhere |

### Separation Principle

Web components use Tailwind CSS classes and standard HTML elements. PDF components use `@react-pdf/renderer` primitives (`View`, `Text`, `StyleSheet`). They share nothing from their rendering layer — they share only the typed data. This means the PDF layout can be styled and tuned independently of the web layout without coupling concerns.

---

## Data Layer

### Decision: TypeScript Data Objects (not JSON, not MDX, not CMS)

Use a single file at `src/data/resume.ts` that exports a typed constant:

```typescript
// src/types/resume.ts
export interface ResumeData {
  name: string
  title: string
  contact: {
    email: string
    github: string
    linkedin: string
    location: string
  }
  experience: ExperienceItem[]
  skills: SkillGroup[]
}

export interface ExperienceItem {
  company: string
  role: string
  startDate: string  // ISO "YYYY-MM"
  endDate: string | "present"
  responsibilities: string[]
}

export interface SkillGroup {
  category: string
  items: string[]
}
```

```typescript
// src/data/resume.ts
import type { ResumeData } from "@/types/resume"

export const resumeData: ResumeData = {
  name: "...",
  // ...
}
```

**Why not JSON?** TypeScript data objects get compile-time type checking. JSON imports require type assertions or a Zod schema. For content only the engineer edits, type assertion adds no real safety — just ceremony.

**Why not MDX?** MDX is appropriate when content authors need rich text authoring and the content structure varies. Resume sections are structured data (arrays of jobs, arrays of skills), not prose. MDX would fight the structured rendering both web and PDF require.

**Why not a CMS?** No backend is needed and the project explicitly excludes one. A CMS adds a dependency, a build-time fetch, and a login to maintain.

---

## Rendering Strategy

### Decision: Static Prerendering (not SSR, not ISR)

The resume page has no dynamic inputs — no user-specific data, no request-time dependencies, no content that changes between builds. Next.js 16 App Router will automatically prerender the page at build time because the page component is a Server Component with no dynamic functions (`cookies()`, `headers()`, etc.) and no uncached `fetch()` calls.

This means:
- Vercel serves the page from its CDN edge with no origin server round-trip
- No `output: 'export'` config change needed — standard App Router static prerendering works correctly on Vercel
- To update the resume content: edit `src/data/resume.ts`, push to git, Vercel redeploys (takes ~30 seconds)

**Verify static rendering** by running `next build` and confirming the `/` route is marked `○ (Static)` in the build output.

### What This Means for Components

All section components (`Header`, `Experience`, `Skills`) are React Server Components by default. They import directly from `src/data/resume.ts` and render pure HTML with Tailwind classes. No `"use client"` needed unless interactivity is added.

The only client component is `PdfDownloadButton`. It is a leaf node — it does not wrap other components and does not affect the static rendering of the rest of the page.

---

## Page Layout: Single Page

### Decision: Single scrollable page at `/`

Recruiters scan a resume from top to bottom. A multi-route structure (e.g., `/experience`, `/skills`) would fragment that flow and add navigation overhead with no benefit. All sections live on one page, assembled in `src/app/page.tsx`.

Section order recommendation: Header (name/title/contact) → Experience → Skills. Experience is the primary signal for both recruiters and engineers; lead with it after identification.

---

## PDF Generation

### Decision: `@react-pdf/renderer` with Client-Side Dynamic Import

**Constraint from project:** No headless browser server. This eliminates Puppeteer/Playwright approaches that require a Node.js process to screenshot the page.

**Options evaluated:**

| Approach | Works without server? | PDF matches web design? | Complexity |
|----------|----------------------|------------------------|------------|
| `@react-pdf/renderer` client-side | Yes | Requires parallel PDF layout | Medium |
| `window.print()` / print CSS | Yes | Yes (it IS the web layout) | Low |
| Puppeteer via API route | No (Node.js required) | Yes | High |
| jsPDF / html2canvas | Yes | Approximate (canvas-based, poor text quality) | Medium |

**Recommended: `@react-pdf/renderer` client-side.**

Reason: `window.print()` produces browser-dependent output. Chrome's print dialog exposes margin controls, headers, footers, and scale that the user must configure manually — the PDF is not deterministic. jsPDF's html2canvas approach rasterises text, producing poor quality at standard resume reading sizes. `@react-pdf/renderer` generates a true vector PDF with precise layout control, deterministic output, and a one-click download.

The tradeoff is that PDF components must be written with `@react-pdf/renderer` primitives (`View`, `Text`, `StyleSheet`) rather than HTML + Tailwind. This is not avoidable with any client-side PDF approach that produces high-quality output.

### Integration Pattern

`@react-pdf/renderer` depends on browser APIs not available on the server. In Next.js App Router, this requires two things:

1. `"use client"` on the PDF component file
2. `dynamic()` import with `ssr: false` at the call site, OR keep all PDF code inside a `"use client"` component that is never imported by a Server Component at the module level

Recommended pattern — a single client component wraps everything:

```typescript
// src/components/pdf/PdfDownloadButton.tsx
"use client"

import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"
import { resumeData } from "@/data/resume"

const styles = StyleSheet.create({ /* ... */ })

function ResumePdfDocument() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* PDF layout using View/Text primitives */}
      </Page>
    </Document>
  )
}

export function PdfDownloadButton() {
  return (
    <PDFDownloadLink document={<ResumePdfDocument />} fileName="resume.pdf">
      {({ loading }) => loading ? "Preparing PDF..." : "Download PDF"}
    </PDFDownloadLink>
  )
}
```

Then in `page.tsx` (or `Header.tsx`), import it via `next/dynamic`:

```typescript
// src/app/page.tsx
import dynamic from "next/dynamic"

const PdfDownloadButton = dynamic(
  () => import("@/components/pdf/PdfDownloadButton").then(m => m.PdfDownloadButton),
  { ssr: false, loading: () => <span>Loading...</span> }
)
```

This pattern keeps the static page prerenderable. The download button hydrates client-side after the static HTML is delivered.

**Next.js config: no changes needed.** Next.js 16 automatically opts `@react-pdf/renderer` out of server-side bundling — it is on the built-in `serverExternalPackages` allowlist in `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/serverExternalPackages.md`. Do not add it manually; the existing `next.config.ts` is sufficient.

---

## Directory Structure After Implementation

```
src/
├── app/
│   ├── layout.tsx          # Root shell (unchanged from scaffold)
│   ├── page.tsx            # Assembles: Header, Experience, Skills, PdfDownloadButton
│   └── globals.css         # Tailwind v4 base (unchanged)
├── components/
│   ├── resume/
│   │   ├── Header.tsx      # Name, title, contact — Server Component
│   │   ├── Experience.tsx  # Job list — Server Component
│   │   └── Skills.tsx      # Tech skills — Server Component
│   └── pdf/
│       └── PdfDownloadButton.tsx  # "use client", contains full PDF document
├── data/
│   └── resume.ts           # Single source of truth — typed data object
└── types/
    └── resume.ts           # TypeScript interfaces for resume shape
```

Note: `src/types/` here is under `src/` and is application code — distinct from the auto-generated `types/` at the project root (Next.js route types, do not edit).

---

## Data Flow

```
src/data/resume.ts (typed constant)
    |
    +---> src/components/resume/Header.tsx     (Server Component → HTML + Tailwind)
    |
    +---> src/components/resume/Experience.tsx (Server Component → HTML + Tailwind)
    |
    +---> src/components/resume/Skills.tsx     (Server Component → HTML + Tailwind)
    |
    +---> src/components/pdf/PdfDownloadButton.tsx
              (Client Component → @react-pdf/renderer → PDF blob → download)
```

One data source. Two rendering paths. No synchronisation problem.

---

## Scalability Considerations

| Concern | Now (single engineer, static) | If adding sections later |
|---------|-------------------------------|--------------------------|
| New section | Add type to `ResumeData`, add component, add to `page.tsx` | Same pattern, no architectural change |
| PDF section parity | Add corresponding `View`/`Text` block in `PdfDownloadButton.tsx` | Manual but isolated |
| Multiple resumes (e.g., frontend-focused vs backend-focused) | Not needed now | Export multiple typed constants from `resume.ts`, add a route parameter |
| CMS migration | `src/data/resume.ts` → fetch from API, same types | Data layer is the only thing that changes |

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Putting Resume Data in Component Files
**What goes wrong:** Data and presentation are coupled. Making the same data available to the PDF component requires prop-drilling or duplication.
**Instead:** `src/data/resume.ts` is the single import point. Components receive the whole `resumeData` object or specific sub-objects.

### Anti-Pattern 2: Server-Side PDF Generation via API Route
**What goes wrong:** Puppeteer-based approaches require a full Node.js server process, incompatible with static Vercel deployments. `@react-pdf/renderer` in a Route Handler works technically but adds unnecessary server invocation when the browser can do the same work.
**Instead:** Client-side PDF generation via `dynamic` import with `ssr: false`. The resume page is publicly cacheable static HTML; the PDF is generated in the user's browser on demand.

### Anti-Pattern 3: Using `window.print()` for the Download Button
**What goes wrong:** The browser print dialog exposes settings (margins, headers, scale) the user can change. The resulting PDF may omit background colours, clip content, or add browser chrome headers/footers. Output is non-deterministic across browsers.
**Instead:** `@react-pdf/renderer`'s `PDFDownloadLink` produces a deterministic, styled PDF blob delivered directly as a file download with no dialog interaction required.

### Anti-Pattern 4: Importing `@react-pdf/renderer` in a Server Component
**What goes wrong:** The library uses browser globals (`canvas`, `Blob`) that do not exist in the Node.js rendering environment. Even though Next.js 16 opts the package out of server bundling automatically, importing it directly in a Server Component will still cause a runtime failure.
**Instead:** Isolate all `@react-pdf/renderer` imports behind `"use client"` + `dynamic({ ssr: false })` as described above.

### Anti-Pattern 5: Separate Web and PDF Data Schemas
**What goes wrong:** When the resume content changes, two schemas and two data files must be kept in sync. Divergence is inevitable.
**Instead:** One `ResumeData` interface, one `resumeData` constant, two rendering components that consume the same data.

---

## Sources

- Next.js 16 static exports docs: `node_modules/next/dist/docs/01-app/02-guides/static-exports.md` (HIGH confidence — official local docs)
- Next.js 16 rendering philosophy: `node_modules/next/dist/docs/01-app/02-guides/rendering-philosophy.md` (HIGH confidence — official local docs)
- `@react-pdf/renderer` on Next.js 16 built-in `serverExternalPackages` allowlist: `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/serverExternalPackages.md` line 35 (HIGH confidence — official local docs, verified directly)
- `@react-pdf/renderer` Next.js App Router SSR issues: https://github.com/diegomura/react-pdf/discussions/2402 and https://github.com/diegomura/react-pdf/issues/2460 (MEDIUM confidence — GitHub issue threads, confirmed by multiple reporters across Next.js 13-14; pattern applies to 16)
- `@react-pdf/renderer` v4.4.1 React 19 compatibility: https://www.npmjs.com/package/@react-pdf/renderer (MEDIUM confidence — npm registry listing; no official changelog cross-check performed)
