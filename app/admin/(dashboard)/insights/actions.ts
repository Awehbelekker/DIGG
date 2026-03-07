'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteInsight(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('insights').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/insights')
  revalidatePath('/insights')
}
