import type { ContactInfo, Education, Experience, Project, SkillCategory } from "@/types/resume";

export const mainInfo = {
  name: "To Quoc Bao",
  title: "Senior Software Engineer",
};

export const contactInfo: ContactInfo = {
  email: "baotoq@outlook.com",
  phone: "+84 708 270 396",
  linkedin: "https://www.linkedin.com/in/baotoq",
  github: "https://github.com/baotoq",
};

export const summary =
  "Experienced Software Engineer with 6+ years of proven expertise in designing and building scalable, high-performance web applications. Hands-on experience in microservices architecture, CI/CD pipelines, GitOps workflows, and Kubernetes orchestration for reliable, scalable deployments.";

export const experiences: Experience[] = [
  {
    title: "Senior Software Engineer",
    company: {
      name: "CoverGo",
      url: "https://covergo.com",
      icon: "covergo_favicon.ico",
    },
    period: {
      start: new Date("2025-02-01"),
      end: new Date(),
      current: true,
    },
    skills: [".NET Core", "DDD", "GraphQL", "Vue.js", "Dapr", "MongoDB", "Redis", "Kubernetes", "FluxCD"],
    summary:
      "CoverGo is a leading provider of insurance solutions, offering a comprehensive suite of products and services to businesses and individuals.",
    achievements: [
      "Developed a comprehensive insurance platform using .NET Core, DDD, GraphQL, Vue.js, Dapr, MongoDB, Redis, Kubernetes, and FluxCD.",
      "Implemented a scalable and efficient microservices architecture, ensuring high availability and performance.",
    ],
  },
  {
    title: "Senior Software Engineer",
    company: {
      name: "Upmesh",
      url: "https://upmesh.io",
      icon: "upmeshlive_logo.jpeg",
    },
    period: {
      start: new Date("2021-10-01"),
      end: new Date("2024-01-01"),
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
    title: "Fullstack Software Engineer",
    company: {
      name: "AS White Global",
      url: "#",
      icon: "aswhite_favicon.png",
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
      "Established and configured CI/CD pipelines using Azure DevOps, enabling automated testing and efficient deployment processes.",
    ],
  },
  {
    title: "Fullstack Software Engineer",
    company: {
      name: "NashTech Limited",
      url: "https://nashtech.com",
      icon: "nashtech_global_logo.jpeg",
    },
    period: {
      start: new Date("2018-12-01"),
      end: new Date("2020-12-01"),
    },
    skills: [".NET Core", "Dapper", "gRPC", "PostgreSQL", "Vue.js", "OpenTelemetry", "Kubernetes", "Azure"],
    summary:
      "Contributed significantly to the development of a cutting-edge portal facilitating seamless document management and interaction with Courts for internal users.",
    achievements: [
      "Implemented a data standardization adapter that efficiently converted and transformed data from external legacy systems, ensuring smooth integration with internal systems.",
      "Implemented a feature-rich portal, designed RESTful APIs, gRPC services and other backend solutions.",
      "Implemented a real-time push notification with Azure SignalR providing instant updates and notifications.",
      "Integrated with Grafana, Prometheus, Alert Manager, Jaeger for effective measurement and monitoring of metrics.",
      "Conducted comprehensive unit tests and integration tests, maintaining a minimum code coverage of 80%.",
    ],
  },
];

export const education: Education[] = [
  {
    degree: "Bachelor of Computer Science",
    school: "Ton Duc Thang University",
    period: "2014 - 2018",
    details: "Computer Science fundamentals, Software Engineering, Data Structures and Algorithms",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Programming Languages",
    skills: ["C#", "TypeScript", "Golang", "ASP.NET Core", "React.js", "Vue.js"],
  },
  {
    title: "Databases & Caching",
    skills: ["MySQL", "MS SQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "ELK Stack"],
  },
  {
    title: "Cloud & Infrastructure",
    skills: ["AWS", "Azure", "Kubernetes", "Docker", "Terraform"],
  },
  {
    title: "CI/CD & DevOps",
    skills: ["GitHub Actions", "CI/CD", "FluxCD", "GitOps"],
  },
];

export const projects: Project[] = [];
