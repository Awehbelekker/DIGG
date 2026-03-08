'use client'

import { useState } from 'react'
import ImageWithPlaceholder from './ImageWithPlaceholder'

type GalleryImage = { url: string; alt?: string }
type GalleryProps = { title?: string; images: GalleryImage[] }

export default function Gallery({ title, images }: GalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const cols = images.length <= 2 ? 2 : images.length === 3 ? 3 : images.length <= 6 ? 3 : 4

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl font-bold text-[#1B2A6B] mb-10 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </h2>
        )}
        <div className={`grid gap-4 grid-cols-2 ${cols >= 3 ? 'md:grid-cols-3' : ''} ${cols >= 4 ? 'lg:grid-cols-4' : ''}`}>
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightbox(i)}
              className="aspect-square rounded-xl overflow-hidden group cursor-pointer relative"
            >
              <ImageWithPlaceholder
                src={img.url}
                alt={img.alt || `Gallery image ${i + 1}`}
                aspectRatio="square"
                placeholderLabel="Image"
                className="rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && images[lightbox] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl z-10"
            onClick={() => setLightbox(null)}
          >
            &times;
          </button>
          {lightbox > 0 && (
            <button
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl z-10"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1) }}
            >
              ‹
            </button>
          )}
          {lightbox < images.length - 1 && (
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl z-10"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1) }}
            >
              ›
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[lightbox].url}
            alt={images[lightbox].alt || ''}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
