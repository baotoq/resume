const SLUG_MAP: Record<string, { slug: string; variant: string }> = {
  react: { slug: "react", variant: "original" },
  typescript: { slug: "typescript", variant: "plain" },
  javascript: { slug: "javascript", variant: "plain" },
  go: { slug: "go", variant: "plain" },
  docker: { slug: "docker", variant: "plain" },
  kubernetes: { slug: "kubernetes", variant: "plain" },
  python: { slug: "python", variant: "plain" },
  "node.js": { slug: "nodejs", variant: "plain" },
  nodejs: { slug: "nodejs", variant: "plain" },
  node: { slug: "nodejs", variant: "plain" },
  postgresql: { slug: "postgresql", variant: "plain" },
  mysql: { slug: "mysql", variant: "original" },
  redis: { slug: "redis", variant: "plain" },
  mongodb: { slug: "mongodb", variant: "plain" },
  aws: { slug: "amazonwebservices", variant: "plain-wordmark" },
  graphql: { slug: "graphql", variant: "plain" },
  git: { slug: "git", variant: "plain" },
  terraform: { slug: "terraform", variant: "plain" },
  nginx: { slug: "nginx", variant: "original" },
  linux: { slug: "linux", variant: "plain" },
  figma: { slug: "figma", variant: "plain" },
  "next.js": { slug: "nextjs", variant: "plain" },
  nextjs: { slug: "nextjs", variant: "plain" },
  vue: { slug: "vuejs", variant: "plain" },
  swift: { slug: "swift", variant: "plain" },
  kotlin: { slug: "kotlin", variant: "plain" },
  java: { slug: "java", variant: "plain" },
  "spring boot": { slug: "spring", variant: "original" },
  spring: { slug: "spring", variant: "original" },
  "github actions": { slug: "githubactions", variant: "plain" },
};

interface TechStackIconsProps {
  stack?: string[];
}

export function TechStackIcons({ stack }: TechStackIconsProps) {
  if (!stack || stack.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-2 mt-3 mb-3"
      aria-label="Tech stack"
    >
      {stack.map((tech) => {
        const entry = SLUG_MAP[tech.trim().toLowerCase()];
        if (entry) {
          return (
            <i
              key={tech}
              className={`devicon-${entry.slug}-${entry.variant} colored text-2xl`}
              title={tech}
              aria-label={tech}
            />
          );
        }
        return (
          <span
            key={tech}
            className="bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5 text-xs"
          >
            {tech}
          </span>
        );
      })}
    </div>
  );
}
