import type { ResumeData } from "@/types/resume"

interface HeaderProps {
  resume: ResumeData
  email: string
  phone: string
}

export function Header({ resume, email, phone }: HeaderProps) {
  const contacts: { label: string; href: string; text: string }[] = []
  if (email) contacts.push({ label: "Email", href: `mailto:${email}`, text: email })
  if (phone) contacts.push({ label: "Phone", href: `tel:${phone}`, text: phone })
  contacts.push({ label: "GitHub profile", href: resume.github, text: "GitHub" })
  contacts.push({ label: "LinkedIn profile", href: resume.linkedin, text: "LinkedIn" })

  return (
    <section className="rounded-xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">
      <h1 className="text-[28px] font-semibold leading-[1.1] text-zinc-900">{resume.name}</h1>
      <p className="text-xl font-semibold leading-[1.2] text-zinc-700 mt-1">{resume.title}</p>
      <div className="flex flex-wrap items-center gap-1 text-base mt-4">
        {contacts.map((c, i) => (
          <span key={c.label}>
            {i > 0 && <span className="text-zinc-400"> · </span>}
            <a
              href={c.href}
              className="text-indigo-600 hover:text-indigo-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
              {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {c.text}
            </a>
          </span>
        ))}
      </div>
    </section>
  )
}
