"use client";

import { Send } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MAX_INPUT_CHARS } from "@/lib/chat/config";
import { cn } from "@/lib/utils";
import type { UseChatResult } from "./useChat";

/** Inlined starter prompts, shown only when the thread is empty (§11). */
const SUGGESTED_QUESTIONS = [
  "Have you run Kubernetes and GitOps in production?",
  "Tell me about your experience with high-throughput distributed systems.",
  "What's your background with .NET and Golang?",
  "What did you build at Upmesh?",
  "Which cloud platforms have you used in production?",
];

interface AskResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chat: UseChatResult;
}

export function AskResumeDialog({
  open,
  onOpenChange,
  chat,
}: AskResumeDialogProps) {
  const { messages, loading, error, remaining, send } = chat;
  const [input, setInput] = useState("");
  const textareaId = useId();

  const limitReached = remaining === 0;
  const lastMessage = messages[messages.length - 1];
  // The first assistant token hasn't arrived yet while we await a reply.
  const awaitingFirstToken =
    loading && lastMessage?.role === "assistant" && lastMessage.content === "";

  const submit = (text: string) => {
    if (limitReached || loading) return;
    void send(text);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    submit(text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-full max-w-[calc(100%-2rem)] flex-col gap-4 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ask my resume</DialogTitle>
          <DialogDescription>
            Ask anything about my background — answered live, in my own words,
            grounded only in my resume.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => submit(question)}
                  className="rounded-full border border-border bg-background/60 px-3 py-1 text-left text-sm text-foreground/80 transition-colors hover:border-primary hover:text-primary"
                >
                  {question}
                </button>
              ))}
            </div>
          ) : (
            <div
              aria-live="polite"
              className="flex flex-col gap-3 text-sm leading-relaxed"
            >
              {messages
                // Skip the empty assistant placeholder so no blank bubble
                // shows before the first token — the typing indicator covers
                // that state.
                .filter(
                  (message) =>
                    message.role === "user" || message.content !== "",
                )
                .map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2",
                      message.role === "user"
                        ? "self-end bg-primary/10 text-foreground"
                        : "self-start bg-muted text-foreground",
                    )}
                  >
                    {message.content}
                  </div>
                ))}
              {awaitingFirstToken && (
                <output
                  aria-label="Bao is typing"
                  className="flex items-center gap-1 self-start rounded-lg bg-muted px-3 py-3"
                >
                  <span className="size-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.3s] motion-reduce:animate-none" />
                  <span className="size-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.15s] motion-reduce:animate-none" />
                  <span className="size-1.5 animate-bounce rounded-full bg-foreground/50 motion-reduce:animate-none" />
                </output>
              )}
            </div>
          )}
        </div>

        {error && <output className="text-sm text-destructive">{error}</output>}

        <div className="flex flex-col gap-1.5">
          <label htmlFor={textareaId} className="text-sm font-medium">
            Your question
          </label>
          <div className="flex items-end gap-2">
            <textarea
              id={textareaId}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // `isComposing` guards an IME candidate-confirmation Enter
                // (CJK input) from prematurely sending the message.
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              maxLength={MAX_INPUT_CHARS}
              disabled={limitReached}
              rows={2}
              placeholder="Ask about my experience…"
              className="flex-1 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-hidden focus-visible:border-primary disabled:opacity-50"
            />
            <Button
              type="button"
              onClick={handleSend}
              disabled={limitReached || loading}
              aria-label="Send"
            >
              <Send className="size-4" />
            </Button>
          </div>
          {limitReached
            ? // The limit message is shown by the error block above; if remaining
              // hit 0 via a successful response (no error set), note it here.
              !error && (
                <p className="text-xs text-muted-foreground">
                  You've reached today's limit.
                </p>
              )
            : remaining !== null && (
                <p className="text-xs text-muted-foreground">
                  {remaining} {remaining === 1 ? "question" : "questions"} left
                  today
                </p>
              )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
