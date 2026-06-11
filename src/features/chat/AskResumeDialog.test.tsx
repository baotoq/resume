import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { simulateReadableStream, streamText } from "ai";
import { MockLanguageModelV3 } from "ai/test";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  INTERRUPTED_MESSAGE,
  MAX_HISTORY,
  MAX_INPUT_CHARS,
} from "@/lib/chat/config";
import { AskResumeDialog } from "./AskResumeDialog";

const SUGGESTIONS = [
  "Have you run Kubernetes and GitOps in production?",
  "Tell me about the high-throughput systems you've built",
  "What's your .NET and Golang background?",
  "What did you build at Upmesh?",
  "Which cloud platforms have you used in production?",
];

const INPUT_LABEL = "Ask a question about my experience";

function makeStreamResponse(text: string, remaining?: number): Response {
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
  return result.toUIMessageStreamResponse({
    messageMetadata: ({ part }) =>
      part.type === "finish" && remaining !== undefined
        ? { remaining }
        : undefined,
  });
}

// A stream that dies mid-answer: deltas (possibly none) then an error part.
function makeInterruptedStreamResponse(deltas: string[]): Response {
  const model = new MockLanguageModelV3({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: "text-start", id: "t1" },
          ...deltas.map((delta) => ({
            type: "text-delta" as const,
            id: "t1",
            delta,
          })),
          { type: "error", error: new Error("boom") },
        ],
      }),
    }),
  });
  const result = streamText({ model, prompt: "x", onError: () => {} });
  return result.toUIMessageStreamResponse({
    onError: () => INTERRUPTED_MESSAGE,
  });
}

function makeMultiDeltaResponse(deltas: string[]): Response {
  const model = new MockLanguageModelV3({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: "text-start", id: "t1" },
          ...deltas.map((delta) => ({
            type: "text-delta" as const,
            id: "t1",
            delta,
          })),
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
  return streamText({ model, prompt: "x" }).toUIMessageStreamResponse();
}

function stubFetch(respond: () => Response) {
  const fetchMock = vi.fn(
    async (_input: RequestInfo | URL, _init?: RequestInit) => respond(),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function renderDialog() {
  render(<AskResumeDialog open onOpenChange={vi.fn()} />);
}

type SentBody = {
  messages: { id: string; role: string; parts: Record<string, unknown>[] }[];
};

function sentBody(
  fetchMock: ReturnType<typeof stubFetch>,
  call: number,
): SentBody {
  return JSON.parse(String(fetchMock.mock.calls[call][1]?.body)) as SentBody;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AskResumeDialog", () => {
  it("shows an intro and 5 suggestion chips in the empty state", () => {
    renderDialog();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    for (const suggestion of SUGGESTIONS) {
      expect(
        screen.getByRole("button", { name: suggestion }),
      ).toBeInTheDocument();
    }
  });

  it("sends the chip text and streams the answer when a chip is clicked", async () => {
    const fetchMock = stubFetch(() => makeStreamResponse("Yes, extensively."));
    const user = userEvent.setup();
    renderDialog();
    await user.click(screen.getByRole("button", { name: SUGGESTIONS[0] }));
    expect(await screen.findByText("Yes, extensively.")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = sentBody(fetchMock, 0);
    expect(body.messages).toHaveLength(1);
    expect(body.messages[0].role).toBe("user");
    expect(body.messages[0].parts).toEqual([
      { type: "text", text: SUGGESTIONS[0] },
    ]);
  });

  it("sends typed input on Enter and clears the input", async () => {
    const fetchMock = stubFetch(() => makeStreamResponse("Sure."));
    const user = userEvent.setup();
    renderDialog();
    const textarea = screen.getByLabelText(INPUT_LABEL);
    await user.type(textarea, "What do you do?{enter}");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(textarea).toHaveValue("");
    expect(screen.getByText("What do you do?")).toBeInTheDocument();
    expect(await screen.findByText("Sure.")).toBeInTheDocument();
  });

  it("does not send empty or whitespace-only input", async () => {
    const fetchMock = stubFetch(() => makeStreamResponse("x"));
    const user = userEvent.setup();
    renderDialog();
    const textarea = screen.getByLabelText(INPUT_LABEL);
    await user.type(textarea, "   {enter}");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("updates the character counter as the user types", async () => {
    const user = userEvent.setup();
    renderDialog();
    expect(screen.getByText(`0/${MAX_INPUT_CHARS}`)).toBeInTheDocument();
    await user.type(screen.getByLabelText(INPUT_LABEL), "hello");
    expect(screen.getByText(`5/${MAX_INPUT_CHARS}`)).toBeInTheDocument();
  });

  it("hides the quota line before the first response and shows it after", async () => {
    stubFetch(() => makeStreamResponse("Answer.", 9));
    const user = userEvent.setup();
    renderDialog();
    expect(screen.queryByText(/left today/)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: SUGGESTIONS[3] }));
    expect(
      await screen.findByText("9 questions left today"),
    ).toBeInTheDocument();
  });

  it("uses singular phrasing when 1 question is left", async () => {
    stubFetch(() => makeStreamResponse("Answer.", 1));
    const user = userEvent.setup();
    renderDialog();
    await user.click(screen.getByRole("button", { name: SUGGESTIONS[3] }));
    expect(
      await screen.findByText("1 question left today"),
    ).toBeInTheDocument();
  });

  it("disables input when the quota is exhausted", async () => {
    stubFetch(() => makeStreamResponse("Answer.", 0));
    const user = userEvent.setup();
    renderDialog();
    await user.click(screen.getByRole("button", { name: SUGGESTIONS[3] }));
    await screen.findByText("Answer.");
    expect(
      await screen.findByText(/reached today's limit \(10 questions\)/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(INPUT_LABEL)).toBeDisabled();
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("shows the rate limit message and disables input on 429", async () => {
    stubFetch(
      () =>
        new Response(
          JSON.stringify({
            error: "rate_limited",
            reset: Date.now() + 60 * 60 * 1000,
          }),
          { status: 429 },
        ),
    );
    const user = userEvent.setup();
    renderDialog();
    const textarea = screen.getByLabelText(INPUT_LABEL);
    await user.type(textarea, "hi{enter}");
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/reached today's limit \(10 questions\)/);
    expect(alert).toHaveTextContent(/Resets in 1 hour/);
    expect(textarea).toBeDisabled();
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("shows the generic unavailable message on a server error", async () => {
    stubFetch(() => new Response("internal error", { status: 500 }));
    const user = userEvent.setup();
    renderDialog();
    const textarea = screen.getByLabelText(INPUT_LABEL);
    await user.type(textarea, "hi{enter}");
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "Chat is temporarily unavailable - you can reach me via the links on this page.",
    );
    expect(textarea).not.toBeDisabled();
  });

  it("shows an inline hint on invalid input and keeps the input editable", async () => {
    stubFetch(
      () =>
        new Response(JSON.stringify({ error: "invalid_input" }), {
          status: 400,
        }),
    );
    const user = userEvent.setup();
    renderDialog();
    const textarea = screen.getByLabelText(INPUT_LABEL);
    await user.type(textarea, "hi{enter}");
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/can't be sent/);
    expect(textarea).not.toBeDisabled();
  });

  it("posts sanitized text-only parts and capped history on follow-ups", async () => {
    const fetchMock = stubFetch(() => makeStreamResponse("First answer.", 9));
    const user = userEvent.setup();
    renderDialog();
    const textarea = screen.getByLabelText(INPUT_LABEL);
    await user.type(textarea, "First question{enter}");
    await screen.findByText("First answer.");
    await screen.findByText("9 questions left today");
    await user.type(textarea, "Second question{enter}");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const body = sentBody(fetchMock, 1);
    expect(body.messages.length).toBeLessThanOrEqual(MAX_HISTORY);
    expect(body.messages.map((m) => m.role)).toEqual([
      "user",
      "assistant",
      "user",
    ]);
    for (const message of body.messages) {
      for (const part of message.parts) {
        expect(Object.keys(part).sort()).toEqual(["text", "type"]);
        expect(part.type).toBe("text");
        expect(typeof part.text).toBe("string");
      }
    }
    expect(body.messages[1].parts).toEqual([
      { type: "text", text: "First answer." },
    ]);
  });

  it("renders the concatenation of multiple streamed deltas", async () => {
    stubFetch(() =>
      makeMultiDeltaResponse(["I built ", "10k+/sec ", "systems."]),
    );
    const user = userEvent.setup();
    renderDialog();
    await user.click(screen.getByRole("button", { name: SUGGESTIONS[1] }));
    expect(
      await screen.findByText("I built 10k+/sec systems."),
    ).toBeInTheDocument();
  });

  it("keeps partial text and shows the interrupted message on a mid-stream error", async () => {
    stubFetch(() => makeInterruptedStreamResponse(["Partial answer"]));
    const user = userEvent.setup();
    renderDialog();
    await user.type(screen.getByLabelText(INPUT_LABEL), "hi{enter}");
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(INTERRUPTED_MESSAGE);
    expect(screen.getByText("Partial answer")).toBeInTheDocument();
  });

  it("filters empty assistant turns out of the next request after an immediate stream error", async () => {
    let call = 0;
    const fetchMock = stubFetch(() =>
      call++ === 0
        ? makeInterruptedStreamResponse([]) // dies right after text-start: assistant text is ""
        : makeStreamResponse("Recovered.", 8),
    );
    const user = userEvent.setup();
    renderDialog();
    const textarea = screen.getByLabelText(INPUT_LABEL);
    await user.type(textarea, "first{enter}");
    await screen.findByRole("alert");
    await user.type(textarea, "second{enter}");
    expect(await screen.findByText("Recovered.")).toBeInTheDocument();
    const body = sentBody(fetchMock, 1);
    for (const message of body.messages) {
      expect(message.parts.length).toBeGreaterThan(0);
      for (const part of message.parts) {
        expect(part.text).not.toBe("");
      }
    }
    expect(body.messages.map((m) => m.role)).not.toContain("assistant");
  });

  it("recovers after an error: a retry sends and clears the alert", async () => {
    let call = 0;
    stubFetch(() =>
      call++ === 0
        ? new Response("internal error", { status: 500 })
        : makeStreamResponse("Recovered."),
    );
    const user = userEvent.setup();
    renderDialog();
    const textarea = screen.getByLabelText(INPUT_LABEL);
    await user.type(textarea, "hi{enter}");
    await screen.findByRole("alert");
    await user.type(textarea, "again{enter}");
    expect(await screen.findByText("Recovered.")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("enforces the 500-char limit via the textarea maxLength", async () => {
    const user = userEvent.setup();
    renderDialog();
    const textarea = screen.getByLabelText(INPUT_LABEL);
    expect(textarea).toHaveAttribute("maxlength", String(MAX_INPUT_CHARS));
    await user.click(textarea);
    await user.paste("x".repeat(MAX_INPUT_CHARS - 1));
    await user.type(textarea, "abc");
    expect((textarea as HTMLTextAreaElement).value).toHaveLength(
      MAX_INPUT_CHARS,
    );
    expect(
      screen.getByText(`${MAX_INPUT_CHARS}/${MAX_INPUT_CHARS}`),
    ).toBeInTheDocument();
  });
});
