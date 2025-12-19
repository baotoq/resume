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
      className="no-print group relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 overflow-hidden cursor-pointer"
      type="button"
      title="Download PDF"
    >
      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      <DownloadOutlined className="relative z-10 text-lg group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}
