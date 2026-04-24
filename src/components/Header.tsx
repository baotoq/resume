import { CopyableEmail } from "@/components/CopyableEmail";
import { Card, CardContent } from "@/components/ui/card";
import type { ResumeData } from "@/types/resume";

interface HeaderProps {
  resume: ResumeData;
  email: string;
  phone: string;
}

export function Header({ resume, email, phone }: HeaderProps) {
  const linkContacts: { label: string; href: string; text: string }[] = [];
  if (phone)
    linkContacts.push({
      label: "Phone",
      href: `tel:${phone}`,
      text: phone,
    });
  linkContacts.push({
    label: "GitHub profile",
    href: resume.github,
    text: "GitHub",
  });
  linkContacts.push({
    label: "LinkedIn profile",
    href: resume.linkedin,
    text: "LinkedIn",
  });

  return (
    <section>
      <Card className="hover-lift relative overflow-hidden">
        <div className="accent-glow" aria-hidden="true" />
        <CardContent className="relative">
          <h1 className="accent-gradient-text text-[28px] font-semibold leading-[1.1]">
            {resume.name}
          </h1>
          <p className="text-xl font-semibold leading-[1.2] text-foreground mt-1">
            {resume.title}
          </p>
          <div className="flex flex-wrap items-center gap-1 text-base mt-4">
            {email && <CopyableEmail email={email} />}
            {linkContacts.map((c, i) => (
              <span key={c.label}>
                {(email || i > 0) && (
                  <span className="text-muted-foreground"> · </span>
                )}
                <a
                  href={c.href}
                  className="link-underline text-primary hover:text-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                  {...(c.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {c.text}
                </a>
              </span>
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
