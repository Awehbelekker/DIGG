'use client'

import { useState } from 'react'
import { submitNewsletterSignup } from '@/app/newsletter/action'

type Props = { source?: string }

export default function NewsletterSignup({ source = 'footer' }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    data.set('source', source)
    setStatus('loading')
    setMessage('')
    const result = await submitNewsletterSignup(data)
    if (result.ok) {
      setStatus('success')
      setMessage('Thanks! You’re on the list.')
      form.reset()
    } else {
      setStatus('error')
      setMessage(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm">
      <input
        type="email"
        name="email"
        placeholder="Your email"
        required
        disabled={status === 'loading'}
        className="flex-1 min-w-0 px-4 py-2.5 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-transparent disabled:opacity-60"
        aria-label="Email for newsletter"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-5 py-2.5 rounded-lg bg-[#F7941D] text-white font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {status === 'loading' ? '…' : 'Subscribe'}
      </button>
      {status === 'success' && <p className="text-sm text-green-300 sm:col-span-2">{message}</p>}
      {status === 'error' && <p className="text-sm text-amber-200 sm:col-span-2">{message}</p>}
    </form>
  )
}
