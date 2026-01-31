# Pitfalls Research: Portfolio Enhancement

> Common mistakes when enhancing portfolio sites

## Critical Pitfalls

### 1. Dark Mode Flash (FOUC)

**Problem:** Page flashes white before dark theme loads.

**Why it happens:** Theme preference is in localStorage, but page renders before JS runs.

**Prevention:**
- Use `next-themes` with `attribute="class"` or `attribute="data-theme"`
- Add blocking script in `<head>` to set theme before paint
- `next-themes` handles this automatically with `enableSystem` and `defaultTheme`

**Warning Signs:**
- White flash on page load in dark mode
- Theme "jumps" after hydration

**Phase:** Theme Infrastructure

---

### 2. GitHub API Rate Limits

**Problem:** 60 requests/hour for unauthenticated requests. Site breaks if limit hit.

**Why it happens:** Fetching on every page load or too frequently.

**Prevention:**
- Fetch at build time, not runtime
- Cache results in static JSON
- Add fallback data if API fails
- Don't fetch on client side

**Warning Signs:**
- 403 errors from GitHub API
- Empty projects section intermittently

**Phase:** GitHub Projects

---

### 3. Hydration Mismatch with Theme

**Problem:** Server renders light, client hydrates dark → React error.

**Why it happens:** Server doesn't know user's theme preference.

**Prevention:**
- Use `suppressHydrationWarning` on `<html>` tag
- Let `next-themes` handle SSR correctly
- Don't conditionally render based on theme during SSR

**Warning Signs:**
- Console errors about hydration mismatch
- Content flickers on load

**Phase:** Theme Infrastructure

---

### 4. Poor Color Contrast in Dark Mode

**Problem:** Text unreadable, fails WCAG.

**Why it happens:** Just inverting colors doesn't guarantee contrast.

**Prevention:**
- Design both themes intentionally
- Test contrast ratios (4.5:1 minimum for text)
- Use tools like WebAIM Contrast Checker
- Test gradient text in both themes

**Warning Signs:**
- Squinting to read text
- Accessibility audit failures

**Phase:** Visual Refresh + Accessibility

---

### 5. Oversized Images

**Problem:** Slow page load, poor Core Web Vitals.

**Why it happens:** Using original resolution images for small display sizes.

**Prevention:**
- Optimize company logos (max 64px display → max 128px file)
- Use WebP format
- Lazy load below-fold images
- Use `next/image` with proper sizing

**Warning Signs:**
- Lighthouse performance warnings
- Large image file sizes (>50KB for logos)

**Phase:** Company Logos

---

### 6. Breaking Print Styles

**Problem:** PDF export looks wrong after visual changes.

**Why it happens:** New styles override print.css, or new elements don't have print styles.

**Prevention:**
- Test print after every visual change
- Add print styles for new components
- Use `.no-print` class for non-printable elements
- Keep print.css updated

**Warning Signs:**
- PDF has wrong colors/layout
- Elements missing or overlapping in print

**Phase:** Throughout (especially Visual Refresh)

---

### 7. Accessibility Regression

**Problem:** New features break keyboard navigation or screen readers.

**Why it happens:** Focus on visual design, forgetting accessibility.

**Prevention:**
- Test keyboard navigation after each feature
- Use semantic HTML (`<button>`, `<nav>`, etc.)
- Add aria-labels to icon-only buttons
- Test with screen reader occasionally

**Warning Signs:**
- Can't tab to interactive elements
- No focus indicators
- Screen reader announces nothing useful

**Phase:** Throughout + Accessibility Phase

---

## Medium Pitfalls

### 8. Animation Performance

**Problem:** Janky animations, especially on mobile.

**Prevention:**
- Use CSS transforms and opacity only
- Avoid animating layout properties (width, height, margin)
- Use `will-change` sparingly
- Test on low-end devices

**Phase:** Visual Refresh

---

### 9. Over-Engineering GitHub Integration

**Problem:** Complex filtering logic, unnecessary features.

**Prevention:**
- Start simple: starred repos only
- Add complexity only if needed
- Don't build admin UI for filtering (just config file)

**Phase:** GitHub Projects

---

### 10. Losing Existing Functionality

**Problem:** PDF export breaks, responsive design breaks, etc.

**Prevention:**
- Test existing features after each change
- Keep a checklist of existing functionality
- Don't remove code without understanding it

**Phase:** Throughout

---

### 11. SEO Structured Data Errors

**Problem:** Invalid JSON-LD, Google ignores it.

**Prevention:**
- Validate with Google's Rich Results Test
- Use schema.org vocabulary correctly
- Test after deployment

**Phase:** SEO

---

## Low Pitfalls

### 12. Analytics Not Working

**Problem:** Plausible script blocked, no data.

**Prevention:**
- Test in incognito (no ad blockers)
- Verify script loads in Network tab
- Check Plausible dashboard after deployment

**Phase:** Analytics

---

### 13. OG Image Not Showing

**Problem:** Social shares show no image or wrong image.

**Prevention:**
- Use absolute URLs for og:image
- Test with social media debuggers (Twitter Card Validator, Facebook Debugger)
- Ensure image is accessible (not blocked)

**Phase:** SEO

---

## Pitfall Prevention Checklist

Use this during development:

```markdown
## After Each Feature
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Test print/PDF export
- [ ] Test keyboard navigation
- [ ] Test on mobile viewport
- [ ] Check console for errors
- [ ] Run Lighthouse audit

## Before Deployment
- [ ] All existing features still work
- [ ] No hydration errors
- [ ] Images optimized
- [ ] Print styles work
- [ ] Accessibility audit passes
- [ ] Structured data validates
```

---

## Summary

**High-Risk Areas:**
1. Dark mode (flash, hydration, contrast)
2. GitHub API (rate limits)
3. Print styles (easy to break)

**Mitigation Strategy:**
- Use established libraries (`next-themes`)
- Build-time data fetching
- Test frequently, especially print and accessibility

