import { render, screen } from '@testing-library/react';
import { Experience } from '../Experience';
import { Experience as ExperienceType } from '@/types/resume';

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
    render(<Experience experiences={mockExperiences} />);
    mockExperiences.forEach(exp => {
      expect(screen.getByText(exp.title)).toBeInTheDocument();
    });
  });

  it('renders all company names and periods', () => {
    render(<Experience experiences={mockExperiences} />);
    mockExperiences.forEach(exp => {
      expect(screen.getByText(`${exp.company} • ${exp.period}`)).toBeInTheDocument();
    });
  });

  it('renders all achievements for each position', () => {
    render(<Experience experiences={mockExperiences} />);
    mockExperiences.forEach(exp => {
      exp.achievements.forEach(achievement => {
        expect(screen.getByText(achievement)).toBeInTheDocument();
      });
    });
  });

  it('renders experiences in reverse chronological order', () => {
    render(<Experience experiences={mockExperiences} />);
    const experienceElements = screen.getAllByRole('heading', { level: 3 });
    expect(experienceElements[0]).toHaveTextContent('Senior Software Engineer');
  });
});
