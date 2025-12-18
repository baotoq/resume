"use client";

import { useRef } from "react";
import "@/styles/print.css";
import { mainInfo, contactInfo, summary, experiences, education, skillCategories } from "@/data/resume";
import { Header } from "@/components/resume/Header";
import { Summary } from "@/components/resume/Summary";
import { ExperienceSection } from "@/components/resume/Experience";
import { EducationSection } from "@/components/resume/Education";
import { SkillsSection } from "@/components/resume/Skills";
import { PDFExportButton } from "@/components/ui/PDFExportButton";

export default function ResumePage() {
  const resumeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div
        ref={resumeRef}
        className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg px-8 py-10 sm:px-12 sm:py-12 border border-gray-100 flex flex-col gap-6"
        id="resume-content"
      >
        <Header
          name={mainInfo.name}
          title={mainInfo.title}
          contact={contactInfo}
          pdfButton={<PDFExportButton contentRef={resumeRef} />}
        />
        <Summary summary={summary} />
        <ExperienceSection experiences={experiences} />
        <EducationSection education={education} />
        <SkillsSection skills={skillCategories} />
      </div>
    </div>
  );
}
