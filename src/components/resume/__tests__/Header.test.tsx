import { render, screen } from "@testing-library/react";
import { Header } from "../Header";

describe("Header", () => {
  const mockProps = {
    name: "John Developer",
    title: "Senior Software Engineer",
  };

  it("renders name and title", () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText(mockProps.name)).toBeInTheDocument();
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
  });
});
