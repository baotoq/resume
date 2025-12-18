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
    <header className="pb-8 border-b border-gray-200">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
        {/* Left side: Name, Title, and Download Button */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            {name}
          </h1>
          <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
            {title}
          </p>
          <div className="mt-4 no-print">{pdfButton}</div>
        </div>

        {/* Right side: Contact Info */}
        <div className="flex flex-col gap-2 md:items-end">
          <a
            href={`mailto:${contact.email}`}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:shadow-md"
            aria-label="Email"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white group-hover:bg-blue-600 transition-colors">
              <MailOutlined />
            </span>
            <span className="text-gray-700 group-hover:text-blue-700 font-medium">
              {contact.email}
            </span>
          </a>

          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:shadow-md"
              aria-label="Phone"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white group-hover:bg-green-600 transition-colors">
                <PhoneOutlined />
              </span>
              <span className="text-gray-700 group-hover:text-green-700 font-medium">
                {contact.phone}
              </span>
            </a>
          )}

          <div className="flex gap-2 mt-1">
            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0077b5] text-white hover:bg-[#005885] hover:scale-110 transition-all duration-300 hover:shadow-lg"
                aria-label="LinkedIn Profile"
              >
                <LinkedinOutlined className="text-lg" />
              </a>
            )}

            {contact.github && (
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-900 hover:scale-110 transition-all duration-300 hover:shadow-lg"
                aria-label="GitHub Profile"
              >
                <GithubOutlined className="text-lg" />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
