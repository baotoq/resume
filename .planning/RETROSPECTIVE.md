# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Resume Enhancement

**Shipped:** 2026-03-06
**Phases:** 9 | **Plans:** 21

### What Was Built
- Dark/light theme system with smooth transitions and system preference detection
- Complete visual refresh — Plus Jakarta Sans, warm earth tones, teal accents, subtle animations
- Company logos with letter avatar fallbacks on experience entries
- SEO optimization — JSON-LD structured data, OG/Twitter meta tags, custom OG image
- Privacy-friendly Plausible analytics (cookie-free)
- Full accessibility — skip nav, focus indicators, aria-labels, WCAG AA contrast
- Contact info privacy — hidden on web, visible in PDF print only
- Codebase cleanup — removed dead GitHub Projects feature, unused assets, stale CSS

### What Worked
- Auto-advance pipeline executed phases 6-8 in a single session efficiently
- Research → Plan → Verify → Execute loop caught real issues (OG image double-prefix bug)
- Small phases (6: Analytics, 8: Cleanup) completed in single plans with minimal overhead
- Integration checker confirmed all cross-phase wiring at milestone audit

### What Was Inefficient
- GitHub Projects (Phase 4) was fully implemented then removed in Phase 8 — 10 requirements worth of work discarded
- Phase 5 VERIFICATION.md stayed stale after OG image fix — required manual cleanup
- Phase 7 accessibility human verification items auto-approved without actual testing
- Early phases (1-3) lack VALIDATION.md — Nyquist compliance gap

### Patterns Established
- `public/` placement for OG images avoids Next.js basePath double-prefix issues
- `.print-only` CSS class pattern for web-hidden, print-visible content
- Named exports only, `"use client"` only where needed (project conventions)

### Key Lessons
1. Hardcoded feature flags (`showProjects = false`) should be removed early — don't implement disabled features
2. Verification status should be re-checked when bugs are fixed post-verification
3. Auto-approve for human verification items saves time but creates testing debt

### Cost Observations
- Model mix: ~70% opus (executor, planner, researcher), ~30% sonnet (checker, verifier)
- Phases 6-8 executed via auto-advance in one continuous session
- Notable: Single-plan phases (6, 8) are most efficient — minimal orchestration overhead

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 9 | 21 | Initial milestone — established GSD workflow |

### Top Lessons (Verified Across Milestones)

1. Keep phases small and focused — single-plan phases execute fastest
2. Research phase catches integration issues early (OG image, Biome config)
