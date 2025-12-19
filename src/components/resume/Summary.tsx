import { Section } from "./Section";
import { UserOutlined } from "@ant-design/icons";

interface SummaryProps {
  summary: string;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <Section title="Professional Summary" icon={<UserOutlined />}>
      <p className="text-gray-700 leading-relaxed">{summary}</p>
    </Section>
  );
}
