import { LogoImage } from "@/components/company-logos/LogoImage";
import { TechStackIcons } from "@/components/techstack-icons/TechStackIcons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { computeDuration } from "@/lib/duration";
import type { ExperienceEntry } from "@/types/resume";
import { CompanyDescription } from "./components/CompanyDescription";
import { ExperienceImageGallery } from "./components/ExperienceImageGallery";
import { HighlightedBullet } from "./components/HighlightedBullet";
import { formatDateRange } from "./formatDateRange";

interface WorkExperienceProps {
  experience: ExperienceEntry[];
}

export function WorkExperience({ experience }: WorkExperienceProps) {
  const now = new Date();
  return (
    <section>
      <h2 className="text-2xl font-semibold leading-[1.2] text-foreground mb-6">
        Work Experience
      </h2>

      {/* Rail wrapper — relative context for line + dots */}
      <div
        data-timeline-wrap
        className="relative pl-5 sm:pl-7 flex flex-col gap-6"
      >
        {/* Single continuous timeline line — starts at first dot centre, ends at last card bottom */}
        <div
          data-timeline
          className="absolute left-0.75 sm:left-1.75 top-7 bottom-0 w-0.5"
          style={{
            background:
              "linear-gradient(180deg, var(--color-accent-start) 0%, var(--color-accent-end) 15%, var(--border) 40%)",
          }}
          aria-hidden="true"
        />

        {experience.map((entry, index) => {
          const isCurrent = entry.endDate === null;
          const breakAfter = index === 2;

          return (
            <div
              key={`${entry.company}-${entry.startDate}`}
              className="relative"
              {...(breakAfter ? { "data-pdf-break-after": "" } : {})}
            >
              {/* Timeline dot — z-10 so it sits above the continuous line */}
              <div
                data-timeline
                className={`absolute z-10 -left-5.5 sm:-left-6.5 top-5.5 w-3 h-3 rounded-full ${
                  isCurrent
                    ? "accent-gradient-bg animate-pulse-ring"
                    : "border-2 border-border bg-background"
                }`}
                aria-hidden="true"
              />

              {/* Card */}
              <article>
                <Card className="transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none hover:scale-[1.01]">
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-1 gap-3 flex-row items-start justify-between">
                          <div className="min-w-0">
                            <h3 className="font-bold text-primary text-lg">
                              <LogoImage
                                company={entry.company}
                                link={entry.link}
                                logoUrl={entry.logo_url}
                              />
                            </h3>
                            <p className="text-lg font-bold text-foreground text-balance">
                              {entry.role}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-sm font-extrabold text-muted-foreground tabular">
                              {formatDateRange(entry.startDate, entry.endDate)}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {isCurrent && (
                                <Badge variant="accent">Current</Badge>
                              )}
                              <span className="text-sm text-muted-foreground tabular">
                                {computeDuration(
                                  entry.startDate,
                                  entry.endDate,
                                  now,
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CompanyDescription description={entry.description} />
                      <ul className="flex flex-col gap-2">
                        {entry.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="text-base leading-relaxed text-foreground text-pretty pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[10px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-border"
                          >
                            <HighlightedBullet>{bullet}</HighlightedBullet>
                          </li>
                        ))}
                      </ul>
                      <ExperienceImageGallery images={entry.images ?? []} />
                      <TechStackIcons
                        className="pt-2 justify-center"
                        stack={entry.tech_stack}
                      />
                    </div>
                  </CardContent>
                </Card>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
