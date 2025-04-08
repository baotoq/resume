import React from 'react'

export default function Skills() {
  const skills = [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'HTML',
    'CSS',
    'Git',
    // Add more skills as needed
  ]

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  )
}
