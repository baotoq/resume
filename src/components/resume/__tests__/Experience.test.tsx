import { screen } from '@testing-library/react';
import { Experience } from '../Experience';
import { Experience as ExperienceType } from '@/types/resume';
import { renderWithProviders } from '@/test/setup';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Experience', () => {
  const mockExperiences: ExperienceType[] = [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      period: '2020 - Present',
      achievements: [
        'Led development of microservices architecture',
        'Improved application performance by 40%',
        'Implemented CI/CD pipeline',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'Startup Inc',
      period: '2018 - 2020',
      achievements: [
        'Developed RESTful APIs',
        'Built frontend components with React',
        'Optimized database queries',
      ],
    },
  ];

  it('renders all job titles', () => {
    renderWithProviders(<Experience experiences={mockExperiences} />);
    mockExperiences.forEach(exp => {
      expect(screen.getByText(exp.title)).toBeInTheDocument();
    });
  });

  it('renders all company names and periods', () => {
    renderWithProviders(<Experience experiences={mockExperiences} />);
    mockExperiences.forEach(exp => {
      expect(screen.getByText(`${exp.company} • ${exp.period}`)).toBeInTheDocument();
    });
  });

  it('renders all achievements for each position', () => {
    renderWithProviders(<Experience experiences={mockExperiences} />);
    mockExperiences.forEach(exp => {
      exp.achievements.forEach(achievement => {
        expect(screen.getByText(achievement)).toBeInTheDocument();
      });
    });
  });

  it('renders experiences in reverse chronological order', () => {
    renderWithProviders(<Experience experiences={mockExperiences} />);
    const experienceElements = screen.getAllByRole('heading', { level: 3 });
    expect(experienceElements[0]).toHaveTextContent('Senior Software Engineer');
  });
});
