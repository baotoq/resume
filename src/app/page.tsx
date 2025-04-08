import {
  BriefcaseIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  RocketLaunchIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import { Header } from "@/components/resume/Header";
import { Section } from "@/components/resume/Section";
import { Experience } from "@/components/resume/Experience";
import { Education } from "@/components/resume/Education";
import { Skills } from "@/components/resume/Skills";
import { Projects } from "@/components/resume/Projects";

import {
  contactInfo,
  experiences,
  education,
  skillCategories,
  projects,
} from "@/data/resume";

export const metadata = {
  title: "John Developer - Senior Software Engineer Resume",
  description: "Professional resume of John Developer, a Senior Software Engineer with 10+ years of experience in building scalable distributed systems.",
};

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-resume-background-primary dark:bg-resume-dark-background-primary">
      <Header
        name="John Developer"
        title="Senior Software Engineer & Tech Lead"
        contact={contactInfo}
      />

      <Section title="Summary" icon={<DocumentTextIcon className="h-6 w-6" />}>
        <p className="text-resume-text-secondary dark:text-resume-dark-text-secondary">
          Senior Software Engineer with 10+ years of experience in building scalable distributed systems and leading engineering teams.
          Expertise in cloud architecture, microservices, and modern JavaScript/TypeScript ecosystems.
          Proven track record of delivering high-impact projects and mentoring junior developers.
        </p>
      </Section>

      <Section title="Experience" icon={<BriefcaseIcon className="h-6 w-6" />}>
        <Experience experiences={experiences} />
      </Section>

      <Section title="Education" icon={<AcademicCapIcon className="h-6 w-6" />}>
        <Education education={education} />
      </Section>

      <Section title="Skills" icon={<WrenchScrewdriverIcon className="h-6 w-6" />}>
        <Skills categories={skillCategories} />
      </Section>

      <Section title="Notable Projects" icon={<RocketLaunchIcon className="h-6 w-6" />}>
        <Projects projects={projects} />
      </Section>
    </div>
  );
}
