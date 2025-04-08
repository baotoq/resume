import { Project } from "@/types/resume";

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <div>
      {projects.map((project, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-xl font-medium text-resume-text-primary dark:text-resume-dark-text-primary">
            {project.name}
          </h3>
          <p className="text-resume-text-muted dark:text-resume-dark-text-muted mb-2">
            Technologies: {project.technologies}
          </p>
          <ul className="list-disc list-inside text-resume-text-secondary dark:text-resume-dark-text-secondary">
            {project.achievements.map((achievement, i) => (
              <li key={i}>{achievement}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
