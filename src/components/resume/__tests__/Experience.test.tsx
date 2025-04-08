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
        'Improved system performance by 40%',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'Startup Inc',
      period: '2018 - 2020',
      achievements: [
        'Developed core authentication system',
        'Implemented CI/CD pipeline',
      ],
    },
  ];

  it('renders all experience entries', () => {
    render(<Experience experiences={mockExperiences} />);
    mockExperiences.forEach(exp => {
      expect(screen.getByText(exp.title)).toBeInTheDocument();
      expect(screen.getByText(`${exp.company} • ${exp.period}`)).toBeInTheDocument();
    });
  });

  it('renders all achievements for each experience', () => {
    render(<Experience experiences={mockExperiences} />);
    mockExperiences.forEach(exp => {
      exp.achievements.forEach(achievement => {
        expect(screen.getByText(achievement)).toBeInTheDocument();
      });
    });
  });

  it('renders correct number of experience entries', () => {
    render(<Experience experiences={mockExperiences} />);
    const titles = screen.getAllByRole('heading', { level: 3 });
    expect(titles).toHaveLength(mockExperiences.length);
  });

  it('renders achievements as a list', () => {
    render(<Experience experiences={mockExperiences} />);
    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(mockExperiences.length);

    const listItems = screen.getAllByRole('listitem');
    const totalAchievements = mockExperiences.reduce(
      (sum, exp) => sum + exp.achievements.length,
      0
    );
    expect(listItems).toHaveLength(totalAchievements);
  });
});
