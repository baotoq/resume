import { AnimateIn } from "@/components/animation/AnimateIn";
import { CertificationsSection } from "@/components/CertificationsSection";
import { EducationSection } from "@/components/EducationSection";
import { Header } from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { WorkExperience } from "@/components/WorkExperience";
import { parseResumeFile } from "@/lib/parse-resume";

export const dynamic = "force-static";

export default function Page() {
  const resume = parseResumeFile();

  const email = process.env.EMAIL ?? "";
  const phone = process.env.PHONE ?? "";

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: resume.name,
    jobTitle: resume.title,
    description: resume.bio,
    ...(email ? { email } : {}),
    sameAs: [resume.github, resume.linkedin].filter(Boolean),
  };

  return (
    <main className="page-grain min-h-screen bg-zinc-50 py-12 px-4 sm:px-8">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify output is injection-safe for ld+json
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="relative z-10 mx-auto max-w-3xl flex flex-col gap-8">
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
          <CertificationsSection certifications={resume.certifications ?? []} />
        </AnimateIn>
      </div>
    </main>
  );
}
