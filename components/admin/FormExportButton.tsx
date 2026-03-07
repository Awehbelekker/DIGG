'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function buildCSV(submissions: any[]): string {
  if (submissions.length === 0) return ''
  const allKeys = new Set<string>()
  submissions.forEach((s) => Object.keys(s.data || {}).forEach((k) => allKeys.add(k)))
  const dataKeys = Array.from(allKeys).sort()
  const headers = ['Date', 'Type', ...dataKeys]
  const rows = submissions.map((s) => {
    const data = s.data || {}
    const values = [
      new Date(s.created_at).toISOString(),
      s.form_type,
      ...dataKeys.map((k) => String(data[k] ?? '').replace(/"/g, '""'))
    ]
    return values.map((v) => `"${v}"`).join(',')
  })
  return [headers.map((h) => `"${h}"`).join(','), ...rows].join('\r\n')
}

export default function FormExportButton() {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      const csv = buildCSV(data || [])
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `form-submissions-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      alert('Export failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      {loading ? 'Exporting…' : 'Export CSV'}
    </button>
  )
}
