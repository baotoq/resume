# Stack Research: Portfolio Website Enhancement

> Research for brownfield enhancement of Next.js resume site

## Current Stack (Keep)

| Technology | Version | Status | Notes |
|------------|---------|--------|-------|
| Next.js | 16.0.10 | ✅ Keep | Latest, excellent for static export |
| React | 19.2.1 | ✅ Keep | Latest stable |
| TypeScript | ^5 | ✅ Keep | Type safety |
| Tailwind CSS | ^4 | ✅ Keep | Latest with new config format |
| Ant Design | 6.1.1 | ⚠️ Evaluate | Heavy for icons only |

## Recommended Additions

### Dark Mode

| Option | Recommendation | Rationale |
|--------|----------------|-----------|
| **next-themes** | ✅ Recommended | De facto standard for Next.js dark mode |
| CSS variables only | Alternative | Lighter, but more manual work |
| Tailwind dark: | Built-in | Works with next-themes |

**Implementation:**
```bash
npm install next-themes
```

- Wrap app in `ThemeProvider`
- Use `dark:` Tailwind classes
- Persist to localStorage automatically
- Supports system preference detection

**Confidence:** High — next-themes has 5k+ GitHub stars, actively maintained, works perfectly with Tailwind.

### GitHub API Integration

| Approach | Recommendation | Rationale |
|----------|----------------|-----------|
| **REST API (public)** | ✅ Recommended | No auth needed for public repos |
| GraphQL API | Overkill | Requires auth token |
| Static JSON | Fallback | Manual updates, but no API limits |

**API Endpoint:**
```
GET https://api.github.com/users/{username}/repos
```

**Rate Limits:**
- Unauthenticated: 60 requests/hour
- For static site: Fetch at build time, cache in static JSON

**Recommended Pattern:**
1. Fetch repos at build time (`getStaticProps` equivalent)
2. Filter by criteria (stars > 0, not fork, specific topics)
3. Cache as static data
4. Fallback to cached JSON if API fails

**Confidence:** High — standard pattern for portfolio sites.

### Analytics

| Option | Recommendation | Rationale |
|--------|----------------|-----------|
| **Plausible** | ✅ Recommended | Privacy-friendly, simple, lightweight |
| Umami | Alternative | Self-hosted option, more control |
| Vercel Analytics | Alternative | If deploying to Vercel |

**Plausible Benefits:**
- GDPR compliant (no cookies)
- ~1KB script
- Simple dashboard
- Free tier available (or $9/mo)

**Implementation:**
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

**Confidence:** High — industry standard for privacy-friendly analytics.

### SEO & Structured Data

| Technology | Purpose |
|------------|---------|
| **next/head** or **metadata API** | Meta tags |
| **JSON-LD** | Structured data for Google |
| **next-seo** | Optional helper library |

**Schema Types for Resume:**
- `Person` — Basic info
- `ProfilePage` — The resume page itself
- `Organization` — Companies worked for (optional)

**Confidence:** High — standard SEO practices.

### Animation Library (Optional)

| Option | Recommendation | Rationale |
|--------|----------------|-----------|
| **CSS only** | ✅ Recommended | Sufficient for micro-interactions |
| Framer Motion | Alternative | If complex animations needed |
| GSAP | Overkill | Too heavy for resume site |

**Confidence:** Medium — CSS transitions sufficient for this scope.

## What NOT to Add

| Technology | Why Not |
|------------|---------|
| **Redux/Zustand** | No complex state needed |
| **tRPC/GraphQL** | Static site, no backend |
| **Prisma/Database** | Static export, no DB |
| **Authentication** | Public portfolio |
| **CMS (Contentful, etc.)** | Overengineering for single-user |

## Dependency Changes

### Remove (Consider)
- `@ant-design/icons` — Replace with Lucide React (lighter, 1KB per icon)
- `antd` — Only using icons, can replace entirely

### Add
```json
{
  "next-themes": "^0.4.4",
  "lucide-react": "^0.468.0"
}
```

**Note:** Removing Ant Design is optional. It works fine, just heavier than needed.

## Build & Deploy

| Aspect | Current | Recommendation |
|--------|---------|----------------|
| Output | Static export | ✅ Keep |
| Host | GitHub Pages | ✅ Keep |
| Base path | `/resume` | ✅ Keep |

No changes needed to deployment strategy.

---

## Summary

**Stack Changes:**
1. Add `next-themes` for dark mode
2. Add Plausible analytics script
3. Use GitHub REST API at build time
4. Add JSON-LD structured data
5. (Optional) Replace Ant Design icons with Lucide

**Confidence Level:** High — all recommendations are battle-tested patterns for portfolio sites.

