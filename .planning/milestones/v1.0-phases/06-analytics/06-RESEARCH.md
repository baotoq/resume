# Phase 6: Analytics - Research

**Researched:** 2026-03-06
**Domain:** Privacy-friendly web analytics (Plausible)
**Confidence:** HIGH

## Summary

Phase 6 adds Plausible Analytics to the resume site. This is a small, well-scoped task: insert a single `<script>` tag into the page `<head>`. Plausible is cookie-free and GDPR/CCPA/PECR compliant out of the box, so no consent banner is needed (ANA-02). The script is under 1KB, loads asynchronously, and does not block rendering.

There are two integration paths for Next.js: the `next-plausible` npm package or a direct `<Script>` component from `next/script`. For this project -- a static export to GitHub Pages -- the `next-plausible` package is the better choice because it handles script injection cleanly in the App Router layout without any server-side features. The proxy feature of `next-plausible` is NOT compatible with static export, but the standard (non-proxied) script loading works perfectly.

**Primary recommendation:** Use `next-plausible` with `PlausibleProvider` in `layout.tsx`. No proxy, no custom domain -- just the hosted Plausible script pointing at `baotoq.github.io/resume`.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ANA-01 | Plausible analytics script integrated | `next-plausible` package provides `PlausibleProvider` component for App Router `layout.tsx` |
| ANA-02 | Analytics respects user privacy (no cookies) | Plausible is cookie-free by design; GDPR/CCPA/PECR compliant; no consent banner needed |
| ANA-03 | Page views tracked on site | Plausible tracks page views automatically; `next-plausible` handles SPA route changes via App Router |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next-plausible | ^3.12 | Plausible integration for Next.js | Official recommended integration; handles App Router, script injection, SPA tracking |

### Supporting
No additional libraries needed. Plausible's hosted JS is loaded from `plausible.io/js/script.js`.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| next-plausible | Raw `<Script>` from next/script | Works but requires manual setup; next-plausible handles edge cases (SPA navigation, script extensions) for free |
| next-plausible | `@plausible-analytics/tracker` NPM lib | Client-side tracker; more complex, designed for SPAs without script tag; overkill for this use case |

**Installation:**
```bash
npm install next-plausible
```

## Architecture Patterns

### Integration Point
The only file that needs modification is `src/app/layout.tsx`. The `PlausibleProvider` wraps the application inside the `<body>` tag.

### Pattern: PlausibleProvider in Root Layout
**What:** Wrap app content with `PlausibleProvider` component
**When to use:** Always -- this is the standard Next.js App Router pattern
**Example:**
```typescript
// Source: https://github.com/4lejandrito/next-plausible README
import PlausibleProvider from "next-plausible";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PlausibleProvider domain="baotoq.github.io/resume" />
      </head>
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <ThemeProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Note:** `PlausibleProvider` can be placed inside `<head>` to inject the script there, or inside `<body>` -- both work. Placing in `<head>` is Plausible's recommendation for earliest possible loading.

### Anti-Patterns to Avoid
- **Using proxy/rewrite with static export:** The `next-plausible` proxy feature requires `next start` (server mode). Static export (`output: "export"`) cannot do server-side rewrites. Do NOT configure proxy.
- **Adding `trackLocalhost` in production code:** Only enable during development if needed for testing. The default (disabled) is correct for production.
- **Conditional rendering based on environment:** `next-plausible` already respects `NODE_ENV` -- it only loads the script in production by default.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Script injection | Manual `<script>` tag or `useEffect` injection | `next-plausible` PlausibleProvider | Handles async loading, SPA navigation, script extensions properly |
| SPA page view tracking | Manual history listener | `next-plausible` automatic tracking | App Router integration is built-in |

**Key insight:** This entire phase is "install a package and add one component." There is nothing to hand-roll.

## Common Pitfalls

### Pitfall 1: Wrong Domain Value
**What goes wrong:** Plausible dashboard shows no data because `data-domain` doesn't match the registered site
**Why it happens:** Using `baotoq.github.io` instead of `baotoq.github.io/resume`, or vice versa
**How to avoid:** Register the exact domain in Plausible dashboard first, then use that same value in `PlausibleProvider domain` prop. For GitHub Pages with a path, typically register `baotoq.github.io/resume`
**Warning signs:** Script loads without errors but dashboard shows zero page views

### Pitfall 2: Script Not Loading in Development
**What goes wrong:** Developer thinks integration is broken because no script appears in dev
**Why it happens:** `next-plausible` only injects the script when `NODE_ENV=production` by default
**How to avoid:** Use `trackLocalhost` prop during testing, or test with `npm run build && npx serve out`
**Warning signs:** No network request to `plausible.io` in dev tools during `npm run dev`

### Pitfall 3: Ad Blockers Blocking the Script
**What goes wrong:** Some visitors with ad blockers won't be tracked
**Why it happens:** uBlock Origin and similar tools block requests to `plausible.io`
**How to avoid:** Accept this as a limitation. The proxy workaround is NOT available for static exports. Self-hosted Plausible on a custom domain could help but is out of scope (deferred to v2 as "Umami" in requirements)
**Warning signs:** ~20-30% lower traffic than expected

### Pitfall 4: Static Export Proxy Attempt
**What goes wrong:** Build fails or analytics silently broken
**Why it happens:** Developer tries to use `next-plausible` proxy config which requires server-side rewrites
**How to avoid:** Do NOT set `customDomain` to a proxy path. Use the standard hosted Plausible script directly
**Warning signs:** Build warnings about unsupported rewrites

## Code Examples

### Complete layout.tsx Integration
```typescript
// Source: https://github.com/4lejandrito/next-plausible + project conventions
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import PlausibleProvider from "next-plausible";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  // ... existing metadata unchanged
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PlausibleProvider domain="baotoq.github.io/resume" />
      </head>
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <ThemeProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Verification: Check Script in Production Build
```bash
npm run build
# Check the generated HTML for the Plausible script
grep -r "plausible" out/index.html
# Should find: <script ... src="https://plausible.io/js/script.js" data-domain="baotoq.github.io/resume" ...>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `plausible.js` script URL | `script.js` script URL | 2023 | New canonical URL is `plausible.io/js/script.js` |
| Pages Router `_app.js` wrapping | App Router `layout.tsx` wrapping | Next.js 13+ | PlausibleProvider goes in root layout |

**Deprecated/outdated:**
- `plausible.io/js/plausible.js` URL: Still works but `script.js` is the current canonical path

## Open Questions

1. **Plausible Account Setup**
   - What we know: The user decided on "Plausible (hosted)" per STATE.md
   - What's unclear: Whether the user already has a Plausible account and has registered `baotoq.github.io/resume` as a site
   - Recommendation: Document in the plan that the user must register the site in Plausible dashboard before or alongside the code integration. The exact domain string must match.

2. **Domain Format for GitHub Pages Subpath**
   - What we know: Site is at `baotoq.github.io/resume` (with basePath)
   - What's unclear: Whether Plausible should track `baotoq.github.io` or `baotoq.github.io/resume`
   - Recommendation: Register and use `baotoq.github.io/resume` since that's the actual site URL. Plausible supports path-based domains.

## Sources

### Primary (HIGH confidence)
- [next-plausible GitHub README](https://github.com/4lejandrito/next-plausible) - App Router setup, PlausibleProvider props, static export limitations
- [Plausible Next.js Integration Docs](https://plausible.io/docs/nextjs-integration) - Official recommendation to use next-plausible

### Secondary (MEDIUM confidence)
- [Plausible Script Docs](https://plausible.io/docs/plausible-script) - Script tag format, privacy compliance
- [Next.js Script Component Docs](https://nextjs.org/docs/app/api-reference/components/script) - afterInteractive strategy for analytics

### Tertiary (LOW confidence)
- None -- this is a well-documented, straightforward integration

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - next-plausible is the officially recommended Next.js integration
- Architecture: HIGH - single file change, well-documented pattern
- Pitfalls: HIGH - static export limitation is documented in next-plausible README

**Research date:** 2026-03-06
**Valid until:** 2026-06-06 (stable domain, unlikely to change)
