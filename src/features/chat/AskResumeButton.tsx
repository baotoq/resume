"use client";

import { Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Loaded on first click so the chat stack (ai + @ai-sdk/react + dialog) stays
// out of the initial page bundle.
const AskResumeDialog = dynamic(() =>
  import("./AskResumeDialog").then((m) => m.AskResumeDialog),
);

export function AskResumeButton() {
  const [open, setOpen] = useState(false);
  // Once mounted the dialog stays mounted, so the thread survives close/reopen.
  const [mounted, setMounted] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="pill"
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
        className="accent-gradient-bg border-transparent text-zinc-950 hover:text-zinc-950 hover:border-transparent max-sm:min-h-11 print:hidden"
        data-pdf-hidden
      >
        <Sparkles aria-hidden className="h-3.5 w-3.5" />
        <span>Ask my resume</span>
      </Button>
      {mounted && <AskResumeDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}
