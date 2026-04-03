import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import PlausibleProvider from "next-plausible";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SkipToContent } from "@/components/ui/SkipToContent";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://baotoq.github.io/resume"),
  title: "",
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
        <SkipToContent />
        <ThemeProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
