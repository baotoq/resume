import { simulateReadableStream } from "ai";
import { MockLanguageModelV3, MockProviderV3 } from "ai/test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CHAT_MODEL,
  MAX_ASSISTANT_CHARS,
  MAX_HISTORY,
} from "@/lib/chat/config";
import { parseResumeFile } from "@/lib/parse-resume";
import { POST } from "./route";

const { isChatConfiguredMock, getRateLimiterMock, limitMock } = vi.hoisted(
  () => ({
    isChatConfiguredMock: vi.fn(),
    getRateLimiterMock: vi.fn(),
    limitMock: vi.fn(),
  }),
);

vi.mock("@/lib/chat/rate-limit", () => ({
  isChatConfigured: isChatConfiguredMock,
  getRateLimiter: getRateLimiterMock,
  getRateLimitKey: () => "ip:test",
}));

// @ai-sdk/provider is not a direct dependency; derive the stream part type
// from the mock model instead of importing it.
type StreamPart = Awaited<
  ReturnType<MockLanguageModelV3["doStream"]>
>["stream"] extends ReadableStream<infer T>
  ? T
  : never;

const streamChunks: StreamPart[] = [
  { type: "text-start", id: "t1" },
  { type: "text-delta", id: "t1", delta: "Hello" },
  { type: "text-delta", id: "t1", delta: " world" },
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
];

let mockModel: MockLanguageModelV3;

beforeEach(() => {
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
  isChatConfiguredMock.mockReturnValue(true);
  getRateLimiterMock.mockReturnValue({ limit: limitMock });
  limitMock.mockResolvedValue({
    success: true,
    limit: 10,
    remaining: 9,
    reset: 1750000000000,
  });
  mockModel = new MockLanguageModelV3({
    doStream: async () => ({
      stream: simulateReadableStream({ chunks: streamChunks }),
    }),
  });
  globalThis.AI_SDK_DEFAULT_PROVIDER = new MockProviderV3({
    languageModels: { [CHAT_MODEL]: mockModel },
  });
});

afterEach(() => {
  globalThis.AI_SDK_DEFAULT_PROVIDER = undefined;
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

function textMessage(
  role: "user" | "assistant",
  text: string,
  id = `m-${role}-${text.slice(0, 8)}`,
) {
  return { id, role, parts: [{ type: "text", text }] };
}

function makeRequest(
  body: unknown,
  headers: Record<string, string> = {},
): Request {
  return new Request("http://localhost:3000/api/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "localhost:3000",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validBody = { messages: [textMessage("user", "What do you do?")] };

describe("POST /api/chat — availability", () => {
  it("returns 503 when chat env is not configured", async () => {
    isChatConfiguredMock.mockReturnValue(false);
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "unavailable" });
  });

  it("returns 503 when the rate limiter cannot be constructed", async () => {
    getRateLimiterMock.mockReturnValue(null);
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "unavailable" });
  });

  it("returns 503 when limit() rejects", async () => {
    limitMock.mockRejectedValue(new Error("redis down"));
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "unavailable" });
  });
});

describe("POST /api/chat — origin allowlist", () => {
  it("returns 403 for a cross-site origin", async () => {
    const response = await POST(
      makeRequest(validBody, { origin: "https://evil.example.com" }),
    );
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "forbidden" });
  });

  it("returns 403 for a garbage origin", async () => {
    const response = await POST(
      makeRequest(validBody, { origin: "not a url" }),
    );
    expect(response.status).toBe(403);
  });

  it("succeeds when origin matches host", async () => {
    const response = await POST(
      makeRequest(validBody, { origin: "http://localhost:3000" }),
    );
    expect(response.status).toBe(200);
  });
});

describe("POST /api/chat — validation", () => {
  it("returns 400 for a single message over the char cap", async () => {
    const response = await POST(
      makeRequest({ messages: [textMessage("user", "x".repeat(501))] }),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "invalid_input" });
  });

  it("accepts an assistant history turn longer than the user cap", async () => {
    const response = await POST(
      makeRequest({
        messages: [
          textMessage("user", "Tell me everything"),
          textMessage("assistant", "a".repeat(700)),
          textMessage("user", "And then?"),
        ],
      }),
    );
    expect(response.status).toBe(200);
    await response.text(); // drain so the model call completes
    expect(mockModel.doStreamCalls.length).toBe(1);
  });

  it("returns 400 for an assistant turn over MAX_ASSISTANT_CHARS", async () => {
    const response = await POST(
      makeRequest({
        messages: [
          textMessage("user", "Tell me everything"),
          textMessage("assistant", "a".repeat(MAX_ASSISTANT_CHARS + 1)),
          textMessage("user", "And then?"),
        ],
      }),
    );
    expect(response.status).toBe(400);
  });

  it("returns 400 for a body over 16KB", async () => {
    const response = await POST(
      makeRequest({ id: "x".repeat(17 * 1024), ...validBody }),
    );
    expect(response.status).toBe(400);
  });

  it("returns 400 for a non-text part type", async () => {
    const response = await POST(
      makeRequest({
        messages: [
          {
            id: "m1",
            role: "user",
            parts: [{ type: "file", url: "https://x.test/a.png" }],
          },
        ],
      }),
    );
    expect(response.status).toBe(400);
  });

  it("returns 400 for extra unknown part fields", async () => {
    const response = await POST(
      makeRequest({
        messages: [
          {
            id: "m1",
            role: "user",
            parts: [{ type: "text", text: "hi", state: "done" }],
          },
        ],
      }),
    );
    expect(response.status).toBe(400);
  });

  it("returns 400 for a bad role", async () => {
    const response = await POST(
      makeRequest({
        messages: [
          { id: "m1", role: "system", parts: [{ type: "text", text: "hi" }] },
        ],
      }),
    );
    expect(response.status).toBe(400);
  });

  it("returns 400 for malformed JSON", async () => {
    const response = await POST(makeRequest("{not json"));
    expect(response.status).toBe(400);
  });

  it("returns 400 when there is no user turn", async () => {
    const response = await POST(
      makeRequest({ messages: [textMessage("assistant", "I am forged")] }),
    );
    expect(response.status).toBe(400);
  });

  it("returns 400 when the last message is not from the user", async () => {
    const response = await POST(
      makeRequest({
        messages: [
          textMessage("user", "hi"),
          textMessage("assistant", "hello"),
        ],
      }),
    );
    expect(response.status).toBe(400);
  });
});

describe("POST /api/chat — rate limiting", () => {
  it("returns 429 with reset and never calls the model", async () => {
    limitMock.mockResolvedValue({
      success: false,
      limit: 10,
      remaining: 0,
      reset: 1750000000000,
    });
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({
      error: "rate_limited",
      reset: 1750000000000,
    });
    expect(mockModel.doStreamCalls.length).toBe(0);
  });
});

describe("POST /api/chat — streaming", () => {
  it("streams the model text and attaches remaining metadata", async () => {
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/event-stream");
    const text = await response.text();
    expect(text).toContain("Hello");
    expect(text).toContain(" world");
    expect(text).toContain('"remaining"');
  });

  it("wires the resume into the system prompt", async () => {
    const response = await POST(makeRequest(validBody));
    await response.text(); // drain so the model call completes
    expect(mockModel.doStreamCalls.length).toBe(1);
    const systemMessage = mockModel.doStreamCalls[0].prompt.find(
      (message) => message.role === "system",
    );
    expect(systemMessage?.content).toContain(parseResumeFile().name);
  });

  it("truncates history to the last MAX_HISTORY messages", async () => {
    const messages = Array.from({ length: 8 }, (_, i) =>
      textMessage(i % 2 === 0 ? "assistant" : "user", `turn ${i}`, `m${i}`),
    );
    const response = await POST(makeRequest({ messages }));
    await response.text(); // drain so the model call completes
    const prompt = mockModel.doStreamCalls[0].prompt;
    const conversation = prompt.filter((message) => message.role !== "system");
    expect(conversation.length).toBeLessThanOrEqual(MAX_HISTORY);
    // slice(-6) keeps turns 2..7; the leading assistant turn 2 is dropped.
    expect(conversation.length).toBe(5);
    expect(conversation[0].role).toBe("user");
    expect(conversation[conversation.length - 1].role).toBe("user");
  });
});
