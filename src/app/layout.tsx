import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
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
      <body className={`${inter.variable} antialiased`}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
