# Pill Button Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace duplicated pill class strings across three pill components with a single shadcn-style `Button` primitive that exposes a `pill` variant via cva.

**Architecture:** Create `src/components/ui/button.tsx` following the existing `badge.tsx` pattern (cva + `radix-ui` umbrella `Slot.Root` + `cn` helper). Define a single `pill` variant whose class string is the current handcrafted pill style. Refactor `ContactPill`, `DownloadResumePill`, `CopyableEmailPill` to compose `Button` (`asChild` for anchor pills, real `<button>` for the copy pill) inside their existing `TooltipTrigger asChild` wrappers. Delete the inline `PILL_CLASSES` constant and the duplicated class strings.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, `class-variance-authority`, `radix-ui` umbrella package (`Slot.Root`), `vitest` + `@testing-library/react`, Biome.

---

## File Structure

- **Create:** `src/components/ui/button.tsx` — shadcn-style `Button` with cva. Single `pill` variant. Supports `asChild` via Radix `Slot.Root`.
- **Modify:** `src/components/pills/DownloadResumePill.tsx` — replace handcrafted `<a className=PILL_CLASSES>` with `<Button asChild variant="pill"><a>…</a></Button>`. Remove `PILL_CLASSES` constant.
- **Modify:** `src/components/pills/ContactPill.tsx` — replace handcrafted `<a className="…">` with `<Button asChild variant="pill"><a>…</a></Button>`.
- **Modify:** `src/components/pills/CopyableEmailPill.tsx` — replace handcrafted `<button className="…">` with `<Button variant="pill" className="pl-3 pr-1 print:pr-3" onClick={…}>`. Asymmetric padding overrides the variant via Tailwind merge.
- **Test (existing, must keep passing):** `src/components/pills/DownloadResumePill.test.tsx` — already asserts role/href/download/data-pdf-trigger/text. Must continue to pass after refactor.
- **Test (new):** `src/components/pills/ContactPill.test.tsx` — smoke test for href / external `target=_blank` / aria-label.
- **Test (new):** `src/components/pills/CopyableEmailPill.test.tsx` — smoke test for button role / aria-label change after click.

No other files change. Do not touch `Header.tsx`, `WorkExperience.tsx`, etc. — they consume the pill components by name and the public API does not change.

---

### Task 1: Create the Button primitive with pill variant

**Files:**
- Create: `src/components/ui/button.tsx`

- [ ] **Step 1: Write the file**

Create `src/components/ui/button.tsx` with this exact content:

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center transition-all disabled:pointer-events-none disabled:opacity-50 outline-none",
  {
    variants: {
      variant: {
        pill:
          "gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-sm text-foreground/80 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
      },
    },
    defaultVariants: {
      variant: "pill",
    },
  },
);

function Button({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? "pill"}
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

Notes for the engineer:
- `radix-ui` umbrella `Slot` is already in this repo's `package.json` (`radix-ui ^1.4.3`) — `badge.tsx` uses `Slot.Root` the same way. Do NOT install `@radix-ui/react-slot` separately.
- Only the `pill` variant is defined. Do not add `default`, `destructive`, `outline`, `ghost`, or `size` variants — YAGNI; nothing in this repo uses them yet, and shipping unused styles violates the project's "minimum code that solves the problem" rule (`AGENTS.md` §Simplicity First).
- The `cursor-pointer` class is intentionally NOT in the variant — real `<button>` already gets a pointer cursor; for `<a asChild>` the anchor pill has `href` so default cursor is correct.

- [ ] **Step 2: Verify it lints and type-checks**

Run: `npm run lint`
Expected: passes (Biome reports no issues for this file).

Run: `npx tsc --noEmit`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/button.tsx
git commit -m "feat(ui): add Button primitive with pill variant"
```

---

### Task 2: Refactor DownloadResumePill (existing test must still pass)

**Files:**
- Modify: `src/components/pills/DownloadResumePill.tsx`
- Test: `src/components/pills/DownloadResumePill.test.tsx` (do NOT modify — it must keep passing as-is)

- [ ] **Step 1: Run the existing test to confirm baseline**

Run: `npm run test -- DownloadResumePill`
Expected: PASS (1 test). This baseline guarantees the refactor keeps behavior.

- [ ] **Step 2: Replace the file contents**

Replace the entire contents of `src/components/pills/DownloadResumePill.tsx` with:

```tsx
"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DownloadResumePill() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild variant="pill">
          <a
            href="/to-quoc-bao-resume-a4.pdf"
            download
            aria-label="Download resume as PDF"
            data-pdf-trigger
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Download PDF</span>
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent>PDF, ready to print</TooltipContent>
    </Tooltip>
  );
}
```

What changed vs. the original:
- Removed the local `PILL_CLASSES` constant.
- Wrapped the `<a>` in `<Button asChild variant="pill">`. Slot composition: `TooltipTrigger asChild` → `Button asChild` → `<a>`. Both `TooltipTrigger` and `Button` use Radix `Slot`, which forwards refs/props correctly when nested.

- [ ] **Step 3: Run the existing test to confirm refactor preserves behavior**

Run: `npm run test -- DownloadResumePill`
Expected: PASS (same test, still passes — same role/href/download/data-attr/text).

- [ ] **Step 4: Commit**

```bash
git add src/components/pills/DownloadResumePill.tsx
git commit -m "refactor(pills): use Button pill variant in DownloadResumePill"
```

---

### Task 3: Add a smoke test for ContactPill, then refactor

**Files:**
- Create: `src/components/pills/ContactPill.test.tsx`
- Modify: `src/components/pills/ContactPill.tsx`

- [ ] **Step 1: Write the failing smoke test**

Create `src/components/pills/ContactPill.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ContactPill, type PillLink } from "./ContactPill";

function StubIcon() {
  return <svg data-testid="icon" />;
}

describe("ContactPill", () => {
  it("renders an external link with target=_blank and aria-label", () => {
    const link: PillLink = {
      label: "GitHub profile",
      href: "https://github.com/example",
      text: "GitHub",
      Icon: StubIcon,
    };
    render(
      <TooltipProvider>
        <ContactPill link={link} />
      </TooltipProvider>,
    );
    const anchor = screen.getByRole("link", { name: /github profile/i });
    expect(anchor).toHaveAttribute("href", "https://github.com/example");
    expect(anchor).toHaveAttribute("target", "_blank");
    expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
    expect(anchor).toHaveTextContent(/github/i);
  });

  it("renders a non-http link without target=_blank", () => {
    const link: PillLink = {
      label: "Phone",
      href: "tel:+15555550100",
      text: "+1 555-555-0100",
      Icon: StubIcon,
    };
    render(
      <TooltipProvider>
        <ContactPill link={link} />
      </TooltipProvider>,
    );
    const anchor = screen.getByRole("link", { name: /phone/i });
    expect(anchor).toHaveAttribute("href", "tel:+15555550100");
    expect(anchor).not.toHaveAttribute("target");
  });
});
```

- [ ] **Step 2: Run the new test against the unchanged component to confirm it passes (it's a smoke test, not a red→green)**

Run: `npm run test -- ContactPill`
Expected: PASS (2 tests). The component already implements this behavior; the test locks it in before the refactor.

- [ ] **Step 3: Replace ContactPill contents**

Replace the entire contents of `src/components/pills/ContactPill.tsx` with:

```tsx
"use client";

import type { ComponentType, SVGProps } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export interface PillLink {
  label: string;
  href: string;
  text: string;
  Icon: IconType;
}

export function ContactPill({ link }: { link: PillLink }) {
  const external = link.href.startsWith("http");
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild variant="pill">
          <a
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            href={link.href}
            aria-label={link.label}
          >
            <link.Icon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{link.text}</span>
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{link.label}</TooltipContent>
    </Tooltip>
  );
}
```

What changed vs. the original:
- Dropped the inline `className="inline-flex items-center gap-1.5 rounded-full border …"` string (~280 chars).
- Wrapped the `<a>` in `<Button asChild variant="pill">`.
- The `PillLink` interface is unchanged — `Header.tsx` still imports it.

- [ ] **Step 4: Run the test again to confirm refactor preserves behavior**

Run: `npm run test -- ContactPill`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/pills/ContactPill.tsx src/components/pills/ContactPill.test.tsx
git commit -m "refactor(pills): use Button pill variant in ContactPill"
```

---

### Task 4: Add a smoke test for CopyableEmailPill, then refactor

**Files:**
- Create: `src/components/pills/CopyableEmailPill.test.tsx`
- Modify: `src/components/pills/CopyableEmailPill.tsx`

- [ ] **Step 1: Write the smoke test**

Create `src/components/pills/CopyableEmailPill.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CopyableEmailPill } from "./CopyableEmailPill";

describe("CopyableEmailPill", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it("renders a button with the email and the copy aria-label", () => {
    render(
      <TooltipProvider>
        <CopyableEmailPill email="user@example.com" />
      </TooltipProvider>,
    );
    const btn = screen.getByRole("button", {
      name: /copy email to clipboard/i,
    });
    expect(btn).toHaveTextContent(/user@example\.com/);
  });

  it("copies the email and updates aria-label when clicked", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <CopyableEmailPill email="user@example.com" />
      </TooltipProvider>,
    );
    await user.click(
      screen.getByRole("button", { name: /copy email to clipboard/i }),
    );
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "user@example.com",
    );
    expect(
      await screen.findByRole("button", { name: /email copied/i }),
    ).toBeInTheDocument();
  });
});
```

Notes:
- `@testing-library/user-event` is already a dev dep in this repo (used by other tests). If `npm run test -- CopyableEmailPill` reports it missing, run `npm install --save-dev @testing-library/user-event` and re-run. Stop and report to the user if any other dep is missing.
- The clipboard mock is per-test via `Object.defineProperty` — happy-dom (the test environment) does not ship a working `navigator.clipboard` by default.

- [ ] **Step 2: Run the test against the unchanged component**

Run: `npm run test -- CopyableEmailPill`
Expected: PASS (2 tests).

- [ ] **Step 3: Replace CopyableEmailPill contents**

Replace the entire contents of `src/components/pills/CopyableEmailPill.tsx` with:

```tsx
"use client";

import { Check, Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface CopyableEmailPillProps {
  email: string;
}

export function CopyableEmailPill({ email }: CopyableEmailPillProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="pill"
          onClick={() => copy(email)}
          aria-label={copied ? "Email copied" : "Copy email to clipboard"}
          className="cursor-pointer pl-3 pr-1 print:pr-3"
        >
          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{copied ? "Copied!" : email}</span>
          <span className="print:hidden inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors">
            {copied ? (
              <Check className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : "Click to copy"}</TooltipContent>
    </Tooltip>
  );
}
```

What changed vs. the original:
- Replaced the handcrafted `<button>` with `<Button variant="pill">` (real `<button>`, no `asChild`).
- Padding override is intentional: pill variant ships `px-3`; this pill needs asymmetric `pl-3 pr-1 print:pr-3` to nest the round inner copy icon. `cn` (from `@/lib/utils`) uses `tailwind-merge`, which resolves `px-3` (variant) + `pl-3 pr-1` (className) by keeping `pl-3 pr-1`. `print:pr-3` is a different breakpoint variant and wins for print.
- Kept `cursor-pointer` explicitly. Real `<button>` already has it by default in most browsers, but the original component has it — keeping for parity (one-line, harmless).
- Removed `type="button"` — shadcn `Button` defaults to a real `<button>` element which already defaults to `type="submit"` inside forms. This component is never inside a form; safe to drop. **If reviewer disagrees, add `type="button"` back as a Button prop — it forwards to the underlying element.**

- [ ] **Step 4: Run the test again to confirm refactor preserves behavior**

Run: `npm run test -- CopyableEmailPill`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/pills/CopyableEmailPill.tsx src/components/pills/CopyableEmailPill.test.tsx
git commit -m "refactor(pills): use Button pill variant in CopyableEmailPill"
```

---

### Task 5: Final verification

**Files:** none modified.

- [ ] **Step 1: Lint**

Run: `npm run lint`
Expected: passes.

- [ ] **Step 2: Full unit test suite**

Run: `npm run test`
Expected: all tests pass, including the 5 new/touched tests above and any pre-existing tests.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds. No new warnings related to `Button` / pills.

- [ ] **Step 4: Dev-server visual smoke test**

Run: `npm run dev`
Open `http://localhost:3000`. Verify:
1. Header shows email pill, phone pill (if `PHONE` env set), GitHub, LinkedIn, Download PDF.
2. Hover any pill → lifts 2px, border becomes primary color, slight shadow appears.
3. Click email pill → "Copied!" appears, check icon swaps in for ~1.5s, then reverts.
4. Click GitHub pill → opens GitHub in new tab.
5. Click Download PDF pill → downloads `/to-quoc-bao-resume-a4.pdf`.
6. Tab through pills with keyboard → focus ring (outline) visible on each pill, matches the previous look.
7. `Cmd+P` print preview → pill copy icon hidden, layout otherwise stable.

If any step fails, stop and report the specific symptom (don't try to patch the variant from inside an executor — bring it back to the planner).

- [ ] **Step 5: Commit if any incidental change was needed**

If steps 1–4 produced no further code changes, no commit needed for Task 5.

---

## Out of Scope

- Avatar/AvatarFallback for `CertTile` in `CertificationsSection.tsx` (was option B in the brainstorm; user picked A).
- Adding shadcn `Separator`, `HoverCard`, or any other primitive.
- Touching `WorkExperience.tsx`, `EducationSection.tsx`, `Header.tsx` internals beyond what the pill imports already give them.
- Adding `default` / `outline` / `ghost` / `size` variants to `Button` — YAGNI; add when the next consumer arrives.

## Self-Review Notes

- **Spec coverage:** Single goal (pill consolidation) → Tasks 1 (primitive) + 2/3/4 (each consumer) + 5 (verify). All three pills accounted for.
- **Placeholder scan:** No TBDs. Each step has the exact code or exact command.
- **Type consistency:** `Button` props `variant?: "pill"`, `asChild?: boolean`, `className?: string` — used identically across Tasks 2–4. `PillLink` interface unchanged.
- **Risk noted:** `CopyableEmailPill` drops `type="button"`; flagged in Task 4 step 3 with a fallback instruction.
