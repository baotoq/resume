# Phase 3: Company Logos - Research

**Researched:** 2026-03-06
**Domain:** Image optimization, static assets, Next.js static export
**Confidence:** HIGH

## Summary

Phase 3 adds company logos to the Experience section. The codebase is already partially prepared: the `Company` type has an optional `icon` field, and the resume data already references icon filenames (`covergo_favicon.ico`, `upmeshlive_logo.jpeg`, `aswhite_favicon.png`, `nashtech_global_logo.jpeg`). However, none of these files exist in `public/` yet, and the Experience component does not render any logo.

The implementation is straightforward: source company logos, convert to WebP format at appropriate sizes, place in `public/logos/`, update the data references, and add logo rendering (with letter-avatar fallback) to the Experience component. Since the project uses `output: "export"` with `images.unoptimized: true`, we use standard `<img>` tags (not `next/image` optimization) and rely on pre-optimized WebP files.

**Primary recommendation:** Use pre-optimized WebP files in `public/logos/`, render with standard `<img>` elements, and implement a CSS-based letter avatar fallback for missing logos.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LOGO-01 | Display company logo next to each experience entry | Experience component update, logo rendering pattern |
| LOGO-02 | Logos sourced from company websites and optimized | Manual sourcing, WebP conversion workflow |
| LOGO-03 | Logos in WebP format, max 64px display size | Image optimization approach, file size targets |
| LOGO-04 | Fallback to letter avatar if logo unavailable | CSS letter-avatar pattern, error handling |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.0.10 | Framework (static export) | Already in project |
| React | 19.2.1 | UI rendering | Already in project |
| Tailwind CSS | v4 | Styling logos and fallbacks | Already in project |

### Supporting

No additional libraries needed. This phase uses only built-in browser capabilities and existing project dependencies.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `<img>` tag | `next/image` | Project uses `unoptimized: true` for static export, so `next/image` provides no benefit and adds complexity |
| Manual WebP conversion | Sharp/build-time pipeline | Overkill for 4 static logos; manual conversion is simpler |
| Inline SVG logos | WebP raster images | Most company logos are not available as clean SVGs from official sources |

## Architecture Patterns

### Recommended Project Structure

```
public/
├── logos/
│   ├── covergo.webp         # ~2-4KB at 128x128
│   ├── upmesh.webp          # ~2-4KB at 128x128
│   ├── aswhite.webp         # ~2-4KB at 128x128
│   └── nashtech.webp        # ~2-4KB at 128x128
src/
├── components/
│   └── resume/
│       └── Experience.tsx    # Updated with logo rendering
├── data/
│   └── resume.ts            # Updated icon paths
└── types/
    └── resume.ts            # Company.icon field already exists
```

### Pattern 1: Logo with Letter Avatar Fallback

**What:** Display company logo image, falling back to a colored letter avatar if the image fails to load or is not specified.
**When to use:** Every experience entry.
**Example:**

```tsx
function CompanyLogo({ company }: { company: Company }) {
  const [imgError, setImgError] = useState(false);
  const initial = company.name.charAt(0).toUpperCase();

  if (!company.icon || imgError) {
    return (
      <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-lg font-bold shrink-0">
        {initial}
      </div>
    );
  }

  return (
    <img
      src={`${basePath}/logos/${company.icon}`}
      alt={`${company.name} logo`}
      width={48}
      height={48}
      className="w-12 h-12 rounded-xl object-contain shrink-0"
      onError={() => setImgError(true)}
    />
  );
}
```

### Pattern 2: basePath-Aware Image Sources

**What:** Since the project uses `basePath: "/resume"` in production, image `src` attributes must be prefixed correctly.
**When to use:** All static image references.
**Example:**

```tsx
// Option A: Use a constant derived from next.config.ts
const basePath = process.env.NODE_ENV === "production" ? "/resume" : "";

// Option B: Use Next.js built-in (preferred if available in static export)
// Import from next.config or use env variable
```

**Note:** The simplest approach is to keep logos in `public/logos/` and reference them as `/logos/filename.webp`. Next.js static export with `basePath` automatically rewrites asset paths from `public/`. However, for dynamic `<img>` tags (not handled by Next.js asset pipeline), we need to manually prepend the basePath. Check if the project already handles this pattern.

### Pattern 3: Print-Friendly Logos

**What:** Ensure logos render properly in print/PDF output.
**When to use:** Print CSS considerations.
**Example:**

```css
@media print {
  /* Ensure logos print */
  img {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

### Anti-Patterns to Avoid

- **External logo URLs at runtime:** Do NOT fetch logos from company websites at render time. This creates CORS issues, loading delays, and broken images when sites change. Use local pre-optimized copies.
- **Base64 inline images:** Bloats the HTML/JS bundle. Use file-based assets.
- **SVG logo scraping:** Company logos from websites are often complex SVGs with embedded fonts/styles that break when extracted. Use raster WebP instead.
- **Over-engineering a logo service:** This is 4 static images. No CDN, no lazy-loading library, no image optimization pipeline needed.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image format conversion | Custom build script | `cwebp` CLI or online converter | One-time task for 4 images |
| Letter avatar generation | Canvas-based renderer | CSS div with initial letter | Pure CSS is simpler, works in print |
| Image error detection | Custom fetch/probe | `<img onError>` handler | Browser-native, reliable |

**Key insight:** This is a tiny, static set of images. Keep the solution proportional to the problem.

## Common Pitfalls

### Pitfall 1: basePath Not Applied to Dynamic Images

**What goes wrong:** Logos work in dev (`localhost:3000`) but break on GitHub Pages (`/resume/` prefix missing).
**Why it happens:** Next.js `basePath` only auto-applies to `<Link>` and `next/image`, not plain `<img>` tags.
**How to avoid:** Either use a constant for basePath prefix, or use `next/image` (though it adds complexity with static export).
**Warning signs:** Images load in dev but 404 on production deployment.

### Pitfall 2: Logo Aspect Ratio Distortion

**What goes wrong:** Logos appear stretched or squished because they have different aspect ratios.
**Why it happens:** Setting both `width` and `height` on non-square logos.
**How to avoid:** Use `object-contain` CSS and a fixed container size. Logos fit within the box maintaining their aspect ratio.
**Warning signs:** Visual inspection shows distorted company branding.

### Pitfall 3: Dark Mode Logo Visibility

**What goes wrong:** Logos with transparent backgrounds disappear or look bad on dark backgrounds.
**Why it happens:** Many company logos assume a white background.
**How to avoid:** Either: (a) use logos with colored backgrounds, (b) add a subtle background/border to the logo container, or (c) provide dark-mode variants. Option (b) is simplest: a rounded container with `bg-[var(--card)]` or `bg-[var(--muted)]` ensures contrast in both modes.
**Warning signs:** Logo invisible or ugly in one theme.

### Pitfall 4: Print Layout Shift

**What goes wrong:** Adding logos to experience entries changes the layout width, breaking the print/PDF format.
**Why it happens:** Logo takes space in the card header, pushing content.
**How to avoid:** Keep logos small (48px), use flexbox layout that gracefully adapts, test print output after adding logos.
**Warning signs:** PDF export shows different layout than expected.

## Code Examples

### Image Optimization Workflow (One-Time)

```bash
# Using cwebp (from libwebp package)
# Install: brew install webp (macOS)

# Convert to WebP, 128x128, quality 80
cwebp -resize 128 128 input.png -o output.webp -q 80

# Or using ImageMagick + cwebp
convert input.jpeg -resize 128x128 -background white -gravity center -extent 128x128 temp.png
cwebp temp.png -o output.webp -q 80
```

### Updated Company Type (Already Exists)

```typescript
// src/types/resume.ts - Company.icon already optional
export interface Company {
  name: string;
  url: string;
  icon?: string;  // filename in public/logos/
}
```

### Experience Header with Logo

```tsx
// In Experience.tsx, update the header row
<div className="flex gap-4">
  <CompanyLogo company={item.company} />
  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 flex-1">
    {/* existing header content */}
  </div>
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| ICO/PNG favicons | WebP with fallback | ~2020+ | 25-35% smaller files, universal browser support |
| `next/image` for all | Plain `<img>` for static export | Always for static | `next/image` optimization doesn't work with `output: "export"` |
| External CDN logos | Local optimized copies | Best practice | No runtime dependencies, faster loads |

**Browser support for WebP:** Universal in all modern browsers (Chrome, Firefox, Safari 14+, Edge). No fallback format needed.

## Open Questions

1. **Logo sourcing approach**
   - What we know: Need logos for CoverGo, Upmesh, AS White Global, NashTech
   - What's unclear: Whether to download from company websites manually or use a logo API
   - Recommendation: Manual download from official websites, then convert to WebP. For 4 logos, automation is unnecessary.

2. **basePath handling pattern**
   - What we know: Production uses `/resume` basePath, dev uses empty string
   - What's unclear: Whether there's an existing utility for this in the project
   - Recommendation: Create a simple `getBasePath()` utility or use `process.env.__NEXT_ROUTER_BASEPATH` if available. Alternatively, since the `icon` field in data already has filenames, update them to include the full path relative to public root.

## Sources

### Primary (HIGH confidence)
- Project codebase analysis: `src/types/resume.ts`, `src/data/resume.ts`, `src/components/resume/Experience.tsx`
- `next.config.ts` - static export config with basePath
- Next.js documentation - static export behavior with basePath and images

### Secondary (MEDIUM confidence)
- WebP browser support - caniuse.com (universal modern browser support confirmed)
- WebP compression characteristics - Google WebP documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies needed, existing codebase already partially prepared
- Architecture: HIGH - straightforward img + fallback pattern, well-understood
- Pitfalls: HIGH - basePath issue is the main gotcha, well-documented in Next.js ecosystem

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (stable domain, no fast-moving dependencies)
