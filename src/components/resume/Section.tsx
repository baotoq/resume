import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function Section({ title, children, icon }: SectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
        {icon && (
          <span className="text-blue-600 text-lg">
            {icon}
          </span>
        )}
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
          {title}
        </h2>
      </div>
      <div>{children}</div>
    </section>
  );
}
