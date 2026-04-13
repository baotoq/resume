# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-04-13
**Phases:** 3 | **Plans:** 4 | **Sessions:** 2

### What Was Built
- gray-matter YAML frontmatter data layer with typed ResumeData interfaces in a Next.js 16 Server Component
- Header, WorkExperience, Skills Server Components with zinc-50/indigo-600 design palette
- framer-motion AnimateIn client wrapper with whileInView stagger scroll animations
- Next.js static export + GitHub Actions OIDC two-job CI/CD pipeline to GitHub Pages

### What Worked
- AnimateIn client-wrapper pattern kept all section components as pure Server Components — clean client/server boundary
- YAML frontmatter in a .md file for resume data: simple, no DB, easy to edit
- Two-job GitHub Actions workflow (build + deploy) with OIDC: no stored secrets, minimal permissions
- Plans were precise enough that each executed with zero deviations

### What Was Inefficient
- REQUIREMENTS.md traceability table was never updated during execution — all rows stayed "Pending" at milestone close
- SUMMARY.md one-liner fields weren't picked up by gsd-tools (format mismatch) — required manual fix in MILESTONES.md
- Resume data left as placeholder — user still needs to populate `src/data/resume.md` with real content before sharing

### Patterns Established
- Client wrapper pattern for Framer Motion: thin `'use client'` wrapper, all section components stay as Server Components
- YAML frontmatter in `src/data/resume.md` as the single source of truth for resume content
- OIDC-only GitHub Actions deploy: no secrets stored, `id-token:write` permission + `actions/configure-pages`

### Key Lessons
1. Update REQUIREMENTS.md traceability table at each plan completion — don't leave it for milestone close
2. Populate real resume data early — placeholder data makes visual verification less meaningful
3. The `cancel-in-progress: false` concurrency setting is critical for deploy workflows to prevent partial publishes

### Cost Observations
- Model mix: ~100% sonnet
- Sessions: 2
- Notable: 4 plans with zero deviations — tight planning paid off

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | 2 | 3 | Baseline established |

### Top Lessons (Verified Across Milestones)

1. Keep REQUIREMENTS.md traceability updated during execution, not just at milestone close
