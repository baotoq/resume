import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { parseResumeFile } from "@/lib/parse-resume";
import { EducationSection } from "./EducationSection";

const { education = [] } = parseResumeFile();

describe("EducationSection (data contract)", () => {
  it("renders nothing when there are no entries", () => {
    const { container } = render(<EducationSection education={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders each entry's institution, degree and year range", () => {
    render(<EducationSection education={education} />);
    for (const entry of education) {
      expect(screen.getByText(entry.institution)).toBeInTheDocument();
      expect(screen.getByText(entry.degree)).toBeInTheDocument();

      const start = entry.startDate.slice(0, 4);
      const end = entry.endDate ? entry.endDate.slice(0, 4) : "Present";
      expect(
        screen.getByText(new RegExp(`${start}\\s*[–-]\\s*${end}`)),
      ).toBeInTheDocument();
    }
  });
});
