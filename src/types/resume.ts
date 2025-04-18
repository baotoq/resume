export interface Education {
  degree: string;
  school: string;
  period: string;
  details: string;
}

export interface Period {
  start: Date;
  end: Date;
  current?: boolean;
}

export interface Experience {
  title: string;
  company: string;
  period: Period;
  achievements: string[];
  companyUrl?: string;
}

export interface Project {
  name: string;
  technologies: string;
  achievements: string[];
  image?: string;
  link?: string;
  demo?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
}

export interface ResumeData {
  contactInfo: ContactInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skillCategories: SkillCategory[];
  projects: Project[];
}
