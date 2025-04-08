import imageLoader from '../imageLoader';

// Mock process.env.NODE_ENV
const mockNodeEnv = jest.fn();
Object.defineProperty(process, 'env', {
  get: () => ({ NODE_ENV: mockNodeEnv() }),
});

describe('imageLoader', () => {
  beforeEach(() => {
    mockNodeEnv.mockReset();
  });

  it('returns the correct image URL for production', () => {
    mockNodeEnv.mockReturnValue('production');
    const src = '/images/test.jpg';
    const result = imageLoader({ src });
    expect(result).toBe('/resume/images/test.jpg');
  });

  it('returns the correct image URL for development', () => {
    mockNodeEnv.mockReturnValue('development');
    const src = '/images/test.jpg';
    const result = imageLoader({ src });
    expect(result).toBe('/images/test.jpg');
  });

  it('handles paths without leading slash', () => {
    mockNodeEnv.mockReturnValue('production');
    const src = 'images/test.jpg';
    const result = imageLoader({ src });
    expect(result).toBe('/resume/images/test.jpg');
  });
});
