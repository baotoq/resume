"use client";

import { Education as EducationType } from "@/types/resume";
import { List, Typography, Space } from "antd";
import { ReadOutlined, CalendarOutlined, BankOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface EducationProps {
  education: EducationType[];
}

export const Education = ({ education }: EducationProps) => {
  const sortedEducation = [...education].sort((a, b) => {
    const aYear = parseInt(a.period.split(" - ")[0]);
    const bYear = parseInt(b.period.split(" - ")[0]);
    return bYear - aYear;
  });

  return (
    <div>
      <Title level={2}>Education</Title>
      <List
        dataSource={sortedEducation}
        renderItem={(edu) => (
          <List.Item>
            <Space direction="vertical" size="small" className="w-full">
              <Space>
                <ReadOutlined />
                <Title level={4} className="!mb-0">
                  {edu.degree}
                </Title>
              </Space>
              <Space>
                <BankOutlined />
                <Text type="secondary">{edu.school}</Text>
                <CalendarOutlined />
                <Text type="secondary">{edu.period}</Text>
              </Space>
              <Text className="text-resume-text-secondary dark:text-resume-dark-text-secondary">{edu.details}</Text>
            </Space>
          </List.Item>
        )}
      />
    </div>
  );
};
