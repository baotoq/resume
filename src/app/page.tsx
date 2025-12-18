"use client";

import { useRef } from "react";
import { resumeData } from "@/data/resume";
import { Header } from "@/components/resume/Header";
import { Summary } from "@/components/resume/Summary";
import { Experience } from "@/components/resume/Experience";
import { Education } from "@/components/resume/Education";
import { Skills } from "@/components/resume/Skills";
import { PDFExportButton } from "@/components/ui/PDFExportButton";

export default function ResumePage() {
  const resumeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div
        ref={resumeRef}
        className="max-w-4xl mx-auto bg-white shadow-lg px-8 py-10 sm:px-12 sm:py-12"
        id="resume-content"
      >
        <Header
          personal={resumeData.personal}
          pdfButton={<PDFExportButton contentRef={resumeRef} />}
        />
        <Summary summary={resumeData.summary} />
        <Experience experience={resumeData.experience} />
        <Education education={resumeData.education} />
        <Skills skills={resumeData.skills} />
      </div>
    </div>
  );
}
