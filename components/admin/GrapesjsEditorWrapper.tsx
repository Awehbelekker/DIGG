'use client'

import dynamic from 'next/dynamic'
import type { Page } from '@/lib/types/database'

const GrapesjsEditor = dynamic(() => import('./GrapesjsEditor'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-[#1B2A6B] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600 text-sm">Loading visual editor...</p>
      </div>
    </div>
  ),
})

export default function GrapesjsEditorWrapper({ page }: { page?: Page }) {
  return <GrapesjsEditor page={page} />
}
