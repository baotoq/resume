/** biome-ignore-all lint/performance/noImgElement: external cert badge urls (e.g. credly.com) */

import { Card, CardContent } from "@/components/ui/card";
import type { CertificationEntry } from "@/types/resume";

interface CertificationsSectionProps {
  certifications: CertificationEntry[];
}

function formatMonth(d: string): string {
  const [year, month] = d.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function CertLogo({ entry }: { entry: CertificationEntry }) {
  if (entry.logo_url) {
    return (
      <img
        src={entry.logo_url}
        alt={entry.issuer}
        loading="lazy"
        className="h-16 w-16 shrink-0 rounded-md object-contain"
      />
    );
  }
  const label = entry.abbrev ?? entry.name.slice(0, 3).toUpperCase();
  return (
    <div className="accent-gradient-bg flex h-16 w-16 shrink-0 items-center justify-center rounded-md text-white font-bold text-xs">
      {label}
    </div>
  );
}

function CertBody({ entry }: { entry: CertificationEntry }) {
  return (
    <div className="flex items-center gap-4">
      <CertLogo entry={entry} />
      <div className="min-w-0 flex flex-1 flex-col gap-1">
        <h3 className="text-sm font-semibold text-foreground leading-snug text-balance">
          {entry.name}
        </h3>
        <p className="text-xs text-foreground/90">{entry.issuer}</p>
        <p className="text-xs text-muted-foreground">
          {formatMonth(entry.issuedDate)}
          {entry.expiresDate && <> · {formatMonth(entry.expiresDate)}</>}
        </p>
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
      <div className="grid gap-4 sm:grid-cols-2">
        {certifications.map((entry) => {
          const key = `${entry.name}-${entry.issuer}-${entry.issuedDate}`;
          const card = (
            <Card className="transition-transform hover:scale-[1.01]">
              <CardContent>
                <CertBody entry={entry} />
              </CardContent>
            </Card>
          );
          if (entry.url) {
            return (
              <a
                key={key}
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${entry.name} (opens in new tab)`}
                className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                {card}
              </a>
            );
          }
          return <div key={key}>{card}</div>;
        })}
      </div>
    </section>
  );
}
