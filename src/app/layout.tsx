import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Professional Resume",
  description: "A modern, responsive resume built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-text antialiased">
        {children}
      </body>
    </html>
  );
}
