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
            <Card className="transition-transform hover:-translate-y-1">
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    {entry.logo_url && (
                      <div>
                        <Image
                          src={entry.logo_url}
                          alt={entry.institution}
                          width={80}
                          height={80}
                          className="rounded-md w-[60px] h-[60px] print:w-[45px] print:h-[45px] object-contain"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 gap-1 flex-row items-center justify-between">
                      <div>
                        <h3 className="font-bold text-primary text-lg">
                          {entry.institution}
                        </h3>
                        <p className="text-lg font-bold text-foreground">
                          {entry.degree}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-extrabold text-muted-foreground">
                          {entry.startDate.slice(0, 4)} –{" "}
                          {entry.endDate
                            ? entry.endDate.slice(0, 4)
                            : "Present"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {entry.details && (
                    <p className="mt-1 text-base leading-relaxed text-foreground">
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
