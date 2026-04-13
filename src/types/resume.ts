export interface ExperienceEntry {
  company: string
  role: string
  startDate: string        // "YYYY-MM" format
  endDate: string | null   // null renders as "Present"
  bullets: string[]
  logo_url?: string        // optional company logo URL (external absolute URL)
}

export interface ResumeData {
  name: string
  title: string
  github: string
  linkedin: string
  experience: ExperienceEntry[]
  skills: Record<string, string>  // category label -> comma-separated values
}
