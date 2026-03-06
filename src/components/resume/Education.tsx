import { BookOutlined } from "@ant-design/icons";
import type { Education as EducationType } from "@/types/resume";
import { Section } from "./Section";

interface EducationProps {
  education: EducationType[];
}

export function EducationSection({ education }: EducationProps) {
  return (
    <Section title="Education" icon={<BookOutlined />}>
      <div className="flex flex-col gap-4">
        {education.map((item) => (
          <div
            key={item.school}
            className="group p-6 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div>
                <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  {item.degree}
                </h3>
                <span className="text-[var(--accent)] font-semibold">{item.school}</span>
              </div>
              <span className="inline-flex items-center px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium rounded-full">
                {item.period}
              </span>
            </div>
            {item.details && (
              <p className="text-[var(--muted-foreground)] text-sm mt-3 leading-relaxed">{item.details}</p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
