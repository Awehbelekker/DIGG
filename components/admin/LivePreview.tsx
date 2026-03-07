'use client'

import { useState } from 'react'
import type { PageSection } from '@/lib/types/database'
import SectionRenderer from '@/components/public/SectionRenderer'
import EditableSectionRenderer from './EditableSectionRenderer'

type LivePreviewProps = {
  sections: PageSection[]
  slug?: string
  onUpdateSection?: (index: number, data: Record<string, unknown>) => void
}

export default function LivePreview({ sections, slug, onUpdateSection }: LivePreviewProps) {
  const [editMode, setEditMode] = useState(!!onUpdateSection)

  if (sections.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] text-sm text-gray-400 px-4 text-center">
        Add sections on the left to see a live preview here.
      </div>
    )
  }

  const canEdit = !!onUpdateSection

  return (
    <div className="bg-white min-h-[300px]">
      {slug && (
        <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 flex items-center justify-between">
          <span className="text-xs text-amber-700">
            {editMode ? '✏️ Click any text or image to edit inline' : 'Live preview — unsaved changes shown in real-time'}
          </span>
          {canEdit && (
            <button
              type="button"
              onClick={() => setEditMode(!editMode)}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                editMode
                  ? 'bg-[#F7941D] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {editMode ? 'Editing ON' : 'Edit mode'}
            </button>
          )}
        </div>
      )}
      <div
        className="origin-top-left"
        style={{
          transform: `scale(${editMode ? 0.65 : 0.55})`,
          transformOrigin: 'top left',
          width: `calc(100% / ${editMode ? 0.65 : 0.55})`,
        }}
      >
        {sections.map((section, index) =>
          editMode && onUpdateSection ? (
            <div key={`${section.type}-${index}`} className="relative editable-section-wrapper">
              <EditableSectionRenderer
                section={section}
                onChange={(data) => onUpdateSection(index, data)}
              />
              <div className="absolute top-2 left-2 z-20 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded pointer-events-none opacity-0 hover-parent-opacity">
                {section.type}
              </div>
            </div>
          ) : (
            <SectionRenderer key={`${section.type}-${index}`} section={section} />
          )
        )}
      </div>
    </div>
  )
}
