import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ResumeData } from "@/types/resume";
import { Header } from "@/components/Header";
import { WorkExperience } from "@/components/WorkExperience";
import { Skills } from "@/components/Skills";
import { AnimateIn } from "@/components/AnimateIn";

export default function Page() {
  const filePath = path.join(process.cwd(), "src/data/resume.md");
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);
  const resume = data as ResumeData;

  const email = process.env.NEXT_PUBLIC_EMAIL ?? "";
  const phone = process.env.NEXT_PUBLIC_PHONE ?? "";

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-8">
      <div className="mx-auto max-w-3xl flex flex-col gap-8">
        <AnimateIn delay={0}>
          <Header resume={resume} email={email} phone={phone} />
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <WorkExperience experience={resume.experience} />
        </AnimateIn>
        <AnimateIn delay={0.2}>
          <Skills skills={resume.skills} />
        </AnimateIn>
      </div>
    </main>
  );
}
