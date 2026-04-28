import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ImageLightbox } from "./ImageLightbox";

const IMAGES = ["/img1.png", "/img2.png", "/img3.png"];

describe("ImageLightbox", () => {
  it("returns null when closed", () => {
    const { container } = render(
      <ImageLightbox
        images={IMAGES}
        initialIndex={0}
        isOpen={false}
        onClose={vi.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when images array is empty", () => {
    const { container } = render(
      <ImageLightbox images={[]} initialIndex={0} isOpen onClose={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders dialog with accessible title", () => {
    render(
      <ImageLightbox
        images={IMAGES}
        initialIndex={0}
        isOpen
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Image Lightbox")).toBeInTheDocument();
  });

  it("displays image matching initialIndex", () => {
    render(
      <ImageLightbox
        images={IMAGES}
        initialIndex={1}
        isOpen
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByAltText("Screenshot 2 of 3")).toBeInTheDocument();
  });

  it("shows counter when multiple images", () => {
    render(
      <ImageLightbox
        images={IMAGES}
        initialIndex={0}
        isOpen
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("hides counter for single image", () => {
    render(
      <ImageLightbox
        images={["/solo.png"]}
        initialIndex={0}
        isOpen
        onClose={vi.fn()}
      />,
    );
    expect(screen.queryByText(/\/ 1/)).not.toBeInTheDocument();
  });

  it("clicking next advances image", async () => {
    render(
      <ImageLightbox
        images={IMAGES}
        initialIndex={0}
        isOpen
        onClose={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /next image/i }));
    expect(screen.getByAltText("Screenshot 2 of 3")).toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("clicking prev wraps to last image", async () => {
    render(
      <ImageLightbox
        images={IMAGES}
        initialIndex={0}
        isOpen
        onClose={vi.fn()}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: /previous image/i }),
    );
    expect(screen.getByAltText("Screenshot 3 of 3")).toBeInTheDocument();
  });

  it("clicking image advances to next", async () => {
    render(
      <ImageLightbox
        images={IMAGES}
        initialIndex={0}
        isOpen
        onClose={vi.fn()}
      />,
    );
    const img = screen.getByAltText("Screenshot 1 of 3");
    await userEvent.click(img);
    expect(screen.getByAltText("Screenshot 2 of 3")).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", async () => {
    const onClose = vi.fn();
    render(
      <ImageLightbox
        images={IMAGES}
        initialIndex={0}
        isOpen
        onClose={onClose}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: /close lightbox/i }),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on Escape key", async () => {
    const onClose = vi.fn();
    render(
      <ImageLightbox
        images={IMAGES}
        initialIndex={0}
        isOpen
        onClose={onClose}
      />,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("loops forward from last to first", async () => {
    render(
      <ImageLightbox
        images={IMAGES}
        initialIndex={2}
        isOpen
        onClose={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /next image/i }));
    expect(screen.getByAltText("Screenshot 1 of 3")).toBeInTheDocument();
  });
});
