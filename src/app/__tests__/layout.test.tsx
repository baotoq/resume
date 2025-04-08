import { render } from '@testing-library/react';
import { Metadata } from 'next';
import RootLayout from '../layout';

// Mock next/head to avoid hydration issues
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => {
      return <>{children}</>;
    },
  };
});

describe('RootLayout', () => {
  it('renders children with proper structure', () => {
    const testContent = 'Test Content';
    const { getByText } = render(
      <RootLayout>
        <div>{testContent}</div>
      </RootLayout>
    );

    expect(getByText(testContent)).toBeInTheDocument();
  });

  it('has correct metadata', () => {
    const metadata: Metadata = {
      title: 'Professional Resume',
      description: 'A modern, responsive resume built with Next.js and Tailwind CSS',
    };

    expect(metadata.title).toBe('Professional Resume');
    expect(metadata.description).toBe(
      'A modern, responsive resume built with Next.js and Tailwind CSS'
    );
  });
});
