# Plan 03: Create ThemeToggle Component

---
wave: 2
depends_on: [01-PLAN, 02-PLAN]
files_modified:
  - src/components/ui/ThemeToggle.tsx
autonomous: true
---

## Objective

Create an iOS-style toggle switch component with "Light"/"Dark" text labels that allows users to switch between themes. The toggle should be subtle, theme-aware, and include smooth animations.

## Tasks

<task id="3.1">
Create `src/components/ui/ThemeToggle.tsx`

```typescript
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show placeholder during SSR/hydration
  if (!mounted) {
    return (
      <div 
        className={`w-20 h-8 rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      className={`
        relative inline-flex h-8 w-20 items-center rounded-full
        bg-gray-200 dark:bg-gray-700
        transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        ${className}
      `}
    >
      {/* Light label */}
      <span
        className={`
          absolute left-2 text-xs font-medium
          transition-opacity duration-200
          ${isDark ? "text-gray-500" : "text-gray-700"}
        `}
      >
        Light
      </span>

      {/* Dark label */}
      <span
        className={`
          absolute right-2 text-xs font-medium
          transition-opacity duration-200
          ${isDark ? "text-gray-300" : "text-gray-400"}
        `}
      >
        Dark
      </span>

      {/* Slider thumb */}
      <span
        className={`
          absolute h-6 w-6 rounded-full bg-white shadow-md
          transition-transform duration-200 ease-in-out
          ${isDark ? "translate-x-[52px]" : "translate-x-1"}
        `}
      />
    </button>
  );
}
```
</task>

<task id="3.2">
Verify component meets accessibility requirements

- Uses `role="switch"` for screen readers
- Has `aria-checked` reflecting current state
- Has `aria-label` describing the action
- Includes focus-visible ring for keyboard navigation
- Placeholder shown during hydration (no layout shift)
</task>

## Verification

- [ ] ThemeToggle.tsx exists at correct path
- [ ] Component renders without errors
- [ ] Clicking toggles between light/dark themes
- [ ] Slider animates smoothly (200ms)
- [ ] Labels visible: "Light" on left, "Dark" on right
- [ ] Track color changes with theme (gray-200/gray-700)
- [ ] No hydration mismatch warnings
- [ ] Keyboard accessible (Tab to focus, Enter/Space to toggle)
- [ ] Screen reader announces switch state

## Must-Haves (Goal-Backward)

- iOS-style toggle switch appearance
- "Light"/"Dark" text labels
- Smooth slider animation
- Theme-aware track colors
- Hydration-safe rendering
- Accessible (ARIA, keyboard, focus)

---

*Plan created: 2026-01-31*

