import { Section } from "./Section";
import type { SkillCategory } from "@/types/resume";

interface SkillsProps {
  skills: SkillCategory[];
}

export function Skills({ skills }: SkillsProps) {
  return (
    <Section title="Skills & Technologies">
      <div className="space-y-4">
        {skills.map((category, index) => (
          <div key={index}>
            <h3 className="font-semibold text-lg mb-2 text-gray-800">
              {category.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm border border-gray-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
