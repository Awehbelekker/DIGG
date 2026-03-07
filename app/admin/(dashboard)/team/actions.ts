'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export type TeamUser = {
  id: string
  email: string | undefined
  created_at: string
  last_sign_in_at: string | null
}

export async function listTeamUsers(): Promise<{ users: TeamUser[]; error: string | null }> {
  try {
    const supabase = createAdminClient()
    const { data: { users }, error } = await supabase.auth.admin.listUsers({ perPage: 100 })
    if (error) return { users: [], error: error.message }
    const list: TeamUser[] = (users ?? []).map((u) => ({
      id: u.id,
      email: u.email ?? undefined,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
    }))
    return { users: list, error: null }
  } catch (e) {
    return { users: [], error: e instanceof Error ? e.message : 'Failed to list users' }
  }
}

export async function inviteUserByEmail(email: string): Promise<{ error: string | null }> {
  try {
    const supabase = createAdminClient()
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
    const { error } = await supabase.auth.admin.inviteUserByEmail(email, baseUrl ? { redirectTo: `${baseUrl}/admin/login` } : {})
    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to send invite' }
  }
}
