# Resume Website - Claude Documentation

## Project Overview

This is a professional resume website built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. The site is designed to be hosted on GitHub Pages with static export and includes client-side PDF generation capabilities.

## Features

- ✅ Single-page resume layout with all sections
- ✅ Client-side PDF export using browser's print functionality
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Type-safe with TypeScript
- ✅ GitHub Pages deployment with automated workflow
- ✅ Print-optimized CSS for clean PDF output
- ✅ SEO-friendly metadata

## Resume Sections

1. **Header** - Name, professional title, contact information
2. **Summary** - Professional summary/about section
3. **Experience** - Work history with responsibilities
4. **Education** - Academic background
5. **Skills** - Technical skills organized by category

## Project Structure

```
/Users/baotoq/Work/resume/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deployment workflow
├── public/
│   └── .nojekyll                   # Bypass Jekyll processing for GitHub Pages
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with metadata
│   │   ├── page.tsx                # Main resume page
│   │   └── globals.css             # Global styles + print CSS
│   ├── components/
│   │   ├── resume/
│   │   │   ├── Header.tsx          # Name, title, contact info
│   │   │   ├── Summary.tsx         # Professional summary
│   │   │   ├── Experience.tsx      # Work experience section
│   │   │   ├── Education.tsx       # Education section
│   │   │   ├── Skills.tsx          # Skills/technologies section
│   │   │   └── Section.tsx         # Reusable section wrapper
│   │   └── ui/
│   │       └── PDFExportButton.tsx # PDF export button component
│   ├── data/
│   │   └── resume.ts               # ⭐ MAIN FILE TO EDIT - All resume content
│   └── types/
│       └── resume.ts               # TypeScript interfaces
├── next.config.ts                  # Next.js config (static export enabled)
└── package.json                    # Dependencies
```

## Key Files

### 📝 Content Files (Edit These)

**[src/data/resume.ts](src/data/resume.ts)** - The primary file to update your resume
- Contains all resume content in a structured format
- Includes personal info, summary, experience, education, and skills
- Currently filled with placeholder data

**[src/app/layout.tsx](src/app/layout.tsx)** - SEO metadata
- Update the title, description, and keywords
- Modify Open Graph tags for social sharing

### 🎨 Component Files

All components are in `src/components/resume/`:
- **Header.tsx** - Displays name, title, and contact links
- **Summary.tsx** - Renders professional summary paragraphs
- **Experience.tsx** - Maps through work experience items
- **Education.tsx** - Displays education history
- **Skills.tsx** - Shows skills grouped by category
- **Section.tsx** - Reusable wrapper for consistent section styling

### ⚙️ Configuration Files

**[next.config.ts](next.config.ts)**
```typescript
{
  output: "export",        // Enable static HTML export
  images: {
    unoptimized: true,     // Required for static export
  },
}
```

**[.github/workflows/deploy.yml](.github/workflows/deploy.yml)**
- Triggers on push to master branch
- Builds the site and deploys to GitHub Pages
- Uses Node.js 20 and npm ci for dependencies

## Technology Stack

### Core
- **Next.js 16.0.10** - React framework with static export
- **React 19.2.1** - UI library
- **TypeScript 5** - Type safety

### Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **Geist Font** - Modern sans-serif font family

### PDF Export
- **react-to-print 2.15.1** - Client-side PDF generation
- Uses browser's native print-to-PDF capability

### Development Tools
- **Biome 2.2.0** - Fast formatter and linter
- **PostCSS** - CSS processing

## How to Use

### Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Format code
npm run format

# Lint code
npm run lint
```

### Updating Your Resume

1. **Edit content**: Open `src/data/resume.ts`
2. **Update personal information**:
   ```typescript
   personal: {
     name: "Your Actual Name",
     title: "Your Job Title",
     contact: {
       email: "your@email.com",
       // ... update other fields
     }
   }
   ```
3. **Update experience, education, skills** in the same file
4. **Test locally**: Run `npm run dev`
5. **Commit and push**: Changes will auto-deploy

### Deployment to GitHub Pages

#### Initial Setup
1. Go to your repository **Settings > Pages**
2. Under "Source", select **GitHub Actions**
3. Push any commit to master branch

#### Automated Deployment
- Every push to master triggers the GitHub Actions workflow
- Site builds automatically and deploys to GitHub Pages
- Live URL: `https://baotoq.github.io/resume/`

### PDF Export

Two methods to generate PDF:

1. **Using the Download PDF button**:
   - Visit your live site
   - Click "Download PDF" button in the header
   - Browser's print dialog opens → Save as PDF

2. **Manual print-to-PDF**:
   - Open your resume in any browser
   - Press Ctrl+P (or Cmd+P on Mac)
   - Choose "Save as PDF" as the destination

## Customization Guide

### Styling

The site uses Tailwind CSS. To customize:

**Colors**: Edit component classes directly
```tsx
// Change button color in PDFExportButton.tsx
className="bg-blue-600 hover:bg-blue-700"  // Blue
className="bg-green-600 hover:bg-green-700"  // Green
```

**Layout**: Modify classes in `src/app/page.tsx`
```tsx
// Change max width
className="max-w-4xl"  // Current
className="max-w-6xl"  // Wider
```

**Typography**: Update Tailwind classes in components
```tsx
// Heading sizes
className="text-4xl"  // Extra large
className="text-2xl"  // Large
```

### Adding New Sections

1. **Define types** in `src/types/resume.ts`:
   ```typescript
   export interface Certification {
     name: string;
     issuer: string;
     date: string;
   }
   ```

2. **Add data** to `src/data/resume.ts`:
   ```typescript
   certifications: [
     { name: "AWS Solutions Architect", issuer: "Amazon", date: "2023" }
   ]
   ```

3. **Create component** in `src/components/resume/Certifications.tsx`:
   ```tsx
   import { Section } from "./Section";

   export function Certifications({ certifications }) {
     return <Section title="Certifications">{/* ... */}</Section>;
   }
   ```

4. **Add to page** in `src/app/page.tsx`:
   ```tsx
   <Certifications certifications={resumeData.certifications} />
   ```

### Print Styles

Print-specific CSS is in `src/app/globals.css`:

```css
@media print {
  /* Customize print layout */
  @page {
    size: A4;          /* Or Letter */
    margin: 0.5in;     /* Adjust margins */
  }

  /* Hide elements from print */
  .no-print {
    display: none !important;
  }
}
```

## Data Schema

### PersonalInfo
```typescript
{
  name: string;
  title: string;
  contact: {
    email: string;
    phone?: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    website?: string;
  };
}
```

### Summary
```typescript
{
  content: string[];  // Array of paragraphs
}
```

### ExperienceItem
```typescript
{
  company: string;
  position: string;
  location: string;
  startDate: string;        // e.g., "Jan 2020"
  endDate: string;          // e.g., "Present"
  responsibilities: string[];
}
```

### EducationItem
```typescript
{
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
  relevantCoursework?: string[];
}
```

### SkillCategory
```typescript
{
  category: string;
  skills: string[];
}
```

## Troubleshooting

### Build Fails

**Issue**: TypeScript errors in `types/validator.ts`
**Solution**: Delete the `types/` directory (auto-generated) and rebuild:
```bash
rm -rf types
npm run build
```

### PDF Export Not Working

**Issue**: PDF button doesn't trigger print dialog
**Solution**:
- Ensure `react-to-print` is installed: `npm install react-to-print`
- Check browser console for errors
- Try using Ctrl+P manually

### GitHub Pages Not Deploying

**Issue**: Workflow runs but site doesn't update
**Solutions**:
1. Check GitHub Actions tab for errors
2. Verify Pages settings: Settings > Pages > Source: GitHub Actions
3. Ensure `output: "export"` is in `next.config.ts`
4. Check that `.nojekyll` file exists in `public/`

### Styling Issues on GitHub Pages

**Issue**: Styles not loading on deployed site
**Solution**: Check `next.config.ts` has `images.unoptimized: true`

## Performance Tips

### Optimize Build
- Keep placeholder data minimal during development
- Use `npm run build` to test production build locally

### Reduce Bundle Size
- Only import components you use
- Avoid adding unnecessary dependencies

### Improve PDF Quality
- Use web-safe fonts
- Keep page to 1-2 pages if possible
- Test PDF output in different browsers

## GitHub Pages URL Structure

**Repository**: `https://github.com/baotoq/resume`
**Live Site**: `https://baotoq.github.io/resume/`

If you want to use a custom domain:
1. Add domain in Settings > Pages > Custom domain
2. Update DNS records with your domain provider
3. Add `CNAME` file to `public/` directory

## Future Enhancements (Not Implemented)

Ideas for future development:
- 🌙 Dark mode toggle
- 🎨 Multiple color themes
- 🌍 Multi-language support (i18n)
- 📊 Analytics integration (Google Analytics, Plausible)
- 🖼️ Profile photo upload
- 📱 Mobile-optimized PDF generation
- 🔒 Password protection for certain sections
- 📈 Version history of resume changes
- 🎯 Multiple resume versions (short/long)
- 🏆 Projects/Portfolio section
- 📜 Certifications section
- 🗣️ Languages spoken section

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Run production build locally

# Code Quality
npm run lint             # Check code with Biome
npm run format           # Format code with Biome

# Deployment
git add .
git commit -m "Update resume"
git push origin master   # Triggers auto-deployment

# Clean build
rm -rf .next out types
npm run build
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [react-to-print Documentation](https://github.com/gregnb/react-to-print)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

## Support

For issues or questions:
1. Check this documentation first
2. Review the [implementation plan](/.claude/plans/) for detailed architecture
3. Search existing issues on the repository
4. Create a new issue with reproduction steps

## License

This project is personal and not licensed for redistribution.

---

**Last Updated**: December 18, 2024
**Created By**: Claude AI Assistant
**Maintained By**: baotoq
