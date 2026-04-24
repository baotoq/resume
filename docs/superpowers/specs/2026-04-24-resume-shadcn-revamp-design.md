# Resume shadcn Revamp — Design

**Date:** 2026-04-24
**Status:** Draft (awaiting user review)
**Scope:** Visual revamp of the single-page resume using deeper shadcn/ui patterns, plus a new Certifications section. No content rewrite, no dark mode, no print styles.

## Goals

- Elevate the existing single-page resume to "stunning" via richer shadcn/ui usage and a cohesive gradient-accent visual system.
- Add one new section: **Certifications** (placeholder data, swappable later).
- Preserve current page architecture (single server-rendered page, gray-matter parse at request time, `ResumeData` typing).

## Non-goals

- Dark mode (light only).
- Print/PDF fidelity.
- New sections beyond Certifications (no Projects, Testimonials, Achievements band, Skills panel).
- Content/bullet rewrites.
- Layout width change (`max-w-3xl` preserved).

## Visual identity

- **Style:** Hybrid minimal × modern — sans-serif, tight spacing, hairline borders, card-based.
- **Typography:** Geist Sans via `next/font/google`, wired as `--font-sans`. Heading letter-spacing `-0.025em` (h1) / `-0.02em` (h2/h3). Body leading ~1.65.
- **Accent:** Teal → Emerald (`#14b8a6 → #10b981`) gradient at 135°. Used at header glow, current-role timeline dot + pulse, "Current" pill, certification icon tiles, link-hover underline.
- **Color base:** shadcn `neutral` (stone). Override `--primary` to teal-500 so shadcn components inherit the new accent.
- **Radius:** Card radius `rounded-2xl` (16px), up from default `rounded-xl` (12px).
- **Spacing:** Section gap `gap-10` (up from `gap-8`).

## Architecture

Unchanged. Data flow stays:

```
src/data/resume.md  →  gray-matter (page.tsx)  →  ResumeData  →  components
```

Contact info (`EMAIL`, `PHONE`) continues to come from env vars.

## New component: CertificationsSection

**File:** `src/components/CertificationsSection.tsx`

**Props:**
```ts
interface CertificationsSectionProps {
  certifications: CertificationEntry[];
}
```

**Behavior:**
- Renders as a `<section>` with `<h2>` "Certifications" matching existing section-heading typography.
- 2-column grid ≥`sm`, 1 column on mobile.
- Each cert renders as a shadcn `Card` with:
  - Gradient square tile (38×38, `rounded-xl`) on the left showing `abbrev` (or first 3 letters of `name` if absent).
  - Stacked `name` (13px, semibold) + `issuer · year` (11px, muted).
- If `url` is set, entire card becomes an `<a>` with `hover-lift` transition + `target="_blank" rel="noopener noreferrer"`.
- If `certifications` is empty/undefined, the section is not rendered.

## Schema additions

**`src/types/resume.ts`:**

```ts
export interface CertificationEntry {
  name: string;
  abbrev?: string;    // max 4 chars for gradient tile
  issuer: string;
  year: number;
  url?: string;
}

export interface ResumeData {
  // ...existing fields
  certifications?: CertificationEntry[];
}
```

**`src/data/resume.md` (append frontmatter):**

```yaml
# PLACEHOLDER — replace with real certs
certifications:
  - name: "Certified Kubernetes Administrator"
    abbrev: "CKA"
    issuer: "Linux Foundation"
    year: 2024
  - name: "AWS Solutions Architect — Professional"
    abbrev: "AWS"
    issuer: "Amazon"
    year: 2023
  - name: "Azure Developer Associate"
    abbrev: "AZ"
    issuer: "Microsoft"
    year: 2022
  - name: "Certified Kubernetes Application Developer"
    abbrev: "CKAD"
    issuer: "Linux Foundation"
    year: 2023
```

## Modified files

### `src/app/layout.tsx`
- Import Geist Sans via `next/font/google`, assign to CSS var `--font-sans`.
- Apply `${geistSans.variable}` to `<html>` className.

### `src/app/fonts.ts` (new)
- Exports the configured `geistSans` font instance.

### `src/app/page.tsx`
- Add `<AnimateIn delay={0.3}><CertificationsSection certifications={resume.certifications ?? []} /></AnimateIn>` after Education with a preceding `<Separator>` (wrapped in its own `AnimateIn delay={0.3}`).

### `src/app/globals.css`

Add / override:

```css
:root {
  --font-sans: var(--font-geist-sans, -apple-system, system-ui, sans-serif);
  --accent-from: 172 66% 46%;
  --accent-to:   160 84% 39%;
  --primary: 172 66% 46%;
  --primary-foreground: 0 0% 100%;
}

@layer utilities {
  .accent-gradient-bg {
    background: linear-gradient(135deg, hsl(var(--accent-from)), hsl(var(--accent-to)));
  }
  .accent-gradient-text {
    background: linear-gradient(135deg, hsl(var(--accent-from)), hsl(var(--accent-to)));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .accent-glow {
    position: absolute;
    top: -40px; right: -40px;
    width: 260px; height: 160px;
    background: radial-gradient(ellipse at top right, hsl(var(--accent-from) / 0.18), transparent 65%);
    pointer-events: none;
  }
  .hover-lift {
    transition: transform 200ms ease;
  }
  .hover-lift:hover { transform: translateY(-2px); }
  .link-underline { position: relative; }
  .link-underline::after {
    content: "";
    position: absolute;
    left: 0; bottom: -2px;
    width: 100%; height: 1px;
    background: linear-gradient(90deg, hsl(var(--accent-from)), hsl(var(--accent-to)));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 200ms ease;
  }
  .link-underline:hover::after { transform: scaleX(1); }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0   hsl(var(--accent-from) / 0.4); }
    100% { box-shadow: 0 0 0 10px hsl(var(--accent-from) / 0); }
  }
  .animate-pulse-ring { animation: pulse-ring 2s ease-out infinite; }
}

@media (prefers-reduced-motion: reduce) {
  .hover-lift, .link-underline::after { transition: none; }
  .hover-lift:hover { transform: none; }
  .animate-pulse-ring { animation: none; }
}
```

### `src/components/Header.tsx`
- Wrap `Card` content area with a `.accent-glow` decorative `<div aria-hidden>` positioned absolutely inside the card.
- Add `link-underline` to each contact `<a>`.
- Keep existing focus-visible outlines.

### `src/components/WorkExperience.tsx`
- Replace solid timeline line with gradient: `background: linear-gradient(180deg, hsl(var(--accent-from)) 0%, hsl(var(--accent-to)) 30%, hsl(var(--border)) 60%)`.
- Current-role dot: apply `.accent-gradient-bg .animate-pulse-ring`.
- Past-role dot: keep current outline style.
- Current-role date pill: render as shadcn `Badge` with a new `accent` variant (gradient background, white text).
- Wrap each experience `Card` with `.hover-lift`.

### `src/components/techstack-icons/TechStackIcons.tsx`
- Add `transition-transform hover:-translate-y-0.5` to each icon wrapper (respects reduced-motion via global media query).

### `src/components/ui/badge.tsx`
- Run `npx shadcn add badge` if not already present.
- Extend `badgeVariants` with `accent: "border-transparent text-white accent-gradient-bg"` variant.

### `src/components/EducationSection.tsx`
- Minor alignment only: update Card padding/radius if they differ from new conventions. No structural change.

## Interactions

- **Page entrance:** existing `AnimateIn` stagger — Header (0), Experience (0.1), Education (0.2), Certifications (0.3).
- **Current-role dot:** infinite CSS pulse ring (2s).
- **Cards:** 2px translate-up on hover (200ms).
- **Tech badges:** 2px translate-up on hover.
- **Links (contact, cert url):** gradient underline grows left→right on hover; text color darkens via existing `hover:text-primary/80`.
- **Reduced motion:** all transforms/animations disabled via `@media (prefers-reduced-motion: reduce)`.

## Build sequence

Each step is an atomic commit.

1. Add Geist Sans via `next/font/google` (`src/app/fonts.ts` + wire into `layout.tsx`).
2. Override `--primary` and add accent utilities/keyframes in `globals.css`.
3. `npx shadcn add badge`; add `accent` variant to `badgeVariants`.
4. Header: add `.accent-glow` decoration + `link-underline` on contacts.
5. WorkExperience: gradient rail, pulse-ring dot on current, gradient `Badge` for "Current" pill, `hover-lift` on cards.
6. TechStackIcons: hover lift on each icon wrapper.
7. Types: add `CertificationEntry` + optional `certifications` on `ResumeData`.
8. Data: append placeholder `certifications` block to `resume.md` with YAML comment.
9. New `CertificationsSection` component.
10. Wire `CertificationsSection` + `<Separator>` into `page.tsx` with `AnimateIn delay={0.3}`.
11. `prefers-reduced-motion` media query + focus-visible pass.
12. `npm run lint` + `npm run build` + manual dev-server visual QA.

## Verification

- `npm run build` passes with no new errors.
- `npm run lint` (biome) passes.
- `/` renders: glowing header, gradient timeline with pulsing current-role dot, gradient "Current" pill, 4 certification cards with gradient tiles.
- Hover: cards lift, tech badges lift, contact/cert links animate underline.
- `prefers-reduced-motion: reduce` stops pulse + hover transforms.
- No TypeScript/biome errors introduced.
- Visual parity with the approved browser mockup (`final-direction.html`).

## Risks

- Overriding shadcn `--primary` will retint any existing shadcn component that consumes `primary` (currently Badge if added, Separator is unaffected). Verify after step 3.
- Gradient underline on `::after` may collide with existing `hover:underline` on contact links — remove the `hover:underline` class and rely on `.link-underline` only.
- Geist Sans load adds one font request. Acceptable for a single-page resume.
