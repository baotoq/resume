import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function Section({ title, children, icon }: SectionProps) {
  return (
    <section className="mb-8 avoid-break">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 pb-3 border-b-2 border-blue-500">
          {icon && <span className="text-blue-600">{icon}</span>}
          {title}
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
