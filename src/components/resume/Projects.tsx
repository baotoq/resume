import { Project } from "@/types/resume";
import { Card, Tag, Space } from 'antd';
import { GithubOutlined, LinkOutlined } from '@ant-design/icons';
import Image from "next/image";

interface ProjectsProps {
  projects: Project[];
}

export const Projects = ({ projects }: ProjectsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project, index) => (
        <Card
          key={index}
          className="border-resume-border dark:border-resume-dark-border"
          cover={
            project.image && (
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={project.image}
                  alt={`${project.name} screenshot`}
                  fill={true.toString()}
                  className="object-cover"
                />
              </div>
            )
          }
          title={
            <h4 className="text-resume-text-primary dark:text-resume-dark-text-primary text-lg font-medium">
              {project.name}
            </h4>
          }
          actions={[
            project.link && (
              <a
                key="github"
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-resume-text-primary dark:text-resume-dark-text-primary hover:text-resume-accent dark:hover:text-resume-dark-accent"
              >
                <GithubOutlined /> View Project
              </a>
            ),
            project.demo && (
              <a
                key="demo"
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-resume-text-primary dark:text-resume-dark-text-primary hover:text-resume-accent dark:hover:text-resume-dark-accent"
              >
                <LinkOutlined /> Live Demo
              </a>
            ),
          ].filter(Boolean)}
        >
          <Space direction="vertical" size="small" className="w-full">
            <Space wrap>
              {project.technologies.split(',').map((tech, i) => (
                <Tag key={i} color="blue">
                  {tech.trim()}
                </Tag>
              ))}
            </Space>
            <div className="text-resume-text-secondary dark:text-resume-dark-text-secondary">
              {project.achievements.map((achievement, i) => (
                <p key={i} className="block">
                  • {achievement}
                </p>
              ))}
            </div>
          </Space>
        </Card>
      ))}
    </div>
  );
};
