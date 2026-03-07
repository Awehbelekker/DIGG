'use server'

import { createClient } from '@/lib/supabase/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type NewsletterResult = { ok: true } | { ok: false; error: string }

export async function submitNewsletterSignup(formData: FormData): Promise<NewsletterResult> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const source = String(formData.get('source') ?? 'footer').trim() || 'footer'

  if (!email) return { ok: false, error: 'Please enter your email.' }
  if (!EMAIL_REGEX.test(email)) return { ok: false, error: 'Please enter a valid email address.' }

  const supabase = await createClient()
  const { error } = await supabase.from('newsletter_signups').insert([{ email, source }])

  if (error) {
    if (error.code === '23505') return { ok: true } // already subscribed
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
  return { ok: true }
}
