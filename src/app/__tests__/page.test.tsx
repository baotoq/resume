import { screen } from '@testing-library/react';
import Home from '../page';
import { renderWithProviders } from '@/test/setup';

jest.mock('@/data/resume', () => ({
  contactInfo: {
    email: 'john.dev@example.com',
    phone: '(123) 456-7890',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndev',
    github: 'github.com/johndev',
  },
  summary: 'Senior Software Engineer with 10+ years of experience in full-stack development, specializing in building scalable web applications and leading development teams.',
  experiences: [
    {
      title: 'Senior Staff Engineer',
      company: 'TechCorp Inc.',
      period: '2018 - Present',
      achievements: [
        'Led a team of 10 engineers in developing a microservices architecture',
        'Implemented CI/CD pipeline reducing deployment time by 50%',
      ],
    },
  ],
  education: [
    {
      degree: 'Master of Science in Computer Science',
      school: 'Stanford University',
      period: '2012 - 2014',
      details: 'Specialized in Machine Learning and Distributed Systems',
    },
  ],
  skillCategories: [
    {
      title: 'Programming Languages',
      skills: ['JavaScript', 'TypeScript', 'Python', 'Java'],
    },
  ],
  projects: [
    {
      name: 'Enterprise Microservices Platform',
      description: 'A scalable microservices platform for enterprise applications',
      technologies: 'Node.js, Docker, Kubernetes, AWS',
      achievements: [
        'Reduced deployment time by 70%',
        'Improved system reliability by 99.9%',
      ],
      image: '/project1.jpg',
      link: 'https://github.com/johndev/microservices-platform',
      demo: 'https://demo.microservices-platform.com',
    },
  ],
}));

describe('Home', () => {
  it('renders the contact section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument();
    expect(screen.getByText('john.dev@example.com')).toBeInTheDocument();
    expect(screen.getByText('(123) 456-7890')).toBeInTheDocument();
  });

  it('renders the summary section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('heading', { name: 'user Summary' })).toBeInTheDocument();
    expect(screen.getByText('Senior Software Engineer with 10+ years of experience in full-stack development, specializing in building scalable web applications and leading development teams.')).toBeInTheDocument();
  });

  it('renders the experience section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument();
    expect(screen.getByText('Senior Staff Engineer')).toBeInTheDocument();
    expect(screen.getByText('TechCorp Inc. • 2018 - Present')).toBeInTheDocument();
  });

  it('renders the education section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument();
    expect(screen.getByText('Master of Science in Computer Science')).toBeInTheDocument();
    expect(screen.getByText('Stanford University')).toBeInTheDocument();
    expect(screen.getByText('2012 - 2014')).toBeInTheDocument();
  });

  it('renders the skills section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument();
    expect(screen.getByText('Programming Languages')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('renders the projects section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByText('Enterprise Microservices Platform')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });
});
