'use client'

import type { PageSection } from '@/lib/types/database'
import SectionRenderer from '@/components/public/SectionRenderer'

type LivePreviewProps = {
  sections: PageSection[]
  slug?: string
}

export default function LivePreview({ sections, slug }: LivePreviewProps) {
  if (sections.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] text-sm text-gray-400 px-4 text-center">
        Add sections on the left to see a live preview here.
      </div>
    )
  }

  return (
    <div className="bg-white min-h-[300px]">
      {slug && (
        <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 text-center text-xs text-amber-700">
          Live preview &mdash; unsaved changes shown in real-time
        </div>
      )}
      <div className="origin-top-left" style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: 'calc(100% / 0.55)' }}>
        {sections.map((section, index) => (
          <SectionRenderer key={`${section.type}-${index}`} section={section} />
        ))}
      </div>
    </div>
  )
}
