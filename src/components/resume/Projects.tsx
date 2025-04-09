import { Project } from "@/types/resume";
import Image from "next/image";

interface ProjectsProps {
  projects: Project[];
}

export const Projects = ({ projects }: ProjectsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project, index) => (
        <div key={index} className="space-y-4 p-4 rounded-lg border border-resume-border dark:border-resume-dark-border">
          {project.image && (
            <div className="relative h-48 w-full overflow-hidden rounded-lg">
              <Image
                src={project.image}
                alt={`${project.name} screenshot`}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-resume-text-primary dark:text-resume-dark-text-primary">
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {project.name}
                </a>
              ) : (
                project.name
              )}
            </h3>
            <p className="text-resume-text-muted dark:text-resume-dark-text-muted">
              Technologies: {project.technologies}
            </p>
            <ul className="list-disc list-inside space-y-1 text-resume-text-secondary dark:text-resume-dark-text-secondary">
              {project.achievements.map((achievement, achievementIndex) => (
                <li key={achievementIndex}>{achievement}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
