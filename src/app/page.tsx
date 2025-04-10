import { Experience } from "@/components/resume/Experience";
import { Education } from "@/components/resume/Education";
import { Skills } from "@/components/resume/Skills";
import { Projects } from "@/components/resume/Projects";
import { Contact } from '@/components/resume/Contact';
import { Summary } from '@/components/resume/Summary';

import {
  contactInfo,
  experiences,
  education,
  skillCategories,
  projects,
  summary,
} from "@/data/resume";

export default function Home() {
  return (
    <main className="min-h-screen bg-resume-background dark:bg-resume-dark-background text-resume-text-primary dark:text-resume-dark-text-primary">
      <div className="container mx-auto px-4 py-8">
        <section>
          <Contact contactInfo={contactInfo} />
        </section>

        <Summary summary={summary} />

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
          <Projects projects={projects} />
        </section>
      </div>
    </main>
  );
}
