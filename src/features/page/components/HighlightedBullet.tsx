/** biome-ignore-all lint/suspicious/noArrayIndexKey: stable list from static YAML data */
import type { ReactNode } from "react";

interface HighlightedBulletProps {
  children: string;
}

export function HighlightedBullet({ children }: HighlightedBulletProps) {
  const segments = children.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

  const elements: ReactNode[] = [];

  segments.forEach((segment, index) => {
    if (
      segment.startsWith("**") &&
      segment.endsWith("**") &&
      segment.length > 4
    ) {
      elements.push(
        <span key={index} className="font-semibold">
          {segment.slice(2, -2)}
        </span>,
      );
    } else if (
      segment.startsWith("*") &&
      segment.endsWith("*") &&
      segment.length > 2
    ) {
      elements.push(
        <span key={index} className="text-blue-700 font-semibold">
          {segment.slice(1, -1)}
        </span>,
      );
    } else if (segment) {
      elements.push(segment);
    }
  });

  return <>{elements}</>;
}
