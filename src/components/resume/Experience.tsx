import { Experience as ExperienceType } from "@/types/resume";

interface ExperienceProps {
  experiences: ExperienceType[];
}

export const Experience = ({ experiences }: ExperienceProps) => {
  const sortedExperiences = [...experiences].sort((a, b) => {
    const aYear = parseInt(a.period.split(' - ')[0]);
    const bYear = parseInt(b.period.split(' - ')[0]);
    return bYear - aYear;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-resume-text-primary dark:text-resume-dark-text-primary">
        Experience
      </h2>
      <div className="space-y-6">
        {sortedExperiences.map((exp, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-xl font-medium text-resume-text-primary dark:text-resume-dark-text-primary">
              {exp.title}
            </h3>
            <p className="text-resume-text-muted dark:text-resume-dark-text-muted">
              {exp.company} • {exp.period}
            </p>
            <ul className="list-disc list-inside space-y-1 text-resume-text-secondary dark:text-resume-dark-text-secondary">
              {exp.achievements.map((achievement, achievementIndex) => (
                <li key={achievementIndex}>{achievement}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
