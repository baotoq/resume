# Phase 8: Decommission GitHub Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-22
**Phase:** 08-decommission-github-pages
**Areas discussed:** Artifact cleanup, Code review fixes

---

## Artifact Cleanup

| Option | Description | Selected |
|--------|-------------|----------|
| Remove `.nojekyll` only | Minimal cleanup | |
| Remove all Pages artifacts | `.nojekyll` + verify no other remnants | ✓ |

**User's choice:** "all" — remove all Pages artifacts  
**Notes:** No `gh-pages` branch found. `deploy.yml` already deleted in commit `6568623`.

---

## Code Review Fixes

| Option | Description | Selected |
|--------|-------------|----------|
| Fix WR-01 + WR-02 only (blocking warnings) | Fix type error and crash risk | |
| Fix all (WR-01, WR-02, WR-03, IN-01) | Full code review remediation | |
| Bundle into Phase 8 with decommission | All cleanup in one atomic phase | ✓ |

**User's choice:** "all" — bundle all cleanup including code review fixes  
**Notes:** WR-03 deferred (requires real logo URL, content decision). IN-01 (CSP) deferred as separate security work.

---

## Claude's Discretion

- Error boundary approach for WR-01 — try/catch pattern in page.tsx, Claude decides implementation details

## Deferred Ideas

- Content-Security-Policy header (IN-01) — future security hardening
- AS White Global real logo URL (WR-03) — content decision, not code fix
