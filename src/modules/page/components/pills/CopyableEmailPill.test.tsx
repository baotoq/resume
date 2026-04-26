import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CopyableEmailPill } from "./CopyableEmailPill";

describe("CopyableEmailPill", () => {
  it("renders a button with the email and the copy aria-label", () => {
    render(
      <TooltipProvider>
        <CopyableEmailPill email="user@example.com" />
      </TooltipProvider>,
    );
    const btn = screen.getByRole("button", {
      name: /copy email to clipboard/i,
    });
    expect(btn).toHaveTextContent(/user@example\.com/);
  });

  it("flips aria-label to 'Email copied' after click", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <CopyableEmailPill email="user@example.com" />
      </TooltipProvider>,
    );
    await user.click(
      screen.getByRole("button", { name: /copy email to clipboard/i }),
    );
    expect(
      await screen.findByRole("button", { name: /email copied/i }),
    ).toBeInTheDocument();
  });
});
