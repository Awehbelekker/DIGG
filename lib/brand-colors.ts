import { brand } from '@/lib/brand'

export type BrandColorKey =
  | 'bone'
  | 'greige'
  | 'ink'
  | 'navy'
  | 'terracotta'
  | 'terraDeep'
  | 'sage'
  | 'coral'
  | 'muted'

export type BrandColors = Record<BrandColorKey, string>

export const BRAND_COLOR_LABELS: Record<BrandColorKey, { label: string; hint: string }> = {
  bone: { label: 'Bone', hint: 'Page background' },
  greige: { label: 'Greige', hint: 'Borders & dividers' },
  ink: { label: 'Ink', hint: 'Headings & body text' },
  navy: { label: 'Navy', hint: 'Dark panels & gradients' },
  terracotta: { label: 'Terracotta', hint: 'Primary buttons & links' },
  terraDeep: { label: 'Terracotta deep', hint: 'Button hover' },
  sage: { label: 'Sage', hint: 'Secondary highlights' },
  coral: { label: 'Coral', hint: 'Signature accent (focus, dots)' },
  muted: { label: 'Muted', hint: 'Secondary text' },
}

export const DEFAULT_BRAND_COLORS: BrandColors = {
  bone: brand.bone,
  greige: brand.greige,
  ink: brand.ink,
  navy: brand.navy,
  terracotta: brand.terracotta,
  terraDeep: brand.terraDeep,
  sage: brand.sage,
  coral: brand.coral,
  muted: brand.muted,
}

export const BRAND_COLOR_PRESETS: { id: string; name: string; colors: BrandColors }[] = [
  { id: 'digg-default', name: 'DIGG default (terracotta lead)', colors: { ...DEFAULT_BRAND_COLORS } },
  {
    id: 'sage-lead',
    name: 'Sage lead',
    colors: {
      ...DEFAULT_BRAND_COLORS,
      terracotta: '#7A8A6B',
      terraDeep: '#65755A',
    },
  },
  {
    id: 'navy-formal',
    name: 'Navy formal',
    colors: {
      ...DEFAULT_BRAND_COLORS,
      terracotta: '#172A45',
      terraDeep: '#0f1c2e',
    },
  },
]

const HEX_RE = /^#([0-9A-Fa-f]{6})$/

export function isValidHexColor(value: string): boolean {
  return HEX_RE.test(value.trim())
}

export function normalizeHexColor(value: string, fallback: string): string {
  const v = value.trim()
  if (isValidHexColor(v)) return v.toUpperCase()
  if (isValidHexColor(fallback)) return fallback.toUpperCase()
  return fallback
}

export function parseBrandColors(raw: unknown): BrandColors {
  const out = { ...DEFAULT_BRAND_COLORS }
  if (!raw || typeof raw !== 'object') return out
  const obj = raw as Record<string, unknown>
  for (const key of Object.keys(DEFAULT_BRAND_COLORS) as BrandColorKey[]) {
    const val = obj[key]
    if (typeof val === 'string' && isValidHexColor(val)) {
      out[key] = val.toUpperCase()
    }
  }
  return out
}

/** CSS custom properties for injection on `<html>`. */
export function brandColorsToCssProperties(colors: BrandColors): Record<string, string> {
  return {
    '--color-bone': colors.bone,
    '--color-greige': colors.greige,
    '--color-ink': colors.ink,
    '--color-navy': colors.navy,
    '--color-terracotta': colors.terracotta,
    '--color-terra-deep': colors.terraDeep,
    '--color-sage': colors.sage,
    '--color-coral': colors.coral,
    '--color-muted': colors.muted,
    '--color-orange': colors.terracotta,
    '--color-light-blue': colors.sage,
    '--color-off-white': colors.bone,
    '--color-text': colors.ink,
    '--color-text-light': colors.muted,
  }
}

export const BRAND_PREVIEW_STORAGE_KEY = 'digg-brand-preview'
