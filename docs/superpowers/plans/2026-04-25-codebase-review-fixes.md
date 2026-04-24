# Codebase Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply six targeted fixes from the 2026-04-25 codebase review (static render, zod frontmatter validation, stable map keys, icon constant extraction, empty `<head>` removal, reduced-motion in `AnimateIn`).

**Architecture:** Each fix is a standalone atomic commit. Order is: low-risk (static render) → schema (biggest change) → cosmetic/a11y. No new features; zero cross-file coupling between tasks.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, zod, vitest, framer-motion, biome.

**Spec:** `docs/superpowers/specs/2026-04-25-codebase-review-fixes-design.md`

**Working directory:** repo root `/Users/baotoquoc-covergo/Work/resume`.

**Global verification between tasks:** `npm run lint && npm run test && npm run build`. Run after every commit.

---

## File Map

**Create:**
- `src/lib/resume-schema.ts` — zod schemas + inferred types (Task 2).

**Modify:**
- `src/app/page.tsx` — add `export const dynamic` (Task 1).
- `src/types/resume.ts` — collapse into re-export from schema (Task 2).
- `src/lib/parse-resume.ts` — call `ResumeSchema.safeParse` (Task 2).
- `src/lib/parse-resume.test.ts` — update existing expectations + add new cases (Task 2).
- `src/components/WorkExperience.tsx` — stable keys; drop biome-ignore (Task 3).
- `src/components/techstack-icons/TechStackIcons.tsx` — color constant; vue simplified (Task 4).
- `src/app/layout.tsx` — drop empty `<head></head>` (Task 5).
- `src/components/animation/AnimateIn.tsx` — reduced-motion branch (Task 6).

**Package:**
- `package.json` / `package-lock.json` — add `zod` (Task 2).

---

## Task 1: Force Static Rendering

**Files:**
- Modify: `src/app/page.tsx` (add export at top of module)

- [ ] **Step 1: Add the export**

Open `src/app/page.tsx`. Directly below the imports (after line 7, before the `export default function Page()` declaration on line 9), add:

```ts
export const dynamic = "force-static";
```

Resulting top of file:

```ts
import { AnimateIn } from "@/components/animation/AnimateIn";
import { CertificationsSection } from "@/components/CertificationsSection";
import { EducationSection } from "@/components/EducationSection";
import { Header } from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { WorkExperience } from "@/components/WorkExperience";
import { parseResumeFile } from "@/lib/parse-resume";

export const dynamic = "force-static";

export default function Page() {
```

- [ ] **Step 2: Verify lint + tests + build**

Run:

```bash
npm run lint
npm run test
npm run build
```

Expected: all pass. Build log shows the `/` route as `○ (Static)` or equivalent static marker.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "$(cat <<'EOF'
chore: force-static render on resume page

Resume content is derived from a checked-in markdown file; render at
build time instead of per request.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Zod Schema Validation for Frontmatter

**Files:**
- Create: `src/lib/resume-schema.ts`
- Modify: `src/lib/parse-resume.ts`
- Modify: `src/types/resume.ts` (collapse to re-export)
- Modify: `src/lib/parse-resume.test.ts` (update existing + add cases)
- Modify: `package.json`, `package-lock.json` (add `zod`)

- [ ] **Step 1: Install zod**

Run:

```bash
npm install zod
```

Expected: `zod` added under `dependencies` in `package.json`, lockfile updated.

- [ ] **Step 2: Run existing tests to establish baseline**

Run:

```bash
npm run test
```

Expected: all tests pass. We will break some intentionally in Step 3.

- [ ] **Step 3: Update `parse-resume.test.ts` with schema-enforcing expectations**

This test file drives the schema design. Replace the file contents with:

```ts
import { describe, expect, it } from "vitest";
import { parseResumeFile, parseResumeString } from "./parse-resume";

describe("parseResumeFile — real resume.md schema guard", () => {
  const resume = parseResumeFile();

  it("has required top-level string fields", () => {
    expect(typeof resume.name).toBe("string");
    expect(resume.name.length).toBeGreaterThan(0);
    expect(typeof resume.title).toBe("string");
    expect(typeof resume.github).toBe("string");
    expect(typeof resume.linkedin).toBe("string");
  });

  it("has a non-empty experience array", () => {
    expect(Array.isArray(resume.experience)).toBe(true);
    expect(resume.experience.length).toBeGreaterThan(0);
  });

  it("every experience entry has the required fields", () => {
    for (const [i, entry] of resume.experience.entries()) {
      expect(typeof entry.company, `experience[${i}].company`).toBe("string");
      expect(typeof entry.role, `experience[${i}].role`).toBe("string");
      expect(entry.startDate, `experience[${i}].startDate`).toMatch(
        /^\d{4}-\d{2}$/,
      );
      expect(
        entry.endDate === null || /^\d{4}-\d{2}$/.test(entry.endDate),
        `experience[${i}].endDate`,
      ).toBe(true);
      expect(Array.isArray(entry.bullets), `experience[${i}].bullets`).toBe(
        true,
      );
      expect(typeof entry.logo_url, `experience[${i}].logo_url`).toBe("string");
      expect(typeof entry.link, `experience[${i}].link`).toBe("string");
    }
  });

  it("skills is a Record<string, string>", () => {
    expect(typeof resume.skills).toBe("object");
    expect(resume.skills).not.toBeNull();
    for (const [key, value] of Object.entries(resume.skills)) {
      expect(typeof key).toBe("string");
      expect(typeof value).toBe("string");
    }
  });
});

describe("parseResumeString — fixtures", () => {
  const minimalValid = `---
name: Jane Doe
title: Engineer
github: https://github.com/jane
linkedin: https://linkedin.com/in/jane
experience: []
skills: {}
---
`;

  it("parses minimal valid frontmatter", () => {
    const data = parseResumeString(minimalValid);
    expect(data.name).toBe("Jane Doe");
    expect(data.experience).toEqual([]);
    expect(data.skills).toEqual({});
  });

  it("throws on malformed YAML", () => {
    const raw = `---
name: "unterminated
---
`;
    expect(() => parseResumeString(raw)).toThrow();
  });

  it("throws when frontmatter is absent", () => {
    expect(() => parseResumeString("no frontmatter here")).toThrow(
      /Invalid resume frontmatter/,
    );
  });

  it("throws with field path when startDate format is wrong", () => {
    const raw = `---
name: X
title: Y
github: g
linkedin: l
skills: {}
experience:
  - company: A
    role: B
    startDate: "Jan 2025"
    endDate: null
    logo_url: /l.svg
    link: https://a
    bullets: ["x"]
---
`;
    expect(() => parseResumeString(raw)).toThrow(
      /experience\.0\.startDate/,
    );
  });

  it("throws when an unknown top-level key is present", () => {
    const raw = `---
name: X
title: Y
github: g
linkedin: l
experience: []
skills: {}
foo: bar
---
`;
    expect(() => parseResumeString(raw)).toThrow(/foo/);
  });
});
```

- [ ] **Step 4: Run tests to confirm they fail as expected**

Run:

```bash
npm run test
```

Expected: new tests fail (schema not implemented yet). Older tests may fail too (no-frontmatter now expects throw). This is correct — we drive the schema next.

- [ ] **Step 5: Create `src/lib/resume-schema.ts`**

Write new file `src/lib/resume-schema.ts`:

```ts
import { z } from "zod";

const yearMonth = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "expected YYYY-MM");

export const ExperienceEntrySchema = z
  .object({
    company: z.string().min(1),
    role: z.string().min(1),
    startDate: yearMonth,
    endDate: yearMonth.nullable(),
    bullets: z.array(z.string().min(1)).min(1),
    logo_url: z.string().min(1),
    link: z.string().min(1),
    tech_stack: z.array(z.string()).optional(),
  })
  .strict();

export const EducationEntrySchema = z
  .object({
    degree: z.string().min(1),
    institution: z.string().min(1),
    startDate: yearMonth,
    endDate: yearMonth.nullable(),
    details: z.string().optional(),
    logo_url: z.string().optional(),
    link: z.string().optional(),
  })
  .strict();

export const CertificationEntrySchema = z
  .object({
    name: z.string().min(1),
    abbrev: z.string().max(4).optional(),
    issuer: z.string().min(1),
    year: z.number().int(),
    url: z.string().optional(),
  })
  .strict();

export const ResumeSchema = z
  .object({
    name: z.string().min(1),
    title: z.string().min(1),
    github: z.string().min(1),
    linkedin: z.string().min(1),
    experience: z.array(ExperienceEntrySchema),
    skills: z.record(z.string(), z.string()),
    bio: z.string().optional(),
    education: z.array(EducationEntrySchema).optional(),
    certifications: z.array(CertificationEntrySchema).optional(),
  })
  .strict();

export type ResumeData = z.infer<typeof ResumeSchema>;
export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>;
export type EducationEntry = z.infer<typeof EducationEntrySchema>;
export type CertificationEntry = z.infer<typeof CertificationEntrySchema>;
```

- [ ] **Step 6: Collapse `src/types/resume.ts` into a re-export**

Replace the entire contents of `src/types/resume.ts` with:

```ts
export type {
  ResumeData,
  ExperienceEntry,
  EducationEntry,
  CertificationEntry,
} from "@/lib/resume-schema";
```

Existing imports like `import type { ResumeData } from "@/types/resume"` continue to work.

- [ ] **Step 7: Wire `parseResumeString` to the schema**

Replace contents of `src/lib/parse-resume.ts` with:

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { type ResumeData, ResumeSchema } from "@/lib/resume-schema";

export function parseResumeString(raw: string): ResumeData {
  const { data } = matter(raw);
  const result = ResumeSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid resume frontmatter:\n${issues}`);
  }
  return result.data;
}

export function parseResumeFile(filePath?: string): ResumeData {
  const resolved = filePath ?? path.join(process.cwd(), "src/data/resume.md");
  const raw = fs.readFileSync(resolved, "utf-8");
  return parseResumeString(raw);
}
```

- [ ] **Step 8: Run tests and build**

Run:

```bash
npm run test
npm run build
```

Expected: all tests pass. Build succeeds — this validates the real `src/data/resume.md` against the schema. If the build fails with `Invalid resume frontmatter`, the schema needs narrowing to match the actual frontmatter shape; read the error paths and adjust the schema in `src/lib/resume-schema.ts` (e.g., loosen a field from required to optional if real data omits it). Do **not** loosen by adding `.passthrough()` — we want strict.

- [ ] **Step 9: Lint**

Run:

```bash
npm run lint
```

Expected: pass. If biome flags import ordering in the modified files, run `npm run format` and re-run lint.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json src/lib/resume-schema.ts src/lib/parse-resume.ts src/lib/parse-resume.test.ts src/types/resume.ts
git commit -m "$(cat <<'EOF'
refactor: validate resume frontmatter with zod

Replace unchecked type cast in parseResumeString with ResumeSchema.
ResumeData is now derived from the schema — single source of truth.
Strict objects reject unknown frontmatter keys so typos fail the
build instead of silently corrupting the rendered resume.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Stable Keys in `WorkExperience`

**Files:**
- Modify: `src/components/WorkExperience.tsx`

- [ ] **Step 1: Remove the biome-ignore header**

Open `src/components/WorkExperience.tsx`. Delete line 1 entirely:

```ts
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
```

File now starts directly with the imports at what is currently line 3.

- [ ] **Step 2: Replace the outer map key**

Find the outer map (currently line 47 onward). Change:

```tsx
{experience.map((entry, index) => {
  const isCurrent = entry.endDate === null;

  return (
    <div key={index} className="relative">
```

To:

```tsx
{experience.map((entry) => {
  const isCurrent = entry.endDate === null;

  return (
    <div key={`${entry.company}-${entry.startDate}`} className="relative">
```

(Drop the unused `index` parameter.)

- [ ] **Step 3: Replace the inner bullet map key**

Find the bullet map (currently line 100 onward). Change:

```tsx
{entry.bullets.map((bullet, i) => (
  <li
    key={i}
    className="..."
  >
    <HighlightedBullet>{bullet}</HighlightedBullet>
  </li>
))}
```

To:

```tsx
{entry.bullets.map((bullet) => (
  <li
    key={bullet}
    className="..."
  >
    <HighlightedBullet>{bullet}</HighlightedBullet>
  </li>
))}
```

(Preserve the existing `className` string verbatim — do not retype it.)

- [ ] **Step 4: Lint, test, build**

Run:

```bash
npm run lint
npm run test
npm run build
```

Expected: all pass. Biome should not flag `noArrayIndexKey` now that index keys are gone.

- [ ] **Step 5: Commit**

```bash
git add src/components/WorkExperience.tsx
git commit -m "$(cat <<'EOF'
refactor: stable keys in WorkExperience map

Drop array-index keys in favor of company+startDate (outer) and
bullet text (inner). Removes the file-wide biome-ignore for
noArrayIndexKey.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Extract React Icon Color; Simplify Vue Entry

**Files:**
- Modify: `src/components/techstack-icons/TechStackIcons.tsx`

- [ ] **Step 1: Add the color constant**

Open `src/components/techstack-icons/TechStackIcons.tsx`. Immediately above the `TECH_ICON_MAP` declaration (currently line 39), add a blank line and the constant:

```ts
const REACT_BLUE = "#0380A2";
```

- [ ] **Step 2: Use the constant in the react entry**

Change line 57:

```ts
react: ({ size }) => <ReactIcon size={size} color="#0380A2" />,
```

To:

```ts
react: ({ size }) => <ReactIcon size={size} color={REACT_BLUE} />,
```

- [ ] **Step 3: Simplify the vue entry**

Change line 58:

```ts
vue: () => <Vuejs size={38} />,
```

To:

```ts
vue: Vuejs,
```

Effect: the caller's `size={40}` (line 81, `<Icon size={40} />`) flows through, matching every other direct-assigned entry.

- [ ] **Step 4: Lint, test, build**

Run:

```bash
npm run lint
npm run test
npm run build
```

Expected: all pass. `TechStackIcons.test.tsx` exercises normalization + fallback; rendering changes are visual-only and should not break existing assertions.

- [ ] **Step 5: Commit**

```bash
git add src/components/techstack-icons/TechStackIcons.tsx
git commit -m "$(cat <<'EOF'
refactor: extract react icon color, simplify vue icon entry

Name the React brand tint as REACT_BLUE. Drop the vue wrapper that
hard-coded size=38; Vuejs now receives the same size=40 every other
icon gets.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Drop Empty `<head>` from Root Layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Delete the empty element**

Open `src/app/layout.tsx`. Remove line 55:

```tsx
<head></head>
```

The `<html>` block becomes:

```tsx
<html
  lang="en"
  className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
>
  <body className="min-h-full flex flex-col">{children}</body>
</html>
```

- [ ] **Step 2: Lint, test, build**

Run:

```bash
npm run lint
npm run test
npm run build
```

Expected: all pass. Next.js injects `<head>` contents from the `metadata` export automatically.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "$(cat <<'EOF'
chore: drop empty head element from root layout

Next.js populates <head> from the metadata export; the hand-written
empty element was redundant.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Honor `prefers-reduced-motion` in `AnimateIn`

**Files:**
- Modify: `src/components/animation/AnimateIn.tsx`

- [ ] **Step 1: Replace the component body**

Replace the entire contents of `src/components/animation/AnimateIn.tsx` with:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimateInProps {
  children: ReactNode;
  delay?: number;
}

export function AnimateIn({ children, delay = 0 }: AnimateInProps) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Lint, test, build, e2e**

Run:

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

Expected: all pass. The e2e smoke asserts page rendering; the reduced-motion branch is exercised only when the OS toggle is on, so default runs hit the motion branch as before.

- [ ] **Step 3: Manual reduced-motion verification**

Enable macOS System Settings → Accessibility → Display → "Reduce motion", then run:

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: sections appear without the slide/fade entrance. Disable the toggle afterward.

- [ ] **Step 4: Commit**

```bash
git add src/components/animation/AnimateIn.tsx
git commit -m "$(cat <<'EOF'
a11y: honor prefers-reduced-motion in AnimateIn

Read framer-motion's useReducedMotion; render a plain div without
whileInView transitions when the user has requested reduced motion.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Post-Plan Verification

- [ ] **Full suite**

```bash
npm run lint
npm run test:all
npm run build
```

Expected: green across the board.

- [ ] **Commit log sanity check**

```bash
git log --oneline -7
```

Expected (bottom-up, newest first):

```
<sha> a11y: honor prefers-reduced-motion in AnimateIn
<sha> chore: drop empty head element from root layout
<sha> refactor: extract react icon color, simplify vue icon entry
<sha> refactor: stable keys in WorkExperience map
<sha> refactor: validate resume frontmatter with zod
<sha> chore: force-static render on resume page
<sha> docs: design for codebase review fixes bundle
```
