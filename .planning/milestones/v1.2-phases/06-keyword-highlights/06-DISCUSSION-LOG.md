# Phase 6: Keyword Highlights - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-14
**Phase:** 06-keyword-highlights
**Areas discussed:** Bold text style, Parsing scope, Component structure

---

## Bold Text Style

| Option | Description | Selected |
|--------|-------------|----------|
| Color only | indigo-600 text, same font weight as surrounding text | ✓ |
| Color + bold weight | indigo-600 text AND font-semibold/font-bold | |

**User's choice:** Color only
**Notes:** Subtle accent — keywords pop without feeling heavy.

---

## Parsing Scope

| Option | Description | Selected |
|--------|-------------|----------|
| **bold** only | Only parse **text** → indigo-600 span. Other syntax passed through as literal. | |
| bold + italic | Parse **bold** → indigo-600 and *italic* → italic style. No links. | ✓ |
| You decide | Claude picks simplest safe approach. | |

**User's choice:** bold + italic
**Notes:** Still no links — keeps it safe for static page.

---

## Component Structure

| Option | Description | Selected |
|--------|-------------|----------|
| New HighlightedBullet.tsx | Focused Server Component, follows TechStackIcons.tsx pattern | ✓ |
| Inline helper in WorkExperience.tsx | parseMarkdown() function inside WorkExperience.tsx | |

**User's choice:** New HighlightedBullet.tsx
**Notes:** WorkExperience.tsx stays clean; parsing logic isolated and easy to adjust.
