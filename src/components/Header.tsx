import { Phone } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { ContactPill, type PillLink } from "@/components/pills/ContactPill";
import { CopyableEmailPill } from "@/components/pills/CopyableEmailPill";
import { DownloadResumePill } from "@/components/pills/DownloadResumePill";
import { Card, CardContent } from "@/components/ui/card";
import type { ResumeData } from "@/types/resume";
import styles from "./Header.module.css";

interface HeaderProps {
  resume: ResumeData;
  email: string;
  phone: string;
}

export function Header({ resume, email, phone }: HeaderProps) {
  const pills: PillLink[] = [];
  if (phone)
    pills.push({
      label: "Phone",
      href: `tel:${phone}`,
      text: phone,
      Icon: Phone,
    });
  pills.push({
    label: "GitHub profile",
    href: resume.github,
    text: "GitHub",
    Icon: FaGithub,
  });
  pills.push({
    label: "LinkedIn profile",
    href: resume.linkedin,
    text: "LinkedIn",
    Icon: FaLinkedin,
  });

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
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {email && <CopyableEmailPill email={email} />}
            {pills.map((link) => (
              <ContactPill key={link.label} link={link} />
            ))}
            <DownloadResumePill />
          </div>
          {resume.bio && (
            <p className="mt-4 text-base leading-relaxed">{resume.bio}</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
