export interface ContactInfo {
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
}

export interface Company {
  name: string;
  url: string;
  icon?: string;
}

export interface Period {
  start: Date;
  end?: Date;
  current?: boolean;
}

export interface Experience {
  title: string;
  company: Company;
  period: Period;
  skills: string[];
  summary: string;
  achievements: string[];
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  details?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface Project {
  name: string;
  technologies: string;
  achievements: string[];
}
