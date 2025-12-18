import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function Section({ title, children, icon }: SectionProps) {
  return (
    <section className="avoid-break rounded-xl overflow-hidden border border-gray-100">
      <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-gray-100 to-gray-50">
        {icon && (
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
            {icon}
          </span>
        )}
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-4 p-5 bg-white">{children}</div>
    </section>
  );
}
