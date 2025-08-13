"use client";

import { Experience as ExperienceType } from "@/types/resume";
import { Typography, List } from "antd";
import { HistoryOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface ExperienceProps {
  experiences: ExperienceType[];
}

const SkillTag = ({ skill }: { skill: string }) => {
  return (
    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200">{skill}</span>
  );
};

export const Experience = ({ experiences }: ExperienceProps) => {
  const sortedExperiences = [...experiences].sort((a, b) => {
    const aYear = a.period.start.getTime();
    const bYear = b.period.start.getTime();
    return bYear - aYear;
  });

  return (
    <div className="flex flex-col">
      <Title level={2}>
        <HistoryOutlined className="mr-1" />
        Experience
      </Title>
      <div className="flex flex-col gap-3">
        {sortedExperiences.map((exp, index) => (
          <div key={index} className="flex flex-col gap-1">
            <a href={exp.company.url} target="_blank" className="text-2xl font-medium text-blue-600 hover:underline">
              {exp.company.name}
            </a>
            <div className="text-sm text-gray-500">
              {`${exp.period.start.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })} - ${
                exp.period.current
                  ? "Present"
                  : exp.period.end.toLocaleDateString("en-US", { year: "numeric", month: "short" })
              }`}
            </div>
            <div className="text-lg font-bold">{exp.title}</div>
            <div className="flex flex-wrap gap-2">
              {exp.skills.map((skill, skillIndex) => (
                <SkillTag key={skillIndex} skill={skill} />
              ))}
            </div>
            <div className="font-semibold">{exp.summary}</div>
            <div className="pl-2">
              <List
                dataSource={exp.achievements}
                renderItem={(achievement) => <List.Item className="!p-1">{achievement}</List.Item>}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
