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

## Milestone: v1.1 — Visual Polish

**Shipped:** 2026-04-13
**Phases:** 1 | **Plans:** 2 | **Sessions:** 1

### What Was Built
- `LogoImage` client component — 40×40 company logo with inline-SVG briefcase fallback, `onError` error tracking
- Vertical timeline rail — single continuous line through all work entries, filled indigo dot (current) / hollow dot (past)
- Human visual QA checkpoint with fix loop before phase sign-off

### What Worked
- Client/server component split held cleanly: `LogoImage` gets `'use client'` for `onError`+`useState`; `WorkExperience` stays a Server Component
- Inline SVG for the one fallback icon — no bundle cost, no routing issues from basePath
- Human QA checkpoint (plan 04-02) caught real visual bugs before milestone close

### What Was Inefficient
- Per-entry `!isLast` line segments was the wrong approach from the start — last card had no line, and centering was off; a single rail-container element is simpler and correct
- SUMMARY.md one-liner YAML format still not picked up by gsd-tools — required manual fix in MILESTONES.md again (same issue as v1.0)
- REQUIREMENTS.md traceability stayed "Pending" throughout — same pattern as v1.0, still not updating during execution

### Patterns Established
- Single continuous absolute timeline line in the rail container > per-entry segments: avoids `!isLast` edge cases and centering math per entry
- Always include a human QA checkpoint plan for visual features — catches pixel-level issues automated checks miss

### Key Lessons
1. For timeline/rail UIs: position one continuous element in the parent container rather than segments in each child — cleaner, no edge-case gaps
2. Plain `<img>` over `next/image` for external URLs in static export — next/image silently 404s with no console error
3. REQUIREMENTS.md traceability still being left as "Pending" at milestone close — need to update during plan execution

### Cost Observations
- Model mix: ~100% sonnet
- Sessions: 1
- Notable: 1 phase, 2 plans — small milestone executed in a single session with one visual fix loop

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | 2 | 3 | Baseline established |
| v1.1 | 1 | 1 | Human QA checkpoint added for visual features |

### Top Lessons (Verified Across Milestones)

1. Keep REQUIREMENTS.md traceability updated during execution, not just at milestone close — happened in both v1.0 and v1.1
2. SUMMARY.md one-liner YAML field not parsed by gsd-tools — manually fix MILESTONES.md accomplishments after each milestone
