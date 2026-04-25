"use client";

import { Check, Copy, Mail } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface CopyableEmailProps {
  email: string;
}

export function CopyableEmail({ email }: CopyableEmailProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(email)}
      aria-label={copied ? "Email copied" : "Copy email to clipboard"}
      className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 pl-3 pr-1 py-1 text-sm text-foreground/80 transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
    >
      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{copied ? "Copied!" : email}</span>
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors">
        {copied ? (
          <Check className="h-3.5 w-3.5  text-primary" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </span>
    </button>
  );
}
