"use client";

import { Experience as ExperienceType } from "@/types/resume";
import { Typography, List } from "antd";
import { HistoryOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface ExperienceProps {
  experiences: ExperienceType[];
}

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
            <a href={"/"} className="text-2xl font-medium text-blue-600 hover:underline">
              {exp.company}
            </a>
            <div className="text-lg font-bold">{exp.title}</div>
            <div className="text-sm text-gray-500">
              {exp.period.start.toLocaleDateString()} -{" "}
              {exp.period.current ? "Present" : exp.period.end.toLocaleDateString()}
            </div>
            <div className="pl-2">
              <List
                dataSource={exp.achievements}
                renderItem={(achievement) => <List.Item>{achievement}</List.Item>}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
