'use client'

import { useEffect, useRef } from 'react'
import DropUpload from './DropUpload'

type SettingsDrawerProps = {
  open: boolean
  onClose: () => void
  slug: string
  onSlugChange: (slug: string) => void
  metaTitle: string
  onMetaTitleChange: (v: string) => void
  metaDescription: string
  onMetaDescriptionChange: (v: string) => void
  metaOgImage: string
  onMetaOgImageChange: (v: string) => void
}

const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent'

export default function SettingsDrawer({
  open,
  onClose,
  slug,
  onSlugChange,
  metaTitle,
  onMetaTitleChange,
  metaDescription,
  onMetaDescriptionChange,
  metaOgImage,
  onMetaOgImageChange,
}: SettingsDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/20 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 z-[61] h-full w-[380px] max-w-full bg-white shadow-2xl transform transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-[#1B2A6B]">Page Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 65px)' }}>
          <div>
            <label className={labelClass}>URL Slug *</label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-400">/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                className={inputClass}
                placeholder="about"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">URL-friendly identifier</p>
          </div>

          <div>
            <label className={labelClass}>SEO Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => onMetaTitleChange(e.target.value)}
              className={inputClass}
              placeholder="Page title for search engines"
            />
          </div>

          <div>
            <label className={labelClass}>SEO Description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => onMetaDescriptionChange(e.target.value)}
              rows={3}
              className={inputClass}
              placeholder="Brief description for search results"
            />
            <p className="mt-1 text-xs text-gray-400">{metaDescription.length}/160 characters</p>
          </div>

          <div>
            <label className={labelClass}>Social Share Image</label>
            <DropUpload
              value={metaOgImage}
              onChange={onMetaOgImageChange}
              bucket="hero-images"
              folder="og"
              label="OG Image"
            />
          </div>
        </div>
      </div>
    </>
  )
}
