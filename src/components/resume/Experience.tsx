import { Section } from "./Section";
import type { ExperienceItem } from "@/types/resume";

interface ExperienceProps {
  experience: ExperienceItem[];
}

export function Experience({ experience }: ExperienceProps) {
  return (
    <Section title="Work Experience">
      {experience.map((item, index) => (
        <div key={index} className="experience-item avoid-break">
          <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
            <div>
              <h3 className="text-xl font-semibold">{item.position}</h3>
              <p className="text-lg text-gray-700">{item.company}</p>
            </div>
            <div className="text-gray-600 text-sm md:text-base md:text-right mt-1 md:mt-0">
              <p>
                {item.startDate} - {item.endDate}
              </p>
              <p>{item.location}</p>
            </div>
          </div>
          {item.techStack && item.techStack.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {item.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium border border-blue-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
          <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700">
            {item.responsibilities.map((responsibility, idx) => (
              <li key={idx} className="leading-relaxed">
                {responsibility}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Section>
  );
}
