'use client'

import { useState } from 'react'
import type { EditorType } from '@/lib/types/database'
import PageEditor from './PageEditor'
import GrapesjsEditorWrapper from './GrapesjsEditorWrapper'

export default function EditorPicker() {
  const [choice, setChoice] = useState<EditorType | null>(null)

  if (choice === 'grapesjs') {
    return <GrapesjsEditorWrapper />
  }

  if (choice === 'sections') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageEditor />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-[#1B2A6B]/5 to-[#5BC8E8]/5">
      <div className="max-w-3xl w-full mx-4">
        <h1 className="text-3xl font-bold text-[#1B2A6B] text-center mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Create a New Page
        </h1>
        <p className="text-gray-500 text-center mb-10">Choose your editing experience</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GrapesJS Visual Builder */}
          <button
            onClick={() => setChoice('grapesjs')}
            className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-[#F7941D] p-8 text-left transition-all hover:shadow-xl"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-[#F7941D] to-[#e6850a] rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="3" y1="9" x2="21" y2="9" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1B2A6B] mb-2">Visual Builder</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Full drag-and-drop page builder powered by GrapesJS. Design freely with pixel-level control,
              style manager, layer manager, and component editing.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Drag & Drop', 'Style Editor', 'Responsive', 'HTML Import'].map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-orange-50 text-[#F7941D] text-xs rounded-full font-medium">{tag}</span>
              ))}
            </div>
            <div className="mt-5 text-[#F7941D] font-semibold text-sm group-hover:translate-x-1 transition-transform">
              Start building &rarr;
            </div>
          </button>

          {/* Section-based Builder */}
          <button
            onClick={() => setChoice('sections')}
            className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-[#5BC8E8] p-8 text-left transition-all hover:shadow-xl"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-[#5BC8E8] to-[#1B2A6B] rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="5" rx="1" />
                <rect x="3" y="10" width="18" height="5" rx="1" />
                <rect x="3" y="17" width="18" height="5" rx="1" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1B2A6B] mb-2">Section Builder</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Pre-designed section blocks with inline editing. Simpler workflow with templates,
              drag-to-reorder, and one-click section insertion.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Templates', 'Inline Edit', 'Sections', 'Quick Start'].map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-blue-50 text-[#1B2A6B] text-xs rounded-full font-medium">{tag}</span>
              ))}
            </div>
            <div className="mt-5 text-[#5BC8E8] font-semibold text-sm group-hover:translate-x-1 transition-transform">
              Start building &rarr;
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
