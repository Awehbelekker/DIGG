'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { showToast } from '@/components/admin/Toast'
import type { Insight } from '@/lib/types/database'
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
    body: insight?.body ?? '',
    published: insight?.published ?? false,
  })

  const savedSnapshot = useMemo(
    () => ({
      slug: insight?.slug ?? '',
      title: insight?.title ?? '',
      body: insight?.body ?? '',
      published: insight?.published ?? false,
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
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', insight.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('insights').insert([formData])
        if (error) throw error
      }
      showToast('Insight saved!')
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
            placeholder="url-friendly-name"
          />
          <p className="mt-1 text-xs text-gray-500">Public URL: /insights/{formData.slug || '…'}</p>
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">Body</label>
          <textarea
            id="body"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            rows={12}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
            placeholder="Write your insight or article…"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4 text-[#F7941D] focus:ring-[#F7941D] border-gray-300 rounded"
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
          className="px-6 py-2 bg-[#F7941D] text-white rounded-md font-semibold hover:bg-[#e6850a] disabled:opacity-50"
        >
          {loading ? 'Saving…' : insight ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
