import { Education as EducationType } from "@/types/resume";

interface EducationProps {
  education: EducationType[];
}

export const Education = ({ education }: EducationProps) => {
  const sortedEducation = [...education].sort((a, b) => {
    const aYear = parseInt(a.period.split(' - ')[0]);
    const bYear = parseInt(b.period.split(' - ')[0]);
    return bYear - aYear;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-resume-text-primary dark:text-resume-dark-text-primary">
        Education
      </h2>
      <div className="space-y-6">
        {sortedEducation.map((edu, index) => (
          <div key={index} className="space-y-2">
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
    </div>
  );
};
