'use client'

import type { PageSection } from '@/lib/types/database'
import InlineEditable from './InlineEditable'
import InlineImageEdit from './InlineImageEdit'

type EditableSectionRendererProps = {
  section: PageSection
  onChange: (data: Record<string, unknown>) => void
}

export default function EditableSectionRenderer({ section, onChange }: EditableSectionRendererProps) {
  const { type, data } = section
  if (!data) return null

  const update = (key: string, value: unknown) => onChange({ ...data, [key]: value })

  const updateItem = (key: string, items: unknown[], index: number, field: string, value: unknown) => {
    const next = [...items] as Record<string, unknown>[]
    next[index] = { ...next[index], [field]: value }
    update(key, next)
  }

  if (type === 'hero') {
    const bgUrl = (data.backgroundImageUrl as string) || ''
    return (
      <section
        className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center bg-gradient-to-br from-[#1B2A6B] to-[#2a3d8a] text-white py-12 sm:py-16 px-4 sm:px-6"
        style={bgUrl ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4)), url(${bgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {}}
      >
        {/* Background image replace button */}
        <div className="absolute top-3 right-3 z-20">
          <label className="cursor-pointer bg-white/20 hover:bg-white/40 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {bgUrl ? 'Change background' : 'Add background'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const objectUrl = URL.createObjectURL(file)
                update('backgroundImageUrl', objectUrl)
                uploadFile(file, 'hero-images', 'hero').then((url) => { if (url) update('backgroundImageUrl', url) })
              }
              e.target.value = ''
            }} />
          </label>
        </div>
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <InlineEditable
            as="h1"
            value={(data.title as string) ?? ''}
            onChange={(v) => update('title', v)}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight drop-shadow-sm"
            placeholder="Click to add title…"
          />
          <InlineEditable
            as="p"
            value={(data.subtitle as string) ?? ''}
            onChange={(v) => update('subtitle', v)}
            className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-3xl leading-relaxed opacity-95"
            placeholder="Click to add subtitle…"
            multiline
          />
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <span className="inline-flex items-center justify-center bg-[#F7941D] text-white px-6 sm:px-8 py-3.5 rounded-xl font-semibold">
              <InlineEditable
                value={(data.primaryCTAtext as string) || 'Learn more'}
                onChange={(v) => update('primaryCTAtext', v)}
                placeholder="Button text"
              />
            </span>
            <span className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3.5 rounded-xl font-semibold">
              <InlineEditable
                value={(data.secondaryCTAtext as string) || 'Contact'}
                onChange={(v) => update('secondaryCTAtext', v)}
                placeholder="Button text"
              />
            </span>
          </div>
        </div>
      </section>
    )
  }

  if (type === 'text') {
    const alignment = (data.alignment as string) === 'center' ? 'text-center' : (data.alignment as string) === 'right' ? 'text-right' : 'text-left'
    return (
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={alignment}>
            <InlineEditable
              as="h2"
              value={(data.heading as string) ?? ''}
              onChange={(v) => update('heading', v)}
              className="text-3xl font-bold text-[#1B2A6B] mb-4"
              placeholder="Click to add heading…"
            />
            <InlineEditable
              as="p"
              value={(data.body as string) ?? ''}
              onChange={(v) => update('body', v)}
              className="text-gray-600 leading-relaxed whitespace-pre-wrap"
              placeholder="Click to add body text…"
              multiline
            />
          </div>
        </div>
      </section>
    )
  }

  if (type === 'image') {
    const imageUrl = (data.imageUrl as string) || ''
    const caption = (data.caption as string) || ''
    const layout = (data.layout as string) || 'contained'
    const isFullWidth = layout === 'full'
    return (
      <section className={isFullWidth ? '' : 'py-8 lg:py-12'}>
        <div className={isFullWidth ? 'w-full' : 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'}>
          <div className={isFullWidth ? '' : 'rounded-2xl overflow-hidden'}>
            <InlineImageEdit
              src={imageUrl}
              alt={(data.alt as string) || 'Section image'}
              className="w-full h-auto object-cover"
              onChange={(url) => update('imageUrl', url)}
              bucket="hero-images"
              folder="section"
            />
          </div>
          <div className="mt-3 text-center">
            <InlineEditable
              as="p"
              value={caption}
              onChange={(v) => update('caption', v)}
              className="text-sm text-gray-500 max-w-3xl mx-auto"
              placeholder="Click to add caption…"
            />
          </div>
        </div>
      </section>
    )
  }

  if (type === 'grid') {
    const title = (data.title as string) || ''
    const items = (data.items as { title: string; description: string; imageUrl?: string }[]) ?? []
    return (
      <section className="bg-[#FAFAFA] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InlineEditable
            as="h2"
            value={title}
            onChange={(v) => update('title', v)}
            className="text-3xl font-bold text-[#1B2A6B] mb-10 text-center"
            placeholder="Click to add section title…"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="aspect-video rounded-xl overflow-hidden mb-4">
                  <InlineImageEdit
                    src={item.imageUrl}
                    alt={item.title}
                    className="rounded-xl w-full h-full object-cover"
                    onChange={(url) => updateItem('items', items, i, 'imageUrl', url)}
                    bucket="portfolio"
                    folder="grid"
                  />
                </div>
                <InlineEditable
                  as="h3"
                  value={item.title}
                  onChange={(v) => updateItem('items', items, i, 'title', v)}
                  className="text-xl font-bold text-[#1B2A6B] mb-2"
                  placeholder="Item title"
                />
                <InlineEditable
                  as="p"
                  value={item.description}
                  onChange={(v) => updateItem('items', items, i, 'description', v)}
                  className="text-gray-600 text-sm"
                  placeholder="Item description"
                  multiline
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (type === 'stats') {
    const items = (data.items as { label: string; value: string }[]) ?? []
    return (
      <section className="bg-gradient-to-r from-[#1B2A6B] via-[#243a7a] to-[#2a3d8a] text-white py-16 lg:py-20 my-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
            {items.map((stat, i) => (
              <div key={i} className="relative">
                <InlineEditable
                  as="span"
                  value={stat.value}
                  onChange={(v) => updateItem('items', items, i, 'value', v)}
                  className="block text-4xl md:text-5xl font-bold text-[#F7941D] mb-2 tabular-nums"
                  placeholder="0"
                />
                <InlineEditable
                  as="span"
                  value={stat.label}
                  onChange={(v) => updateItem('items', items, i, 'label', v)}
                  className="text-sm md:text-base opacity-90"
                  placeholder="Stat label"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (type === 'products') {
    const title = (data.title as string) || ''
    const subtitle = (data.subtitle as string) || ''
    const items = (data.items as { title: string; description: string; link?: string; comingSoon?: boolean; imageUrl?: string }[]) ?? []
    return (
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InlineEditable
            as="h2"
            value={title}
            onChange={(v) => update('title', v)}
            className="text-3xl md:text-4xl font-bold text-[#1B2A6B] text-center mb-2"
            placeholder="Section title"
          />
          <InlineEditable
            as="p"
            value={subtitle}
            onChange={(v) => update('subtitle', v)}
            className="text-center text-lg text-gray-600 mb-10"
            placeholder="Section subtitle"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, i) => (
              <div key={i} className="bg-[#FAFAFA] rounded-2xl border border-gray-100 relative overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <InlineImageEdit
                    src={item.imageUrl}
                    alt={item.title}
                    className="rounded-t-2xl object-cover w-full h-full"
                    onChange={(url) => updateItem('items', items, i, 'imageUrl', url)}
                    bucket="portfolio"
                    folder="product"
                  />
                </div>
                <div className="p-6">
                  {item.comingSoon && (
                    <span className="absolute top-4 right-4 bg-[#5BC8E8] text-[#1B2A6B] px-3 py-1 rounded-full text-xs font-semibold">
                      Coming Soon
                    </span>
                  )}
                  <InlineEditable
                    as="h3"
                    value={item.title}
                    onChange={(v) => updateItem('items', items, i, 'title', v)}
                    className="text-xl font-bold text-[#1B2A6B] mb-3 pr-20"
                    placeholder="Product title"
                  />
                  <InlineEditable
                    as="p"
                    value={item.description}
                    onChange={(v) => updateItem('items', items, i, 'description', v)}
                    className="text-gray-600 text-sm"
                    placeholder="Product description"
                    multiline
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (type === 'cta') {
    return (
      <section className="bg-[#1B2A6B] py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <InlineEditable
            as="h2"
            value={(data.title as string) || ''}
            onChange={(v) => update('title', v)}
            className="text-3xl font-bold mb-4"
            placeholder="CTA title"
          />
          <InlineEditable
            as="p"
            value={(data.description as string) || ''}
            onChange={(v) => update('description', v)}
            className="text-lg opacity-90 mb-8"
            placeholder="CTA description"
            multiline
          />
          <span className="inline-block bg-[#F7941D] text-white px-8 py-3.5 rounded-xl font-semibold">
            <InlineEditable
              value={(data.buttonText as string) || 'Contact us'}
              onChange={(v) => update('buttonText', v)}
              placeholder="Button text"
            />
          </span>
        </div>
      </section>
    )
  }

  if (type === 'form') {
    const formType = (data.formType as string) || 'contact'
    return (
      <section className="bg-[#FAFAFA] py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-sm font-medium">
              {formType === 'agent' ? 'Agent registration form' : 'Contact form'}
            </p>
            <p className="text-gray-400 text-xs mt-1">Forms render on the live site</p>
          </div>
        </div>
      </section>
    )
  }

  return null
}

async function uploadFile(file: File, bucket: string, folder: string): Promise<string | null> {
  try {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from(bucket).upload(path, file)
    if (error) throw error
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  } catch {
    return null
  }
}
