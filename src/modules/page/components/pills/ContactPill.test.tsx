import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ContactPill, type PillLink } from "./ContactPill";

function StubIcon() {
  return <svg data-testid="icon" />;
}

describe("ContactPill", () => {
  it("renders an external link with target=_blank and aria-label", () => {
    const link: PillLink = {
      label: "GitHub profile",
      href: "https://github.com/example",
      text: "GitHub",
      Icon: StubIcon,
    };
    render(
      <TooltipProvider>
        <ContactPill link={link} />
      </TooltipProvider>,
    );
    const anchor = screen.getByRole("link", { name: /github profile/i });
    expect(anchor).toHaveAttribute("href", "https://github.com/example");
    expect(anchor).toHaveAttribute("target", "_blank");
    expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
    expect(anchor).toHaveTextContent(/github/i);
  });

  it("renders a non-http link without target=_blank", () => {
    const link: PillLink = {
      label: "Phone",
      href: "tel:+15555550100",
      text: "+1 555-555-0100",
      Icon: StubIcon,
    };
    render(
      <TooltipProvider>
        <ContactPill link={link} />
      </TooltipProvider>,
    );
    const anchor = screen.getByRole("link", { name: /phone/i });
    expect(anchor).toHaveAttribute("href", "tel:+15555550100");
    expect(anchor).not.toHaveAttribute("target");
  });
});
