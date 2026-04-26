import { Download } from "lucide-react";

const PILL_CLASSES =
  "inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-sm text-foreground/80 transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2";

export function DownloadResumePill() {
  return (
    <a
      href="/to-quoc-bao-resume-a4.pdf"
      download
      aria-label="Download resume as PDF"
      data-pdf-trigger
      className={PILL_CLASSES}
    >
      <Download className="h-3.5 w-3.5" aria-hidden="true" />
      <span>Download PDF</span>
    </a>
  );
}
