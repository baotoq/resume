export interface ExperienceEntry {
  company: string;
  role: string;
  startDate: string; // "YYYY-MM" format
  endDate: string | null; // null renders as "Present"
  bullets: string[];
  logo_url: string;
  link: string;
  tech_stack?: string[]; // optional tech stack for Devicon icons
}

export interface EducationEntry {
  degree: string;
  institution: string;
  startDate: string; // "YYYY-MM" format
  endDate: string | null; // null renders as "Present"
  details?: string; // optional prose rendered as paragraph when present
  logo_url?: string;
  link?: string;
}

export interface CertificationEntry {
  name: string;
  abbrev?: string; // up to 4 chars shown on gradient tile; falls back to first 3 chars of name
  issuer: string;
  year: number;
  url?: string;
}

export interface ResumeData {
  name: string;
  title: string;
  github: string;
  linkedin: string;
  experience: ExperienceEntry[];
  skills: Record<string, string>; // category label -> comma-separated values
  bio?: string;
  education?: EducationEntry[];
  certifications?: CertificationEntry[];
}
