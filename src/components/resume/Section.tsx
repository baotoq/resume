'use client';

import { ReactNode } from "react";
import { Typography, Space } from 'antd';

const { Title } = Typography;

interface SectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

export function Section({ title, icon, children }: SectionProps) {
  return (
    <section className="mb-8">
      <Space className="w-full" direction="vertical" size="small">
        <Space align="center" className="w-full">
          {icon}
          <Title level={2} className="!mb-0 !text-resume-text-primary dark:!text-resume-dark-text-primary">
            {title}
          </Title>
        </Space>
        {children}
      </Space>
    </section>
  );
}
