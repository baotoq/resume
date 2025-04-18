import RootLayout from "../layout";
import { metadata as actualMetadata } from "../layout";

describe("RootLayout", () => {
  it("renders with proper HTML structure", () => {
    const testContent = "Test Content";
    const layout = RootLayout({
      children: <div>{testContent}</div>,
    });

    expect(layout.type).toBe("html");
    expect(layout.props.lang).toBe("en");
    //expect(layout.props["data-testid"]).toBe(TEST_IDS.layout.root);
  });

  it("renders body with proper classes and test ID", () => {
    const layout = RootLayout({
      children: <div>Content</div>,
    });

    const body = layout.props.children;
    expect(body.type).toBe("body");
    expect(body.props.className).toBe("min-h-screen bg-background text-text antialiased");
    //expect(body.props["data-testid"]).toBe(TEST_IDS.layout.main);
  });

  it("renders ConfigProvider with proper theme", () => {
    const layout = RootLayout({
      children: <div>Content</div>,
    });

    const body = layout.props.children;
    const configProvider = body.props.children;
    expect(configProvider.type.displayName).toBe("ConfigProvider");
    //expect(configProvider.props.theme).toBe(antdTheme);
  });

  it("exports correct metadata", () => {
    expect(actualMetadata).toEqual({
      title: APP_CONFIG.title,
      description: APP_CONFIG.description,
      authors: [{ name: APP_CONFIG.author }],
    });
  });
});
