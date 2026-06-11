import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { simulateReadableStream, streamText } from "ai";
import { MockLanguageModelV3 } from "ai/test";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AskResumeButton } from "./AskResumeButton";

function makeStreamResponse(text: string): Response {
  const model = new MockLanguageModelV3({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: "text-start", id: "t1" },
          { type: "text-delta", id: "t1", delta: text },
          { type: "text-end", id: "t1" },
          {
            type: "finish",
            finishReason: { unified: "stop", raw: "stop" },
            usage: {
              inputTokens: {
                total: 3,
                noCache: 3,
                cacheRead: undefined,
                cacheWrite: undefined,
              },
              outputTokens: { total: 10, text: 10, reasoning: undefined },
            },
          },
        ],
      }),
    }),
  });
  const result = streamText({ model, prompt: "x" });
  return result.toUIMessageStreamResponse();
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AskResumeButton", () => {
  it("renders the trigger button hidden from print and PDF export", () => {
    render(<AskResumeButton />);
    const trigger = screen.getByRole("button", { name: /ask my resume/i });
    expect(trigger).toHaveAttribute("data-pdf-hidden");
    expect(trigger).toHaveClass("print:hidden");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the dialog on click", async () => {
    const user = userEvent.setup();
    render(<AskResumeButton />);
    await user.click(screen.getByRole("button", { name: /ask my resume/i }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ask my resume" }),
    ).toBeInTheDocument();
  });

  it("keeps the chat thread across close and reopen", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        makeStreamResponse("I built Upmesh's live commerce platform."),
      ),
    );
    const user = userEvent.setup();
    render(<AskResumeButton />);
    await user.click(screen.getByRole("button", { name: /ask my resume/i }));
    await user.click(
      await screen.findByRole("button", {
        name: "What did you build at Upmesh?",
      }),
    );
    await screen.findByText("I built Upmesh's live commerce platform.");

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /ask my resume/i }));
    expect(
      await screen.findByText("I built Upmesh's live commerce platform."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("What did you build at Upmesh?"),
    ).toBeInTheDocument();
  });
});
