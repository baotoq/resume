export const APP_CONFIG = {
  title: 'Professional Resume',
  description: 'A modern, responsive resume built with Next.js and Tailwind CSS',
  author: 'Your Name',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
} as const;

export const SOCIAL_LINKS = {
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
} as const;

export const CONTACT_INFO = {
  email: 'your.email@example.com',
  phone: '+1 (123) 456-7890',
  location: 'San Francisco, CA',
} as const;

export const ROUTES = {
  home: '/',
  about: '/about',
  contact: '/contact',
} as const;

export const TEST_IDS = {
  layout: {
    root: 'layout-root',
    main: 'layout-main',
  },
  resume: {
    header: 'resume-header',
    experience: 'resume-experience',
    education: 'resume-education',
    skills: 'resume-skills',
    projects: 'resume-projects',
  },
} as const;
