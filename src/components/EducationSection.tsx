/** biome-ignore-all lint/suspicious/noArrayIndexKey: stable list from static YAML data */

import { Card, CardContent } from "@/components/ui/card";
import type { EducationEntry } from "@/types/resume";

interface EducationSectionProps {
  education: EducationEntry[];
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

export function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold leading-[1.2] text-foreground mb-6">
        Education
      </h2>
      <div className="flex flex-col gap-6">
        {education.map((entry, index) => (
          <article key={index}>
            <Card>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-0">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {entry.degree}
                    </h3>
                    <p className="text-base text-foreground">
                      {entry.institution}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground sm:text-right">
                    {formatDateRange(entry.startDate, entry.endDate)}
                  </span>
                </div>
                {entry.details && (
                  <p className="mt-4 text-base leading-relaxed text-foreground">
                    {entry.details}
                  </p>
                )}
              </CardContent>
            </Card>
          </article>
        ))}
      </div>
    </section>
  );
}
