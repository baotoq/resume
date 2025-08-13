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
  company: {
    name: string;
    url: string;
  };
  period: Period;
  achievements: string[];
  skills: string[];
  summary: string;
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
