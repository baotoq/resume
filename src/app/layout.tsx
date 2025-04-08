import type { Metadata } from "next";
import { APP_CONFIG } from "@/constants";
import { TEST_IDS } from "@/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_CONFIG.title,
  description: APP_CONFIG.description,
  authors: [{ name: APP_CONFIG.author }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-testid={TEST_IDS.layout.root}>
      <body
        className="min-h-screen bg-background text-text antialiased"
        data-testid={TEST_IDS.layout.main}
      >
        {children}
      </body>
    </html>
  );
}
