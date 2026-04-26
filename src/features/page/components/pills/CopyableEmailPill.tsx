"use client";

import { Check, Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface CopyableEmailPillProps {
  email: string;
}

export function CopyableEmailPill({ email }: CopyableEmailPillProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="pill"
          onClick={() => copy(email)}
          aria-label={copied ? "Email copied" : "Copy email to clipboard"}
          className="cursor-pointer"
        >
          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{copied ? "Copied!" : email}</span>
          <span className="print:hidden inline-flex items-center justify-center rounded-full text-muted-foreground transition-colors">
            {copied ? (
              <Check className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : "Click to copy"}</TooltipContent>
    </Tooltip>
  );
}
