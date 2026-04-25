import { Phone } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { CopyableEmail } from "@/components/CopyableEmail";
import { Card, CardContent } from "@/components/ui/card";
import type { ResumeData } from "@/types/resume";
import styles from "./Header.module.css";

interface HeaderProps {
  resume: ResumeData;
  email: string;
  phone: string;
}

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface PillLink {
  label: string;
  href: string;
  text: string;
  Icon: IconType;
}

function ContactPill({ link }: { link: PillLink }) {
  const external = link.href.startsWith("http");
  return (
    <a
      href={link.href}
      aria-label={link.label}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-sm text-foreground/80 transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <link.Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{link.text}</span>
    </a>
  );
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
          <p className="text-xl font-semibold leading-[1.2] text-foreground mt-1">
            {resume.title}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {email && <CopyableEmail email={email} />}
            {pills.map((link) => (
              <ContactPill key={link.label} link={link} />
            ))}
          </div>
          {resume.bio && (
            <p className="mt-4 text-base leading-relaxed">{resume.bio}</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
