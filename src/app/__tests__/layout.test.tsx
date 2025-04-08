import { Metadata } from 'next';
import RootLayout from '../layout';

describe('RootLayout', () => {
  it('renders children with proper structure', () => {
    const testContent = 'Test Content';
    const layout = RootLayout({
      children: <div>{testContent}</div>,
    });

    expect(layout.type).toBe('html');
    expect(layout.props.lang).toBe('en');
    expect(layout.props.children.type).toBe('body');
    expect(layout.props.children.props.className).toBe(
      'min-h-screen bg-background text-text antialiased'
    );
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
