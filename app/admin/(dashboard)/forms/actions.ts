'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markSubmissionRead(id: string, read: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('form_submissions')
    .update({ read })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/forms')
  revalidatePath(`/admin/forms/${id}`)
}

export async function markSubmissionArchived(id: string, archived: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('form_submissions')
    .update({ archived })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/forms')
  revalidatePath(`/admin/forms/${id}`)
}
