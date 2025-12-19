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
    <header className="relative pb-8">
      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />

      <div className="flex flex-col gap-5">
        {/* Name, Title and PDF Button Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent tracking-tight">
              {name}
            </h1>
            <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
              {title}
            </p>
          </div>
          {/* PDF Button */}
          <div className="no-print flex justify-center md:justify-end">
            {pdfButton}
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <a
            href={`mailto:${contact.email}`}
            className="group flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-50 rounded-full border border-gray-200 hover:border-blue-300 transition-all duration-300"
          >
            <MailOutlined style={{ color: "#3b82f6" }} />
            <span className="text-sm text-gray-700 group-hover:text-blue-600">{contact.email}</span>
          </a>

          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="group flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-green-50 rounded-full border border-gray-200 hover:border-green-300 transition-all duration-300"
            >
              <PhoneOutlined style={{ color: "#22c55e" }} />
              <span className="text-sm text-gray-700 group-hover:text-green-600">{contact.phone}</span>
            </a>
          )}

          {contact.linkedin && (
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-50 rounded-full border border-gray-200 hover:border-blue-400 transition-all duration-300"
            >
              <LinkedinOutlined style={{ color: "#0077b5" }} />
              <span className="text-sm text-gray-700 group-hover:text-blue-700">LinkedIn</span>
            </a>
          )}

          {contact.github && (
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-200 hover:border-gray-400 transition-all duration-300"
            >
              <GithubOutlined style={{ color: "#333" }} />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">GitHub</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
