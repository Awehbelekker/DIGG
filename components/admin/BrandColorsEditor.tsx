'use client'

import { useMemo, useState } from 'react'
import {
  BRAND_COLOR_LABELS,
  BRAND_COLOR_PRESETS,
  BRAND_PREVIEW_STORAGE_KEY,
  DEFAULT_BRAND_COLORS,
  isValidHexColor,
  normalizeHexColor,
  parseBrandColors,
  type BrandColorKey,
  type BrandColors,
} from '@/lib/brand-colors'

type BrandColorsEditorProps = {
  value: BrandColors
  savedValue: BrandColors
  onChange: (colors: BrandColors) => void
  onSave: (colors: BrandColors) => Promise<void>
  saving: boolean
}

export default function BrandColorsEditor({
  value,
  savedValue,
  onChange,
  onSave,
  saving,
}: BrandColorsEditorProps) {
  const [presetId, setPresetId] = useState('digg-default')

  const dirty = useMemo(() => JSON.stringify(value) !== JSON.stringify(savedValue), [value, savedValue])

  const updateColor = (key: BrandColorKey, hex: string) => {
    onChange({ ...value, [key]: hex })
  }

  const applyPreset = (id: string) => {
    setPresetId(id)
    const preset = BRAND_COLOR_PRESETS.find((p) => p.id === id)
    if (preset) onChange({ ...preset.colors })
  }

  const resetToSaved = () => onChange({ ...savedValue })

  const resetToDefault = () => {
    setPresetId('digg-default')
    onChange({ ...DEFAULT_BRAND_COLORS })
  }

  const openPreview = () => {
    sessionStorage.setItem(BRAND_PREVIEW_STORAGE_KEY, JSON.stringify(value))
    window.open('/?brand_preview=1', '_blank', 'noopener,noreferrer')
  }

  const invalidKeys = (Object.keys(BRAND_COLOR_LABELS) as BrandColorKey[]).filter(
    (k) => !isValidHexColor(value[k])
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">Brand colours</h2>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Choose the site palette. Coral should stay as the signature accent; pick one lead colour (terracotta, sage, or navy) per the brand guide.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Preset</span>
          <select
            value={presetId}
            onChange={(e) => applyPreset(e.target.value)}
            className="min-w-[220px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-coral)]"
          >
            {BRAND_COLOR_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={resetToDefault}
          className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50"
        >
          Reset to DIGG default
        </button>
        {dirty && (
          <button
            type="button"
            onClick={resetToSaved}
            className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50"
          >
            Discard changes
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(BRAND_COLOR_LABELS) as BrandColorKey[]).map((key) => {
          const meta = BRAND_COLOR_LABELS[key]
          const hex = value[key]
          const valid = isValidHexColor(hex)
          return (
            <div key={key} className="p-4 rounded-xl border border-[var(--color-greige)]/60 bg-[var(--color-bone)]/40">
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="color"
                  aria-label={`${meta.label} colour picker`}
                  value={valid ? hex : DEFAULT_BRAND_COLORS[key]}
                  onChange={(e) => updateColor(key, e.target.value.toUpperCase())}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-ink)]">{meta.label}</p>
                  <p className="text-xs text-[var(--color-muted)]">{meta.hint}</p>
                </div>
              </div>
              <input
                type="text"
                value={hex}
                onChange={(e) => updateColor(key, e.target.value)}
                onBlur={() => updateColor(key, normalizeHexColor(hex, DEFAULT_BRAND_COLORS[key]))}
                placeholder="#RRGGBB"
                className={`w-full px-3 py-2 text-sm font-mono border rounded-lg ${
                  valid ? 'border-gray-300' : 'border-red-400 bg-red-50'
                }`}
              />
            </div>
          )
        })}
      </div>

      {/* Live swatch preview */}
      <div className="rounded-xl overflow-hidden border border-[var(--color-greige)]">
        <div className="px-4 py-3 text-sm font-medium" style={{ background: value.bone, color: value.ink }}>
          Sample page strip
        </div>
        <div className="px-4 py-6 flex flex-wrap gap-3 items-center" style={{ background: value.ink, color: value.bone }}>
          <span className="text-sm opacity-90">Navbar / dark panel</span>
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: value.terracotta }}
          >
            Primary CTA
          </button>
          <span className="w-3 h-3 rounded-sm" style={{ background: value.coral }} title="Coral signature" />
        </div>
        <div className="px-4 py-3 text-sm" style={{ background: value.bone, color: value.muted }}>
          Body text on bone background
        </div>
      </div>

      {invalidKeys.length > 0 && (
        <p className="text-sm text-red-600">Fix invalid hex values before saving ({invalidKeys.join(', ')}).</p>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={() => onSave(value)}
          disabled={saving || invalidKeys.length > 0 || !dirty}
          className="px-6 py-2.5 bg-[var(--color-terracotta)] text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save & publish colours'}
        </button>
        <button
          type="button"
          onClick={openPreview}
          disabled={invalidKeys.length > 0}
          className="px-6 py-2.5 border-2 border-[var(--color-ink)] text-[var(--color-ink)] rounded-xl font-semibold hover:bg-[var(--color-ink)] hover:text-white disabled:opacity-50"
        >
          Preview on site
        </button>
        {dirty && (
          <span className="text-sm text-amber-700 self-center">Unsaved colour changes</span>
        )}
      </div>
    </div>
  )
}
