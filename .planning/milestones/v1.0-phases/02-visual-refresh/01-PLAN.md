# Plan 01: Typography Update - Plus Jakarta Sans

---
wave: 1
depends_on: []
files_modified:
  - src/app/layout.tsx
autonomous: true
---

## Objective

Replace Inter font with Plus Jakarta Sans for a more modern, distinctive typography.

## Tasks

<task id="1.1">
Update `src/app/layout.tsx` to use Plus Jakarta Sans

Replace Inter import with Plus Jakarta Sans:

```typescript
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
```

Update body className to use new font variable:
```typescript
<body className={`${plusJakartaSans.variable} antialiased`}>
```
</task>

## Verification

- [ ] Plus Jakarta Sans imported from next/font/google
- [ ] Font weights 400, 500, 600, 700 included
- [ ] CSS variable `--font-plus-jakarta` created
- [ ] Body uses new font variable
- [ ] Font renders correctly in browser

## Must-Haves (Goal-Backward)

- Plus Jakarta Sans replaces Inter
- All required weights available
- No font loading errors

---

*Plan created: 2026-01-31*

