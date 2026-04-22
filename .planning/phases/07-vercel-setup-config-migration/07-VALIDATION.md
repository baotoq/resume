---
phase: 7
slug: vercel-setup-config-migration
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-22
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | npm scripts + TypeScript compiler |
| **Config file** | package.json |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npx tsc --noEmit` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npx tsc --noEmit`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 7-01-01 | 01 | 1 | VERCEL-01 | — | No output:'export' in config | build | `npm run build` | ✅ | ⬜ pending |
| 7-01-02 | 01 | 1 | SEC-01 | — | Headers present in config | grep | `grep -c "X-Frame-Options" next.config.ts` | ✅ | ⬜ pending |
| 7-01-03 | 01 | 1 | IMG-01 | — | remotePatterns configured | grep | `grep -c "remotePatterns" next.config.ts` | ✅ | ⬜ pending |
| 7-02-01 | 02 | 1 | VERCEL-03 | — | New CI workflow exists with prebuilt deploy | grep | `grep -c "vercel deploy --prebuilt --prod" .github/workflows/deploy.yml` | ✅ | ⬜ pending |
| 7-02-02 | 02 | 1 | CFG-01 | — | No NEXT_PUBLIC_EMAIL in codebase | grep | `! grep -r "NEXT_PUBLIC_EMAIL" src/` | ✅ | ⬜ pending |
| 7-02-03 | 02 | 1 | VERCEL-02 | — | EMAIL/PHONE read server-side | grep | `grep -c "process.env.EMAIL" src/app/page.tsx` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `.github/workflows/deploy.yml` — new CI/CD workflow file for VERCEL-03 (replaces existing GitHub Pages workflow)

*Existing infrastructure (next.config.ts, package.json, page.tsx) covers all other phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Vercel deployment triggers on push | VERCEL-03 | Requires live Vercel project + GitHub secret | Push to main, verify Vercel dashboard shows deployment |
| Site live on Vercel URL | VERCEL-02 | External service, requires manual setup | Open Vercel URL, verify page renders with email/phone |
| Security headers in HTTP response | SEC-01 | Runtime check, not build-time | `curl -I <vercel-url>` and verify X-Frame-Options header present |
| Double-deploy disabled | VERCEL-03 | Vercel dashboard setting | Verify "Ignored Build Step" = `exit 1` in Vercel project settings |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
