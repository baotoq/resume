import { Card, CardContent } from "@/components/ui/card";
import type { CertificationEntry } from "@/types/resume";

interface CertificationsSectionProps {
  certifications: CertificationEntry[];
}

function tileLabel(entry: CertificationEntry): string {
  return entry.abbrev ?? entry.name.slice(0, 3).toUpperCase();
}

function CertTile({ label }: { label: string }) {
  return (
    <div className="accent-gradient-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white font-bold text-xs">
      {label}
    </div>
  );
}

function CertBody({ entry }: { entry: CertificationEntry }) {
  return (
    <div className="flex items-center gap-3">
      <CertTile label={tileLabel(entry)} />
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground truncate">
          {entry.name}
        </div>
        <div className="text-xs text-muted-foreground">
          {entry.issuer} · {entry.year}
        </div>
      </div>
    </div>
  );
}

export function CertificationsSection({
  certifications,
}: CertificationsSectionProps) {
  if (certifications.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-semibold leading-[1.2] text-foreground mb-6">
        Certifications
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certifications.map((entry) => {
          if (entry.url) {
            return (
              <a
                key={`${entry.name}-${entry.issuer}`}
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-2xl"
              >
                <Card className="hover-lift">
                  <CardContent>
                    <CertBody entry={entry} />
                  </CardContent>
                </Card>
              </a>
            );
          }
          return (
            <Card key={`${entry.name}-${entry.issuer}`} className="hover-lift">
              <CardContent>
                <CertBody entry={entry} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
