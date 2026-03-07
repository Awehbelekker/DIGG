'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AgentForm() {
  const [formData, setFormData] = useState({
    name: '',
    agency: '',
    phone: '',
    email: '',
    referral: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [submitError, setSubmitError] = useState('')

  const validateEmail = (email: string) => {
    if (!email.trim()) return ''
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email) ? '' : 'Please enter a valid email address.'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validateEmail(formData.email)
    setEmailError(err)
    if (err) return
    setLoading(true)
    setSubmitError('')

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('form_submissions')
        .insert({
          form_type: 'agent',
          data: formData
        })

      if (error) throw error

      setSubmitted(true)
      setFormData({ name: '', agency: '', phone: '', email: '', referral: '' })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError('There was an error submitting your registration. Please try again or contact us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <p className="text-green-800 font-semibold text-lg">Thank you for registering! We'll be in touch soon to discuss your first referral.</p>
      </div>
    )
  }

  const inputClass = "w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent focus:outline-none transition-shadow"

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-6">
        <label htmlFor="agent-name" className="block text-sm font-medium text-[#1B2A6B] mb-2">
          Your Name *
        </label>
        <input
          type="text"
          id="agent-name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="agent-agency" className="block text-sm font-medium text-[#1B2A6B] mb-2">
          Agency *
        </label>
        <input
          type="text"
          id="agent-agency"
          required
          value={formData.agency}
          onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="agent-phone" className="block text-sm font-medium text-[#1B2A6B] mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          id="agent-phone"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="agent-email" className="block text-sm font-medium text-[#1B2A6B] mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="agent-email"
          required
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value })
            if (emailError) setEmailError(validateEmail(e.target.value))
          }}
          onBlur={() => setEmailError(validateEmail(formData.email))}
          className={`${inputClass} ${emailError ? 'border-red-500 focus:ring-red-500' : ''}`}
          aria-invalid={!!emailError}
          aria-describedby={emailError ? 'agent-email-error' : undefined}
        />
        {emailError && (
          <p id="agent-email-error" className="mt-1.5 text-sm text-red-600" role="alert">
            {emailError}
          </p>
        )}
      </div>

      <div className="mb-8">
        <label htmlFor="agent-referral" className="block text-sm font-medium text-[#1B2A6B] mb-2">
          Tell us about your first referral
        </label>
        <textarea
          id="agent-referral"
          rows={4}
          value={formData.referral}
          onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
          className={inputClass}
        />
      </div>

      {submitError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm" role="alert">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#F7941D] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#e6850a] hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-offset-2"
      >
        {loading ? 'Submitting...' : 'Submit Registration'}
      </button>
    </form>
  )
}
