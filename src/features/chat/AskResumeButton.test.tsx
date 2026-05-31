import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RATELIMIT_REMAINING_HEADER } from "@/lib/chat/config";
import { AskResumeButton } from "./AskResumeButton";

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

describe("AskResumeButton", () => {
  it("renders nothing when disabled", () => {
    const { container } = render(<AskResumeButton enabled={false} />);
    expect(container).toBeEmptyDOMElement();
    expect(
      screen.queryByRole("button", { name: /ask my resume/i }),
    ).not.toBeInTheDocument();
  });

  it("opens and closes the dialog", async () => {
    const user = userEvent.setup();
    render(<AskResumeButton enabled />);

    await user.click(screen.getByRole("button", { name: /ask my resume/i }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("persists the thread across close and reopen", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        streamResponse(["Yes, in production."], {
          headers: { [RATELIMIT_REMAINING_HEADER]: "9" },
        }),
      ),
    );
    const user = userEvent.setup();
    render(<AskResumeButton enabled />);

    await user.click(screen.getByRole("button", { name: /ask my resume/i }));
    const textarea = await screen.findByLabelText(/your question/i);
    await user.type(textarea, "K8s?");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    expect(await screen.findByText("Yes, in production.")).toBeInTheDocument();

    // Close, then reopen — the prior turns must still be there.
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    await user.click(screen.getByRole("button", { name: /ask my resume/i }));

    expect(await screen.findByText("K8s?")).toBeInTheDocument();
    expect(screen.getByText("Yes, in production.")).toBeInTheDocument();
  });

  it("sends a suggested question on click", async () => {
    const fetchMock = vi.fn().mockResolvedValue(streamResponse(["An answer."]));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<AskResumeButton enabled />);

    await user.click(screen.getByRole("button", { name: /ask my resume/i }));
    const chip = await screen.findByRole("button", { name: /Upmesh/i });
    await user.click(chip);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("An answer.")).toBeInTheDocument();
  });

  it("renders accumulated streamed chunks", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(streamResponse(["Hello", " there", "!"])),
    );
    const user = userEvent.setup();
    render(<AskResumeButton enabled />);

    await user.click(screen.getByRole("button", { name: /ask my resume/i }));
    const textarea = await screen.findByLabelText(/your question/i);
    await user.type(textarea, "hi");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    expect(await screen.findByText("Hello there!")).toBeInTheDocument();
  });

  it("hides the remaining counter until the first response, then shows it", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        streamResponse(["Done."], {
          headers: { [RATELIMIT_REMAINING_HEADER]: "8" },
        }),
      ),
    );
    const user = userEvent.setup();
    render(<AskResumeButton enabled />);

    await user.click(screen.getByRole("button", { name: /ask my resume/i }));
    expect(screen.queryByText(/left today/i)).not.toBeInTheDocument();

    const textarea = await screen.findByLabelText(/your question/i);
    await user.type(textarea, "hi");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    expect(
      await screen.findByText(/8 questions left today/i),
    ).toBeInTheDocument();
  });

  it("disables the input when no questions remain", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        streamResponse(["Last one."], {
          headers: { [RATELIMIT_REMAINING_HEADER]: "0" },
        }),
      ),
    );
    const user = userEvent.setup();
    render(<AskResumeButton enabled />);

    await user.click(screen.getByRole("button", { name: /ask my resume/i }));
    const textarea = await screen.findByLabelText(/your question/i);
    await user.type(textarea, "hi");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    await screen.findByText("Last one.");
    await waitFor(() =>
      expect(screen.getByLabelText(/your question/i)).toBeDisabled(),
    );
    expect(screen.getByRole("button", { name: /^send$/i })).toBeDisabled();
  });

  it("shows the limit message inline on a 429", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        errorResponse(429, {
          [RATELIMIT_REMAINING_HEADER]: "0",
          "Retry-After": "3600",
        }),
      ),
    );
    const user = userEvent.setup();
    render(<AskResumeButton enabled />);

    await user.click(screen.getByRole("button", { name: /ask my resume/i }));
    const textarea = await screen.findByLabelText(/your question/i);
    await user.type(textarea, "hi");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    expect(
      await screen.findByText(/reached today's limit \(10\)/i),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByLabelText(/your question/i)).toBeDisabled(),
    );
  });

  it("shows the unavailable message on a 503", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(errorResponse(503)));
    const user = userEvent.setup();
    render(<AskResumeButton enabled />);

    await user.click(screen.getByRole("button", { name: /ask my resume/i }));
    const textarea = await screen.findByLabelText(/your question/i);
    await user.type(textarea, "hi");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    expect(
      await screen.findByText("Chat is temporarily unavailable."),
    ).toBeInTheDocument();
  });

  it("keeps partial text when the stream is interrupted", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          streamResponse(["Partial reply"], { readErrorAt: 1 }),
        ),
    );
    const user = userEvent.setup();
    render(<AskResumeButton enabled />);

    await user.click(screen.getByRole("button", { name: /ask my resume/i }));
    const textarea = await screen.findByLabelText(/your question/i);
    await user.type(textarea, "hi");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    expect(await screen.findByText("Partial reply")).toBeInTheDocument();
    expect(await screen.findByText(/interrupted/i)).toBeInTheDocument();
  });

  it("does not send on an IME composition Enter, but sends on a plain Enter", async () => {
    const fetchMock = vi.fn().mockResolvedValue(streamResponse(["Answered."]));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<AskResumeButton enabled />);

    await user.click(screen.getByRole("button", { name: /ask my resume/i }));
    const textarea = await screen.findByLabelText(/your question/i);
    await user.type(textarea, "こんにちは");

    // An IME candidate-confirmation Enter must NOT send.
    fireEvent.keyDown(textarea, { key: "Enter", isComposing: true });
    expect(fetchMock).not.toHaveBeenCalled();

    // A plain Enter sends.
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("Answered.")).toBeInTheDocument();
  });

  it("shows the typing indicator, not a blank bubble, before the first token", async () => {
    // A reader whose first read() never resolves keeps us in the awaiting
    // state so we can inspect what renders before any token arrives.
    let resolveRead:
      | ((r: { value?: Uint8Array; done: boolean }) => void)
      | null = null;
    const pendingResponse = {
      ok: true,
      status: 200,
      headers: { get: () => null },
      body: {
        getReader: () => ({
          read: () =>
            new Promise<{ value?: Uint8Array; done: boolean }>((resolve) => {
              resolveRead = resolve;
            }),
        }),
      },
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(pendingResponse));
    const user = userEvent.setup();
    render(<AskResumeButton enabled />);

    await user.click(screen.getByRole("button", { name: /ask my resume/i }));
    const textarea = await screen.findByLabelText(/your question/i);
    await user.type(textarea, "hi");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    // The typing indicator is shown; there is exactly ONE rendered bubble
    // (the user's) — no empty assistant placeholder box.
    expect(await screen.findByLabelText("Bao is typing")).toBeInTheDocument();
    expect(screen.getByText("hi")).toBeInTheDocument();

    // Let the stream finish so the act() warning doesn't leak across tests.
    resolveRead?.({ value: undefined, done: true });
  });
});
