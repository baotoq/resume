import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <ThemeProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
