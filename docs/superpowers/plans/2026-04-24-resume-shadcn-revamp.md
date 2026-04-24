# Resume shadcn Revamp — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a polished revamp of the single-page resume with a teal→emerald gradient accent system, Geist Sans typography pipeline, shadcn-driven component polish, and a new Certifications section with placeholder data.

**Architecture:** Modify existing SSR page components in place. No new data-fetching or routing. All styling changes are additive CSS utilities on `globals.css` plus small component-level class updates. One new component (`CertificationsSection`) and one schema addition (`CertificationEntry`).

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4 (oklch tokens via `@theme inline`), shadcn/ui (new-york, neutral base), framer-motion (via existing `AnimateIn`), gray-matter (YAML frontmatter), TypeScript, biome.

**Spec:** `docs/superpowers/specs/2026-04-24-resume-shadcn-revamp-design.md`

**Deviations from spec:**
- Spec listed "Add Geist Sans via `next/font`" as Task 1 — **already wired** in `src/app/layout.tsx`. Skipped as a no-op.
- Spec used `hsl()` in CSS var examples — project uses **Tailwind v4 + oklch**. Implementation uses `oklch` for `--primary` and hex in gradient stops (gradients don't need token abstraction).

**Testing strategy:** No test suite is configured in this project (`AGENTS.md` — "No test suite configured"). Each task uses:
1. `npm run lint` — biome must pass
2. `npm run build` — must compile
3. Manual dev-server QA — confirm the change is visible at `http://localhost:3000`

Each task ends with one atomic commit.

---

## File Structure

**Create:**
- `src/components/CertificationsSection.tsx` — renders certifications grid.

**Modify:**
- `src/app/globals.css` — override `--primary`, add accent utilities + keyframes + reduced-motion.
- `src/components/ui/badge.tsx` — add `accent` variant.
- `src/components/ui/card.tsx` — bump radius to `rounded-2xl`.
- `src/components/Header.tsx` — add `.accent-glow` + `.link-underline` on contacts; wrap cleanly.
- `src/components/WorkExperience.tsx` — gradient rail, pulse-ring on current dot, gradient "Current" pill via Badge, `.hover-lift` on cards.
- `src/components/techstack-icons/TechStackIcons.tsx` — add `.hover-lift` on icon/badge wrappers.
- `src/types/resume.ts` — add `CertificationEntry` + optional `certifications` on `ResumeData`.
- `src/data/resume.md` — append placeholder `certifications:` block.
- `src/app/page.tsx` — wire `CertificationsSection` + preceding `<Separator>` inside two `AnimateIn delay={0.3}` wrappers.

**No changes:** `layout.tsx`, `fonts.ts` (Geist already wired), `AnimateIn.tsx`, `HighlightedBullet.tsx`, `EducationSection.tsx` (inherits new Card radius automatically), any `company-logos/*`, any icon files in `techstack-icons/*`.

---

## Task 1: Add accent theme tokens, utilities, and keyframes

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Edit globals.css — override `--primary` to teal and append accent layer**

Replace the existing `--primary` + `--primary-foreground` lines inside `:root` (currently lines 14-15) so they become:

```css
  --primary: oklch(0.704 0.1248 178.87);
  --primary-foreground: oklch(1 0 0);
```

Then **append** the following at the end of the file (after the existing `body { ... }` block):

```css
@layer utilities {
  .accent-gradient-bg {
    background: linear-gradient(135deg, #14b8a6, #10b981);
  }
  .accent-gradient-text {
    background: linear-gradient(135deg, #14b8a6, #10b981);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .accent-glow {
    position: absolute;
    top: -40px;
    right: -40px;
    width: 260px;
    height: 160px;
    background: radial-gradient(
      ellipse at top right,
      rgba(20, 184, 166, 0.18),
      transparent 65%
    );
    pointer-events: none;
  }
  .hover-lift {
    transition: transform 200ms ease;
  }
  .hover-lift:hover {
    transform: translateY(-2px);
  }
  .link-underline {
    position: relative;
  }
  .link-underline::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, #14b8a6, #10b981);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 200ms ease;
  }
  .link-underline:hover::after {
    transform: scaleX(1);
  }
  @keyframes pulse-ring {
    0% {
      box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.45);
    }
    100% {
      box-shadow: 0 0 0 10px rgba(20, 184, 166, 0);
    }
  }
  .animate-pulse-ring {
    animation: pulse-ring 2s ease-out infinite;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hover-lift,
  .link-underline::after {
    transition: none;
  }
  .hover-lift:hover {
    transform: none;
  }
  .animate-pulse-ring {
    animation: none;
  }
}
```

- [ ] **Step 2: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: both commands exit 0 with no new errors.

- [ ] **Step 3: Manual QA**

Run `npm run dev`. Open `http://localhost:3000`. The page should render identically to before (utilities aren't used yet). No visual regression. Stop dev server when done.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add teal→emerald accent utilities + retint --primary"
```

---

## Task 2: Add `accent` Badge variant

**Files:**
- Modify: `src/components/ui/badge.tsx`

- [ ] **Step 1: Edit badge.tsx to add the new variant**

In `src/components/ui/badge.tsx`, inside the `variants.variant` object (currently lines 11-21), add one new entry after `link`:

```ts
        accent:
          "border-transparent text-white accent-gradient-bg [a&]:hover:brightness-110",
```

The full `variants.variant` block becomes:

```ts
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        accent:
          "border-transparent text-white accent-gradient-bg [a&]:hover:brightness-110",
      },
```

- [ ] **Step 2: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/badge.tsx
git commit -m "feat(ui): add accent Badge variant with gradient background"
```

---

## Task 3: Bump Card radius to `rounded-2xl`

**Files:**
- Modify: `src/components/ui/card.tsx`

- [ ] **Step 1: Edit the Card className**

In `src/components/ui/card.tsx`, replace line 10:

Before:
```ts
        "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
```

After:
```ts
        "flex flex-col gap-6 rounded-2xl border bg-card py-6 text-card-foreground shadow-sm",
```

- [ ] **Step 2: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: passes.

- [ ] **Step 3: Manual QA**

Run `npm run dev`. Open `http://localhost:3000`. All cards (Header, each Experience entry, Education) should have visibly larger rounded corners. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/card.tsx
git commit -m "style(ui): bump Card radius from xl to 2xl"
```

---

## Task 4: Header — add accent glow + link-underline hover

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Replace the Header component body with the updated markup**

Overwrite the file contents with:

```tsx
import { Card, CardContent } from "@/components/ui/card";
import type { ResumeData } from "@/types/resume";

interface HeaderProps {
  resume: ResumeData;
  email: string;
  phone: string;
}

export function Header({ resume, email, phone }: HeaderProps) {
  const contacts: { label: string; href: string; text: string }[] = [];
  if (email)
    contacts.push({ label: "Email", href: `mailto:${email}`, text: email });
  if (phone)
    contacts.push({ label: "Phone", href: `tel:${phone}`, text: phone });
  contacts.push({
    label: "GitHub profile",
    href: resume.github,
    text: "GitHub",
  });
  contacts.push({
    label: "LinkedIn profile",
    href: resume.linkedin,
    text: "LinkedIn",
  });

  return (
    <section>
      <Card className="relative overflow-hidden">
        <div className="accent-glow" aria-hidden="true" />
        <CardContent className="relative">
          <h1 className="text-[28px] font-semibold leading-[1.1] text-foreground">
            {resume.name}
          </h1>
          <p className="text-xl font-semibold leading-[1.2] text-foreground mt-1">
            {resume.title}
          </p>
          <div className="flex flex-wrap items-center gap-1 text-base mt-4">
            {contacts.map((c, i) => (
              <span key={c.label}>
                {i > 0 && <span className="text-muted-foreground"> · </span>}
                <a
                  href={c.href}
                  className="link-underline text-primary hover:text-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                  {...(c.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {c.text}
                </a>
              </span>
            ))}
          </div>
          {resume.bio && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {resume.bio}
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
```

Changes from original:
- `Card` gets `relative overflow-hidden` so the glow decoration is clipped.
- New `<div class="accent-glow" aria-hidden>` inside the card (decorative radial gradient).
- `CardContent` gets `relative` so content sits above the glow (stacking context).
- Contact `<a>` tags: removed `hover:underline`, added `link-underline`.

- [ ] **Step 2: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: passes.

- [ ] **Step 3: Manual QA**

Run `npm run dev`. At `http://localhost:3000`:
- Header card has a subtle teal radial glow in the top-right corner.
- Hover over each contact link (Email, GitHub, LinkedIn): a gradient underline grows left→right.
- Link text still darkens on hover.
- Focus-visible outline still works when tabbing.

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat(header): add accent glow + gradient link-underline hover"
```

---

## Task 5: WorkExperience — gradient rail, pulse dot, gradient Current pill, card hover lift

**Files:**
- Modify: `src/components/WorkExperience.tsx`

- [ ] **Step 1: Update imports to include Badge**

At the top of `src/components/WorkExperience.tsx`, add `Badge` to the shadcn imports. Update the import block to:

```ts
import { LogoImage } from "@/components/company-logos/LogoImage";
import { HighlightedBullet } from "@/components/HighlightedBullet";
import { TechStackIcons } from "@/components/techstack-icons/TechStackIcons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { computeDuration } from "@/lib/duration";
import type { ExperienceEntry } from "@/types/resume";
```

- [ ] **Step 2: Replace the timeline rail div**

Find the element (currently lines 37-40):

```tsx
        <div
          className="absolute left-0.75 sm:left-1.75 top-7 bottom-0 w-0.5 bg-border"
          aria-hidden="true"
        />
```

Replace with:

```tsx
        <div
          className="absolute left-0.75 sm:left-1.75 top-7 bottom-0 w-0.5"
          style={{
            background:
              "linear-gradient(180deg, #14b8a6 0%, #10b981 30%, var(--border) 60%)",
          }}
          aria-hidden="true"
        />
```

- [ ] **Step 3: Replace the timeline dot div**

Find the dot element (currently lines 48-55):

```tsx
              <div
                className={`absolute z-10 -left-5.5 sm:-left-6.5 top-5.5 w-3 h-3 rounded-full ${
                  isCurrent
                    ? "bg-primary"
                    : "border-2 border-border bg-background"
                }`}
                aria-hidden="true"
              />
```

Replace with:

```tsx
              <div
                className={`absolute z-10 -left-5.5 sm:-left-6.5 top-5.5 w-3 h-3 rounded-full ${
                  isCurrent
                    ? "accent-gradient-bg animate-pulse-ring"
                    : "border-2 border-border bg-background"
                }`}
                aria-hidden="true"
              />
```

- [ ] **Step 4: Wrap the experience Card in hover-lift and replace the date-range span for current roles with a gradient Badge**

Find the `<Card>` inside the article (currently line 59). Replace `<Card>` with `<Card className="hover-lift">`.

Then find the date block (currently lines 76-87):

```tsx
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-muted-foreground">
                              {formatDateRange(entry.startDate, entry.endDate)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {computeDuration(
                                entry.startDate,
                                entry.endDate,
                                now,
                              )}
                            </span>
                          </div>
```

Replace with:

```tsx
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-sm font-bold text-muted-foreground">
                              {formatDateRange(entry.startDate, entry.endDate)}
                            </span>
                            {isCurrent ? (
                              <Badge variant="accent">Current</Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {computeDuration(
                                  entry.startDate,
                                  entry.endDate,
                                  now,
                                )}
                              </span>
                            )}
                          </div>
```

Rationale: for current roles, duration is less meaningful ("Feb 2025 — Present" already says it's current). Replacing the ambiguous "X yr Y mo" text with a gradient "Current" pill is the signal from the spec.

- [ ] **Step 5: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: passes.

- [ ] **Step 6: Manual QA**

Run `npm run dev`. At `http://localhost:3000`:
- Timeline rail shows a vertical gradient: teal at the top, emerald in the middle, fading to neutral border near the bottom.
- The top (current role, CoverGo) dot is a gradient filled circle with a slow pulsing ring around it.
- Past-role dots remain as outlined circles.
- CoverGo entry shows a gradient "Current" pill instead of the duration text.
- Hover over any experience card: it lifts 2px.
- Hover on tech badges still works (tooltips show).

Stop dev server.

- [ ] **Step 7: Commit**

```bash
git add src/components/WorkExperience.tsx
git commit -m "feat(experience): gradient timeline rail, pulse-ring dot, accent Current badge, card hover lift"
```

---

## Task 6: TechStackIcons — hover lift on each tech pill

**Files:**
- Modify: `src/components/techstack-icons/TechStackIcons.tsx`

- [ ] **Step 1: Add hover-lift to the icon wrapper and the fallback Badge**

In `src/components/techstack-icons/TechStackIcons.tsx`, find the `TechIcon` function (currently lines 74-90). Replace it with:

```tsx
function TechIcon({ tech }: { tech: string }) {
  const key = normalizeTech(tech);
  const Icon = TECH_ICON_MAP[key];

  if (Icon) {
    return (
      <div className="relative group hover-lift">
        <Icon size={40} />
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground border border-border text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none z-10">
          {tech}
        </span>
      </div>
    );
  }

  return <Badge variant="secondary" className="hover-lift">{tech}</Badge>;
}
```

Change: `hover-lift` class added to the icon wrapper `<div>` and the fallback `<Badge>`.

- [ ] **Step 2: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: passes.

- [ ] **Step 3: Manual QA**

Run `npm run dev`. At `http://localhost:3000`, hover over any tech icon or fallback badge (for stack entries without a registered icon). Each one lifts 2px on hover. The tooltip still appears for mapped icons. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/techstack-icons/TechStackIcons.tsx
git commit -m "style(tech-stack): add hover-lift to icons and fallback badges"
```

---

## Task 7: Add CertificationEntry type

**Files:**
- Modify: `src/types/resume.ts`

- [ ] **Step 1: Append CertificationEntry and update ResumeData**

Replace the entire contents of `src/types/resume.ts` with:

```ts
export interface ExperienceEntry {
  company: string;
  role: string;
  startDate: string; // "YYYY-MM" format
  endDate: string | null; // null renders as "Present"
  bullets: string[];
  logo_url: string;
  link: string;
  tech_stack?: string[]; // optional tech stack for Devicon icons
}

export interface EducationEntry {
  degree: string;
  institution: string;
  startDate: string; // "YYYY-MM" format
  endDate: string | null; // null renders as "Present"
  details?: string; // optional prose rendered as paragraph when present
  logo_url?: string;
  link?: string;
}

export interface CertificationEntry {
  name: string;
  abbrev?: string; // up to 4 chars shown on gradient tile; falls back to first 3 chars of name
  issuer: string;
  year: number;
  url?: string;
}

export interface ResumeData {
  name: string;
  title: string;
  github: string;
  linkedin: string;
  experience: ExperienceEntry[];
  skills: Record<string, string>; // category label -> comma-separated values
  bio?: string;
  education?: EducationEntry[];
  certifications?: CertificationEntry[];
}
```

- [ ] **Step 2: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/types/resume.ts
git commit -m "feat(types): add CertificationEntry and optional certifications field"
```

---

## Task 8: Append placeholder certifications to resume.md

**Files:**
- Modify: `src/data/resume.md`

- [ ] **Step 1: Append the certifications block inside the frontmatter**

In `src/data/resume.md`, the frontmatter ends with the `education:` block closing at line 66 (`endDate: "2018-06"`), then the closing `---` on line 67. Insert the new block **before** the closing `---`.

The section to insert (place it on a new line right after `endDate: "2018-06"` and before the closing `---`):

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

- [ ] **Step 2: Verify the frontmatter still parses**

Run: `npm run build`
Expected: build completes. If gray-matter fails to parse, the build will error out — fix indentation (YAML is whitespace-sensitive).

- [ ] **Step 3: Commit**

```bash
git add src/data/resume.md
git commit -m "data: add 4 placeholder certifications (swap with real list later)"
```

---

## Task 9: Create CertificationsSection component

**Files:**
- Create: `src/components/CertificationsSection.tsx`

- [ ] **Step 1: Create the component file**

Create `src/components/CertificationsSection.tsx` with:

```tsx
/** biome-ignore-all lint/suspicious/noArrayIndexKey: stable list from static YAML data */

import { Card, CardContent } from "@/components/ui/card";
import type { CertificationEntry } from "@/types/resume";

interface CertificationsSectionProps {
  certifications: CertificationEntry[];
}

function tileLabel(entry: CertificationEntry): string {
  return entry.abbrev ?? entry.name.slice(0, 3).toUpperCase();
}

function CertTile({ label }: { label: string }) {
  return (
    <div className="accent-gradient-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white font-bold text-xs">
      {label}
    </div>
  );
}

function CertBody({ entry }: { entry: CertificationEntry }) {
  return (
    <div className="flex items-center gap-3">
      <CertTile label={tileLabel(entry)} />
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground truncate">
          {entry.name}
        </div>
        <div className="text-xs text-muted-foreground">
          {entry.issuer} · {entry.year}
        </div>
      </div>
    </div>
  );
}

export function CertificationsSection({
  certifications,
}: CertificationsSectionProps) {
  if (certifications.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold leading-[1.2] text-foreground mb-6">
        Certifications
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certifications.map((entry, index) => {
          if (entry.url) {
            return (
              <a
                key={index}
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-2xl"
              >
                <Card className="hover-lift">
                  <CardContent>
                    <CertBody entry={entry} />
                  </CardContent>
                </Card>
              </a>
            );
          }
          return (
            <Card key={index} className="hover-lift">
              <CardContent>
                <CertBody entry={entry} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/CertificationsSection.tsx
git commit -m "feat(certs): add CertificationsSection with gradient tiles and hover-lift"
```

---

## Task 10: Wire CertificationsSection into the page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace the page contents**

Overwrite `src/app/page.tsx` with:

```tsx
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { AnimateIn } from "@/components/animation/AnimateIn";
import { CertificationsSection } from "@/components/CertificationsSection";
import { EducationSection } from "@/components/EducationSection";
import { Header } from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { WorkExperience } from "@/components/WorkExperience";
import type { ResumeData } from "@/types/resume";

export default function Page() {
  const filePath = path.join(process.cwd(), "src/data/resume.md");
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    console.error("Failed to read resume.md:", err);
    throw new Error("Resume data unavailable");
  }
  const { data } = matter(raw);
  const resume = data as ResumeData;

  const email = process.env.EMAIL ?? "";
  const phone = process.env.PHONE ?? "";

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-8">
      <div className="mx-auto max-w-3xl flex flex-col gap-10">
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
        <AnimateIn delay={0.3}>
          <Separator />
        </AnimateIn>
        <AnimateIn delay={0.3}>
          <CertificationsSection
            certifications={resume.certifications ?? []}
          />
        </AnimateIn>
      </div>
    </main>
  );
}
```

Changes:
- New import for `CertificationsSection`.
- Outer column gap bumped from `gap-8` to `gap-10` (spec token).
- Two new `AnimateIn delay={0.3}` blocks — a `<Separator>` then `<CertificationsSection>` — appended after Education.

- [ ] **Step 2: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: passes.

- [ ] **Step 3: Manual QA**

Run `npm run dev`. At `http://localhost:3000`:
- Scroll to the bottom of the page: a "Certifications" section appears below Education, separated by a `Separator`.
- Grid shows 4 cards (2×2 on desktop, 1×4 on mobile). Each card has a teal-emerald gradient tile (CKA, AWS, AZ, CKAD) on the left and name + issuer · year on the right.
- Hover over each cert card: it lifts 2px.
- Overall spacing between sections feels slightly roomier than before (gap-10).

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(page): wire CertificationsSection and bump section gap to 10"
```

---

## Task 11: Final visual QA sweep

**Files:** none (QA only — any fixups happen inline here)

- [ ] **Step 1: Full build + lint**

Run: `npm run lint && npm run build`
Expected: both clean.

- [ ] **Step 2: Full dev-server browser QA**

Run `npm run dev`. At `http://localhost:3000`, verify in order:

1. **Header:** name/title render with Geist Sans; teal radial glow visible in top-right corner of the card; contacts show underline-grow animation on hover; bio paragraph unchanged.
2. **Timeline:** rail is a teal→emerald→border gradient; CoverGo's dot is gradient-filled with a pulsing ring; past-role dots are outlined circles; CoverGo's date block shows a gradient "Current" pill instead of duration; past roles keep their "X yr Y mo" caption.
3. **Experience cards:** hover lifts 2px; cards have visibly larger rounded corners; tech stack pills still render; each tech pill also lifts on hover; tooltips appear on hover.
4. **Education:** renders as before; inherits new Card radius (softer corners); otherwise unchanged.
5. **Certifications:** 4 cards in 2-column grid; gradient tiles show CKA / AWS / AZ / CKAD; hover lifts each card; the section is preceded by its own Separator.
6. **Animations:** page entrance still staggers (0, 0.1, 0.2, 0.3 delays); feel is slightly more spaced out (gap-10).
7. **Reduced motion check:** in browser devtools, "Emulate CSS prefers-reduced-motion: reduce". Reload. Confirm the pulse ring stops, and hover lifts no longer animate transform. (The framer-motion entrance still animates — out of scope for this revamp.)

- [ ] **Step 3: Responsive QA**

Still in dev mode: narrow the browser to phone width (~390px). Confirm:
- Cert grid collapses to 1 column.
- Header + experience cards still fit; no horizontal scroll.
- Timeline rail still aligned.

- [ ] **Step 4: Stop dev server**

- [ ] **Step 5: If any fixup edits were needed, commit them**

```bash
git add -A
git commit -m "chore: final QA fixups for shadcn revamp"
```

If nothing needed fixing, skip this commit.

- [ ] **Step 6: Summary check**

The branch should have 9-10 new commits (one per task, optionally one QA fixup). Run:

```bash
git log --oneline -11
```

Expected: each commit is self-describing and touches only the files for that task.

---

## Done-when checklist

- [ ] `/` renders with all 4 sections: Header (with glow), Experience (with gradient rail + pulse dot + Current pill), Education, Certifications (with 4 gradient tiles).
- [ ] `npm run lint` and `npm run build` both pass.
- [ ] Hover interactions work on cards, tech badges, and contact/cert links.
- [ ] `prefers-reduced-motion` stops the pulse ring and hover transforms.
- [ ] No TypeScript errors; no biome errors.
- [ ] Visual parity with the approved browser mockup (`final-direction.html` in `.superpowers/brainstorm/`).
