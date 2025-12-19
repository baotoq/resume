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
          <div key={item.school}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1">
              <div>
                <h3 className="text-base font-semibold text-gray-900">{item.degree}</h3>
                <span className="text-blue-600 font-medium">{item.school}</span>
              </div>
              <span className="text-sm text-gray-500 font-medium">{item.period}</span>
            </div>
            {item.details && <p className="text-gray-600 text-sm mt-2">{item.details}</p>}
          </div>
        ))}
      </div>
    </Section>
  );
}
