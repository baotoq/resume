import { Section } from "./Section";
import type { Education as EducationType } from "@/types/resume";
import { BookOutlined } from "@ant-design/icons";

interface EducationProps {
  education: EducationType[];
}

export function EducationSection({ education }: EducationProps) {
  return (
    <Section title="Education" icon={<BookOutlined />}>
      <div className="flex flex-col gap-4">
        {education.map((item) => (
          <div key={item.school} className="avoid-break">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{item.degree}</h3>
                <span className="text-blue-600 font-semibold">{item.school}</span>
              </div>
              <span className="text-gray-600 font-medium mt-2 md:mt-0">{item.period}</span>
            </div>
            {item.details && <p className="text-gray-600 mt-2">{item.details}</p>}
          </div>
        ))}
      </div>
    </Section>
  );
}
