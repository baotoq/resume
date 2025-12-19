import { Section } from "./Section";
import type { SkillCategory } from "@/types/resume";
import { ToolOutlined } from "@ant-design/icons";

interface SkillsProps {
  skills: SkillCategory[];
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "Programming Languages": { bg: "from-blue-50 to-indigo-50", text: "text-blue-700", border: "border-blue-200" },
  "Databases & Caching": { bg: "from-teal-50 to-emerald-50", text: "text-teal-700", border: "border-teal-200" },
  "Cloud & Infrastructure": { bg: "from-purple-50 to-violet-50", text: "text-purple-700", border: "border-purple-200" },
  "CI/CD & DevOps": { bg: "from-amber-50 to-yellow-50", text: "text-amber-700", border: "border-amber-200" },
};

const getColors = (title: string) => {
  return categoryColors[title] || { bg: "from-gray-50 to-slate-50", text: "text-gray-700", border: "border-gray-200" };
};

export function SkillsSection({ skills }: SkillsProps) {
  return (
    <Section title="Skills & Technologies" icon={<ToolOutlined />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {skills.map((category) => {
          const colors = getColors(category.title);
          return (
            <div
              key={category.title}
              className={`p-4 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border}`}
            >
              <h3 className={`text-sm font-bold ${colors.text} mb-3 flex items-center gap-2`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 py-1.5 bg-white/80 ${colors.text} text-xs font-medium rounded-lg border ${colors.border} shadow-sm hover:shadow-md transition-shadow`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
