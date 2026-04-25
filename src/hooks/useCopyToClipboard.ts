import { useState } from "react";

export function useCopyToClipboard(timeout = 1800) {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    } catch {
      // clipboard unavailable — silently skip
    }
  };

  return { copied, copy };
}
