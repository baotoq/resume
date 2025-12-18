import { Section } from "./Section";
import { UserOutlined } from "@ant-design/icons";

interface SummaryProps {
  summary: string;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <Section title="Professional Summary" icon={<UserOutlined />}>
      <div className="text-gray-700 text-base leading-relaxed">
        <p className="leading-relaxed">{summary}</p>
      </div>
    </Section>
  );
}
