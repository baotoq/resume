import React from 'react'

export default function Header() {
  return (
    <header className="text-center">
      <h1 className="text-4xl font-bold">Your Name</h1>
      <h2 className="text-xl text-gray-600 mt-2">Your Title</h2>
      <div className="mt-4 space-y-1">
        <p className="text-gray-600">your.email@example.com</p>
        <p className="text-gray-600">+1 (123) 456-7890</p>
        <p className="text-gray-600">Your Location</p>
      </div>
      <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
        Professional summary goes here. Highlight your key skills, experience, and what you bring to the table.
      </p>
    </header>
  )
}
