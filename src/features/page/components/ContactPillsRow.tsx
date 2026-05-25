"use client";

import { Phone } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ContactPill,
  type PillLink,
} from "@/features/page/components/pills/ContactPill";
import { CopyableEmailPill } from "@/features/page/components/pills/CopyableEmailPill";
import { DownloadResumePill } from "@/features/page/components/pills/DownloadResumePill";

interface ContactPillsRowProps {
  email: string;
  phone: string;
  github: string;
  linkedin: string;
}

export function ContactPillsRow({
  email,
  phone,
  github,
  linkedin,
}: ContactPillsRowProps) {
  const pills: PillLink[] = [
    ...(phone
      ? [{ label: "Phone", href: `tel:${phone}`, text: phone, Icon: Phone }]
      : []),
    { label: "GitHub profile", href: github, text: "GitHub", Icon: FaGithub },
    {
      label: "LinkedIn profile",
      href: linkedin,
      text: "LinkedIn",
      Icon: FaLinkedin,
    },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-wrap items-center gap-2">
        {email && <CopyableEmailPill email={email} />}
        {pills.map((link) => (
          <ContactPill key={link.label} link={link} />
        ))}
        <DownloadResumePill />
      </div>
    </TooltipProvider>
  );
}
