---
phase: 14
slug: card-swap
status: draft
visual_parity_target: true
created: 2026-04-24
---

# Phase 14 — UI Design Contract

> Visual and interaction contract for Phase 14: Card Swap.
> This is a **visual-parity-first swap phase**. The contract pins what must look the same
> and what is explicitly accepted to change.

---

## Purpose of This Spec

Phase 14 replaces hand-rolled card markup in Header, WorkExperience, and EducationSection with the
shadcn `<Card><CardContent>` primitive installed in Phase 13. No new UI, no new capabilities, no
restructuring. This spec defines:

1. **Preservation contracts** — what must be pixel-equivalent before and after
2. **Accepted deltas** — known visual changes, signed off in CONTEXT.md
3. **Per-file JSX contracts** — minimal diff shape for each component
4. **Verification surface** — exactly how visual parity is confirmed

---

## Design System (inherited from Phase 13)

| Property | Value | Source |
|----------|-------|--------|
| Components | shadcn `Card`, `CardContent` only (no CardHeader/Title/Footer) | 14-CONTEXT.md D-02 |
| Theme tokens | `--card: oklch(1 0 0)`, `--border: oklch(0.922 0 0)`, `--radius-xl: calc(0.625rem * 1.4)` | `src/app/globals.css` |
| Font | Geist Sans + Geist Mono (preserved, unchanged) | Phase 13 |
| Biome lint | must pass | AGENTS.md |

---

## Preservation Contract

Visually equivalent before and after — any regression = gate failure.

### Typography and Content
- All `<h1>`, `<h2>`, `<h3>`, `<p>` tags inside cards retain their exact classes and text.
- Header: name (28px semibold), title (20px semibold), contact row, bio paragraph — all unchanged.
- WorkExperience: company heading, role title, date range, bullets, tech icons — all unchanged.
- EducationSection: institution heading, program, date range, bullets — all unchanged.

### Semantics
- Header outer tag stays `<section>` — wraps new `<Card>`.
- WorkExperience per-entry outer tag stays `<article>` — wraps new `<Card>`.
- EducationSection per-entry outer tag stays `<article>` — wraps new `<Card>`.

### Colors (pixel-equivalent)
- Card background: `--card` = `oklch(1 0 0)` = `#ffffff` — identical to `bg-white`.
- Card border: `--border` = `oklch(0.922 0 0)` — sub-JND delta vs `zinc-200` (`#e4e4e7`). Accepted as equivalent.
- Shadow: `shadow-sm` preserved (Card default class).

### Layout and Spacing
- Total card padding: `p-6` (Card `py-6` + CardContent `px-6`) — identical to hand-rolled `p-6` / `px-6 py-6`.
- WorkExperience timeline dot: sibling of `<Card>`, outside — z-index, position, colors unchanged.
- WorkExperience inner `flex flex-col gap-4` wrapper: **kept** (Card's own `gap-6` is a no-op since CardContent is its sole child).

### Responsive
- 375px (mobile): all content visible, no clipping, card padding renders as p-6.
- 1280px (desktop): card widths and spacing unchanged from pre-swap layout.

---

## Accepted Deltas (signed off in CONTEXT.md)

| Delta | Scope | Rationale |
|-------|-------|-----------|
| Border radius: 12px → 14px | All three cards | Phase 13 `--radius-xl` override; CONTEXT.md D-05 accepts |
| Border color: `zinc-200` → `--border` oklch | All three cards | CONTEXT.md D-04 trusts theme tokens; sub-JND delta |
| Background: `bg-white` → `bg-card` | All three cards | CONTEXT.md D-04 trusts theme tokens; `oklch(1 0 0)` = pure white |

---

## Per-File JSX Contract

### Header.tsx (line 17)

**Before:**
```tsx
<section className="rounded-xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">
  <h1 ...>{resume.name}</h1>
  ...
</section>
```

**After:**
```tsx
<section>
  <Card>
    <CardContent>
      <h1 ...>{resume.name}</h1>
      ...
    </CardContent>
  </Card>
</section>
```

- `<section>` keeps the landmark; no classes.
- `<Card>` and `<CardContent>` use all-default classes (no className prop).
- All existing children moved verbatim inside `<CardContent>`.

### WorkExperience.tsx (line 56)

**Before:**
```tsx
<article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
  <div className="flex flex-col gap-4">
    ...
  </div>
</article>
```

**After:**
```tsx
<article>
  <Card>
    <CardContent>
      <div className="flex flex-col gap-4">
        ...
      </div>
    </CardContent>
  </Card>
</article>
```

- Timeline dot (lines 46–53) stays as previous sibling, untouched.
- Inner `flex flex-col gap-4` wrapper preserved (controls spacing between header row, bullets, tech icons).

### EducationSection.tsx (line 32)

**Before:**
```tsx
<article
  key={index}
  className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
>
  ...
</article>
```

**After:**
```tsx
<article key={index}>
  <Card>
    <CardContent>
      ...
    </CardContent>
  </Card>
</article>
```

- `key={index}` stays on `<article>`, not `<Card>`.

---

## Verification Surface

### Automated (runs in CI-equivalent via npm)
| Check | Command | Expected |
|-------|---------|----------|
| Hand-rolled classes gone (Header) | `! grep -E 'rounded-xl border border-zinc-200 bg-white (px-6 py-6\|p-6) shadow-sm' src/components/Header.tsx` | exit 0 |
| Card primitive used (Header) | `grep -E '<Card>\|<CardContent>' src/components/Header.tsx` | ≥2 matches |
| Hand-rolled classes gone (WorkExperience) | `! grep 'rounded-xl border border-zinc-200 bg-white p-6 shadow-sm' src/components/WorkExperience.tsx` | exit 0 |
| Card primitive used (WorkExperience) | `grep -E '<Card>\|<CardContent>' src/components/WorkExperience.tsx` | ≥2 matches |
| Hand-rolled classes gone (EducationSection) | `! grep 'rounded-xl border border-zinc-200 bg-white p-6 shadow-sm' src/components/EducationSection.tsx` | exit 0 |
| Card primitive used (EducationSection) | `grep -E '<Card>\|<CardContent>' src/components/EducationSection.tsx` | ≥2 matches |
| Build | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |

### Manual (no visual regression suite exists)
- `npm run dev` → browser at 375px and 1280px
- Side-by-side compare against pre-swap screenshots (capture before starting)
- Confirm: no layout shift, no content clipping, 14px radius accepted, card backgrounds pure white, border visually identical

---

## Out of Scope
- Dark mode variants (no dark theme in project)
- Hover/focus card states (not in requirements)
- `<CardHeader>` / `<CardTitle>` / `<CardFooter>` usage (deferred per CONTEXT.md)
- Typography changes inside cards
- Timeline dot restyling

---

## Sign-Off

- [ ] All three files diff matches per-file JSX contract above
- [ ] All automated grep commands pass
- [ ] Manual visual check at 375px and 1280px confirms parity (deltas accepted)
- [ ] `npm run build` and `npm run lint` both exit 0
