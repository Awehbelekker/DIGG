'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deletePage(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('pages').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/pages')
}

export async function duplicatePage(id: string) {
  const supabase = await createClient()
  const { data: page, error: fetchError } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single()
  if (fetchError || !page) throw new Error('Page not found')
  const { error: insertError } = await supabase.from('pages').insert([
    {
      title: (page.title as string) + ' (copy)',
      slug: (page.slug as string) + '-copy',
      content: page.content,
      meta_title: page.meta_title,
      meta_description: page.meta_description,
      published: false,
    },
  ])
  if (insertError) throw new Error(insertError.message)
  revalidatePath('/admin/pages')
}
