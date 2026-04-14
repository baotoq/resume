import type { ExperienceEntry } from "@/types/resume"
import { LogoImage } from "@/components/LogoImage"
import { TechStackIcons } from "@/components/TechStackIcons"

interface WorkExperienceProps {
  experience: ExperienceEntry[]
}

function formatDateRange(start: string, end: string | null): string {
  const formatMonth = (d: string) => {
    const [year, month] = d.split("-")
    const date = new Date(Number(year), Number(month) - 1)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`
}

export function WorkExperience({ experience }: WorkExperienceProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold leading-[1.2] text-zinc-900 mb-6">Work Experience</h2>

      {/* Rail wrapper — relative context for line + dots */}
      <div className="relative pl-5 sm:pl-7 flex flex-col gap-6">

        {/* Single continuous timeline line — starts at first dot centre, ends at last card bottom */}
        <div
          className="absolute left-[3px] sm:left-[7px] top-[28px] bottom-0 w-0.5 bg-zinc-200"
          aria-hidden="true"
        />

        {experience.map((entry, index) => {
          const isCurrent = entry.endDate === null

          return (
            <div key={index} className="relative">
              {/* Timeline dot — z-10 so it sits above the continuous line */}
              <div
                className={`absolute z-10 -left-[22px] sm:-left-[26px] top-[22px] w-3 h-3 rounded-full ${
                  isCurrent
                    ? "bg-indigo-600"
                    : "border-2 border-zinc-300 bg-white"
                }`}
                aria-hidden="true"
              />

              {/* Card */}
              <article className="rounded-xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">
                {/* Header — with LogoImage */}
                <div className="flex items-start gap-3">
                  <LogoImage src={entry.logo_url} alt={`${entry.company} logo`} />
                  <div className="flex flex-col flex-1 gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <h3 className="text-sm font-normal text-zinc-700">{entry.company}</h3>
                      <p className="text-sm font-normal text-zinc-700">{entry.role}</p>
                    </div>
                    <span className="text-sm font-normal text-zinc-400">
                      {formatDateRange(entry.startDate, entry.endDate)}
                    </span>
                  </div>
                </div>
                <TechStackIcons stack={entry.tech_stack} />
                {/* Bullets */}
                <ul className="mt-4 flex flex-col gap-2">
                  {entry.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="text-base leading-relaxed text-zinc-700 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[10px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-zinc-300"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          )
        })}
      </div>
    </section>
  )
}
