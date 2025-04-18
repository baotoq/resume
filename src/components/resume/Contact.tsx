"use client";

import { ContactInfo } from "@/types/resume";
import { List } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LinkedinOutlined,
  GithubOutlined,
} from "@ant-design/icons";

interface ContactProps {
  contactInfo: ContactInfo;
}

export const Contact = ({ contactInfo }: ContactProps) => {
  const contactItems = [
    {
      icon: <MailOutlined />,
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
    {
      icon: <PhoneOutlined />,
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone}`,
    },
    {
      icon: <EnvironmentOutlined />,
      value: contactInfo.location,
    },
    {
      icon: <LinkedinOutlined />,
      value: contactInfo.linkedin,
      href: `https://${contactInfo.linkedin}`,
    },
    {
      icon: <GithubOutlined />,
      value: contactInfo.github,
      href: `https://${contactInfo.github}`,
    },
  ];

  return (
    <div className="">
      <List
        dataSource={contactItems}
        renderItem={(item) => (
          <List.Item>
            <a href={item.href}>
              {item.icon} {item.value}
            </a>
          </List.Item>
        )}
      />
    </div>
  );
};
