# Feature Landscape — v1.1 Visual Polish

**Domain:** Software engineer resume / CV personal page
**Researched:** 2026-04-13
**Scope:** Company logos per work entry + vertical timeline UI
**Milestone:** v1.1 — adding to existing Header, WorkExperience, Skills + framer-motion + GitHub Pages stack

---

## Existing Component Inventory

Before detailing new features, what's already built and what must change:

| File | Current Role | Change Required for v1.1 |
|------|-------------|--------------------------|
| `src/types/resume.ts` — `ExperienceEntry` | Defines `company`, `role`, `startDate`, `endDate`, `bullets` | Add `logo_url?: string` |
| `src/data/resume.md` | YAML frontmatter; no logo fields | Add optional `logo_url` per entry |
| `src/components/WorkExperience.tsx` | Server Component; renders cards via `flex flex-col gap-6` | Restructure layout for timeline + logo |
| `src/components/AnimateIn.tsx` | Wraps `WorkExperience` in a single `motion.div` | No change needed |
| `src/app/page.tsx` | Passes `resume.experience` to `WorkExperience` | No change needed |
| `next.config.ts` | `output: "export"`, `basePath: "/resume"` | May need `images: { unoptimized: true }` — see Feature 1 |

---

## Feature 1: Company Logos

### What It Is

Each `ExperienceEntry` gains an optional `logo_url` field (absolute URL to a company logo image). When present, the logo renders as a small image in the job card header. When absent or when the image fails to load, a generic briefcase icon renders instead.

### Table Stakes

Behaviors expected if this feature exists at all. Missing any of these makes it feel broken.

| Behavior | Why Expected | Complexity | Notes |
|----------|--------------|------------|-------|
| Logo visible next to company name | The whole point of the feature; must be the first thing visible per card | Low | Positioned in the card header row |
| Briefcase fallback when `logo_url` absent | Most entries won't have a logo initially; naked gap is unprofessional | Low | SVG icon, no external dependency |
| Briefcase fallback when image load fails | External URLs break (company CDN moves, CORS, typos); silent failure looks worse than a fallback | Medium | Requires `onError` handling with React state |
| Fixed, consistent logo size | Different source images (square, wide, tall) must not break card layout | Low | Hard constrain with CSS: `h-8 w-8 object-contain` or similar |
| Logo does not affect card height | Text content drives height; logo is decorative | Low | `flex-shrink-0`, fixed dimensions, `object-contain` |
| Alt text set to company name | Accessibility and screen readers; also shows on broken load in some browsers | Low | `alt={entry.company}` |

### Differentiators

| Behavior | Value Proposition | Complexity | Notes |
|----------|-------------------|------------|-------|
| Rounded corners on logo (`rounded-md`) | Logos look designed rather than raw; matches card's `rounded-xl` visual language | Trivial | One Tailwind class |
| Subtle border or light background behind logo | White logos on white background disappear; a `bg-zinc-100 border border-zinc-200` container prevents invisible logos | Low | Wrap logo in a container div |
| Logo links to company website (optional `href`) | Recruiter can click to verify the company; minimal effort | Low | Only if `logo_url` already implies a company URL; otherwise skip |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Fetching logos automatically from a third-party service (Clearbit, Brandfetch) | Adds external runtime dependency on a paid/rate-limited API; breaks offline; logos may be wrong or outdated | Manual `logo_url` in YAML — user controls quality and updates |
| `next/image` component for external logo URLs | Requires `images: { unoptimized: true }` in `next.config.ts` for static export, AND the fallback state pattern is more complex than a plain `<img>` for what is a small decorative image | Plain `<img>` tag with `onError` state; simpler and sufficient |
| Animated logo entrance (separate from card animation) | The card already animates in via `AnimateIn`; logo-specific animation is noise | No per-logo animation; the existing `AnimateIn` wrapper covers the card |
| Logo size larger than ~40px height | Dominates the card header; company name should be the primary identifier, not the logo | Keep logo to `h-8`–`h-10` (32–40px); company name text remains the anchor |

### Edge Cases

| Edge Case | What Happens Without Handling | Correct Behavior |
|-----------|------------------------------|-----------------|
| `logo_url` is absent (field not in YAML) | Undefined renders nothing; gap in layout | Show briefcase icon in same fixed container |
| `logo_url` is present but image 404s or times out | Browser shows broken-image placeholder; looks broken | `onError` sets state → re-renders with briefcase icon |
| Logo is a very wide wordmark (2:1 or 3:1 ratio) | Overflows its container, breaks alignment | `object-contain` + fixed container dimensions; wordmark shrinks to fit |
| Logo has a transparent background | Fine on white cards; looks good | No handling needed — works by default |
| Logo has a white background on a white card | Logo appears to float with no boundary | Light container background (`bg-zinc-50` or `bg-zinc-100`) + border |
| Logo is an SVG URL | `<img>` handles SVGs fine; `onError` fires if SVG is malformed | No special handling needed |
| Entry has no company name AND no logo | Unlikely but possible with bad YAML | Fallback icon still renders; card header is not empty |

### Implementation Constraint: `next/image` vs `<img>`

`next.config.ts` uses `output: "export"`. Next.js's `<Image>` component with external `src` URLs requires `images: { unoptimized: true }` set in config for static exports — without it, the build throws an error. The `unoptimized` flag disables all image optimization globally, not just for logos.

**Recommendation:** Use a plain `<img>` tag for logos. Rationale:
- Logo images are small (32–40px rendered), so optimization provides no meaningful benefit
- Avoids needing to modify `next.config.ts`
- `onError` fallback is simpler on `<img>` (no React state required for the src swap; state is still needed to toggle the icon, but one `useState` in a small client component is acceptable)
- The logo component will need `"use client"` because `onError` with state requires client-side React

**Confidence: HIGH** — verified via Next.js docs and community discussions; static export + external image URL behavior is well-documented.

### Component Boundary Impact

`WorkExperience.tsx` is currently a Server Component. Adding a logo with `onError` state requires a Client Component. Options:

1. Extract a `CompanyLogo` client component; keep `WorkExperience` as a Server Component. (Recommended — minimal surface area for `"use client"`.)
2. Add `"use client"` to `WorkExperience` itself. (Simpler but makes the whole section a client component, breaking the Server Component pattern established in v1.0.)

Option 1 is preferred. `CompanyLogo` is a leaf component — it has no children that need to be Server Components.

### Data Layer Changes

```yaml
# resume.md — logo_url is optional; omit the field to use briefcase fallback
experience:
  - company: "Stripe"
    logo_url: "https://stripe.com/img/v3/home/twitter.png"
    role: "Senior Software Engineer"
    ...
```

```typescript
// types/resume.ts
export interface ExperienceEntry {
  company: string
  role: string
  startDate: string
  endDate: string | null
  bullets: string[]
  logo_url?: string   // ADD THIS — optional, absent = briefcase fallback
}
```

---

## Feature 2: Vertical Timeline

### What It Is

A visual left-side connector that links all work experience entries: a continuous vertical line runs down the left of the `WorkExperience` section, with a filled circle (dot) positioned at each job entry. This replaces the current `flex flex-col gap-6` layout with a timeline layout container.

### Table Stakes

| Behavior | Why Expected | Complexity | Notes |
|----------|--------------|------------|-------|
| Vertical line connects all entries | The defining visual of a timeline; without it, dots float disconnectedly | Low | CSS `::before` on the container or per-item left border |
| Dot at each entry's header level | Anchors each job to the timeline visually | Low | Absolute-positioned circle at card top-left |
| Line does not extend past the last entry | Trailing line into empty space looks unfinished | Low | Per-item line approach: `group-last:before:hidden` on the last item's line segment |
| Dot and line align vertically | Misalignment looks like a bug | Low | Both use the same `left` offset; dot is centered on the line |
| Mobile layout reads correctly | Timeline must not break narrow viewports | Low | Left-side timeline is already column-oriented; mobile just reduces horizontal padding |
| Cards remain visually separate | Timeline should not make entries look merged | Low | Preserve `gap-6` or equivalent spacing between entries |

### Differentiators

| Behavior | Value Proposition | Complexity | Notes |
|----------|-------------------|------------|-------|
| Dot color matches accent scheme | Subtle polish; dot could be `zinc-400` default or a muted accent color | Trivial | One color decision |
| Dot is hollow ring vs solid fill | Hollow ring (border only) looks more refined than solid fill for a professional resume | Trivial | `ring` + `bg-white` vs `bg-zinc-400` |
| Dot animates in with the card | Since cards already use `AnimateIn`, the dot enters with its card — no extra work needed | None | The dot is inside the card's `AnimateIn` wrapper by construction |
| "Present" entry dot is a different color | Visually marks the current role | Low | Only applies if current role (endDate === null); conditionally apply a different dot color |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Animated line that "draws itself" on scroll | Requires JavaScript scroll tracking; adds complexity and delays content visibility | Static CSS line; the cards animate in via existing `AnimateIn`, which is sufficient |
| Year labels on the timeline line (like a Gantt chart) | Clutters the left margin; date ranges already appear in the card header | Keep dates in the card header only |
| Branching or parallel timelines | Unnecessarily complex for a resume with linear career history | Single vertical line, one entry per row |
| Right-side or alternating timeline (entries on left and right alternating) | Breaks the current card-based layout significantly; bad on mobile | Left-only: line on the far left, cards to the right of the line and dot |

### Edge Cases

| Edge Case | What Happens Without Handling | Correct Behavior |
|-----------|------------------------------|-----------------|
| Single entry (1 job) | Line connects from the dot to... nothing. Looks like a dangling pipe | With per-item line approach: single item is both first and last, so `group-last:before:hidden` suppresses the line entirely. Dot only. Looks intentional. |
| Two entries | Line connects two dots — minimal but correct | No special handling needed |
| Many entries (6+) | Long vertical line; page becomes very long | Expected behavior for a long career; no handling needed |
| Entries with different bullet counts | Cards have different heights; line must span full card height regardless | Per-item line with `h-full` ensures the segment spans the gap below each card |
| Last entry is "Present" (current job) | Line extends past last card if not suppressed | `group-last:before:hidden` on last item's line segment handles this |
| Mobile narrow viewport (320px) | Dot and line must not overlap card text | Left padding on cards (`pl-6` or `pl-8`) keeps text clear of the timeline column |

### Layout Architecture

Current `WorkExperience` layout:
```
<section>                            ← section wrapper
  <h2>Work Experience</h2>
  <div class="flex flex-col gap-6">  ← entry container
    <article>…</article>             ← one card per entry
  </div>
</section>
```

Proposed timeline layout:
```
<section>
  <h2>Work Experience</h2>
  <div class="relative flex flex-col gap-6">   ← position: relative for absolute children
    <div class="group relative pl-8">           ← per-item wrapper; pl-8 = space for dot+line
      <!-- line segment (::before or explicit div) -->
      <div class="absolute left-3 top-4 bottom-0 w-px bg-zinc-200 group-last:hidden" />
      <!-- dot -->
      <div class="absolute left-[10px] top-4 h-2.5 w-2.5 rounded-full border-2 border-zinc-300 bg-white" />
      <!-- card -->
      <article class="rounded-xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">…</article>
    </div>
  </div>
</section>
```

This uses explicit `<div>` elements rather than pseudo-elements because Tailwind v4's arbitrary pseudo-element utilities (`before:` / `after:`) work in v4 the same as v3 — but explicit divs are easier to read, debug, and adjust without arbitrary value syntax.

**Left column measurements (suggested, adjust to taste):**
- Timeline column width: `pl-8` (32px) on the item wrapper
- Line: `left-3` (12px), `w-px` (1px)
- Dot: `left-[10px]`, `h-2.5 w-2.5` (10px circle), centered on the line (`left-3` line center = 12px; dot left edge at 10px, width 10px → dot center at 15px — adjust to `left-[11px]` for exact centering)

Exact pixel values are implementation detail; the pattern is what matters here.

### Mobile Behavior

The left-side timeline is inherently mobile-friendly for this layout:
- Cards are already full-width in a column
- The timeline line + dot occupy the leftmost 32px; cards get `pl-8` to clear them
- At 320px viewport, `max-w-3xl` container still leaves enough room; no responsive breakpoint changes needed for the timeline itself
- The existing `sm:flex-row sm:items-baseline sm:justify-between` inside the card (company/date row) is unaffected by the timeline wrapper

### Interaction with `AnimateIn`

`AnimateIn` wraps the entire `WorkExperience` section, not individual cards. The timeline layout change is internal to `WorkExperience` — `AnimateIn` continues to wrap the section and animate the whole block in on scroll. No change to animation setup.

If per-card stagger is desired later (each card fades in independently), `AnimateIn` would need to wrap individual items inside `WorkExperience`, and `WorkExperience` would need `"use client"`. That is out of scope for v1.1.

---

## Feature Dependencies

```
logo_url field in ExperienceEntry type  →  logo_url optional in resume.md YAML
CompanyLogo client component  →  ExperienceEntry.logo_url type field
WorkExperience layout restructure (timeline)  →  none (independent)
CompanyLogo placement  →  WorkExperience layout restructure (logo goes in card header)
```

The two features (logos and timeline) are independent in implementation but ship together in one WorkExperience component update.

---

## MVP for v1.1

**Build:**
1. Add `logo_url?: string` to `ExperienceEntry` type
2. Document optional `logo_url` in `resume.md` with an example
3. Create `CompanyLogo` client component with `onError` fallback to briefcase SVG
4. Restructure `WorkExperience` to timeline layout (left line + dot per entry, `group-last:hidden` on line)
5. Place `CompanyLogo` in card header alongside company name

**Do not build:**
- Auto-logo fetching from any API
- Per-card scroll animations (existing section-level `AnimateIn` is sufficient)
- Year labels on the timeline
- Animated line drawing

---

## Confidence Assessment

| Claim | Confidence | Source |
|-------|------------|--------|
| `next/image` requires `unoptimized: true` for `output: export` with external URLs | HIGH | Next.js official docs + GitHub discussions |
| `onError` on `<img>` works client-side; state-based fallback pattern | HIGH | React docs pattern; multiple sources agree |
| `"use client"` required for `onError` state in Next.js App Router | HIGH | App Router server/client boundary documentation |
| Per-item line with `group-last:hidden` suppresses trailing line on last entry | HIGH | Verified via Cruip Tailwind timeline implementation |
| Single-entry timeline: dot renders, line suppressed — looks intentional | MEDIUM | Inferred from `group-last:hidden` behavior; not tested against visual design |
| Mobile left-side timeline works at 320px without breakpoint changes | MEDIUM | Based on existing layout being column-oriented; should be verified in browser |

---

## Sources

- [Next.js Image Component — static export + unoptimized](https://nextjs.org/docs/app/api-reference/components/image) — official docs
- [Next.js static export image discussion](https://github.com/vercel/next.js/discussions/60977) — confirms `unoptimized: true` requirement
- [Fallback image in Next.js — DEV Community](https://dev.to/frontenddeveli/configure-fallback-images-in-react-and-nextjs-54ej) — `onError` state pattern
- [Vertical timelines with Tailwind CSS — Cruip](https://cruip.com/3-examples-of-brilliant-vertical-timelines-with-tailwind-css/) — `group-last:before:hidden` pattern for line termination
- [Tailwind CSS Timeline — Flowbite](https://flowbite.com/docs/components/timeline/) — component reference
