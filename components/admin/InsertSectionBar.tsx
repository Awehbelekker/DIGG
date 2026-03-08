'use client'

import { useState, useRef, useEffect } from 'react'
import type { PageSection } from '@/lib/types/database'
import { SECTION_TYPES, createEmptySection } from '@/lib/section-config'
import { PAGE_TEMPLATES } from '@/lib/page-templates'

type InsertSectionBarProps = {
  onInsert: (section: PageSection) => void
  onInsertMultiple?: (sections: PageSection[]) => void
  expanded?: boolean
}

const SECTION_ICONS: Record<string, string> = {
  hero: '🏔',
  text: '📝',
  image: '🖼',
  grid: '▦',
  stats: '📊',
  products: '🛍',
  cta: '📣',
  form: '📋',
  testimonial: '💬',
  video: '▶️',
  gallery: '🎨',
  two_column: '◫',
  logos: '⭐',
  faq: '❓',
  divider: '➖',
}

export default function InsertSectionBar({ onInsert, onInsertMultiple, expanded = false }: InsertSectionBarProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'sections' | 'templates'>('sections')
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleInsertSection = (type: PageSection['type']) => {
    onInsert(createEmptySection(type))
    setOpen(false)
  }

  const handleInsertTemplate = (sections: PageSection[]) => {
    if (onInsertMultiple) {
      onInsertMultiple(sections)
    } else {
      sections.forEach((s) => onInsert(s))
    }
    setOpen(false)
  }

  if (expanded) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1B2A6B] mb-2">Start building your page</h2>
          <p className="text-gray-500">Choose a template to get started, or add sections one at a time.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 w-full max-w-xl">
          {PAGE_TEMPLATES.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => handleInsertTemplate(t.sections)}
              className="bg-white border-2 border-gray-200 rounded-xl p-5 text-center hover:border-[#F7941D] hover:shadow-md transition-all group"
            >
              <span className="text-2xl mb-2 block">{t.icon}</span>
              <span className="text-sm font-semibold text-[#1B2A6B] group-hover:text-[#F7941D]">{t.name}</span>
              <span className="text-xs text-gray-400 block mt-1">{t.sections.length} sections</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-16 bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">or add a section</span>
          <div className="h-px w-16 bg-gray-200" />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {SECTION_TYPES.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => handleInsertSection(type)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-[#F7941D] hover:text-[#F7941D] hover:shadow transition-all flex items-center gap-2"
            >
              <span>{SECTION_ICONS[type] || '◻'}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative insert-section-bar group/insert">
      {/* The line + button */}
      <div className="flex items-center justify-center py-1">
        <div className="flex-1 h-px bg-transparent group-hover/insert:bg-[#5BC8E8]/40 transition-colors" />
        <button
          type="button"
          onClick={() => { setOpen(!open); setTab('sections') }}
          className="w-7 h-7 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-lg leading-none hover:border-[#F7941D] hover:text-[#F7941D] hover:shadow-md opacity-0 group-hover/insert:opacity-100 focus:opacity-100 transition-all"
          title="Add section"
        >
          +
        </button>
        <div className="flex-1 h-px bg-transparent group-hover/insert:bg-[#5BC8E8]/40 transition-colors" />
      </div>

      {/* Popover */}
      {open && (
        <div
          ref={popoverRef}
          className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 w-[400px] max-w-[90vw] overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              type="button"
              onClick={() => setTab('sections')}
              className={`flex-1 px-4 py-2.5 text-xs font-semibold transition-colors ${
                tab === 'sections' ? 'text-[#F7941D] border-b-2 border-[#F7941D]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sections
            </button>
            <button
              type="button"
              onClick={() => setTab('templates')}
              className={`flex-1 px-4 py-2.5 text-xs font-semibold transition-colors ${
                tab === 'templates' ? 'text-[#F7941D] border-b-2 border-[#F7941D]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates
            </button>
          </div>

          {tab === 'sections' && (
            <div className="p-3 grid grid-cols-3 gap-1.5 max-h-[320px] overflow-y-auto">
              {SECTION_TYPES.map(({ type, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleInsertSection(type)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all text-center"
                >
                  <span className="text-xl">{SECTION_ICONS[type] || '◻'}</span>
                  <span className="text-xs font-medium text-gray-700">{label}</span>
                </button>
              ))}
            </div>
          )}

          {tab === 'templates' && (
            <div className="p-3 grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto">
              {PAGE_TEMPLATES.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => handleInsertTemplate(t.sections)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all text-left"
                >
                  <span className="text-xl flex-shrink-0">{t.icon}</span>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-[#1B2A6B] block">{t.name}</span>
                    <span className="text-[10px] text-gray-400">{t.sections.length} sections</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
