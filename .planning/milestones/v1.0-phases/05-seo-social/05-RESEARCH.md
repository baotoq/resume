# Phase 5: SEO & Social - Research

**Researched:** 2026-03-06
**Domain:** SEO metadata, structured data (JSON-LD), Open Graph, Twitter Cards
**Confidence:** HIGH

## Summary

Phase 5 adds structured data and social sharing metadata to the static Next.js resume site. The implementation leverages Next.js 16's built-in Metadata API (static `metadata` export in `layout.tsx`) for Open Graph, Twitter Card, and canonical URL tags, plus a `<script type="application/ld+json">` block for Person and ProfilePage schema.org structured data.

The site already has partial OG metadata in `layout.tsx` (title, description, type) but is missing: OG image, full Twitter Card tags, canonical URL, `metadataBase`, and all JSON-LD structured data. The resume data in `src/data/resume.ts` provides all content needed to populate Person schema properties (name, jobTitle, email, sameAs links, worksFor, alumniOf, skills).

**Primary recommendation:** Use Next.js static `metadata` export with `metadataBase` for OG/Twitter/canonical tags, render JSON-LD as a `<script>` tag in the page component, and place a pre-designed static PNG as the OG image (dynamic `ImageResponse` generation does NOT work with `output: "export"`).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SEO-01 | JSON-LD structured data for Person schema | Person schema properties mapped from resume.ts data; render via `<script type="application/ld+json">` |
| SEO-02 | JSON-LD structured data for ProfilePage schema | ProfilePage wraps Person as `mainEntity`; single combined JSON-LD block |
| SEO-03 | Open Graph meta tags (title, description, image, type) | Next.js Metadata API `openGraph` field with `metadataBase` for absolute URLs |
| SEO-04 | Twitter Card meta tags | Next.js Metadata API `twitter` field with `summary_large_image` card type |
| SEO-05 | Custom OG image generated for social sharing | Static PNG file at `src/app/opengraph-image.png` (1200x630); ImageResponse not compatible with static export |
| SEO-06 | Canonical URL specified | Next.js Metadata API `alternates.canonical` field |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js Metadata API | 16.x (built-in) | OG, Twitter, canonical meta tags | Native to Next.js, type-safe, auto-generates `<head>` tags |
| schema-dts | latest | TypeScript types for schema.org | Type-safe JSON-LD authoring, catches schema errors at compile time |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none) | - | JSON-LD rendering | Built-in: `<script>` tag with `dangerouslySetInnerHTML` per Next.js docs |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| schema-dts | Manual JSON objects | schema-dts adds type safety but is optional; manual objects work fine for 2 schema types |
| Static OG image | next/og ImageResponse | ImageResponse does NOT work with `output: "export"` (confirmed via GitHub discussion #55890) |
| next-seo | Next.js Metadata API | next-seo was useful for Pages Router; App Router has native metadata support, making next-seo unnecessary |

**Installation:**
```bash
npm install schema-dts
```

## Architecture Patterns

### Recommended Approach

```
src/
  app/
    layout.tsx              # Metadata export: OG, Twitter, canonical, metadataBase
    page.tsx                # JSON-LD script tag rendered in page body
    opengraph-image.png     # Static 1200x630 OG image (file convention)
    opengraph-image.alt.txt # Alt text for OG image
    twitter-image.png       # Can symlink or copy same image
    twitter-image.alt.txt   # Alt text for Twitter image
  data/
    resume.ts               # Source data for JSON-LD Person properties
```

### Pattern 1: Static Metadata Export with metadataBase
**What:** Use Next.js `metadata` object export in `layout.tsx` with `metadataBase` to handle URL resolution for the GitHub Pages deployment.
**When to use:** Always for static sites with a known base URL.
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from "next";

const BASE_URL = "https://baotoq.github.io/resume";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "To Quoc Bao - Senior Software Engineer Resume",
  description: "Senior Software Engineer with 7+ years...",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "To Quoc Bao - Senior Software Engineer",
    description: "Senior Software Engineer specializing in...",
    url: "/",
    siteName: "To Quoc Bao Resume",
    type: "profile",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png", // resolved against metadataBase
        width: 1200,
        height: 630,
        alt: "To Quoc Bao - Senior Software Engineer Resume",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "To Quoc Bao - Senior Software Engineer",
    description: "Senior Software Engineer specializing in...",
    images: ["/opengraph-image.png"],
  },
};
```

### Pattern 2: JSON-LD as Script Tag in Page Component
**What:** Render structured data as `<script type="application/ld+json">` inside the page component body.
**When to use:** For all JSON-LD structured data in Next.js App Router.
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/guides/json-ld
import type { WithContext, ProfilePage } from "schema-dts";
import { mainInfo, contactInfo, summary, experiences, education, skillCategories } from "@/data/resume";

const jsonLd: WithContext<ProfilePage> = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  dateModified: new Date().toISOString(),
  mainEntity: {
    "@type": "Person",
    name: mainInfo.name,
    jobTitle: mainInfo.title,
    description: summary,
    email: contactInfo.email,
    telephone: contactInfo.phone,
    url: "https://baotoq.github.io/resume",
    sameAs: [
      contactInfo.linkedin,
      contactInfo.github,
    ].filter(Boolean) as string[],
    worksFor: {
      "@type": "Organization",
      name: experiences[0].company.name,
      url: experiences[0].company.url,
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education[0].school,
    },
    knowsAbout: skillCategories.flatMap((cat) => cat.skills),
  },
};

// In the component JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
  }}
/>
```

### Pattern 3: Static OG Image via File Convention
**What:** Place a static `opengraph-image.png` file in `src/app/` and Next.js auto-generates the meta tags.
**When to use:** For static export sites where `ImageResponse` is not available.
**Example:** Place `opengraph-image.png` (1200x630px) in `src/app/` directory. Next.js will generate:
```html
<meta property="og:image" content="<generated-url>" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

### Anti-Patterns to Avoid
- **Duplicate metadata between layout and page:** OG tags in layout.tsx get overwritten if page.tsx also exports metadata with openGraph. Keep all OG/Twitter metadata in layout.tsx since this is a single-page app.
- **Using next/og ImageResponse with static export:** This requires server-side rendering and will fail with `output: "export"`.
- **Hardcoding absolute URLs without metadataBase:** Use `metadataBase` so relative paths resolve correctly across environments.
- **Separate Person and ProfilePage JSON-LD blocks:** Combine them into one block with ProfilePage containing Person as `mainEntity` to avoid confusing crawlers.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Meta tag generation | Manual `<meta>` tags in `<head>` | Next.js `metadata` export | Handles deduplication, ordering, type safety |
| OG image URL resolution | String concatenation for absolute URLs | `metadataBase` + relative paths | Handles basePath, trailing slashes, protocol |
| Schema.org type checking | Manual JSON object shapes | `schema-dts` types | Catches invalid properties at compile time |
| Twitter card fallback | Separate Twitter-specific image | Same image via `twitter.images` | Twitter falls back to OG image if not specified, but explicit is better |

**Key insight:** Next.js Metadata API handles all the tricky parts of meta tag generation (deduplication between layout/page, absolute URL resolution, proper HTML encoding). Don't bypass it with manual `<meta>` tags.

## Common Pitfalls

### Pitfall 1: basePath Not Reflected in OG Image URL
**What goes wrong:** OG image URL points to `/opengraph-image.png` instead of `/resume/opengraph-image.png` on GitHub Pages.
**Why it happens:** `metadataBase` must include the basePath, or relative image paths resolve wrong.
**How to avoid:** Set `metadataBase: new URL("https://baotoq.github.io/resume")` -- the `/resume` basePath is part of the base URL.
**Warning signs:** Facebook Debugger shows broken image; LinkedIn preview has no image.

### Pitfall 2: OG Image File Convention vs Metadata Export Conflict
**What goes wrong:** File-based metadata (opengraph-image.png) overrides metadata export's `openGraph.images`.
**Why it happens:** File-based metadata has higher priority than the metadata object per Next.js docs.
**How to avoid:** Use EITHER the file convention OR the metadata export for images, not both. File convention is simpler for a single static image.
**Warning signs:** Image dimensions or URL don't match what you set in the metadata export.

### Pitfall 3: Static Export Breaks Dynamic OG Image
**What goes wrong:** Build fails or no image generated when using `opengraph-image.tsx` with `ImageResponse`.
**Why it happens:** `ImageResponse` from `next/og` requires server runtime, incompatible with `output: "export"`.
**How to avoid:** Use a pre-made static PNG image file instead.
**Warning signs:** Build errors mentioning route handlers or server-side features.

### Pitfall 4: JSON-LD XSS Vulnerability
**What goes wrong:** Malicious strings in data could inject script tags via JSON-LD.
**Why it happens:** `JSON.stringify` does not escape `<` characters by default.
**How to avoid:** Always use `.replace(/</g, "\\u003c")` on the stringified JSON, as recommended by Next.js docs.
**Warning signs:** HTML tags appearing in JSON-LD output.

### Pitfall 5: Missing OG Image Dimensions
**What goes wrong:** Social platforms show distorted or cropped preview.
**Why it happens:** OG image meta tags lack width/height, so platforms guess dimensions.
**How to avoid:** Always specify `width: 1200, height: 630` in OG image metadata. Use the file convention which auto-detects dimensions.
**Warning signs:** Preview image appears stretched or cropped on LinkedIn/Twitter.

## Code Examples

### Complete Metadata Export for layout.tsx
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from "next";

const BASE_URL = "https://baotoq.github.io/resume";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "To Quoc Bao - Senior Software Engineer Resume",
  description:
    "Experienced Software Engineer with 7+ years of proven expertise in designing and building scalable, high-performance web applications.",
  keywords: [
    "software engineer",
    "senior software engineer",
    ".net core",
    "golang",
    "kubernetes",
    "microservices",
    "aws",
    "azure",
    "resume",
  ],
  authors: [{ name: "To Quoc Bao" }],
  creator: "To Quoc Bao",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "To Quoc Bao - Senior Software Engineer",
    description:
      "Senior Software Engineer specializing in scalable web applications, microservices architecture, and cloud infrastructure.",
    url: "/",
    siteName: "To Quoc Bao Resume",
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "To Quoc Bao - Senior Software Engineer",
    description:
      "Senior Software Engineer specializing in scalable web applications, microservices architecture, and cloud infrastructure.",
  },
};
```

### Complete JSON-LD Block
```typescript
// Source: https://nextjs.org/docs/app/guides/json-ld + https://schema.org/ProfilePage
import type { WithContext, ProfilePage } from "schema-dts";

const jsonLd: WithContext<ProfilePage> = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  dateModified: "2026-03-06",
  mainEntity: {
    "@type": "Person",
    name: "To Quoc Bao",
    jobTitle: "Senior Software Engineer",
    description: "Experienced Software Engineer with 7+ years...",
    email: "baotoq@outlook.com",
    telephone: "+84 708 270 396",
    url: "https://baotoq.github.io/resume",
    image: "https://baotoq.github.io/resume/opengraph-image.png",
    sameAs: [
      "https://www.linkedin.com/in/baotoq",
      "https://github.com/baotoq",
    ],
    worksFor: {
      "@type": "Organization",
      name: "CoverGo",
      url: "https://covergo.com",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Ton Duc Thang University",
    },
    knowsAbout: [
      "C#", "TypeScript", "Golang", "ASP.NET Core", "React.js",
      "Kubernetes", "Docker", "AWS", "Azure", "Microservices",
    ],
  },
};
```

### OG Image Design Specifications
```
Format: PNG
Dimensions: 1200 x 630 px
Content: Name, title, key skills, warm earth tone background matching site theme
File location: src/app/opengraph-image.png
Alt text file: src/app/opengraph-image.alt.txt
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| next-seo library | Next.js built-in Metadata API | Next.js 13.2+ | No extra dependency needed |
| Manual `<Head>` component | `metadata` export in layout/page | Next.js 13.2+ | Type-safe, automatic deduplication |
| `next/og` for all OG images | Static files for static export | Always (static export limitation) | Must pre-create OG image for static sites |
| Separate Person + ProfilePage | Combined ProfilePage with Person as mainEntity | Google 2023 | Single block is cleaner, Google prefers it |

**Deprecated/outdated:**
- `next-seo`: Unnecessary with App Router's native Metadata API
- `viewport` and `themeColor` in metadata: Moved to `generateViewport` in Next.js 14+

## Open Questions

1. **OG Image Design Tool**
   - What we know: Need a 1200x630 PNG with name, title, and matching theme colors
   - What's unclear: Whether to hand-design in Figma/similar or generate programmatically via a build script
   - Recommendation: Hand-create a static PNG since it's a one-time task and the site has a fixed identity. Can use any design tool or even a simple HTML-to-image script run once.

2. **Twitter/X Handle**
   - What we know: Twitter card metadata supports `creator` and `site` fields
   - What's unclear: Whether the owner has a Twitter/X account to include
   - Recommendation: Omit `twitter.creator` and `twitter.site` if no handle exists; the card will still display correctly with just the image and description.

## Validation Architecture

> No test framework configured. QA is `npm run lint` + `npm run build` + manual browser check per CLAUDE.md.

### Phase Requirements to Verification Map
| Req ID | Behavior | Verification Method |
|--------|----------|-------------------|
| SEO-01 | Person schema JSON-LD in page HTML | Google Rich Results Test + view page source |
| SEO-02 | ProfilePage schema JSON-LD in page HTML | Google Rich Results Test + Schema Markup Validator |
| SEO-03 | OG meta tags in page head | Facebook Sharing Debugger + view page source |
| SEO-04 | Twitter Card meta tags in page head | Twitter Card Validator + view page source |
| SEO-05 | Custom OG image loads correctly | Facebook Sharing Debugger shows image; LinkedIn share preview |
| SEO-06 | Canonical URL in page head | View page source for `<link rel="canonical">` |

### Build Verification
- `npm run lint` -- ensure no Biome errors in new/modified files
- `npm run build` -- ensure static export succeeds with metadata
- Check `out/index.html` for correct meta tags and JSON-LD script in built output

## Sources

### Primary (HIGH confidence)
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) - Official pattern for JSON-LD in App Router (v16.1.6, updated 2026-02-27)
- [Next.js generateMetadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) - Full metadata fields reference including openGraph, twitter, alternates (v16.1.6, updated 2026-02-27)
- [Next.js opengraph-image file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) - Static and generated image approaches (v16.1.6, updated 2026-02-27)
- [Google ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page) - Required/recommended properties
- [Schema.org Person](https://schema.org/Person) - Person type properties

### Secondary (MEDIUM confidence)
- [GitHub Discussion #55890](https://github.com/vercel/next.js/discussions/55890) - Confirms OG image generation incompatible with static export

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Next.js official docs verified all patterns for v16
- Architecture: HIGH - Single-page static site with known deployment URL; straightforward metadata setup
- Pitfalls: HIGH - basePath/metadataBase interaction verified against official docs; static export limitation confirmed

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (stable domain, unlikely to change)
