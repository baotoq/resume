import { Card, CardContent } from "@/components/ui/card";
import { AskResumeButton } from "@/features/chat/AskResumeButton";
import type { ResumeData } from "@/types/resume";
import { ContactPillsRow } from "./components/ContactPillsRow";
import { HighlightedBullet } from "./components/HighlightedBullet";

interface HeaderProps {
  resume: ResumeData;
  email: string;
  phone: string;
  chatEnabled: boolean;
}

export function Header({ resume, email, phone, chatEnabled }: HeaderProps) {
  return (
    <header>
      <Card className="transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none hover:scale-[1.01] relative overflow-hidden">
        <div className="accent-glow" aria-hidden="true" />
        <div className="accent-glow-bottom" aria-hidden="true" />
        <CardContent className="relative flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="accent-gradient-text text-3xl font-semibold text-balance">
                {resume.name}
              </h1>
              <p className="text-lg font-semibold text-foreground text-balance">
                {resume.title}
              </p>
            </div>
            <AskResumeButton enabled={chatEnabled} />
          </div>
          <ContactPillsRow
            email={email}
            phone={phone}
            github={resume.github}
            linkedin={resume.linkedin}
          />
          {resume.bio && (
            <p className="text-base leading-relaxed text-pretty">
              <HighlightedBullet>{resume.bio}</HighlightedBullet>
            </p>
          )}
        </CardContent>
      </Card>
    </header>
  );
}
