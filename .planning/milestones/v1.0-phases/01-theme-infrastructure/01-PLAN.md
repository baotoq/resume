# Plan 01: Install next-themes and Setup Provider

---
wave: 1
depends_on: []
files_modified:
  - package.json
  - src/app/layout.tsx
  - src/components/providers/ThemeProvider.tsx
autonomous: true
---

## Objective

Install the `next-themes` package and configure the ThemeProvider to wrap the application, enabling dark mode infrastructure.

## Tasks

<task id="1.1">
Install next-themes package

```bash
npm install next-themes
```
</task>

<task id="1.2">
Create ThemeProvider wrapper component at `src/components/providers/ThemeProvider.tsx`

```typescript
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
```

Key configuration:
- `attribute="class"` — Adds `dark` class to `<html>` for Tailwind compatibility
- `defaultTheme="system"` — Respects OS preference on first visit
- `enableSystem` — Enables system preference detection
- `disableTransitionOnChange={false}` — Allows smooth transitions
</task>

<task id="1.3">
Update `src/app/layout.tsx` to wrap app with ThemeProvider

- Add `suppressHydrationWarning` to `<html>` tag
- Import and wrap children with ThemeProvider
- Keep AntdRegistry inside ThemeProvider
</task>

## Verification

- [ ] `next-themes` appears in package.json dependencies
- [ ] ThemeProvider.tsx exists and exports ThemeProvider component
- [ ] layout.tsx imports and uses ThemeProvider
- [ ] `<html>` tag has `suppressHydrationWarning` attribute
- [ ] App still renders without errors
- [ ] No hydration warnings in console

## Must-Haves (Goal-Backward)

- Theme provider wraps entire application
- System preference detection enabled
- No hydration mismatch errors
- Tailwind dark mode class strategy configured

---

*Plan created: 2026-01-31*

