'use client'

import { useState } from 'react'

interface LogoImageProps {
  src: string | undefined
  alt: string
}

export function LogoImage({ src, alt }: LogoImageProps) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div
        className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0"
        role="img"
        aria-label="Company logo unavailable"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-400"
          aria-hidden="true"
        >
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="w-10 h-10 rounded-lg object-contain flex-shrink-0"
      onError={() => setHasError(true)}
    />
  )
}
