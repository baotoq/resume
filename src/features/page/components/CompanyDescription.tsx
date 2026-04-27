import { HighlightedBullet } from "./HighlightedBullet";

interface CompanyDescriptionProps {
  description?: string;
}

export function CompanyDescription({ description }: CompanyDescriptionProps) {
  if (!description) return null;

  return (
    <div className="flex items-start gap-2.5 text-sm text-zinc-600 leading-relaxed">
      <svg
        className="w-4 h-4 text-zinc-400 mt-[3px] flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p>
        <HighlightedBullet>{description}</HighlightedBullet>
      </p>
    </div>
  );
}
