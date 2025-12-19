import { Section } from "./Section";
import type { SkillCategory } from "@/types/resume";
import { Tag } from "antd";
import { ToolOutlined } from "@ant-design/icons";

interface SkillsProps {
  skills: SkillCategory[];
}

export function SkillsSection({ skills }: SkillsProps) {
  return (
    <Section title="Skills & Technologies" icon={<ToolOutlined />}>
      <div className="flex flex-col gap-4">
        {skills.map((category) => (
          <div key={category.title}>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <Tag
                  key={skill}
                  className="!m-0 !bg-blue-50 !text-blue-700 !border-blue-200 !px-3 !py-1"
                >
                  {skill}
                </Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
