import { Phone } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { CopyableEmail } from "@/components/CopyableEmail";
import { Card, CardContent } from "@/components/ui/card";
import type { ResumeData } from "@/types/resume";

interface HeaderProps {
  resume: ResumeData;
  email: string;
  phone: string;
}

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 .5C5.73.5.5 5.74.5 12.04c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.11-.75.4-1.26.73-1.55-2.55-.29-5.23-1.29-5.23-5.74 0-1.27.45-2.3 1.19-3.11-.12-.3-.52-1.48.11-3.08 0 0 .97-.31 3.19 1.19a10.98 10.98 0 015.81 0c2.22-1.5 3.19-1.19 3.19-1.19.63 1.6.23 2.78.11 3.08.74.81 1.19 1.84 1.19 3.11 0 4.46-2.69 5.45-5.25 5.73.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56 4.56-1.53 7.85-5.84 7.85-10.91C23.5 5.74 18.27.5 12 .5z" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

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
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
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
    Icon: GithubIcon,
  });
  pills.push({
    label: "LinkedIn profile",
    href: resume.linkedin,
    text: "LinkedIn",
    Icon: LinkedinIcon,
  });

  return (
    <section>
      <Card className="hover-lift relative overflow-hidden">
        <div className="accent-glow" aria-hidden="true" />
        <div className="accent-glow-bottom" aria-hidden="true" />
        <CardContent className="relative">
          <h1 className="accent-gradient-text text-[28px] font-semibold leading-[1.1]">
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
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {resume.bio}
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
