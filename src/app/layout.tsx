import type { Metadata } from "next";
import "./globals.css";

export const APP_CONFIG = {
  title: "Bao To Resume",
  description: "Professional resume of Bao To",
  author: "Bao To",
};

export const metadata: Metadata = {
  title: APP_CONFIG.title,
  description: APP_CONFIG.description,
  authors: [{ name: APP_CONFIG.author }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
