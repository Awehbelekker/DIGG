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

  /* ── Hero ── */
  if (type === 'hero') {
    const bgUrl = (data.backgroundImageUrl as string) || ''
    return (
      <section
        className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center bg-gradient-to-br from-[#1B2A6B] to-[#2a3d8a] text-white py-12 sm:py-16 px-4 sm:px-6"
        style={bgUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4)), url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className="absolute top-3 right-3 z-20">
          <label className="cursor-pointer bg-white/20 hover:bg-white/40 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {bgUrl ? 'Change background' : 'Add background'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) { update('backgroundImageUrl', URL.createObjectURL(file)); uploadFile(file, 'hero-images', 'hero').then((url) => { if (url) update('backgroundImageUrl', url) }) }
              e.target.value = ''
            }} />
          </label>
        </div>
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <InlineEditable as="h1" value={(data.title as string) ?? ''} onChange={(v) => update('title', v)} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight drop-shadow-sm" placeholder="Click to add title…" />
          <InlineEditable as="p" value={(data.subtitle as string) ?? ''} onChange={(v) => update('subtitle', v)} className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-3xl leading-relaxed opacity-95" placeholder="Click to add subtitle…" multiline />
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <span className="inline-flex items-center justify-center bg-[#F7941D] text-white px-6 sm:px-8 py-3.5 rounded-xl font-semibold">
              <InlineEditable value={(data.primaryCTAtext as string) || 'Learn more'} onChange={(v) => update('primaryCTAtext', v)} placeholder="Button text" />
            </span>
            <span className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3.5 rounded-xl font-semibold">
              <InlineEditable value={(data.secondaryCTAtext as string) || 'Contact'} onChange={(v) => update('secondaryCTAtext', v)} placeholder="Button text" />
            </span>
          </div>
        </div>
      </section>
    )
  }

  /* ── Text ── */
  if (type === 'text') {
    const alignment = (data.alignment as string) === 'center' ? 'text-center' : (data.alignment as string) === 'right' ? 'text-right' : 'text-left'
    return (
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={alignment}>
            <InlineEditable as="h2" value={(data.heading as string) ?? ''} onChange={(v) => update('heading', v)} className="text-3xl font-bold text-[#1B2A6B] mb-4" placeholder="Click to add heading…" />
            <InlineEditable as="p" value={(data.body as string) ?? ''} onChange={(v) => update('body', v)} className="text-gray-600 leading-relaxed whitespace-pre-wrap" placeholder="Click to add body text…" multiline />
          </div>
        </div>
      </section>
    )
  }

  /* ── Image ── */
  if (type === 'image') {
    const layout = (data.layout as string) || 'contained'
    const isFullWidth = layout === 'full'
    return (
      <section className={isFullWidth ? '' : 'py-8 lg:py-12'}>
        <div className={isFullWidth ? 'w-full' : 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'}>
          <div className={isFullWidth ? '' : 'rounded-2xl overflow-hidden'}>
            <InlineImageEdit src={(data.imageUrl as string) || ''} alt={(data.alt as string) || 'Section image'} className="w-full h-auto object-cover" onChange={(url) => update('imageUrl', url)} bucket="hero-images" folder="section" />
          </div>
          <div className="mt-3 text-center">
            <InlineEditable as="p" value={(data.caption as string) || ''} onChange={(v) => update('caption', v)} className="text-sm text-gray-500 max-w-3xl mx-auto" placeholder="Click to add caption…" />
          </div>
        </div>
      </section>
    )
  }

  /* ── Two Column ── */
  if (type === 'two_column') {
    const reversed = !!data.reversed
    return (
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reversed ? 'lg:[direction:rtl]' : ''}`}>
            <div className={reversed ? 'lg:[direction:ltr]' : ''}>
              <InlineEditable as="h2" value={(data.heading as string) ?? ''} onChange={(v) => update('heading', v)} className="text-3xl font-bold text-[#1B2A6B] mb-6" placeholder="Heading" />
              <InlineEditable as="p" value={(data.body as string) ?? ''} onChange={(v) => update('body', v)} className="text-gray-600 leading-relaxed whitespace-pre-wrap" placeholder="Body text" multiline />
            </div>
            <div className={`rounded-2xl overflow-hidden ${reversed ? 'lg:[direction:ltr]' : ''}`}>
              <InlineImageEdit src={(data.imageUrl as string) || ''} alt={(data.imageAlt as string) || ''} className="rounded-2xl w-full h-full object-cover" onChange={(url) => update('imageUrl', url)} bucket="hero-images" folder="section" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ── Grid ── */
  if (type === 'grid') {
    const items = (data.items as { title: string; description: string; imageUrl?: string }[]) ?? []
    return (
      <section className="bg-[#FAFAFA] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InlineEditable as="h2" value={(data.title as string) || ''} onChange={(v) => update('title', v)} className="text-3xl font-bold text-[#1B2A6B] mb-10 text-center" placeholder="Section title" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="aspect-video rounded-xl overflow-hidden mb-4">
                  <InlineImageEdit src={item.imageUrl} alt={item.title} className="rounded-xl w-full h-full object-cover" onChange={(url) => updateItem('items', items, i, 'imageUrl', url)} bucket="portfolio" folder="grid" />
                </div>
                <InlineEditable as="h3" value={item.title} onChange={(v) => updateItem('items', items, i, 'title', v)} className="text-xl font-bold text-[#1B2A6B] mb-2" placeholder="Item title" />
                <InlineEditable as="p" value={item.description} onChange={(v) => updateItem('items', items, i, 'description', v)} className="text-gray-600 text-sm" placeholder="Description" multiline />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  /* ── Gallery ── */
  if (type === 'gallery') {
    const images = (data.images as { url: string; alt?: string }[]) ?? []
    const cols = images.length <= 2 ? 2 : images.length === 3 ? 3 : images.length <= 6 ? 3 : 4
    return (
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InlineEditable as="h2" value={(data.title as string) || ''} onChange={(v) => update('title', v)} className="text-3xl font-bold text-[#1B2A6B] mb-10 text-center" placeholder="Gallery title" />
          <div className={`grid gap-4 grid-cols-2 ${cols >= 3 ? 'md:grid-cols-3' : ''} ${cols >= 4 ? 'lg:grid-cols-4' : ''}`}>
            {images.map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden">
                <InlineImageEdit src={img.url} alt={img.alt || `Image ${i + 1}`} className="rounded-xl w-full h-full object-cover" onChange={(url) => updateItem('images', images, i, 'url', url)} bucket="portfolio" folder="gallery" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  /* ── Stats ── */
  if (type === 'stats') {
    const items = (data.items as { label: string; value: string }[]) ?? []
    return (
      <section className="bg-gradient-to-r from-[#1B2A6B] via-[#243a7a] to-[#2a3d8a] text-white py-16 lg:py-20 my-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
            {items.map((stat, i) => (
              <div key={i} className="relative">
                <InlineEditable as="span" value={stat.value} onChange={(v) => updateItem('items', items, i, 'value', v)} className="block text-4xl md:text-5xl font-bold text-[#F7941D] mb-2 tabular-nums" placeholder="0" />
                <InlineEditable as="span" value={stat.label} onChange={(v) => updateItem('items', items, i, 'label', v)} className="text-sm md:text-base opacity-90" placeholder="Label" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  /* ── Products ── */
  if (type === 'products') {
    const items = (data.items as { title: string; description: string; link?: string; comingSoon?: boolean; imageUrl?: string }[]) ?? []
    return (
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InlineEditable as="h2" value={(data.title as string) || ''} onChange={(v) => update('title', v)} className="text-3xl md:text-4xl font-bold text-[#1B2A6B] text-center mb-2" placeholder="Section title" />
          <InlineEditable as="p" value={(data.subtitle as string) || ''} onChange={(v) => update('subtitle', v)} className="text-center text-lg text-gray-600 mb-10" placeholder="Subtitle" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, i) => (
              <div key={i} className="bg-[#FAFAFA] rounded-2xl border border-gray-100 relative overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <InlineImageEdit src={item.imageUrl} alt={item.title} className="rounded-t-2xl object-cover w-full h-full" onChange={(url) => updateItem('items', items, i, 'imageUrl', url)} bucket="portfolio" folder="product" />
                </div>
                <div className="p-6">
                  <InlineEditable as="h3" value={item.title} onChange={(v) => updateItem('items', items, i, 'title', v)} className="text-xl font-bold text-[#1B2A6B] mb-3" placeholder="Product title" />
                  <InlineEditable as="p" value={item.description} onChange={(v) => updateItem('items', items, i, 'description', v)} className="text-gray-600 text-sm" placeholder="Description" multiline />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  /* ── Testimonial ── */
  if (type === 'testimonial') {
    return (
      <section className="bg-[#FAFAFA] py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <svg className="w-10 h-10 text-[#F7941D] mx-auto mb-6 opacity-60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
          <blockquote className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8">
            <InlineEditable as="span" value={(data.quote as string) || ''} onChange={(v) => update('quote', v)} className="italic" placeholder="Add a testimonial quote…" multiline />
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            {((data.photoUrl as string) || true) && (
              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                <InlineImageEdit src={(data.photoUrl as string) || ''} alt={(data.author as string) || 'Photo'} className="rounded-full w-full h-full object-cover" onChange={(url) => update('photoUrl', url)} bucket="team-photos" folder="testimonial" />
              </div>
            )}
            <div className="text-left">
              <InlineEditable as="p" value={(data.author as string) || ''} onChange={(v) => update('author', v)} className="font-semibold text-[#1B2A6B]" placeholder="Author name" />
              <InlineEditable as="p" value={[(data.role as string), (data.company as string)].filter(Boolean).join(', ') || ''} onChange={(v) => { const parts = v.split(',').map(s => s.trim()); update('role', parts[0] || ''); update('company', parts[1] || '') }} className="text-sm text-gray-500" placeholder="Role, Company" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ── Video ── */
  if (type === 'video') {
    const videoUrl = (data.videoUrl as string) || ''
    let embedUrl: string | null = null
    try {
      const u = new URL(videoUrl)
      if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
        const id = u.hostname.includes('youtu.be') ? u.pathname.slice(1) : u.searchParams.get('v')
        embedUrl = id ? `https://www.youtube.com/embed/${id}` : null
      } else if (u.hostname.includes('vimeo.com')) {
        const id = u.pathname.split('/').filter(Boolean).pop()
        embedUrl = id ? `https://player.vimeo.com/video/${id}` : null
      }
    } catch { /* ignore */ }

    return (
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <InlineEditable as="h2" value={(data.heading as string) || ''} onChange={(v) => update('heading', v)} className="text-3xl font-bold text-[#1B2A6B] mb-8 text-center" placeholder="Video heading (optional)" />
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
            {embedUrl ? (
              <iframe src={embedUrl} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 w-full h-full" />
            ) : (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
                <p className="text-sm">Paste a YouTube or Vimeo URL in section settings</p>
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <InlineEditable as="p" value={(data.caption as string) || ''} onChange={(v) => update('caption', v)} className="text-sm text-gray-500" placeholder="Caption (optional)" />
          </div>
        </div>
      </section>
    )
  }

  /* ── Logos ── */
  if (type === 'logos') {
    const logos = (data.logos as { name: string; imageUrl?: string }[]) ?? []
    return (
      <section className="bg-[#FAFAFA] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InlineEditable as="p" value={(data.title as string) || ''} onChange={(v) => update('title', v)} className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8" placeholder="Trusted by" />
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {logos.map((logo, i) => (
              <div key={i} className="flex items-center justify-center h-12">
                {logo.imageUrl && logo.imageUrl.trim() ? (
                  <InlineImageEdit src={logo.imageUrl} alt={logo.name} className="max-h-12 max-w-[140px] object-contain" onChange={(url) => updateItem('logos', logos, i, 'imageUrl', url)} bucket="logos" folder="partner" />
                ) : (
                  <InlineEditable as="span" value={logo.name} onChange={(v) => updateItem('logos', logos, i, 'name', v)} className="text-lg font-bold text-gray-400 px-4" placeholder="Logo name" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  /* ── FAQ ── */
  if (type === 'faq') {
    const items = (data.items as { question: string; answer: string }[]) ?? []
    return (
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <InlineEditable as="h2" value={(data.title as string) || ''} onChange={(v) => update('title', v)} className="text-3xl font-bold text-[#1B2A6B] mb-10 text-center" placeholder="FAQ title" />
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden p-4">
                <InlineEditable as="p" value={item.question} onChange={(v) => updateItem('items', items, i, 'question', v)} className="font-semibold text-[#1B2A6B]" placeholder="Question" />
                <InlineEditable as="p" value={item.answer} onChange={(v) => updateItem('items', items, i, 'answer', v)} className="text-gray-600 mt-2 leading-relaxed" placeholder="Answer" multiline />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  /* ── CTA ── */
  if (type === 'cta') {
    return (
      <section className="bg-[#1B2A6B] py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <InlineEditable as="h2" value={(data.title as string) || ''} onChange={(v) => update('title', v)} className="text-3xl font-bold mb-4" placeholder="CTA title" />
          <InlineEditable as="p" value={(data.description as string) || ''} onChange={(v) => update('description', v)} className="text-lg opacity-90 mb-8" placeholder="CTA description" multiline />
          <span className="inline-block bg-[#F7941D] text-white px-8 py-3.5 rounded-xl font-semibold">
            <InlineEditable value={(data.buttonText as string) || 'Contact us'} onChange={(v) => update('buttonText', v)} placeholder="Button text" />
          </span>
        </div>
      </section>
    )
  }

  /* ── Divider ── */
  if (type === 'divider') {
    const size = (data.size as string) || 'md'
    const showLine = data.showLine !== false
    const py = size === 'sm' ? 'py-4' : size === 'lg' ? 'py-16' : 'py-8'
    return (
      <div className={`${py} text-center`}>
        {showLine && <hr className="max-w-7xl mx-auto border-gray-200" />}
        <p className="text-xs text-gray-300 mt-2">Divider — adjust in settings</p>
      </div>
    )
  }

  /* ── Form ── */
  if (type === 'form') {
    const formType = (data.formType as string) || 'contact'
    return (
      <section className="bg-[#FAFAFA] py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-sm font-medium">{formType === 'agent' ? 'Agent registration form' : 'Contact form'}</p>
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
  } catch { return null }
}
