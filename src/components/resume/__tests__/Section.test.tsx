import { render, screen } from '@testing-library/react';
import { Section } from '../Section';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

describe('Section', () => {
  const mockProps = {
    title: 'Education',
    icon: <AcademicCapIcon className="h-6 w-6" />,
    children: <div>Test Content</div>,
  };

  it('renders the section title', () => {
    render(<Section {...mockProps} />);
    expect(screen.getByText('Education')).toBeInTheDocument();
  });

  it('renders the icon', () => {
    const { container } = render(<Section {...mockProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(<Section {...mockProps} />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
