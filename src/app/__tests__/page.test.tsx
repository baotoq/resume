import { screen } from '@testing-library/react';
import Home from '../page';
import { renderWithProviders } from '@/test/setup';

jest.mock('@/data/resume', () => ({
  contactInfo: {
    email: "john.dev@example.com",
    phone: "(123) 456-7890",
    location: "San Francisco Bay Area",
    linkedin: "https://linkedin.com/in/johndev",
    github: "https://github.com/johndev",
  },
  summary: 'Senior Software Engineer with 10+ years of experience in full-stack development, specializing in building scalable web applications and leading development teams.',
  experiences: [
    {
      title: "Senior Staff Engineer",
      company: "TechCorp Inc.",
      period: "2020 - Present",
      achievements: [
        "Led architecture and development of a microservices platform handling 1M+ daily transactions",
        "Reduced cloud infrastructure costs by 40% through optimization and implementation of serverless architecture",
        "Mentored 15+ engineers and established engineering best practices across 5 teams",
      ],
    },
  ],
  education: [
    {
      degree: "Master of Science in Computer Science",
      school: "Stanford University",
      period: "2012 - 2014",
      details: "Focus: Distributed Systems and Machine Learning",
    },
  ],
  skillCategories: [
    {
      title: "Languages",
      skills: ["TypeScript/JavaScript", "Go", "Python", "Java"],
    },
  ],
  projects: [
    {
      name: "Enterprise Microservices Platform",
      technologies: "TypeScript, Node.js, Kubernetes, AWS",
      achievements: [
        "Designed and implemented a scalable microservices architecture handling 10K+ requests/second",
        "Reduced system latency by 60% through caching and optimization",
        "Implemented zero-downtime deployment strategy across multiple regions",
      ],
    },
  ],
}));

describe('Home', () => {
  const mockData = {
    contactInfo: {
      email: "john.dev@example.com",
      phone: "(123) 456-7890",
      location: "San Francisco Bay Area",
      linkedin: "https://linkedin.com/in/johndev",
      github: "https://github.com/johndev",
    },
    summary: 'Senior Software Engineer with 10+ years of experience in full-stack development, specializing in building scalable web applications and leading development teams.',
    experiences: [{
      title: "Senior Staff Engineer",
      company: "TechCorp Inc.",
      period: "2020 - Present",
      achievements: [
        "Led architecture and development of a microservices platform handling 1M+ daily transactions",
        "Reduced cloud infrastructure costs by 40% through optimization and implementation of serverless architecture",
        "Mentored 15+ engineers and established engineering best practices across 5 teams",
      ],
    }],
    education: [{
      degree: "Master of Science in Computer Science",
      school: "Stanford University",
      period: "2012 - 2014",
      details: "Focus: Distributed Systems and Machine Learning",
    }],
    skillCategories: [{
      title: "Languages",
      skills: ["TypeScript/JavaScript", "Go", "Python", "Java"],
    }],
    projects: [{
      name: "Enterprise Microservices Platform",
      technologies: "TypeScript, Node.js, Kubernetes, AWS",
      achievements: [
        "Designed and implemented a scalable microservices architecture handling 10K+ requests/second",
        "Reduced system latency by 60% through caching and optimization",
        "Implemented zero-downtime deployment strategy across multiple regions",
      ],
    }],
  };

  it('renders the header section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('heading', { name: 'John Developer' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Senior Software Engineer & Tech Lead' })).toBeInTheDocument();
  });

  it('renders the contact section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(mockData.contactInfo.email)).toBeInTheDocument();
    expect(screen.getByText(mockData.contactInfo.phone)).toBeInTheDocument();
    expect(screen.getByText(mockData.contactInfo.location)).toBeInTheDocument();
  });

  it('renders the summary section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument();
    expect(screen.getByText(mockData.summary)).toBeInTheDocument();
  });

  it('renders the experience section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument();
    expect(screen.getByText(mockData.experiences[0].title)).toBeInTheDocument();
    expect(screen.getByText(`${mockData.experiences[0].company} • ${mockData.experiences[0].period}`)).toBeInTheDocument();
  });

  it('renders the education section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument();
    expect(screen.getByText(mockData.education[0].degree)).toBeInTheDocument();
    expect(screen.getByText(`${mockData.education[0].school} • ${mockData.education[0].period}`)).toBeInTheDocument();
  });

  it('renders the skills section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument();
    expect(screen.getByText(mockData.skillCategories[0].title)).toBeInTheDocument();
    mockData.skillCategories[0].skills.forEach(skill => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it('renders the projects section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('heading', { level: 2, name: 'Notable Projects' })).toBeInTheDocument();
    expect(screen.getByText(mockData.projects[0].name)).toBeInTheDocument();
    mockData.projects[0].technologies.split(',').forEach(tech => {
      expect(screen.getByText(tech.trim())).toBeInTheDocument();
    });
  });
});
