'use client'

import { useState } from 'react'
import { ensureStorageBuckets } from '@/app/admin/(dashboard)/images/actions'
import { showToast } from '@/components/admin/Toast'

export default function StorageSetupBanner() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleEnsure() {
    setLoading(true)
    try {
      const result = await ensureStorageBuckets()
      showToast(result.message, result.ok ? 'success' : 'error')
      if (result.ok) setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (done) return null

  return (
    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p className="font-medium">Images showing &quot;Bucket not found&quot;?</p>
      <p className="mt-1 text-amber-800">
        Create storage buckets here, or paste{' '}
        <code className="rounded bg-amber-100 px-1">supabase/fix_storage_buckets.sql</code> into Supabase → SQL
        Editor for full setup (includes public read policies).
      </p>
      <button
        type="button"
        onClick={handleEnsure}
        disabled={loading}
        className="mt-3 rounded-md bg-amber-700 px-3 py-1.5 text-white text-sm font-medium hover:bg-amber-800 disabled:opacity-50"
      >
        {loading ? 'Creating buckets…' : 'Create storage buckets'}
      </button>
    </div>
  )
}
