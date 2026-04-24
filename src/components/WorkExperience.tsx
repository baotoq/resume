/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */

import { LogoImage } from "@/components/company-logos/LogoImage";
import { HighlightedBullet } from "@/components/HighlightedBullet";
import { TechStackIcons } from "@/components/techstack-icons/TechStackIcons";
import { Card, CardContent } from "@/components/ui/card";
import { computeDuration } from "@/lib/duration";
import type { ExperienceEntry } from "@/types/resume";

interface WorkExperienceProps {
  experience: ExperienceEntry[];
}

function formatDateRange(start: string, end: string | null): string {
  const formatMonth = (d: string) => {
    const [year, month] = d.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}

export function WorkExperience({ experience }: WorkExperienceProps) {
  const now = new Date();
  return (
    <section>
      <h2 className="text-xl font-semibold leading-[1.2] text-zinc-900 mb-6">
        Work Experience
      </h2>

      {/* Rail wrapper — relative context for line + dots */}
      <div className="relative pl-5 sm:pl-7 flex flex-col gap-6">
        {/* Single continuous timeline line — starts at first dot centre, ends at last card bottom */}
        <div
          className="absolute left-0.75 sm:left-1.75 top-7 bottom-0 w-0.5 bg-zinc-200"
          aria-hidden="true"
        />

        {experience.map((entry, index) => {
          const isCurrent = entry.endDate === null;

          return (
            <div key={index} className="relative">
              {/* Timeline dot — z-10 so it sits above the continuous line */}
              <div
                className={`absolute z-10 -left-5.5 sm:-left-6.5 top-5.5 w-3 h-3 rounded-full ${
                  isCurrent
                    ? "bg-blue-600"
                    : "border-2 border-zinc-300 bg-white"
                }`}
                aria-hidden="true"
              />

              {/* Card */}
              <article>
                <Card>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col flex-1 gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-bold text-blue-600 text-lg">
                              <LogoImage
                                company={entry.company}
                                link={entry.link}
                                logoUrl={entry.logo_url}
                              />
                            </h3>
                            <p className="text-xl font-bold text-zinc-900">
                              {entry.role}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-zinc-500">
                              {formatDateRange(entry.startDate, entry.endDate)}
                            </span>
                            <span className="text-xs text-zinc-400">
                              {computeDuration(
                                entry.startDate,
                                entry.endDate,
                                now,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ul className="flex flex-col gap-2">
                        {entry.bullets.map((bullet, i) => (
                          <li
                            key={i}
                            className="text-base leading-relaxed text-zinc-700 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[10px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-zinc-300"
                          >
                            <HighlightedBullet>{bullet}</HighlightedBullet>
                          </li>
                        ))}
                      </ul>
                      <TechStackIcons stack={entry.tech_stack} />
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
