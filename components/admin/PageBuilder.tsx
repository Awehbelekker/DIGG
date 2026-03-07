'use client'

import { useState } from 'react'
import type { PageSection } from '@/lib/types/database'
import { SECTION_TYPES, createEmptySection } from '@/lib/section-config'
import SectionBlockEditor from './SectionBlockEditor'

type PageBuilderProps = {
  sections: PageSection[]
  onChange: (sections: PageSection[]) => void
}

export default function PageBuilder({ sections, onChange }: PageBuilderProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const addSection = (type: PageSection['type']) => {
    onChange([...sections, createEmptySection(type)])
  }

  const removeSection = (index: number) => {
    if (!confirm('Remove this section?')) return
    onChange(sections.filter((_, i) => i !== index))
    if (editingIndex === index) {
      setEditingIndex(null)
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1)
    }
  }

  const moveSection = (index: number, dir: 'up' | 'down') => {
    const next = [...sections]
    const j = dir === 'up' ? index - 1 : index + 1
    if (j < 0 || j >= next.length) return
    ;[next[index], next[j]] = [next[j], next[index]]
    onChange(next)
    if (editingIndex === index) setEditingIndex(j)
    else if (editingIndex === j) setEditingIndex(index)
  }

  const updateSectionData = (index: number, data: Record<string, unknown>) => {
    const next = [...sections]
    next[index] = { ...next[index], data }
    onChange(next)
    setEditingIndex(null)
  }

  const sectionLabel = (s: PageSection) => SECTION_TYPES.find((t) => t.type === s.type)?.label ?? s.type

  const quickAdd: { type: PageSection['type']; label: string }[] = [
    { type: 'hero', label: 'Hero' },
    { type: 'text', label: 'Text' },
    { type: 'image', label: 'Image' },
    { type: 'cta', label: 'CTA' },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Add section</p>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {quickAdd.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => addSection(type)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-[#F7941D] hover:text-white hover:border-[#F7941D] transition-colors"
            >
              + {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-gray-500">Or choose any:</label>
          <select
            aria-label="Section type to add"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent bg-white"
            value=""
            onChange={(e) => {
              const v = e.target.value as PageSection['type']
              if (v) addSection(v)
              e.target.value = ''
            }}
          >
            <option value="">Choose type…</option>
            <optgroup label="Banners & content">
              <option value="hero">Hero</option>
              <option value="text">Text</option>
              <option value="image">Image</option>
            </optgroup>
            <optgroup label="Sections">
              <option value="grid">Feature grid</option>
              <option value="stats">Stats</option>
              <option value="products">Products</option>
              <option value="cta">Call to action</option>
              <option value="form">Form</option>
            </optgroup>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {sections.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center text-sm text-gray-500">
            No sections yet. Add one above to start building the page.
          </div>
        )}
        {sections.map((section, index) => (
          <div
            key={`${section.type}-${index}`}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
          >
            <div className="flex flex-shrink-0 gap-1">
              <button
                type="button"
                onClick={() => moveSection(index, 'up')}
                disabled={index === 0}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveSection(index, 'down')}
                disabled={index === sections.length - 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Move down"
              >
                ↓
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-medium text-[#1B2A6B]">{sectionLabel(section)}</span>
              {section.type === 'hero' && section.data?.title && (
                <span className="ml-2 text-gray-500 truncate">— {(section.data.title as string).slice(0, 40)}…</span>
              )}
              {section.type === 'text' && section.data?.heading && (
                <span className="ml-2 text-gray-500 truncate">— {(section.data.heading as string).slice(0, 40)}…</span>
              )}
            </div>
            <div className="flex flex-shrink-0 gap-1">
              <button
                type="button"
                onClick={() => setEditingIndex(index)}
                className="px-3 py-1.5 rounded-lg bg-[#F7941D] text-white text-sm font-medium hover:bg-[#e6850a]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => removeSection(index)}
                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 text-sm font-medium hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingIndex !== null && sections[editingIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" aria-modal="true" role="dialog">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto p-6">
            <h3 className="text-lg font-semibold text-[#1B2A6B] mb-4">
              Edit section: {sectionLabel(sections[editingIndex])}
            </h3>
            <SectionBlockEditor
              key={editingIndex}
              section={sections[editingIndex]}
              onSave={(data) => updateSectionData(editingIndex, data)}
              onCancel={() => setEditingIndex(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
