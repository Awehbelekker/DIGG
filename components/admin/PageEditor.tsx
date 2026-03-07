'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { showToast } from '@/components/admin/Toast'
import { Page } from '@/lib/types/database'
import { getRecommendedStartingSections } from '@/lib/section-config'
import PageBuilder from '@/components/admin/PageBuilder'
import LivePreview from '@/components/admin/LivePreview'

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
    meta_og_image: page?.meta_og_image || '',
    published: page?.published ?? true,
    content: page?.content || { sections: getRecommendedStartingSections() }
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

      showToast('Page saved!')
      router.push('/admin/pages')
      router.refresh()
    } catch (err) {
      console.error('Error saving page:', err)
      showToast('Error saving page: ' + (err instanceof Error ? err.message : String(err)), 'error')
    } finally {
      setLoading(false)
    }
  }

  const previewSlug = formData.slug?.trim()

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr,minmax(320px,40%)] gap-6">
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
          <p className="mt-1 text-sm text-gray-500">URL-friendly identifier (e.g., &quot;about&quot;, &quot;contact&quot;)</p>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OG Image URL
          </label>
          <input
            type="url"
            value={formData.meta_og_image || ''}
            onChange={(e) => setFormData({ ...formData, meta_og_image: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
            placeholder="https://… (optional, for social sharing)"
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
            Page content
          </label>
          <p className="mb-3 text-sm text-gray-500">
            Add sections and edit them below. Reorder with the arrows; use Edit to change content.
          </p>
          <PageBuilder
            sections={formData.content.sections}
            onChange={(sections) => setFormData({ ...formData, content: { sections } })}
          />
        </div>

        <div className="flex justify-end gap-3 flex-wrap">
          {page && (
            <a
              href={`/preview/${page.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border border-amber-300 rounded-md text-amber-800 bg-amber-50 hover:bg-amber-100"
            >
              Preview draft
            </a>
          )}
          {previewSlug && (
            <a
              href={`/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Open in new tab
            </a>
          )}
          <button
            type="button"
            onClick={() => router.push('/admin/pages')}
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

      {/* Live preview pane — click on text or images to edit inline */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
        <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Live preview</span>
          {previewSlug && (
            <span className="text-xs text-gray-500 truncate max-w-[180px]">/{previewSlug}</span>
          )}
        </div>
        <div className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
          <LivePreview
            sections={formData.content.sections}
            slug={previewSlug}
            onUpdateSection={(index, data) => {
              const next = [...formData.content.sections]
              next[index] = { ...next[index], data }
              setFormData({ ...formData, content: { sections: next } })
            }}
          />
        </div>
      </div>
    </div>
  )
}
