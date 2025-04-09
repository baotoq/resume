import { SkillCategory } from "@/types/resume";

interface SkillsProps {
  skillCategories: SkillCategory[];
}

export const Skills = ({ skillCategories }: SkillsProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-resume-text-primary dark:text-resume-dark-text-primary">
        Skills
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-xl font-medium text-resume-text-primary dark:text-resume-dark-text-primary">
              {category.title}
            </h3>
            <ul className="list-disc list-inside space-y-1 text-resume-text-secondary dark:text-resume-dark-text-secondary">
              {category.skills.map((skill, skillIndex) => (
                <li key={skillIndex}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
