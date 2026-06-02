import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_BODY_BYTES, MAX_INPUT_CHARS } from "@/lib/chat/config";

// ---- Mock the Anthropic SDK + rate limiter so no network/secret is needed. ----
// Everything the hoisted `vi.mock` factories close over is itself created in a
// `vi.hoisted` block, so it exists before the mocks run yet stays reachable
// from the test body. `streamEvents` is the queue the mocked `messages.stream`
// replays; `firstError` throws from the iterator's first `.next()` (pre-token);
// `midError` throws after the queue drains (mid-stream).
const mock = vi.hoisted(() => {
  const state: {
    streamEvents: unknown[];
    firstError?: unknown;
    midError?: unknown;
    parseError?: unknown;
  } = { streamEvents: [] };

  class FakeAPIError extends Error {
    status: number;
    requestID: string;
    constructor(status: number) {
      super(`api error ${status}`);
      this.status = status;
      this.requestID = "req_secret_12345";
    }
  }

  const streamSpy = vi.fn(() => {
    const events = state.streamEvents;
    let i = 0;
    const iterator = {
      async next() {
        if (i === 0 && state.firstError) {
          throw state.firstError;
        }
        if (i >= events.length) {
          if (state.midError) {
            // Yield a macrotask before throwing so the reader can drain the
            // already-enqueued chunk first — mirroring a real network stream
            // that errors between chunks, not synchronously back-to-back.
            await new Promise((r) => setTimeout(r, 0));
            throw state.midError;
          }
          return { done: true, value: undefined };
        }
        const value = events[i++];
        return { done: false, value };
      },
    };
    return {
      request_id: "req_stream_67890",
      [Symbol.asyncIterator]() {
        return iterator;
      },
    };
  });

  const limitSpy = vi.fn(async () => ({
    success: true,
    limit: 10,
    remaining: 9,
    reset: Date.now() + 60_000,
  }));
  const getRateLimiterSpy = vi.fn(() => ({ limit: limitSpy }));

  return { state, FakeAPIError, streamSpy, limitSpy, getRateLimiterSpy };
});

const {
  state: mockState,
  FakeAPIError,
  streamSpy,
  limitSpy,
  getRateLimiterSpy,
} = mock;

vi.mock("@anthropic-ai/sdk", () => {
  class Anthropic {
    messages = { stream: mock.streamSpy };
    static APIError = mock.FakeAPIError;
  }
  return { default: Anthropic };
});

vi.mock("@/lib/chat/rate-limit", () => ({
  getRateLimiter: () => mock.getRateLimiterSpy(),
  getClientIp: () => "203.0.113.7",
}));

// Let one test force a resume read/parse failure (the §9 no-stack-leak case).
vi.mock("@/lib/parse-resume", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/parse-resume")>();
  return {
    ...actual,
    parseResumeFile: (filePath?: string) => {
      if (mock.state.parseError) {
        throw mock.state.parseError;
      }
      return actual.parseResumeFile(filePath);
    },
  };
});

// ---- Import AFTER mocks are registered. ----
import { POST } from "./route";

function textDelta(text: string) {
  return { type: "content_block_delta", delta: { type: "text_delta", text } };
}

// The mocked `messages.stream` has no typed params, so its call args read as an
// empty tuple. Route through `unknown` to inspect the body the route passed.
function streamCallArg(call: number): { system: string; messages: unknown[] } {
  const calls = streamSpy.mock.calls as unknown as unknown[][];
  return calls[call]?.[0] as {
    system: string;
    messages: unknown[];
  };
}

function postRequest(body: unknown, init: RequestInit = {}): Request {
  return new Request("https://example.com/api/chat", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    ...init,
  });
}

beforeEach(() => {
  vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.test");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
  mockState.streamEvents = [];
  mockState.firstError = undefined;
  mockState.midError = undefined;
  mockState.parseError = undefined;
  streamSpy.mockClear();
  limitSpy.mockClear();
  limitSpy.mockResolvedValue({
    success: true,
    limit: 10,
    remaining: 9,
    reset: Date.now() + 60_000,
  });
  getRateLimiterSpy.mockClear();
  getRateLimiterSpy.mockReturnValue({ limit: limitSpy });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

async function readAll(res: Response): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) {
    return "";
  }
  const decoder = new TextDecoder();
  let out = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    out += decoder.decode(value, { stream: true });
  }
  return out;
}

describe("POST /api/chat", () => {
  it("streams plain answer text (not JSON) and sets X-RateLimit-Remaining before the body", async () => {
    // Wrap the text deltas in the non-text events a real stream interleaves so
    // this also proves the route FILTERS to text_delta only (CRITICAL-A) — a
    // route forwarding every event type would fail body equality below.
    mockState.streamEvents = [
      { type: "message_start" },
      { type: "content_block_start", index: 0 },
      textDelta("Yes, "),
      textDelta("at Upmesh."),
      { type: "content_block_stop", index: 0 },
      { type: "message_delta" },
      { type: "message_stop" },
    ];
    const res = await POST(
      postRequest({ messages: [{ role: "user", content: "K8s in prod?" }] }),
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    // Header is readable before the body is drained.
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("9");

    const body = await readAll(res);
    expect(body).toBe("Yes, at Upmesh.");
    // It must be plain text, NOT serialized event JSON.
    expect(body).not.toContain("content_block_delta");
    expect(body).not.toContain("message_start");
    expect(() => JSON.parse(body)).toThrow();

    // System prompt goes in the top-level `system` param; messages hold only turns.
    const arg = streamCallArg(0);
    expect(typeof arg.system).toBe("string");
    expect(arg.messages).toEqual([{ role: "user", content: "K8s in prod?" }]);
  });

  it("returns 503 when any required env var is missing", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    const res = await POST(
      postRequest({ messages: [{ role: "user", content: "hi" }] }),
    );
    expect(res.status).toBe(503);
    expect(streamSpy).not.toHaveBeenCalled();
  });

  it("returns 403 for a present cross-origin Origin header", async () => {
    const res = await POST(
      postRequest(
        { messages: [{ role: "user", content: "hi" }] },
        { headers: { origin: "https://evil.example", host: "example.com" } },
      ),
    );
    expect(res.status).toBe(403);
  });

  it("allows an absent Origin header (scripted clients omit it)", async () => {
    mockState.streamEvents = [textDelta("hi")];
    const res = await POST(
      postRequest({ messages: [{ role: "user", content: "hi" }] }),
    );
    expect(res.status).toBe(200);
  });

  it("returns 400 for a body over MAX_BODY_BYTES", async () => {
    const big = "x".repeat(MAX_BODY_BYTES + 1);
    const res = await POST(postRequest(big));
    expect(res.status).toBe(400);
    expect(streamSpy).not.toHaveBeenCalled();
  });

  it("returns 400 for a message over MAX_INPUT_CHARS", async () => {
    const res = await POST(
      postRequest({
        messages: [{ role: "user", content: "x".repeat(MAX_INPUT_CHARS + 1) }],
      }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for an empty messages array", async () => {
    const res = await POST(postRequest({ messages: [] }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for an invalid role", async () => {
    const res = await POST(
      postRequest({ messages: [{ role: "system", content: "hi" }] }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for unparseable JSON", async () => {
    const res = await POST(postRequest("{not json"));
    expect(res.status).toBe(400);
  });

  it("drops leading assistant turn(s) so the array re-anchors to a user turn", async () => {
    mockState.streamEvents = [textDelta("ok")];
    const res = await POST(
      postRequest({
        messages: [
          { role: "assistant", content: "earlier reply" },
          { role: "user", content: "real question" },
        ],
      }),
    );
    expect(res.status).toBe(200);
    const arg = streamCallArg(0);
    expect(arg.messages).toEqual([{ role: "user", content: "real question" }]);
  });

  it("returns 400 when only assistant turns remain after normalization", async () => {
    const res = await POST(
      postRequest({ messages: [{ role: "assistant", content: "forged" }] }),
    );
    expect(res.status).toBe(400);
    expect(streamSpy).not.toHaveBeenCalled();
  });

  it("returns 429 with rate-limit headers when the limit is exceeded", async () => {
    const reset = Date.now() + 120_000;
    limitSpy.mockResolvedValueOnce({
      success: false,
      limit: 10,
      remaining: 0,
      reset,
    });
    const res = await POST(
      postRequest({ messages: [{ role: "user", content: "hi" }] }),
    );
    expect(res.status).toBe(429);
    expect(res.headers.get("X-RateLimit-Limit")).toBe("10");
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(res.headers.get("X-RateLimit-Reset")).toBe(String(reset));
    // Retry-After is a delta in seconds, not the epoch-ms reset value.
    const retryAfter = Number(res.headers.get("Retry-After"));
    expect(retryAfter).toBeGreaterThan(0);
    expect(retryAfter).toBeLessThanOrEqual(120);
    expect(streamSpy).not.toHaveBeenCalled();
  });

  it("returns 503 when the rate limiter fails to initialize", async () => {
    getRateLimiterSpy.mockImplementationOnce(() => {
      throw new Error("missing upstash env");
    });
    const res = await POST(
      postRequest({ messages: [{ role: "user", content: "hi" }] }),
    );
    expect(res.status).toBe(503);
    expect(streamSpy).not.toHaveBeenCalled();
  });

  it("returns a clean 503 with no leaked error text on a pre-first-token Anthropic error", async () => {
    mockState.firstError = new FakeAPIError(500);
    const res = await POST(
      postRequest({ messages: [{ role: "user", content: "hi" }] }),
    );
    expect(res.status).toBe(503);
    const body = await res.text();
    expect(body).not.toContain("req_secret_12345");
    expect(body).not.toContain("api error 500");
    expect(body).toMatch(/temporarily unavailable/i);
  });

  it("returns a clean 503 with no leaked stack when resume read/parse fails", async () => {
    mockState.parseError = new Error(
      "ENOENT: resume.md not found at /secret/path",
    );
    const res = await POST(
      postRequest({ messages: [{ role: "user", content: "hi" }] }),
    );
    expect(res.status).toBe(503);
    const body = await res.text();
    expect(body).not.toContain("ENOENT");
    expect(body).not.toContain("/secret/path");
    expect(body).toMatch(/temporarily unavailable/i);
    // The failure is after the rate-limit token is spent but before streaming.
    expect(streamSpy).not.toHaveBeenCalled();
  });

  it("returns 200 then errors the stream on a mid-stream failure, keeping partial text", async () => {
    mockState.streamEvents = [textDelta("partial answer")];
    mockState.midError = new Error("connection dropped");
    const res = await POST(
      postRequest({ messages: [{ role: "user", content: "hi" }] }),
    );
    expect(res.status).toBe(200);

    const reader = res.body?.getReader();
    if (!reader) {
      throw new Error("expected a readable body");
    }
    const decoder = new TextDecoder();
    // Drain until the reader rejects (controller.error), accumulating partial
    // text. The interruption must surface AND the partial text must be kept.
    let received = "";
    let rejected = false;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        received += decoder.decode(value, { stream: true });
      }
    } catch (error) {
      rejected = true;
      expect((error as Error).message).toBe("connection dropped");
    }
    expect(rejected).toBe(true);
    expect(received).toBe("partial answer");
  });
});
