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
          <div
            key={item.school}
            className="group p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.degree}
                </h3>
                <span className="text-blue-600 font-semibold">{item.school}</span>
              </div>
              <span className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full">
                {item.period}
              </span>
            </div>
            {item.details && (
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">{item.details}</p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
