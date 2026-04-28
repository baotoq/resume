import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { EducationEntry } from "@/types/resume";

interface EducationSectionProps {
  education: EducationEntry[];
}

export function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-semibold leading-[1.2] text-foreground mb-6">
        Education
      </h2>
      <div className="flex flex-col gap-6">
        {education.map((entry) => (
          <article key={`${entry.institution}-${entry.degree}`}>
            <Card className="transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none hover:scale-[1.01]">
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    {entry.logo_url && (
                      <div className="shrink-0">
                        <Image
                          src={entry.logo_url}
                          alt={entry.institution}
                          width={80}
                          height={80}
                          className="rounded-md w-[60px] h-[60px] print:w-[45px] print:h-[45px] object-contain"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 gap-3 flex-row items-start justify-between min-w-0">
                      <div className="min-w-0">
                        <h3 className="font-bold text-primary text-lg text-balance">
                          {entry.institution}
                        </h3>
                        <p className="text-lg font-bold text-foreground text-balance">
                          {entry.degree}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-sm font-extrabold text-muted-foreground tabular">
                          {entry.startDate.slice(0, 4)} –{" "}
                          {entry.endDate
                            ? entry.endDate.slice(0, 4)
                            : "Present"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {entry.details && (
                    <p className="mt-1 text-base leading-relaxed text-foreground text-pretty">
                      {entry.details}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </article>
        ))}
      </div>
    </section>
  );
}
