import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCopyToClipboard } from "./useCopyToClipboard";

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("copies text and resets after timeout", async () => {
    const { result } = renderHook(() => useCopyToClipboard(1000));

    expect(result.current.copied).toBe(false);

    await act(async () => {
      await result.current.copy("test text");
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test text");
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.copied).toBe(false);
  });

  it("handles rapid copy calls correctly (timeout race condition)", async () => {
    const { result } = renderHook(() => useCopyToClipboard(1000));

    // First call
    await act(async () => {
      await result.current.copy("text 1");
    });

    expect(result.current.copied).toBe(true);

    // Advance timer slightly
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Second call before first timeout completes
    await act(async () => {
      await result.current.copy("text 2");
    });

    // Advance past the first timeout, but before second timeout
    act(() => {
      vi.advanceTimersByTime(600); // 1100ms total
    });

    // Should still be true because second timeout hasn't finished
    expect(result.current.copied).toBe(true);

    // Advance past second timeout
    act(() => {
      vi.advanceTimersByTime(400); // 1500ms total
    });

    expect(result.current.copied).toBe(false);
  });

  it("fails silently if clipboard is unavailable", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi
          .fn()
          .mockImplementation(() => Promise.reject(new Error("denied"))),
      },
    });

    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy("test");
    });

    // It should silently fail, copied state should remain false
    expect(result.current.copied).toBe(false);
  });
});
