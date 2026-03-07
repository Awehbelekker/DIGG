'use client'

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-[#F7941D] focus:px-4 focus:py-3 focus:text-white focus:font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1B2A6B]"
    >
      Skip to main content
    </a>
  )
}
