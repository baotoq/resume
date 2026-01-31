# Plan 05: Update Experience Component

---
wave: 2
depends_on: [02-PLAN]
files_modified:
  - src/components/resume/Experience.tsx
autonomous: true
---

## Objective

Update Experience component to use warm earth tones, teal accent, cleaner cards with hover lift animation.

## Tasks

<task id="5.1">
Update timeline line - use accent color

Current:
```tsx
<div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full" />
```

New:
```tsx
<div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-[var(--accent)] rounded-full" />
```
</task>

<task id="5.2">
Update timeline dot - use accent color

Current:
```tsx
<div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-3 border-white shadow-lg ring-4 ring-blue-100" />
```

New:
```tsx
<div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[var(--accent)] border-2 border-[var(--background)] shadow-md ring-4 ring-[var(--accent)]/10" />
```
</task>

<task id="5.3">
Update experience card styling - clean card with hover lift

Current:
```tsx
<div className="group p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
```

New:
```tsx
<div className="group p-6 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
```
</task>

<task id="5.4">
Update text colors for dark mode

- Title: `text-[var(--foreground)]` instead of `text-gray-900`
- Company link: `text-[var(--accent)]` instead of `text-blue-600`
- Hover: `group-hover:text-[var(--accent)]` instead of `group-hover:text-blue-600`
</task>

<task id="5.5">
Update period badge styling

Current:
```tsx
<span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
```

New:
```tsx
<span className="inline-flex items-center px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium rounded-full">
```
</task>

<task id="5.6">
Update skills tags styling

Current:
```tsx
<span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
```

New:
```tsx
<span className="px-3 py-1 bg-[var(--muted)] text-[var(--accent)] text-xs font-medium rounded-full border border-[var(--border)]">
```
</task>

<task id="5.7">
Update parseTextWithHighlights function

Update tech highlight color:

Current:
```tsx
<span key={`tech-${content}`} className="font-semibold text-blue-600">
```

New:
```tsx
<span key={`tech-${content}`} className="font-semibold text-[var(--accent)]">
```

Update bold text for dark mode:

Current:
```tsx
<strong key={`bold-${content}`} className="font-semibold text-gray-900">
```

New:
```tsx
<strong key={`bold-${content}`} className="font-semibold text-[var(--foreground)]">
```
</task>

<task id="5.8">
Update bullet point color

Current:
```tsx
<span className="text-blue-500 mt-1.5">•</span>
```

New:
```tsx
<span className="text-[var(--accent)] mt-1.5">•</span>
```
</task>

## Verification

- [ ] Timeline uses accent color
- [ ] Cards have clean styling with shadow
- [ ] Hover lift animation works (translate-y)
- [ ] All text colors support dark mode
- [ ] Skills tags use muted background
- [ ] No blue/purple colors remain

## Must-Haves (Goal-Backward)

- Clean card design with subtle shadows
- Hover lift animation
- Teal accent throughout
- Full dark mode support

---

*Plan created: 2026-01-31*

