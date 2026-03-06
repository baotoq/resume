# Plan 07: Update Page Background and Layout

---
wave: 3
depends_on: [01-PLAN, 02-PLAN]
files_modified:
  - src/app/page.tsx
autonomous: true
---

## Objective

Update the main page background, remove decorative blobs, and apply cleaner layout with increased spacing.

## Tasks

<task id="7.1">
Update page background - remove gradients and decorative elements

Current:
```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 py-10 px-4 sm:px-6 lg:px-8">
  {/* Decorative background elements */}
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
  </div>
```

New:
```tsx
<div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
```

Remove the decorative background elements entirely.
</task>

<task id="7.2">
Update resume container styling

Current:
```tsx
<div
  ref={resumeRef}
  className="relative max-w-4xl mx-auto bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl px-8 py-10 sm:px-12 sm:py-12 border border-white/50 flex flex-col gap-8"
  id="resume-content"
>
```

New:
```tsx
<div
  ref={resumeRef}
  className="relative max-w-4xl mx-auto bg-[var(--card)] shadow-xl rounded-2xl px-8 py-10 sm:px-12 sm:py-12 border border-[var(--border)] flex flex-col gap-12"
  id="resume-content"
>
```

Key changes:
- Use card background variable
- Remove backdrop-blur (no longer needed)
- Reduce shadow from 2xl to xl
- Increase section gap from gap-8 to gap-12
- Use border variable
</task>

<task id="7.3">
Add subtle page load animation (optional)

Add fade-in class to container:
```tsx
<div
  ref={resumeRef}
  className="relative max-w-4xl mx-auto bg-[var(--card)] shadow-xl rounded-2xl px-8 py-10 sm:px-12 sm:py-12 border border-[var(--border)] flex flex-col gap-12 animate-fade-in"
  id="resume-content"
>
```

Add animation in globals.css:
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 300ms ease-out;
}
```
</task>

## Verification

- [ ] Page background uses background variable
- [ ] Decorative blobs removed
- [ ] Container uses card background
- [ ] Section spacing increased (gap-12)
- [ ] Shadow reduced for cleaner look
- [ ] Works in both light and dark modes
- [ ] Fade-in animation on page load

## Must-Haves (Goal-Backward)

- Clean, uncluttered background
- Increased whitespace between sections
- Dark mode compatible
- Subtle page load animation

---

*Plan created: 2026-01-31*

