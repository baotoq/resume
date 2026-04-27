"use client";

import { Phone } from "lucide-react";
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
  const pills = [
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
  ].filter(Boolean) as PillLink[];

  return (
    <section>
      <Card className="transition-transform hover:-translate-y-1 relative overflow-hidden">
        <div className="accent-glow" aria-hidden="true" />
        <div className="accent-glow-bottom" aria-hidden="true" />
        <CardContent className="relative">
          <h1 className="accent-gradient-text text-3xl font-semibold leading-[1.1]">
            {resume.name}
          </h1>
          <p className="text-lg font-semibold leading-[1.2] text-foreground mt-1">
            {resume.title}
          </p>
          <TooltipProvider delayDuration={100}>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {email && <CopyableEmailPill email={email} />}
              {pills.map((link) => (
                <ContactPill key={link.label} link={link} />
              ))}
              <DownloadResumePill />
            </div>
          </TooltipProvider>
          {resume.bio && (
            <p className="mt-4 text-base leading-relaxed">{resume.bio}</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
