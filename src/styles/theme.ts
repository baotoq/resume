export const theme = {
  colors: {
    primary: {
      DEFAULT: '#1677ff',
      hover: '#4096ff',
      active: '#0958d9',
    },
    text: {
      DEFAULT: '#000000e0',
      secondary: '#00000073',
      tertiary: '#00000040',
    },
    background: {
      DEFAULT: '#ffffff',
      secondary: '#f5f5f5',
      tertiary: '#f0f0f0',
    },
    border: {
      DEFAULT: '#d9d9d9',
      secondary: '#f0f0f0',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type Theme = typeof theme;
