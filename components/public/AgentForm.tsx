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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

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
      alert('There was an error submitting your registration. Please try again or contact us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-800 font-semibold">Thank you for registering! We'll be in touch soon to discuss your first referral.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
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
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="agent-referral" className="block text-sm font-medium text-[#1B2A6B] mb-2">
          Tell us about your first referral
        </label>
        <textarea
          id="agent-referral"
          rows={4}
          value={formData.referral}
          onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#F7941D] text-white px-8 py-3 rounded font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Registration'}
      </button>
    </form>
  )
}
