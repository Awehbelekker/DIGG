'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveSiteSetting(key: string, value: unknown) {
  const supabase = await createClient()
  const { error } = await supabase.from('site_settings').upsert(
    {
      key,
      value: typeof value === 'string' ? value : JSON.stringify(value),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'key' }
  )

  if (error) throw new Error(error.message)

  // Navbar + footer (layout) and all public pages that read settings
  revalidatePath('/', 'layout')
  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/contact')
  revalidatePath('/insights')
}
