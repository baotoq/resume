import type { ResumeData } from "@/types/resume";

export const resumeData: ResumeData = {
  personal: {
    name: "Your Name",
    title: "Software Engineer",
    contact: {
      email: "your.email@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "https://linkedin.com/in/yourprofile",
      github: "https://github.com/yourusername",
      portfolio: "https://yourportfolio.com",
    },
  },
  summary: {
    content: [
      "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in modern web technologies and cloud infrastructure. Proven track record of delivering scalable applications that serve millions of users.",
      "Passionate about building elegant solutions to complex problems, mentoring junior developers, and staying current with emerging technologies. Strong advocate for clean code, test-driven development, and collaborative team environments.",
    ],
  },
  experience: [
    {
      company: "Tech Company Inc",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "Present",
      responsibilities: [
        "Lead development of microservices architecture serving 1M+ daily active users, resulting in 40% improvement in system reliability",
        "Architected and implemented real-time data processing pipeline using Kafka and Redis, reducing latency by 60%",
        "Mentor team of 5 junior developers through code reviews, pair programming, and technical guidance",
        "Reduced deployment time by 65% through implementation of CI/CD best practices and infrastructure automation",
        "Collaborate with product managers and designers to define technical requirements and project roadmaps",
      ],
    },
    {
      company: "Startup Solutions LLC",
      position: "Full Stack Developer",
      location: "Austin, TX",
      startDate: "Jun 2019",
      endDate: "Dec 2020",
      responsibilities: [
        "Built responsive web applications using React, TypeScript, and Node.js for diverse client base",
        "Designed and implemented RESTful APIs serving 100K+ requests per day with 99.9% uptime",
        "Optimized database queries and indexing strategies, improving application performance by 50%",
        "Implemented comprehensive test suites achieving 85% code coverage using Jest and React Testing Library",
        "Participated in agile ceremonies and contributed to sprint planning and retrospectives",
      ],
    },
    {
      company: "Digital Agency Co",
      position: "Junior Developer",
      location: "Boston, MA",
      startDate: "Jul 2017",
      endDate: "May 2019",
      responsibilities: [
        "Developed and maintained client websites using HTML, CSS, JavaScript, and WordPress",
        "Collaborated with design team to implement pixel-perfect, responsive user interfaces",
        "Integrated third-party APIs including payment gateways, analytics, and social media platforms",
        "Provided technical support and bug fixes for legacy applications",
      ],
    },
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "Boston, MA",
      startDate: "Sep 2013",
      endDate: "May 2017",
      gpa: "3.8/4.0",
      honors: ["Cum Laude", "Dean's List (6 semesters)"],
      relevantCoursework: [
        "Data Structures & Algorithms",
        "Database Systems",
        "Software Engineering",
        "Web Development",
      ],
    },
  ],
  skills: [
    {
      category: "Languages",
      skills: [
        "TypeScript",
        "JavaScript",
        "Python",
        "Go",
        "SQL",
        "HTML",
        "CSS",
      ],
    },
    {
      category: "Frameworks & Libraries",
      skills: [
        "React",
        "Next.js",
        "Node.js",
        "Express",
        "NestJS",
        "Tailwind CSS",
        "Redux",
      ],
    },
    {
      category: "Tools & Platforms",
      skills: [
        "Git",
        "Docker",
        "Kubernetes",
        "AWS",
        "PostgreSQL",
        "MongoDB",
        "Redis",
      ],
    },
    {
      category: "Methodologies",
      skills: [
        "Agile/Scrum",
        "Test-Driven Development",
        "CI/CD",
        "Microservices",
        "REST APIs",
        "GraphQL",
      ],
    },
  ],
};
