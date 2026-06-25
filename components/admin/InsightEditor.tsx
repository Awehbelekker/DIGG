'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { showToast } from '@/components/admin/Toast'
import type { Insight } from '@/lib/types/database'
import DropUpload from '@/components/admin/DropUpload'
import AdminSafeLink from '@/components/admin/AdminSafeLink'
import { useRegisterAdminNavUnsaved } from '@/components/admin/AdminUnsavedProvider'
import { useUnsavedChangesAlert } from '@/lib/hooks/useUnsavedChangesAlert'

export default function InsightEditor({ insight }: { insight?: Insight | null }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    slug: insight?.slug ?? '',
    title: insight?.title ?? '',
    excerpt: insight?.excerpt ?? '',
    cover_image_url: insight?.cover_image_url ?? '',
    body: insight?.body ?? '',
    published: insight?.published ?? false,
    content_type: (insight?.content_type ?? 'insight') as 'project' | 'insight',
    project_status: (insight?.project_status ?? '') as '' | 'complete' | 'on_site' | 'starting_soon',
  })

  const savedSnapshot = useMemo(
    () => ({
      slug: insight?.slug ?? '',
      title: insight?.title ?? '',
      excerpt: insight?.excerpt ?? '',
      cover_image_url: insight?.cover_image_url ?? '',
      body: insight?.body ?? '',
      published: insight?.published ?? false,
      content_type: (insight?.content_type ?? 'insight') as 'project' | 'insight',
      project_status: (insight?.project_status ?? '') as '' | 'complete' | 'on_site' | 'starting_soon',
    }),
    [insight]
  )

  const dirty = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(savedSnapshot),
    [formData, savedSnapshot]
  )

  useRegisterAdminNavUnsaved(dirty)
  useUnsavedChangesAlert(dirty)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (insight) {
        const { error } = await supabase
          .from('insights')
          .update({
            slug: formData.slug,
            title: formData.title,
            excerpt: formData.excerpt.trim() || null,
            cover_image_url: formData.cover_image_url.trim() || null,
            body: formData.body,
            published: formData.published,
            content_type: formData.content_type,
            project_status: formData.content_type === 'project' && formData.project_status
              ? formData.project_status
              : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', insight.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('insights').insert([
          {
            slug: formData.slug,
            title: formData.title,
            excerpt: formData.excerpt.trim() || null,
            cover_image_url: formData.cover_image_url.trim() || null,
            body: formData.body,
            published: formData.published,
            content_type: formData.content_type,
            project_status: formData.content_type === 'project' && formData.project_status
              ? formData.project_status
              : null,
          },
        ])
        if (error) throw error
      }
      showToast('Work item saved!')
      router.push('/admin/insights')
      router.refresh()
    } catch (err) {
      console.error(err)
      showToast('Error saving: ' + (err instanceof Error ? err.message : String(err)), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-3xl">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B56244] focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input
            id="slug"
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B56244] focus:border-transparent"
            placeholder="url-friendly-name"
          />
          <p className="mt-1 text-xs text-gray-500">Public URL: /insights/{formData.slug || '…'}</p>
        </div>
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">Card excerpt</label>
          <textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B56244] focus:border-transparent"
            placeholder="Short summary shown on work cards (2–3 lines)"
          />
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-1">Cover image</span>
          <DropUpload
            compact
            value={formData.cover_image_url}
            onChange={(url) => setFormData({ ...formData, cover_image_url: url })}
            folder="portfolio"
            label="Work card cover"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="content_type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              id="content_type"
              value={formData.content_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  content_type: e.target.value as 'project' | 'insight',
                  project_status: e.target.value === 'insight' ? '' : formData.project_status,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B56244]"
            >
              <option value="insight">Insight (article)</option>
              <option value="project">Project (writeup)</option>
            </select>
          </div>
          {formData.content_type === 'project' && (
            <div>
              <label htmlFor="project_status" className="block text-sm font-medium text-gray-700 mb-1">Project status</label>
              <select
                id="project_status"
                value={formData.project_status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    project_status: e.target.value as typeof formData.project_status,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B56244]"
              >
                <option value="">—</option>
                <option value="complete">Complete</option>
                <option value="on_site">On site</option>
                <option value="starting_soon">Starting soon</option>
              </select>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">Body</label>
          <textarea
            id="body"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            rows={12}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B56244] focus:border-transparent"
            placeholder="Write your insight or article…"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4 text-[#B56244] focus:ring-[#B56244] border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Published</span>
          </label>
          {insight && (
            <AdminSafeLink
              href={`/preview/insight/${insight.id}`}
              openInNewTab
              className="text-sm text-amber-700 hover:text-amber-800"
            >
              Preview draft
            </AdminSafeLink>
          )}
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <AdminSafeLink
          href="/admin/insights"
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </AdminSafeLink>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[#B56244] text-white rounded-md font-semibold hover:bg-[#9A4F35] disabled:opacity-50"
        >
          {loading ? 'Saving…' : insight ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
