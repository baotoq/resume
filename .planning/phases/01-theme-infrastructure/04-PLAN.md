# Plan 04: Integrate ThemeToggle into Header

---
wave: 2
depends_on: [01-PLAN, 03-PLAN]
files_modified:
  - src/components/resume/Header.tsx
  - src/app/page.tsx
autonomous: true
---

## Objective

Add the ThemeToggle component to the Header, positioned far right after the PDF download button. The toggle should be hidden in print mode and maintain the existing header layout.

## Tasks

<task id="4.1">
Update Header component to accept optional themeToggle prop

Modify `src/components/resume/Header.tsx`:

```typescript
interface HeaderProps {
  name: string;
  title: string;
  contact: ContactInfo;
  pdfButton?: ReactNode;
  themeToggle?: ReactNode;  // Add this
}

export function Header({ name, title, contact, pdfButton, themeToggle }: HeaderProps) {
  // ... existing code ...
  
  {/* PDF Button and Theme Toggle */}
  <div className="no-print flex justify-center md:justify-end items-center gap-3">
    {pdfButton}
    {themeToggle}
  </div>
```

Key changes:
- Add `themeToggle` prop to interface
- Add `items-center` to flex container
- Add `gap-3` for spacing between buttons
- Keep both in `no-print` container
</task>

<task id="4.2">
Update page.tsx to pass ThemeToggle to Header

Modify `src/app/page.tsx`:

```typescript
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// In ResumePage component:
<Header
  name={mainInfo.name}
  title={mainInfo.title}
  contact={contactInfo}
  pdfButton={<PDFExportButton contentRef={resumeRef} />}
  themeToggle={<ThemeToggle />}
/>
```
</task>

<task id="4.3">
Verify toggle positioning and print behavior

- Toggle appears after PDF button on desktop
- Toggle is centered with PDF button on mobile
- Both elements hidden when printing (`.no-print` class)
- No layout shift when toggle renders
</task>

## Verification

- [ ] ThemeToggle imported in page.tsx
- [ ] ThemeToggle passed to Header component
- [ ] Toggle appears to the right of PDF button
- [ ] Proper spacing between PDF button and toggle
- [ ] Toggle hidden in print preview
- [ ] Mobile layout maintains centered alignment
- [ ] No visual regressions in header

## Must-Haves (Goal-Backward)

- Toggle positioned far right, after PDF button
- Hidden in print mode
- Responsive layout preserved
- No breaking changes to existing header functionality

---

*Plan created: 2026-01-31*

