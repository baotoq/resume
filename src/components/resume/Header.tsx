import type { ContactInfo } from "@/types/resume";
import type { ReactNode } from "react";
import {
  MailOutlined,
  PhoneOutlined,
  LinkedinOutlined,
  GithubOutlined,
} from "@ant-design/icons";

interface HeaderProps {
  name: string;
  title: string;
  contact: ContactInfo;
  pdfButton?: ReactNode;
}

export function Header({ name, title, contact, pdfButton }: HeaderProps) {
  return (
    <header className="pb-6 border-b-2 border-gray-200">
      <div className="flex flex-col gap-4">
        {/* Name and Title */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            {name}
          </h1>
          <p className="text-lg md:text-xl text-blue-600 font-medium mt-1">
            {title}
          </p>
        </div>

        {/* Contact Info - Single Row */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-600">
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
          >
            <MailOutlined className="text-gray-400" />
            <span>{contact.email}</span>
          </a>

          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
            >
              <PhoneOutlined className="text-gray-400" />
              <span>{contact.phone}</span>
            </a>
          )}

          {contact.linkedin && (
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
            >
              <LinkedinOutlined className="text-gray-400" />
              <span>LinkedIn</span>
            </a>
          )}

          {contact.github && (
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
            >
              <GithubOutlined className="text-gray-400" />
              <span>GitHub</span>
            </a>
          )}
        </div>

        {/* PDF Button */}
        <div className="no-print flex justify-center md:justify-start">
          {pdfButton}
        </div>
      </div>
    </header>
  );
}
