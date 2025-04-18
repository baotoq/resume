import { render, screen } from "@testing-library/react";
import Home from "../page";
import {
  contactInfo,
  summary,
  education,
  skillCategories,
  projects,
  mainInfo,
} from "@/data/resume";

describe("Home", () => {
  it("renders the main info section", () => {
    render(<Home />);
    expect(screen.getByText(mainInfo.name)).toBeInTheDocument();
  });

  it("renders the contact section", () => {
    render(<Home />);
    expect(screen.getByText(contactInfo.email)).toBeInTheDocument();
    expect(screen.getByText(contactInfo.phone)).toBeInTheDocument();
  });

  it("renders the summary section", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "user Summary" })).toBeInTheDocument();
    expect(screen.getByText(summary)).toBeInTheDocument();
  });

  it("renders the education section", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "Education" })).toBeInTheDocument();
    expect(screen.getByText(education[0].degree)).toBeInTheDocument();
    expect(screen.getByText(education[0].school)).toBeInTheDocument();
    expect(screen.getByText(education[0].period)).toBeInTheDocument();
  });

  it("renders the skills section", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "Skills" })).toBeInTheDocument();
    expect(screen.getByText(skillCategories[0].title)).toBeInTheDocument();
    expect(screen.getByText(skillCategories[0].skills[0])).toBeInTheDocument();
  });

  it("renders the projects section", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByText(projects[0].name)).toBeInTheDocument();
    projects[0].technologies.split(",").forEach((tech) => {
      expect(screen.getByText(tech.trim())).toBeInTheDocument();
    });
    expect(screen.getByText(`• ${projects[0].achievements[0]}`)).toBeInTheDocument();
  });
});
