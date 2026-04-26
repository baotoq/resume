import { LogoImage } from "@/components/company-logos/LogoImage";
import { TechStackIcons } from "@/components/techstack-icons/TechStackIcons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { computeDuration } from "@/lib/duration";
import type { ExperienceEntry } from "@/types/resume";
import { HighlightedBullet } from "./components/HighlightedBullet";
import { formatDateRange } from "./formatDateRange";
import styles from "./WorkExperience.module.css";

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
                    ? `accent-gradient-bg ${styles.animatePulseRing}`
                    : "border-2 border-border bg-background"
                }`}
                aria-hidden="true"
              />

              {/* Card */}
              <article>
                <Card className="hover-lift">
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col flex-1 gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-bold text-primary text-lg">
                              <LogoImage
                                company={entry.company}
                                link={entry.link}
                                logoUrl={entry.logo_url}
                              />
                            </h3>
                            <p className="text-lg font-bold text-foreground">
                              {entry.role}
                            </p>
                          </div>
                          <div className="flex flex-col items-start sm:items-end gap-1">
                            <span className="text-sm font-bold text-muted-foreground">
                              {formatDateRange(entry.startDate, entry.endDate)}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {isCurrent && (
                                <Badge variant="accent">Current</Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
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
                      <TechStackIcons stack={entry.tech_stack} />
                      <ul className="flex flex-col gap-2">
                        {entry.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="text-base leading-relaxed text-foreground pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[10px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-border"
                          >
                            <HighlightedBullet>{bullet}</HighlightedBullet>
                          </li>
                        ))}
                      </ul>
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
