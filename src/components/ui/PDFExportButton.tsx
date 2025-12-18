"use client";

import { useReactToPrint } from "react-to-print";
import type { RefObject } from "react";
import { DownloadOutlined } from "@ant-design/icons";

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
      className="no-print group relative inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 overflow-hidden cursor-pointer"
      type="button"
    >
      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      <DownloadOutlined className="relative z-10 text-sm group-hover:-translate-y-0.5 transition-transform" />
      <span className="relative z-10">Download PDF</span>
    </button>
  );
}
