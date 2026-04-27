import { useCallback, useRef, useState } from "react";

export function useCopyToClipboard(timeout = 1800) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), timeout);
      } catch {
        // clipboard unavailable — silently skip
      }
    },
    [timeout],
  );

  return { copied, copy };
}
