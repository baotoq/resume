import { convertToModelMessages, streamText } from "ai";
import { z } from "zod";
import {
  CHAT_MODEL,
  INTERRUPTED_MESSAGE,
  MAX_ASSISTANT_CHARS,
  MAX_BODY_BYTES,
  MAX_HISTORY,
  MAX_INPUT_CHARS,
  MAX_OUTPUT_TOKENS,
} from "@/lib/chat/config";
import {
  getRateLimiter,
  getRateLimitKey,
  isChatConfigured,
} from "@/lib/chat/rate-limit";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";
import { parseResumeFile } from "@/lib/parse-resume";

export const maxDuration = 30;

// Assistant history turns replay model output, which may legitimately exceed
// the user input cap — so the two roles get different per-part char limits.
function textParts(maxChars: number) {
  return z
    .array(
      z
        .object({
          type: z.literal("text"),
          text: z.string().min(1).max(maxChars),
        })
        .strict(),
    )
    .min(1);
}

const bodySchema = z.object({
  id: z.string().optional(),
  messages: z
    .array(
      z.discriminatedUnion("role", [
        z
          .object({
            id: z.string(),
            role: z.literal("user"),
            parts: textParts(MAX_INPUT_CHARS),
          })
          .strict(),
        z
          .object({
            id: z.string(),
            role: z.literal("assistant"),
            parts: textParts(MAX_ASSISTANT_CHARS),
          })
          .strict(),
      ]),
    )
    .min(1),
});

export async function POST(request: Request) {
  if (!isChatConfigured()) {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
  const limiter = getRateLimiter();
  if (!limiter) {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.get("host")) {
        return Response.json({ error: "forbidden" }, { status: 403 });
      }
    } catch {
      return Response.json({ error: "forbidden" }, { status: 403 });
    }
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }

  // Keep the last MAX_HISTORY messages, drop leading assistant turns; the
  // result must be non-empty and end with a user turn.
  const recent = parsed.data.messages.slice(-MAX_HISTORY);
  const firstUserIndex = recent.findIndex((m) => m.role === "user");
  if (firstUserIndex === -1) {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }
  const normalized = recent.slice(firstUserIndex);
  if (normalized[normalized.length - 1].role !== "user") {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }

  let limit: Awaited<ReturnType<typeof limiter.limit>>;
  try {
    limit = await limiter.limit(getRateLimitKey(request));
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
  if (!limit.success) {
    return Response.json(
      { error: "rate_limited", reset: limit.reset },
      { status: 429 },
    );
  }
  const { remaining } = limit;

  const result = streamText({
    model: CHAT_MODEL,
    system: buildSystemPrompt(parseResumeFile()),
    messages: await convertToModelMessages(normalized),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    abortSignal: request.signal,
    onError: ({ error }) => console.error("chat stream error", error),
  });

  return result.toUIMessageStreamResponse({
    messageMetadata: ({ part }) =>
      part.type === "finish" ? { remaining } : undefined,
    onError: () => INTERRUPTED_MESSAGE,
  });
}
