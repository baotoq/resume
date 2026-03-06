# Plan 03: Update Section Component

---
wave: 2
depends_on: [02-PLAN]
files_modified:
  - src/components/resume/Section.tsx
autonomous: true
---

## Objective

Update the Section component to use teal accent instead of blue/purple gradient.

## Tasks

<task id="3.1">
Update `src/components/resume/Section.tsx`

Replace gradient icon container with solid accent:

Current:
```tsx
<span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg shadow-lg shadow-blue-500/25">
```

New:
```tsx
<span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] text-lg shadow-lg shadow-[var(--accent)]/25">
```

Replace gradient underline with solid accent:

Current:
```tsx
<div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1" />
```

New:
```tsx
<div className="h-1 w-16 bg-[var(--accent)] rounded-full mt-1" />
```

Update title color for dark mode support:

Current:
```tsx
<h2 className="text-xl font-bold text-gray-900 tracking-tight">
```

New:
```tsx
<h2 className="text-xl font-bold text-[var(--foreground)] tracking-tight">
```
</task>

## Verification

- [ ] Icon container uses accent color (teal)
- [ ] Underline uses accent color
- [ ] No blue/purple gradients remain
- [ ] Title text uses foreground variable
- [ ] Works in both light and dark modes

## Must-Haves (Goal-Backward)

- Blue/purple gradients removed
- Teal accent applied
- Dark mode compatible

---

*Plan created: 2026-01-31*

