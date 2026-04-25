import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DownloadResumePill } from "./DownloadResumePill";

describe("DownloadResumePill", () => {
  it("renders a trigger labelled 'Download PDF' with data-pdf-trigger", () => {
    render(<DownloadResumePill />);
    const trigger = screen.getByRole("button", {
      name: /download resume as pdf/i,
    });
    expect(trigger).toHaveAttribute("data-pdf-trigger");
    expect(trigger).toHaveTextContent(/download pdf/i);
  });

  it("renders A4 and Letter menu items as download links when open", () => {
    render(<DownloadResumePill defaultOpen />);

    const a4 = screen.getByRole("menuitem", { name: /a4/i });
    const letter = screen.getByRole("menuitem", { name: /us letter/i });

    expect(a4).toHaveAttribute("href", "/to-quoc-bao-resume-a4.pdf");
    expect(a4).toHaveAttribute("download");
    expect(letter).toHaveAttribute("href", "/to-quoc-bao-resume-letter.pdf");
    expect(letter).toHaveAttribute("download");
  });
});
