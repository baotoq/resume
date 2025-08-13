import { Experience } from "@/components/resume/Experience";
import { Education } from "@/components/resume/Education";
import { Skills } from "@/components/resume/Skills";
import { Contact } from "@/components/resume/Contact";
import { Summary } from "@/components/resume/Summary";
import { Header } from "@/components/resume/Header";

import { contactInfo, experiences, education, skillCategories, projects, summary, mainInfo } from "@/data/resume";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg border border-gray-200 rounded-lg px-12 py-10 print:shadow-none print:border-none print:rounded-none">
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
        </div>
      </div>
    </main>
  );
}
