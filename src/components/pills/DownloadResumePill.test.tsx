import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DownloadResumePill } from "./DownloadResumePill";

describe("DownloadResumePill", () => {
  it("renders an A4 download link with data-pdf-trigger", () => {
    render(<DownloadResumePill />);
    const link = screen.getByRole("link", {
      name: /download resume as pdf/i,
    });
    expect(link).toHaveAttribute("data-pdf-trigger");
    expect(link).toHaveAttribute("href", "/to-quoc-bao-resume-a4.pdf");
    expect(link).toHaveAttribute("download");
    expect(link).toHaveTextContent(/download pdf/i);
  });
});
