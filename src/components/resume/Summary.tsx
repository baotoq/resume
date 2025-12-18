import { Section } from "./Section";
import { UserOutlined } from "@ant-design/icons";

interface SummaryProps {
  summary: string;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <Section title="Professional Summary" icon={<UserOutlined />}>
      <div className="relative overflow-hidden">
        <span className="absolute left-0 top-0 text-5xl text-blue-200 font-serif leading-none">"</span>
        <p className="text-gray-700 leading-relaxed pl-8 pr-8 py-2 italic">{summary}</p>
        <span className="absolute right-0 bottom-0 text-5xl text-blue-200 font-serif leading-none rotate-180">"</span>
      </div>
    </Section>
  );
}
