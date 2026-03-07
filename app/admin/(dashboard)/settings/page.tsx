'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminPageHeading from '@/components/admin/AdminPageHeading'
import { GOOGLE_FONT_OPTIONS, DEFAULT_HEADING_FONT, DEFAULT_BODY_FONT } from '@/lib/google-fonts'

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

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')

    if (error) {
      console.error('Error loading settings:', error)
    } else {
      const settingsMap: Record<string, any> = {}
      data?.forEach((setting: any) => {
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
    }
    setLoading(false)
  }

  const handleSave = async (key: string, value: any) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key,
          value: typeof value === 'string' ? value : JSON.stringify(value),
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setSettings({ ...settings, [key]: value })
      alert('Settings saved!')
    } catch (error: any) {
      alert('Error saving settings: ' + error.message)
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdminPageHeading className="mb-8" subtitle="Contact details, hero image, sharing, and Selected Work.">Site Settings</AdminPageHeading>

      <div className="space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-[#1B2A6B]">Contact & identity</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <div className="flex space-x-2">
              <input
                type="email"
                value={settings.contact_email || 'judy@digg-ct.co.za'}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              />
              <button
                onClick={() => handleSave('contact_email', settings.contact_email || 'judy@digg-ct.co.za')}
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
                value={settings.phone || '082 707 7080'}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              />
              <button
                onClick={() => handleSave('phone', settings.phone || '082 707 7080')}
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
                value={settings.site_name || 'DIGG Architecture'}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              />
              <button
                onClick={() => handleSave('site_name', settings.site_name || 'DIGG Architecture')}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
            <p className="text-xs text-gray-500 mb-1">Leave blank to use the default logo (e.g. /logo/digg-logo.png). Use a full URL or path.</p>
            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="text"
                placeholder="/logo/digg-logo.png or https://..."
                value={settings.logo_url ?? ''}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              />
              <button
                onClick={() => handleSave('logo_url', settings.logo_url ?? '')}
                disabled={saving}
                className="px-6 py-2 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo size</label>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                aria-label="Logo size"
                value={settings.logo_size ?? 'medium'}
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
                value={settings.navbar_logo_position ?? 'left'}
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
                value={settings.footer_logo_position ?? 'left'}
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
                value={settings.heading_font ?? DEFAULT_HEADING_FONT}
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
                value={settings.body_font ?? DEFAULT_BODY_FONT}
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
          <h2 className="text-lg font-semibold text-[#1B2A6B]">Homepage hero & sharing</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hero image URL (homepage)</label>
            <p className="text-xs text-gray-500 mb-1">Use a full image URL (e.g. from Images after upload, or an external link). Leave blank for gradient.</p>
            <div className="flex space-x-2">
              <input
                type="url"
                placeholder="https://..."
                value={settings.hero_image_url || ''}
                onChange={(e) => setSettings({ ...settings, hero_image_url: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              />
              <button
                onClick={() => handleSave('hero_image_url', settings.hero_image_url || '')}
                disabled={saving}
                className="px-6 py-2 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
            <p className="text-xs text-gray-500 mb-1">Browser tab icon. Use a direct image URL (e.g. .ico or .png).</p>
            <div className="flex space-x-2">
              <input
                type="url"
                placeholder="https://... or /logo/favicon.ico"
                value={settings.favicon_url || ''}
                onChange={(e) => setSettings({ ...settings, favicon_url: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              />
              <button
                onClick={() => handleSave('favicon_url', settings.favicon_url || '')}
                disabled={saving}
                className="px-6 py-2 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">OG image URL (social sharing)</label>
            <p className="text-xs text-gray-500 mb-1">Image shown when the site is shared (e.g. Facebook, LinkedIn). Recommended 1200×630px.</p>
            <div className="flex space-x-2">
              <input
                type="url"
                placeholder="https://..."
                value={settings.og_image_url || ''}
                onChange={(e) => setSettings({ ...settings, og_image_url: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              />
              <button
                onClick={() => handleSave('og_image_url', settings.og_image_url || '')}
                disabled={saving}
                className="px-6 py-2 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
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
              <input
                type="url"
                placeholder="Image URL"
                value={item.imageUrl || ''}
                onChange={(e) => updateSelectedWorkItem(index, { imageUrl: e.target.value })}
                className="flex-1 min-w-[180px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
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
      </div>
    </div>
  )
}
