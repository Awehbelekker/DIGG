'use client'

import { useState, useEffect } from 'react'
import type { PageSection } from '@/lib/types/database'

type SectionBlockEditorProps = {
  section: PageSection
  onSave: (data: Record<string, unknown>) => void
  onCancel: () => void
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7941D] focus:border-transparent text-sm'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

export default function SectionBlockEditor({ section, onSave, onCancel }: SectionBlockEditorProps) {
  const [data, setData] = useState<Record<string, unknown>>({ ...section.data })

  useEffect(() => {
    setData({ ...section.data })
  }, [section])

  const update = (key: string, value: unknown) => setData((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(data)
  }

  if (section.type === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Title</label>
          <input type="text" value={(data.title as string) ?? ''} onChange={(e) => update('title', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Subtitle</label>
          <textarea value={(data.subtitle as string) ?? ''} onChange={(e) => update('subtitle', e.target.value)} rows={3} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Primary button text</label>
            <input type="text" value={(data.primaryCTAtext as string) ?? ''} onChange={(e) => update('primaryCTAtext', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Primary button link</label>
            <input type="text" value={(data.primaryCTAhref as string) ?? ''} onChange={(e) => update('primaryCTAhref', e.target.value)} className={inputClass} placeholder="/ or #anchor" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Secondary button text</label>
            <input type="text" value={(data.secondaryCTAtext as string) ?? ''} onChange={(e) => update('secondaryCTAtext', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Secondary button link</label>
            <input type="text" value={(data.secondaryCTAhref as string) ?? ''} onChange={(e) => update('secondaryCTAhref', e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Background image URL</label>
          <input type="url" value={(data.backgroundImageUrl as string) ?? ''} onChange={(e) => update('backgroundImageUrl', e.target.value)} className={inputClass} placeholder="https://..." />
        </div>
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  if (section.type === 'text') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Heading</label>
          <input type="text" value={(data.heading as string) ?? ''} onChange={(e) => update('heading', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Body</label>
          <textarea value={(data.body as string) ?? ''} onChange={(e) => update('body', e.target.value)} rows={6} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Alignment</label>
          <select value={(data.alignment as string) ?? 'left'} onChange={(e) => update('alignment', e.target.value)} className={inputClass}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  if (section.type === 'grid') {
    const items = (data.items as { title: string; description: string; imageUrl: string }[]) ?? []
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Section title</label>
          <input type="text" value={(data.title as string) ?? ''} onChange={(e) => update('title', e.target.value)} className={inputClass} />
        </div>
        {items.map((item, i) => (
          <div key={i} className="p-3 border border-gray-200 rounded-lg space-y-2">
            <input
              type="text"
              placeholder="Item title"
              value={item.title}
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...next[i], title: e.target.value }
                update('items', next)
              }}
              className={inputClass}
            />
            <textarea
              placeholder="Description"
              value={item.description}
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...next[i], description: e.target.value }
                update('items', next)
              }}
              rows={2}
              className={inputClass}
            />
            <input
              type="url"
              placeholder="Image URL"
              value={item.imageUrl ?? ''}
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...next[i], imageUrl: e.target.value }
                update('items', next)
              }}
              className={inputClass}
            />
          </div>
        ))}
        <div className="flex gap-2">
          <button type="button" onClick={() => update('items', [...items, { title: '', description: '', imageUrl: '' }])} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            + Add item
          </button>
          {items.length > 0 && (
            <button type="button" onClick={() => update('items', items.slice(0, -1))} className="px-3 py-1.5 border border-red-200 rounded-lg text-sm text-red-700 hover:bg-red-50">
              Remove last
            </button>
          )}
        </div>
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  if (section.type === 'stats') {
    const items = (data.items as { label: string; value: string }[]) ?? []
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              placeholder="Label"
              value={item.label}
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...next[i], label: e.target.value }
                update('items', next)
              }}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Value"
              value={item.value}
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...next[i], value: e.target.value }
                update('items', next)
              }}
              className={inputClass}
            />
          </div>
        ))}
        <div className="flex gap-2">
          <button type="button" onClick={() => update('items', [...items, { label: '', value: '' }])} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            + Add stat
          </button>
          {items.length > 0 && (
            <button type="button" onClick={() => update('items', items.slice(0, -1))} className="px-3 py-1.5 border border-red-200 rounded-lg text-sm text-red-700 hover:bg-red-50">
              Remove last
            </button>
          )}
        </div>
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  if (section.type === 'products') {
    const items = (data.items as { title: string; description: string; link: string; comingSoon: boolean }[]) ?? []
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Section title</label>
          <input type="text" value={(data.title as string) ?? ''} onChange={(e) => update('title', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Subtitle</label>
          <input type="text" value={(data.subtitle as string) ?? ''} onChange={(e) => update('subtitle', e.target.value)} className={inputClass} />
        </div>
        {items.map((item, i) => (
          <div key={i} className="p-3 border border-gray-200 rounded-lg space-y-2">
            <input
              type="text"
              placeholder="Product title"
              value={item.title}
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...next[i], title: e.target.value }
                update('items', next)
              }}
              className={inputClass}
            />
            <textarea
              placeholder="Description"
              value={item.description}
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...next[i], description: e.target.value }
                update('items', next)
              }}
              rows={2}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Link (optional)"
              value={item.link ?? ''}
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...next[i], link: e.target.value }
                update('items', next)
              }}
              className={inputClass}
            />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!item.comingSoon} onChange={(e) => {
                const next = [...items]
                next[i] = { ...next[i], comingSoon: e.target.checked }
                update('items', next)
              }} className="rounded text-[#F7941D]" />
              <span className="text-sm text-gray-700">Coming soon</span>
            </label>
          </div>
        ))}
        <div className="flex gap-2">
          <button type="button" onClick={() => update('items', [...items, { title: '', description: '', link: '', comingSoon: false }])} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            + Add product
          </button>
          {items.length > 0 && (
            <button type="button" onClick={() => update('items', items.slice(0, -1))} className="px-3 py-1.5 border border-red-200 rounded-lg text-sm text-red-700 hover:bg-red-50">
              Remove last
            </button>
          )}
        </div>
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  if (section.type === 'cta') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Title</label>
          <input type="text" value={(data.title as string) ?? ''} onChange={(e) => update('title', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea value={(data.description as string) ?? ''} onChange={(e) => update('description', e.target.value)} rows={2} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Button text</label>
            <input type="text" value={(data.buttonText as string) ?? ''} onChange={(e) => update('buttonText', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Button link</label>
            <input type="text" value={(data.buttonLink as string) ?? ''} onChange={(e) => update('buttonLink', e.target.value)} className={inputClass} />
          </div>
        </div>
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  if (section.type === 'form') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Form type</label>
          <select value={(data.formType as string) ?? 'contact'} onChange={(e) => update('formType', e.target.value)} className={inputClass}>
            <option value="contact">Contact form</option>
            <option value="agent">Agent registration form</option>
          </select>
        </div>
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">No editor for this section type.</p>
      <EditorFooter onCancel={onCancel} />
    </div>
  )
}

function EditorFooter({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
      <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
        Cancel
      </button>
      <button type="submit" className="px-4 py-2 bg-[#F7941D] text-white rounded-lg hover:bg-[#e6850a] text-sm font-medium">
        Save section
      </button>
    </div>
  )
}
