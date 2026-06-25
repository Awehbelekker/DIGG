'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Page, PageSection, Insight, SectionType } from '@/lib/types/database'
import { SECTION_TYPES, DEFAULT_SECTION_DATA } from '@/lib/section-config'
import { isBuiltinPageSlug } from '@/lib/builtin-pages'
import { defaultSectionsForSlug } from '@/lib/builtin-pages'
import { allowedSectionTypesForPage } from '@/lib/page-section-allowlist'
import DropUpload from '@/components/admin/DropUpload'
import WorkItemPicker, { WorkItemBulkFill } from '@/components/admin/WorkItemPicker'
import { createClient } from '@/lib/supabase/client'
import { showToast } from '@/components/admin/Toast'
import { savePageSections, resetPageToDefaults, switchPageToGrapesjs } from '@/app/admin/(dashboard)/pages/actions'
import { useUnsavedChangesAlert } from '@/lib/hooks/useUnsavedChangesAlert'
import type { MarqueeFeedMode, MarqueeItemKind } from '@/lib/marquee'
import type { WorkCardEditorItem } from '@/lib/insight-work-card'

type GridItem = { title: string; description: string; imageUrl?: string }
type ServiceItem = { title: string; description: string; icon?: string; imageUrl?: string }
type ProductItem = WorkCardEditorItem
type StatItem = { label: string; value: string }

function sectionLabel(type: string, index: number): string {
  const found = SECTION_TYPES.find((s) => s.type === type)
  return `${found?.label ?? type} #${index + 1}`
}

function HeroFields({
  data,
  onChange,
}: {
  data: Record<string, unknown>
  onChange: (d: Record<string, unknown>) => void
}) {
  const set = (key: string, value: string) => onChange({ ...data, [key]: value })
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Eyebrow</span>
        <input
          type="text"
          value={String(data.eyebrow ?? '')}
          onChange={(e) => set('eyebrow', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Headline (before emphasis word)</span>
        <input
          type="text"
          value={String(data.title ?? '')}
          onChange={(e) => set('title', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Emphasis word (coloured)</span>
        <input
          type="text"
          value={String(data.emphasisWord ?? '')}
          onChange={(e) => set('emphasisWord', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          placeholder="investments"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Subtitle</span>
        <textarea
          value={String(data.subtitle ?? '')}
          onChange={(e) => set('subtitle', e.target.value)}
          rows={4}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </label>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Primary button text</span>
          <input
            type="text"
            value={String(data.primaryCTAtext ?? '')}
            onChange={(e) => set('primaryCTAtext', e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Primary button link</span>
          <input
            type="text"
            value={String(data.primaryCTAhref ?? '')}
            onChange={(e) => set('primaryCTAhref', e.target.value)}
            placeholder="/insights or https://instagram.com/..."
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Secondary button text</span>
          <input
            type="text"
            value={String(data.secondaryCTAtext ?? '')}
            onChange={(e) => set('secondaryCTAtext', e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Secondary button link</span>
          <input
            type="text"
            value={String(data.secondaryCTAhref ?? '')}
            onChange={(e) => set('secondaryCTAhref', e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </label>
      </div>
      <div>
        <span className="text-sm font-medium text-gray-700">Background image</span>
        <p className="text-xs text-gray-500 mb-1">Or set site-wide hero image in Settings.</p>
        <DropUpload
          compact
          value={String(data.backgroundImageUrl ?? '')}
          onChange={(url) => set('backgroundImageUrl', url)}
          folder="hero"
          label="Hero background"
        />
      </div>
    </div>
  )
}

function TextFields({
  data,
  onChange,
}: {
  data: Record<string, unknown>
  onChange: (d: Record<string, unknown>) => void
}) {
  const set = (key: string, value: string) => onChange({ ...data, [key]: value })
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Heading</span>
        <input
          type="text"
          value={String(data.heading ?? '')}
          onChange={(e) => set('heading', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Body</span>
        <textarea
          value={String(data.body ?? '')}
          onChange={(e) => set('body', e.target.value)}
          rows={8}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-[13px]"
        />
      </label>
    </div>
  )
}

function CtaFields({
  data,
  onChange,
}: {
  data: Record<string, unknown>
  onChange: (d: Record<string, unknown>) => void
}) {
  const set = (key: string, value: string) => onChange({ ...data, [key]: value })
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Eyebrow (optional)</span>
        <input type="text" value={String(data.kick ?? '')} onChange={(e) => set('kick', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Title</span>
        <input type="text" value={String(data.title ?? '')} onChange={(e) => set('title', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Description</span>
        <textarea value={String(data.description ?? '')} onChange={(e) => set('description', e.target.value)} rows={3} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
      </label>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Button text</span>
          <input type="text" value={String(data.buttonText ?? '')} onChange={(e) => set('buttonText', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Button link</span>
          <input type="text" value={String(data.buttonLink ?? '')} onChange={(e) => set('buttonLink', e.target.value)} placeholder="/contact or https://..." className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
        </label>
      </div>
    </div>
  )
}

export default function SectionPageEditor({ page }: { page: Page }) {
  const router = useRouter()
  const initial = (page.content as { sections?: PageSection[] })?.sections ?? []
  const fallback = defaultSectionsForSlug(page.slug) ?? []
  const [sections, setSections] = useState<PageSection[]>(
    initial.length > 0 ? initial : fallback
  )
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(initial.length > 0 ? initial : fallback))
  const [title, setTitle] = useState(page.title)
  const [slug, setSlug] = useState(page.slug)
  const [published, setPublished] = useState(page.published)
  const [metaTitle, setMetaTitle] = useState(page.meta_title ?? '')
  const [metaDescription, setMetaDescription] = useState(page.meta_description ?? '')
  const [saving, setSaving] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [addSectionType, setAddSectionType] = useState<SectionType>('text')
  const [switchingEditor, setSwitchingEditor] = useState(false)
  const [publishedInsights, setPublishedInsights] = useState<
    Pick<Insight, 'id' | 'slug' | 'title' | 'excerpt' | 'cover_image_url' | 'content_type' | 'project_status'>[]
  >([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('insights')
      .select('id, slug, title, excerpt, cover_image_url, content_type, project_status')
      .eq('published', true)
      .order('updated_at', { ascending: false })
      .then(({ data }) => setPublishedInsights(data ?? []))
  }, [])

  const dirty = useMemo(
    () =>
      JSON.stringify(sections) !== savedSnapshot ||
      title !== page.title ||
      slug !== page.slug ||
      published !== page.published ||
      metaTitle !== (page.meta_title ?? '') ||
      metaDescription !== (page.meta_description ?? ''),
    [sections, savedSnapshot, title, slug, published, metaTitle, metaDescription, page]
  )
  useUnsavedChangesAlert(dirty)

  const updateSection = useCallback((index: number, data: Record<string, unknown>) => {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, data } : s)))
  }, [])

  const addableTypes = useMemo(() => {
    const allowed = allowedSectionTypesForPage(page.slug)
    const pool = allowed
      ? SECTION_TYPES.filter((s) => allowed.includes(s.type))
      : SECTION_TYPES
    return pool
  }, [page.slug])

  const addSection = () => {
    const data = DEFAULT_SECTION_DATA[addSectionType]
    const next = [...sections, { type: addSectionType, data: structuredClone(data) }]
    setSections(next)
    setOpenIndex(next.length - 1)
  }

  const removeSection = (index: number) => {
    const label = sectionLabel(sections[index].type, index)
    if (!globalThis.confirm(`Remove “${label}”?`)) return
    setSections((prev) => prev.filter((_, i) => i !== index))
    setOpenIndex((prev) => {
      if (prev === null) return null
      if (prev === index) return null
      if (prev > index) return prev - 1
      return prev
    })
  }

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= sections.length) return
    setSections((prev) => {
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    setOpenIndex(target)
  }

  const handleSwitchToGrapesjs = async () => {
    const msg =
      'Switch to the visual builder? Your current sections will be converted to HTML as a starting point. Mockup components will not auto-sync after that — layout becomes freeform. You can switch back to the section editor later (sections reset to defaults).'
    if (!globalThis.confirm(msg)) return
    if (dirty) {
      showToast('Save your changes first, then switch to the visual builder.', 'error')
      return
    }
    setSwitchingEditor(true)
    try {
      await switchPageToGrapesjs(page.id)
      showToast('Switched to visual builder.')
      router.refresh()
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not switch editor', 'error')
    } finally {
      setSwitchingEditor(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await savePageSections(page.id, {
        title,
        slug,
        published,
        meta_title: metaTitle,
        meta_description: metaDescription,
        sections,
      })
      setSavedSnapshot(JSON.stringify(sections))
      showToast('Page saved — changes are live.')
      router.refresh()
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!isBuiltinPageSlug(page.slug)) return
    if (!globalThis.confirm('Reset all sections to the default brief-aligned content? This replaces your edits.')) return
    setSaving(true)
    try {
      await resetPageToDefaults(page.id, page.slug)
      const defaults = defaultSectionsForSlug(page.slug) ?? []
      setSections(defaults)
      setSavedSnapshot(JSON.stringify(defaults))
      showToast('Reset to defaults.')
      router.refresh()
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Reset failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const renderSectionBody = (section: PageSection, index: number) => {
    const { type, data } = section
    const onChange = (d: Record<string, unknown>) => updateSection(index, d)

    if (type === 'hero') return <HeroFields data={data} onChange={onChange} />
    if (type === 'text') return <TextFields data={data} onChange={onChange} />
    if (type === 'cta') return <CtaFields data={data} onChange={onChange} />
    if (type === 'marquee') {
      type RawItem = { kind?: MarqueeItemKind; text?: string; word?: string }
      const items = (data.items as RawItem[]) ?? []
      const speed = (data.speed as string) || 'normal'
      const direction = (data.direction as string) || 'left'
      const pauseOnHover = Boolean(data.pauseOnHover)
      const feedMode = (data.feedMode as MarqueeFeedMode) || 'off'
      const feedLimit = Number(data.feedLimit) || 8

      const normalized = items.map((item) => ({
        kind: (item.kind === 'phrase' ? 'phrase' : 'word') as MarqueeItemKind,
        text: item.text ?? item.word ?? '',
      }))

      const setItems = (next: { kind: MarqueeItemKind; text: string }[]) =>
        onChange({ ...data, items: next })
      const setMeta = (patch: Record<string, unknown>) => onChange({ ...data, ...patch })

      return (
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            Pillar words scroll in bold with a coral dot. Motivation phrases appear lighter and italic between them.
            Enable Work feed to auto-insert project titles or excerpts after each pillar word.
          </p>
          <div className="space-y-2">
            {normalized.map((item, i) => (
              <div key={i} className="flex flex-wrap gap-2">
                <select
                  value={item.kind}
                  onChange={(e) => {
                    const next = [...normalized]
                    next[i] = { ...item, kind: e.target.value as MarqueeItemKind }
                    setItems(next)
                  }}
                  className="px-3 py-2 border rounded-lg text-sm w-36 shrink-0"
                >
                  <option value="word">Pillar word</option>
                  <option value="phrase">Motivation</option>
                </select>
                <input
                  type="text"
                  value={item.text}
                  placeholder={item.kind === 'word' ? 'Develop' : 'Build for the long term'}
                  onChange={(e) => {
                    const next = [...normalized]
                    next[i] = { ...item, text: e.target.value }
                    setItems(next)
                  }}
                  className="flex-1 min-w-[160px] px-3 py-2 border rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={() => setItems(normalized.filter((_, idx) => idx !== i))}
                  className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-sm shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setItems([...normalized, { kind: 'word', text: '' }])}
              className="text-sm font-semibold text-[#B56244] hover:underline"
            >
              + Add pillar word
            </button>
            <button
              type="button"
              onClick={() => setItems([...normalized, { kind: 'phrase', text: '' }])}
              className="text-sm font-semibold text-[#152232] hover:underline"
            >
              + Add motivation phrase
            </button>
          </div>
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Work feed (auto phrases)</h4>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Insert from Work feed</span>
              <select
                value={feedMode}
                onChange={(e) => setMeta({ feedMode: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="off">Off — manual items only</option>
                <option value="titles">After each pillar word — project titles</option>
                <option value="excerpts">After each pillar word — excerpts (trimmed)</option>
              </select>
            </label>
            {feedMode !== 'off' && (
              <label className="block">
                <span className="text-sm font-medium text-gray-700">How many Work items to pull</span>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={feedLimit}
                  onChange={(e) => setMeta({ feedLimit: Number(e.target.value) || 8 })}
                  className="mt-1 w-full px-3 py-2 border rounded-lg text-sm"
                />
                <span className="text-xs text-gray-500 mt-1 block">
                  Uses latest published Work items ({publishedInsights.length} available).
                </span>
              </label>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Scroll speed</span>
              <select
                value={speed}
                onChange={(e) => setMeta({ speed: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="slow">Slow</option>
                <option value="normal">Normal</option>
                <option value="fast">Fast</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Direction</span>
              <select
                value={direction}
                onChange={(e) => setMeta({ direction: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="left">Scroll left</option>
                <option value="right">Scroll right</option>
              </select>
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={pauseOnHover}
              onChange={(e) => setMeta({ pauseOnHover: e.target.checked })}
            />
            Pause animation when hovered
          </label>
          <p className="text-xs text-gray-500">Save first, then use Preview draft to check the full scroll.</p>
        </div>
      )
    }
    if (type === 'contact_details') {
      return (
        <p className="text-sm text-gray-600">
          Email, phone, location, WhatsApp and Instagram are edited in{' '}
          <Link href="/admin/settings" className="text-[#B56244] font-semibold hover:underline">
            Settings → Contact & social
          </Link>
          .
        </p>
      )
    }
    if (type === 'contact_layout') {
      const set = (key: string, value: string) => onChange({ ...data, [key]: value })
      return (
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Eyebrow</span>
            <input type="text" value={String(data.kick ?? '')} onChange={(e) => set('kick', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Title</span>
            <input type="text" value={String(data.title ?? '')} onChange={(e) => set('title', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Intro</span>
            <textarea value={String(data.intro ?? '')} onChange={(e) => set('intro', e.target.value)} rows={6} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
          </label>
          <p className="text-xs text-gray-500">Contact details (email, phone, location) come from Settings.</p>
        </div>
      )
    }
    if (type === 'about_hero') {
      const set = (key: string, value: string) => onChange({ ...data, [key]: value })
      return (
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Eyebrow</span>
            <input type="text" value={String(data.kick ?? '')} onChange={(e) => set('kick', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Title</span>
            <textarea value={String(data.title ?? '')} onChange={(e) => set('title', e.target.value)} rows={2} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Body</span>
            <textarea value={String(data.body ?? '')} onChange={(e) => set('body', e.target.value)} rows={8} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
          </label>
          <DropUpload compact value={String(data.portraitImageUrl ?? '')} onChange={(url) => set('portraitImageUrl', url)} folder="team" label="Portrait" />
        </div>
      )
    }
    if (type === 'form') {
      return <p className="text-sm text-gray-500">Contact form — submissions appear under Form Submissions.</p>
    }
    if (type === 'grid') {
      const items = (data.items as GridItem[]) ?? []
      return (
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Section title</span>
            <input
              type="text"
              value={String(data.title ?? '')}
              onChange={(e) => onChange({ ...data, title: e.target.value })}
              className="mt-1 w-full px-3 py-2 border rounded-lg text-sm"
            />
          </label>
          {items.map((item, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
              <p className="text-xs font-semibold text-gray-500">Item {i + 1}</p>
              <input
                type="text"
                value={item.title}
                placeholder="Title"
                onChange={(e) => {
                  const next = [...items]
                  next[i] = { ...item, title: e.target.value }
                  onChange({ ...data, items: next })
                }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <textarea
                value={item.description}
                placeholder="Description"
                rows={2}
                onChange={(e) => {
                  const next = [...items]
                  next[i] = { ...item, description: e.target.value }
                  onChange({ ...data, items: next })
                }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <DropUpload
                compact
                value={item.imageUrl ?? ''}
                onChange={(url) => {
                  const next = [...items]
                  next[i] = { ...item, imageUrl: url }
                  onChange({ ...data, items: next })
                }}
                folder="grid"
                label="Image (optional)"
              />
            </div>
          ))}
        </div>
      )
    }
    if (type === 'services') {
      const items = (data.items as ServiceItem[]) ?? []
      const set = (key: string, value: string) => onChange({ ...data, [key]: value })
      return (
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Eyebrow</span>
            <input type="text" value={String(data.kick ?? '')} onChange={(e) => set('kick', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Section title</span>
            <input type="text" value={String(data.title ?? '')} onChange={(e) => set('title', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Side text (optional)</span>
            <textarea value={String(data.side ?? '')} onChange={(e) => set('side', e.target.value)} rows={2} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" placeholder="Short line shown beside the heading on desktop" />
          </label>
          {items.map((item, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
              <p className="text-xs font-semibold text-gray-500">Service {i + 1}</p>
              <input
                type="text"
                value={item.title}
                placeholder="Title"
                onChange={(e) => {
                  const next = [...items]
                  next[i] = { ...item, title: e.target.value }
                  onChange({ ...data, items: next })
                }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <textarea
                value={item.description}
                placeholder="Description"
                rows={2}
                onChange={(e) => {
                  const next = [...items]
                  next[i] = { ...item, description: e.target.value }
                  onChange({ ...data, items: next })
                }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="text"
                value={item.icon ?? ''}
                placeholder="Emoji icon (if no image)"
                onChange={(e) => {
                  const next = [...items]
                  next[i] = { ...item, icon: e.target.value }
                  onChange({ ...data, items: next })
                }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <DropUpload
                compact
                value={item.imageUrl ?? ''}
                onChange={(url) => {
                  const next = [...items]
                  next[i] = { ...item, imageUrl: url }
                  onChange({ ...data, items: next })
                }}
                folder="services"
                label="Icon image (overrides emoji)"
              />
            </div>
          ))}
        </div>
      )
    }
    if (type === 'products' || type === 'work_cards') {
      const items = (data.items as ProductItem[]) ?? []
      const set = (key: string, value: string) => onChange({ ...data, [key]: value })
      return (
        <div className="space-y-4">
          {type === 'work_cards' && page.slug === 'home' && (
            <p className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              Cards on the live homepage come from this section. Settings → Homepage products no longer overrides these cards (heading/kick only via Settings if set).
            </p>
          )}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Eyebrow</span>
            <input type="text" value={String(data.kick ?? '')} onChange={(e) => set('kick', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Section title</span>
            <input type="text" value={String(data.title ?? '')} onChange={(e) => set('title', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
          </label>
          {type === 'work_cards' ? (
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Side link text</span>
                <input type="text" value={String(data.sideLinkText ?? '')} onChange={(e) => set('sideLinkText', e.target.value)} placeholder="View all work →" className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Side link URL</span>
                <input type="text" value={String(data.sideLinkHref ?? '')} onChange={(e) => set('sideLinkHref', e.target.value)} placeholder="/insights" className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
              </label>
            </div>
          ) : (
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Subtitle</span>
              <input type="text" value={String(data.subtitle ?? '')} onChange={(e) => set('subtitle', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
            </label>
          )}
          {type === 'work_cards' && (
            <div className="flex flex-wrap items-center gap-3">
              <WorkItemBulkFill
                insights={publishedInsights}
                max={4}
                onFill={(filled) => onChange({ ...data, items: filled })}
              />
              <Link href="/admin/insights/new" className="text-xs text-[#B56244] font-semibold hover:underline">
                + New Work item
              </Link>
            </div>
          )}
          {items.map((item, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg border space-y-2">
              <p className="text-xs font-semibold text-gray-500">Project {i + 1}</p>
              {type === 'work_cards' && (
                <WorkItemPicker
                  insights={publishedInsights}
                  cardIndex={i}
                  onSelect={(picked) => {
                    const next = [...items]
                    next[i] = { ...item, ...picked }
                    onChange({ ...data, items: next })
                  }}
                />
              )}
              <input type="text" value={item.title} placeholder="Title" onChange={(e) => { const next = [...items]; next[i] = { ...item, title: e.target.value }; onChange({ ...data, items: next }) }} className="w-full px-3 py-2 border rounded-lg text-sm" />
              <textarea value={item.description} rows={2} onChange={(e) => { const next = [...items]; next[i] = { ...item, description: e.target.value }; onChange({ ...data, items: next }) }} className="w-full px-3 py-2 border rounded-lg text-sm" />
              <input type="text" value={item.link ?? ''} placeholder="Link (/insights/...)" onChange={(e) => { const next = [...items]; next[i] = { ...item, link: e.target.value }; onChange({ ...data, items: next }) }} className="w-full px-3 py-2 border rounded-lg text-sm" />
              <input type="text" value={item.status ?? ''} placeholder="Status badge" onChange={(e) => { const next = [...items]; next[i] = { ...item, status: e.target.value }; onChange({ ...data, items: next }) }} className="w-full px-3 py-2 border rounded-lg text-sm" />
              <DropUpload compact value={item.imageUrl ?? ''} onChange={(url) => { const next = [...items]; next[i] = { ...item, imageUrl: url }; onChange({ ...data, items: next }) }} folder="portfolio" label="Image" />
            </div>
          ))}
        </div>
      )
    }
    if (type === 'stats') {
      const items = (data.items as StatItem[]) ?? []
      return (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <input type="text" value={item.value} placeholder="Value" onChange={(e) => { const next = [...items]; next[i] = { ...item, value: e.target.value }; onChange({ ...data, items: next }) }} className="px-3 py-2 border rounded-lg text-sm" />
              <input type="text" value={item.label} placeholder="Label" onChange={(e) => { const next = [...items]; next[i] = { ...item, label: e.target.value }; onChange({ ...data, items: next }) }} className="px-3 py-2 border rounded-lg text-sm" />
            </div>
          ))}
        </div>
      )
    }
    if (type === 'team') {
      type Member = { name: string; role: string; credential?: string; photoUrl?: string; initials?: string }
      const members = (data.members as Member[]) ?? []
      const set = (key: string, value: string) => onChange({ ...data, [key]: value })
      return (
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Eyebrow</span>
            <input type="text" value={String(data.kick ?? '')} onChange={(e) => set('kick', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Title</span>
            <input type="text" value={String(data.title ?? '')} onChange={(e) => set('title', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
          </label>
          {members.map((m, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg border space-y-2">
              <p className="text-xs font-semibold text-gray-500">Member {i + 1}</p>
              <input type="text" value={m.name} placeholder="Name" onChange={(e) => { const next = [...members]; next[i] = { ...m, name: e.target.value }; onChange({ ...data, members: next }) }} className="w-full px-3 py-2 border rounded-lg text-sm" />
              <input type="text" value={m.role} placeholder="Role" onChange={(e) => { const next = [...members]; next[i] = { ...m, role: e.target.value }; onChange({ ...data, members: next }) }} className="w-full px-3 py-2 border rounded-lg text-sm" />
              <input type="text" value={m.credential ?? ''} placeholder="Credential (optional)" onChange={(e) => { const next = [...members]; next[i] = { ...m, credential: e.target.value }; onChange({ ...data, members: next }) }} className="w-full px-3 py-2 border rounded-lg text-sm" />
              <DropUpload compact value={m.photoUrl ?? ''} onChange={(url) => { const next = [...members]; next[i] = { ...m, photoUrl: url }; onChange({ ...data, members: next }) }} folder="team" label="Photo" />
            </div>
          ))}
        </div>
      )
    }
    if (type === 'pillars_interactive' || type === 'pillars_panel') {
      type Pillar = { letter?: string; title: string; description: string; colorKey?: string; imageUrl?: string }
      const items = (data.items as Pillar[]) ?? []
      const set = (key: string, value: string) => onChange({ ...data, [key]: value })
      return (
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Eyebrow</span>
            <input type="text" value={String(data.kick ?? '')} onChange={(e) => set('kick', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Title</span>
            <input type="text" value={String(data.title ?? '')} onChange={(e) => set('title', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
          </label>
          {type === 'pillars_interactive' && (
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Intro</span>
              <input type="text" value={String(data.intro ?? '')} onChange={(e) => set('intro', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
            </label>
          )}
          {type === 'pillars_panel' ? (
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Body</span>
              <textarea value={String(data.body ?? '')} onChange={(e) => set('body', e.target.value)} rows={4} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
            </label>
          ) : (
            items.map((item, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg border space-y-2">
                <p className="text-xs font-semibold text-gray-500">Pillar {i + 1}</p>
                <input type="text" value={item.letter ?? ''} placeholder="Letter" onChange={(e) => { const next = [...items]; next[i] = { ...item, letter: e.target.value }; onChange({ ...data, items: next }) }} className="w-full px-3 py-2 border rounded-lg text-sm" />
                <input type="text" value={item.title} placeholder="Title" onChange={(e) => { const next = [...items]; next[i] = { ...item, title: e.target.value }; onChange({ ...data, items: next }) }} className="w-full px-3 py-2 border rounded-lg text-sm" />
                <textarea value={item.description} rows={2} onChange={(e) => { const next = [...items]; next[i] = { ...item, description: e.target.value }; onChange({ ...data, items: next }) }} className="w-full px-3 py-2 border rounded-lg text-sm" />
                <select value={item.colorKey ?? 'terra'} onChange={(e) => { const next = [...items]; next[i] = { ...item, colorKey: e.target.value }; onChange({ ...data, items: next }) }} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="terra">Terracotta</option>
                  <option value="navy">Navy</option>
                  <option value="sage">Sage</option>
                  <option value="coral">Coral</option>
                </select>
                <DropUpload
                  compact
                  value={item.imageUrl ?? ''}
                  onChange={(url) => { const next = [...items]; next[i] = { ...item, imageUrl: url }; onChange({ ...data, items: next }) }}
                  folder="pillars"
                  label="Background image (optional)"
                />
              </div>
            ))
          )}
        </div>
      )
    }
    return <p className="text-sm text-gray-500">This section type is read-only here. Use Settings or contact support.</p>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <Link href="/admin/pages" className="text-sm text-[#B56244] hover:underline mb-2 inline-block">
            ← All pages
          </Link>
          <h1 className="text-2xl font-bold text-[#152232]">Edit page: {page.slug}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Change text, images, and button links. Global colours and contact details are in Settings.
          </p>
          {page.slug === 'home' && (
            <p className="text-xs text-gray-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mt-2 max-w-xl">
              <strong>What we do</strong> = Services grid · <strong>Projects on the ground</strong> = Work card grid.
              Upload images or choose from the media library on each card.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/preview/${page.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50"
            title="Shows the last saved version — save first to preview your latest edits"
          >
            Preview draft
          </Link>
          <Link
            href={`/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50"
          >
            View live
          </Link>
          {isBuiltinPageSlug(page.slug) && (
            <button type="button" onClick={handleReset} disabled={saving} className="px-4 py-2 rounded-xl border border-amber-300 text-amber-800 text-sm font-medium hover:bg-amber-50 disabled:opacity-50">
              Reset defaults
            </button>
          )}
          <button
            type="button"
            onClick={handleSwitchToGrapesjs}
            disabled={switchingEditor || saving}
            className="px-4 py-2 rounded-xl border border-[#152232]/20 text-[#152232] text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            title="Advanced freeform layout — mockup sections will not auto-sync"
          >
            {switchingEditor ? 'Switching…' : 'Open visual builder (advanced)'}
          </button>
          <button type="button" onClick={handleSave} disabled={saving || !dirty} className="px-5 py-2 rounded-xl bg-[#B56244] text-white text-sm font-semibold hover:bg-[#9A4F35] disabled:opacity-50">
            {saving ? 'Saving…' : 'Save & publish'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 space-y-4">
        <h2 className="font-semibold text-[#152232]">Page settings</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Title</span>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">URL slug</span>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Published (visible on site)
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">SEO title</span>
          <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">SEO description</span>
          <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} className="mt-1 w-full px-3 py-2 border rounded-lg text-sm" />
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap items-end gap-3">
        <label className="block flex-1 min-w-[200px]">
          <span className="text-sm font-medium text-gray-700">Add section</span>
          <select
            value={addSectionType}
            onChange={(e) => setAddSectionType(e.target.value as SectionType)}
            className="mt-1 w-full px-3 py-2 border rounded-lg text-sm"
          >
            {addableTypes.map((s) => (
              <option key={s.type} value={s.type}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={addSection}
          className="px-4 py-2 rounded-xl bg-[#152232] text-white text-sm font-semibold hover:bg-[#1a2d42]"
        >
          + Add section
        </button>
        <p className="text-xs text-gray-500 w-full">Save first, then use Preview draft to check changes before publishing.</p>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-50">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex-1 flex items-center justify-between text-left hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg"
              >
                <span className="font-semibold text-[#152232]">{sectionLabel(section.type, index)}</span>
                <span className="text-gray-400 text-sm">{openIndex === index ? '▲' : '▼'}</span>
              </button>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveSection(index, -1)}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(index, 1)}
                  disabled={index === sections.length - 1}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                  title="Remove section"
                >
                  ✕
                </button>
              </div>
            </div>
            {openIndex === index && (
              <div className="px-6 pb-6 pt-4">{renderSectionBody(section, index)}</div>
            )}
          </div>
        ))}
      </div>

      {dirty && (
        <p className="mt-6 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          You have unsaved changes. Click Save & publish to update the live site.
        </p>
      )}
    </div>
  )
}
