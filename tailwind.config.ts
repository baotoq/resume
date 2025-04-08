import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        text: {
          DEFAULT: "rgb(var(--text) / <alpha-value>)",
          muted: "rgb(var(--text-muted) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          hover: "rgb(var(--primary-hover) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        resume: {
          primary: '#1890ff',    // Ant Design's Daybreak Blue 6
          text: {
            primary: '#262626',  // Ant Design's Neutral 9
            secondary: '#595959', // Ant Design's Neutral 7
            muted: '#8c8c8c',    // Ant Design's Neutral 5
          },
          background: {
            primary: '#ffffff',  // White
            secondary: '#fafafa', // Ant Design's Gray 1
          },
          border: '#d9d9d9',     // Ant Design's Gray 4
          dark: {
            primary: '#1890ff',  // Keep primary blue in dark mode
            text: {
              primary: '#ffffff',   // White
              secondary: '#d9d9d9', // Ant Design's Gray 4
              muted: '#8c8c8c',     // Ant Design's Neutral 5
            },
            background: {
              primary: '#141414',   // Ant Design's Dark Theme Background
              secondary: '#1f1f1f', // Ant Design's Dark Theme Secondary
            },
            border: '#434343',      // Ant Design's Neutral 8
          },
          hover: {
            primary: '#40a9ff',     // Ant Design's Daybreak Blue 5
            dark: '#096dd9',        // Ant Design's Daybreak Blue 7
          }
        }
      }
    },
  },
  plugins: [],
};

export default config;
