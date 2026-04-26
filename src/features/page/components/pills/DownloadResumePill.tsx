"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DownloadResumePill() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild variant="pill">
          <a
            href="/to-quoc-bao-resume.pdf"
            download
            aria-label="Download resume as PDF"
            data-pdf-trigger
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Download PDF</span>
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent>PDF, ready to print</TooltipContent>
    </Tooltip>
  );
}
