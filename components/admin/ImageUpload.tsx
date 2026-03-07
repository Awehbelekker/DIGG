'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { showToast } from '@/components/admin/Toast'

interface ImageUploadProps {
  onUpload: () => void
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [folder, setFolder] = useState<'hero' | 'logo' | 'team' | 'portfolio'>('hero')
  const [altText, setAltText] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [lastUploaded, setLastUploaded] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be less than 10MB', 'error')
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))
    setLastUploaded(null)
  }

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0]
    if (!file) {
      showToast('Select a file first', 'error')
      return
    }

    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`
      const bucketName = folder === 'hero' ? 'hero-images' : folder === 'logo' ? 'logos' : folder === 'team' ? 'team-photos' : 'portfolio'

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

      const { error: dbError } = await supabase
        .from('images')
        .insert({
          filename: file.name,
          url: urlData.publicUrl,
          folder,
          alt_text: altText || null
        })

      if (dbError) throw dbError

      setLastUploaded(urlData.publicUrl)
      setAltText('')
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
      if (fileRef.current) fileRef.current.value = ''
      onUpload()
      showToast('Image uploaded successfully!')
    } catch (err) {
      console.error('Error uploading image:', err)
      showToast('Error uploading image: ' + (err instanceof Error ? err.message : String(err)), 'error')
    } finally {
      setUploading(false)
    }
  }

  const clearPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setLastUploaded(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const thumbnailSrc = previewUrl || lastUploaded

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-[#1B2A6B] mb-4">Upload Image</h2>
      <div className="flex gap-6">
        {/* Left: thumbnail preview */}
        <div className="flex-shrink-0 w-40 h-40 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden relative">
          {thumbnailSrc ? (
            <>
              <img src={thumbnailSrc} alt="Preview" className="w-full h-full object-cover" />
              {lastUploaded && (
                <span className="absolute bottom-1 left-1 right-1 text-[10px] bg-green-600 text-white text-center rounded py-0.5">
                  Uploaded
                </span>
              )}
              <button
                type="button"
                onClick={clearPreview}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black/80"
                aria-label="Clear"
              >
                &times;
              </button>
            </>
          ) : (
            <span className="text-xs text-gray-400 text-center px-2">No image selected</span>
          )}
        </div>

        {/* Right: form fields */}
        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Folder</label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value as 'hero' | 'logo' | 'team' | 'portfolio')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
            >
              <option value="hero">Hero Images</option>
              <option value="logo">Logos</option>
              <option value="team">Team Photos</option>
              <option value="portfolio">Portfolio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text (optional)</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image File</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1B2A6B] file:text-white file:font-medium file:cursor-pointer hover:file:bg-[#142050] disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-gray-400">Max 10 MB &middot; JPG, PNG, WebP</p>
          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading || !previewUrl}
            className="w-full px-4 py-2.5 bg-[#F7941D] text-white rounded-lg font-semibold text-sm hover:bg-[#e6850a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>
    </div>
  )
}
