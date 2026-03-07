'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { markSubmissionRead, markSubmissionArchived } from '@/app/admin/(dashboard)/forms/actions'
import { showToast } from '@/components/admin/Toast'
import type { FormSubmission } from '@/lib/types/database'

export default function FormSubmissionActions({ submission }: { submission: FormSubmission }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'read' | 'archive' | null>(null)
  const read = submission.read === true
  const archived = submission.archived === true

  useEffect(() => {
    if (!read) {
      markSubmissionRead(submission.id, true).then(() => router.refresh())
    }
  }, [submission.id, read, router])

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
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleRead}
        disabled={!!loading}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        {loading === 'read' ? '…' : read ? 'Mark unread' : 'Mark read'}
      </button>
      <button
        type="button"
        onClick={handleArchive}
        disabled={!!loading}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        {loading === 'archive' ? '…' : archived ? 'Unarchive' : 'Archive'}
      </button>
    </div>
  )
}
