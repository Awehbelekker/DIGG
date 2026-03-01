'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

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
        settingsMap[setting.key] = setting.value
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#1B2A6B] mb-8">Site Settings</h1>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Email
          </label>
          <div className="flex space-x-2">
            <input
              type="email"
              value={settings.contact_email || 'judy@digg-ct.co.za'}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
            />
            <button
              onClick={() => handleSave('contact_email', settings.contact_email || 'judy@digg-ct.co.za')}
              disabled={saving}
              className="px-6 py-2 bg-[#F7941D] text-white rounded-md font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="flex space-x-2">
            <input
              type="tel"
              value={settings.phone || '082 707 7080'}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
            />
            <button
              onClick={() => handleSave('phone', settings.phone || '082 707 7080')}
              disabled={saving}
              className="px-6 py-2 bg-[#F7941D] text-white rounded-md font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Name
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={settings.site_name || 'DIGG Architecture'}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
            />
            <button
              onClick={() => handleSave('site_name', settings.site_name || 'DIGG Architecture')}
              disabled={saving}
              className="px-6 py-2 bg-[#F7941D] text-white rounded-md font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
