import Hero from '@/components/public/Hero'
import StatsBar from '@/components/public/StatsBar'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Problem/Solution Strip */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-[#1B2A6B] mb-4">Untapped Value</h3>
              <p className="text-gray-600">
                Most Cape Town properties have income potential that hasn't been activated yet.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-[#1B2A6B] mb-4">Intelligent Design</h3>
              <p className="text-gray-600">
                We design for outcomes, not just aesthetics. Every decision is weighed against your financial return.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-[#1B2A6B] mb-4">Full-Service Partnership</h3>
              <p className="text-gray-600">
                From first sketch to council approval — our team walks the whole journey with you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatsBar />

      {/* Products Section */}
      <section id="products" className="bg-[#FAFAFA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B2A6B] text-center mb-4">
            Built Products. Proven Solutions.
          </h2>
          <p className="text-center max-w-3xl mx-auto mb-12 text-lg text-gray-600">
            We've turned decades of large-scale architectural experience into a suite of accessible, income-generating property products. Choose your starting point.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Airbnb-Ready Design", description: "Turn your home into a performing short-term asset.", comingSoon: false },
              { title: "Sky Pod", description: "A premium office addition that pays its way.", comingSoon: true },
              { title: "The Flex", description: "One footprint. Four income streams. Total flexibility.", comingSoon: true },
              { title: "Rezoning & Densification", description: "Unlock the value your zoning is hiding.", comingSoon: false }
            ].map((product, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative">
                {product.comingSoon && (
                  <span className="absolute top-4 right-4 bg-[#5BC8E8] text-[#1B2A6B] px-3 py-1 rounded-full text-xs font-semibold">
                    Coming Soon
                  </span>
                )}
                <h3 className="text-xl font-bold text-[#1B2A6B] mb-3">{product.title}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <Link
                  href="/contact"
                  className="inline-block bg-[#F7941D] text-white px-6 py-2 rounded font-semibold hover:bg-[#e6850a] transition-colors"
                >
                  {product.comingSoon ? "Get Notified →" : "Learn More →"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estate Agent Strip */}
      <section className="bg-[#1B2A6B] text-white py-16 my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Are You an Estate Agent?</h2>
          <p className="max-w-3xl mx-auto mb-8 text-lg opacity-90">
            Give your sellers something no other agent offers — professional plans and a 3D model as part of every listing. Let's build a referral partnership that works for both of us.
          </p>
          <Link
            href="/for-agents"
            className="inline-block bg-[#F7941D] text-white px-8 py-3 rounded font-semibold hover:bg-[#e6850a] transition-colors"
          >
            Partner With DIGG
          </Link>
        </div>
      </section>
    </div>
  )
}
