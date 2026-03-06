import { ForkOutlined, GithubOutlined, StarOutlined } from "@ant-design/icons";
import { languageColors } from "@/data/githubColors";
import type { GitHubRepo } from "@/types/resume";
import { Section } from "./Section";

interface ProjectsProps {
  repos: GitHubRepo[];
}

const compactNumber = new Intl.NumberFormat("en", { notation: "compact" });

function formatStars(count: number): string {
  return count > 999 ? compactNumber.format(count) : String(count);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function ProjectsSection({ repos }: ProjectsProps) {
  if (repos.length === 0) {
    return null;
  }

  return (
    <div className="print:hidden">
      <Section title="Projects" icon={<GithubOutlined />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 rounded-2xl bg-[var(--muted)] border border-[var(--border)] hover:shadow-md hover:border-[var(--accent)]/50 transition-all duration-200"
            >
              <div className="text-base font-semibold text-[var(--accent)]">{repo.name}</div>
              <p className="mt-1.5 text-sm text-[var(--secondary)] line-clamp-2">{repo.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-[var(--secondary)]">
                {repo.language && (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: languageColors[repo.language] ?? "#8b8b8b",
                      }}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <StarOutlined />
                  {formatStars(repo.stars)}
                </span>
                <span className="flex items-center gap-1">
                  <ForkOutlined />
                  {repo.forks}
                </span>
                <span>{formatDate(repo.updatedAt)}</span>
              </div>
            </a>
          ))}
        </div>
      </Section>
    </div>
  );
}
