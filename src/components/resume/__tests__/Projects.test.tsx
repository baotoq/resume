import { render, screen } from '@testing-library/react';
import { Projects } from '../Projects';
import { Project } from '@/types/resume';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, fill, ...props }: {
    src: string;
    alt: string;
    className?: string;
    fill?: boolean;
    [key: string]: string | boolean | undefined;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      data-fill={fill ? "true" : undefined}
      {...props}
    />
  ),
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
      demo: 'https://ecommerce-demo.com',
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

  it('renders technologies as tags', () => {
    render(<Projects projects={mockProjects} />);
    mockProjects.forEach(project => {
      project.technologies.split(',').forEach(tech => {
        expect(screen.getByText(tech.trim())).toBeInTheDocument();
      });
    });
  });

  it('renders all achievements for each project', () => {
    render(<Projects projects={mockProjects} />);
    mockProjects.forEach(project => {
      project.achievements.forEach(achievement => {
        const elements = screen.getAllByText((content, element) => {
          return element?.textContent?.includes(achievement) ?? false;
        });
        expect(elements.length).toBeGreaterThan(0);
      });
    });
  });

  it('renders project links when provided', () => {
    render(<Projects projects={mockProjects} />);
    const projectWithLink = mockProjects[0];
    const link = screen.getByRole('link', { name: /view project/i });
    expect(link).toHaveAttribute('href', projectWithLink.link);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders demo links when provided', () => {
    render(<Projects projects={mockProjects} />);
    const projectWithDemo = mockProjects[0];
    const demoLink = screen.getByRole('link', { name: /live demo/i });
    expect(demoLink).toHaveAttribute('href', projectWithDemo.demo);
    expect(demoLink).toHaveAttribute('target', '_blank');
    expect(demoLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders project images when provided', () => {
    render(<Projects projects={mockProjects} />);
    const projectWithImage = mockProjects[0];
    const image = screen.getByAltText(`${projectWithImage.name} screenshot`);
    expect(image).toHaveAttribute('src', projectWithImage.image);
  });

  it('renders projects without images or links correctly', () => {
    render(<Projects projects={[mockProjects[1]]} />);
    const projectWithoutImageAndLink = mockProjects[1];
    expect(screen.getByText(projectWithoutImageAndLink.name)).toBeInTheDocument();
    expect(screen.queryByAltText(`${projectWithoutImageAndLink.name} screenshot`)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /view project/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /live demo/i })).not.toBeInTheDocument();
  });
});
