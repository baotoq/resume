# Requirements: Resume / CV Page

**Defined:** 2026-04-22
**Core Value:** A recruiter or engineer can open the link, immediately understand who you are and what you've built — all without friction.

## v2.0 Requirements

### Deployment Migration

- [ ] **VERCEL-01**: Site builds successfully without `output: 'export'` — next.config.ts stripped of all GitHub Pages settings (`output`, `basePath`, `assetPrefix`, `images.unoptimized`, `isProd`)
- [ ] **VERCEL-02**: Site is live on Vercel with contact env vars (`EMAIL`, `PHONE`) configured in Vercel dashboard
- [ ] **VERCEL-03**: Push to main branch triggers automatic Vercel deployment via GitHub Actions CI/CD (old Pages workflow removed)
- [ ] **VERCEL-04**: GitHub Pages decommissioned — Pages source set to None in repo Settings

### Image Optimization

- [ ] **IMG-01**: Company logos rendered via `next/image` with `remotePatterns` configuration — replaces plain `<img>` tag in LogoImage.tsx

### Security & Config

- [ ] **SEC-01**: HTTP security headers configured in `next.config.ts` via `headers()` — X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- [ ] **CFG-01**: Email and phone env vars use no `NEXT_PUBLIC_` prefix — read in Server Component only, kept out of client bundle

## Future Requirements

### Content Enhancements

- **CONT-01**: Duration labels auto-computed from date ranges on each role
- **CONT-02**: About/bio intro paragraph at top of page

### Theme

- **THEME-01**: Dark/light mode toggle with persisted preference

### Export

- **PDF-01**: PDF download button — client-side or API-route based generation

## Out of Scope

| Feature | Reason |
|---------|--------|
| Custom domain | Infrastructure concern, not blocking recruiter use |
| ISR / on-demand revalidation | Resume data is static YAML — no external data source to poll |
| Server Actions | No forms or mutations needed on a static resume |
| Puppeteer / headless PDF | Exceeds Vercel Lambda size limit (50MB compressed vs ~170MB binary) |
| Projects section | Not requested |
| Education section | Not requested |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| VERCEL-01 | — | Pending |
| VERCEL-02 | — | Pending |
| VERCEL-03 | — | Pending |
| VERCEL-04 | — | Pending |
| IMG-01 | — | Pending |
| SEC-01 | — | Pending |
| CFG-01 | — | Pending |

**Coverage:**
- v2.0 requirements: 7 total
- Mapped to phases: 0 (roadmap pending)
- Unmapped: 7 ⚠

---
*Requirements defined: 2026-04-22*
*Last updated: 2026-04-22 after initial definition*
