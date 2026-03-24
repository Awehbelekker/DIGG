'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminPageHeading from '@/components/admin/AdminPageHeading'
import SettingsUrlValidation from '@/components/admin/SettingsUrlValidation'
import { GOOGLE_FONT_OPTIONS, DEFAULT_HEADING_FONT, DEFAULT_BODY_FONT } from '@/lib/google-fonts'
import { showToast } from '@/components/admin/Toast'
import DropUpload from '@/components/admin/DropUpload'
import { useRegisterAdminNavUnsaved } from '@/components/admin/AdminUnsavedProvider'
import { useUnsavedChangesAlert } from '@/lib/hooks/useUnsavedChangesAlert'

type SelectedWorkItem = { title: string; place: string; imageUrl?: string; link?: string }

function parseSelectedWork(v: unknown): SelectedWorkItem[] {
  if (Array.isArray(v)) return v
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

type HomepageProductItem = { title: string; description: string; imageUrl?: string; link?: string; comingSoon?: boolean }

function parseHomepageProducts(v: unknown): HomepageProductItem[] {
  if (Array.isArray(v)) return v
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function strVal(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, unknown>>({})
  const [savedSettings, setSavedSettings] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const dirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [settings, savedSettings]
  )
  useRegisterAdminNavUnsaved(!loading && dirty)
  useUnsavedChangesAlert(!loading && dirty)

  useEffect(() => {
    loadSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, [])

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')

    if (error) {
      console.error('Error loading settings:', error)
    } else {
      const settingsMap: Record<string, unknown> = {}
      data?.forEach((setting: { key: string; value: unknown }) => {
        let val = setting.value
        if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
          try {
            val = JSON.parse(val)
          } catch {
            // keep string
          }
        }
        settingsMap[setting.key] = val
      })
      setSettings(settingsMap)
      setSavedSettings(JSON.parse(JSON.stringify(settingsMap)) as Record<string, unknown>)
    }
    setLoading(false)
  }

  const handleSave = async (key: string, value: unknown) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key,
          value: typeof value === 'string' ? value : JSON.stringify(value),
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' })

      if (error) throw error

      setSettings((prev) => ({ ...prev, [key]: value }))
      setSavedSettings((prev) => ({ ...prev, [key]: value }))
      showToast('Settings saved!')
    } catch (err) {
      showToast('Error saving settings: ' + (err instanceof Error ? err.message : String(err)), 'error')
    } finally {
      setSaving(false)
    }
  }

  const selectedWork = parseSelectedWork(settings.selected_work)
  const setSelectedWork = (next: SelectedWorkItem[]) => {
    setSettings({ ...settings, selected_work: next })
  }
  const addSelectedWorkItem = () => {
    setSelectedWork([...selectedWork, { title: '', place: '' }])
  }
  const updateSelectedWorkItem = (index: number, updates: Partial<SelectedWorkItem>) => {
    const next = [...selectedWork]
    next[index] = { ...next[index], ...updates }
    setSelectedWork(next)
  }
  const removeSelectedWorkItem = (index: number) => {
    setSelectedWork(selectedWork.filter((_, i) => i !== index))
  }
  const moveSelectedWorkItem = (index: number, dir: 'up' | 'down') => {
    const j = dir === 'up' ? index - 1 : index + 1
    if (j < 0 || j >= selectedWork.length) return
    const next = [...selectedWork]
    ;[next[index], next[j]] = [next[j], next[index]]
    setSelectedWork(next)
  }
  const saveSelectedWork = () => {
    handleSave('selected_work', selectedWork)
  }

  const homepageProducts = parseHomepageProducts(settings.homepage_products)
  const setHomepageProducts = (next: HomepageProductItem[]) => {
    setSettings({ ...settings, homepage_products: next })
  }
  const addHomepageProduct = () => {
    setHomepageProducts([...homepageProducts, { title: '', description: '', link: '', comingSoon: false }])
  }
  const updateHomepageProduct = (index: number, updates: Partial<HomepageProductItem>) => {
    const next = [...homepageProducts]
    next[index] = { ...next[index], ...updates }
    setHomepageProducts(next)
  }
  const removeHomepageProduct = (index: number) => {
    setHomepageProducts(homepageProducts.filter((_, i) => i !== index))
  }
  const moveHomepageProduct = (index: number, dir: 'up' | 'down') => {
    const j = dir === 'up' ? index - 1 : index + 1
    if (j < 0 || j >= homepageProducts.length) return
    const next = [...homepageProducts]
    ;[next[index], next[j]] = [next[j], next[index]]
    setHomepageProducts(next)
  }
  const saveHomepageProducts = () => {
    handleSave('homepage_products', homepageProducts)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdminPageHeading className="mb-8" subtitle="Contact details, hero image, sharing, Selected Work, and Homepage Products.">
        <span className="inline-flex items-center gap-2 flex-wrap">
          Site Settings
          {dirty && (
            <span className="text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
              Unsaved changes
            </span>
          )}
        </span>
      </AdminPageHeading>

      <div className="space-y-8">
        <SettingsUrlValidation settings={settings} />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-[#1B2A6B]">Contact & identity</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <div className="flex space-x-2">
              <input
                type="email"
                value={String(strVal(settings.contact_email) || 'judy@digg-ct.co.za')}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              />
              <button
                onClick={() => handleSave('contact_email', strVal(settings.contact_email) || 'judy@digg-ct.co.za')}
                disabled={saving}
                className="px-6 py-2 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="flex space-x-2">
              <input
                type="tel"
                value={strVal(settings.phone) || '082 707 7080'}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              />
              <button
                onClick={() => handleSave('phone', strVal(settings.phone) || '082 707 7080')}
                disabled={saving}
                className="px-6 py-2 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={strVal(settings.site_name) || 'DIGG Architecture'}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              />
              <button
                onClick={() => handleSave('site_name', strVal(settings.site_name) || 'DIGG Architecture')}
                disabled={saving}
                className="px-6 py-2 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-[#1B2A6B]">Logo</h2>
          <p className="text-sm text-gray-500">Logo image, size, and position in navbar and footer.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
            <p className="text-xs text-gray-500 mb-1">Drop a logo image or paste a URL. Leave blank for default.</p>
            <DropUpload
              compact
              value={strVal(settings.logo_url)}
              onChange={(url) => { setSettings({ ...settings, logo_url: url }); handleSave('logo_url', url) }}
              bucket="logos"
              folder="logo"
              label="Logo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo size</label>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                aria-label="Logo size"
                value={strVal(settings.logo_size) || 'medium'}
                onChange={(e) => setSettings({ ...settings, logo_size: e.target.value })}
                className="min-w-[140px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
              <button
                onClick={() => handleSave('logo_size', settings.logo_size ?? 'medium')}
                disabled={saving}
                className="px-6 py-2 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Navbar logo position</label>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                aria-label="Navbar logo position"
                value={strVal(settings.navbar_logo_position) || 'left'}
                onChange={(e) => setSettings({ ...settings, navbar_logo_position: e.target.value })}
                className="min-w-[140px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
              </select>
              <button
                onClick={() => handleSave('navbar_logo_position', settings.navbar_logo_position ?? 'left')}
                disabled={saving}
                className="px-6 py-2 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Footer logo position</label>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                aria-label="Footer logo position"
                value={strVal(settings.footer_logo_position) || 'left'}
                onChange={(e) => setSettings({ ...settings, footer_logo_position: e.target.value })}
                className="min-w-[140px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
              </select>
              <button
                onClick={() => handleSave('footer_logo_position', settings.footer_logo_position ?? 'left')}
                disabled={saving}
                className="px-6 py-2 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-[#1B2A6B]">Typography</h2>
          <p className="text-sm text-gray-500">Choose fonts for headings and body text. Options are from Google Fonts and apply across the whole site.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Heading font</label>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                aria-label="Heading font"
                value={strVal(settings.heading_font) || DEFAULT_HEADING_FONT}
                onChange={(e) => setSettings({ ...settings, heading_font: e.target.value })}
                className="min-w-[220px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              >
                {GOOGLE_FONT_OPTIONS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleSave('heading_font', settings.heading_font ?? DEFAULT_HEADING_FONT)}
                disabled={saving}
                className="px-6 py-2 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Body font</label>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                aria-label="Body font"
                value={strVal(settings.body_font) || DEFAULT_BODY_FONT}
                onChange={(e) => setSettings({ ...settings, body_font: e.target.value })}
                className="min-w-[220px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              >
                {GOOGLE_FONT_OPTIONS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleSave('body_font', settings.body_font ?? DEFAULT_BODY_FONT)}
                disabled={saving}
                className="px-6 py-2 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-[#1B2A6B]">Homepage content (headlines & copy)</h2>
          <p className="text-sm text-gray-500">Edit the main text on the homepage. Leave blank to use the default copy.</p>
          {[
            { key: 'hero_title', label: 'Hero headline', value: strVal(settings.hero_title), placeholder: 'Your Property Should Be Working Harder.' },
            { key: 'hero_subtitle', label: 'Hero subtitle', value: strVal(settings.hero_subtitle), placeholder: 'DIGG is a Cape Town architecture practice...' },
            { key: 'hero_primary_cta_text', label: 'Hero primary button text', value: strVal(settings.hero_primary_cta_text), placeholder: 'See What We Do' },
            { key: 'hero_primary_cta_href', label: 'Hero primary button link', value: strVal(settings.hero_primary_cta_href), placeholder: '#products' },
            { key: 'hero_secondary_cta_text', label: 'Hero secondary button text', value: strVal(settings.hero_secondary_cta_text), placeholder: 'Talk to Our Team' },
            { key: 'hero_secondary_cta_href', label: 'Hero secondary button link', value: strVal(settings.hero_secondary_cta_href), placeholder: '/contact' },
            { key: 'selected_work_heading', label: 'Selected Work section heading', value: strVal(settings.selected_work_heading), placeholder: 'Selected Work' },
            { key: 'selected_work_intro', label: 'Selected Work intro paragraph', value: strVal(settings.selected_work_intro), placeholder: 'A selection of projects...' },
            { key: 'selected_work_cta_text', label: 'Selected Work link text', value: strVal(settings.selected_work_cta_text), placeholder: 'Discuss your project →' },
            { key: 'products_heading', label: 'Products section heading', value: strVal(settings.products_heading), placeholder: 'Built Products. Proven Solutions.' },
            { key: 'products_intro', label: 'Products section intro', value: strVal(settings.products_intro), placeholder: "We've turned decades of..." },
            { key: 'agents_heading', label: 'Estate agents strip heading', value: strVal(settings.agents_heading), placeholder: 'Are You an Estate Agent?' },
            { key: 'agents_intro', label: 'Estate agents strip paragraph', value: strVal(settings.agents_intro), placeholder: 'Give your sellers something...' },
            { key: 'agents_cta_text', label: 'Estate agents button text', value: strVal(settings.agents_cta_text), placeholder: 'Partner With DIGG' },
          ].map(({ key, label, value, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
                  placeholder={placeholder}
                />
                <button
                  onClick={() => handleSave(key, settings[key] ?? '')}
                  disabled={saving}
                  className="px-6 py-2 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Middle strip (3 boxes)</label>
            <p className="text-xs text-gray-500 mb-2">Title and body for each of the three value boxes (e.g. Untapped Value, Intelligent Design, Full-Service Partnership).</p>
            {[0, 1, 2].map((i) => {
              const raw = Array.isArray(settings.homepage_strip) && settings.homepage_strip[i] ? settings.homepage_strip[i] : null
              const strip = raw && typeof raw === 'object' && 'title' in raw && 'body' in raw
                ? { title: strVal((raw as Record<string, unknown>).title), body: strVal((raw as Record<string, unknown>).body) }
                : { title: '', body: '' }
              return (
                <div key={i} className="mb-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">Box {i + 1}</p>
                  <input
                    type="text"
                    value={strip.title}
                    onChange={(e) => {
                      const next = [...(Array.isArray(settings.homepage_strip) ? settings.homepage_strip : [{ title: '', body: '' }, { title: '', body: '' }, { title: '', body: '' }])]
                      while (next.length <= i) next.push({ title: '', body: '' })
                      next[i] = { ...next[i], title: e.target.value }
                      setSettings({ ...settings, homepage_strip: next })
                    }}
                    placeholder="Title"
                    className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <textarea
                    value={strip.body}
                    onChange={(e) => {
                      const next = [...(Array.isArray(settings.homepage_strip) ? settings.homepage_strip : [{ title: '', body: '' }, { title: '', body: '' }, { title: '', body: '' }])]
                      while (next.length <= i) next.push({ title: '', body: '' })
                      next[i] = { ...next[i], body: e.target.value }
                      setSettings({ ...settings, homepage_strip: next })
                    }}
                    placeholder="Body text"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              )
            })}
            <button
              onClick={() => handleSave('homepage_strip', settings.homepage_strip ?? [])}
              disabled={saving}
              className="mt-2 px-6 py-2 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
            >
              Save strip
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-[#1B2A6B]">Homepage hero & sharing</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hero image (homepage)</label>
            <p className="text-xs text-gray-500 mb-1">Drop an image or paste URL. Leave blank for gradient.</p>
            <DropUpload
              value={strVal(settings.hero_image_url)}
              onChange={(url) => { setSettings({ ...settings, hero_image_url: url }); handleSave('hero_image_url', url) }}
              bucket="hero-images"
              folder="hero"
              label="Hero"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
            <p className="text-xs text-gray-500 mb-1">Browser tab icon (.ico or .png).</p>
            <DropUpload
              compact
              value={strVal(settings.favicon_url)}
              onChange={(url) => { setSettings({ ...settings, favicon_url: url }); handleSave('favicon_url', url) }}
              bucket="logos"
              folder="favicon"
              label="Favicon"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">OG image (social sharing)</label>
            <p className="text-xs text-gray-500 mb-1">Shown when site is shared on social media. Recommended 1200x630.</p>
            <DropUpload
              value={strVal(settings.og_image_url)}
              onChange={(url) => { setSettings({ ...settings, og_image_url: url }); handleSave('og_image_url', url) }}
              bucket="hero-images"
              folder="og"
              label="OG image"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#1B2A6B]">Selected Work (homepage)</h2>
          <p className="text-sm text-gray-500">Projects shown on the homepage. Add 3–5 items. Image URL can be from Images (copy link after upload) or any URL.</p>
          {selectedWork.map((item, index) => (
            <div key={index} className="flex flex-wrap gap-3 items-start p-4 rounded-xl bg-[#FAFAFA] border border-gray-100">
              <div className="flex flex-col gap-1 shrink-0">
                <button type="button" onClick={() => moveSelectedWorkItem(index, 'up')} disabled={index === 0} className="p-1.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none" aria-label="Move up">↑</button>
                <button type="button" onClick={() => moveSelectedWorkItem(index, 'down')} disabled={index === selectedWork.length - 1} className="p-1.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none" aria-label="Move down">↓</button>
              </div>
              <input
                type="text"
                placeholder="Project title"
                value={item.title}
                onChange={(e) => updateSelectedWorkItem(index, { title: e.target.value })}
                className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Place (e.g. Cape Town)"
                value={item.place}
                onChange={(e) => updateSelectedWorkItem(index, { place: e.target.value })}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <div className="flex-1 min-w-[180px]">
                <DropUpload
                  compact
                  value={item.imageUrl || ''}
                  onChange={(url) => updateSelectedWorkItem(index, { imageUrl: url })}
                  bucket="portfolio"
                  folder="work"
                  label="Project"
                />
              </div>
              <input
                type="text"
                placeholder="Link (optional)"
                value={item.link || ''}
                onChange={(e) => updateSelectedWorkItem(index, { link: e.target.value })}
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={() => removeSelectedWorkItem(index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSelectedWorkItem}
            className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#F7941D] hover:text-[#F7941D] text-sm font-medium"
          >
            + Add project
          </button>
          {selectedWork.length > 0 && (
            <button
              type="button"
              onClick={saveSelectedWork}
              disabled={saving}
              className="px-6 py-2 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] disabled:opacity-50"
            >
              Save Selected Work
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#1B2A6B]">Homepage Products (Built Products)</h2>
          <p className="text-sm text-gray-500">Products shown in the &quot;Built Products. Proven Solutions.&quot; section on the homepage. Add, edit, reorder; set link or leave blank to go to Contact.</p>
          {homepageProducts.map((item, index) => (
            <div key={index} className="p-4 rounded-xl bg-[#FAFAFA] border border-gray-100 space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <button type="button" onClick={() => moveHomepageProduct(index, 'up')} disabled={index === 0} className="p-1.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40" aria-label="Move up">↑</button>
                <button type="button" onClick={() => moveHomepageProduct(index, 'down')} disabled={index === homepageProducts.length - 1} className="p-1.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40" aria-label="Move down">↓</button>
                <input
                  type="text"
                  placeholder="Product title"
                  value={item.title}
                  onChange={(e) => updateHomepageProduct(index, { title: e.target.value })}
                  className="flex-1 min-w-[160px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <label className="flex items-center gap-2 shrink-0">
                  <input
                    type="checkbox"
                    checked={!!item.comingSoon}
                    onChange={(e) => updateHomepageProduct(index, { comingSoon: e.target.checked })}
                    className="rounded text-[#F7941D]"
                  />
                  <span className="text-sm text-gray-700">Coming soon</span>
                </label>
                <button type="button" onClick={() => removeHomepageProduct(index)} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm">Remove</button>
              </div>
              <DropUpload
                compact
                value={item.imageUrl || ''}
                onChange={(url) => updateHomepageProduct(index, { imageUrl: url })}
                bucket="portfolio"
                folder="product"
                label="Product"
              />
              <textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateHomepageProduct(index, { description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Link (optional, e.g. /contact or full URL)"
                value={item.link || ''}
                onChange={(e) => updateHomepageProduct(index, { link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addHomepageProduct}
            className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#F7941D] hover:text-[#F7941D] text-sm font-medium"
          >
            + Add product
          </button>
          {homepageProducts.length > 0 && (
            <button
              type="button"
              onClick={saveHomepageProducts}
              disabled={saving}
              className="px-6 py-2 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] disabled:opacity-50"
            >
              Save Homepage Products
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
