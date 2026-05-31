import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RATELIMIT_REMAINING_HEADER } from "@/lib/chat/config";
import { useChat } from "./useChat";

/**
 * Build a Response-like object whose `body.getReader()` yields the given chunks
 * (each TextEncoder-encoded) before reporting `done`. `readError`, when set,
 * makes the read() at that 0-based index reject — to exercise the mid-stream
 * error branch while keeping partial text.
 */
function streamResponse(
  chunks: string[],
  {
    headers = {},
    status = 200,
    readErrorAt,
  }: {
    headers?: Record<string, string>;
    status?: number;
    readErrorAt?: number;
  } = {},
) {
  const encoder = new TextEncoder();
  let i = 0;
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name: string) => headers[name] ?? null },
    body: {
      getReader() {
        return {
          read() {
            if (readErrorAt !== undefined && i === readErrorAt) {
              return Promise.reject(new Error("stream broke"));
            }
            if (i < chunks.length) {
              const value = encoder.encode(chunks[i]);
              i += 1;
              return Promise.resolve({ value, done: false });
            }
            return Promise.resolve({ value: undefined, done: true });
          },
        };
      },
    },
  };
}

function errorResponse(status: number, headers: Record<string, string> = {}) {
  return {
    ok: false,
    status,
    headers: { get: (name: string) => headers[name] ?? null },
    body: null,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useChat", () => {
  it("appends the user message and streams the assistant reply", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      streamResponse(["Yes, ", "I have."], {
        headers: { [RATELIMIT_REMAINING_HEADER]: "9" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send("Have you used K8s?");
    });

    expect(result.current.messages[0]).toMatchObject({
      role: "user",
      content: "Have you used K8s?",
    });
    expect(result.current.messages[1]).toMatchObject({
      role: "assistant",
      content: "Yes, I have.",
    });
    expect(result.current.remaining).toBe(9);
    expect(result.current.error).toBeNull();
  });

  it("sends only the last MAX_HISTORY messages", async () => {
    const fetchMock = vi.fn().mockResolvedValue(streamResponse(["ok"]));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useChat());

    const sendTurn = (text: string) =>
      act(async () => {
        await result.current.send(text);
      });

    // 4 prior exchanges → after the 5th user turn the payload caps at 6 entries.
    await sendTurn("q0");
    await sendTurn("q1");
    await sendTurn("q2");
    await sendTurn("q3");
    await sendTurn("latest");

    const lastCall = fetchMock.mock.calls.at(-1) as [string, RequestInit];
    const body = JSON.parse(lastCall[1].body as string);
    expect(body.messages).toHaveLength(6);
    expect(body.messages.at(-1)).toEqual({ role: "user", content: "latest" });
  });

  it("keeps partial text when the stream errors mid-way", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        streamResponse(["Partial answer"], { readErrorAt: 1 }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send("question");
    });

    expect(result.current.messages[1].content).toBe("Partial answer");
    expect(result.current.error).toMatch(/interrupted/i);
  });

  it("drops the empty placeholder when the stream errors before any byte", async () => {
    const fetchMock = vi
      .fn()
      // First send: reader rejects on the FIRST read with nothing accumulated.
      .mockResolvedValueOnce(streamResponse([], { readErrorAt: 0 }))
      // Second send: recovers normally.
      .mockResolvedValueOnce(streamResponse(["recovered"]));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send("first");
    });

    expect(result.current.error).toMatch(/interrupted/i);
    // The zero-byte assistant placeholder must be gone, not left in the thread.
    expect(
      result.current.messages.some(
        (m) => m.role === "assistant" && m.content === "",
      ),
    ).toBe(false);

    await act(async () => {
      await result.current.send("second");
    });

    // The next request's payload carries no empty-content message.
    const secondCall = fetchMock.mock.calls[1] as [string, RequestInit];
    const body = JSON.parse(secondCall[1].body as string);
    expect(
      body.messages.every((m: { content: string }) => m.content.length > 0),
    ).toBe(true);
  });

  it("maps a 400 to an inline validation hint", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(errorResponse(400)));
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send("bad");
    });

    expect(result.current.error).toMatch(/shorten/i);
    expect(result.current.error).not.toMatch(/error|exception/i);
  });

  it("maps a 429 to the daily-limit message and disables further sends", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        errorResponse(429, {
          [RATELIMIT_REMAINING_HEADER]: "0",
          "Retry-After": "7200",
        }),
      ),
    );
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send("question");
    });

    expect(result.current.error).toMatch(/reached today's limit \(10\)/i);
    expect(result.current.error).toMatch(/resets/i);
    expect(result.current.error).toMatch(/\d/); // relative duration present
    expect(result.current.remaining).toBe(0);
  });

  it("maps a 503 to the unavailable message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(errorResponse(503)));
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send("question");
    });

    expect(result.current.error).toBe("Chat is temporarily unavailable.");
  });

  it("does not poison the next request with an empty turn after an error", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(errorResponse(503))
      .mockResolvedValueOnce(streamResponse(["recovered"]));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send("first");
    });
    expect(result.current.error).toBe("Chat is temporarily unavailable.");

    await act(async () => {
      await result.current.send("second");
    });

    const secondCall = fetchMock.mock.calls[1] as [string, RequestInit];
    const body = JSON.parse(secondCall[1].body as string);
    expect(
      body.messages.every((m: { content: string }) => m.content.length > 0),
    ).toBe(true);
  });

  it("ignores empty input", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send("   ");
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.messages).toHaveLength(0);
  });

  it("leaves remaining null until the first response reports it", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(streamResponse(["hi"])));
    const { result } = renderHook(() => useChat());

    expect(result.current.remaining).toBeNull();

    await act(async () => {
      await result.current.send("question");
    });

    // No remaining header on this response → stays null (not coerced to 0).
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.remaining).toBeNull();
  });
});
