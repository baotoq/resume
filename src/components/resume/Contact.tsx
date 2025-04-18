"use client";

import { ContactInfo } from "@/types/resume";
import { MailOutlined, PhoneOutlined, LinkedinOutlined, GithubOutlined } from "@ant-design/icons";

interface ContactProps {
  contactInfo: ContactInfo;
}

export const Contact = ({ contactInfo }: ContactProps) => {
  const contactItems = [
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
  ];

  return (
    <div className="flex flex-col gap-2">
      {contactItems.map((item) => (
        <div className="flex gap-1 text-blue-600" key={item.value}>
          {item.icon}
          <a className="hover:underline" href={item.href} key={item.value}>
            {item.value}
          </a>
        </div>
      ))}
    </div>
  );
};
