import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#FAFAFA]">
      <h1 className="text-4xl font-bold text-[#1B2A6B] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
        Page not found
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/"
          className="px-6 py-3 bg-[#F7941D] text-white rounded-xl font-semibold hover:bg-[#e6850a] transition-colors"
        >
          Back to home
        </Link>
        <Link
          href="/contact"
          className="px-6 py-3 border-2 border-[#1B2A6B] text-[#1B2A6B] rounded-xl font-semibold hover:bg-[#1B2A6B] hover:text-white transition-colors"
        >
          Contact us
        </Link>
      </div>
    </div>
  )
}
