import { Section } from "./Section";
import type { Experience as ExperienceType } from "@/types/resume";
import { ContainerOutlined } from "@ant-design/icons";

// Parse text with **bold** and @@tech@@ markers and return React elements
function parseTextWithHighlights(text: string): React.ReactNode {
  // Split by both **bold** and @@tech@@ patterns
  const parts = text.split(/(\*\*[^*]+\*\*|@@[^@]+@@)/g);
  return parts.map((part) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const content = part.slice(2, -2);
      return (
        <strong key={`bold-${content}`} className="font-semibold text-[var(--foreground)]">
          {content}
        </strong>
      );
    }
    if (part.startsWith("@@") && part.endsWith("@@")) {
      const content = part.slice(2, -2);
      return (
        <span key={`tech-${content}`} className="font-semibold text-[var(--accent)]">
          {content}
        </span>
      );
    }
    return part;
  });
}

interface ExperienceProps {
  experiences: ExperienceType[];
}

const formatPeriod = (period: { start: Date; end?: Date; current?: boolean }): string => {
  const startDate = new Date(period.start);
  const endDate = period.end ? new Date(period.end) : null;

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  if (period.current) {
    return `${formatMonth(startDate)} - Present`;
  }

  return `${formatMonth(startDate)} - ${endDate ? formatMonth(endDate) : "Present"}`;
};

const calculateDuration = (period: { start: Date; end?: Date; current?: boolean }): string => {
  const startDate = new Date(period.start);
  const endDate = period.current || !period.end ? new Date() : new Date(period.end);

  const totalMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) {
    return `${months} month${months !== 1 ? "s" : ""}`;
  }
  if (months === 0) {
    return `${years} year${years !== 1 ? "s" : ""}`;
  }
  return `${years} year${years !== 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`;
};

export function ExperienceSection({ experiences }: ExperienceProps) {
  return (
    <Section title="Work Experience" icon={<ContainerOutlined />}>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-[var(--accent)] rounded-full" />

        <div className="flex flex-col gap-8">
          {experiences.map((item) => (
            <div key={item.company.name} className="experience-item relative pl-8">
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[var(--accent)] border-2 border-[var(--background)] shadow-md ring-4 ring-[var(--accent)]/10" />

              {/* Card */}
              <div className="group p-6 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                      {item.title}
                    </h3>
                    <a
                      href={item.company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] hover:underline font-semibold"
                    >
                      {item.company.name}
                    </a>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <span className="inline-flex items-center px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium rounded-full">
                      {formatPeriod(item.period)}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] mt-1 px-3">
                      {calculateDuration(item.period)}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-[var(--muted-foreground)] text-sm mb-4 leading-relaxed">{parseTextWithHighlights(item.summary)}</p>

                {/* Skills */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {item.skills.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-[var(--muted)] text-[var(--accent)] text-xs font-medium rounded-full border border-[var(--border)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Achievements */}
                <ul className="space-y-2">
                  {item.achievements.map((achievement) => (
                    <li key={achievement} className="flex gap-3 text-[var(--muted-foreground)] text-sm leading-relaxed">
                      <span className="text-[var(--accent)] mt-1.5">•</span>
                      <span>{parseTextWithHighlights(achievement)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
