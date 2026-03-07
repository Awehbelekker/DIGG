import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PageEditor from '@/components/admin/PageEditor'
import AdminPageHeading from '@/components/admin/AdminPageHeading'

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdminPageHeading className="mb-8">Edit Page</AdminPageHeading>
      <PageEditor page={page as import('@/lib/types/database').Page} />
    </div>
  )
}
