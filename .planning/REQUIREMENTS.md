# Requirements: Resume / CV Page

**Defined:** 2026-04-22
**Core Value:** A recruiter or engineer can open the link, immediately understand who you are and what you've built — all without friction.

## v2.0 Requirements

### Deployment Migration

- [x] **VERCEL-01**: Site builds successfully without `output: 'export'` — next.config.ts stripped of all GitHub Pages settings (`output`, `basePath`, `assetPrefix`, `images.unoptimized`, `isProd`)
- [x] **VERCEL-02**: Site is live on Vercel with contact env vars (`EMAIL`, `PHONE`) configured in Vercel dashboard
- [x] **VERCEL-03**: Push to main branch triggers automatic Vercel deployment via GitHub Actions CI/CD (old Pages workflow removed)
- [ ] **VERCEL-04**: GitHub Pages decommissioned — Pages source set to None in repo Settings

### Image Optimization

- [x] **IMG-01**: Company logos rendered via `next/image` with `remotePatterns` configuration — replaces plain `<img>` tag in LogoImage.tsx

### Security & Config

- [x] **SEC-01**: HTTP security headers configured in `next.config.ts` via `headers()` — X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- [x] **CFG-01**: Email and phone env vars use no `NEXT_PUBLIC_` prefix — read in Server Component only, kept out of client bundle

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
| VERCEL-01 | Phase 7 | Complete |
| VERCEL-02 | Phase 7 | Complete |
| VERCEL-03 | Phase 7 | Complete |
| VERCEL-04 | Phase 8 | Pending |
| IMG-01 | Phase 7 | Complete |
| SEC-01 | Phase 7 | Complete |
| CFG-01 | Phase 7 | Complete |

**Coverage:**
- v2.0 requirements: 7 total
- Mapped to phases: 7/7 ✓
- Unmapped: 0

---
*Requirements defined: 2026-04-22*
*Last updated: 2026-04-22 after roadmap creation*
