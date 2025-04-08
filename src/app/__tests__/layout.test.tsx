import { Metadata } from 'next';
import RootLayout from '../layout';
import { APP_CONFIG, TEST_IDS } from '@/constants';

describe('RootLayout', () => {
  it('renders with proper HTML structure', () => {
    const testContent = 'Test Content';
    const layout = RootLayout({
      children: <div>{testContent}</div>,
    });

    expect(layout.type).toBe('html');
    expect(layout.props.lang).toBe('en');
    expect(layout.props['data-testid']).toBe(TEST_IDS.layout.root);
  });

  it('renders body with proper classes and test ID', () => {
    const layout = RootLayout({
      children: <div>Content</div>,
    });

    const body = layout.props.children;
    expect(body.type).toBe('body');
    expect(body.props.className).toBe('min-h-screen bg-background text-text antialiased');
    expect(body.props['data-testid']).toBe(TEST_IDS.layout.main);
  });

  it('has correct metadata', () => {
    const metadata: Metadata = {
      title: APP_CONFIG.title,
      description: APP_CONFIG.description,
      authors: [{ name: APP_CONFIG.author }],
    };

    expect(metadata.title).toBe(APP_CONFIG.title);
    expect(metadata.description).toBe(APP_CONFIG.description);
    expect(Array.isArray(metadata.authors) && metadata.authors[0].name).toBe(APP_CONFIG.author);
  });
});
