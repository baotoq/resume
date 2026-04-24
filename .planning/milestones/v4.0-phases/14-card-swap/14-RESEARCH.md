# Phase 14: Card Swap - Research

**Researched:** 2026-04-24
**Domain:** shadcn/ui Card primitive swap (mechanical refactor)
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01 Semantic Element Preservation:** Preserve existing `<section>` (Header) and `<article>` (WorkExperience/EducationSection) tags. Structure becomes `<section><Card><CardContent>...</CardContent></Card></section>`. Outer wrapper carries NO visual classes. `Card` does not expose `asChild`.
- **D-02 Sub-primitive Scope:** Use only `<Card>` and `<CardContent>`. Do NOT introduce `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardFooter>`, `<CardAction>`. Keep existing `<h1>`/`<h2>`/`<h3>`/`<p>` tags untouched inside `<CardContent>`.
- **D-03 Padding Parity:** Card default `py-6` + CardContent default `px-6` = `p-6` on all sides. No padding overrides.
- **D-04 Color Token Parity:** Trust `--card: oklch(1 0 0)` and `--border: oklch(0.922 0 0)`. Do NOT add `bg-white` or `border-zinc-200` overrides.
- **D-05 Border Radius Delta:** Accept 12px → 14px (`calc(0.625rem * 1.4) = 0.875rem`). Phase 13 gate passed with this radius. No override.
- **D-06 Timeline Dot:** Dot at WorkExperience.tsx:46-53 is outside the card wrapper. Unaffected. Remains sibling div.
- **D-07 Scope Lock:** Only `Header.tsx`, `WorkExperience.tsx`, `EducationSection.tsx` are modified. No changes to `ui/card.tsx` or any other file.
- **D-08 Verification Method:** Manual browser check at 375px and 1280px + `npm run build` + `npm run lint`. No automated visual regression.

### Claude's Discretion
- Pass `className` override on `<Card>` if a gap conflict surfaces (e.g., `gap-0` to kill `gap-6`). Default: no override.
- Whether to remove the redundant `flex flex-col gap-4` wrapper inside the WorkExperience card body (since `<Card>` is itself `flex flex-col gap-6`). **See Finding #2 below — recommendation is to KEEP the inner wrapper.**

### Deferred Ideas (OUT OF SCOPE)
- `CardHeader`/`CardTitle` heading swap (heading semantics would regress).
- Dark mode tokens.
- Hover/focus states on cards.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CARD-01 | Header section wrapper uses shadcn Card primitive instead of hand-rolled `rounded-xl border bg-white` classes | Before/after diff in Finding #1; grep commands in Verification section prove pattern is gone |
| CARD-02 | Each WorkExperience entry card uses shadcn Card primitive | Before/after diff in Finding #1; gap-6 vs gap-4 analysis in Finding #2 |
| CARD-03 | Each EducationSection entry card uses shadcn Card primitive | Before/after diff in Finding #1; `mt-4` preservation noted |
</phase_requirements>

## Summary

This phase is a mechanical 3-file JSX swap. The shadcn `<Card>` primitive at `src/components/ui/card.tsx` composes `flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm` on the outer div and `px-6` on `<CardContent>` — combined, this yields the exact same painted rectangle as the hand-rolled `rounded-xl border border-zinc-200 bg-white p-6 shadow-sm` under the Phase-13 oklch tokens. Only three observable deltas exist:

1. **Radius:** 12px → 14px (accepted in D-05).
2. **Border color:** `border-zinc-200` (`#e4e4e7`) → `oklch(0.922 0 0)`. Hue-neutral at 1px, visually indistinguishable (accepted in D-04).
3. **Card gap:** `<Card>` introduces `gap-6` on its children. In Header and EducationSection the existing markup has zero direct children benefitting from that gap (single child or native margin-based spacing). In WorkExperience, the existing `flex flex-col gap-4` inner wrapper is a direct child of `<CardContent>` — `<Card>`'s `gap-6` never applies to it. **No conflict. No override needed.**

**Primary recommendation:** Execute the swap verbatim per D-01 through D-08. No `className` overrides. No inner wrapper removal. Three targeted JSX edits, one shared import line per file, then build + lint + browser check.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Card styling (border/radius/padding/shadow) | Component (shadcn primitive) | Theme tokens (globals.css) | `<Card>` reads `bg-card`, `border`, `shadow-sm`, `rounded-xl` classes which resolve via Tailwind v4 + CSS tokens at render |
| Semantic landmarks (section/article) | Component (parent wrapper) | — | Landmarks stay on the outer `<section>`/`<article>`; Card is a presentational `<div>` [VERIFIED: src/components/ui/card.tsx:7] |
| Card children rendering (heading, paragraphs, lists) | Component (existing JSX) | — | Moved untouched into `<CardContent>`; no new composition |
| Build-time data flow | Server Component | — | All three files are RSC-safe (no "use client"); Card is a plain forwardRef-free div [VERIFIED: src/components/ui/card.tsx — no "use client" directive] |

## Standard Stack

No new packages. All dependencies installed in Phase 13.

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| shadcn card primitive (src/components/ui/card.tsx) | CLI output from shadcn@4.4.0 | Card + CardContent components | Installed by Phase 13 D-09; Biome-clean; Server Component safe [VERIFIED: Phase 13 VERIFICATION row 6] |
| `cn()` from @/lib/utils | n/a | Class merging for any future override | Available if needed; D-default says don't use it |

**Installation:** None — all infrastructure in place.

## Architecture Patterns

### System Flow

```
src/app/page.tsx (RSC)
   │
   ├── <Header resume email phone>  ──► <section><Card><CardContent>...children...
   │
   ├── <WorkExperience experience>  ──► per-entry: <div.relative><dot/><article><Card><CardContent>...
   │
   └── <EducationSection education> ──► per-entry: <article><Card><CardContent>...
```

All three components are Server Components. `<Card>` is a plain div — zero runtime impact, zero hydration cost. Data flow is unchanged: YAML → `page.tsx` → props → component JSX.

### Pattern: Card Swap (Visual Parity)

**What:** Replace the raw-class wrapper with `<Card><CardContent>`, keeping the existing semantic tag as the outermost element.

**Canonical shape:**
```tsx
// BEFORE
<section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
  {...children}
</section>

// AFTER
<section>
  <Card>
    <CardContent>
      {...children}
    </CardContent>
  </Card>
</section>
```

**Why this works (mathematically):**
- `Card` outer div: `py-6` → vertical padding 24px.
- `CardContent` inner div: `px-6` → horizontal padding 24px.
- Sum: 24px on all four sides = `p-6`. Exact parity.
- `rounded-xl` on Card = `var(--radius-xl)` = `calc(0.625rem * 1.4)` = `0.875rem` = 14px [VERIFIED: src/app/globals.css:53, src/components/ui/card.tsx:10].
- `border` + `--border: oklch(0.922 0 0)` = 1px light-gray border [VERIFIED: src/app/globals.css:23].
- `bg-card` → `--card: oklch(1 0 0)` = pure white, indistinguishable from `bg-white` [VERIFIED: src/app/globals.css:10].
- `shadow-sm` = Tailwind default `0 1px 2px 0 rgb(0 0 0 / 0.05)` on both sides. No change.

### Anti-Patterns to Avoid

- **Swapping to CardHeader/CardTitle:** CardTitle renders a `<div>` (not an `<h*>`) [VERIFIED: src/components/ui/card.tsx:31-39]. Heading semantic regresses. Rejected in D-02.
- **Adding `bg-white` override on Card:** Re-introduces the mixed color system Phase 13 D-02 closed. Rejected in D-04.
- **Removing the outer `<section>`/`<article>`:** Card is a `<div>`, so without the wrapper the document loses its landmark. Rejected in D-01.
- **Removing the `flex flex-col gap-4` inner wrapper in WorkExperience** (tempting since Card has `gap-6`): **Do not do this.** See Finding #2 — Card's `gap-6` is on the `Card` div itself, which has only one child (`CardContent`). It never applies to grandchildren. Removing the wrapper would collapse all the card sections (header row, bullets, tech icons) into a zero-gap stack.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Card wrapper with border + rounded + padding + shadow | Raw `rounded-xl border border-zinc-200 bg-white p-6 shadow-sm` | `<Card><CardContent>` from `@/components/ui/card` | That's the entire point of this phase. Installed in Phase 13, gated, Biome-clean. |

## Runtime State Inventory

N/A — this is a greenfield UI refactor phase. No stored data, no service config, no OS registrations, no secrets, no installed-artifact names reference the hand-rolled class string.

- Stored data: None — verified by phase scope (JSX-only edit).
- Live service config: None.
- OS-registered state: None.
- Secrets/env vars: None — `EMAIL`/`PHONE` env vars are read in Header but unaffected (Finding #1 preserves the contact row JSX verbatim).
- Build artifacts: None — Next.js `.next/` rebuilds from source.

## Findings

### Finding #1 — Concrete Before/After JSX (minimal diff)

#### Header.tsx (CARD-01)

Add import at top:
```tsx
import { Card, CardContent } from "@/components/ui/card"
```

Change line 17 (the opening `<section>`) and line 37 (the closing `</section>`). Everything between stays byte-for-byte identical.

```tsx
// BEFORE (line 17)
<section className="rounded-xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">

// AFTER (line 17 becomes 3 lines)
<section>
  <Card>
    <CardContent>
```

```tsx
// BEFORE (line 37)
</section>

// AFTER (line 37 becomes 3 lines)
    </CardContent>
  </Card>
</section>
```

#### WorkExperience.tsx (CARD-02)

Add import:
```tsx
import { Card, CardContent } from "@/components/ui/card"
```

Change line 56 (opening `<article>`) and line 94 (closing `</article>`). The timeline dot at lines 46-53 and the surrounding `<div className="relative">` stay untouched (D-06). The `<div className="flex flex-col gap-4">` inner wrapper at line 57 **stays** (see Finding #2).

```tsx
// BEFORE (line 56)
<article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">

// AFTER
<article>
  <Card>
    <CardContent>
```

```tsx
// BEFORE (line 94)
</article>

// AFTER
    </CardContent>
  </Card>
</article>
```

#### EducationSection.tsx (CARD-03)

Add import:
```tsx
import { Card, CardContent } from "@/components/ui/card"
```

Change lines 30-33 (opening `<article>`) and line 50 (closing `</article>`). The `key={index}` prop must move to the outermost `<article>` (since it's still the list item root).

```tsx
// BEFORE (lines 30-33)
<article
  key={index}
  className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
>

// AFTER
<article key={index}>
  <Card>
    <CardContent>
```

```tsx
// BEFORE (line 50)
</article>

// AFTER
    </CardContent>
  </Card>
</article>
```

**Note on `mt-4`:** EducationSection.tsx line 46 uses `<p className="mt-4 ...">` for the details paragraph. This margin-top is preserved verbatim inside `<CardContent>` — no interaction with Card's `gap-6` because the details `<p>` is NOT a direct child of `<Card>`; it's a child of `<CardContent>`.

---

### Finding #2 — Card's `gap-6` vs WorkExperience's inner `flex flex-col gap-4`: NO CONFLICT

**Question:** Does Card's `gap-6` clobber the `gap-4` inside WorkExperience's card body?

**Answer:** No. Here's the exact DOM tree after the swap:

```
<article>
  <Card class="flex flex-col gap-6 ...">      ← gap-6 applies to DIRECT children
    <CardContent class="px-6">                ← the ONLY direct child of Card
      <div class="flex flex-col gap-4">       ← direct child of CardContent, not Card
        <div class="flex items-center gap-3"> ← header row
        <ul class="flex flex-col gap-2">      ← bullets
        <TechStackIcons />                    ← tech icons
      </div>
    </CardContent>
  </Card>
</article>
```

Card's `gap-6` controls spacing between `Card`'s own children. Card has exactly one child: `CardContent`. A `gap` rule on a one-child flex container is a no-op. The inner `flex flex-col gap-4` is untouched — it governs the header-row → bullets → tech-icons spacing exactly as before.

**Same analysis for Header and EducationSection:** `CardContent` is the sole child of `Card`, so `gap-6` never triggers. The existing vertical rhythm inside Header (via `mt-1`, `mt-4`) and inside EducationSection (via `mt-4`) is preserved.

**Confidence:** HIGH [VERIFIED: src/components/ui/card.tsx:10 shows `flex flex-col gap-6` on Card, line 68 shows only `px-6` on CardContent].

**Discretion call resolved:** DO NOT remove the `flex flex-col gap-4` wrapper in WorkExperience.tsx. It is not redundant — it is the sole source of gap between the three internal sections of the card body.

---

### Finding #3 — `--card` oklch vs `bg-white` visual equivalence

Token: `--card: oklch(1 0 0)` [VERIFIED: src/app/globals.css:10].

- `oklch(1 0 0)` is L=1.0 (100% lightness), C=0 (zero chroma), H=0 (hue irrelevant at C=0).
- In sRGB this is exactly `rgb(255, 255, 255)` = `#ffffff` = `white`.
- `bg-white` in Tailwind is also `rgb(255, 255, 255)`.

**Pixel-identical.** Zero delta against the `--background: oklch(0.985 0 0)` page background (a very light off-white, rgb ~250,250,250). The card is brighter than the page — same visual contrast as before Phase 13.

**Confidence:** HIGH.

---

### Finding #4 — `--border` oklch vs `border-zinc-200` visual equivalence

Token: `--border: oklch(0.922 0 0)` [VERIFIED: src/app/globals.css:23].

- `oklch(0.922 0 0)` = L=0.922, C=0 (neutral gray), no hue. Approx `rgb(228, 228, 228)` (`#e4e4e4`).
- `zinc-200` in Tailwind = `#e4e4e7` = `rgb(228, 228, 231)` — adds 3 units of blue, a faint cool tint at C≈0.004.

**Delta:** 3/255 = 1.2% difference in the blue channel, chroma gap <0.005 oklch. At 1px border width on a white card over a warm-neutral page, this is below the just-noticeable-difference threshold. Naked eye: indistinguishable.

**Confidence:** HIGH — accepted explicitly in D-04.

---

### Finding #5 — Radius delta risk: 12px → 14px

Phase 13 globals.css line 53: `--radius-xl: calc(var(--radius) * 1.4)` with `--radius: 0.625rem` = `0.875rem` = **14px**.

Default Tailwind `rounded-xl` = `0.75rem` = **12px**.

**Risk assessment:**
- Phase 13 D-11 gate passed visual-parity human verification WITH the 14px radius active on all existing elements that use `rounded-xl` (though there were none in use before Phase 14). So this is the first time the 14px radius will be visible.
- The hand-rolled cards currently render at 12px (before Phase 14). After Phase 14, they will render at 14px.
- 2px radius delta on a 24px-padding card is visible on close inspection but is within normal design-system tolerance.

**Accepted in D-05.** If the user rejects on visual review, the minimal override is `<Card className="rounded-[12px]">` at each swap site, but default per D-05 is NO override.

**Confidence:** HIGH that radius will change; confidence on user acceptance = user's call at manual verification.

---

### Finding #6 — Verification Commands

#### Prove CARD-01/02/03 satisfied (hand-rolled pattern is gone)

**Single grep proves all three:**
```bash
grep -rn "rounded-xl border border-zinc-200 bg-white" src/components/Header.tsx src/components/WorkExperience.tsx src/components/EducationSection.tsx
# Expected: zero matches
```

**Per-requirement verification:**
```bash
# CARD-01 — Header uses Card
grep -c "from \"@/components/ui/card\"" src/components/Header.tsx       # expect 1
grep -c "<Card>" src/components/Header.tsx                              # expect 1
grep -c "rounded-xl border border-zinc-200 bg-white" src/components/Header.tsx  # expect 0

# CARD-02 — WorkExperience uses Card
grep -c "from \"@/components/ui/card\"" src/components/WorkExperience.tsx  # expect 1
grep -c "<Card>" src/components/WorkExperience.tsx                         # expect 1
grep -c "rounded-xl border border-zinc-200 bg-white" src/components/WorkExperience.tsx  # expect 0

# CARD-03 — EducationSection uses Card
grep -c "from \"@/components/ui/card\"" src/components/EducationSection.tsx  # expect 1
grep -c "<Card>" src/components/EducationSection.tsx                         # expect 1
grep -c "rounded-xl border border-zinc-200 bg-white" src/components/EducationSection.tsx  # expect 0

# Scope lock (D-07) — no other components touched
git diff --name-only HEAD -- src/ | grep -v -E "^(src/components/(Header|WorkExperience|EducationSection)\.tsx)$"
# Expected: empty output
```

#### Prove build + lint pass

```bash
npm run build   # exit 0
npm run lint    # exit 0 (biome check)
```

#### Prove semantic tags preserved (D-01)

```bash
grep -c "<section>" src/components/Header.tsx          # expect >=1 (outer wrapper)
grep -c "<article" src/components/WorkExperience.tsx   # expect >=1
grep -c "<article" src/components/EducationSection.tsx # expect >=1
```

## Common Pitfalls

### Pitfall 1: Accidentally removing the inner `flex flex-col gap-4` wrapper in WorkExperience
**What goes wrong:** Header row, bullets list, and tech icons collapse into a zero-gap stack.
**Why it happens:** Reviewer notices Card has `gap-6` and assumes `gap-4` is redundant.
**How to avoid:** Read Finding #2. Card's gap only applies to direct children; `CardContent` is Card's only direct child, so `gap-6` never activates.
**Warning signs:** Visual diff shows card body lines touching each other without breathing room.

### Pitfall 2: Moving `<h1>` into `<CardTitle>`
**What goes wrong:** CardTitle renders a `<div>` — the page loses its `<h1>` landmark. Lighthouse/a11y regression.
**Why it happens:** Looks like the "proper" shadcn composition.
**How to avoid:** D-02 forbids it. Keep headings as-is, render them inside `<CardContent>`.
**Warning signs:** `grep -c "<h1>" src/components/Header.tsx` returns 0 after swap.

### Pitfall 3: Dropping the `key={index}` in EducationSection during the edit
**What goes wrong:** React key warning floods the console; list reconciliation breaks on re-render.
**Why it happens:** The `key` prop currently lives on `<article>` at line 31 — if the refactor puts `<Card>` as the outermost element, the key moves to `<Card>`. But D-01 says keep `<article>` outermost — so key stays on `<article>`.
**How to avoid:** Verify `key={index}` is on the `<article>` after the swap, NOT on `<Card>`.
**Warning signs:** `npm run build` succeeds but dev-mode console shows "Each child in a list should have a unique key prop."

### Pitfall 4: Forgetting the Header `px-6 py-6` → `p-6` mental translation
**What goes wrong:** None. It's the same thing. But the reviewer may flag it as "changed" because the string differs.
**Why it happens:** Header uses split `px-6 py-6` while Work/Education use `p-6`. Card's py-6 + CardContent's px-6 yields p-6 in all three cases. No visual change.
**How to avoid:** N/A — this is a non-pitfall but worth noting for reviewers.
**Warning signs:** None.

### Pitfall 5: Import path case sensitivity
**What goes wrong:** `@/components/ui/Card` (capital C) fails TypeScript resolution on case-sensitive filesystems (Linux CI).
**Why it happens:** macOS is case-insensitive by default; local build succeeds, Vercel build fails.
**How to avoid:** Use lowercase `@/components/ui/card` exactly. The file is at `src/components/ui/card.tsx` [VERIFIED: ls output in Phase 13 verification].
**Warning signs:** Vercel deployment fails with "Cannot find module '@/components/ui/Card'".

## Code Examples

### Minimal `<Card>` usage (from in-repo source)

```tsx
// Source: src/components/ui/card.tsx:5-16 [VERIFIED: in-repo file]
<Card>                           {/* div with flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm */}
  <CardContent>                  {/* div with px-6 */}
    {/* your existing JSX here, unchanged */}
  </CardContent>
</Card>
```

### Full Header after swap

```tsx
// Source: proposed Phase 14 output for src/components/Header.tsx
import type { ResumeData } from "@/types/resume"
import { Card, CardContent } from "@/components/ui/card"

interface HeaderProps {
  resume: ResumeData
  email: string
  phone: string
}

export function Header({ resume, email, phone }: HeaderProps) {
  const contacts: { label: string; href: string; text: string }[] = []
  if (email) contacts.push({ label: "Email", href: `mailto:${email}`, text: email })
  if (phone) contacts.push({ label: "Phone", href: `tel:${phone}`, text: phone })
  contacts.push({ label: "GitHub profile", href: resume.github, text: "GitHub" })
  contacts.push({ label: "LinkedIn profile", href: resume.linkedin, text: "LinkedIn" })

  return (
    <section>
      <Card>
        <CardContent>
          <h1 className="text-[28px] font-semibold leading-[1.1] text-zinc-900">{resume.name}</h1>
          <p className="text-xl font-semibold leading-[1.2] text-zinc-700 mt-1">{resume.title}</p>
          <div className="flex flex-wrap items-center gap-1 text-base mt-4">
            {contacts.map((c, i) => (
              <span key={c.label}>
                {i > 0 && <span className="text-zinc-400"> · </span>}
                <a
                  href={c.href}
                  className="text-indigo-600 hover:text-indigo-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
                  {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {c.text}
                </a>
              </span>
            ))}
          </div>
          {resume.bio && (
            <p className="mt-4 text-base leading-relaxed text-zinc-600">{resume.bio}</p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hand-rolled card utility classes | shadcn Card primitive with theme tokens | Phase 13 installed tokens; Phase 14 adopts | Single source of truth for card styling; future dark-mode/theme swaps change only tokens |
| `rounded-xl` = 12px (Tailwind default) | `rounded-xl` = 14px (via `--radius-xl` override in Phase 13 globals.css:53) | Phase 13 | Cards round 2px more than Tailwind default |

**No deprecations.** Hand-rolled pattern remains technically valid but is being retired for this milestone.

## Assumptions Log

No `[ASSUMED]` claims in this research. Every factual claim is tagged `[VERIFIED: <file:line>]` against in-repo source, Phase 13 verification artifacts, or the locked CONTEXT.md decisions.

## Open Questions

1. **User acceptance of the 2px radius bump (12px → 14px)**
   - What we know: Phase 13 D-11 approved the `--radius-xl` override; D-05 inherits acceptance.
   - What's unclear: Whether the user will accept the visual at manual browser review when the cards actually render.
   - Recommendation: Proceed with no override. If rejected at D-08 manual check, add `<Card className="rounded-[12px]">` (three one-word edits).

2. **Whether `<CardContent>` is strictly required on a Card with no header/footer**
   - What we know: Card outer has `py-6`, `CardContent` has `px-6`. Without `CardContent`, horizontal padding would be missing.
   - What's unclear: Nothing — CardContent IS required for `p-6` parity.
   - Recommendation: Always include `<CardContent>`. Documented as D-03.

## Environment Availability

N/A — no new external dependencies. All shadcn infrastructure verified available by Phase 13 VERIFICATION rows 1-6.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `@/components/ui/card` | All 3 files | ✓ | n/a | none needed |
| `@/lib/utils` (cn) | Optional overrides | ✓ | n/a | none needed |
| `npm run build` (Next.js 16) | Verification gate | ✓ | 16.x | none |
| `npm run lint` (Biome) | Verification gate | ✓ | installed | none |

## Validation Architecture

Nyquist validation is enabled (`workflow.nyquist_validation: true`). No test framework is installed in this project (`AGENTS.md`: "No test suite configured").

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed |
| Config file | None |
| Quick run command | `npm run lint` (Biome check — ~1s) |
| Full suite command | `npm run build && npm run lint` (~15s) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CARD-01 | Header uses `<Card>`, hand-rolled classes gone | static grep | `grep -c "rounded-xl border border-zinc-200 bg-white" src/components/Header.tsx` = 0 AND `grep -c "<Card>" src/components/Header.tsx` >= 1 | N/A (grep on source) |
| CARD-02 | WorkExperience uses `<Card>`, hand-rolled classes gone | static grep | same pattern vs `src/components/WorkExperience.tsx` | N/A |
| CARD-03 | EducationSection uses `<Card>`, hand-rolled classes gone | static grep | same pattern vs `src/components/EducationSection.tsx` | N/A |
| CARD-01/02/03 | Build still compiles | build | `npm run build` exits 0 | N/A |
| CARD-01/02/03 | Lint clean | lint | `npm run lint` exits 0 | N/A |
| CARD-01/02/03 | Visual parity at 375px + 1280px | manual-only | `npm run dev`, browser @ 375px and 1280px, compare to pre-phase screenshot | manual |

**Manual-only justification:** Visual regression testing requires either screenshot-diff infrastructure (Playwright + Percy/Chromatic) or human eyes. No such infrastructure exists in this repo and installing it is out of scope (would be a separate infrastructure phase). D-08 explicitly accepts manual verification.

### Sampling Rate
- **Per task commit:** `npm run lint` on modified file(s)
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** Full suite green + manual browser check at 375px and 1280px before `/gsd-verify-work`

### Wave 0 Gaps
- None — no test infrastructure to create. Grep-based static verification and existing build+lint pipeline cover all automatable checks. Visual parity is inherently manual.

## Security Domain

`security_enforcement` not set in config.json — treating as enabled per mandatory default, but applicability is near-zero for this phase.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Static resume site; no auth |
| V3 Session Management | no | No sessions |
| V4 Access Control | no | Public site |
| V5 Input Validation | no | No user input in this phase — JSX-only edit, no new data paths |
| V6 Cryptography | no | No crypto |

### Known Threat Patterns for this phase

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via Card children | Tampering / Information Disclosure | No user-controlled strings are added. All children are existing JSX moved verbatim. React's default escaping applies. HighlightedBullet's existing dangerouslySetInnerHTML-equivalent (if any) is NOT in scope — not touched. |

**Security risk level:** Negligible. This is a classname-to-component refactor with no new data surface.

## Sources

### Primary (HIGH confidence)
- `src/components/ui/card.tsx` lines 5-72 — Card and CardContent exact class strings [in-repo verification]
- `src/app/globals.css` lines 7-54 — `--card`, `--border`, `--radius-xl` token values [in-repo verification]
- `src/components/Header.tsx` (full file, 40 lines) — before-state line numbers
- `src/components/WorkExperience.tsx` (full file, 102 lines) — before-state line numbers + timeline dot location
- `src/components/EducationSection.tsx` (full file, 56 lines) — before-state line numbers + `key={index}` location
- `.planning/phases/13-shadcn-infrastructure/13-CONTEXT.md` — prior-phase decisions (D-02 color system, D-09 component install, D-11 gate)
- `.planning/phases/13-shadcn-infrastructure/13-VERIFICATION.md` — Phase 13 infrastructure gate, 9/10 verified
- `.planning/phases/14-card-swap/14-CONTEXT.md` — all 8 locked decisions for this phase
- `.planning/REQUIREMENTS.md` — CARD-01/02/03 definitions
- `AGENTS.md` — project commands + "no test suite"

### Secondary (MEDIUM confidence)
- None needed — all decisions are derivable from in-repo source.

### Tertiary (LOW confidence)
- None. Context7 docs lookup was not required; the shadcn Card source file is physically present in the repo and fully readable.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all dependencies verified present in Phase 13 VERIFICATION.md
- Architecture: HIGH — Card is a plain RSC-safe div; swap is mechanical
- Padding/color/gap math: HIGH — derived from in-repo source class strings
- Radius delta: HIGH factual; MEDIUM on user acceptance (manual gate)
- Pitfalls: HIGH — each grounded in a specific file:line observation

**Research date:** 2026-04-24
**Valid until:** 2026-05-24 (stable — in-repo sources won't drift unless someone edits ui/card.tsx or globals.css, which is out of scope per D-07)
