import type { Metadata } from "next";
import "./globals.css";

const APP_CONFIG = {
  title: "Bao To Resume",
  description: "A modern, responsive resume built with Next.js and Tailwind CSS",
} as const;

export const metadata: Metadata = {
  title: APP_CONFIG.title,
  description: APP_CONFIG.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
