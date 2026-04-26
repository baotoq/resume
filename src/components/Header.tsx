"use client";

import { Phone } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { ContactPill, type PillLink } from "@/components/pills/ContactPill";
import { CopyableEmailPill } from "@/components/pills/CopyableEmailPill";
import { DownloadResumePill } from "@/components/pills/DownloadResumePill";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ResumeData } from "@/types/resume";
import styles from "./Header.module.css";

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
      <Card className="hover-lift relative overflow-hidden">
        <div className={styles.accentGlow} aria-hidden="true" />
        <div className={styles.accentGlowBottom} aria-hidden="true" />
        <CardContent className="relative">
          <h1
            className={`${styles.accentGradientText} text-[28px] font-semibold leading-[1.1]`}
          >
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
