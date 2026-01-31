# Features Research: Portfolio Website

> What features do modern developer portfolio sites have?

## Table Stakes (Must Have)

These are expected by recruiters and hiring managers:

| Feature | Current State | Priority |
|---------|---------------|----------|
| **Professional summary** | ✅ Exists | — |
| **Work experience timeline** | ✅ Exists | — |
| **Skills/technologies list** | ✅ Exists | — |
| **Education** | ✅ Exists | — |
| **Contact information** | ✅ Exists | — |
| **PDF export/download** | ✅ Exists | — |
| **Mobile responsive** | ✅ Exists | — |
| **Fast load time** | ✅ Exists | — |

**Current site has all table stakes covered.**

## Differentiators (Competitive Advantage)

These make a portfolio stand out:

### High Impact

| Feature | Description | Complexity |
|---------|-------------|------------|
| **GitHub Projects** | Live repos with stats | Medium |
| **Company Logos** | Visual credibility | Low |
| **Dark Mode** | User preference, modern feel | Medium |
| **Distinctive Design** | Not generic template | High |
| **Smooth Animations** | Page load, hover states | Low-Medium |

### Medium Impact

| Feature | Description | Complexity |
|---------|-------------|------------|
| **SEO Structured Data** | Better Google appearance | Low |
| **OG Image** | Social sharing preview | Medium |
| **Analytics** | Track engagement | Low |
| **Accessibility** | WCAG compliance | Medium |
| **Print optimization** | Clean PDF output | ✅ Exists |

### Lower Impact (Nice to Have)

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Blog/Writing** | Thought leadership | High (out of scope) |
| **Testimonials** | Social proof | Medium |
| **Certifications** | Credentials | Low |
| **Language toggle** | i18n | High (out of scope) |
| **Contact form** | Direct messages | Medium (out of scope) |

## Anti-Features (Deliberately NOT Build)

| Feature | Why Not |
|---------|---------|
| **Flashy 3D animations** | Distracting, slow, unprofessional |
| **Background music** | Annoying, accessibility issue |
| **Chatbot** | Overkill for resume |
| **Login/accounts** | Unnecessary complexity |
| **Comments section** | Not relevant for resume |
| **Multi-page navigation** | Single page is better for resumes |
| **Excessive parallax** | Can cause motion sickness |

## Feature Dependencies

```
Dark Mode ──────────────────┐
                            │
Company Logos ──────────────┼──► Visual Refresh
                            │    (depends on all visual features)
Animations ─────────────────┘

GitHub Projects ────────────────► SEO (projects in structured data)

Analytics ──────────────────────► (independent)

Accessibility ──────────────────► (should be done alongside visual refresh)
```

## Recommended Feature Priority

### Phase 1: Foundation
1. Dark mode infrastructure (CSS variables, theme toggle)
2. Fresh color palette and typography

### Phase 2: Content
3. GitHub Projects section
4. Company logos

### Phase 3: Polish
5. Animations and micro-interactions
6. SEO structured data
7. OG image generation

### Phase 4: Operations
8. Analytics integration
9. Accessibility audit and fixes
10. Cleanup unused code/assets

## Feature Specifications

### GitHub Projects Section

**Display:**
- Project name (link to repo)
- Description (from GitHub)
- Primary language (with color dot)
- Stars count
- Forks count
- Last updated date

**Filtering Options:**
- Minimum stars threshold
- Exclude forks
- Include only repos with specific topics
- Manual include/exclude list

**Layout:**
- Card grid (2-3 columns on desktop)
- Responsive (1 column on mobile)

### Dark Mode

**Behavior:**
- Light theme default
- Toggle button in header
- Persist preference in localStorage
- Respect system preference on first visit (optional)

**Colors:**
- Define semantic color tokens (background, foreground, accent, muted)
- Both light and dark values for each token

### Company Logos

**Display:**
- Small logo (24-32px) next to company name
- Fallback to first letter if logo unavailable
- Grayscale or muted color (not distracting)

**Sourcing:**
- Download from company websites
- Optimize (WebP, small size)
- Store in `/public/logos/`

---

## Summary

**In Scope for v1:**
- GitHub Projects (with filtering and stats)
- Company logos
- Dark mode (light default, toggle)
- Visual refresh (fresh aesthetic)
- SEO structured data + OG image
- Analytics (Plausible)
- Accessibility improvements
- Code cleanup

**Out of Scope:**
- Blog
- Contact form
- Multi-language
- Testimonials
- Certifications

