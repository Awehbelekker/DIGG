'use client'

import { useState } from 'react'
import { normalizeStoragePublicUrl } from '@/lib/image-storage'

type TeamAvatarProps = {
  name: string
  photoUrl?: string
  initials: string
}

export default function TeamAvatar({ name, photoUrl, initials }: TeamAvatarProps) {
  const [failed, setFailed] = useState(false)
  const src = normalizeStoragePublicUrl(photoUrl)
  const showPhoto = src && !failed

  return (
    <div className="relative mx-auto mb-5 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32">
      <div className="relative w-full h-full rounded-full overflow-hidden border border-[var(--color-greige)]/80 bg-[var(--color-lead)]">
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {initials}
          </div>
        )}
      </div>
    </div>
  )
}
