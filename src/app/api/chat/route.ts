import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  type ChatMessage,
  MAX_BODY_BYTES,
  MAX_HISTORY,
  MAX_INPUT_CHARS,
  MAX_TOKENS,
  MODEL_ID,
  RATELIMIT_REMAINING_HEADER,
} from "@/lib/chat/config";
import { getClientIp, getRateLimiter } from "@/lib/chat/rate-limit";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";
import { parseResumeFile } from "@/lib/parse-resume";

// Generic, non-leaking message reused for any unavailable state (missing env,
// limiter init failure, or a pre-first-token upstream error). NEVER include raw
// error strings, stacks, or upstream request ids in client-facing output.
const UNAVAILABLE_MESSAGE =
  "Chat is temporarily unavailable — reach me via the links below.";

const RequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(MAX_INPUT_CHARS),
      }),
    )
    .min(1),
});

function textResponse(body: string, status: number): Response {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

// Defense-in-depth origin check. An absent Origin header PASSES (scripted
// clients omit it; the per-IP limit is the real control). Only a present,
// cross-origin value is rejected. localhost is allowed for dev.
function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const requestHost = request.headers.get("host");
  if (originHost === requestHost) {
    return true;
  }
  const hostname = (() => {
    try {
      return new URL(origin).hostname;
    } catch {
      return "";
    }
  })();
  return hostname === "localhost" || hostname === "127.0.0.1";
}

// Keep the last MAX_HISTORY turns, then drop leading assistant turn(s) so the
// array begins with a `user` turn (the Anthropic API rejects a leading
// assistant message). Returns null if no user turn remains.
function normalizeMessages(messages: ChatMessage[]): ChatMessage[] | null {
  const recent = messages.slice(-MAX_HISTORY);
  const firstUser = recent.findIndex((m) => m.role === "user");
  if (firstUser === -1) {
    return null;
  }
  return recent.slice(firstUser);
}

export async function POST(request: Request): Promise<Response> {
  // (0) Env gate — first statement. Read at request time (never module scope)
  // so a no-secret `next build` does not throw and per-test env stubbing works.
  if (
    !process.env.ANTHROPIC_API_KEY ||
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return textResponse(UNAVAILABLE_MESSAGE, 503);
  }

  // (1) Origin allowlist (defense-in-depth).
  if (!isAllowedOrigin(request)) {
    return textResponse("Forbidden", 403);
  }

  // (2) Validate input. Byte-check the RAW body before parsing so we measure
  // the actual request size and so a malformed body yields 400, not 500.
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return textResponse("Request too large.", 400);
  }
  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(raw);
  } catch {
    return textResponse("Invalid request body.", 400);
  }
  const result = RequestSchema.safeParse(parsedBody);
  if (!result.success) {
    return textResponse("Invalid request body.", 400);
  }
  const messages = normalizeMessages(result.data.messages);
  if (!messages) {
    return textResponse("Invalid request body.", 400);
  }

  // (3) Rate limit. Limiter construction failure (e.g. Upstash unreachable) →
  // 503, same generic bucket as the env gate.
  let limit: number;
  let remaining: number;
  let reset: number;
  let success: boolean;
  try {
    const ip = getClientIp(request);
    ({ success, limit, remaining, reset } = await getRateLimiter().limit(ip));
  } catch {
    return textResponse(UNAVAILABLE_MESSAGE, 503);
  }
  if (!success) {
    const retryAfter = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
    return new Response(
      `You've reached today's limit (${limit}). Please try again later.`,
      {
        status: 429,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-RateLimit-Limit": String(limit),
          [RATELIMIT_REMAINING_HEADER]: String(remaining),
          "X-RateLimit-Reset": String(reset),
          "Retry-After": String(retryAfter),
        },
      },
    );
  }

  // (4) Build the authoritative system prompt from the resume (server-only).
  // A read/parse failure here must not leak a stack (§9) — map to a generic 503.
  let system: string;
  try {
    system = buildSystemPrompt(parseResumeFile());
  } catch (error) {
    console.error("[chat] failed to build system prompt", error);
    return textResponse(UNAVAILABLE_MESSAGE, 503);
  }

  // (5) Stream from Anthropic. Construct the client at request time (after the
  // env gate) — never at module scope. maxRetries:1 since the user waits live.
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    maxRetries: 1,
  });
  const stream = client.messages.stream({
    model: MODEL_ID,
    max_tokens: MAX_TOKENS,
    system,
    messages,
  });

  // Pull the first event BEFORE returning a 200. `messages.stream()` surfaces
  // an upstream APIError only on the first iteration; doing it here lets a
  // pre-first-token failure produce a clean non-200 generic response instead of
  // being forced into a mid-stream `controller.error`.
  const iterator = stream[Symbol.asyncIterator]();
  let firstResult: IteratorResult<Anthropic.MessageStreamEvent>;
  try {
    firstResult = await iterator.next();
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error("[chat] pre-stream Anthropic error", {
        status: error.status,
        request_id: error.requestID,
      });
    } else {
      console.error("[chat] pre-stream error", error);
    }
    return textResponse(UNAVAILABLE_MESSAGE, 503);
  }

  // (6) Pipe text deltas into a custom ReadableStream of PLAIN ANSWER TEXT.
  // Never `stream.toReadableStream()` (that emits serialized event JSON).
  const encoder = new TextEncoder();
  const emit = (
    controller: ReadableStreamDefaultController<Uint8Array>,
    event: Anthropic.MessageStreamEvent,
  ): void => {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      controller.enqueue(encoder.encode(event.delta.text));
    }
  };

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (!firstResult.done) {
          emit(controller, firstResult.value);
        }
        // Continue draining the SAME iterator from where we peeked.
        let next = await iterator.next();
        while (!next.done) {
          emit(controller, next.value);
          next = await iterator.next();
        }
        controller.close();
      } catch (error) {
        // Mid-stream failure (after 200). Surface as a rejected reader; the
        // client keeps any partial text already streamed.
        console.error("[chat] mid-stream error", {
          request_id: stream.request_id,
        });
        controller.error(error);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      [RATELIMIT_REMAINING_HEADER]: String(remaining),
    },
  });
}
