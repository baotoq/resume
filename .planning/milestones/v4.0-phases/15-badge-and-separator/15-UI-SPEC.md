# Phase 15: Badge and Separator — UI Design Contract

**Date:** 2026-04-24
**Phase:** 15-badge-and-separator
**Scope:** Visual/interaction spec for BADGE-01 and SEP-01. Derived from 15-CONTEXT.md and 15-RESEARCH.md.

## Design Tokens Used

| Token | Value | Source | Consumer |
|-------|-------|--------|----------|
| `--secondary` | `oklch(0.97 0 0)` | globals.css (Phase 13) | Badge background |
| `--secondary-foreground` | `oklch(0.205 0 0)` | globals.css (Phase 13) | Badge text |
| `--border` | `oklch(0.922 0 0)` | globals.css (Phase 13) | Separator line color |
| `--radius-xl` | `calc(0.625rem * 1.4)` = 14px | globals.css (Phase 13) | n/a for this phase |

No new tokens. No token overrides.

## Per-File JSX Contract

### File 1: `src/components/techstack-icons/TechStackIcons.tsx`

**Target change region:** `TechIcon` function, fallback `return` branch only (currently lines 88-92).

**Preservation contract (MUST NOT change):**
- Line 1-28: all imports.
- Lines 30-36: `TechStackIconsProps`, `IconComponent` types.
- Lines 38-67: `TECH_ICON_MAP`.
- Lines 69-71: `normalizeTech`.
- Lines 73-86: icon-hit branch (`if (Icon)` return) — includes `<div className="relative group">`, `<Icon size={40} />`, and the absolute-positioned tooltip `<span>`. **This branch is SC#2-locked — no changes.**
- Lines 95-105: `TechStackIcons` wrapper component.

**Add:**
- New import: `import { Badge } from "@/components/ui/badge";` — placed after the icon-component imports, grouped with UI primitive imports. Exact position determined by Biome import-order rule; run `npm run format` after edit.

**Replace (fallback branch only, current lines 88-92):**

BEFORE:
```tsx
return (
  <span className="bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5 text-xs">
    {tech}
  </span>
);
```

AFTER:
```tsx
return <Badge variant="secondary">{tech}</Badge>;
```

**Rationale:**
- Badge default classes already include `rounded-full px-2 py-0.5 text-xs font-medium inline-flex items-center` — matches hand-rolled shape. `font-medium` is a slight upgrade from default text weight; accept per token-trust policy.
- `variant="secondary"` applies `bg-secondary text-secondary-foreground` — theme-aware equivalent of `bg-zinc-100 text-zinc-600`.
- No `className` prop override — trust defaults (Phase 14 D-04 precedent).

### File 2: `src/app/page.tsx`

**Target change region:** The three-child `<div className="mx-auto max-w-3xl flex flex-col gap-8">` container. Currently renders three `<AnimateIn>` children wrapping Header, WorkExperience, EducationSection.

**Preservation contract (MUST NOT change):**
- `main` tag and its classes: `min-h-screen bg-zinc-50 py-12 px-4 sm:px-8`.
- The outer `<div className="mx-auto max-w-3xl flex flex-col gap-8">` container.
- Each existing `<AnimateIn>` wrapper and its `delay` prop: 0, 0.1, 0.2.
- The three section components and their props: `<Header>`, `<WorkExperience>`, `<EducationSection>`.
- The resume-data read logic (`fs.readFileSync`, `matter(raw)`).

**Add:**
- New import: `import { Separator } from "@/components/ui/separator";` — grouped with `@/components/*` imports. Run `npm run format` after edit.

**Insert two `<AnimateIn><Separator /></AnimateIn>` blocks:**

BEFORE:
```tsx
<div className="mx-auto max-w-3xl flex flex-col gap-8">
  <AnimateIn delay={0}>
    <Header resume={resume} email={email} phone={phone} />
  </AnimateIn>
  <AnimateIn delay={0.1}>
    <WorkExperience experience={resume.experience} />
  </AnimateIn>
  <AnimateIn delay={0.2}>
    <EducationSection education={resume.education ?? []} />
  </AnimateIn>
</div>
```

AFTER:
```tsx
<div className="mx-auto max-w-3xl flex flex-col gap-8">
  <AnimateIn delay={0}>
    <Header resume={resume} email={email} phone={phone} />
  </AnimateIn>
  <AnimateIn delay={0.1}>
    <Separator />
  </AnimateIn>
  <AnimateIn delay={0.1}>
    <WorkExperience experience={resume.experience} />
  </AnimateIn>
  <AnimateIn delay={0.2}>
    <Separator />
  </AnimateIn>
  <AnimateIn delay={0.2}>
    <EducationSection education={resume.education ?? []} />
  </AnimateIn>
</div>
```

**Rationale:**
- Separator before WorkExperience uses `delay={0.1}` — matches the card that follows it, so they animate in as a coordinated unit.
- Separator before EducationSection uses `delay={0.2}` — same pattern.
- No `className` override on `<Separator />` — defaults produce `h-px w-full bg-border`.
- Parent `gap-8` container provides 32px breathing room above and below each Separator.

## Out-of-Scope Files (Scope Lock)

These files MUST NOT be touched in Phase 15:

- `src/components/Header.tsx` — SC#4 locks inline `·` text dots (no vertical Separator).
- `src/components/WorkExperience.tsx` — no Badge usage, no Separator insertion.
- `src/components/EducationSection.tsx` — no Badge usage, no Separator insertion.
- `src/components/ui/badge.tsx`, `src/components/ui/separator.tsx` — primitives are Phase 13 artifacts, no changes.
- `src/app/globals.css` — no new tokens needed.

## Responsive Behavior

- **375px (mobile):** Badge pills wrap naturally via existing `flex flex-wrap gap-2 justify-center` in `TechStackIcons` wrapper. Separators are `w-full` (= card container width = viewport width minus `px-4` padding). No overflow expected.
- **1280px (desktop):** Max-width container `max-w-3xl` (= 768px) centers; Separators span 768px. Badge fallback pills inline within each work-entry tech row.

## Animation Contract

- Each Separator animates in tied to the card that follows it (same AnimateIn delay).
- `AnimateIn` component (existing, `src/components/animation/AnimateIn.tsx`) handles the fade/slide-up — no props other than `delay` are passed.
- No new keyframes, no CSS additions.

## Accessibility

- **Badge:** Rendered as `<span>` (inline); no interactive affordance. Text content is the tech name. Screen readers read it inline with surrounding work-entry context.
- **Separator:** `decorative={true}` by default — Radix sets `role="none"` so assistive tech ignores the line (semantically redundant since `<section>`/`<article>` landmarks already delimit the resume regions). Visual line remains for sighted users.

## Verification Anchors

- BADGE-01: `grep -c '<Badge variant="secondary">' src/components/techstack-icons/TechStackIcons.tsx` → `≥ 1`.
- BADGE-01 cleanup: `grep -c 'bg-zinc-100 text-zinc-600 rounded-full' src/components/techstack-icons/TechStackIcons.tsx` → `0`.
- BADGE-01 scope: `grep -c '<Badge' src/components/techstack-icons/TechStackIcons.tsx` → `1` (fallback branch only, not icon branch).
- SEP-01: `grep -c '<Separator />' src/app/page.tsx` → `2`.
- SEP-01 import: `grep -c 'from "@/components/ui/separator"' src/app/page.tsx` → `1`.
- Scope lock: `git diff --name-only HEAD~3 HEAD | grep -c 'components/Header.tsx'` → `0` (Header untouched).

## Sign-Off

Design contract locked. Planner can produce implementation plans against this spec.
