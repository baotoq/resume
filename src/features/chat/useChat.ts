"use client";

import { useCallback, useState } from "react";
import {
  CHAT_API_PATH,
  type ChatMessage,
  MAX_HISTORY,
  RATE_LIMIT_REQUESTS,
  RATELIMIT_REMAINING_HEADER,
} from "@/lib/chat/config";

/** Header carrying the seconds-until-reset for a rate-limited (429) response. */
const RETRY_AFTER_HEADER = "Retry-After";

/**
 * A rendered conversation turn. Carries a stable `id` so React keeps each
 * bubble's node identity as streamed text grows (the aria-live region must not
 * thrash) and so the message list avoids index keys.
 */
export interface ChatThreadMessage extends ChatMessage {
  id: string;
}

let messageCounter = 0;
function nextId(): string {
  messageCounter += 1;
  return `m${messageCounter}`;
}

/**
 * Turn a relative duration in seconds into "in 5 hours"-style prose via
 * `Intl.RelativeTimeFormat`. Always relative, never an absolute clock time.
 */
function formatReset(seconds: number): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (seconds >= 3600) return rtf.format(Math.round(seconds / 3600), "hour");
  if (seconds >= 60) return rtf.format(Math.round(seconds / 60), "minute");
  return rtf.format(Math.max(seconds, 1), "second");
}

function rateLimitMessage(retryAfterSeconds: number | null): string {
  const base = `You've reached today's limit (${RATE_LIMIT_REQUESTS}).`;
  if (retryAfterSeconds === null) return base;
  return `${base} Resets ${formatReset(retryAfterSeconds)}.`;
}

export interface UseChatResult {
  messages: ChatThreadMessage[];
  loading: boolean;
  error: string | null;
  /** Remaining daily budget; `null` until the first response reports it. */
  remaining: number | null;
  send: (text: string) => Promise<void>;
}

export function useChat(): UseChatResult {
  const [messages, setMessages] = useState<ChatThreadMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError(null);
      setLoading(true);

      const userMessage: ChatThreadMessage = {
        id: nextId(),
        role: "user",
        content: trimmed,
      };
      const assistantId = nextId();

      // Append the user turn AND an empty assistant bubble (stable id) up front.
      // Build the network payload from a local array — never read `messages`
      // back after setState, it would be stale.
      const nextThread = [...messages, userMessage];
      setMessages([
        ...nextThread,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      const payload = nextThread
        .slice(-MAX_HISTORY)
        .map(({ role, content }) => ({ role, content }));

      // Pre-stream failures must drop the empty assistant placeholder, or it
      // would be POSTed on the next send and rejected (empty text block).
      const dropEmptyPlaceholder = () => {
        setMessages((prev) =>
          prev.filter((m) => m.id !== assistantId || m.content !== ""),
        );
      };

      try {
        const response = await fetch(CHAT_API_PATH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: payload }),
        });

        // Read the remaining budget the moment headers arrive, before the body.
        const remainingHeader = response.headers.get(
          RATELIMIT_REMAINING_HEADER,
        );
        if (remainingHeader !== null) {
          setRemaining(Number(remainingHeader));
        }

        if (!response.ok) {
          dropEmptyPlaceholder();
          if (response.status === 429) {
            const retryAfter = response.headers.get(RETRY_AFTER_HEADER);
            const seconds =
              retryAfter !== null && retryAfter !== ""
                ? Number(retryAfter)
                : null;
            // Converge the UI to the disabled state even on a race 429.
            setRemaining(0);
            setError(
              rateLimitMessage(
                seconds !== null && Number.isFinite(seconds) ? seconds : null,
              ),
            );
          } else if (response.status === 400) {
            setError(
              "That message couldn't be sent — please shorten it and try again.",
            );
          } else {
            setError("Chat is temporarily unavailable.");
          }
          return;
        }

        if (!response.body) {
          dropEmptyPlaceholder();
          setError("Chat is temporarily unavailable.");
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        // A rejected read() mid-stream must surface an error BUT keep whatever
        // assistant text already accumulated.
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            accumulated += decoder.decode(value, { stream: true });
            const current = accumulated;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: current } : m,
              ),
            );
          }
        } catch {
          // Mid-stream failure: KEEP any partial assistant text. But if the
          // stream dropped before a single byte arrived (e.g. the first event
          // after message_start), the placeholder is still empty — drop it so
          // it isn't POSTed as an empty-content message on the next send.
          if (!accumulated) dropEmptyPlaceholder();
          setError("The answer was interrupted — please try again.");
        }
      } catch {
        // Network/pre-stream failure: drop the empty placeholder so it never
        // gets POSTed on the next send.
        dropEmptyPlaceholder();
        setError("Chat is temporarily unavailable.");
      } finally {
        setLoading(false);
      }
    },
    [messages, loading],
  );

  return { messages, loading, error, remaining, send };
}
