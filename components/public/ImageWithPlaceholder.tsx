'use client'

import { useState } from 'react'
import ImagePlaceholder from './ImagePlaceholder'
import { normalizeStoragePublicUrl } from '@/lib/image-storage'

type ImageWithPlaceholderProps = {
  src: string | null | undefined
  alt: string
  className?: string
  aspectRatio?: 'video' | '4/3' | 'square' | 'auto' | 'fill'
  placeholderLabel?: string
}

export default function ImageWithPlaceholder({
  src,
  alt,
  className = '',
  aspectRatio = '4/3',
  placeholderLabel = 'Image',
}: ImageWithPlaceholderProps) {
  const normalizedSrc = normalizeStoragePublicUrl(src)
  const [error, setError] = useState(false)
  const showImage = normalizedSrc && !error

  if (!showImage) {
    return (
      <ImagePlaceholder
        aspectRatio={aspectRatio === 'fill' ? 'video' : aspectRatio}
        label={placeholderLabel}
        className={className}
      />
    )
  }

  const isFill = aspectRatio === 'fill'
  const isAuto = aspectRatio === 'auto'

  if (isFill) {
    return (
      <div className={`overflow-hidden w-full h-full min-h-0 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={normalizedSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      </div>
    )
  }

  return (
    <div className={isAuto ? `w-full ${className}` : `overflow-hidden bg-gray-100 w-full h-full min-h-0 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={normalizedSrc}
        alt={alt}
        className={isAuto ? 'w-full h-auto object-contain' : 'w-full h-full object-cover'}
        onError={() => setError(true)}
      />
    </div>
  )
}
