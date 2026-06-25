'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type LoginState = { error?: string } | null

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  let supabase
  try {
    supabase = await createClient()
  } catch {
    return {
      error:
        'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel (or .env.local locally), then redeploy.',
    }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.message === 'Invalid login credentials') {
      return {
        error:
          'Invalid email or password. Create or reset the user in Supabase → Authentication → Users.',
      }
    }
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return {
        error:
          'Email not confirmed. Confirm the user in Supabase, or turn off “Confirm email” under Authentication → Providers → Email.',
      }
    }
    return { error: error.message }
  }

  redirect('/admin/dashboard')
}
