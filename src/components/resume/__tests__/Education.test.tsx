import { render, screen } from '@testing-library/react';
import { Education } from '../Education';
import { Education as EducationType } from '@/types/resume';

describe('Education', () => {
  const mockEducation: EducationType[] = [
    {
      degree: 'Master of Science in Computer Science',
      school: 'Stanford University',
      period: '2015 - 2017',
      details: 'Focus on Machine Learning and Artificial Intelligence',
    },
    {
      degree: 'Bachelor of Science in Computer Engineering',
      school: 'University of California, Berkeley',
      period: '2011 - 2015',
      details: 'Minor in Mathematics',
    },
  ];

  it('renders all degree names', () => {
    render(<Education education={mockEducation} />);
    mockEducation.forEach(edu => {
      expect(screen.getByText(edu.degree)).toBeInTheDocument();
    });
  });

  it('renders all school names and periods', () => {
    render(<Education education={mockEducation} />);
    mockEducation.forEach(edu => {
      expect(screen.getByText(`${edu.school} • ${edu.period}`)).toBeInTheDocument();
    });
  });

  it('renders all education details', () => {
    render(<Education education={mockEducation} />);
    mockEducation.forEach(edu => {
      expect(screen.getByText(edu.details)).toBeInTheDocument();
    });
  });

  it('renders education in reverse chronological order', () => {
    render(<Education education={mockEducation} />);
    const educationElements = screen.getAllByRole('heading', { level: 3 });
    expect(educationElements[0]).toHaveTextContent('Master of Science');
  });
});
