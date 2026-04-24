import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TechStackIcons } from "./TechStackIcons";

describe("TechStackIcons", () => {
  it("returns null when stack is undefined", () => {
    const { container } = render(<TechStackIcons />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when stack is empty array", () => {
    const { container } = render(<TechStackIcons stack={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders an SVG icon for a known tech (exact lowercase)", () => {
    const { container } = render(<TechStackIcons stack={["react"]} />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("normalizes whitespace and case for the lookup (React, REACT, ' react ')", () => {
    for (const input of ["React", "REACT", " react "]) {
      const { container } = render(<TechStackIcons stack={[input]} />);
      expect(
        container.querySelector("svg"),
        `expected SVG for input ${JSON.stringify(input)}`,
      ).not.toBeNull();
    }
  });

  it("renders a Badge with the ORIGINAL text when tech is unknown", () => {
    render(<TechStackIcons stack={["UnknownTech"]} />);
    expect(screen.getByText("UnknownTech")).toBeInTheDocument();
  });
});
