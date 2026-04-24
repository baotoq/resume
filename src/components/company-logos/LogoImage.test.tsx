import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LogoImage } from "./LogoImage";

describe("LogoImage", () => {
  it("renders the registered SVG for CoverGo inside an anchor", () => {
    const { container } = render(
      <LogoImage
        company="CoverGo"
        link="https://covergo.com"
        logoUrl="/should-not-appear.png"
      />,
    );
    const anchor = container.querySelector("a");
    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute("href")).toBe("https://covergo.com");
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelector("img")).toBeNull();
  });

  it("renders <img> fallback for an unknown company", () => {
    render(
      <LogoImage
        company="Acme"
        link="https://acme.example"
        logoUrl="https://acme.example/logo.png"
      />,
    );
    const img = screen.getByAltText("Acme") as HTMLImageElement;
    expect(img.tagName).toBe("IMG");
    expect(img.getAttribute("src")).toBe("https://acme.example/logo.png");
  });

  it("treats company key as case-sensitive ('covergo' misses the SVG branch)", () => {
    const { container } = render(
      <LogoImage
        company="covergo"
        link="https://covergo.com"
        logoUrl="https://covergo.com/logo.png"
      />,
    );
    expect(container.querySelector("img")).not.toBeNull();
  });
});
