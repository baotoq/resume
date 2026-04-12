# Feature Landscape

**Domain:** Software engineer resume / CV personal page
**Researched:** 2026-04-12
**Scope:** Work experience section, skills section, PDF download, Vercel deployment

---

## Table Stakes

Features recruiters and hiring managers expect. Missing = product feels incomplete or unprofessional.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Name + title header | First thing scanned; must be immediately legible | Low | Large name, current title, location optional |
| Contact bar | Email, GitHub, LinkedIn — recruiters need to reach you | Low | Inline row under name; icon + text links |
| Work experience section | Core of the resume; chronological, reverse order | Medium | Companies, titles, date ranges, bullet points |
| Skills section | Recruiters keyword-match this against job descriptions | Low | Categorized, not a flat tag cloud |
| PDF download button | Recruiters share and store PDFs; non-negotiable | Medium | Must match web design; not a separate layout |
| Responsive layout | Mobile and desktop readable; recruiters open on both | Low | Single-column on mobile, wider margins on desktop |
| Clean visual hierarchy | Recruiter scans in 6-10 seconds; must direct the eye | Medium | Name > company > role > bullets; not decoration |
| Fast load time | Delays kill first impressions | Low | Static page; no backend; fast by default on Vercel |

---

## Differentiators

Features that make the page memorable without being gimmicky. Not expected, but valued by engineering reviewers.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Light / dark mode toggle | Engineering craft signal; comfortable in any context | Low-Med | System preference as default; manual toggle optional |
| Subtle accent color | Makes the page feel designed rather than templated | Low | One color — muted green, blue, or amber — used sparingly on links, section labels |
| Sticky / fixed header with name | Keeps identity visible while scrolling | Low | Optional; avoid if it takes vertical space on mobile |
| "Copy email" click-to-copy | Frictionless contact; small craft detail | Low | Tiny JS; shows a transient tooltip |
| Skill category grouping | Instantly scannable for both ATS and humans | Low | Categories: Languages, Frameworks, Databases, Tools/Cloud — not a proficiency bar chart |
| Print-optimized CSS that matches web layout | PDF looks exactly like the website; no jarring switch | Medium | `@media print` rules; no separate PDF template needed |
| Duration labels on roles | Engineers appreciate precision ("2 yr 4 mo") | Low | Computed from date range; not just "2020–2022" |

---

## Anti-Features

Features to explicitly NOT build — they either hurt credibility or waste effort.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Animated typing effect on name/title | Gimmicky; delays information delivery; annoys returning visitors | Static name in large type; typography does the work |
| Skill progress bars / percentage ratings | Meaningless (what does "JavaScript: 90%" mean?); recruiters ignore them; engineers distrust them | Categorized plain text list; add "(primary)" annotation if needed |
| Parallax scrolling / scroll animations on content | Distracting; hurts ATS parsability if JS-gated; slows perceived load | Use whitespace and typography for rhythm instead |
| Project carousel or heavy gallery | Out of scope per PROJECT.md; adds complexity with no recruiter ROI for this phase | Link to GitHub in header; add projects section later if needed |
| Particle / canvas background | No signal value; increases load; pattern-matches to student projects | Plain background with subtle texture or solid color |
| Chat widget / contact form | Backend needed; breaks static constraint; recruiters use email | Email link with mailto: href |
| Multi-page navigation (About, Work, Skills as separate routes) | Recruiters expect a scrollable single page; breaks PDF flow | One scrollable page; anchor links only if page is very long |
| Testimonials / endorsements section | Uncommon in SWE resumes; looks off-genre | Skip entirely |
| "Currently open to work" badge | Reduces perceived leverage | Omit; implied by sharing the resume |

---

## Recruiter vs. Engineer Priorities

Understanding the two audiences determines content and design decisions.

### What Recruiters (non-technical) actually scan for

1. **Company names** — recognizable brands catch the eye first
2. **Job titles** — seniority signal; must match the role they're filling
3. **Years of experience** — total tenure at a glance
4. **Keywords in skills** — ATS and manual match against job description
5. **Contact info** — email must be immediately clickable

Recruiters spend 6-10 seconds on initial scan. They do not read bullet points in full — they pattern-match verbs and numbers.

**Implication for design:** Company name and role title must be visually dominant in experience entries. Date ranges must be readable without squinting. Skills section must use exact technology names (not abbreviations or invented groupings).

### What Hiring engineers and managers look for

1. **Scope of impact** — team size, system scale, user count
2. **Technical depth** — specific technologies mentioned in bullets
3. **Progression** — growing scope and responsibility over time
4. **Measurable outcomes** — latency reduced, uptime improved, throughput increased
5. **Code or project evidence** — GitHub link in header

**Implication for design:** Bullet points must lead with action verbs and quantify outcomes. The GitHub link must be prominent. The skills list should match what appears in the experience bullets.

---

## Work Experience Section: What Works

### Entry structure

```
[Company Name]                          [Start – End date]
[Job Title]
- Action verb + what you built + measurable result
- Action verb + what you built + measurable result
```

### Bullet point formula (STAR-compressed)

"[Strong verb] [what was built/changed] [tech stack if relevant], [metric outcome]."

Good examples:
- "Reduced API latency 71% by rewriting Redis cache layer, improving throughput for 10K+ daily requests."
- "Led migration from REST to GraphQL for mobile API, cutting over-fetching by 60% across 500K active users."
- "Architected event-driven pipeline processing 1TB of logs daily; eliminated manual intervention for 3 oncall tiers."

Bad examples:
- "Responsible for backend development" (no action, no outcome)
- "Helped the team with feature work" (passive, unmeasurable)
- "Worked on improving performance" (vague verb, no metric)

### Date range display

Show month + year for start and end. "Present" for current role. Avoid year-only ranges — they hide tenure gaps and look imprecise.

### How many bullets per role

2-4 per role. More than 4 loses recruiter attention. Fewer than 2 looks thin. Prioritize scope and impact over completeness.

---

## Skills Section: What Works

### Categorized format (recommended)

```
Languages     TypeScript, Python, Go, SQL
Frameworks    React, Next.js, Node.js, FastAPI
Databases     PostgreSQL, Redis, MongoDB
Tools / Cloud AWS (ECS, S3, Lambda), Docker, Kubernetes, GitHub Actions
```

### What not to do

- Do not use a flat alphabetical tag cloud — hard to scan, no context
- Do not rate skills with bars or stars — meaningless and discouraged
- Do not list soft skills ("communication", "teamwork") in a technical skills section
- Do not list every technology ever touched — only what you'd be comfortable being interviewed on

### Category naming

Use plain English category names. Recruiters scan for "Languages", "Frameworks", "Cloud" — not invented names like "Tech Arsenal" or "Toolbox".

---

## PDF Export: What Makes It Look Professional

The constraint from PROJECT.md is that the PDF must match the web design — no separate layout.

### Font choices that survive print

Safe options (system or web-safe): Inter, Roboto, Source Sans Pro, Calibri.
Avoid: highly decorative serifs, icon fonts rendering as squares, variable fonts that browser-print collapses.

Use standard weights: 400 (body), 600 (company/role), 700 (name).

### Sizing for PDF output

| Element | Web size | Print target |
|---------|----------|-------------|
| Name | 2rem–2.5rem | ~24–28pt |
| Section headings | 1.1rem–1.25rem | ~13–14pt |
| Body / bullets | 0.875rem–1rem | ~10–11pt |
| Line height | 1.5–1.6 | 1.2–1.4 (tighter in print) |

### Margins and page setup

```css
@media print {
  @page {
    size: letter;          /* or A4 for international */
    margin: 0.75in 1in;    /* top/bottom, left/right */
  }
  body {
    font-size: 10.5pt;
    color: #000;
    background: #fff;
  }
}
```

### Page break rules

```css
.experience-entry {
  break-inside: avoid;         /* keep role header + bullets together */
  page-break-inside: avoid;    /* fallback for older engines */
}
.section-heading {
  break-after: avoid;          /* heading never stranded at page bottom */
}
```

### Print-specific overrides

- Force background to white — dark mode must not print dark
- Force text to black — colored accent text fades on home printers
- Hide: nav, dark mode toggle, PDF download button, footer
- Remove box shadows and backdrop filters — they don't print

### Single-page target

A one-page PDF is the professional norm for engineers with under 10 years of experience. The layout must be designed to fit, not overflow to page 2 with a half-empty section.

---

## MVP Recommendation

The four requested features map cleanly to this priority order:

1. **Header** (name, title, contact links) — fastest recruiter identification
2. **Work experience section** — core resume content; impact-focused bullets
3. **Skills section** — keyword surface for ATS and recruiter scan
4. **PDF download** — closes the loop; recruiters need a file to share

All four are required; none can be deferred for the page to be usable.

**Defer:**
- Dark/light mode toggle — nice but not blocking; can be Phase 2
- Copy-email interaction — small detail; add after core layout is solid
- Duration computation — polish; hardcode dates initially
- Skill proficiency annotation — omit; keep the list clean

---

## Feature Dependencies

```
Header (name/contact) → exists before any section (anchors, PDF identity)
Skills section → no dependency on experience
Work experience → no dependency on skills
PDF export → depends on final web layout being stable
Responsive layout → must be validated before PDF is finalized (different breakpoints)
Print CSS → must be applied last (after responsive layout confirmed)
```

---

## Sources

- https://profy.dev/article/portfolio-websites-survey — Survey of 60+ hiring managers on portfolio websites
- https://www.techinterviewhandbook.org/resume/ — FAANG-ready resume guide
- https://brittanychiang.com/ — Reference for SWE portfolio design craft
- https://www.resumly.ai/blog/optimizing-resume-design-for-software-engineers-in-2025 — Design best practices 2025
- https://www.tealhq.com/post/quantify-your-resume — Quantifying resume experience bullets
- https://dev.to/resumemind/htmlcss-to-pdf-how-i-solved-the-page-break-nightmare-mdg — Print CSS / PDF page break patterns
- https://atsresumeai.com/blog/ats-resume-formatting-guide/ — ATS formatting constraints
- https://formation.dev/blog/software-engineer-resume-guide-examples/ — Ex-Meta recruiter perspective on SWE resumes
- https://dev.to/_d7eb1c1703182e3ce1782/software-engineer-resume-50-bullet-points-with-star-format-12 — STAR bullet point examples
- https://smallpdf.com/blog/best-fonts-sizes-for-resume — Font and size guidance for professional PDFs
