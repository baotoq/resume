import type { PersonalInfo } from "@/types/resume";
import type { ReactNode } from "react";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LinkedinOutlined,
  GithubOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

interface HeaderProps {
  personal: PersonalInfo;
  pdfButton?: ReactNode;
}

export function Header({ personal, pdfButton }: HeaderProps) {
  const { name, title, contact } = personal;

  return (
    <header className="mb-10 text-center relative">
      <div className="absolute top-0 right-0">{pdfButton}</div>

      <h1 className="text-4xl md:text-5xl font-bold mb-2">{name}</h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-4">{title}</p>

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm md:text-base text-gray-700">
        <a
          href={`mailto:${contact.email}`}
          className="hover:text-blue-600 transition-colors flex items-center"
          aria-label="Email"
        >
          <MailOutlined className="mr-1.5" />
          {contact.email}
        </a>

        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            className="hover:text-blue-600 transition-colors flex items-center"
            aria-label="Phone"
          >
            <PhoneOutlined className="mr-1.5" />
            {contact.phone}
          </a>
        )}

        <span className="text-gray-500 flex items-center">
          <EnvironmentOutlined className="mr-1.5" />
          {contact.location}
        </span>

        {contact.linkedin && (
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors flex items-center"
            aria-label="LinkedIn Profile"
          >
            <LinkedinOutlined className="mr-1.5" />
            LinkedIn
          </a>
        )}

        {contact.github && (
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors flex items-center"
            aria-label="GitHub Profile"
          >
            <GithubOutlined className="mr-1.5" />
            GitHub
          </a>
        )}

        {contact.portfolio && (
          <a
            href={contact.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors flex items-center"
            aria-label="Portfolio Website"
          >
            <GlobalOutlined className="mr-1.5" />
            Portfolio
          </a>
        )}

        {contact.website && (
          <a
            href={contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors flex items-center"
            aria-label="Personal Website"
          >
            <GlobalOutlined className="mr-1.5" />
            Website
          </a>
        )}
      </div>
    </header>
  );
}
