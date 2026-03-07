'use client'

import { useState } from 'react'

type UrlLabel = { url: string; label: string }

function collectUrls(settings: Record<string, unknown>): UrlLabel[] {
  const out: UrlLabel[] = []
  const hero = settings.hero_image_url
  if (typeof hero === 'string' && hero.trim()) out.push({ url: hero.trim(), label: 'Hero image' })

  const work = settings.selected_work
  if (Array.isArray(work)) {
    work.forEach((item: unknown, i: number) => {
      if (item && typeof item === 'object' && 'imageUrl' in item) {
        const u = (item as { imageUrl?: string }).imageUrl
        if (typeof u === 'string' && u.trim()) out.push({ url: u.trim(), label: `Selected Work #${i + 1}` })
      }
    })
  }

  const products = settings.homepage_products
  if (Array.isArray(products)) {
    products.forEach((item: unknown, i: number) => {
      if (item && typeof item === 'object' && 'imageUrl' in item) {
        const u = (item as { imageUrl?: string }).imageUrl
        if (typeof u === 'string' && u.trim()) out.push({ url: u.trim(), label: `Homepage product #${i + 1}` })
      }
    })
  }

  return out
}

function checkUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    const timeout = setTimeout(() => {
      img.onload = null
      img.onerror = null
      resolve(false)
    }, 10000)
    img.onload = () => {
      clearTimeout(timeout)
      resolve(true)
    }
    img.onerror = () => {
      clearTimeout(timeout)
      resolve(false)
    }
    img.src = url
  })
}

export default function SettingsUrlValidation({ settings }: { settings: Record<string, unknown> }) {
  const [checking, setChecking] = useState(false)
  const [failed, setFailed] = useState<UrlLabel[]>([])
  const [checked, setChecked] = useState(false)

  const urls = collectUrls(settings)
  if (urls.length === 0) return null

  const runCheck = async () => {
    setChecking(true)
    setFailed([])
    setChecked(true)
    const results = await Promise.all(urls.map(async (item) => ({ ...item, ok: await checkUrl(item.url) })))
    setFailed(results.filter((r) => !r.ok).map(({ url, label }) => ({ url, label })))
    setChecking(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-[#1B2A6B]">Image URL validation</h2>
      <p className="text-sm text-gray-500">
        Check that hero, Selected Work, and Homepage Product image URLs load. Failed URLs may be broken or blocked (e.g. CORS).
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={runCheck}
          disabled={checking}
          className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {checking ? 'Checking…' : 'Check image URLs'}
        </button>
        {checked && !checking && failed.length === 0 && urls.length > 0 && (
          <span className="text-sm text-green-600">All {urls.length} URL(s) loaded.</span>
        )}
      </div>
      {failed.length > 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm font-medium text-amber-900 mb-2">These URL(s) failed to load:</p>
          <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
            {failed.map(({ label, url }) => (
              <li key={url}>
                <span className="font-medium">{label}</span>
                <span className="text-amber-700 break-all ml-1">{url}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
