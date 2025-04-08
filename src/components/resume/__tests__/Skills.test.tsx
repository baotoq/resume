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
      skills: ['React', 'Next.js', 'Express'],
    },
  ];

  it('renders all skill categories', () => {
    render(<Skills categories={mockSkillCategories} />);
    mockSkillCategories.forEach(category => {
      expect(screen.getByText(category.title)).toBeInTheDocument();
    });
  });

  it('renders all skills within each category', () => {
    render(<Skills categories={mockSkillCategories} />);
    mockSkillCategories.forEach(category => {
      category.skills.forEach(skill => {
        expect(screen.getByText(skill)).toBeInTheDocument();
      });
    });
  });

  it('renders correct number of skill categories', () => {
    render(<Skills categories={mockSkillCategories} />);
    const categoryTitles = screen.getAllByRole('heading', { level: 3 });
    expect(categoryTitles).toHaveLength(mockSkillCategories.length);
  });
});
