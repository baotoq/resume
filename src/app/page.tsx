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
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function ResumePage() {
  const resumeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
      <div
        ref={resumeRef}
        className="relative max-w-4xl mx-auto bg-[var(--card)] shadow-xl rounded-2xl px-8 py-10 sm:px-12 sm:py-12 border border-[var(--border)] flex flex-col gap-12 animate-fade-in"
        id="resume-content"
      >
        <Header
          name={mainInfo.name}
          title={mainInfo.title}
          contact={contactInfo}
          pdfButton={<PDFExportButton contentRef={resumeRef} />}
          themeToggle={<ThemeToggle />}
        />
        <Summary summary={summary} />
        <ExperienceSection experiences={experiences} />
        <EducationSection education={education} />
        <SkillsSection skills={skillCategories} />
      </div>
    </div>
  );
}
