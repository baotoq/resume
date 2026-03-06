import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import PlausibleProvider from "next-plausible";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://baotoq.github.io/resume"),
  title: "To Quoc Bao - Senior Software Engineer Resume",
  description:
    "Experienced Software Engineer with 8+ years of proven expertise in designing and building scalable, high-performance web applications. Specializing in .NET Core, Golang, Kubernetes, and cloud infrastructure.",
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
  creator: "To Quoc Bao",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "To Quoc Bao - Senior Software Engineer Resume",
    description:
      "Senior Software Engineer specializing in scalable web applications, microservices architecture, and cloud infrastructure.",
    type: "profile",
    url: "/",
    siteName: "To Quoc Bao Resume",
    locale: "en_US",
    images: [
      {
        url: "https://baotoq.github.io/resume/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "To Quoc Bao - Senior Software Engineer Resume",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "To Quoc Bao - Senior Software Engineer",
    description:
      "Senior Software Engineer specializing in scalable web applications, microservices architecture, and cloud infrastructure.",
    images: ["https://baotoq.github.io/resume/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PlausibleProvider domain="baotoq.github.io/resume" />
      </head>
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <ThemeProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
