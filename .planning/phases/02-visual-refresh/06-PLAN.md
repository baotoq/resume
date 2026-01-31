# Plan 06: Update Summary, Education, and Skills Components

---
wave: 2
depends_on: [02-PLAN]
files_modified:
  - src/components/resume/Summary.tsx
  - src/components/resume/Education.tsx
  - src/components/resume/Skills.tsx
autonomous: true
---

## Objective

Update remaining components to use warm earth tones and teal accent.

## Tasks

<task id="6.1">
Update `src/components/resume/Summary.tsx`

Current:
```tsx
<div className="relative p-5 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl border border-gray-100">
  <div className="absolute top-3 left-4 text-6xl text-blue-200 font-serif leading-none select-none">"</div>
  <p className="text-gray-700 leading-relaxed pl-8 pr-4 italic">{summary}</p>
  <div className="absolute bottom-1 right-4 text-6xl text-purple-200 font-serif leading-none rotate-180 select-none">"</div>
</div>
```

New:
```tsx
<div className="relative p-6 bg-[var(--muted)] rounded-2xl border border-[var(--border)]">
  <div className="absolute top-3 left-4 text-6xl text-[var(--accent)]/20 font-serif leading-none select-none">"</div>
  <p className="text-[var(--muted-foreground)] leading-relaxed pl-8 pr-4 italic">{summary}</p>
  <div className="absolute bottom-1 right-4 text-6xl text-[var(--accent)]/20 font-serif leading-none rotate-180 select-none">"</div>
</div>
```
</task>

<task id="6.2">
Update `src/components/resume/Education.tsx`

Update card styling:

Current:
```tsx
<div className="group p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300">
```

New:
```tsx
<div className="group p-6 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
```

Update text colors:
- Degree title: `text-[var(--foreground)]` and `group-hover:text-[var(--accent)]`
- School name: `text-[var(--accent)]`
- Period badge: `bg-[var(--accent)]/10 text-[var(--accent)]` instead of purple
- Details: `text-[var(--muted-foreground)]`
</task>

<task id="6.3">
Update `src/components/resume/Skills.tsx`

Simplify to unified accent-based styling:

Remove categoryColors object and getColors function.

Update category card:
```tsx
<div className="p-5 rounded-2xl bg-[var(--muted)] border border-[var(--border)]">
  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
    {category.title}
  </h3>
  <div className="flex flex-wrap gap-2">
    {category.skills.map((skill) => (
      <span
        key={skill}
        className="px-3 py-1.5 bg-[var(--card)] text-[var(--foreground)] text-xs font-medium rounded-lg border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--accent)]/50 transition-all duration-200"
      >
        {skill}
      </span>
    ))}
  </div>
</div>
```
</task>

## Verification

- [ ] Summary uses muted background, accent quote marks
- [ ] Education cards have clean styling with hover lift
- [ ] Skills section uses unified accent styling
- [ ] Category-specific colors removed
- [ ] All components support dark mode
- [ ] No blue/purple colors remain

## Must-Haves (Goal-Backward)

- Consistent warm earth tone palette
- Clean card designs
- Teal accent throughout
- Full dark mode support

---

*Plan created: 2026-01-31*

