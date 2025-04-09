import { render, screen } from '@testing-library/react';
import { Contact } from '../Contact';
import { ContactInfo } from '@/types/resume';

describe('Contact', () => {
  const mockContactInfo: ContactInfo = {
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
  };

  it('renders email address', () => {
    render(<Contact contactInfo={mockContactInfo} />);
    expect(screen.getByText(mockContactInfo.email)).toBeInTheDocument();
  });

  it('renders phone number', () => {
    render(<Contact contactInfo={mockContactInfo} />);
    expect(screen.getByText(mockContactInfo.phone)).toBeInTheDocument();
  });

  it('renders location', () => {
    render(<Contact contactInfo={mockContactInfo} />);
    expect(screen.getByText(mockContactInfo.location)).toBeInTheDocument();
  });

  it('renders LinkedIn profile link', () => {
    render(<Contact contactInfo={mockContactInfo} />);
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedinLink).toHaveAttribute('href', `https://${mockContactInfo.linkedin}`);
  });

  it('renders GitHub profile link', () => {
    render(<Contact contactInfo={mockContactInfo} />);
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', `https://${mockContactInfo.github}`);
  });

  it('renders all contact information in a visually organized manner', () => {
    render(<Contact contactInfo={mockContactInfo} />);
    const contactElements = screen.getAllByRole('listitem');
    expect(contactElements.length).toBeGreaterThanOrEqual(5);
  });
});
