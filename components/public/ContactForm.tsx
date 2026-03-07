'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [emailError, setEmailError] = useState('')

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

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('form_submissions')
        .insert({
          form_type: 'contact',
          data: formData
        })

      if (error) throw error

      setSubmitted(true)
      setFormData({ name: '', phone: '', email: '', type: '', message: '' })
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your form. Please try again or contact us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <p className="text-green-800 font-semibold text-lg">Thank you for your message! We'll get back to you soon.</p>
      </div>
    )
  }

  const inputClass = "w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent focus:outline-none transition-shadow"

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-[#1B2A6B] text-center mb-8 tracking-tight">Get in Touch</h2>
      
      <div className="mb-6">
        <label htmlFor="name" className="block text-sm font-medium text-[#1B2A6B] mb-2">
          Your name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="phone" className="block text-sm font-medium text-[#1B2A6B] mb-2">
          Your phone number *
        </label>
        <input
          type="tel"
          id="phone"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="email" className="block text-sm font-medium text-[#1B2A6B] mb-2">
          Your email address *
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value })
            if (emailError) setEmailError(validateEmail(e.target.value))
          }}
          onBlur={() => setEmailError(validateEmail(formData.email))}
          className={`${inputClass} ${emailError ? 'border-red-500 focus:ring-red-500' : ''}`}
          aria-invalid={!!emailError}
          aria-describedby={emailError ? 'email-error' : undefined}
        />
        {emailError && (
          <p id="email-error" className="mt-1.5 text-sm text-red-600" role="alert">
            {emailError}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="type" className="block text-sm font-medium text-[#1B2A6B] mb-2">
          I am a... *
        </label>
        <select
          id="type"
          required
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className={inputClass}
        >
          <option value="">Please select</option>
          <option value="property-owner">Property owner</option>
          <option value="estate-agent">Estate agent</option>
          <option value="investor-developer">Investor or developer</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-8">
        <label htmlFor="message" className="block text-sm font-medium text-[#1B2A6B] mb-2">
          Tell us about your property or project
        </label>
        <textarea
          id="message"
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#F7941D] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#e6850a] hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-offset-2"
      >
        {loading ? 'Sending...' : 'Start the Conversation'}
      </button>
    </form>
  )
}
