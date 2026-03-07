'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ImageUploadProps {
  onUpload: () => void
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [folder, setFolder] = useState<'hero' | 'logo' | 'team' | 'portfolio'>('hero')
  const [altText, setAltText] = useState('')
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setUploading(true)

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(folder === 'hero' ? 'hero-images' : folder === 'logo' ? 'logos' : folder === 'team' ? 'team-photos' : 'portfolio')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(folder === 'hero' ? 'hero-images' : folder === 'logo' ? 'logos' : folder === 'team' ? 'team-photos' : 'portfolio')
        .getPublicUrl(filePath)

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('images')
        .insert({
          filename: file.name,
          url: urlData.publicUrl,
          folder,
          alt_text: altText || null
        })

      if (dbError) throw dbError

      // Reset form
      setAltText('')
      e.target.value = ''
      onUpload()
      alert('Image uploaded successfully!')
    } catch (err) {
      console.error('Error uploading image:', err)
      alert('Error uploading image: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-[#1B2A6B] mb-4">Upload Image</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Folder
          </label>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value as 'hero' | 'logo' | 'team' | 'portfolio')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
          >
            <option value="hero">Hero Images</option>
            <option value="logo">Logos</option>
            <option value="team">Team Photos</option>
            <option value="portfolio">Portfolio</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alt Text (optional)
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe the image for accessibility"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image File
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent disabled:opacity-50"
          />
          <p className="mt-1 text-sm text-gray-500">Max file size: 10MB</p>
        </div>

        {uploading && (
          <div className="text-center py-4">
            <p className="text-[#F7941D]">Uploading...</p>
          </div>
        )}
      </div>
    </div>
  )
}
