"use client";

import { useReactToPrint } from "react-to-print";
import type { RefObject } from "react";
import { Button } from "antd";
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
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      onClick={() => handlePrint()}
      className="no-print"
    >
      Download PDF
    </Button>
  );
}
