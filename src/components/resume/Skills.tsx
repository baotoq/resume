'use client';

import { SkillCategory } from "@/types/resume";
import { Card, List, Typography } from 'antd';

const { Title } = Typography;

interface SkillsProps {
  skillCategories: SkillCategory[];
}

export const Skills = ({ skillCategories }: SkillsProps) => {
  return (
    <div className="space-y-6">
      <Title level={2}>Skills</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, index) => (
          <Card
            key={index}
            title={category.title}
            className="h-full"
          >
            <List
              dataSource={category.skills}
              renderItem={(skill) => (
                <List.Item>
                  {skill}
                </List.Item>
              )}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};
