# Add Website Field Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface `https://baotoq.dev` in the resume header as a new pill positioned before GitHub.

**Architecture:** Add an optional `website` field to the Zod resume schema, populate it in `resume.md` frontmatter, and render a new `ContactPill` in `Header.tsx` using the `Globe` icon from `lucide-react` (already imported alongside `Phone`).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Zod, Vitest, gray-matter (existing parsing pipeline), `lucide-react` (icon).

**Spec:** `docs/superpowers/specs/2026-05-05-add-website-field-design.md`

---

## File Structure

| File | Change | Responsibility |
|------|--------|----------------|
| `src/lib/resume-schema.ts` | Modify | Add optional `website` to `ResumeSchema`. |
| `src/data/resume.md` | Modify | Add `website` line to frontmatter. |
| `src/lib/parse-resume.test.ts` | Modify | Assert real-resume `website` field shape. |
| `src/features/page/Header.tsx` | Modify | Render Website pill before GitHub. |

No new files. No new dependencies.

---

## Task 1: Add `website` to schema (TDD)

**Files:**
- Modify: `src/lib/resume-schema.ts:42-54`
- Modify: `src/lib/parse-resume.test.ts:7-13`

- [ ] **Step 1: Write failing test in `parse-resume.test.ts`**

In the existing `"has required top-level string fields"` block (lines 7–13), add an assertion for `website`:

```ts
it("has required top-level string fields", () => {
  expect(typeof resume.name).toBe("string");
  expect(resume.name.length).toBeGreaterThan(0);
  expect(typeof resume.title).toBe("string");
  expect(typeof resume.github).toBe("string");
  expect(typeof resume.linkedin).toBe("string");
  expect(typeof resume.website).toBe("string");
  expect(resume.website).toMatch(/^https?:\/\//);
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm run test -- parse-resume`

Expected: FAIL — `resume.website` is `undefined`, type assertion fails (or TypeScript compile error: property `website` does not exist on `ResumeData`).

- [ ] **Step 3: Add `website` to `ResumeSchema`**

In `src/lib/resume-schema.ts`, modify the `ResumeSchema` block (currently lines 42–54). Insert `website` after `linkedin`:

```ts
export const ResumeSchema = z
  .object({
    name: z.string().min(1),
    title: z.string().min(1),
    github: z.string().min(1),
    linkedin: z.string().min(1),
    website: z.string().min(1).optional(),
    experience: z.array(ExperienceEntrySchema),
    skills: z.record(z.string(), z.string()),
    bio: z.string().optional(),
    education: z.array(EducationEntrySchema).optional(),
    certifications: z.array(CertificationEntrySchema).optional(),
  })
  .strict();
```

- [ ] **Step 4: Add `website` to `resume.md` frontmatter**

In `src/data/resume.md`, after the `linkedin:` line (line 5), insert:

```yaml
website: "https://baotoq.dev"
```

The first 6 lines should now read:

```yaml
---
name: "To Quoc Bao"
title: "Senior Software Engineer"
github: "https://github.com/baotoq"
linkedin: "https://www.linkedin.com/in/baotoq"
website: "https://baotoq.dev"
```

- [ ] **Step 5: Run test, verify pass**

Run: `npm run test -- parse-resume`

Expected: PASS — all `parse-resume.test.ts` cases green, including the new `website` assertion.

- [ ] **Step 6: Commit**

```bash
git add src/lib/resume-schema.ts src/data/resume.md src/lib/parse-resume.test.ts
git commit -m "feat: add optional website field to resume schema and data"
```

---

## Task 2: Render Website pill in Header

**Files:**
- Modify: `src/features/page/Header.tsx:3` (import)
- Modify: `src/features/page/Header.tsx:24-47` (`pills` `useMemo`)

- [ ] **Step 1: Update lucide import**

In `src/features/page/Header.tsx`, change line 3 from:

```ts
import { Phone } from "lucide-react";
```

to:

```ts
import { Globe, Phone } from "lucide-react";
```

- [ ] **Step 2: Insert Website pill in `pills` array**

Replace the entire `pills` `useMemo` block (currently lines 24–47) with:

```ts
const pills = useMemo(
  () =>
    [
      phone && {
        label: "Phone",
        href: `tel:${phone}`,
        text: phone,
        Icon: Phone,
      },
      resume.website && {
        label: "Personal website",
        href: resume.website,
        text: resume.website.replace(/^https?:\/\//, "").replace(/\/$/, ""),
        Icon: Globe,
      },
      {
        label: "GitHub profile",
        href: resume.github,
        text: "GitHub",
        Icon: FaGithub,
      },
      {
        label: "LinkedIn profile",
        href: resume.linkedin,
        text: "LinkedIn",
        Icon: FaLinkedin,
      },
    ].filter(Boolean) as PillLink[],
  [phone, resume.website, resume.github, resume.linkedin],
);
```

Notes:
- Pill order is Phone → Website → GitHub → LinkedIn.
- `text` strips protocol (`https?://`) and trailing slash, so `https://baotoq.dev` displays as `baotoq.dev`.
- The `resume.website &&` guard handles the optional schema field — pill is omitted if absent.
- `resume.website` is added to the `useMemo` dependency array.

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: PASS — no Biome errors.

- [ ] **Step 4: Run unit tests**

Run: `npm run test`

Expected: PASS — full suite green.

- [ ] **Step 5: Run typecheck via build**

Run: `npm run build`

Expected: PASS — Next.js build completes, no TypeScript errors.

- [ ] **Step 6: Visual verify in dev server**

Run: `npm run dev` (background)

Open `http://localhost:3000`. Verify:
- Header shows pills in order: Phone → `baotoq.dev` (Globe icon) → GitHub → LinkedIn.
- Clicking the Website pill opens `https://baotoq.dev` in a new tab (existing `ContactPill` behavior).
- Hover shows the `Personal website` tooltip.
- No console errors.

Stop the dev server after verification.

- [ ] **Step 7: Commit**

```bash
git add src/features/page/Header.tsx
git commit -m "feat(header): render personal website pill before GitHub"
```

---

## Task 3: Run full verification suite

- [ ] **Step 1: Run lint**

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 2: Run all unit tests**

Run: `npm run test`

Expected: PASS — all suites including `parse-resume.test.ts`.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: PASS — clean build output.

- [ ] **Step 4: Run e2e smoke**

Run: `npm run test:e2e`

Expected: PASS — Playwright smoke suite green. If a smoke test asserts pill count or content and fails, update the assertion to include the new Website pill (don't suppress the failure).

- [ ] **Step 5: Final visual sanity check**

Run: `npm run dev` (background). Open `http://localhost:3000`. Confirm header still renders correctly across viewport widths (resize from desktop down to mobile width — `flex-wrap` should keep pills on one or two rows). Stop the dev server.

No commit at this step (verification only).

---

## Out of Scope

- Deploying the site to `baotoq.dev` (DNS, hosting).
- Modifying email/phone surfacing.
- Restyling existing pills.
- Adding a separate website field to `EducationEntry` or `ExperienceEntry`.
