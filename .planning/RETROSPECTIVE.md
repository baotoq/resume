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

## Milestone: v1.2 — Tech Stack Icons + Keyword Highlights

**Shipped:** 2026-04-14
**Phases:** 2 | **Plans:** 2 | **Sessions:** 1

### What Was Built
- `TechStackIcons` Server Component — 30-entry SLUG_MAP allowlist, Devicons CDN, zinc pill fallback for unknown techs
- `HighlightedBullet` Server Component — two-pass regex split rendering `**bold**` as indigo-600 spans, `*italic*` as italic spans
- Both features wired into `WorkExperience.tsx` without conflict; render order matches spec (icons → bullets)

### What Worked
- Security-first SLUG_MAP allowlist for CSS class construction — caught potential injection risk before it landed
- Pure regex split with capturing group — no npm package needed, clean alternating segment array
- Both phases are truly independent — no integration friction at wiring time
- Parallel phase execution (worktree) worked cleanly for independent features

### What Was Inefficient
- REQUIREMENTS.md traceability stayed "Pending" again — third milestone in a row with same tracking gap
- SUMMARY.md one-liner YAML field still not parsed by gsd-tools — manually fixed MILESTONES.md accomplishments again
- Phase 5 required `npm install` fix during execution (missing node_modules in worktree) — environment setup gap

### Patterns Established
- Security: user-authored strings to CSS class names → always use allowlist, never interpolate directly
- For inline markup rendering: regex split with capturing group produces clean alternating text/token arrays; no parser library needed

### Key Lessons
1. REQUIREMENTS.md traceability "Pending" at milestone close is now a confirmed persistent pattern — accept it, verify via VERIFICATION.md instead
2. SUMMARY.md one-liner field not parsed by gsd-tools — always manually update MILESTONES.md accomplishments post-archive
3. Worktree setup needs `npm install` or node_modules symlink — add to phase setup checklist for future parallel execution

### Cost Observations
- Model mix: ~100% sonnet
- Sessions: 1
- Notable: 2 plans in 1 session, ~45 minutes total execution time — tight independent features execute fastest

---

## Milestone: v2.0 — Vercel Migration

**Shipped:** 2026-04-22
**Phases:** 2 | **Plans:** 4 | **Sessions:** 1

### What Was Built
- Stripped all GitHub Pages static-export constraints from next.config.ts; added HTTP security headers and Clearbit remotePatterns
- Replaced GitHub Actions Pages workflow with Vercel native Git integration (push to master → auto-deploy)
- Renamed NEXT_PUBLIC_EMAIL/PHONE to server-only env vars; converted LogoImage from plain `<img>` to `next/image`
- Guarded readFileSync with try/catch (WR-01); corrected LogoImage props TypeScript interface (WR-02)
- GitHub Pages disabled — baotoq.github.io/resume/ returns 404; Vercel sole deployment confirmed

### What Worked
- Vercel native Git integration: zero secrets to manage, simpler than GitHub Actions + Vercel CLI three-step
- Bundling quick wins (IMG-01, SEC-01, CFG-01) into Phase 7 — atomically removed all static-export constraints and added improvements in one plan
- Staging Phase 8 (irreversible GitHub Pages decommission) after Phase 7 verification — correct sequencing for a destructive external change
- Code review plan (08-01) before decommission plan (08-02) — fixed issues before closing out the milestone

### What Was Inefficient
- REQUIREMENTS.md traceability already complete at planning time (all [x]) — this is progress; v2.0 requirements were small and tightly scoped
- Pre-close audit surfaced a v1.2 artifact (Phase 05 VERIFICATION.md) — cross-milestone artifact leakage, acknowledged and deferred

### Patterns Established
- Irreversible external changes (decommission, delete, disable) always last in milestone sequencing — verify forward path healthy first
- next/image + remotePatterns is the correct logo pattern for Vercel deployment; plain `<img>` was a static-export workaround only
- try/catch on readFileSync in App Router page — throw Error, let Next.js error boundary handle it

### Key Lessons
1. Vercel native Git integration is simpler than GitHub Actions + Vercel CLI for standard deploy workflows — prefer it unless CI customization is needed
2. Pre-close audit may surface artifacts from previous milestones — treat cross-milestone artifacts as acknowledged-deferred, not blockers
3. Bundling migration + quick wins atomically is correct when the constraint removal unlocks all of them (removing `output: 'export'` enabled IMG-01, SEC-01, CFG-01 simultaneously)

### Cost Observations
- Model mix: ~100% sonnet
- Sessions: 1
- Notable: 2 phases, 4 plans — migration + cleanup completed in a single session; tight scope paid off

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | 2 | 3 | Baseline established |
| v1.1 | 1 | 1 | Human QA checkpoint added for visual features |
| v1.2 | 1 | 2 | Parallel worktree execution for independent features |
| v2.0 | 1 | 2 | Vercel migration; irreversible steps always last |

### Top Lessons (Verified Across Milestones)

1. REQUIREMENTS.md traceability stays "Pending" at milestone close — confirmed pattern across all milestones; use VERIFICATION.md as ground truth instead (v2.0 exception: requirements were pre-checked at planning time)
2. SUMMARY.md one-liner YAML field not parsed by gsd-tools — manually fix MILESTONES.md accomplishments after each milestone (every time)
3. Worktree parallel execution needs node_modules setup — add to checklist
4. Irreversible external changes (decommission, delete, disable) always sequence last — verify forward path healthy first (v2.0 pattern)
