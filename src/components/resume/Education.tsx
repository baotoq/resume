import { Education as EducationType } from "@/types/resume";

interface EducationProps {
  education: EducationType[];
}

export function Education({ education }: EducationProps) {
  return (
    <div>
      {education.map((edu, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-xl font-medium text-resume-text-primary dark:text-resume-dark-text-primary">
            {edu.degree}
          </h3>
          <p className="text-resume-text-muted dark:text-resume-dark-text-muted">
            {edu.school} • {edu.period}
          </p>
          <p className="text-resume-text-secondary dark:text-resume-dark-text-secondary">
            {edu.details}
          </p>
        </div>
      ))}
    </div>
  );
}
