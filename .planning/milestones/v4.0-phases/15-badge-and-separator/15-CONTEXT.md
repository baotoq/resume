# Phase 15: Badge and Separator - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Swap the hand-rolled fallback pill in `TechStackIcons.tsx` for shadcn `<Badge variant="secondary">` (BADGE-01), and insert structural shadcn `<Separator>` elements between the three top-level resume sections in `page.tsx` (SEP-01). No changes to icon rendering, no changes to inline contact-row dots in Header. Visual clarity — two tiny primitive swaps, nothing else.

</domain>

<decisions>
## Implementation Decisions

### Badge Swap (BADGE-01)
- **D-01:** Replace `<span className="bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5 text-xs">{tech}</span>` (TechStackIcons.tsx:89-91) with `<Badge variant="secondary">{tech}</Badge>`.
  - **Why:** SC#1 locks variant=secondary. Badge primitive already renders `rounded-full px-2 py-0.5 text-xs` by default + `bg-secondary text-secondary-foreground` tokens — same visual shape, theme-aware colors.
  - **How to apply:** Import `Badge` from `@/components/ui/badge`. Fallback branch only. Do NOT wrap the icon-hit branch (SC#2).

### Badge Text Content
- **D-02:** Pass raw `tech` string through to Badge children. No case normalization, no text transform.
  - **Why:** Current pill shows exact tech name. Preserve.

### No Tooltip on Fallback
- **D-03:** Fallback Badge has no hover tooltip. Only TECH_ICON_MAP hits have tooltips today — keep asymmetry.
  - **Why:** Not in requirements. Adding tooltip = new UI capability.

### Separator Placement (SEP-01)
- **D-04:** Insert two horizontal `<Separator />` elements in `src/app/page.tsx` between the three AnimateIn blocks: Header ↔ WorkExperience, and WorkExperience ↔ EducationSection. Two separators, not three.
  - **Why:** SC#3 requires visible structural separators between resume sections. Two gaps between three sections.
  - **How to apply:** Direct children of the `<div className="mx-auto max-w-3xl flex flex-col gap-8">` container.

### Separator Animation Coupling
- **D-05:** Wrap each Separator in `<AnimateIn>` with delay matching the following card — `delay={0.1}` before WorkExperience, `delay={0.2}` before EducationSection.
  - **Why:** AnimateIn stagger animates cards in over time. A bare Separator renders at t=0 and floats alone before the card below enters — visual jank.
  - **How to apply:** `<AnimateIn delay={0.1}><Separator /></AnimateIn>` above WorkExperience's AnimateIn, and `<AnimateIn delay={0.2}><Separator /></AnimateIn>` above EducationSection's AnimateIn.

### Separator Styling
- **D-06:** Use shadcn defaults — `h-px w-full bg-border`. No `className` override, no margin/padding props.
  - **Why:** Parent `flex flex-col gap-8` already provides 32px breathing room on both sides. `--border` token is theme-aware (oklch 0.922) — matches Card borders for visual cohesion.
  - **orientation:** default `horizontal` (SC#3 specifies horizontal).
  - **decorative:** default `true` (no semantic role needed — sections already have `<section>`/`<article>` landmarks).

### Header Inline Dots Preserved (SC#4 Lock)
- **D-07:** Do NOT touch the `·` text separators in `Header.tsx:40` between contact links. They are `<span>` text inside a `flex flex-wrap` row — replacing with `<Separator orientation="vertical">` would break the row flow.
  - **Scope lock:** Phase 15 modifies exactly two files: `src/components/techstack-icons/TechStackIcons.tsx` and `src/app/page.tsx`. Header.tsx is untouched.

### Icon Row Unchanged (SC#2 Lock)
- **D-08:** The icon-hit branch (`TechStackIcons.tsx:77-86`) is untouched. Only the fallback `else` branch gets the Badge swap. TECH_ICON_MAP rows still render `<Icon size={40}>` + group-hover tooltip.

### Separator as Client Component
- **D-09:** `separator.tsx` is marked `"use client"` (radix-ui). `page.tsx` is currently a Server Component reading resume.md at request time. Importing a client component into a Server Component is fine — React serializes the boundary. No refactor to page.tsx.

### Verification Method
- **D-10:** Manual browser check at 375px and 1280px — fallback Badge visible with secondary tokens, two horizontal lines visible between the three cards. Plus `npm run build` and `npm run lint` green (SC#5).

### Claude's Discretion
- Whether to use `AnimateIn` with matching delay for separators, OR bake the separator into the top of the next AnimateIn child (single wrapper per section pair). Default per D-05: separate AnimateIn wrapper.
- Whether the fallback Badge needs the same hover tooltip the icons have — defer unless user asks.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Files to modify
- `src/components/techstack-icons/TechStackIcons.tsx` — line 88-92, fallback `<span>` → `<Badge variant="secondary">`. Add `import { Badge } from "@/components/ui/badge";`.
- `src/app/page.tsx` — add two `<AnimateIn><Separator /></AnimateIn>` blocks between existing AnimateIn children. Add imports for `Separator` and (already imported) `AnimateIn`.

### Files to read (don't modify)
- `src/components/ui/badge.tsx` — primitive, `secondary` variant applies `bg-secondary text-secondary-foreground`
- `src/components/ui/separator.tsx` — primitive, defaults to horizontal `h-px w-full bg-border`
- `src/components/Header.tsx` — confirm inline `·` contacts row stays untouched (SC#4)
- `src/app/globals.css` — confirms `--secondary`, `--secondary-foreground`, `--border` tokens available
- `src/components/animation/AnimateIn.tsx` — delay prop API

### Prior phase artifacts
- `.planning/phases/13-shadcn-infrastructure/13-CONTEXT.md` — D-09 (badge + separator installed), token system
- `.planning/phases/14-card-swap/14-CONTEXT.md` — D-04 (trust shadcn tokens, no override utilities) — same principle applies here

### Requirements
- `.planning/REQUIREMENTS.md` — BADGE-01, SEP-01

### Roadmap
- `.planning/ROADMAP.md` — Phase 15 Success Criteria 1-5

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/badge.tsx` — shadcn Badge, installed Phase 13, `secondary` variant ready
- `src/components/ui/separator.tsx` — shadcn Separator (radix-ui), installed Phase 13
- `src/components/animation/AnimateIn.tsx` — stagger wrapper, supports `delay` prop

### Established Patterns
- Phase 14 locked in trust-the-tokens policy — no `bg-*` overrides on shadcn primitives
- Server Components by default — Separator is `"use client"`, fine to import from RSC
- Tailwind v4 + oklch theme tokens wired in globals.css

### Integration Points
- `src/app/page.tsx` orchestrates all three sections — single file for Separator insertion
- `TechStackIcons.tsx` is rendered inside WorkExperience per-entry rows — fallback pill is per-tech

</code_context>

<specifics>
## Specific Ideas

- Badge visual parity: current fallback is zinc-100 bg / zinc-600 text. `secondary` token in globals.css is oklch near neutral — should look visually similar. Not pixel-identical; accept token-driven delta.
- If bare Separator appears without AnimateIn wrap, it renders instantly at t=0 while WorkExperience card is still fading in — visual jank. D-05 eliminates this.

</specifics>

<deferred>
## Deferred Ideas

- Hover tooltip on fallback Badge — would give parity with icon rows. Defer.
- Using Separator vertical between contact links in Header — blocked by SC#4. Defer forever.
- Dark mode secondary/border token tuning — out of scope, no dark mode yet.

</deferred>

---

*Phase: 15-badge-and-separator*
*Context gathered: 2026-04-24*
