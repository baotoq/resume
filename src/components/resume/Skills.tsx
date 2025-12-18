import { Section } from "./Section";
import type { SkillCategory } from "@/types/resume";
import { Tag, Card } from "antd";
import { ToolOutlined } from "@ant-design/icons";

interface SkillsProps {
  skills: SkillCategory[];
}

export function SkillsSection({ skills }: SkillsProps) {
  return (
    <Section title="Skills & Technologies" icon={<ToolOutlined />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((category) => (
          <Card
            key={category.title}
            className="hover:shadow-lg transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)",
            }}
          >
            <h3 className="font-bold text-base mb-3 text-gray-900 border-b-2 border-blue-200 pb-2">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <Tag
                  key={skill}
                  color="blue"
                  className="!m-0 !px-3 !py-1 !text-sm"
                >
                  {skill}
                </Tag>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
