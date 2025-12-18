import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your Name - Professional Resume",
  description:
    "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in modern web technologies and cloud infrastructure.",
  keywords: [
    "software engineer",
    "full-stack developer",
    "react",
    "typescript",
    "next.js",
    "resume",
    "portfolio",
  ],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Your Name - Professional Resume",
    description:
      "Software engineer resume showcasing experience in full-stack development and modern web technologies.",
    type: "profile",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
