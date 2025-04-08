import { render, screen } from '@testing-library/react';
import { Header } from '../Header';
import { ContactInfo } from '@/types/resume';

describe('Header', () => {
  const mockContact: ContactInfo = {
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
  };

  const mockProps = {
    name: 'John Developer',
    title: 'Senior Software Engineer',
    contact: mockContact,
  };

  it('renders name and title', () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText(mockProps.name)).toBeInTheDocument();
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
  });

  it('renders all contact information', () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText(mockContact.email)).toBeInTheDocument();
    expect(screen.getByText(mockContact.phone)).toBeInTheDocument();
    expect(screen.getByText(mockContact.location)).toBeInTheDocument();
  });

  it('renders social links with correct attributes', () => {
    render(<Header {...mockProps} />);

    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    const githubLink = screen.getByRole('link', { name: /github/i });

    expect(linkedinLink).toHaveAttribute('href', mockContact.linkedin);
    expect(githubLink).toHaveAttribute('href', mockContact.github);

    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders all contact icons', () => {
    render(<Header {...mockProps} />);
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(5); // email, phone, location, LinkedIn, GitHub
  });
});
