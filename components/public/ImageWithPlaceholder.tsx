'use client'

import { useState } from 'react'
import ImagePlaceholder from './ImagePlaceholder'

type ImageWithPlaceholderProps = {
  src: string | null | undefined
  alt: string
  className?: string
  aspectRatio?: 'video' | '4/3' | 'square' | 'auto'
  placeholderLabel?: string
}

export default function ImageWithPlaceholder({
  src,
  alt,
  className = '',
  aspectRatio = '4/3',
  placeholderLabel = 'Image',
}: ImageWithPlaceholderProps) {
  const [error, setError] = useState(false)
  const showImage = src && src.trim() && !error

  if (!showImage) {
    return (
      <ImagePlaceholder
        aspectRatio={aspectRatio}
        label={placeholderLabel}
        className={className}
      />
    )
  }

  const isAuto = aspectRatio === 'auto'
  return (
    <div className={isAuto ? `w-full ${className}` : `overflow-hidden bg-gray-100 w-full h-full min-h-0 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src!}
        alt={alt}
        className={isAuto ? 'w-full h-auto object-contain' : 'w-full h-full object-cover'}
        onError={() => setError(true)}
      />
    </div>
  )
}
