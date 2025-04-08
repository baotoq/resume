import React from 'react'

export default function Experience() {
  const experiences = [
    {
      company: 'Company Name',
      position: 'Job Title',
      period: 'Jan 2020 - Present',
      description: [
        'Key achievement or responsibility',
        'Another key achievement or responsibility',
        'Third key achievement or responsibility'
      ]
    },
    // Add more experiences as needed
  ]

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Experience</h2>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className="border-l-4 border-gray-200 pl-4">
            <h3 className="text-xl font-semibold">{exp.position}</h3>
            <h4 className="text-lg text-gray-600">{exp.company}</h4>
            <p className="text-gray-500">{exp.period}</p>
            <ul className="mt-2 list-disc list-inside">
              {exp.description.map((item, i) => (
                <li key={i} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
