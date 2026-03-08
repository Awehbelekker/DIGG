'use client'

import { useState, useCallback, useRef } from 'react'
import type { PageSection } from '@/lib/types/database'
import { SECTION_TYPES } from '@/lib/section-config'
import EditableSectionRenderer from './EditableSectionRenderer'
import SectionToolbar from './SectionToolbar'
import SectionBlockEditor from './SectionBlockEditor'
import InsertSectionBar from './InsertSectionBar'

type LivePreviewProps = {
  sections: PageSection[]
  onUpdateSection: (index: number, data: Record<string, unknown>) => void
  onInsertSection: (index: number, section: PageSection) => void
  onInsertMultipleSections: (index: number, sections: PageSection[]) => void
  onMoveSection: (from: number, to: number) => void
  onDuplicateSection: (index: number) => void
  onDeleteSection: (index: number) => void
}

export default function LivePreview({
  sections,
  onUpdateSection,
  onInsertSection,
  onInsertMultipleSections,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
}: LivePreviewProps) {
  const [settingsIndex, setSettingsIndex] = useState<number | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropTarget, setDropTarget] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const sectionLabel = useCallback((s: PageSection) =>
    SECTION_TYPES.find((t) => t.type === s.type)?.label ?? s.type
  , [])

  const handleDragStart = useCallback((index: number) => (e: React.DragEvent) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }, [])

  const handleDragOver = useCallback((index: number) => (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDropTarget(index)
  }, [])

  const handleDrop = useCallback((targetIndex: number) => (e: React.DragEvent) => {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== targetIndex) {
      onMoveSection(dragIndex, targetIndex)
    }
    setDragIndex(null)
    setDropTarget(null)
  }, [dragIndex, onMoveSection])

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
    setDropTarget(null)
  }, [])

  if (sections.length === 0) {
    return (
      <div ref={containerRef}>
        <InsertSectionBar
          expanded
          onInsert={(s) => onInsertSection(0, s)}
          onInsertMultiple={(arr) => onInsertMultipleSections(0, arr)}
        />
      </div>
    )
  }

  return (
    <div ref={containerRef} onDragEnd={handleDragEnd}>
      {/* Insert bar at the very top */}
      <InsertSectionBar
        onInsert={(s) => onInsertSection(0, s)}
        onInsertMultiple={(arr) => onInsertMultipleSections(0, arr)}
      />

      {sections.map((section, index) => (
        <div key={`${section.type}-${index}`}>
          {/* Drop indicator */}
          {dropTarget === index && dragIndex !== null && dragIndex !== index && (
            <div className="h-1 bg-[#5BC8E8] mx-4 rounded-full transition-all" />
          )}

          {/* Section wrapper with hover toolbar */}
          <div
            className={`relative group transition-all ${dragIndex === index ? 'opacity-40' : ''}`}
            onDragOver={handleDragOver(index)}
            onDrop={handleDrop(index)}
          >
            <SectionToolbar
              index={index}
              total={sections.length}
              label={sectionLabel(section)}
              onMoveUp={() => onMoveSection(index, index - 1)}
              onMoveDown={() => onMoveSection(index, index + 1)}
              onDuplicate={() => onDuplicateSection(index)}
              onDelete={() => onDeleteSection(index)}
              onSettings={() => setSettingsIndex(index)}
              onDragStart={handleDragStart(index)}
            />

            <EditableSectionRenderer
              section={section}
              onChange={(data) => onUpdateSection(index, data)}
            />
          </div>

          {/* Insert bar after each section */}
          <InsertSectionBar
            onInsert={(s) => onInsertSection(index + 1, s)}
            onInsertMultiple={(arr) => onInsertMultipleSections(index + 1, arr)}
          />
        </div>
      ))}

      {/* Section settings modal */}
      {settingsIndex !== null && sections[settingsIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" aria-modal="true" role="dialog">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto p-6">
            <h3 className="text-lg font-semibold text-[#1B2A6B] mb-4">
              Settings: {sectionLabel(sections[settingsIndex])}
            </h3>
            <SectionBlockEditor
              key={settingsIndex}
              section={sections[settingsIndex]}
              onSave={(data) => { onUpdateSection(settingsIndex, data); setSettingsIndex(null) }}
              onCancel={() => setSettingsIndex(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
