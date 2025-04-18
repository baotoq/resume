import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { ConfigProvider } from "antd";
import { ReactElement } from "react";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

export function renderWithProviders(ui: ReactElement) {
  return render(<ConfigProvider>{ui}</ConfigProvider>);
}
