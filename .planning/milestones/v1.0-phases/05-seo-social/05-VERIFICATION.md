---
phase: 05-seo-social
verified: 2026-03-06T10:00:00Z
status: passed
score: 8/8 must-haves verified
gaps: []
re_verified: 2026-03-06T16:30:00Z
re_verification_note: "OG image double-prefix bug fixed — image moved to public/ with explicit absolute URL in metadata. Built output confirmed correct: https://baotoq.github.io/resume/opengraph-image.png"
---

# Phase 5: SEO & Social Verification Report

**Phase Goal:** Improve discoverability and social sharing appearance.
**Verified:** 2026-03-06T10:00:00Z
**Status:** passed (re-verified)
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Page HTML contains og:title, og:description, og:type, og:url meta tags | VERIFIED | Built out/index.html contains all four OG tags with correct values |
| 2 | Page HTML contains twitter:card, twitter:title, twitter:description meta tags | VERIFIED | Built output has twitter:card=summary_large_image, twitter:title, twitter:description |
| 3 | Page HTML contains link rel=canonical pointing to https://baotoq.github.io/resume | VERIFIED | canonical href="https://baotoq.github.io/resume/" present |
| 4 | Page HTML contains script type=application/ld+json with ProfilePage and Person schema | VERIFIED | JSON-LD block present with @type ProfilePage and mainEntity @type Person |
| 5 | JSON-LD Person entity has name, jobTitle, email, sameAs, worksFor, alumniOf, knowsAbout from resume data | VERIFIED | All fields populated from resume.ts: name="To Quoc Bao", jobTitle="Senior Software Engineer", email, sameAs=[linkedin,github], worksFor=CoverGo, alumniOf=Ton Duc Thang University, knowsAbout=22 skills |
| 6 | A 1200x630 PNG OG image exists at src/app/opengraph-image.png | VERIFIED | File exists, 1200x630 RGBA PNG, 78KB, professional design with name/title/skills |
| 7 | OG image displays name, title, and key skills with site theme colors | VERIFIED | Visual inspection confirms name, title, 6 skill pills, teal accent, warm beige background |
| 8 | Built output contains og:image meta tag pointing to the image | VERIFIED | og:image URL is https://baotoq.github.io/resume/opengraph-image.png (correct single prefix). Fixed by moving image to public/ with explicit absolute URL in metadata. |

**Score:** 8/8 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/app/layout.tsx` | Metadata with metadataBase, OG, Twitter, canonical | VERIFIED | metadataBase, creator, alternates.canonical, openGraph (title/description/type/url/siteName/locale), twitter (card/title/description) all present |
| `src/app/page.tsx` | JSON-LD script tag with ProfilePage + Person schema | VERIFIED | WithContext<ProfilePage> typed object rendered via script tag with XSS protection |
| `src/app/opengraph-image.png` | Static OG image for social sharing | VERIFIED | 1200x630 PNG, 78KB, professional design |
| `src/app/opengraph-image.alt.txt` | Alt text for OG image accessibility | VERIFIED | Contains "To Quoc Bao - Senior Software Engineer Resume" |
| `scripts/generate-og-image.ts` | OG image generation script | VERIFIED | Exists for reproducibility |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/app/page.tsx` | `src/data/resume.ts` | imports mainInfo, contactInfo, summary, experiences, education, skillCategories | WIRED | All six data exports imported and used in JSON-LD construction |
| `src/app/layout.tsx` | metadataBase URL | new URL for baotoq.github.io/resume | WIRED | `metadataBase: new URL("https://baotoq.github.io/resume")` present |
| `src/app/opengraph-image.png` | Next.js file convention | Auto-generates og:image meta tags | WIRED | Built HTML contains og:image, og:image:width, og:image:height, og:image:type, og:image:alt -- but URL has double basePath issue |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| SEO-01 | 05-01 | JSON-LD Person schema | SATISFIED | JSON-LD mainEntity has @type Person with name, jobTitle, email, telephone, sameAs, worksFor, alumniOf, knowsAbout |
| SEO-02 | 05-01 | JSON-LD ProfilePage schema | SATISFIED | JSON-LD root has @type ProfilePage with dateModified and mainEntity |
| SEO-03 | 05-01 | Open Graph meta tags | SATISFIED | og:title, og:description, og:type=profile, og:url, og:site_name, og:locale all present in built HTML |
| SEO-04 | 05-01 | Twitter Card meta tags | SATISFIED | twitter:card=summary_large_image, twitter:title, twitter:description present |
| SEO-05 | 05-02 | Custom OG image | PARTIALLY SATISFIED | Image exists and is professional quality, but og:image URL has double /resume/ prefix causing potential 404 on deploy |
| SEO-06 | 05-01 | Canonical URL | SATISFIED | link rel=canonical href="https://baotoq.github.io/resume/" present |

No orphaned requirements found -- all 6 SEO requirements (SEO-01 through SEO-06) are claimed by plans 05-01 and 05-02.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/app/layout.tsx` | - | Import order / spaces-vs-tabs formatting | Info | Pre-existing biome formatting convention mismatch, not caused by phase 5 |
| `src/app/page.tsx` | 60 | dangerouslySetInnerHTML | Info | Expected for JSON-LD injection, XSS-protected via HTML entity escaping |
| `out/index.html` | - | og:image URL double basePath | Warning | og:image resolves to /resume/resume/opengraph-image.png which will 404 |

No TODO, FIXME, or placeholder patterns found in phase 5 files.
No empty implementations or stub patterns found.

### Human Verification Required

### 1. OG Image Social Preview

**Test:** Share https://baotoq.github.io/resume on LinkedIn or use Facebook Debugger / Twitter Card Validator
**Expected:** Preview shows custom OG image with name, title, skills, and correct description
**Why human:** Need to verify actual social platform rendering and whether og:image URL resolves after deployment

### 2. Google Rich Results Test

**Test:** Run https://search.google.com/test/rich-results on the deployed URL
**Expected:** ProfilePage and Person structured data detected with no errors
**Why human:** Requires external tool validation against live deployed page

### 3. OG Image Visual Quality

**Test:** View src/app/opengraph-image.png at full size
**Expected:** Text is legible, colors match site theme, professional appearance
**Why human:** Aesthetic judgment cannot be automated

### Gaps Summary

One gap found: the og:image meta tag URL in the built HTML output has a double `/resume/` prefix (`/resume/resume/opengraph-image.png`). This is caused by Next.js applying the `basePath` on top of the file convention path resolution. When deployed to GitHub Pages, this URL will return a 404, meaning social sharing previews on LinkedIn, Twitter, and other platforms will not display the custom OG image.

The SUMMARY for Plan 01 acknowledged this issue: "OG image path shows double /resume/resume/ prefix due to basePath + file convention interaction (to be addressed in Plan 02)." However, Plan 02's SUMMARY does not mention fixing this, and the built output confirms the issue persists.

All other SEO goals are fully achieved: metadata tags, structured data, canonical URL, and the image itself are all correctly implemented. The fix likely requires setting `openGraph.images` explicitly in the metadata export with a manually constructed URL that accounts for basePath.

---

_Verified: 2026-03-06T10:00:00Z_
_Verifier: Claude (gsd-verifier)_
