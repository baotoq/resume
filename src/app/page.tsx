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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      </div>

      <div
        ref={resumeRef}
        className="relative max-w-4xl mx-auto bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl px-8 py-10 sm:px-12 sm:py-12 border border-white/50 flex flex-col gap-8"
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
