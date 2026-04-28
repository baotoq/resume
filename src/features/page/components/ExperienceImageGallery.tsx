"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageLightbox } from "./ImageLightbox";

interface ExperienceImageGalleryProps {
  images: string[];
}

export function ExperienceImageGallery({
  images,
}: ExperienceImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="flex gap-4" data-pdf-hidden>
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => openLightbox(index)}
            className="relative flex-1 rounded-md border border-border bg-muted cursor-zoom-in aspect-video min-w-0"
          >
            <Image
              src={src}
              alt={`Project screenshot ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 hover:scale-[1.1] rounded-md"
              sizes="(max-width: 768px) 33vw, 300px"
            />
          </button>
        ))}
      </div>

      <ImageLightbox
        images={images}
        initialIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
