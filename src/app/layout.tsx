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
  title: "To Quoc Bao - Senior Software Engineer Resume",
  description:
    "Experienced Software Engineer with 6+ years of proven expertise in designing and building scalable, high-performance web applications. Specializing in .NET Core, Golang, Kubernetes, and cloud infrastructure.",
  keywords: [
    "software engineer",
    "senior software engineer",
    ".net core",
    "golang",
    "kubernetes",
    "microservices",
    "aws",
    "azure",
    "ci/cd",
    "resume",
  ],
  authors: [{ name: "To Quoc Bao" }],
  openGraph: {
    title: "To Quoc Bao - Senior Software Engineer Resume",
    description:
      "Senior Software Engineer specializing in scalable web applications, microservices architecture, and cloud infrastructure.",
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
