interface SkillsProps {
  skills: Record<string, string>
}

export function Skills({ skills }: SkillsProps) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">
      <h2 className="text-xl font-semibold leading-[1.2] text-zinc-900 mb-6">Skills</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Object.entries(skills).map(([category, values]) => (
          <div key={category}>
            <h3 className="text-sm font-normal text-zinc-400">{category}</h3>
            <p className="mt-1 text-base text-zinc-700">{values}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
