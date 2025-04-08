import React from 'react'

export default function Education() {
  const education = [
    {
      institution: 'University Name',
      degree: 'Degree',
      field: 'Field of Study',
      period: '2016 - 2020'
    },
    // Add more education entries as needed
  ]

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Education</h2>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="border-l-4 border-gray-200 pl-4">
            <h3 className="text-xl font-semibold">{edu.institution}</h3>
            <h4 className="text-lg text-gray-600">{edu.degree} in {edu.field}</h4>
            <p className="text-gray-500">{edu.period}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
