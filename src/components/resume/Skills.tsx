import { Section } from "./Section";
import type { SkillCategory } from "@/types/resume";
import { ToolOutlined } from "@ant-design/icons";

interface SkillsProps {
  skills: SkillCategory[];
}

export function SkillsSection({ skills }: SkillsProps) {
  return (
    <Section title="Skills & Technologies" icon={<ToolOutlined />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {skills.map((category) => (
          <div
            key={category.title}
            className="p-5 rounded-2xl bg-[var(--muted)] border border-[var(--border)]"
          >
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-[var(--card)] text-[var(--foreground)] text-xs font-medium rounded-lg border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--accent)]/50 transition-all duration-200"
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
