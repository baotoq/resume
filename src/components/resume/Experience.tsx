import { Section } from "./Section";
import type { Experience as ExperienceType } from "@/types/resume";
import { Tag } from "antd";
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
      <div className="flex flex-col gap-6">
        {experiences.map((item) => (
          <div key={item.company.name} className="experience-item">
            {/* Header Row */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <a
                  href={item.company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  {item.company.name}
                </a>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  {formatPeriod(item.period)}
                </span>
                <span className="block text-xs text-gray-400">
                  {calculateDuration(item.period)}
                </span>
              </div>
            </div>

            {/* Summary */}
            <p className="text-gray-600 text-sm mb-3">{item.summary}</p>

            {/* Skills */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {item.skills.map((tech) => (
                <Tag key={tech} className="!m-0 !bg-gray-100 !text-gray-700 !border-gray-200 !text-xs">
                  {tech}
                </Tag>
              ))}
            </div>

            {/* Achievements */}
            <ul className="list-disc list-outside ml-4 flex flex-col gap-1.5 text-gray-700 text-sm">
              {item.achievements.map((achievement) => (
                <li key={achievement} className="leading-relaxed pl-1">
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
