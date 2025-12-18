import { Section } from "./Section";
import type { Summary as SummaryType } from "@/types/resume";

interface SummaryProps {
  summary: SummaryType;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <Section title="Professional Summary">
      <div className="text-gray-700 space-y-3">
        {summary.content.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  );
}
