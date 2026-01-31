# Testing Strategy

> Auto-generated codebase map - Last updated: 2026-01-31

## Current State

**No testing infrastructure currently exists.**

The project does not have:
- Unit tests
- Integration tests
- E2E tests
- Test configuration files
- Testing dependencies in package.json

## Rationale

This is a simple static resume website with:
- No complex business logic
- No user interactions beyond PDF export
- Static data rendering only
- Single page application

The cost-benefit of testing for this type of project is low.

## Recommended Testing (If Needed)

### If Tests Were Added

#### Unit Testing
- **Framework**: Vitest (fast, Vite-compatible)
- **Targets**:
  - `parseTextWithHighlights()` function
  - `formatPeriod()` function
  - `calculateDuration()` function

#### Visual Regression
- **Framework**: Playwright or Chromatic
- **Purpose**: Catch unintended visual changes

#### E2E Testing
- **Framework**: Playwright
- **Targets**:
  - Page renders without errors
  - PDF export button triggers print dialog
  - All sections display correctly

### Example Test Setup (Not Implemented)

```bash
# If tests were added
npm install -D vitest @testing-library/react
```

```typescript
// Example: src/components/resume/Experience.test.tsx
import { describe, it, expect } from 'vitest';
import { parseTextWithHighlights, formatPeriod } from './Experience';

describe('parseTextWithHighlights', () => {
  it('should parse bold markers', () => {
    // Test implementation
  });
});
```

## Build Verification

The only current verification is:
- TypeScript compilation (`npm run build`)
- Biome linting (`npm run lint`)
- Manual browser testing

## Quality Assurance

### Current QA Process
1. `npm run lint` - Check for linting errors
2. `npm run build` - Verify build succeeds
3. Manual review of `out/index.html` in browser
4. Manual PDF export test

### Type Safety
TypeScript strict mode provides compile-time verification of:
- Data structure correctness
- Component prop types
- Import/export consistency

