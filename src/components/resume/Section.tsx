import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function Section({ title, children, icon }: SectionProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        {icon && (
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] text-lg shadow-lg shadow-[var(--accent)]/25">
            {icon}
          </span>
        )}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[var(--foreground)] tracking-tight">
            {title}
          </h2>
          <div className="h-1 w-16 bg-[var(--accent)] rounded-full mt-1" />
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}
