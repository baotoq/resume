# Phase 11: Education Section - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-24
**Phase:** 11-education-section
**Areas discussed:** Logo display, Duration label

---

## Logo display

| Option | Description | Selected |
|--------|-------------|----------|
| Skip logo entirely | No logo column — simpler layout, just degree + institution + dates | ✓ |
| Logo if logo_url provided | Reuse LogoImage, show when set, no fallback | |
| Always show logo w/ fallback | Graduation cap SVG fallback, consistent with work entries | |

**User's choice:** Skip logo entirely
**Notes:** Senior engineer resume doesn't need a university logo.

---

## Duration label

| Option | Description | Selected |
|--------|-------------|----------|
| Skip duration | Show date range only ("Sep 2014 – Jun 2018") | ✓ |
| Show duration label | Reuse computeDuration — render "4 yrs" below date range | |

**User's choice:** Skip duration
**Notes:** Duration on a degree is rarely relevant to recruiters.

---

## Claude's Discretion

- Coursework/details field: `details?: string` added to `EducationEntry`, rendered as paragraph when present
- Card layout: simplified two-column (degree+institution left, date right), no bullets, no tech stack
- Animation delay: `0.2` (one step after WorkExperience at `0.1`)

## Deferred Ideas

None.
