import { screen, render } from "@testing-library/react";
import { Experience } from "../Experience";
import { Experience as ExperienceType } from "@/types/resume";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("Experience", () => {
  const mockExperiences: ExperienceType[] = [
    {
      title: "Senior Software Engineer",
      company: {
        name: "Tech Corp",
        url: "https://techcorp.com",
      },
      period: {
        start: new Date("2020-01-01"),
        end: new Date(),
        current: true,
      },
      achievements: [
        "Led development of microservices architecture",
        "Improved application performance by 40%",
        "Implemented CI/CD pipeline",
      ],
    },
    {
      title: "Software Engineer",
      company: {
        name: "Startup Inc",
        url: "https://startupinc.com",
      },
      period: {
        start: new Date("2018-01-01"),
        end: new Date("2020-01-01"),
      },
      achievements: ["Developed RESTful APIs", "Built frontend components with React", "Optimized database queries"],
    },
  ];

  it("renders all job titles", () => {
    render(<Experience experiences={mockExperiences} />);
    mockExperiences.forEach((exp) => {
      expect(screen.getByText(exp.title)).toBeInTheDocument();
    });
  });

  it("renders all company names and periods", () => {
    render(<Experience experiences={mockExperiences} />);
    mockExperiences.forEach((exp) => {
      expect(screen.getByText(`${exp.company.name}`)).toBeInTheDocument();
    });
  });

  it("renders all achievements for each position", () => {
    render(<Experience experiences={mockExperiences} />);
    mockExperiences.forEach((exp) => {
      exp.achievements.forEach((achievement) => {
        expect(screen.getByText(achievement)).toBeInTheDocument();
      });
    });
  });
});
