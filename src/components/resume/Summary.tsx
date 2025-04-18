"use client";

import { Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

interface SummaryProps {
  summary: string;
}

export const Summary = ({ summary }: SummaryProps) => {
  return (
    <div>
      <Title level={2}>
        <UserOutlined />
        Summary
      </Title>
      <Paragraph>{summary}</Paragraph>
    </div>
  );
};
