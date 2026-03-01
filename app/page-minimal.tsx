// Minimal homepage for testing - no component imports
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-[#1B2A6B] mb-4">DIGG Architecture</h1>
        <p className="text-lg text-gray-600 mb-8">
          Cape Town architecture practice built on one idea: great design should generate real returns.
        </p>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-[#1B2A6B] mb-4">Your Property Should Be Working Harder.</h2>
          <p className="text-gray-600 mb-6">
            We help property owners, investors and developers unlock the financial potential sitting inside their buildings and land.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#F7941D] text-white px-8 py-3 rounded font-semibold hover:bg-[#e6850a] transition-colors"
          >
            Talk to Our Team
          </a>
        </div>
      </div>
    </div>
  )
}
