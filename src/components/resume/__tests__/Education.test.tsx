import { render, screen } from '@testing-library/react';
import { Education } from '../Education';
import { Education as EducationType } from '@/types/resume';

describe('Education', () => {
  const mockEducation: EducationType[] = [
    {
      degree: 'Master of Science in Computer Science',
      school: 'Stanford University',
      period: '2015 - 2017',
      details: 'Focus on Machine Learning and Distributed Systems',
    },
    {
      degree: 'Bachelor of Science in Computer Science',
      school: 'UC Berkeley',
      period: '2011 - 2015',
      details: 'GPA: 3.8/4.0',
    },
  ];

  it('renders all education entries', () => {
    render(<Education education={mockEducation} />);
    mockEducation.forEach(edu => {
      expect(screen.getByText(edu.degree)).toBeInTheDocument();
      expect(screen.getByText(`${edu.school} • ${edu.period}`)).toBeInTheDocument();
      expect(screen.getByText(edu.details)).toBeInTheDocument();
    });
  });

  it('renders correct number of education entries', () => {
    render(<Education education={mockEducation} />);
    const degrees = screen.getAllByRole('heading', { level: 3 });
    expect(degrees).toHaveLength(mockEducation.length);
  });
});
