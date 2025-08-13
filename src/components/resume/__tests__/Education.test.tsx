import { screen } from "@testing-library/react";
import { Education } from "../Education";
import { Education as EducationType } from "@/types/resume";
import { renderWithProviders } from "@/test/setup";

describe("Education", () => {
  const mockEducation: EducationType[] = [
    {
      degree: "Master of Science in Computer Science",
      school: "Stanford University",
      period: "2015 - 2017",
      details: "Focus on Machine Learning",
    },
    {
      degree: "Bachelor of Science in Computer Engineering",
      school: "MIT",
      period: "2011 - 2015",
      details: "Minor in Mathematics",
    },
  ];

  it("renders all degrees", () => {
    renderWithProviders(<Education education={mockEducation} />);
    mockEducation.forEach((edu) => {
      expect(screen.getByText(edu.degree)).toBeInTheDocument();
    });
  });

  it("renders all schools and periods", () => {
    renderWithProviders(<Education education={mockEducation} />);
    mockEducation.forEach((edu) => {
      expect(screen.getByText(edu.school)).toBeInTheDocument();
      expect(screen.getByText(edu.period)).toBeInTheDocument();
    });
  });

  it("renders education in reverse chronological order", () => {
    renderWithProviders(<Education education={mockEducation} />);
    const educationElements = screen.getAllByRole("heading", { level: 4 });
    expect(educationElements[0]).toHaveTextContent("Master of Science in Computer Science");
  });
});
