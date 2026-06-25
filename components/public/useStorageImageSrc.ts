'use client'

import { useEffect, useMemo, useState } from 'react'
import { storageUrlCandidates } from '@/lib/image-storage'

export function useStorageImageSrc(url: string | null | undefined) {
  const candidates = useMemo(() => storageUrlCandidates(url), [url])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [url])

  const src = candidates[index] ?? ''
  const exhausted = candidates.length === 0 || index >= candidates.length

  return {
    src,
    showImage: !exhausted,
    onError: () => setIndex((current) => current + 1),
  }
}
