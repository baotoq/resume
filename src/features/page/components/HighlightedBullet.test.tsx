import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HighlightedBullet } from "./HighlightedBullet";

describe("HighlightedBullet", () => {
  it("wraps **bold** text in a span with font-semibold", () => {
    render(<HighlightedBullet>plain **bold** tail</HighlightedBullet>);
    const bold = screen.getByText("bold");
    expect(bold.tagName).toBe("SPAN");
    expect(bold).toHaveClass("font-semibold");
    expect(screen.getByText(/plain/)).toBeInTheDocument();
    expect(screen.getByText(/tail/)).toBeInTheDocument();
  });

  it("wraps *italic* text in a span with text-blue-700 and font-semibold", () => {
    render(<HighlightedBullet>foo *emph* bar</HighlightedBullet>);
    const italic = screen.getByText("emph");
    expect(italic.tagName).toBe("SPAN");
    expect(italic).toHaveClass("text-blue-700");
    expect(italic).toHaveClass("font-semibold");
  });

  it("handles mixed **bold** and *italic* in one line", () => {
    render(<HighlightedBullet>pre **B** mid *I* end</HighlightedBullet>);
    expect(screen.getByText("B")).toHaveClass("font-semibold");
    expect(screen.getByText("I")).toHaveClass("text-blue-700");
    expect(screen.getByText("I")).toHaveClass("font-semibold");
  });

  it("renders empty string as empty fragment", () => {
    const { container } = render(<HighlightedBullet>{""}</HighlightedBullet>);
    expect(container.textContent).toBe("");
  });

  it("leaves unmatched asterisks as literal text", () => {
    render(<HighlightedBullet>unmatched *star here</HighlightedBullet>);
    expect(screen.getByText(/unmatched \*star here/)).toBeInTheDocument();
  });
});
