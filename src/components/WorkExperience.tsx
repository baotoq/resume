import type { ExperienceEntry } from "@/types/resume"

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
      <div className="flex flex-col gap-6">
        {experience.map((entry, index) => (
          <article
            key={index}
            className="rounded-xl border border-zinc-200 bg-white px-6 py-6 shadow-sm"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h3 className="text-sm font-normal text-zinc-700">{entry.company}</h3>
                <p className="text-sm font-normal text-zinc-700">{entry.role}</p>
              </div>
              <span className="text-sm font-normal text-zinc-400">
                {formatDateRange(entry.startDate, entry.endDate)}
              </span>
            </div>
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
        ))}
      </div>
    </section>
  )
}
