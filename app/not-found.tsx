import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F0E8]">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-[#152232] font-semibold hover:text-[#B56244] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B56244] focus-visible:ring-offset-2 rounded"
          >
            DIGG
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[#152232] hover:text-[#B56244] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B56244] focus-visible:ring-offset-2 rounded px-3 py-2"
          >
            Home
          </Link>
        </div>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#152232] mb-2 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
          Page not found
        </h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="min-h-[48px] flex items-center justify-center px-6 py-3 bg-[#B56244] text-white rounded-xl font-semibold hover:bg-[#9A4F35] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B56244] focus-visible:ring-offset-2"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="min-h-[48px] flex items-center justify-center px-6 py-3 border-2 border-[#152232] text-[#152232] rounded-xl font-semibold hover:bg-[#152232] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#152232] focus-visible:ring-offset-2"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  )
}
