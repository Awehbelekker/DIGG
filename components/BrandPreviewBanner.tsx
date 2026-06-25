'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BRAND_PREVIEW_STORAGE_KEY,
  brandColorsToCssProperties,
  parseBrandColors,
  type BrandColors,
} from '@/lib/brand-colors'

export default function BrandPreviewBanner() {
  const [preview, setPreview] = useState<BrandColors | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BRAND_PREVIEW_STORAGE_KEY)
      if (!raw) return
      const parsed = parseBrandColors(JSON.parse(raw))
      setPreview(parsed)
      const vars = brandColorsToCssProperties(parsed)
      const el = document.documentElement
      for (const [key, value] of Object.entries(vars)) {
        if (typeof value === 'string') el.style.setProperty(key, value)
      }
    } catch {
      sessionStorage.removeItem(BRAND_PREVIEW_STORAGE_KEY)
    }
  }, [])

  if (!preview) return null

  return (
    <div className="sticky top-0 z-[100] bg-[var(--color-coral)] text-white px-4 py-2.5 text-center text-sm shadow-md">
      <span className="font-semibold">Brand preview</span>
      <span className="opacity-90"> — colours are not published yet. </span>
      <Link href="/admin/settings" className="underline font-medium hover:opacity-90">
        Back to Settings
      </Link>
      <button
        type="button"
        className="ml-3 underline opacity-90 hover:opacity-100"
        onClick={() => {
          sessionStorage.removeItem(BRAND_PREVIEW_STORAGE_KEY)
          window.location.reload()
        }}
      >
        Exit preview
      </button>
    </div>
  )
}
