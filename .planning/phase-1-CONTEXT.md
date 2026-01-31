# Phase 1 Context: Theme Infrastructure

> Decisions captured from discussion on 2026-01-31

## Toggle Appearance

| Decision | Choice |
|----------|--------|
| Visual style | iOS-style toggle switch (slider) |
| Labels | Text labels: "Light" / "Dark" |
| Size/prominence | Subtle — small, blends with header |
| Track color | Theme-aware — light gray in light mode, dark gray in dark mode |

**Implementation notes:**
- Switch should feel native and familiar
- Text labels provide clarity without icons
- Subtle presence — not a feature, just a utility

## Toggle Location

| Decision | Choice |
|----------|--------|
| Header position | Far right, after PDF download button |
| Mobile behavior | Stay visible (always shown) |
| Scroll behavior | Only at top — scrolls with header, not sticky |
| Print mode | Hidden (use `.no-print` class) |

**Implementation notes:**
- Groups utility controls together (PDF + theme)
- No sticky header needed — keeps content clean
- Follow existing `.no-print` pattern for PDF export

## Theme Transition

| Decision | Choice |
|----------|--------|
| Color transition | Fade smoothly (150-300ms) |
| Switch animation | Yes — slider moves smoothly |
| First visit indication | None — respect system preference only |
| System preference changes | Only on reload — not real-time |

**Implementation notes:**
- CSS transition on color properties
- Smooth slider micro-interaction
- No tooltip or onboarding for theme toggle
- `next-themes` handles system preference detection

---

## Summary for Downstream Agents

**What to build:**
- iOS-style toggle switch with "Light"/"Dark" text labels
- Placed far right in header, after PDF button
- Small and subtle, theme-aware track colors
- Smooth fade transition (150-300ms) on theme change
- Animated slider movement
- Hidden in print mode
- Respects system preference on first visit/reload

**What NOT to build:**
- Sticky/floating toggle
- Dropdown menu with system option
- Tooltip or first-visit hints
- Real-time system preference tracking

---

*Created: 2026-01-31*

