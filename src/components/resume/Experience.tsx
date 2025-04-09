'use client';

import { Experience as ExperienceType } from "@/types/resume";
import { Typography, Space, List } from 'antd';

const { Title, Text } = Typography;

interface ExperienceProps {
  experiences: ExperienceType[];
}

export const Experience = ({ experiences }: ExperienceProps) => {
  const sortedExperiences = [...experiences].sort((a, b) => {
    const aYear = parseInt(a.period.split(' - ')[0]);
    const bYear = parseInt(b.period.split(' - ')[0]);
    return bYear - aYear;
  });

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Title level={2}>Experience</Title>
      <Space direction="vertical" size="large" className="w-full">
        {sortedExperiences.map((exp, index) => (
          <Space key={index} direction="vertical" size="small" className="w-full">
            <Title level={3}>{exp.title}</Title>
            <Text type="secondary">
              {exp.company} • {exp.period}
            </Text>
            <List
              dataSource={exp.achievements}
              renderItem={(achievement) => (
                <List.Item>
                  <Text>{achievement}</Text>
                </List.Item>
              )}
            />
          </Space>
        ))}
      </Space>
    </Space>
  );
};
