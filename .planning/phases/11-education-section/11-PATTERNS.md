# Phase 11: Education Section - Pattern Map

**Mapped:** 2026-04-24
**Files analyzed:** 3 (1 create, 2 modify)
**Analogs found:** 3 / 3

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/components/EducationSection.tsx` | component | request-response | `src/components/WorkExperience.tsx` | exact |
| `src/types/resume.ts` | model | — | `src/types/resume.ts` (self — existing `EducationEntry`) | exact |
| `src/app/page.tsx` | route/layout | request-response | `src/app/page.tsx` (self — existing AnimateIn blocks) | exact |

## Pattern Assignments

### `src/components/EducationSection.tsx` (component, request-response)

**Analog:** `src/components/WorkExperience.tsx`

**Imports pattern** (lines 1-6):
```typescript
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import type { ExperienceEntry } from "@/types/resume";
import { HighlightedBullet } from "@/components/HighlightedBullet";
import { LogoImage } from "@/components/company-logos/LogoImage";
import { TechStackIcons } from "@/components/techstack-icons/TechStackIcons";
import { computeDuration } from "@/lib/duration";
```

For EducationSection, strip to only what is needed:
```typescript
import type { EducationEntry } from "@/types/resume";
```
No logo, no bullets, no tech stack, no duration — imports should be minimal.

**Props interface pattern** (lines 8-10):
```typescript
interface WorkExperienceProps {
  experience: ExperienceEntry[];
}
```

Mirror for EducationSection:
```typescript
interface EducationSectionProps {
  education: EducationEntry[];
}
```

**`formatDateRange` utility** (lines 12-22):
```typescript
function formatDateRange(start: string, end: string | null): string {
  const formatMonth = (d: string) => {
    const [year, month] = d.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}
```

Copy this function verbatim into `EducationSection.tsx`.

**Section heading pattern** (lines 27-30):
```tsx
<section>
  <h2 className="text-xl font-semibold leading-[1.2] text-zinc-900 mb-6">
    Work Experience
  </h2>
```

Change heading text to `Education`.

**Card style pattern** (line 56):
```tsx
<article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
```

Use this exact class string — no timeline dot, no `relative` wrapper, no `pl-5 sm:pl-7` container.

**Two-column header layout** (lines 59-80):
```tsx
<div className="flex flex-col flex-1 gap-1 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h3 className="font-bold text-blue-600 text-lg">
      {/* company/institution name left */}
    </h3>
    <p className="text-xl font-bold text-zinc-900">
      {/* role/degree left */}
    </p>
  </div>
  <div className="flex flex-col items-end">
    <span className="text-sm font-bold text-zinc-500">
      {formatDateRange(entry.startDate, entry.endDate)}
    </span>
    {/* no computeDuration span — D-02 */}
  </div>
</div>
```

For EducationSection: left column has `degree` (primary, bold zinc-900) and `institution` (secondary, blue-600); right column has date range only (no duration row — decision D-02). Omit logo, omit duration `<span>`.

**Optional details paragraph** (no analog — derived from D-03):
```tsx
{entry.details && (
  <p className="text-base leading-relaxed text-zinc-700">{entry.details}</p>
)}
```

Place below the two-column header, inside the card `<div className="flex flex-col gap-4">`. No `<ul>`, no `HighlightedBullet`.

**Full component skeleton** (assembled from WorkExperience.tsx patterns):
```tsx
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import type { EducationEntry } from "@/types/resume";

interface EducationSectionProps {
  education: EducationEntry[];
}

function formatDateRange(start: string, end: string | null): string {
  const formatMonth = (d: string) => {
    const [year, month] = d.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold leading-[1.2] text-zinc-900 mb-6">
        Education
      </h2>
      <div className="flex flex-col gap-6">
        {education.map((entry, index) => (
          <div key={index}>
            <article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xl font-bold text-zinc-900">{entry.degree}</p>
                    <p className="font-bold text-blue-600 text-lg">{entry.institution}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-zinc-500">
                      {formatDateRange(entry.startDate, entry.endDate)}
                    </span>
                  </div>
                </div>
                {entry.details && (
                  <p className="text-base leading-relaxed text-zinc-700">{entry.details}</p>
                )}
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

### `src/types/resume.ts` (model, —)

**Analog:** Self — existing `EducationEntry` interface (lines 12-19):
```typescript
export interface EducationEntry {
  degree: string;
  institution: string;
  startDate: string; // "YYYY-MM" format
  endDate: string | null; // null renders as "Present"
  logo_url?: string;
  link?: string;
}
```

**Modification:** Add `details?: string` after `endDate`. Pattern for optional string fields in the same file (see `bio?: string` in `ResumeData`, line 27, and `tech_stack?: string[]` in `ExperienceEntry`, line 9):
```typescript
export interface EducationEntry {
  degree: string;
  institution: string;
  startDate: string; // "YYYY-MM" format
  endDate: string | null; // null renders as "Present"
  details?: string; // optional prose rendered as paragraph when present
  logo_url?: string;
  link?: string;
}
```

Note: `logo_url` and `link` remain in the interface (backward-compatible) — they are just not consumed by `EducationSection`.

---

### `src/app/page.tsx` (route/layout, request-response)

**Analog:** Self — existing AnimateIn + component blocks (lines 27-33):
```tsx
<AnimateIn delay={0}>
  <Header resume={resume} email={email} phone={phone} />
</AnimateIn>
<AnimateIn delay={0.1}>
  <WorkExperience experience={resume.experience} />
</AnimateIn>
```

**Import additions** (lines 1-7, current):
```typescript
import { Header } from "@/components/Header";
import { WorkExperience } from "@/components/WorkExperience";
import { AnimateIn } from "@/components/animation/AnimateIn";
```

Add one import line:
```typescript
import { EducationSection } from "@/components/EducationSection";
```

**New AnimateIn block** — append after WorkExperience block (decision D-05, delay={0.2}):
```tsx
<AnimateIn delay={0.2}>
  <EducationSection education={resume.education ?? []} />
</AnimateIn>
```

The `?? []` fallback is required because `ResumeData.education` is typed as `EducationEntry[] | undefined` (line 29 of `resume.ts`).

---

## Shared Patterns

### Card style
**Source:** `src/components/WorkExperience.tsx` line 56
**Apply to:** `EducationSection.tsx` card `<article>`
```tsx
className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
```

### Section heading
**Source:** `src/components/WorkExperience.tsx` lines 28-30
**Apply to:** `EducationSection.tsx` `<h2>`
```tsx
className="text-xl font-semibold leading-[1.2] text-zinc-900 mb-6"
```

### AnimateIn scroll animation
**Source:** `src/components/animation/AnimateIn.tsx` lines 11-22
**Apply to:** `page.tsx` — wrap `<EducationSection>` in `<AnimateIn delay={0.2}>`
```tsx
export function AnimateIn({ children, delay = 0 }: AnimateInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
```
No changes to `AnimateIn.tsx` itself — consume as-is.

### Optional field rendering pattern
**Source:** Derived from `bio` usage pattern in page/component rendering
**Apply to:** `EducationSection.tsx` `details` field
```tsx
{entry.details && (
  <p className="text-base leading-relaxed text-zinc-700">{entry.details}</p>
)}
```

## No Analog Found

None — all three files have close analogs in the existing codebase.

## Metadata

**Analog search scope:** `src/components/`, `src/types/`, `src/app/`
**Files scanned:** 4 (`WorkExperience.tsx`, `resume.ts`, `page.tsx`, `AnimateIn.tsx`)
**Pattern extraction date:** 2026-04-24
