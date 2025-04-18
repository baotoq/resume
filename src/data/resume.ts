import { ContactInfo, Education, Experience, Project, SkillCategory } from "@/types/resume";

export const mainInfo = {
  name: "To Quoc Bao",
  title: "Senior Software Engineer",
};

export const contactInfo: ContactInfo = {
  email: "baotoq@outlook.com",
  phone: "+84 909 273 966",
  linkedin: "LinkedIn",
  github: "GitHub",
};

export const summary =
  "Experienced Software Engineer with 6+ years of proven expertise in designing and building scalable, high-performance web applications. Hands-on experience in microservices architecture, CI/CD pipelines, GitOps workflows, and Kubernetes orchestration for reliable, scalable deployments.";

export const experiences: Experience[] = [
  {
    title: "Senior Staff Engineer",
    company: "TechCorp Inc.",
    period: {
      start: new Date("2020-01-01"),
      end: new Date(),
      current: true,
    },
    achievements: [
      "Led architecture and development of a microservices platform handling 1M+ daily transactions",
      "Reduced cloud infrastructure costs by 40% through optimization and implementation of serverless architecture",
      "Mentored 15+ engineers and established engineering best practices across 5 teams",
    ],
  },
  {
    title: "Lead Software Engineer",
    company: "Innovation Labs",
    period: {
      start: new Date("2017-01-01"),
      end: new Date("2020-01-01"),
    },
    achievements: [
      "Architected and led development of a real-time analytics platform processing 5TB+ data daily",
      "Improved system reliability from 99.5% to 99.95% through comprehensive monitoring and auto-scaling",
      "Led migration from monolith to microservices, reducing deployment time from hours to minutes",
    ],
  },
  {
    title: "Senior Software Engineer",
    company: "StartupTech",
    period: {
      start: new Date("2014-01-01"),
      end: new Date("2017-01-01"),
    },
    achievements: [
      "Developed core payment processing system handling $500M+ in annual transactions",
      "Implemented CI/CD pipeline reducing deployment time by 70%",
      "Led team of 5 engineers in rebuilding the customer-facing dashboard",
    ],
  },
];

export const education: Education[] = [
  {
    degree: "Master of Science in Computer Science",
    school: "Stanford University",
    period: "2012 - 2014",
    details: "Focus: Distributed Systems and Machine Learning",
  },
  {
    degree: "Bachelor of Science in Computer Science",
    school: "UC Berkeley",
    period: "2008 - 2012",
    details: "GPA: 3.9/4.0, Honors Program",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    skills: ["TypeScript/JavaScript", "Go", "Python", "Java"],
  },
  {
    title: "Technologies",
    skills: ["React/Next.js", "Node.js/Express", "GraphQL/REST", "Kubernetes/Docker"],
  },
  {
    title: "Cloud & Tools",
    skills: ["AWS/GCP", "Terraform/CloudFormation", "CI/CD (GitHub Actions)", "MongoDB/PostgreSQL"],
  },
];

export const projects: Project[] = [
  {
    name: "Enterprise Microservices Platform",
    technologies: "TypeScript, Node.js, Kubernetes, AWS",
    achievements: [
      "Designed and implemented a scalable microservices architecture handling 10K+ requests/second",
      "Reduced system latency by 60% through caching and optimization",
      "Implemented zero-downtime deployment strategy across multiple regions",
    ],
  },
  {
    name: "Real-time Analytics Engine",
    technologies: "Go, Kafka, Elasticsearch, GCP",
    achievements: [
      "Built distributed data processing pipeline handling 1TB+ daily data",
      "Implemented real-time anomaly detection using machine learning",
      "Reduced processing latency from minutes to seconds",
    ],
  },
];
