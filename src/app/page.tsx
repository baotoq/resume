import { Experience } from "@/components/resume/Experience";
import { Education } from "@/components/resume/Education";
import { Skills } from "@/components/resume/Skills";
import { Projects } from "@/components/resume/Projects";
import { Contact } from "@/components/resume/Contact";
import { Summary } from "@/components/resume/Summary";
import { Header } from "@/components/resume/Header";

import {
  contactInfo,
  experiences,
  education,
  skillCategories,
  projects,
  summary,
  mainInfo,
} from "@/data/resume";

export default function Home() {
  return (
    <main className="">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <Header name={mainInfo.name} title={mainInfo.title} />
            <div className="ml-auto">
              <Contact contactInfo={contactInfo} />
            </div>
          </div>

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
      </div>
    </main>
  );
}
