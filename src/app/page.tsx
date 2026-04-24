import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { AnimateIn } from "@/components/animation/AnimateIn";
import { CertificationsSection } from "@/components/CertificationsSection";
import { EducationSection } from "@/components/EducationSection";
import { Header } from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { WorkExperience } from "@/components/WorkExperience";
import type { ResumeData } from "@/types/resume";

export default function Page() {
  const filePath = path.join(process.cwd(), "src/data/resume.md");
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    console.error("Failed to read resume.md:", err);
    throw new Error("Resume data unavailable");
  }
  const { data } = matter(raw);
  const resume = data as ResumeData;

  const email = process.env.EMAIL ?? "";
  const phone = process.env.PHONE ?? "";

  return (
    <main className="page-grain min-h-screen bg-zinc-50 py-12 px-4 sm:px-8">
      <div className="relative z-10 mx-auto max-w-3xl flex flex-col gap-10">
        <AnimateIn delay={0}>
          <Header resume={resume} email={email} phone={phone} />
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <Separator />
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <WorkExperience experience={resume.experience} />
        </AnimateIn>
        <AnimateIn delay={0.2}>
          <Separator />
        </AnimateIn>
        <AnimateIn delay={0.2}>
          <EducationSection education={resume.education ?? []} />
        </AnimateIn>
        <AnimateIn delay={0.3}>
          <Separator />
        </AnimateIn>
        <AnimateIn delay={0.3}>
          <CertificationsSection
            certifications={resume.certifications ?? []}
          />
        </AnimateIn>
      </div>
    </main>
  );
}
