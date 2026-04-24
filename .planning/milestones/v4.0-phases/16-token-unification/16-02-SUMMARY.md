# Phase 16-02 Summary — WorkExperience token swap

**Status:** Complete
**Commit:** feat(16-02): swap WorkExperience raw colors to shadcn tokens (TOKEN-01)

## Lines changed (src/components/WorkExperience.tsx)

| Line | Before | After |
|---|---|---|
| 30 | `text-zinc-900` | `text-foreground` |
| 38 | `bg-zinc-200` | `bg-border` |
| 51 | `bg-blue-600` (current dot) | `bg-primary` |
| 52 | `border-zinc-300 bg-white` (inactive dot) | `border-border bg-background` |
| 65 | `text-blue-600` (role title) | `text-primary` |
| 72 | `text-zinc-900` (company name) | `text-foreground` |
| 77 | `text-zinc-500` (date range) | `text-muted-foreground` |
| 80 | `text-zinc-400` (duration) | `text-muted-foreground` |
| 94 | `text-zinc-700` + `before:bg-zinc-300` (bullet `<li>`) | `text-foreground` + `before:bg-border` |

Timeline geometry untouched (`absolute left-0.75 sm:left-1.75 top-7`, `top-5.5 w-3 h-3 rounded-full`, `before:content-['']` pseudo-element). `isCurrent` ternary preserved. No imports added.

## Verification
- `rg` for raw colors → no matches ✓
- Build + lint pass (gated by plan 16-05)
