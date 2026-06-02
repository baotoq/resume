import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { parseResumeFile } from "@/lib/parse-resume";
import { CertificationsSection } from "./CertificationsSection";

const { certifications = [] } = parseResumeFile();

describe("CertificationsSection (data contract)", () => {
  it("renders nothing when there are no certifications", () => {
    const { container } = render(<CertificationsSection certifications={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders each certification's name and issuer", () => {
    render(<CertificationsSection certifications={certifications} />);
    for (const cert of certifications) {
      expect(screen.getByText(cert.name)).toBeInTheDocument();
      expect(screen.getAllByText(cert.issuer).length).toBeGreaterThan(0);
    }
  });

  it("links certifications that have a url securely in a new tab", () => {
    render(<CertificationsSection certifications={certifications} />);
    for (const cert of certifications) {
      if (!cert.url) continue;
      const link = screen.getByRole("link", {
        name: `${cert.name} (opens in new tab)`,
      });
      expect(link).toHaveAttribute("href", cert.url);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
