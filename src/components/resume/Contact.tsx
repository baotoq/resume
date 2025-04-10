'use client';

import { ContactInfo } from '@/types/resume';
import { List, Typography, Space } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GithubOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface ContactProps {
  contactInfo: ContactInfo;
}

export const Contact = ({ contactInfo }: ContactProps) => {
  const contactItems = [
    {
      icon: <MailOutlined />,
      label: 'Email',
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
    {
      icon: <PhoneOutlined />,
      label: 'Phone',
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone}`,
    },
    {
      icon: <EnvironmentOutlined />,
      label: 'Location',
      value: contactInfo.location,
    },
    {
      icon: <LinkedinOutlined />,
      label: 'LinkedIn',
      value: contactInfo.linkedin,
      href: `https://${contactInfo.linkedin}`,
    },
    {
      icon: <GithubOutlined />,
      label: 'GitHub',
      value: contactInfo.github,
      href: `https://${contactInfo.github}`,
    },
  ];

  return (
    <div className="space-y-4">
      <Title level={2}>Contact</Title>
      <List
        dataSource={contactItems}
        renderItem={(item) => (
          <List.Item>
            <Space>
              {item.icon}
              <span className="text-resume-text-muted dark:text-resume-dark-text-muted">
                {item.label}:
              </span>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.label === 'LinkedIn' || item.label === 'GitHub' ? '_blank' : undefined}
                  rel={item.label === 'LinkedIn' || item.label === 'GitHub' ? 'noopener noreferrer' : undefined}
                  className="text-resume-text-primary dark:text-resume-dark-text-primary hover:underline"
                >
                  {item.value}
                </a>
              ) : (
                <span className="text-resume-text-primary dark:text-resume-dark-text-primary">
                  {item.value}
                </span>
              )}
            </Space>
          </List.Item>
        )}
      />
    </div>
  );
};
