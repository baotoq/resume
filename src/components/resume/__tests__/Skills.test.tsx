import { render, screen } from '@testing-library/react';
import { Skills } from '../Skills';
import { SkillCategory } from '@/types/resume';

describe('Skills', () => {
  const mockSkillCategories: SkillCategory[] = [
    {
      title: 'Languages',
      skills: ['TypeScript', 'JavaScript', 'Python'],
    },
    {
      title: 'Frameworks',
      skills: ['React', 'Next.js', 'Node.js'],
    },
    {
      title: 'Tools',
      skills: ['Git', 'Docker', 'AWS'],
    },
  ];

  it('renders all skill category titles', () => {
    render(<Skills skillCategories={mockSkillCategories} />);
    mockSkillCategories.forEach(category => {
      expect(screen.getByText(category.title)).toBeInTheDocument();
    });
  });

  it('renders all skills within each category', () => {
    render(<Skills skillCategories={mockSkillCategories} />);
    mockSkillCategories.forEach(category => {
      category.skills.forEach(skill => {
        expect(screen.getByText(skill)).toBeInTheDocument();
      });
    });
  });

  it('renders correct number of skill categories', () => {
    render(<Skills skillCategories={mockSkillCategories} />);
    const categoryElements = screen.getAllByRole('heading', { level: 3 });
    expect(categoryElements).toHaveLength(mockSkillCategories.length);
  });

  it('renders skills in a visually organized manner', () => {
    render(<Skills skillCategories={mockSkillCategories} />);
    const skillElements = screen.getAllByRole('listitem');
    expect(skillElements.length).toBeGreaterThan(0);
  });
});
