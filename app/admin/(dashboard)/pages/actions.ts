'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { PageSection } from '@/lib/types/database'
import { defaultSectionsForSlug } from '@/lib/builtin-pages'

export async function savePageSections(
  pageId: string,
  payload: {
    title: string
    slug: string
    published: boolean
    meta_title: string
    meta_description: string
    sections: PageSection[]
  }
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('pages')
    .update({
      title: payload.title,
      slug: payload.slug,
      published: payload.published,
      meta_title: payload.meta_title || null,
      meta_description: payload.meta_description || null,
      content: { sections: payload.sections },
      editor_type: 'sections',
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

  if (error) throw new Error(error.message)

  revalidatePath('/', 'layout')
  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/contact')
  revalidatePath('/insights')
  revalidatePath('/admin/pages')
  revalidatePath(`/admin/pages/${pageId}`)
}

export async function resetPageToDefaults(pageId: string, slug: string) {
  const defaults = defaultSectionsForSlug(slug)
  if (!defaults) throw new Error('No defaults for this page')

  const supabase = await createClient()
  const { error } = await supabase
    .from('pages')
    .update({
      content: { sections: defaults },
      editor_type: 'sections',
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath(`/${slug}`)
  revalidatePath(`/admin/pages/${pageId}`)
}

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
      meta_og_image: page.meta_og_image ?? null,
      published: false,
    },
  ])
  if (insertError) throw new Error(insertError.message)
  revalidatePath('/admin/pages')
}
