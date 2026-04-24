# Requirements: Resume / CV Page

**Defined:** 2026-04-23
**Core Value:** A recruiter or engineer can open the link, immediately understand who you are and what you've built — all without friction.

---

## v4.0 Requirements (Shipped)

Archived: `.planning/milestones/v4.0-REQUIREMENTS.md` — all 9 satisfied (2026-04-24).

---

## v3.0 Requirements (Shipped)

Archived: `.planning/milestones/v3.0-REQUIREMENTS.md` — BIO/DUR/EDU (8/8) satisfied; TYP-01..04 superseded by v4.0 TOKEN-01/02 (2026-04-24).

---

## Future Requirements

### Dark/Light Mode

- **THEME-01**: User can toggle between dark and light theme
- **THEME-02**: Theme preference persists across sessions
- **THEME-03**: System color scheme detected on first load

### PDF Export

- **PDF-01**: User can download a clean, print-ready PDF of the resume

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Dark/light mode toggle | Deferred — complex state management, not blocking recruiter use |
| PDF export | Deferred — Puppeteer exceeds Vercel Lambda size limit; needs research |
| Projects section | Not requested |
| Education section GPA/honors | Not needed for senior engineer resume |
| Education timeline rail | Single entry — rail adds visual noise without benefit |
| Animated bio text | Distracting, signals student project |
| Markdown rendering in bio | Plain prose is sufficient; avoid added complexity |
| Real-time "Present" duration | Static build-time computation accepted; simpler, no client JS |

---

## Traceability

Shipped milestone traceability archived:
- v3.0 — `.planning/milestones/v3.0-REQUIREMENTS.md`
- v4.0 — `.planning/milestones/v4.0-REQUIREMENTS.md`

No active requirements. Next milestone requirements will be defined via `/gsd-new-milestone`.

---
*Requirements defined: 2026-04-23*
*Last updated: 2026-04-24 after v3.0 + v4.0 milestones archived*
