'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { showToast } from '@/components/admin/Toast'

type InlineImageEditProps = {
  src: string | null | undefined
  alt?: string
  className?: string
  wrapperClassName?: string
  onChange: (url: string) => void
  bucket?: string
  folder?: string
}

export default function InlineImageEdit({
  src,
  alt = 'Image',
  className = '',
  wrapperClassName = '',
  onChange,
  bucket = 'hero-images',
  folder = 'uploads',
}: InlineImageEditProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
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
      showToast('Image updated!')
    } catch (err) {
      showToast('Upload failed: ' + (err instanceof Error ? err.message : String(err)), 'error')
    } finally {
      setUploading(false)
    }
  }, [bucket, folder, onChange, preview, supabase])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) upload(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }, [upload])

  const displayUrl = preview || (src && src.trim() ? src : null)

  return (
    <div
      className={`inline-image-edit group relative cursor-pointer ${wrapperClassName}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); fileRef.current?.click() }}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
      onDrop={handleDrop}
    >
      {displayUrl ? (
        <img
          src={displayUrl}
          alt={alt}
          className={className}
          onError={() => {}}
        />
      ) : (
        <div className={`bg-gray-100 flex items-center justify-center ${className}`} style={{ minHeight: 80 }}>
          <span className="text-gray-400 text-sm">No image</span>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-200 rounded-inherit">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1 pointer-events-none">
          <svg className="w-8 h-8 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-white text-xs font-semibold drop-shadow">
            {uploading ? 'Uploading…' : 'Click or drop to replace'}
          </span>
        </div>
      </div>
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  )
}
