'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Image } from '@/lib/types/database'

type MediaLibraryModalProps = {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
  title?: string
}

const FOLDERS = ['all', 'hero', 'logo', 'team', 'portfolio'] as const

export default function MediaLibraryModal({
  open,
  onClose,
  onSelect,
  title = 'Choose from library',
}: MediaLibraryModalProps) {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(false)
  const [folder, setFolder] = useState<(typeof FOLDERS)[number]>('all')
  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('images').select('*').order('created_at', { ascending: false })
    if (folder !== 'all') query = query.eq('folder', folder)
    const { data, error } = await query
    if (error) console.error(error)
    setImages((data as Image[]) ?? [])
    setLoading(false)
  }, [folder, supabase])

  useEffect(() => {
    if (open) load()
  }, [open, load])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-[#152232]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap gap-2">
          {FOLDERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFolder(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                folder === f ? 'bg-[#B56244] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <p className="text-sm text-gray-500 text-center py-8">Loading images…</p>
          ) : images.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No images yet. Upload via Admin → Images or drag into any upload field.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => {
                    onSelect(img.url)
                    onClose()
                  }}
                  className="group text-left rounded-xl border border-gray-200 overflow-hidden hover:border-[#B56244] hover:ring-2 hover:ring-[#B56244]/30 transition-all"
                >
                  <img
                    src={img.url}
                    alt={img.alt_text || img.filename}
                    className="w-full h-24 object-cover bg-gray-100"
                  />
                  <p className="px-2 py-1.5 text-[11px] text-gray-600 truncate">{img.filename}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
