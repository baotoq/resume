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
        <span key={boldIndex} className="text-blue-600 font-semibold">
          {segment}
        </span>,
      );
    } else {
      // Even indices are plain/italic text — parse italic within them
      const italicSegments = segment.split(/\*([^*]+)\*/g);
      italicSegments.forEach((italicSegment, italicIndex) => {
        if (italicIndex % 2 === 1) {
          // Odd indices are italic matches
          elements.push(
            <span key={`${boldIndex}-${italicIndex}`} className="italic font-semibold">
              {italicSegment}
            </span>,
          );
        } else {
          // Plain text
          if (italicSegment) {
            elements.push(italicSegment);
          }
        }
      });
    }
  });

  return <>{elements}</>;
}
