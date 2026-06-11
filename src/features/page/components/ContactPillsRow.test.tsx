import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactPillsRow } from "./ContactPillsRow";

const props = {
  email: "jane@example.com",
  phone: "+15555550100",
  github: "https://github.com/example",
  linkedin: "https://linkedin.com/in/example",
};

describe("ContactPillsRow", () => {
  it("renders external links with target=_blank and aria-label", () => {
    render(<ContactPillsRow {...props} />);
    const anchor = screen.getByRole("link", { name: /github profile/i });
    expect(anchor).toHaveAttribute("href", "https://github.com/example");
    expect(anchor).toHaveAttribute("target", "_blank");
    expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
    expect(anchor).toHaveTextContent(/github/i);
  });

  it("renders the phone link without target=_blank", () => {
    render(<ContactPillsRow {...props} />);
    const anchor = screen.getByRole("link", { name: /^phone$/i });
    expect(anchor).toHaveAttribute("href", "tel:+15555550100");
    expect(anchor).not.toHaveAttribute("target");
  });

  it("shows the ask-my-resume button only when chat is enabled", () => {
    const { rerender } = render(<ContactPillsRow {...props} />);
    expect(screen.queryByRole("button", { name: /ask my resume/i })).toBeNull();

    rerender(<ContactPillsRow {...props} chatEnabled />);
    expect(
      screen.getByRole("button", { name: /ask my resume/i }),
    ).toBeInTheDocument();
  });
});
