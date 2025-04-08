import { Experience as ExperienceType } from "@/types/resume";

interface ExperienceProps {
  experiences: ExperienceType[];
}

export function Experience({ experiences }: ExperienceProps) {
  return (
    <div>
      {experiences.map((exp, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-xl font-medium text-resume-text-primary dark:text-resume-dark-text-primary">
            {exp.title}
          </h3>
          <p className="text-resume-text-muted dark:text-resume-dark-text-muted">
            {exp.company} • {exp.period}
          </p>
          <ul className="list-disc list-inside mt-2 text-resume-text-secondary dark:text-resume-dark-text-secondary">
            {exp.achievements.map((achievement, i) => (
              <li key={i}>{achievement}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
