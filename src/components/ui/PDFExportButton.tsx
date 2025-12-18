"use client";

import { useReactToPrint } from "react-to-print";
import type { RefObject } from "react";

interface PDFExportButtonProps {
  contentRef: RefObject<HTMLDivElement | null>;
}

export function PDFExportButton({ contentRef }: PDFExportButtonProps) {
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "Resume",
  });

  return (
    <button
      onClick={() => handlePrint()}
      className="no-print bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm text-sm"
      type="button"
    >
      Download PDF
    </button>
  );
}
