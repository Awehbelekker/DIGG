'use client'

import { useState } from 'react'
import type { PageSection } from '@/lib/types/database'
import DropUpload from './DropUpload'

type SectionBlockEditorProps = {
  section: PageSection
  onSave: (data: Record<string, unknown>) => void
  onCancel: () => void
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7941D] focus:border-transparent text-sm'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

export default function SectionBlockEditor({ section, onSave, onCancel }: SectionBlockEditorProps) {
  const [data, setData] = useState<Record<string, unknown>>(() => JSON.parse(JSON.stringify(section.data)))

  const update = (key: string, value: unknown) => setData((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(data)
  }

  /* ── Hero ── */
  if (section.type === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className={labelClass}>Title</label><input type="text" value={(data.title as string) ?? ''} onChange={(e) => update('title', e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Subtitle</label><textarea value={(data.subtitle as string) ?? ''} onChange={(e) => update('subtitle', e.target.value)} rows={3} className={inputClass} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass}>Primary button text</label><input type="text" value={(data.primaryCTAtext as string) ?? ''} onChange={(e) => update('primaryCTAtext', e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Primary button link</label><input type="text" value={(data.primaryCTAhref as string) ?? ''} onChange={(e) => update('primaryCTAhref', e.target.value)} className={inputClass} placeholder="/ or #anchor" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass}>Secondary button text</label><input type="text" value={(data.secondaryCTAtext as string) ?? ''} onChange={(e) => update('secondaryCTAtext', e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Secondary button link</label><input type="text" value={(data.secondaryCTAhref as string) ?? ''} onChange={(e) => update('secondaryCTAhref', e.target.value)} className={inputClass} /></div>
        </div>
        <div><label className={labelClass}>Background image</label><DropUpload value={(data.backgroundImageUrl as string) ?? ''} onChange={(url) => update('backgroundImageUrl', url)} bucket="hero-images" folder="hero" /></div>
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  /* ── Text ── */
  if (section.type === 'text') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className={labelClass}>Heading</label><input type="text" value={(data.heading as string) ?? ''} onChange={(e) => update('heading', e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Body</label><textarea value={(data.body as string) ?? ''} onChange={(e) => update('body', e.target.value)} rows={6} className={inputClass} /></div>
        <div><label className={labelClass}>Alignment</label>
          <select value={(data.alignment as string) ?? 'left'} onChange={(e) => update('alignment', e.target.value)} className={inputClass}>
            <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
          </select>
        </div>
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  /* ── Image ── */
  if (section.type === 'image') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className={labelClass}>Image</label><DropUpload value={(data.imageUrl as string) ?? ''} onChange={(url) => update('imageUrl', url)} bucket="hero-images" folder="section" /></div>
        <div><label className={labelClass}>Alt text</label><input type="text" value={(data.alt as string) ?? ''} onChange={(e) => update('alt', e.target.value)} className={inputClass} placeholder="Describe the image" /></div>
        <div><label className={labelClass}>Caption</label><input type="text" value={(data.caption as string) ?? ''} onChange={(e) => update('caption', e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Layout</label>
          <select value={(data.layout as string) ?? 'contained'} onChange={(e) => update('layout', e.target.value)} className={inputClass}>
            <option value="contained">Contained</option><option value="full">Full width</option>
          </select>
        </div>
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  /* ── Two Column ── */
  if (section.type === 'two_column') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className={labelClass}>Heading</label><input type="text" value={(data.heading as string) ?? ''} onChange={(e) => update('heading', e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Body</label><textarea value={(data.body as string) ?? ''} onChange={(e) => update('body', e.target.value)} rows={4} className={inputClass} /></div>
        <div><label className={labelClass}>Image</label><DropUpload value={(data.imageUrl as string) ?? ''} onChange={(url) => update('imageUrl', url)} bucket="hero-images" folder="section" /></div>
        <div><label className={labelClass}>Image alt text</label><input type="text" value={(data.imageAlt as string) ?? ''} onChange={(e) => update('imageAlt', e.target.value)} className={inputClass} /></div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!data.reversed} onChange={(e) => update('reversed', e.target.checked)} className="rounded text-[#F7941D]" /><span className="text-sm text-gray-700">Flip layout (image on left)</span></label>
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  /* ── Grid ── */
  if (section.type === 'grid') {
    const items = (data.items as { title: string; description: string; imageUrl: string }[]) ?? []
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className={labelClass}>Section title</label><input type="text" value={(data.title as string) ?? ''} onChange={(e) => update('title', e.target.value)} className={inputClass} /></div>
        {items.map((item, i) => (
          <div key={i} className="p-3 border border-gray-200 rounded-lg space-y-2">
            <input type="text" placeholder="Title" value={item.title} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], title: e.target.value }; update('items', n) }} className={inputClass} />
            <textarea placeholder="Description" value={item.description} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], description: e.target.value }; update('items', n) }} rows={2} className={inputClass} />
            <DropUpload compact value={item.imageUrl ?? ''} onChange={(url) => { const n = [...items]; n[i] = { ...n[i], imageUrl: url }; update('items', n) }} bucket="portfolio" folder="grid" label="Image" />
          </div>
        ))}
        <ItemButtons onAdd={() => update('items', [...items, { title: '', description: '', imageUrl: '' }])} onRemove={items.length > 0 ? () => update('items', items.slice(0, -1)) : undefined} />
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  /* ── Gallery ── */
  if (section.type === 'gallery') {
    const images = (data.images as { url: string; alt?: string }[]) ?? []
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className={labelClass}>Title</label><input type="text" value={(data.title as string) ?? ''} onChange={(e) => update('title', e.target.value)} className={inputClass} /></div>
        {images.map((img, i) => (
          <div key={i} className="p-3 border border-gray-200 rounded-lg space-y-2">
            <DropUpload compact value={img.url} onChange={(url) => { const n = [...images]; n[i] = { ...n[i], url }; update('images', n) }} bucket="portfolio" folder="gallery" label={`Image ${i + 1}`} />
            <input type="text" placeholder="Alt text" value={img.alt ?? ''} onChange={(e) => { const n = [...images]; n[i] = { ...n[i], alt: e.target.value }; update('images', n) }} className={inputClass} />
          </div>
        ))}
        <ItemButtons onAdd={() => update('images', [...images, { url: '', alt: '' }])} onRemove={images.length > 0 ? () => update('images', images.slice(0, -1)) : undefined} label="image" />
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  /* ── Stats ── */
  if (section.type === 'stats') {
    const items = (data.items as { label: string; value: string }[]) ?? []
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" placeholder="Label" value={item.label} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], label: e.target.value }; update('items', n) }} className={inputClass} />
            <input type="text" placeholder="Value" value={item.value} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], value: e.target.value }; update('items', n) }} className={inputClass} />
          </div>
        ))}
        <ItemButtons onAdd={() => update('items', [...items, { label: '', value: '' }])} onRemove={items.length > 0 ? () => update('items', items.slice(0, -1)) : undefined} label="stat" />
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  /* ── Products ── */
  if (section.type === 'products') {
    const items = (data.items as { title: string; description: string; link: string; comingSoon: boolean; imageUrl?: string }[]) ?? []
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className={labelClass}>Title</label><input type="text" value={(data.title as string) ?? ''} onChange={(e) => update('title', e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Subtitle</label><input type="text" value={(data.subtitle as string) ?? ''} onChange={(e) => update('subtitle', e.target.value)} className={inputClass} /></div>
        {items.map((item, i) => (
          <div key={i} className="p-3 border border-gray-200 rounded-lg space-y-2">
            <input type="text" placeholder="Title" value={item.title} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], title: e.target.value }; update('items', n) }} className={inputClass} />
            <DropUpload compact value={item.imageUrl ?? ''} onChange={(url) => { const n = [...items]; n[i] = { ...n[i], imageUrl: url }; update('items', n) }} bucket="portfolio" folder="product" label="Image" />
            <textarea placeholder="Description" value={item.description} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], description: e.target.value }; update('items', n) }} rows={2} className={inputClass} />
            <input type="text" placeholder="Link" value={item.link ?? ''} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], link: e.target.value }; update('items', n) }} className={inputClass} />
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!item.comingSoon} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], comingSoon: e.target.checked }; update('items', n) }} className="rounded text-[#F7941D]" /><span className="text-sm text-gray-700">Coming soon</span></label>
          </div>
        ))}
        <ItemButtons onAdd={() => update('items', [...items, { title: '', description: '', link: '', comingSoon: false, imageUrl: '' }])} onRemove={items.length > 0 ? () => update('items', items.slice(0, -1)) : undefined} label="product" />
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  /* ── Testimonial ── */
  if (section.type === 'testimonial') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className={labelClass}>Quote</label><textarea value={(data.quote as string) ?? ''} onChange={(e) => update('quote', e.target.value)} rows={4} className={inputClass} /></div>
        <div><label className={labelClass}>Author</label><input type="text" value={(data.author as string) ?? ''} onChange={(e) => update('author', e.target.value)} className={inputClass} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass}>Role</label><input type="text" value={(data.role as string) ?? ''} onChange={(e) => update('role', e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Company</label><input type="text" value={(data.company as string) ?? ''} onChange={(e) => update('company', e.target.value)} className={inputClass} /></div>
        </div>
        <div><label className={labelClass}>Photo</label><DropUpload value={(data.photoUrl as string) ?? ''} onChange={(url) => update('photoUrl', url)} bucket="team-photos" folder="testimonial" /></div>
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  /* ── Video ── */
  if (section.type === 'video') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className={labelClass}>Video URL (YouTube or Vimeo)</label><input type="url" value={(data.videoUrl as string) ?? ''} onChange={(e) => update('videoUrl', e.target.value)} className={inputClass} placeholder="https://youtube.com/watch?v=..." /></div>
        <div><label className={labelClass}>Heading</label><input type="text" value={(data.heading as string) ?? ''} onChange={(e) => update('heading', e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Caption</label><input type="text" value={(data.caption as string) ?? ''} onChange={(e) => update('caption', e.target.value)} className={inputClass} /></div>
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  /* ── Logos ── */
  if (section.type === 'logos') {
    const logos = (data.logos as { name: string; imageUrl?: string }[]) ?? []
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className={labelClass}>Title</label><input type="text" value={(data.title as string) ?? ''} onChange={(e) => update('title', e.target.value)} className={inputClass} /></div>
        {logos.map((logo, i) => (
          <div key={i} className="p-3 border border-gray-200 rounded-lg space-y-2">
            <input type="text" placeholder="Name" value={logo.name} onChange={(e) => { const n = [...logos]; n[i] = { ...n[i], name: e.target.value }; update('logos', n) }} className={inputClass} />
            <DropUpload compact value={logo.imageUrl ?? ''} onChange={(url) => { const n = [...logos]; n[i] = { ...n[i], imageUrl: url }; update('logos', n) }} bucket="logos" folder="partner" label="Logo" />
          </div>
        ))}
        <ItemButtons onAdd={() => update('logos', [...logos, { name: '', imageUrl: '' }])} onRemove={logos.length > 0 ? () => update('logos', logos.slice(0, -1)) : undefined} label="logo" />
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  /* ── FAQ ── */
  if (section.type === 'faq') {
    const items = (data.items as { question: string; answer: string }[]) ?? []
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className={labelClass}>Title</label><input type="text" value={(data.title as string) ?? ''} onChange={(e) => update('title', e.target.value)} className={inputClass} /></div>
        {items.map((item, i) => (
          <div key={i} className="p-3 border border-gray-200 rounded-lg space-y-2">
            <input type="text" placeholder="Question" value={item.question} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], question: e.target.value }; update('items', n) }} className={inputClass} />
            <textarea placeholder="Answer" value={item.answer} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], answer: e.target.value }; update('items', n) }} rows={3} className={inputClass} />
          </div>
        ))}
        <ItemButtons onAdd={() => update('items', [...items, { question: '', answer: '' }])} onRemove={items.length > 0 ? () => update('items', items.slice(0, -1)) : undefined} label="question" />
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  /* ── CTA ── */
  if (section.type === 'cta') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className={labelClass}>Title</label><input type="text" value={(data.title as string) ?? ''} onChange={(e) => update('title', e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Description</label><textarea value={(data.description as string) ?? ''} onChange={(e) => update('description', e.target.value)} rows={2} className={inputClass} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass}>Button text</label><input type="text" value={(data.buttonText as string) ?? ''} onChange={(e) => update('buttonText', e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Button link</label><input type="text" value={(data.buttonLink as string) ?? ''} onChange={(e) => update('buttonLink', e.target.value)} className={inputClass} /></div>
        </div>
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  /* ── Divider ── */
  if (section.type === 'divider') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className={labelClass}>Size</label>
          <select value={(data.size as string) ?? 'md'} onChange={(e) => update('size', e.target.value)} className={inputClass}>
            <option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option>
          </select>
        </div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={data.showLine !== false} onChange={(e) => update('showLine', e.target.checked)} className="rounded text-[#F7941D]" /><span className="text-sm text-gray-700">Show line</span></label>
        <EditorFooter onCancel={onCancel} />
      </form>
    )
  }

  /* ── Form ── */
  if (section.type === 'form') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className={labelClass}>Form type</label>
          <select value={(data.formType as string) ?? 'contact'} onChange={(e) => update('formType', e.target.value)} className={inputClass}>
            <option value="contact">Contact form</option><option value="agent">Agent registration form</option>
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
      <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">Cancel</button>
      <button type="submit" className="px-4 py-2 bg-[#F7941D] text-white rounded-lg hover:bg-[#e6850a] text-sm font-medium">Save section</button>
    </div>
  )
}

function ItemButtons({ onAdd, onRemove, label = 'item' }: { onAdd: () => void; onRemove?: () => void; label?: string }) {
  return (
    <div className="flex gap-2">
      <button type="button" onClick={onAdd} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">+ Add {label}</button>
      {onRemove && <button type="button" onClick={onRemove} className="px-3 py-1.5 border border-red-200 rounded-lg text-sm text-red-700 hover:bg-red-50">Remove last</button>}
    </div>
  )
}
