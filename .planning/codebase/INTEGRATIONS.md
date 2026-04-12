# External Integrations

**Analysis Date:** 2026-04-12

## APIs & External Services

**Font CDN:**
- Google Fonts (via `next/font/google`) - Serves Geist and Geist Mono typefaces at build/request time
  - SDK/Client: `next/font/google` (built into Next.js)
  - Auth: None required
  - Usage: `src/app/layout.tsx` lines 2-11

No other external APIs or third-party service SDKs are present in the codebase.

## Data Storage

**Databases:**
- None - No database client, ORM, or connection string detected

**File Storage:**
- Local filesystem only - Static assets served from `public/` directory (SVG files)

**Caching:**
- Next.js built-in caching only (`"use cache"` directive support via `types/cache-life.d.ts`)
- Cache profiles available: `seconds`, `minutes`, `hours`, `days`, `weeks`, `max`, `default`
- No external cache store (Redis, Memcached, etc.) configured

## Authentication & Identity

**Auth Provider:**
- None - No authentication library or provider detected

## Monitoring & Observability

**Error Tracking:**
- None

**Logs:**
- None configured beyond Next.js default server logging

## CI/CD & Deployment

**Hosting:**
- Vercel (strongly implied by template branding in `src/app/page.tsx` and `public/vercel.svg`)
- No `vercel.json` configuration file present

**CI Pipeline:**
- None configured (no `.github/workflows/`, no CI config files detected)

## Environment Configuration

**Required env vars:**
- None currently required - project has no `.env` files and no `process.env` references in source

**Secrets location:**
- Not applicable - no secrets needed at this stage

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2026-04-12*
