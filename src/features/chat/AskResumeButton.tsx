"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AskResumeDialog } from "./AskResumeDialog";
import { useChat } from "./useChat";

interface AskResumeButtonProps {
  /** Gated on server-side env presence; the feature self-disables when false. */
  enabled: boolean;
}

export function AskResumeButton({ enabled }: AskResumeButtonProps) {
  const [open, setOpen] = useState(false);
  // The hook lives here, in the always-mounted trigger, so the thread persists
  // across dialog close/reopen within the session (the dialog subtree unmounts).
  const chat = useChat();

  if (!enabled) return null;

  return (
    <div className="print:hidden">
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="min-h-11 min-w-11"
      >
        <Sparkles className="size-4" />
        Ask my resume ✨
      </Button>
      <AskResumeDialog open={open} onOpenChange={setOpen} chat={chat} />
    </div>
  );
}
