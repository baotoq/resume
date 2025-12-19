import { Section } from "./Section";
import type { Experience as ExperienceType } from "@/types/resume";
import { ContainerOutlined } from "@ant-design/icons";

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
        <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full" />

        <div className="flex flex-col gap-8">
          {experiences.map((item) => (
            <div key={item.company.name} className="experience-item relative pl-8">
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-3 border-white shadow-lg ring-4 ring-blue-100" />

              {/* Card */}
              <div className="group p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <a
                      href={item.company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                    >
                      {item.company.name}
                    </a>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                      {formatPeriod(item.period)}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 px-3">
                      {calculateDuration(item.period)}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.summary}</p>

                {/* Skills */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {item.skills.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Achievements */}
                <ul className="space-y-2">
                  {item.achievements.map((achievement) => (
                    <li key={achievement} className="flex gap-3 text-gray-700 text-sm leading-relaxed">
                      <span className="text-blue-500 mt-1.5">•</span>
                      <span>{achievement}</span>
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
