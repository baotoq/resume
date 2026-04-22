# Phase 8: Decommission GitHub Pages - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Remove GitHub Pages as a deployment target. Clean up all Pages-related artifacts from the repo. Fix the three code review warnings from Phase 7. Vercel becomes the sole live deployment.

</domain>

<decisions>
## Implementation Decisions

### GitHub Pages Decommission
- **D-01:** Set GitHub Pages source to "None" in GitHub repo Settings → Pages. This is a manual step (human checkpoint).
- **D-02:** Verify old GitHub Pages URL returns 404 after disabling. Manual verification step.

### Artifact Cleanup
- **D-03:** Delete `public/.nojekyll` — Pages-specific file with no purpose on Vercel. Commit the deletion.
- **D-04:** No `gh-pages` branch exists — no branch cleanup needed.
- **D-05:** `deploy.yml` already deleted in commit `6568623` — no workflow cleanup needed.

### Code Review Fixes (from Phase 7 REVIEW.md — WR-01, WR-02)
- **D-06:** Fix WR-01 — wrap `fs.readFileSync` in `src/app/page.tsx` with try/catch. Throw to nearest error boundary on failure.
- **D-07:** Fix WR-02 — change `LogoImage` props interface from `React.ButtonHTMLAttributes<HTMLDivElement>` to `React.HTMLAttributes<HTMLDivElement>`.
- **D-08:** WR-03 (`logo_url: "#"` for AS White Global) — leave unchanged. The briefcase fallback handles it correctly; fixing requires a real logo URL which is a content decision, not a code fix.
- **D-09:** IN-01 (Content-Security-Policy header) — defer to future. Not blocking; scope creep for this phase.

### Claude's Discretion
- Error boundary approach for WR-01 fix — use standard Next.js error.tsx pattern or a simple try/catch that returns a fallback UI. Claude decides best approach for the app's current structure.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 7 outputs
- `.planning/phases/07-vercel-setup-config-migration/07-REVIEW.md` — Code review findings WR-01, WR-02 to fix in this phase
- `.planning/phases/07-vercel-setup-config-migration/07-01-SUMMARY.md` — What Phase 7 changed

### Source files to modify
- `src/app/page.tsx` — WR-01 fix (readFileSync try/catch)
- `src/components/LogoImage.tsx` — WR-02 fix (HTMLAttributes)
- `public/.nojekyll` — delete this file

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/error.tsx` — check if exists; if so, readFileSync error can throw to it
- `src/components/LogoImage.tsx` — props interface line 6 is the only change needed

### Established Patterns
- Next.js App Router error boundary: `error.tsx` co-located with `page.tsx`
- Server Component data loading: `page.tsx` uses synchronous readFileSync (no async pattern established)

### Integration Points
- `page.tsx` → `resume.md` file read — failure case needs graceful handling
- `LogoImage` is used in `WorkExperience.tsx` — type fix is non-breaking

</code_context>

<specifics>
## Specific Ideas

- User confirmed "all" when asked about cleanup scope — full decommission including artifact removal and code review fixes.

</specifics>

<deferred>
## Deferred Ideas

- **IN-01 (CSP header)** — Content-Security-Policy not added. Deferred — separate security hardening effort.
- **WR-03 (AS White Global logo)** — Requires real logo URL; content decision, not a code fix.
- **Custom domain** — Out of scope per REQUIREMENTS.md.

</deferred>

---

*Phase: 08-decommission-github-pages*
*Context gathered: 2026-04-22*
