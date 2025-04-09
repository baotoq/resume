export interface Education {
  degree: string;
  school: string;
  period: string;
  details: string;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  achievements: string[];
}

export interface Project {
  name: string;
  technologies: string;
  achievements: string[];
  image?: string;
  link?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
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
