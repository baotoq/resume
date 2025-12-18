import { Section } from "./Section";
import type { EducationItem } from "@/types/resume";

interface EducationProps {
  education: EducationItem[];
}

export function Education({ education }: EducationProps) {
  return (
    <Section title="Education">
      {education.map((item, index) => (
        <div key={index} className="education-item avoid-break">
          <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
            <div>
              <h3 className="text-xl font-semibold">
                {item.degree} in {item.field}
              </h3>
              <p className="text-lg text-gray-700">{item.institution}</p>
            </div>
            <div className="text-gray-600 text-sm md:text-base md:text-right mt-1 md:mt-0">
              <p>
                {item.startDate} - {item.endDate}
              </p>
              <p>{item.location}</p>
            </div>
          </div>

          {item.gpa && (
            <p className="text-gray-700 mb-1">
              <span className="font-medium">GPA:</span> {item.gpa}
            </p>
          )}

          {item.honors && item.honors.length > 0 && (
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Honors:</span>{" "}
              {item.honors.join(", ")}
            </p>
          )}

          {item.relevantCoursework && item.relevantCoursework.length > 0 && (
            <p className="text-gray-700">
              <span className="font-medium">Relevant Coursework:</span>{" "}
              {item.relevantCoursework.join(", ")}
            </p>
          )}
        </div>
      ))}
    </Section>
  );
}
