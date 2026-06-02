import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { parseResumeFile } from "@/lib/parse-resume";
import { formatDateRange } from "./formatDateRange";
import { WorkExperience } from "./WorkExperience";

// ClaudeCode.Combine reaches for browser internals jsdom lacks; the icon
// itself isn't under test here.
vi.mock("@lobehub/icons", () => ({
  ClaudeCode: { Combine: () => null },
}));

const { experience } = parseResumeFile();

describe("WorkExperience (data contract)", () => {
  it("renders one card per experience entry", () => {
    const { container } = render(<WorkExperience experience={experience} />);
    expect(container.querySelectorAll("article")).toHaveLength(
      experience.length,
    );
  });

  it("links each company logo to its URL, opening securely in a new tab", () => {
    render(<WorkExperience experience={experience} />);
    for (const entry of experience) {
      const link = screen.getByRole("link", {
        name: `${entry.company} (opens in new tab)`,
      });
      expect(link).toHaveAttribute("href", entry.link);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("shows each entry's role and formatted date range", () => {
    render(<WorkExperience experience={experience} />);
    for (const entry of experience) {
      expect(screen.getAllByText(entry.role).length).toBeGreaterThan(0);
      expect(
        screen.getAllByText(formatDateRange(entry.startDate, entry.endDate))
          .length,
      ).toBeGreaterThan(0);
    }
  });

  it("marks current roles (null endDate) with a Current badge", () => {
    render(<WorkExperience experience={experience} />);
    const currentCount = experience.filter((e) => e.endDate === null).length;
    expect(screen.queryAllByText("Current")).toHaveLength(currentCount);
  });

  it("renders a tech-stack row for every entry that lists a stack", () => {
    const { container } = render(<WorkExperience experience={experience} />);
    const withStack = experience.filter(
      (e) => (e.tech_stack?.length ?? 0) > 0,
    ).length;
    expect(container.querySelectorAll("[data-tech-stack]")).toHaveLength(
      withStack,
    );
  });
});
