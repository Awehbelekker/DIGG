export default function Footer() {
  return (
    <footer className="bg-[#1B2A6B] text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-lg font-semibold mb-4">
          <strong>DIGG</strong> — Develop · Invest · Grow · Give
        </p>
        <p className="mb-2">Cape Town, South Africa</p>
        <p className="text-sm opacity-80">
          &copy; {new Date().getFullYear()} DIGG Architecture. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
