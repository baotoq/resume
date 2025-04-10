'use client';

import { Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface SummaryProps {
  summary: string;
}

export const Summary = ({ summary }: SummaryProps) => {
  return (
    <div className="mb-4">
      <Title level={2} className="!text-xl !mb-2 flex items-center gap-2">
        <UserOutlined className="!text-base" />
        Summary
      </Title>
      <Paragraph className="!mb-0 text-resume-text-secondary dark:text-resume-dark-text-secondary">
        {summary}
      </Paragraph>
    </div>
  );
};
