"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  INTERRUPTED_MESSAGE,
  MAX_HISTORY,
  MAX_INPUT_CHARS,
  RATE_LIMIT_REQUESTS,
} from "@/lib/chat/config";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Have you run Kubernetes and GitOps in production?",
  "Tell me about the high-throughput systems you've built",
  "What's your .NET and Golang background?",
  "What did you build at Upmesh?",
  "Which cloud platforms have you used in production?",
];

type ChatMetadata = { remaining?: number };

type UiError =
  | { kind: "rate_limited"; reset: number }
  | { kind: "invalid_input" }
  | { kind: "unavailable" };

function messageText(message: UIMessage): string {
  return message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

function latestRemaining(messages: UIMessage[]): number | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role !== "assistant") continue;
    const remaining = (message.metadata as ChatMetadata | undefined)?.remaining;
    if (typeof remaining === "number") return remaining;
  }
  return undefined;
}

function formatReset(reset: number): string {
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const minutes = Math.round((reset - Date.now()) / 60_000);
  if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
  return formatter.format(Math.round(minutes / 60), "hour");
}

interface AskResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AskResumeDialog({ open, onOpenChange }: AskResumeDialogProps) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        // The server's strict schema rejects non-text parts and empty text
        // (an interrupted stream can leave an assistant turn with text ""),
        // so sanitize before trimming the window.
        prepareSendMessagesRequest: ({ id, messages }) => ({
          body: {
            id,
            messages: messages
              .map((message) => ({
                id: message.id,
                role: message.role,
                parts: message.parts.flatMap((part) =>
                  part.type === "text" && part.text.length > 0
                    ? [{ type: "text" as const, text: part.text }]
                    : [],
                ),
              }))
              .filter((message) => message.parts.length > 0)
              .slice(-MAX_HISTORY),
          },
        }),
      }),
    [],
  );

  const [uiError, setUiError] = useState<UiError | null>(null);
  const { messages, sendMessage, status, clearError } = useChat({
    transport,
    onError: (err) => {
      let parsed: { error?: unknown; reset?: unknown } = {};
      try {
        const candidate = JSON.parse(err.message);
        if (candidate && typeof candidate === "object") parsed = candidate;
      } catch {
        // not JSON — network failure or mid-stream error
      }
      if (parsed.error === "rate_limited" && typeof parsed.reset === "number") {
        setUiError({ kind: "rate_limited", reset: parsed.reset });
      } else if (parsed.error === "invalid_input") {
        setUiError({ kind: "invalid_input" });
      } else {
        setUiError({ kind: "unavailable" });
      }
    },
  });

  const inputId = useId();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  // Only auto-scroll while the user is already at the bottom, so reading an
  // earlier answer isn't interrupted by streamed deltas.
  const stickToBottom = useRef(true);

  const remaining = latestRemaining(messages);
  const inputDisabled = remaining === 0 || uiError?.kind === "rate_limited";
  const busy = status === "submitted" || status === "streaming";

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom whenever the thread grows or streams
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  // The rate-limit lockout lifts itself once the window resets.
  useEffect(() => {
    if (uiError?.kind !== "rate_limited") return;
    const timer = setTimeout(
      () => setUiError(null),
      Math.max(0, uiError.reset - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [uiError]);

  function send(text: string) {
    if (inputDisabled || busy) return;
    setUiError(null);
    clearError();
    sendMessage({ text });
  }

  function submit() {
    const text = input.trim();
    if (!text || inputDisabled || busy) return;
    send(text);
    setInput("");
  }

  const lastMessage = messages[messages.length - 1];
  const interrupted =
    lastMessage?.role === "assistant" && messageText(lastMessage).length > 0;

  let errorMessage: string | null = null;
  if (uiError?.kind === "rate_limited") {
    errorMessage = `You've reached today's limit (${RATE_LIMIT_REQUESTS} questions). Resets ${formatReset(uiError.reset)}.`;
  } else if (uiError?.kind === "invalid_input") {
    errorMessage =
      "That message can't be sent - please shorten or rephrase it.";
  } else if (uiError?.kind === "unavailable") {
    errorMessage = interrupted
      ? INTERRUPTED_MESSAGE
      : "Chat is temporarily unavailable - you can reach me via the links on this page.";
  }

  // The rate-limit alert already covers the quota state; showing a stale
  // "1 question left" next to it would contradict the alert.
  let quotaText: string | null = null;
  if (uiError?.kind === "rate_limited") {
    quotaText = null;
  } else if (remaining === 0) {
    quotaText = `You've reached today's limit (${RATE_LIMIT_REQUESTS} questions).`;
  } else if (remaining === 1) {
    quotaText = "1 question left today";
  } else if (remaining !== undefined) {
    quotaText = `${remaining} questions left today`;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ask my resume</DialogTitle>
          <DialogDescription>
            AI answers based on my resume - ask about my experience, skills, or
            background.
          </DialogDescription>
        </DialogHeader>

        <div
          ref={scrollRef}
          role="log"
          aria-label="Conversation"
          // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable region must be keyboard-focusable (WCAG 2.1.1)
          tabIndex={0}
          aria-live="polite"
          onScroll={() => {
            const el = scrollRef.current;
            if (el) {
              stickToBottom.current =
                el.scrollHeight - el.scrollTop - el.clientHeight < 40;
            }
          }}
          className="flex-1 space-y-3 overflow-y-auto focus-visible:outline-2 focus-visible:outline-primary"
        >
          {messages.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-zinc-600">
                Curious about my background? Ask anything, or start with one of
                these:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <Button
                    key={suggestion}
                    type="button"
                    variant="pill"
                    className="text-left"
                    onClick={() => send(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto bg-zinc-900 text-zinc-50"
                    : "mr-auto bg-zinc-100 text-zinc-900",
                )}
              >
                {messageText(message)}
              </div>
            ))
          )}
          {status === "submitted" && (
            <output
              aria-label="Bao is typing"
              className="flex items-center gap-1 px-3 py-2"
            >
              {/* Empty live regions often announce nothing — keep real text for screen readers. */}
              <span className="sr-only">Bao is typing</span>
              <span
                aria-hidden="true"
                className="size-1.5 animate-pulse rounded-full bg-zinc-400 motion-reduce:animate-none"
              />
              <span
                aria-hidden="true"
                className="size-1.5 animate-pulse rounded-full bg-zinc-400 [animation-delay:150ms] motion-reduce:animate-none"
              />
              <span
                aria-hidden="true"
                className="size-1.5 animate-pulse rounded-full bg-zinc-400 [animation-delay:300ms] motion-reduce:animate-none"
              />
            </output>
          )}
        </div>

        {errorMessage && (
          <p role="alert" className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <form
          className="space-y-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label htmlFor={inputId} className="text-sm font-medium">
            Ask a question about my experience
          </label>
          <div className="flex items-end gap-2">
            <textarea
              id={inputId}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              maxLength={MAX_INPUT_CHARS}
              rows={2}
              disabled={inputDisabled}
              placeholder="e.g. What's your Kubernetes experience?"
              className="min-h-11 flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-hidden focus-visible:border-primary disabled:opacity-50"
            />
            <Button
              type="submit"
              variant="pill"
              disabled={inputDisabled || busy}
            >
              Send
            </Button>
          </div>
          <div className="flex justify-between gap-2 text-xs text-zinc-500">
            <span>{quotaText}</span>
            <span>{`${input.length}/${MAX_INPUT_CHARS}`}</span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
