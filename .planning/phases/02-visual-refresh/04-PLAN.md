# Plan 04: Update Header Component

---
wave: 2
depends_on: [02-PLAN]
files_modified:
  - src/components/resume/Header.tsx
autonomous: true
---

## Objective

Update Header component to remove blue/purple gradients and use warm earth tones with teal accent.

## Tasks

<task id="4.1">
Remove decorative gradient line at bottom of header

Current:
```tsx
<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
```

New: Remove entirely or replace with subtle border:
```tsx
<div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--border)]" />
```
</task>

<task id="4.2">
Update name styling - remove gradient, use solid color

Current:
```tsx
<h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent tracking-tight">
```

New:
```tsx
<h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] tracking-tight">
```
</task>

<task id="4.3">
Update job title styling - use accent color

Current:
```tsx
<p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
```

New:
```tsx
<p className="text-xl md:text-2xl font-semibold text-[var(--accent)] mt-2">
```
</task>

<task id="4.4">
Update contact links styling - unified accent color

Replace individual blue/green colors with consistent styling:

```tsx
<a
  href={`mailto:${contact.email}`}
  className="group flex items-center gap-2 px-4 py-2 bg-[var(--muted)] hover:bg-[var(--accent)]/10 rounded-full border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-200"
>
  <MailOutlined className="text-[var(--accent)]" />
  <span className="text-sm text-[var(--foreground)] group-hover:text-[var(--accent)]">{contact.email}</span>
</a>
```

Apply similar pattern to phone, LinkedIn, and GitHub links.
Remove inline `style={{ color: "..." }}` from icons.
</task>

## Verification

- [ ] Decorative gradient line removed/replaced
- [ ] Name uses solid foreground color
- [ ] Job title uses accent color (teal)
- [ ] Contact links use unified accent styling
- [ ] No inline style colors on icons
- [ ] Works in both light and dark modes

## Must-Haves (Goal-Backward)

- All blue/purple gradients removed
- Warm, professional appearance
- Consistent accent color usage
- Dark mode support

---

*Plan created: 2026-01-31*

