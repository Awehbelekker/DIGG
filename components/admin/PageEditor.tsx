'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Page } from '@/lib/types/database'

interface PageEditorProps {
  page?: Page
}

export default function PageEditor({ page }: PageEditorProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    slug: page?.slug || '',
    title: page?.title || '',
    meta_title: page?.meta_title || '',
    meta_description: page?.meta_description || '',
    published: page?.published ?? true,
    content: page?.content || { sections: [] }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (page) {
        // Update existing page
        const { error } = await supabase
          .from('pages')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', page.id)

        if (error) throw error
      } else {
        // Create new page
        const { error } = await supabase
          .from('pages')
          .insert([formData])

        if (error) throw error
      }

      router.push('/admin/pages')
      router.refresh()
    } catch (error: any) {
      console.error('Error saving page:', error)
      alert('Error saving page: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug *
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
            placeholder="home, about, contact"
          />
          <p className="mt-1 text-sm text-gray-500">URL-friendly identifier (e.g., "about", "contact")</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Title
          </label>
          <input
            type="text"
            value={formData.meta_title || ''}
            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
            placeholder="SEO title (optional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            value={formData.meta_description || ''}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
            placeholder="SEO description (optional)"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="h-4 w-4 text-[#F7941D] focus:ring-[#F7941D] border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
            Published
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content (JSON)
          </label>
          <textarea
            value={JSON.stringify(formData.content, null, 2)}
            onChange={(e) => {
              try {
                setFormData({ ...formData, content: JSON.parse(e.target.value) })
              } catch (err) {
                // Invalid JSON, don't update
              }
            }}
            rows={20}
            className="w-full px-4 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            Page content as JSON. Structure: {"{"} "sections": [] {"}"}
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#F7941D] text-white rounded-md font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : page ? 'Update Page' : 'Create Page'}
          </button>
        </div>
      </div>
    </form>
  )
}
