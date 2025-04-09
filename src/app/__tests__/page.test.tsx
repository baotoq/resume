import { render, screen } from '@testing-library/react';
import Home from '../page';
import { contactInfo } from '@/data/resume';

// Mock the data imports
jest.mock('@/data/resume', () => ({
  contactInfo: {
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
  },
  experiences: [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      period: '2020 - Present',
      achievements: ['Led development of microservices architecture'],
    },
  ],
  education: [
    {
      degree: 'Master of Science in Computer Science',
      school: 'Stanford University',
      period: '2015 - 2017',
      details: 'Focus on Machine Learning',
    },
  ],
  skillCategories: [
    {
      title: 'Languages',
      skills: ['TypeScript', 'JavaScript'],
    },
  ],
  projects: [
    {
      name: 'E-commerce Platform',
      technologies: 'React, Node.js',
      achievements: ['Implemented secure payment processing'],
    },
  ],
}));

describe('Home Page', () => {
  it('renders the header with name and title', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1, name: 'John Developer' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Senior Software Engineer & Tech Lead' })).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(<Home />);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
  });

  it('renders the summary section', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 2, name: 'Summary' })).toBeInTheDocument();
    expect(screen.getByText(/Senior Software Engineer with 10\+ years of experience/)).toBeInTheDocument();
  });

  it('renders the experience section with correct content', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument();
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    expect(screen.getByText(/Tech Corp/)).toBeInTheDocument();
    expect(screen.getByText('Led development of microservices architecture')).toBeInTheDocument();
  });

  it('renders the education section with correct content', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 2, name: 'Education' })).toBeInTheDocument();
    expect(screen.getByText('Master of Science in Computer Science')).toBeInTheDocument();
    expect(screen.getByText(/Stanford University/)).toBeInTheDocument();
    expect(screen.getByText('Focus on Machine Learning')).toBeInTheDocument();
  });

  it('renders the skills section with correct content', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 2, name: 'Skills' })).toBeInTheDocument();
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('renders the projects section with correct content', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 2, name: 'Notable Projects' })).toBeInTheDocument();
    expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
    expect(screen.getByText(/React, Node\.js/)).toBeInTheDocument();
    expect(screen.getByText('Implemented secure payment processing')).toBeInTheDocument();
  });

  it('renders all sections in the correct order', () => {
    render(<Home />);
    const sections = screen.getAllByRole('heading', { level: 2 });
    expect(sections.map(section => section.textContent)).toEqual([
      'Senior Software Engineer & Tech Lead',
      'Contact',
      'Summary',
      'Experience',
      'Education',
      'Skills',
      'Notable Projects',
    ]);
  });
});
