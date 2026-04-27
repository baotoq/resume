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
            <Card className="p-4">
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    {entry.logo_url && (
                      <div>
                        <Image
                          src={entry.logo_url}
                          alt={entry.institution}
                          width={80}
                          height={80}
                          className="rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <h3 className="text-lg font-semibold text-foreground">
                        {entry.degree}
                      </h3>
                      <p className="text-base text-foreground">
                        {entry.institution}
                      </p>
                      <span className="text-sm font-semibold text-muted-foreground mt-0.5">
                        {entry.startDate.slice(0, 4)} –{" "}
                        {entry.endDate ? entry.endDate.slice(0, 4) : "Present"}
                      </span>
                    </div>
                  </div>
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
