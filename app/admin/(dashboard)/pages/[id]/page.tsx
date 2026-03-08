import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import GrapesjsEditorWrapper from '@/components/admin/GrapesjsEditorWrapper'
import type { Page } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: page, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !page) {
    notFound()
  }

  return <GrapesjsEditorWrapper page={page as Page} />
}
