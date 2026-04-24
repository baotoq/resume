"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyableEmailProps {
  email: string;
}

export function CopyableEmail({ email }: CopyableEmailProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — silently skip; link still works
    }
  };

  return (
    <span className="inline-flex items-center gap-1">
      <a
        href={`mailto:${email}`}
        className="link-underline text-primary hover:text-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Email copied" : "Copy email to clipboard"}
        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-[color:#10b981]" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </span>
  );
}
