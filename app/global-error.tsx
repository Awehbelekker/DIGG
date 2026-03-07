'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FAFAFA] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <h1 className="text-xl font-bold text-[#1B2A6B] mb-2">Something went wrong</h1>
          <p className="text-gray-600 text-sm mb-6">
            An unexpected error occurred. You can try again or return to the home page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-3 rounded-xl bg-[#F7941D] text-white font-semibold hover:bg-[#e6850a] transition-colors"
            >
              Try again
            </button>
            <a
              href="/"
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Home
            </a>
          </div>
          {process.env.NODE_ENV === 'development' && error?.message && (
            <p className="mt-6 text-left text-xs text-gray-500 font-mono break-all">{error.message}</p>
          )}
        </div>
      </body>
    </html>
  )
}
