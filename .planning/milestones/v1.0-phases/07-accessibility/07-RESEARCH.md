# Phase 7: Accessibility - Research

**Researched:** 2026-03-06
**Domain:** Web accessibility (WCAG 2.1 AA), React/Next.js a11y patterns
**Confidence:** HIGH

## Summary

Phase 7 addresses six accessibility requirements for a static single-page Next.js resume site. The codebase already has some good practices in place -- the ThemeToggle uses `role="switch"`, `aria-checked`, and `aria-label`; company logo fallbacks use `aria-hidden`; and the HTML `lang` attribute is set. However, several gaps remain: no skip navigation link, no consistent visible focus indicators (only ThemeToggle has `focus-visible` styles), the PDFExportButton lacks an `aria-label`, and keyboard navigation has not been systematically verified.

This is a pure HTML/CSS/ARIA improvement phase -- no new libraries are needed. The work involves adding semantic landmarks, a skip-to-content link, focus indicator styles, aria-labels, contrast verification, and keyboard testing. The site is simple (one page, limited interactivity), so the scope is well-bounded.

**Primary recommendation:** Implement accessibility improvements through CSS focus styles, semantic HTML attributes, and a skip navigation component -- no external a11y libraries needed.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| A11Y-01 | Skip navigation link at top of page | Standard pattern: visually hidden link that becomes visible on focus, jumps to `#resume-content` (ID already exists) |
| A11Y-02 | All interactive elements have visible focus indicators | Global `focus-visible` CSS rule in globals.css + per-component review |
| A11Y-03 | All icon-only buttons have aria-labels | PDFExportButton needs `aria-label="Download resume as PDF"`; ThemeToggle already has one |
| A11Y-04 | Color contrast meets WCAG 2.1 AA (4.5:1 for text) | Verify CSS custom properties against WCAG ratios; `--muted-foreground` on light/dark needs checking |
| A11Y-05 | Keyboard navigation works for all interactive elements | Tab order audit; all `<a>` and `<button>` elements are natively focusable; verify no focus traps |
| A11Y-06 | Theme toggle is keyboard accessible | Already uses `<button>` with `role="switch"` -- verify Enter/Space toggle works (native button behavior) |
</phase_requirements>

## Standard Stack

### Core
No new libraries needed. All requirements are achievable with native HTML, CSS, and ARIA attributes.

| Tool | Purpose | Why Standard |
|------|---------|--------------|
| Native HTML semantics | Landmarks, headings, skip links | No dependency needed for a11y fundamentals |
| CSS `focus-visible` | Focus indicators without affecting mouse users | Built into all modern browsers |
| ARIA attributes | Screen reader announcements | Native web platform |

### Supporting
| Tool | Purpose | When to Use |
|------|---------|-------------|
| Lighthouse CI | Automated a11y scoring | Verification step (already in browser DevTools) |
| axe DevTools | Detailed a11y issue detection | Manual verification during QA |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual ARIA | `@radix-ui/react-visually-hidden` | Adds dependency for a single utility; hand-rolling is fine for one skip link |
| Custom focus styles | `tailwindcss-animate` | Overkill; Tailwind's built-in `focus-visible:` variants suffice |

## Architecture Patterns

### Skip Navigation Component
**What:** A visually-hidden-but-focusable link at the very top of the page that jumps to `#resume-content` (this ID already exists on the main content div).

**Pattern:**
```tsx
// src/components/ui/SkipToContent.tsx
export function SkipToContent() {
  return (
    <a
      href="#resume-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)] focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
    >
      Skip to main content
    </a>
  );
}
```

**Placement:** First child inside `<body>` in `layout.tsx`, before ThemeProvider.

### Global Focus Indicator Strategy
**What:** A consistent `focus-visible` ring applied to all interactive elements.

**Pattern:** Add to `globals.css`:
```css
/* Global focus indicators for accessibility */
a:focus-visible,
button:focus-visible,
[role="switch"]:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}
```

This provides a unified teal/accent ring. The existing ThemeToggle `focus-visible:ring-2 focus-visible:ring-blue-500` should be updated to use `var(--accent)` for consistency.

### Semantic Landmarks
**What:** Ensure proper landmark roles for screen reader navigation.

The current structure has:
- `<header>` in Header.tsx -- correct
- `<section>` elements via Section.tsx -- correct but could benefit from `aria-label` attributes
- Missing: `<main>` element wrapping the primary content
- Missing: `<nav>` for contact links (optional but helpful)

**Pattern:** Wrap the resume sections in `<main>` in page.tsx:
```tsx
<main id="resume-content" ref={resumeRef} ...>
  {/* sections */}
</main>
```

Note: `id="resume-content"` is already on the div -- just change `<div>` to `<main>`.

### Anti-Patterns to Avoid
- **Don't add `tabindex` to non-interactive elements:** Skill badges and tech tags are display-only; they should NOT be focusable.
- **Don't use `outline: none` without replacement:** Removing focus outlines without providing an alternative breaks keyboard navigation.
- **Don't use `aria-label` on elements with visible text:** The LinkedIn and GitHub links already show text ("LinkedIn", "GitHub"); they don't need aria-labels. Only icon-ONLY buttons need them.
- **Don't add `role="main"` AND use `<main>` tag:** That's redundant. Use `<main>` alone.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Visually hidden text | Custom CSS class | Tailwind's `sr-only` utility | Well-tested, handles edge cases (clip, position, overflow) |
| Focus management | Manual `focus()` calls | Native anchor hash navigation | `<a href="#resume-content">` handles scroll + focus natively |
| Color contrast checking | Manual hex math | Lighthouse + axe DevTools | Automated tools catch edge cases humans miss |

## Common Pitfalls

### Pitfall 1: Decorative Quotation Marks Announced by Screen Readers
**What goes wrong:** The `"` characters in Summary.tsx are decorative but screen readers may announce them as "open quote."
**Why it happens:** They are text nodes, not images.
**How to avoid:** Already using `select-none` but should also add `aria-hidden="true"` to the quote mark wrapper spans.
**Warning signs:** Screen reader announces "open quote" before the summary text.

### Pitfall 2: Bullet Points (Decorative Spans) Read Aloud
**What goes wrong:** The `<span>` containing "bullet" in experience achievements is read by screen readers.
**Why it happens:** It's a visible text character, not a CSS pseudo-element.
**How to avoid:** Add `aria-hidden="true"` to the bullet span, or convert to CSS `::before` pseudo-element. The `<ul>/<li>` already provides list semantics.
**Warning signs:** Screen reader says "bullet" before each achievement.

### Pitfall 3: Theme Toggle State Not Announced on Change
**What goes wrong:** When user toggles theme, screen reader doesn't announce the new state.
**Why it happens:** `aria-checked` updates reactively (good), but some screen readers need `aria-live` or explicit announcement.
**How to avoid:** The current `role="switch"` with `aria-checked` should handle this. The `aria-label` already includes the target mode. Test with VoiceOver to confirm.
**Warning signs:** User toggles theme but hears nothing.

### Pitfall 4: CSS Transition on All Properties Interferes with Focus
**What goes wrong:** The global `transition-property: background-color, border-color, color, fill, stroke` in globals.css applies to all elements, which could make focus ring transitions feel sluggish.
**How to avoid:** The current transition list does NOT include `outline` or `box-shadow`, so focus-visible outlines will appear instantly. This is actually correct behavior -- no change needed.

### Pitfall 5: Muted Foreground Contrast Ratios
**What goes wrong:** `--muted-foreground` (#78716c on #fafaf8 in light, #a8a29e on #0c0a09 in dark) may be borderline on WCAG AA.
**How to avoid:** Run automated contrast checker. Light mode: #78716c on #fafaf8 = ~4.5:1 (borderline AA). Dark mode: #a8a29e on #0c0a09 = ~6.8:1 (passes). Light mode #78716c on white (#ffffff card) = ~4.2:1 (fails AA for normal text). May need to darken `--muted-foreground` slightly in light mode.
**Warning signs:** Lighthouse flags contrast issues on muted text.

### Pitfall 6: External Links Missing Accessible Name Context
**What goes wrong:** Company name links in experience section say just the company name, but screen reader users don't know it opens externally.
**How to avoid:** The links already have `target="_blank"` and `rel="noopener noreferrer"`. Adding a visually hidden "(opens in new tab)" suffix is a best practice but optional for AA compliance.

## Code Examples

### Skip Link Component (A11Y-01)
```tsx
// Using Tailwind's sr-only with focus override
export function SkipToContent() {
  return (
    <a
      href="#resume-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)] focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
    >
      Skip to main content
    </a>
  );
}
```

### Global Focus Styles (A11Y-02)
```css
/* globals.css - after existing styles */
*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Remove default outline for mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### Aria-Label for PDFExportButton (A11Y-03)
```tsx
<button
  onClick={() => handlePrint()}
  aria-label="Download resume as PDF"
  // ... existing classes
>
```

### Main Landmark (A11Y-05)
```tsx
// Change div to main in page.tsx
<main
  ref={resumeRef}
  className="..."
  id="resume-content"
  tabIndex={-1}  // Allow focus via skip link
>
```

### Decorative Element Hiding
```tsx
// Quote marks in Summary.tsx
<div aria-hidden="true" className="absolute top-3 left-4 text-6xl text-[var(--accent)]/20 font-serif leading-none select-none">
  &ldquo;
</div>

// Bullet in Experience.tsx
<span className="text-[var(--accent)] mt-1.5" aria-hidden="true">&bull;</span>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `:focus` for all | `:focus-visible` for keyboard only | 2022+ (full browser support) | Mouse users don't see focus rings |
| `outline: none` everywhere | Styled `outline` on focus-visible | WCAG 2.1 (2018) | Keyboard users always see where they are |
| Skip links as hidden divs | `sr-only` + `focus:not-sr-only` | Tailwind convention | Clean implementation with utility classes |

## Existing Accessibility Audit

### What Already Works
| Element | Status | Notes |
|---------|--------|-------|
| ThemeToggle | Mostly good | Has `role="switch"`, `aria-checked`, `aria-label`, `focus-visible` ring |
| Company logos | Good | `alt` text on images, `aria-hidden` on fallback |
| HTML lang attribute | Good | Set to "en" |
| Heading hierarchy | Good | h1 (name) > h2 (sections) > h3 (items) |
| Link text | Good | LinkedIn/GitHub links have visible text |
| Button type attribute | Good | All buttons have `type="button"` |

### What Needs Fixing
| Element | Issue | Fix |
|---------|-------|-----|
| PDFExportButton | No `aria-label` (icon-only) | Add `aria-label="Download resume as PDF"` |
| Page structure | No `<main>` landmark | Change container `<div>` to `<main>` |
| No skip link | Keyboard users must tab through header | Add SkipToContent component |
| Focus indicators | Only ThemeToggle has them | Add global `focus-visible` styles |
| ThemeToggle focus ring | Uses blue-500 (not theme-aware) | Change to `var(--accent)` |
| Decorative quotes | May be announced by SR | Add `aria-hidden="true"` |
| Decorative bullets | May be announced by SR | Add `aria-hidden="true"` |
| Timeline dots | Decorative, no aria-hidden | Add `aria-hidden="true"` |
| Section elements | No aria-labels | Add `aria-label` matching section title |
| Contrast (light mode) | `--muted-foreground` on card bg may fail | Darken to ~#6b6560 or verify exact ratios |

## Open Questions

1. **Exact contrast ratios for muted-foreground**
   - What we know: Light mode #78716c on #ffffff is ~4.2:1 (fails AA for normal text). On #fafaf8 it's ~4.5:1 (borderline).
   - What's unclear: Whether the actual rendered backgrounds match these calculations (compositing, alpha values).
   - Recommendation: Run Lighthouse contrast audit on the built site. If it fails, darken `--muted-foreground` in light mode to #6b6560 (~5:1) or similar.

2. **Print stylesheet and skip link interaction**
   - What we know: Skip link should be hidden in print via `no-print` class.
   - Recommendation: Add `no-print` class to skip link or use existing print CSS rules.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | No test runner configured |
| Config file | None |
| Quick run command | `npm run lint && npm run build` |
| Full suite command | `npm run lint && npm run build` + manual Lighthouse audit |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| A11Y-01 | Skip link exists and targets #resume-content | manual-only | Lighthouse a11y audit | N/A |
| A11Y-02 | Focus indicators visible on all interactive elements | manual-only | Tab through page visually | N/A |
| A11Y-03 | Icon buttons have aria-labels | manual-only | Lighthouse / axe audit | N/A |
| A11Y-04 | Color contrast WCAG AA | manual-only | Lighthouse contrast audit | N/A |
| A11Y-05 | Keyboard navigation complete | manual-only | Tab through entire page | N/A |
| A11Y-06 | Theme toggle keyboard accessible | manual-only | Press Tab to toggle, Enter/Space to activate | N/A |

### Sampling Rate
- **Per task commit:** `npm run lint && npm run build`
- **Per wave merge:** Full build + Lighthouse accessibility audit in browser
- **Phase gate:** Lighthouse accessibility >= 95, axe DevTools no critical issues

### Wave 0 Gaps
None -- no test infrastructure to set up. All verification is through Lighthouse and manual keyboard/screen reader testing.

## Sources

### Primary (HIGH confidence)
- Codebase audit of all component files (direct file reads)
- WCAG 2.1 AA guidelines (well-established standard, training data is reliable)
- Tailwind CSS `sr-only` and `focus-visible` utilities (standard Tailwind features)

### Secondary (MEDIUM confidence)
- Contrast ratio calculations for CSS custom property values (manual computation, should be verified with tooling)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new libraries, pure HTML/CSS/ARIA
- Architecture: HIGH - well-established patterns (skip links, focus-visible, landmarks)
- Pitfalls: HIGH - based on direct codebase audit identifying specific issues
- Contrast: MEDIUM - ratios computed manually, need Lighthouse verification

**Research date:** 2026-03-06
**Valid until:** 2026-06-06 (stable domain, WCAG standards don't change frequently)
