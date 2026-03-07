import { createClient } from '@/lib/supabase/server'

export type SiteSettings = {
  contact_email?: string
  phone?: string
  site_name?: string
  hero_image_url?: string
  favicon_url?: string
  og_image_url?: string
  heading_font?: string
  body_font?: string
  logo_url?: string
  navbar_logo_position?: 'left' | 'center'
  footer_logo_position?: 'left' | 'center'
  logo_size?: 'small' | 'medium' | 'large'
  selected_work?: Array<{ title: string; place: string; imageUrl?: string; link?: string }>
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
