'use client'

import AdminSafeLink from '@/components/admin/AdminSafeLink'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { showToast } from '@/components/admin/Toast'
import { deletePage, duplicatePage } from '@/app/admin/(dashboard)/pages/actions'

type PageRowActionsProps = {
  page: { id: string; title: string; slug: string }
}

export default function PageRowActions({ page }: PageRowActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<'delete' | 'duplicate' | null>(null)

  const handleDelete = async () => {
    if (!confirm(`Delete "${page.title}"? This cannot be undone.`)) return
    setLoading('delete')
    try {
      await deletePage(page.id)
      router.refresh()
    } catch (e) {
      showToast('Error: ' + (e instanceof Error ? e.message : 'Failed to delete'), 'error')
    } finally {
      setLoading(null)
    }
  }

  const handleDuplicate = async () => {
    setLoading('duplicate')
    try {
      await duplicatePage(page.id)
      router.refresh()
    } catch (e) {
      showToast('Error: ' + (e instanceof Error ? e.message : 'Failed to duplicate'), 'error')
    } finally {
      setLoading(null)
    }
  }

  return (
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="flex items-center justify-end gap-2">
        <AdminSafeLink
          href={`/admin/pages/${page.id}`}
          className="text-[#F7941D] hover:text-[#e6850a]"
        >
          Edit
        </AdminSafeLink>
        <AdminSafeLink
          href={`/preview/${page.id}`}
          openInNewTab
          className="text-gray-600 hover:text-[#1B2A6B]"
          title="Preview (works for drafts too)"
        >
          Preview
        </AdminSafeLink>
        <AdminSafeLink
          href={`/${page.slug}`}
          openInNewTab
          className="text-gray-500 hover:text-[#1B2A6B] text-xs"
          title="View live (published only)"
        >
          View live
        </AdminSafeLink>
        <button
          type="button"
          onClick={handleDuplicate}
          disabled={!!loading}
          className="text-gray-600 hover:text-[#1B2A6B] disabled:opacity-50"
        >
          {loading === 'duplicate' ? '…' : 'Duplicate'}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={!!loading}
          className="text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          {loading === 'delete' ? '…' : 'Delete'}
        </button>
      </div>
    </td>
  )
}
