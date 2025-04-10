'use client';

import { TEST_IDS } from "@/constants";

export function ClientLayout({ children }: { children?: React.ReactNode }) {
  if (process.env.NODE_ENV === 'test') {
    return (
      <div
        className="min-h-screen bg-background text-text antialiased"
        data-testid={TEST_IDS.layout.main}
      >
        {children}
      </div>
    );
  }

  return (
    <body
      className="min-h-screen bg-background text-text antialiased"
      data-testid={TEST_IDS.layout.main}
    >
      {children}
    </body>
  );
}
