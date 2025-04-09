import { render, screen } from '@testing-library/react';
import { Projects } from '../Projects';
import { Project } from '@/types/resume';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => <img {...props} />,
}));

describe('Projects', () => {
  const mockProjects: Project[] = [
    {
      name: 'E-commerce Platform',
      technologies: 'React, Node.js, MongoDB',
      achievements: [
        'Implemented secure payment processing',
        'Reduced load time by 50%',
      ],
      image: '/images/ecommerce.jpg',
      link: 'https://github.com/user/ecommerce',
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

  it('renders project links when provided', () => {
    render(<Projects projects={mockProjects} />);
    const projectWithLink = mockProjects[0];
    const link = screen.getByRole('link', { name: projectWithLink.name });
    expect(link).toHaveAttribute('href', projectWithLink.link);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders project images when provided', () => {
    render(<Projects projects={mockProjects} />);
    const projectWithImage = mockProjects[0];
    const image = screen.getByAltText(`${projectWithImage.name} screenshot`);
    expect(image).toHaveAttribute('src', projectWithImage.image);
  });

  it('renders projects without images or links correctly', () => {
    render(<Projects projects={mockProjects} />);
    const projectWithoutImageAndLink = mockProjects[1];
    expect(screen.getByText(projectWithoutImageAndLink.name)).toBeInTheDocument();
    expect(screen.queryByAltText(`${projectWithoutImageAndLink.name} screenshot`)).not.toBeInTheDocument();
  });
});
