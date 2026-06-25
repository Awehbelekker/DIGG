import { createClient } from '@/lib/supabase/server'
import { parseBrandColors, type BrandColors } from '@/lib/brand-colors'

export type SiteSettings = {
  contact_email?: string
  phone?: string
  location?: string
  site_name?: string
  whatsapp_message?: string
  instagram_url?: string
  linkedin_url?: string
  footer_tagline?: string
  company_line?: string
  pillars?: string
  hero_image_url?: string
  favicon_url?: string
  og_image_url?: string
  heading_font?: string
  body_font?: string
  logo_url?: string
  navbar_logo_position?: 'left' | 'center'
  footer_logo_position?: 'left' | 'center'
  logo_size?: 'small' | 'medium' | 'large'
  brand_colors?: BrandColors
  selected_work?: Array<{ title: string; place: string; imageUrl?: string; link?: string }>
  homepage_products?: Array<{ title: string; description: string; imageUrl?: string; link?: string; comingSoon?: boolean }>
  // Homepage editable copy (Admin → Settings → Homepage content)
  hero_title?: string
  hero_subtitle?: string
  hero_primary_cta_text?: string
  hero_primary_cta_href?: string
  hero_secondary_cta_text?: string
  hero_secondary_cta_href?: string
  selected_work_heading?: string
  selected_work_intro?: string
  selected_work_cta_text?: string
  products_heading?: string
  products_intro?: string
  homepage_strip?: Array<{ title: string; body: string }>
  agents_heading?: string
  agents_intro?: string
  agents_cta_text?: string
  nav_cta_text?: string
  work_page_kick?: string
  work_page_title?: string
  work_page_intro?: string
  footer_newsletter_enabled?: boolean
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_settings').select('key, value')

  if (error) return {}

  const settings: Record<string, unknown> = {}
  data?.forEach((row: { key: string; value: unknown }) => {
    let value = row.value
    if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
      try {
        value = JSON.parse(value)
      } catch {
        // keep as string
      }
    }
    settings[row.key] = value
  })

  return settings as SiteSettings
}

export function getBrandColorsFromSettings(settings: SiteSettings): BrandColors {
  return parseBrandColors(settings.brand_colors)
}
