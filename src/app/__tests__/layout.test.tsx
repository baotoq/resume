import { render, screen } from "@testing-library/react";
import RootLayout, { metadata as actualMetadata } from "../layout";
import { APP_CONFIG } from "../config";

describe("RootLayout", () => {
  it("exports the correct metadata", () => {
    expect(actualMetadata).toEqual({
      title: APP_CONFIG.title,
      description: APP_CONFIG.description,
      authors: [{ name: APP_CONFIG.author }],
    });
  });

  it("renders correctly", () => {
    const testContent = "Test Content";
    render(<RootLayout>{testContent}</RootLayout>);
    expect(screen.getByText(testContent)).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("en");
  });
});
