import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-[#1B2A6B] font-semibold hover:text-[#F7941D] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-offset-2 rounded"
          >
            DIGG Architecture
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[#1B2A6B] hover:text-[#F7941D] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-offset-2 rounded px-3 py-2"
          >
            Home
          </Link>
        </div>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1B2A6B] mb-2 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
          Page not found
        </h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="min-h-[48px] flex items-center justify-center px-6 py-3 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-offset-2"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="min-h-[48px] flex items-center justify-center px-6 py-3 border-2 border-[#1B2A6B] text-[#1B2A6B] rounded-xl font-semibold hover:bg-[#1B2A6B] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A6B] focus-visible:ring-offset-2"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  )
}
