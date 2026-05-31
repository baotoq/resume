// Shared contract for the "Ask my resume" chat feature.
//
// This module is the single source of truth for the locked constants and the
// request/response shape exchanged between the client hook (`useChat`) and the
// server route (`/api/chat`). It is imported by BOTH client and server code, so
// it must stay free of any server-only imports (fs, the Anthropic/Upstash SDKs).

/** Anthropic model backing the chat. Cheap, fast, ample for one-page Q&A. */
export const MODEL_ID = "claude-haiku-4-5-20251001";

/** Hard cap on generated tokens per answer. Bounds output cost. */
export const MAX_TOKENS = 512;

/** Max characters allowed in a single message. Enforced on EVERY message. */
export const MAX_INPUT_CHARS = 500;

/** Max array entries kept (user+assistant) — the client sends only the last N. */
export const MAX_HISTORY = 6;

/** Max total request body size in bytes. Anti cost-amplification. */
export const MAX_BODY_BYTES = 8 * 1024;

/** Per-IP request budget within {@link RATE_LIMIT_WINDOW}. */
export const RATE_LIMIT_REQUESTS = 10;

/** Fixed-window duration string consumed by `@upstash/ratelimit`. */
export const RATE_LIMIT_WINDOW = "1 d";

/** Same-origin endpoint the client posts to. */
export const CHAT_API_PATH = "/api/chat";

/** Header carrying the remaining daily budget back to the client. */
export const RATELIMIT_REMAINING_HEADER = "X-RateLimit-Remaining";

/** Roles permitted in the conversation. The Anthropic API has no `system` role. */
export type ChatRole = "user" | "assistant";

/** A single conversation turn. `content` is plain text (no markdown rendering). */
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** The POST body the client sends and the route validates. */
export interface ChatRequestBody {
  messages: ChatMessage[];
}
