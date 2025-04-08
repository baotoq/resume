import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { GitHubIcon, LinkedInIcon } from "@/app/icons";
import { ContactInfo } from "@/types/resume";

interface HeaderProps {
  name: string;
  title: string;
  contact: ContactInfo;
}

export function Header({ name, title, contact }: HeaderProps) {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold mb-2 text-resume-text-primary dark:text-resume-dark-text-primary">
        {name}
      </h1>
      <p className="text-lg text-resume-text-secondary dark:text-resume-dark-text-secondary">
        {title}
      </p>
      <div className="flex justify-center items-center gap-6 mt-4 text-sm text-resume-text-muted dark:text-resume-dark-text-muted">
        <a
          href={`mailto:${contact.email}`}
          className="flex items-center gap-2 hover:text-resume-hover-primary dark:hover:text-resume-hover-dark transition-colors"
        >
          <EnvelopeIcon className="h-5 w-5" />
          {contact.email}
        </a>
        <a
          href={`tel:${contact.phone}`}
          className="flex items-center gap-2 hover:text-resume-hover-primary dark:hover:text-resume-hover-dark transition-colors"
        >
          <PhoneIcon className="h-5 w-5" />
          {contact.phone}
        </a>
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-resume-hover-primary dark:hover:text-resume-hover-dark transition-colors"
        >
          <LinkedInIcon className="h-5 w-5" />
          LinkedIn
        </a>
        <a
          href={contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-resume-hover-primary dark:hover:text-resume-hover-dark transition-colors"
        >
          <GitHubIcon className="h-5 w-5" />
          GitHub
        </a>
        <span className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5" />
          {contact.location}
        </span>
      </div>
    </header>
  );
}
