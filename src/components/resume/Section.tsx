import { ReactNode } from "react";

interface SectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

export function Section({ title, icon, children }: SectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-resume-text-primary dark:text-resume-dark-text-primary border-b border-resume-border dark:border-resume-dark-border pb-2 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}
