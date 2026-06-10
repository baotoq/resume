"use client";

import { Phone } from "lucide-react";
import type { ComponentType } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CopyableEmailPill } from "@/features/page/components/pills/CopyableEmailPill";
import { DownloadResumePill } from "@/features/page/components/pills/DownloadResumePill";

type IconType = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

interface PillLink {
  label: string;
  href: string;
  text: string;
  Icon: IconType;
}

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
        {pills.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <Tooltip key={link.label}>
              <TooltipTrigger asChild>
                <Button asChild variant="pill">
                  <a
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    href={link.href}
                    aria-label={link.label}
                  >
                    <link.Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{link.text}</span>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{link.label}</TooltipContent>
            </Tooltip>
          );
        })}
        <DownloadResumePill />
      </div>
    </TooltipProvider>
  );
}
