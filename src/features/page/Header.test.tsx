import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { parseResumeFile } from "@/lib/parse-resume";
import { Header } from "./Header";

const resume = parseResumeFile();

describe("Header (data contract)", () => {
  it("renders the resume name as the page h1", () => {
    render(<Header resume={resume} email="" phone="" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      resume.name,
    );
  });

  it("renders the job title beneath the name", () => {
    const { container } = render(<Header resume={resume} email="" phone="" />);
    expect(container.querySelector("h1 + p")?.textContent).toBe(resume.title);
  });

  it("renders the bio text (markdown emphasis stripped)", () => {
    const { container } = render(<Header resume={resume} email="" phone="" />);
    if (resume.bio) {
      expect(container.textContent).toContain(resume.bio.replace(/\*/g, ""));
    }
  });

  it("links GitHub and LinkedIn to the resume URLs", () => {
    render(<Header resume={resume} email="" phone="" />);
    expect(
      screen.getByRole("link", { name: "GitHub profile" }),
    ).toHaveAttribute("href", resume.github);
    expect(
      screen.getByRole("link", { name: "LinkedIn profile" }),
    ).toHaveAttribute("href", resume.linkedin);
  });

  it("shows the email copy button only when an email is provided", () => {
    const { rerender } = render(<Header resume={resume} email="" phone="" />);
    expect(screen.queryByRole("button", { name: /copy email/i })).toBeNull();

    rerender(<Header resume={resume} email="me@example.com" phone="" />);
    expect(
      screen.getByRole("button", { name: /copy email/i }),
    ).toBeInTheDocument();
  });

  it("shows the phone link only when a phone is provided", () => {
    const { rerender } = render(<Header resume={resume} email="" phone="" />);
    expect(screen.queryByRole("link", { name: "Phone" })).toBeNull();

    rerender(<Header resume={resume} email="" phone="+123456789" />);
    expect(screen.getByRole("link", { name: "Phone" })).toHaveAttribute(
      "href",
      "tel:+123456789",
    );
  });
});
