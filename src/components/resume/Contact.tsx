import { ContactInfo } from '@/types/resume';

interface ContactProps {
  contactInfo: ContactInfo;
}

export const Contact = ({ contactInfo }: ContactProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-resume-text-primary dark:text-resume-dark-text-primary mb-4">
        Contact
      </h2>
      <ul className="space-y-2">
        <li className="flex items-center space-x-2">
          <span className="text-resume-text-muted dark:text-resume-dark-text-muted">Email:</span>
          <a
            href={`mailto:${contactInfo.email}`}
            className="text-resume-text-primary dark:text-resume-dark-text-primary hover:underline"
          >
            {contactInfo.email}
          </a>
        </li>
        <li className="flex items-center space-x-2">
          <span className="text-resume-text-muted dark:text-resume-dark-text-muted">Phone:</span>
          <a
            href={`tel:${contactInfo.phone}`}
            className="text-resume-text-primary dark:text-resume-dark-text-primary hover:underline"
          >
            {contactInfo.phone}
          </a>
        </li>
        <li className="flex items-center space-x-2">
          <span className="text-resume-text-muted dark:text-resume-dark-text-muted">Location:</span>
          <span className="text-resume-text-primary dark:text-resume-dark-text-primary">
            {contactInfo.location}
          </span>
        </li>
        <li className="flex items-center space-x-2">
          <span className="text-resume-text-muted dark:text-resume-dark-text-muted">LinkedIn:</span>
          <a
            href={`https://${contactInfo.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-resume-text-primary dark:text-resume-dark-text-primary hover:underline"
          >
            {contactInfo.linkedin}
          </a>
        </li>
        <li className="flex items-center space-x-2">
          <span className="text-resume-text-muted dark:text-resume-dark-text-muted">GitHub:</span>
          <a
            href={`https://${contactInfo.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-resume-text-primary dark:text-resume-dark-text-primary hover:underline"
          >
            {contactInfo.github}
          </a>
        </li>
      </ul>
    </div>
  );
};
