import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <section className="mb-8 avoid-break">
      <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-300 pb-2">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
