# Phase 1 Research: Theme Infrastructure

> Implementation research for dark mode with next-themes

## Overview

Phase 1 implements the theme switching infrastructure using `next-themes` — the de facto standard for Next.js dark mode.

## next-themes Implementation

### Installation

```bash
npm install next-themes
```

### Core Setup

**1. ThemeProvider wrapper (layout.tsx)**

```tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Key options:**
- `attribute="class"` — Adds `dark` class to `<html>` (works with Tailwind)
- `defaultTheme="system"` — Respects OS preference on first visit
- `enableSystem` — Enables system preference detection
- `suppressHydrationWarning` on `<html>` — Prevents hydration mismatch

### Theme Toggle Hook

```tsx
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  
  // Use resolvedTheme for actual current theme (handles "system")
  const isDark = resolvedTheme === 'dark'
  
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }
  
  return (...)
}
```

**Important:** Use `resolvedTheme` not `theme` — it resolves "system" to actual value.

### Hydration Safety

next-themes handles SSR by:
1. Injecting inline script before paint (no flash)
2. Using `suppressHydrationWarning` to avoid React errors
3. Returning `undefined` for theme on server (must handle in component)

**Pattern for hydration-safe rendering:**

```tsx
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) {
  return <div className="w-[80px] h-[32px]" /> // Placeholder
}

return <ThemeToggle />
```

## Tailwind CSS Integration

### CSS Variables Approach

**globals.css:**

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --muted: #f3f4f6;
  --border: #e5e7eb;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
  --muted: #1f2937;
  --border: #374151;
}
```

### Tailwind Config (v4)

Tailwind v4 uses CSS-based configuration. Variables are automatically available:

```css
@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

### Using dark: Classes

```tsx
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-gray-100">Content</p>
</div>
```

## Toggle Component Design

Based on phase context decisions:

### iOS-Style Switch

```tsx
interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])
  
  if (!mounted) return <div className="w-20 h-8" />
  
  const isDark = resolvedTheme === 'dark'
  
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        "relative inline-flex h-8 w-20 items-center rounded-full transition-colors",
        "bg-gray-200 dark:bg-gray-700",
        className
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Labels */}
      <span className="absolute left-2 text-xs text-gray-600 dark:text-gray-400">
        Light
      </span>
      <span className="absolute right-2 text-xs text-gray-400 dark:text-gray-300">
        Dark
      </span>
      
      {/* Slider */}
      <span
        className={cn(
          "absolute h-6 w-6 rounded-full bg-white shadow transition-transform duration-200",
          isDark ? "translate-x-12" : "translate-x-1"
        )}
      />
    </button>
  )
}
```

### Transition Styling

For smooth 150-300ms color transitions:

```css
/* In globals.css */
* {
  transition-property: background-color, border-color, color;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

/* Disable during initial load (next-themes handles this) */
[data-theme-transition="false"] * {
  transition: none !important;
}
```

## File Structure

```
src/
├── app/
│   ├── layout.tsx          # Add ThemeProvider
│   └── globals.css         # Add CSS variables for dark mode
├── components/
│   ├── providers/
│   │   └── ThemeProvider.tsx   # Wrapper component
│   └── ui/
│       └── ThemeToggle.tsx     # Toggle switch component
```

## Integration Points

### Header Component

Current header has PDF button at far right. Add toggle after it:

```tsx
// In Header.tsx
<div className="no-print flex justify-center md:justify-end gap-2">
  {pdfButton}
  <ThemeToggle />
</div>
```

### Print Styles

Toggle already in `.no-print` container — will be hidden automatically.

## Pitfalls to Avoid

1. **Flash of wrong theme** — next-themes handles this with inline script
2. **Hydration mismatch** — Use `suppressHydrationWarning` and mounted check
3. **Transition on load** — next-themes `disableTransitionOnChange` can help
4. **System preference not updating** — Per context, only update on reload (default behavior)

## Testing Checklist

- [ ] Toggle switches theme immediately
- [ ] Preference persists after refresh
- [ ] No white flash on dark mode load
- [ ] System preference respected on first visit
- [ ] Works on mobile
- [ ] Hidden in print/PDF
- [ ] Keyboard accessible (Tab + Enter/Space)

---

*Research complete: 2026-01-31*

