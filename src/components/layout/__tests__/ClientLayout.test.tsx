import { render, screen } from '@testing-library/react';
import { ClientLayout } from '../ClientLayout';
import { TEST_IDS } from '@/constants';

describe('ClientLayout', () => {
  const mockChildren = <div data-testid="mock-children">Test Content</div>;

  it('renders with correct classes and attributes', () => {
    render(<ClientLayout>{mockChildren}</ClientLayout>);

    const layout = screen.getByTestId(TEST_IDS.layout.main);
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveClass('min-h-screen', 'bg-background', 'text-text', 'antialiased');
  });

  it('renders children correctly', () => {
    render(<ClientLayout>{mockChildren}</ClientLayout>);

    const children = screen.getByTestId('mock-children');
    expect(children).toBeInTheDocument();
    expect(children).toHaveTextContent('Test Content');
  });

  it('preserves additional classes when rendering children with classes', () => {
    const { container } = render(
      <ClientLayout>
        <div className="custom-class">{mockChildren}</div>
      </ClientLayout>
    );

    const layout = screen.getByTestId(TEST_IDS.layout.main);
    expect(layout).toHaveClass('min-h-screen', 'bg-background', 'text-text', 'antialiased');
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('renders without children', () => {
    render(<ClientLayout />);

    const layout = screen.getByTestId(TEST_IDS.layout.main);
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveClass('min-h-screen', 'bg-background', 'text-text', 'antialiased');
    expect(layout.children).toHaveLength(0);
  });
});
