# Domain context

Glossary of domain terms. Use these names in code, docs, and architecture reviews.

- **Resume date** — a month-resolution `"YYYY-MM"` string used for all dates in resume data (experience, education, certifications). `endDate === null` means ongoing, rendered as "Present". The representation is owned by `src/lib/dates.ts`; no other module parses it.
