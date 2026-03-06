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
      <div className={`w-20 h-8 rounded-full bg-gray-200 dark:bg-gray-700 ${className ?? ""}`} aria-hidden="true" />
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
        relative inline-flex h-8 w-20 items-center rounded-full cursor-pointer
        bg-gray-200 dark:bg-gray-700
        transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2
        ${className ?? ""}
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
