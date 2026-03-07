'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { showToast } from '@/components/admin/Toast'
import { markSubmissionRead, markSubmissionArchived } from '@/app/admin/(dashboard)/forms/actions'
import type { FormSubmission } from '@/lib/types/database'

export default function FormSubmissionRow({ submission }: { submission: FormSubmission }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'read' | 'archive' | null>(null)
  const read = submission.read === true
  const archived = submission.archived === true

  const handleRead = async () => {
    setLoading('read')
    try {
      await markSubmissionRead(submission.id, !read)
      router.refresh()
    } catch (e) {
      showToast('Error: ' + (e instanceof Error ? e.message : 'Failed'), 'error')
    } finally {
      setLoading(null)
    }
  }

  const handleArchive = async () => {
    setLoading('archive')
    try {
      await markSubmissionArchived(submission.id, !archived)
      router.refresh()
    } catch (e) {
      showToast('Error: ' + (e instanceof Error ? e.message : 'Failed'), 'error')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className={`p-6 hover:bg-gray-50 ${archived ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
        <div>
          <div className="flex items-center flex-wrap gap-2">
            <Link
              href={`/admin/forms/${submission.id}`}
              className={`text-lg font-semibold hover:text-[#F7941D] transition-colors ${!read ? 'text-[#1B2A6B]' : 'text-gray-700'}`}
            >
              {String((submission.data as Record<string, unknown>).name || 'Unknown')}
            </Link>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              submission.form_type === 'contact' ? 'bg-[#5BC8E8] text-[#1B2A6B]' : 'bg-[#F7941D] text-white'
            }`}>
              {submission.form_type === 'contact' ? 'Contact' : 'Agent'}
            </span>
            {read && <span className="text-xs text-gray-500">Read</span>}
            {archived && <span className="text-xs text-gray-500">Archived</span>}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(submission.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRead}
            disabled={!!loading}
            className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            {loading === 'read' ? '…' : read ? 'Unread' : 'Mark read'}
          </button>
          <button
            type="button"
            onClick={handleArchive}
            disabled={!!loading}
            className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            {loading === 'archive' ? '…' : archived ? 'Unarchive' : 'Archive'}
          </button>
          <Link
            href={`/admin/forms/${submission.id}`}
            className="px-3 py-1.5 text-sm font-medium text-[#F7941D] hover:bg-[#F7941D]/10 rounded-lg transition-colors"
          >
            View
          </Link>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {Object.entries(submission.data).map(([key, value]: [string, unknown]) => (
          <div key={key} className="text-sm">
            <span className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
            <span className="text-gray-600">{String(value || 'N/A')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
