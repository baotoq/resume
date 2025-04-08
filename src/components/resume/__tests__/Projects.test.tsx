import { render, screen } from '@testing-library/react';
import { Projects } from '../Projects';
import { Project } from '@/types/resume';

describe('Projects', () => {
  const mockProjects: Project[] = [
    {
      name: 'E-commerce Platform',
      technologies: 'React, Node.js, MongoDB',
      achievements: [
        'Implemented secure payment processing',
        'Reduced load time by 50%',
      ],
    },
    {
      name: 'Analytics Dashboard',
      technologies: 'Next.js, TypeScript, D3.js',
      achievements: [
        'Built real-time data visualization',
        'Integrated multiple data sources',
      ],
    },
  ];

  it('renders all project names', () => {
    render(<Projects projects={mockProjects} />);
    mockProjects.forEach(project => {
      expect(screen.getByText(project.name)).toBeInTheDocument();
    });
  });

  it('renders technologies used for each project', () => {
    render(<Projects projects={mockProjects} />);
    mockProjects.forEach(project => {
      expect(screen.getByText(`Technologies: ${project.technologies}`)).toBeInTheDocument();
    });
  });

  it('renders all achievements for each project', () => {
    render(<Projects projects={mockProjects} />);
    mockProjects.forEach(project => {
      project.achievements.forEach(achievement => {
        expect(screen.getByText(achievement)).toBeInTheDocument();
      });
    });
  });

  it('renders correct number of projects', () => {
    render(<Projects projects={mockProjects} />);
    const projectElements = screen.getAllByRole('heading', { level: 3 });
    expect(projectElements).toHaveLength(mockProjects.length);
  });
});
