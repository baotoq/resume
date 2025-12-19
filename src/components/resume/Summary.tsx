import { Section } from "./Section";
import { UserOutlined } from "@ant-design/icons";

interface SummaryProps {
  summary: string;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <Section title="Professional Summary" icon={<UserOutlined />}>
      <div className="relative p-5 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl border border-gray-100">
        <div className="absolute top-3 left-4 text-6xl text-blue-200 font-serif leading-none select-none">"</div>
        <p className="text-gray-700 leading-relaxed pl-8 pr-4 italic">{summary}</p>
        <div className="absolute bottom-1 right-4 text-6xl text-purple-200 font-serif leading-none rotate-180 select-none">"</div>
      </div>
    </Section>
  );
}
