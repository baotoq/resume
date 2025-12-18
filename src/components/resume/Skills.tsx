import { Section } from "./Section";
import type { SkillCategory } from "@/types/resume";
import { Tag } from "antd";

interface SkillsProps {
  skills: SkillCategory[];
}

export function Skills({ skills }: SkillsProps) {
  return (
    <Section title="Skills & Technologies">
      <div className="space-y-4">
        {skills.map((category) => (
          <div key={category.category}>
            <h3 className="font-semibold text-lg mb-2 text-gray-800">
              {category.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <Tag key={skill} color="default">
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
