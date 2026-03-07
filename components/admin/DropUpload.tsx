'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { showToast } from '@/components/admin/Toast'

type DropUploadProps = {
  value: string
  onChange: (url: string) => void
  bucket?: string
  folder?: string
  label?: string
  compact?: boolean
}

export default function DropUpload({
  value,
  onChange,
  bucket = 'hero-images',
  folder = 'uploads',
  label = 'Image',
  compact = false,
}: DropUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview) }
  }, [preview])

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Max file size is 10 MB', 'error')
      return
    }

    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const ext = file.name.split('.').pop()
      const path = `${folder}/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from(bucket).upload(path, file)
      if (error) throw error
      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      onChange(data.publicUrl)
      showToast('Image uploaded!')
    } catch (err) {
      showToast('Upload failed: ' + (err instanceof Error ? err.message : String(err)), 'error')
    } finally {
      setUploading(false)
    }
  }, [bucket, folder, onChange, preview, supabase])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }, [upload])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) upload(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  const displayUrl = preview || (value && value.trim() ? value : null)

  if (compact) {
    return (
      <div className="space-y-2">
        <div
          className={`relative flex items-center gap-3 border-2 border-dashed rounded-xl p-3 transition-colors cursor-pointer ${
            dragging ? 'border-[#F7941D] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          {displayUrl ? (
            <img src={displayUrl} alt={label} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-600 truncate">
              {uploading ? 'Uploading...' : displayUrl ? 'Drop or click to replace' : 'Drop image or click to browse'}
            </p>
          </div>
          {displayUrl && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(''); setPreview(null) }}
              className="flex-shrink-0 w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs hover:bg-red-200"
              aria-label="Remove"
            >
              &times;
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="or paste URL"
          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-500 focus:ring-1 focus:ring-[#F7941D] focus:border-transparent"
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div
        className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer overflow-hidden ${
          dragging ? 'border-[#F7941D] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        {displayUrl ? (
          <div className="relative">
            <img src={displayUrl} alt={label} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 flex items-center justify-center transition-colors group">
              <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? 'Uploading...' : 'Click or drop to replace'}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(''); setPreview(null) }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-black/80"
              aria-label="Remove"
            >
              &times;
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-500 text-center">
              {uploading ? 'Uploading...' : 'Drop image here or click to browse'}
            </p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP up to 10 MB</p>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="or paste image URL"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
      />
    </div>
  )
}
