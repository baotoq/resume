/** biome-ignore-all lint/suspicious/noArrayIndexKey: stable list from static YAML data */
import type { ReactNode } from "react";

interface HighlightedBulletProps {
  children: string;
}

export function HighlightedBullet({ children }: HighlightedBulletProps) {
  const boldSegments = children.split(/\*\*([^*]+)\*\*/g);

  const elements: ReactNode[] = [];

  boldSegments.forEach((segment, boldIndex) => {
    if (boldIndex % 2 === 1) {
      // Odd indices are bold matches
      elements.push(
        <span key={boldIndex} className="font-semibold">
          {segment}
        </span>,
      );
    } else {
      // Even indices are plain/accented text — parse accent within them
      const accentSegments = segment.split(/\*([^*]+)\*/g);
      accentSegments.forEach((accentSegment, accentIndex) => {
        if (accentIndex % 2 === 1) {
          // Odd indices are accent matches
          elements.push(
            <span
              key={`${boldIndex}-${accentIndex}`}
              className="text-blue-700 font-semibold"
            >
              {accentSegment}
            </span>,
          );
        } else {
          // Plain text
          if (accentSegment) {
            elements.push(accentSegment);
          }
        }
      });
    }
  });

  return <>{elements}</>;
}
