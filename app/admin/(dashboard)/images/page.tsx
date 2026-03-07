'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/admin/ImageUpload'
import AdminPageHeading from '@/components/admin/AdminPageHeading'

export default function AdminImagesPage() {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    loadImages()
  }, [selectedFolder])

  const loadImages = async () => {
    setLoading(true)
    let query = supabase.from('images').select('*').order('created_at', { ascending: false })
    
    if (selectedFolder !== 'all') {
      query = query.eq('folder', selectedFolder)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error loading images:', error)
    } else {
      setImages(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting image: ' + error.message)
    } else {
      loadImages()
    }
  }

  const folders = ['all', 'hero', 'logo', 'team', 'portfolio']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdminPageHeading className="mb-8" subtitle="Upload and manage hero, logo, team, and portfolio images.">Image Management</AdminPageHeading>

      {/* Folder Filter */}
      <div className="mb-6 flex space-x-2">
        {folders.map((folder) => (
          <button
            key={folder}
            onClick={() => setSelectedFolder(folder)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedFolder === folder
                ? 'bg-[#F7941D] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {folder.charAt(0).toUpperCase() + folder.slice(1)}
          </button>
        ))}
      </div>

      {/* Upload Component */}
      <div className="mb-8">
        <ImageUpload onUpload={loadImages} />
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading images...</p>
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={image.url}
                alt={image.alt_text || image.filename}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm font-medium text-gray-900 truncate">{image.filename}</p>
                <p className="text-xs text-gray-500 mt-1">{image.folder}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-0 text-center text-xs bg-[#5BC8E8] text-[#1B2A6B] px-3 py-1.5 rounded-lg hover:bg-[#4ab8d8] transition-colors"
                  >
                    View
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(image.url)
                      alert('URL copied to clipboard.')
                    }}
                    className="flex-1 min-w-0 text-center text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="flex-1 min-w-0 text-center text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">No images found</p>
        </div>
      )}
    </div>
  )
}
