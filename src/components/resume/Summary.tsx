import { Section } from "./Section";
import { UserOutlined } from "@ant-design/icons";

interface SummaryProps {
  summary: string;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <Section title="Professional Summary" icon={<UserOutlined />}>
      <div className="relative p-6 bg-[var(--muted)] rounded-2xl border border-[var(--border)]">
        <div className="absolute top-3 left-4 text-6xl text-[var(--accent)]/20 font-serif leading-none select-none">
          "
        </div>
        <p className="text-[var(--muted-foreground)] leading-relaxed pl-8 pr-4 italic">{summary}</p>
        <div className="absolute bottom-1 right-4 text-6xl text-[var(--accent)]/20 font-serif leading-none rotate-180 select-none">
          "
        </div>
      </div>
    </Section>
  );
}
