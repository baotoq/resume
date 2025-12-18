import type { PersonalInfo } from "@/types/resume";
import type { ReactNode } from "react";

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
          className="hover:text-blue-600 transition-colors"
          aria-label="Email"
        >
          {contact.email}
        </a>

        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            className="hover:text-blue-600 transition-colors"
            aria-label="Phone"
          >
            {contact.phone}
          </a>
        )}

        <span className="text-gray-500">{contact.location}</span>

        {contact.linkedin && (
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
            aria-label="LinkedIn Profile"
          >
            LinkedIn
          </a>
        )}

        {contact.github && (
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
            aria-label="GitHub Profile"
          >
            GitHub
          </a>
        )}

        {contact.portfolio && (
          <a
            href={contact.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
            aria-label="Portfolio Website"
          >
            Portfolio
          </a>
        )}

        {contact.website && (
          <a
            href={contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
            aria-label="Personal Website"
          >
            Website
          </a>
        )}
      </div>
    </header>
  );
}
