import type { PersonalInfo } from "@/types/resume";
import type { ReactNode } from "react";

interface HeaderProps {
  personal: PersonalInfo;
  pdfButton?: ReactNode;
}

// Icon components
const EmailIcon = () => (
  <svg
    className="w-4 h-4 inline-block mr-1.5"
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <title>Email</title>
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="w-4 h-4 inline-block mr-1.5"
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <title>Phone</title>
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

const LocationIcon = () => (
  <svg
    className="w-4 h-4 inline-block mr-1.5"
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <title>Location</title>
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    className="w-4 h-4 inline-block mr-1.5"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <title>LinkedIn</title>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = () => (
  <svg
    className="w-4 h-4 inline-block mr-1.5"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <title>GitHub</title>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    className="w-4 h-4 inline-block mr-1.5"
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <title>Website</title>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
      clipRule="evenodd"
    />
  </svg>
);

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
          <EmailIcon />
          {contact.email}
        </a>

        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            className="hover:text-blue-600 transition-colors flex items-center"
            aria-label="Phone"
          >
            <PhoneIcon />
            {contact.phone}
          </a>
        )}

        <span className="text-gray-500 flex items-center">
          <LocationIcon />
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
            <LinkedInIcon />
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
            <GitHubIcon />
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
            <GlobeIcon />
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
            <GlobeIcon />
            Website
          </a>
        )}
      </div>
    </header>
  );
}
