import { Section } from "./Section";
import type { Experience as ExperienceType } from "@/types/resume";
import { Tag, Card } from "antd";
import { ContainerOutlined, CalendarOutlined } from "@ant-design/icons";

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

export function ExperienceSection({ experiences }: ExperienceProps) {
  return (
    <Section title="Work Experience" icon={<ContainerOutlined />}>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-blue-300" />

        <div className="flex flex-col gap-8">
          {experiences.map((item) => (
            <div key={item.company.name} className="experience-item avoid-break relative pl-8">
              {/* Timeline dot */}
              <div className="absolute left-0 top-3 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white shadow-md" />

              <Card
                className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500"
                style={{ background: "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)" }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    <a
                      href={item.company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                    >
                      {item.company.name}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600 mt-2 md:mt-0">
                    <CalendarOutlined />
                    <span className="font-medium">{formatPeriod(item.period)}</span>
                  </div>
                </div>

                <p className="text-gray-600 italic mb-3 border-l-2 border-blue-200 pl-3">{item.summary}</p>

                <div className="mb-3 flex flex-wrap gap-1.5">
                  {item.skills.map((tech) => (
                    <Tag key={tech} color="blue" className="!m-0">
                      {tech}
                    </Tag>
                  ))}
                </div>

                <ul className="list-disc list-outside ml-5 flex flex-col gap-2 text-gray-700">
                  {item.achievements.map((achievement) => (
                    <li key={achievement} className="leading-relaxed">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
