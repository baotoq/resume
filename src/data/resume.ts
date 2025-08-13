import { ContactInfo, Education, Experience, Project, SkillCategory } from "@/types/resume";

export const mainInfo = {
  name: "To Quoc Bao",
  title: "Senior Software Engineer",
};

export const contactInfo: ContactInfo = {
  email: "baotoq@outlook.com",
  phone: "+84 *** *** ***",
  linkedin: "LinkedIn",
  github: "GitHub",
};

export const summary = `
  <div>Experienced Software Engineer with 6+ years of proven expertise in designing and building scalable, high-performance web applications.</div>
  <div>Hands-on experience in microservices architecture, CI/CD pipelines, GitOps workflows, and Kubernetes orchestration for reliable, scalable deployments.</div>
`;

export const experiences: Experience[] = [
  {
    title: "Senior Software Engineer",
    company: {
      name: "Upmesh",
      url: "https://upmesh.io",
    },
    period: {
      start: new Date("2021-10-01"),
      end: new Date(),
      current: true,
    },
    skills: [
      ".NET Core",
      "Golang",
      "gRPC",
      "ELK Stack",
      "MySQL",
      "Redis",
      "Kubernetes",
      "GitHub Actions",
      "AWS",
      "Terraform",
      "FluxCD",
      "Odoo",
    ],
    summary:
      "Upmesh is transforming online shopping by allowing people to buy products directly through live-stream videos, making e-commerce more interactive and engaging.",
    achievements: [
      "Designed and built scalable APIs using .NET Core and Golang, integrating Stripe and 3rd-party logistics services to align architecture with business needs and future growth.",
      "Implemented full-text search using Elasticsearch for millions of records, improving search query performance significantly.",
      "Pioneered the adoption of gRPC for efficient inter-service communication, resulting in improved performance and scalability across systems.",
      "Maintained GitOps workflow, Kubernetes clusters, CI/CD pipelines, and other essential components, ensuring the stability and performance of the system.",
      "Pioneered the use of Testcontainers to streamline unit and integration testing, significantly reducing test setup time and enhancing reliability.",
      "Optimized CI/CD pipeline, successfully reducing deployment time by 75%, significantly improved time-to-market for new features and updates.",
    ],
  },
  {
    title: "Senior Software Engineer",
    company: {
      name: "AS White Global",
      url: "#",
    },
    period: {
      start: new Date("2021-01-01"),
      end: new Date("2021-09-01"),
    },
    skills: [".NET Core", "EF Core", "MS SQL", "React.js", "CI/CD", "Azure"],
    summary:
      "Played a pivotal role in the development of a state-of-the-art web portal designed to aid internal users in efficiently managing personal injury claims.",
    achievements: [
      "Worked closely with the Product Owner and UK colleagues to thoroughly understand and refine project requirements, ensuring alignment with user needs and business objectives.",
      "Developed responsive React.js portal, designed RESTful APIs, optimized data flow and ensured smooth communication between different components of the portal.",
      "Performed unit tests for both frontend and backend. Collaborated code reviews with team members to maintain coding standards and improve overall code quality.",
      "Established and configured CI/CD pipelines using Azure Devops, enabling automated testing and efficient deployment processes.",
    ],
  },
  {
    title: "Software Engineer",
    company: {
      name: "NashTech Limited",
      url: "https://nashtech.com",
    },
    period: {
      start: new Date("2020-01-01"),
      end: new Date("2021-01-01"),
    },
    skills: [
      ".NET Core",
      "Dapper",
      "gRPC",
      "PostgreSQL",
      "Vue.js",
      "OpenTelemetry",
      "Kubernetes",
      "Azure",
    ],
    summary:
      "Contributed significantly to the development of a cutting-edge portal facilitating seamless document management and interaction with Courts for internal users.",
    achievements: [
      "Implemented a data standardization adapter that efficiently converted and transformed data from external legacy systems, ensuring smooth integration with internal systems.",
      "Implemented a feature-rich portal, designed RESTful APIs, gRPC services and other backend solutions.",
      "Implemented a real-time push notification with Azure SignalR providing instant updates and notifications.",
      "Integrated with Grafana, Prometheus, Alert Manager, Jeager for effective measurement and monitoring of metrics.",
      "Conducted comprehensive unit tests and integration tests, maintaining a minimum code coverage of 80%.",
    ],
  },
];

export const education: Education[] = [
  {
    degree: "Bachelor of Computer Science",
    school: "Ton Duc Thang University",
    period: "2014 - 2018",
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
