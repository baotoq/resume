# Phase 7: Vercel Setup & Config Migration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-22
**Phase:** 07-vercel-setup-config-migration
**Areas discussed:** Logo image source, Vercel project status

---

## Logo image source

| Option | Description | Selected |
|--------|-------------|----------|
| Clearbit Logo API | Change logo_url to https://logo.clearbit.com/<domain> format. Zero-effort, auto-generates from domain. Add logo.clearbit.com to remotePatterns. | ✓ |
| Manual URLs | User provides specific image file URLs per company. More control, more work. | |
| Defer — keep plain <img> | Skip IMG-01 in this phase. Leave unoptimized <img> tags. | |

**User's choice:** Clearbit Logo API
**Notes:** logo_url values covergo.com, upmesh.io, nashtech.com will be converted to Clearbit format. '#' placeholder stays as-is — briefcase fallback handles it.

---

## '#' placeholder logo_url

| Option | Description | Selected |
|--------|-------------|----------|
| Another real company — provide domain | Convert to Clearbit format | |
| Keep '#' as-is | Briefcase fallback renders — no logo | ✓ |
| You decide | Claude discretion | |

**User's choice:** Keep '#' as-is
**Notes:** LogoImage.tsx briefcase fallback already handles '#' correctly.

---

## Vercel project status

| Option | Description | Selected |
|--------|-------------|----------|
| Not yet — plan should include setup steps | Plan includes: vercel link, extract IDs, add 3 GitHub secrets, disable Git Integration auto-deploy | ✓ |
| Already created and linked | Project exists, skip vercel link step | |
| Already fully set up | Project + secrets + Git Integration disabled | |

**User's choice:** Not yet — plan should include full setup steps
**Notes:** Plan must cover the manual prerequisites before the first push triggers a deploy.

---

## Claude's Discretion

- Wave grouping strategy (researcher recommends two waves)
- Order of remotePatterns entries
- Whether to clean up stale `out/` directory

## Deferred Ideas

- GitHub Pages decommission — Phase 8
- Custom domain — out of scope
