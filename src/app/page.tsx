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
import { Contact } from '@/components/resume/Contact';

import {
  contactInfo,
  experiences,
  education,
  skillCategories,
  projects,
} from "@/data/resume";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-resume-text-primary dark:text-resume-dark-text-primary mb-2">
          John Developer
        </h1>
        <h2 className="text-2xl text-resume-text-secondary dark:text-resume-dark-text-secondary">
          Senior Software Engineer & Tech Lead
        </h2>
      </header>

      <section>
        <Contact contactInfo={contactInfo} />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-resume-text-primary dark:text-resume-dark-text-primary mb-4">
          Summary
        </h2>
        <p className="text-resume-text-secondary dark:text-resume-dark-text-secondary">
          Senior Software Engineer with 10+ years of experience in full-stack development, specializing in
          building scalable web applications and leading development teams.
        </p>
      </section>

      <section>
        <Experience experiences={experiences} />
      </section>

      <section>
        <Education education={education} />
      </section>

      <section>
        <Skills skillCategories={skillCategories} />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-resume-text-primary dark:text-resume-dark-text-primary mb-4">
          Notable Projects
        </h2>
        <Projects projects={projects} />
      </section>
    </main>
  );
}
