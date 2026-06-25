'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { PageSection } from '@/lib/types/database'
import { defaultSectionsForSlug, isBuiltinPageSlug } from '@/lib/builtin-pages'
import { sectionsToHtml } from '@/lib/grapesjs/sections-to-html'

function revalidatePublicPaths(slug: string, pageId: string) {
  revalidatePath('/', 'layout')
  revalidatePath('/')
  if (slug === 'home') {
    revalidatePath('/')
  } else {
    revalidatePath(`/${slug}`)
  }
  revalidatePath('/about')
  revalidatePath('/contact')
  revalidatePath('/insights')
  revalidatePath('/admin/pages')
  revalidatePath(`/admin/pages/${pageId}`)
}

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

  revalidatePublicPaths(payload.slug, pageId)
}

export async function switchPageToGrapesjs(pageId: string) {
  const supabase = await createClient()
  const { data: page, error: fetchError } = await supabase.from('pages').select('*').eq('id', pageId).single()
  if (fetchError || !page) throw new Error('Page not found')

  const content = page.content as { sections?: PageSection[] } | null
  let sections = content?.sections ?? []
  if (sections.length === 0 && isBuiltinPageSlug(page.slug as string)) {
    sections = defaultSectionsForSlug(page.slug as string) ?? []
  }

  const html = sectionsToHtml(sections)
  const { error } = await supabase
    .from('pages')
    .update({
      editor_type: 'grapesjs',
      content_html: html,
      content_css: '',
      content: { sections },
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

  if (error) throw new Error(error.message)
  revalidatePublicPaths(page.slug as string, pageId)
}

export async function switchPageToSections(pageId: string) {
  const supabase = await createClient()
  const { data: page, error: fetchError } = await supabase.from('pages').select('slug').eq('id', pageId).single()
  if (fetchError || !page) throw new Error('Page not found')

  const slug = page.slug as string
  const sections = isBuiltinPageSlug(slug) ? defaultSectionsForSlug(slug) ?? [] : []

  const { error } = await supabase
    .from('pages')
    .update({
      editor_type: 'sections',
      content: { sections },
      content_html: null,
      content_css: null,
      gjs_data: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

  if (error) throw new Error(error.message)
  revalidatePublicPaths(slug, pageId)
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

  revalidatePublicPaths(slug, pageId)
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
