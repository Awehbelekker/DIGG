'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteInsight } from '@/app/admin/(dashboard)/insights/actions'
import type { Insight } from '@/lib/types/database'

export default function InsightRowActions({ insight }: { insight: Insight }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete "${insight.title}"?`)) return
    setLoading(true)
    try {
      await deleteInsight(insight.id)
      router.refresh()
    } catch (e) {
      alert('Error: ' + (e instanceof Error ? e.message : 'Failed to delete'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="flex items-center justify-end gap-2">
        <Link href={`/admin/insights/${insight.id}`} className="text-[#F7941D] hover:text-[#e6850a]">
          Edit
        </Link>
        <a
          href={insight.published ? `/insights/${insight.slug}` : `/preview/insight/${insight.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-[#1B2A6B]"
          title={insight.published ? 'View on site' : 'Preview draft'}
        >
          {insight.published ? 'View' : 'Preview'}
        </a>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          {loading ? '…' : 'Delete'}
        </button>
      </div>
    </td>
  )
}
