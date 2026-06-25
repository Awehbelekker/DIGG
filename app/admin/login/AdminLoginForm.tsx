'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { login, type LoginState } from '@/app/admin/login/actions'

const supabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'string' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'string' &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

export default function AdminLoginForm() {
  const searchParams = useSearchParams()
  const callbackError = searchParams.get('error')
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, null)

  const error = state?.error ?? callbackError ?? null

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F0E8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#152232]">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the DIGG CMS
          </p>
        </div>

        {!supabaseConfigured && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded text-sm">
            Supabase environment variables are missing. Add{' '}
            <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in Vercel → Settings →
            Environment Variables, then redeploy.
          </div>
        )}

        <form className="mt-8 space-y-6" action={formAction}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#B56244] focus:border-[#B56244] focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#B56244] focus:border-[#B56244] focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={pending || !supabaseConfigured}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#B56244] hover:bg-[#9A4F35] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B56244] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
