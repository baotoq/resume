import { render, screen } from "@testing-library/react";
import Home from "../page";
import { contactInfo, summary, education, skillCategories, projects, mainInfo } from "@/data/resume";

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
});
