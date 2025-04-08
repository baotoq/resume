import { SkillCategory } from "@/types/resume";

interface SkillsProps {
  categories: SkillCategory[];
}

export function Skills({ categories }: SkillsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4" data-testid="skills-grid">
      {categories.map((category, index) => (
        <div key={index}>
          <h3 className="font-medium text-resume-text-primary dark:text-resume-dark-text-primary mb-2">
            {category.title}
          </h3>
          <ul className="text-resume-text-secondary dark:text-resume-dark-text-secondary">
            {category.skills.map((skill, skillIndex) => (
              <li key={skillIndex}>{skill}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
