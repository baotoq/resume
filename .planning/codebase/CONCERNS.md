# Known Concerns & Technical Debt

> Auto-generated codebase map - Last updated: 2026-01-31

## Technical Debt

### Low Priority

#### 1. Unused Public Assets
**Location**: `public/` directory
**Issue**: Contains default Next.js SVG files that aren't used
**Files**: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`
**Impact**: Minimal (small file size, copied to output)
**Recommendation**: Remove unused assets

#### 2. Dark Mode CSS Variables Unused
**Location**: `src/app/globals.css`
**Issue**: Dark mode CSS variables defined but not used (resume is light-only)
**Impact**: None (dead code)
**Recommendation**: Remove or implement dark mode

#### 3. Project Type Not Defined
**Location**: `src/types/resume.ts`
**Issue**: `Project` interface exists but `projects` array is empty
**Impact**: None (unused type)
**Recommendation**: Remove if not planning to add projects section

### Medium Priority

#### 4. Hardcoded Category Colors
**Location**: `src/components/resume/Skills.tsx`
**Issue**: `categoryColors` object is hardcoded with specific category names
**Impact**: New categories won't have colors without code changes
**Recommendation**: Use dynamic color assignment or move to data layer

#### 5. Text Parsing Not Extracted
**Location**: `src/components/resume/Experience.tsx`
**Issue**: `parseTextWithHighlights()` is defined inside component file
**Impact**: Cannot reuse in other components
**Recommendation**: Extract to `src/utils/textParser.ts` if needed elsewhere

## Potential Issues

### Print/PDF Quality
**Concern**: PDF export relies on browser print functionality
**Behavior**: Quality and appearance varies by browser
**Mitigation**: Extensive print CSS, but some inconsistencies possible

### SEO Limitations
**Concern**: Single-page static export
**Behavior**: All content on one page
**Impact**: Fine for resume (single document), but limits future expansion

### Font Loading
**Concern**: Google Fonts external dependency
**Behavior**: Requires network to load Inter font
**Mitigation**: System font fallback defined

## Architecture Decisions

### Why Static Export?
- **Decision**: `output: "export"` in next.config.ts
- **Rationale**: Simple deployment to GitHub Pages, no server needed
- **Trade-off**: No SSR, no API routes, no dynamic features

### Why Ant Design + Tailwind?
- **Decision**: Using both UI libraries
- **Rationale**: Ant Design for icons and SSR registry, Tailwind for custom styling
- **Trade-off**: Larger bundle size, but minimal Ant Design usage

### Why Client Component for Page?
- **Decision**: `"use client"` on main page
- **Rationale**: Required for `useRef` and `react-to-print` functionality
- **Trade-off**: Entire page is client-rendered (acceptable for static site)

## Future Considerations

### If Adding Features
1. **Multiple Pages**: Would need to reconsider static export approach
2. **CMS Integration**: Would require API routes or external CMS
3. **Internationalization**: Would need i18n setup
4. **Analytics**: Would need to add tracking script

### Maintenance Notes
- **Dependency Updates**: Ant Design v6, React 19, Next.js 16 are recent versions
- **Biome**: Relatively new tool, may need config updates
- **Tailwind v4**: Using latest version with new config format

