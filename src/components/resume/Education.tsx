import { Section } from "./Section";
import type { Education as EducationType } from "@/types/resume";
import { Card, Typography } from "antd";
import { BookOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface EducationProps {
  education: EducationType[];
}

export function EducationSection({ education }: EducationProps) {
  return (
    <Section title="Education" icon={<BookOutlined />}>
      <div className="space-y-4">
        {education.map((item, index) => (
          <Card
            key={index}
            className="avoid-break hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500"
            style={{
              background: "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)",
            }}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div className="flex-1">
                <Title level={4} className="!mb-1 !text-gray-900">
                  {item.degree}
                </Title>
                <Text className="text-lg text-green-600 font-semibold">
                  {item.school}
                </Text>
              </div>
              <Text className="text-gray-600 font-medium mt-2 md:mt-0">
                {item.period}
              </Text>
            </div>
            {item.details && (
              <Paragraph className="text-gray-600 mt-2 mb-0">
                {item.details}
              </Paragraph>
            )}
          </Card>
        ))}
      </div>
    </Section>
  );
}
