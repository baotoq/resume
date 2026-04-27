"use client";

import { Phone } from "lucide-react";
import { useMemo } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ContactPill,
  type PillLink,
} from "@/features/page/components/pills/ContactPill";
import { CopyableEmailPill } from "@/features/page/components/pills/CopyableEmailPill";
import { DownloadResumePill } from "@/features/page/components/pills/DownloadResumePill";
import type { ResumeData } from "@/types/resume";

interface HeaderProps {
  resume: ResumeData;
  email: string;
  phone: string;
}

export function Header({ resume, email, phone }: HeaderProps) {
  const pills = useMemo(
    () =>
      [
        phone && {
          label: "Phone",
          href: `tel:${phone}`,
          text: phone,
          Icon: Phone,
        },
        {
          label: "GitHub profile",
          href: resume.github,
          text: "GitHub",
          Icon: FaGithub,
        },
        {
          label: "LinkedIn profile",
          href: resume.linkedin,
          text: "LinkedIn",
          Icon: FaLinkedin,
        },
      ].filter(Boolean) as PillLink[],
    [phone, resume.github, resume.linkedin],
  );

  return (
    <section>
      <Card className="transition-transform hover:-translate-y-1 relative overflow-hidden">
        <div className="accent-glow" aria-hidden="true" />
        <div className="accent-glow-bottom" aria-hidden="true" />
        <CardContent className="relative flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="accent-gradient-text text-3xl font-semibold">
              {resume.name}
            </h1>
            <p className="text-lg font-semibold text-foreground">
              {resume.title}
            </p>
          </div>
          <TooltipProvider delayDuration={100}>
            <div className="flex flex-wrap items-center gap-2">
              {email && <CopyableEmailPill email={email} />}
              {pills.map((link) => (
                <ContactPill key={link.label} link={link} />
              ))}
              <DownloadResumePill />
            </div>
          </TooltipProvider>
          {resume.bio && (
            <p className="text-base leading-relaxed">{resume.bio}</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
