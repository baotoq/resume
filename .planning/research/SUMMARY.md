# Research Summary: Portfolio Enhancement

> Synthesized findings for resume website enhancement project

## Key Findings

### Stack Recommendations

| Addition | Package | Confidence |
|----------|---------|------------|
| Dark Mode | `next-themes` | High |
| Analytics | Plausible (hosted) | High |
| Icons | Keep Ant Design or switch to Lucide | Medium |

**No major stack changes needed.** The existing Next.js + Tailwind setup is excellent for this project.

### Feature Priorities

**Must Build (High Impact):**
1. Dark mode with toggle
2. GitHub Projects section
3. Company logos
4. Fresh visual design

**Should Build (Medium Impact):**
5. SEO structured data (JSON-LD)
6. OG image for social sharing
7. Analytics integration
8. Accessibility improvements

**Cleanup:**
9. Remove unused assets
10. Remove dead code

### Architecture Approach

**Extend, don't restructure:**
- Add new components alongside existing
- Add theme provider layer
- Use CSS variables for theming
- Fetch GitHub data at build time (static)

### Critical Pitfalls to Avoid

| Pitfall | Prevention |
|---------|------------|
| Dark mode flash | Use `next-themes` (handles it) |
| GitHub rate limits | Build-time fetch, not runtime |
| Hydration mismatch | `suppressHydrationWarning` on html |
| Poor dark contrast | Design both themes intentionally |
| Breaking print | Test PDF after every visual change |

## Recommended Build Order

```
Phase 1: Theme Infrastructure
├── CSS variables setup
├── ThemeProvider wrapper
└── ThemeToggle component

Phase 2: Visual Refresh  
├── New color palette
├── Typography update
├── Component restyling
└── Animations

Phase 3: Company Logos
├── Source and optimize images
├── CompanyLogo component
└── Update Experience section

Phase 4: GitHub Projects
├── Build-time API fetch
├── Filtering configuration
├── Projects component
└── Integration with page

Phase 5: SEO & Social
├── JSON-LD structured data
├── OG image generation
├── Meta tags optimization

Phase 6: Analytics
├── Plausible integration
└── Verify tracking

Phase 7: Accessibility
├── Skip navigation
├── Contrast audit
├── Aria labels
└── Keyboard navigation

Phase 8: Cleanup
├── Remove unused assets
├── Remove dead code
└── Final testing
```

## Design Direction

**Fresh Aesthetic Guidelines:**

| Aspect | Recommendation |
|--------|----------------|
| **Colors** | Move away from blue/purple gradient. Consider: Emerald/teal, Warm neutrals, or Monochrome with accent |
| **Typography** | Keep Inter or try: JetBrains Mono (dev feel), Plus Jakarta Sans (modern), or Outfit (geometric) |
| **Layout** | More whitespace, cleaner sections, subtle depth |
| **Animations** | Subtle: fade-in on scroll, hover lifts, smooth transitions |

**Avoid:**
- Generic "AI slop" aesthetic
- Overused gradients
- Too many colors
- Excessive animations

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| GitHub data | Build-time fetch | No rate limits, faster load |
| Theme storage | localStorage | Persists preference |
| Analytics | Plausible (hosted) | Privacy-friendly, easy setup |
| Images | WebP, optimized | Performance |
| Icons | Keep Ant Design | Works fine, not worth migration effort |

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Dark mode bugs | Medium | Medium | Use battle-tested next-themes |
| GitHub API issues | Low | Low | Static fallback data |
| Visual regression | Medium | Medium | Test print/mobile frequently |
| Scope creep | Medium | High | Stick to defined features |

## Success Metrics

After completion, the site should:

1. ✅ Load in < 2 seconds
2. ✅ Score 90+ on Lighthouse (all categories)
3. ✅ Work perfectly in light and dark modes
4. ✅ Display GitHub projects with stats
5. ✅ Show company logos
6. ✅ Generate clean PDF
7. ✅ Have valid structured data
8. ✅ Track visits (privacy-friendly)
9. ✅ Pass WCAG 2.1 AA
10. ✅ Look distinctive (not generic)

---

## Next Steps

1. **Define Requirements** — Translate research into specific, testable requirements
2. **Create Roadmap** — Break into 8 phases based on build order
3. **Begin Phase 1** — Theme infrastructure

