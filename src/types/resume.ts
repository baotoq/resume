export interface ContactInfo {
  email: string;
  phone?: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  contact: ContactInfo;
}

export interface Summary {
  content: string[];
}

export interface ExperienceItem {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
  techStack?: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
  relevantCoursework?: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: Summary;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
}
