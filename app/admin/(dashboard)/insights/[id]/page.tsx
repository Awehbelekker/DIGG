import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AdminPageHeading from '@/components/admin/AdminPageHeading'
import InsightEditor from '@/components/admin/InsightEditor'
import type { Insight } from '@/lib/types/database'

type Props = { params: Promise<{ id: string }> }

export default async function EditInsightPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: insight, error } = await supabase
    .from('insights')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !insight) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdminPageHeading className="mb-8">Edit Insight</AdminPageHeading>
      <InsightEditor insight={insight as Insight} />
    </div>
  )
}
