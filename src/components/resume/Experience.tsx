import { Section } from "./Section";
import type { Experience as ExperienceType } from "@/types/resume";
import { Tag, Card, Typography } from "antd";
import { ContainerOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

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
      <div className="flex flex-col gap-4">
        {experiences.map((item, index) => (
          <Card
            key={index}
            className="experience-item avoid-break hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500"
            style={{ background: "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)" }}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
              <div className="flex-1">
                <Title level={4} className="!mb-1 !text-gray-900">
                  {item.title}
                </Title>
                <a
                  href={item.company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  {item.company.name}
                </a>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 mt-2 md:mt-0">
                <CalendarOutlined />
                <Text className="font-medium">{formatPeriod(item.period)}</Text>
              </div>
            </div>

            <Paragraph className="text-gray-600 italic mb-3 border-l-2 border-blue-200 pl-3">{item.summary}</Paragraph>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {item.skills.map((tech) => (
                <Tag key={tech} color="blue" className="!m-0">
                  {tech}
                </Tag>
              ))}
            </div>

            <ul className="list-disc list-outside ml-5 space-y-2 text-gray-700">
              {item.achievements.map((achievement, idx) => (
                <li key={idx} className="leading-relaxed">
                  {achievement}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}
