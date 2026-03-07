import Hero from '@/components/public/Hero'
import StatsBar from '@/components/public/StatsBar'
import RevealSection from '@/components/public/RevealSection'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/site-settings'

const DEFAULT_PROJECTS = [
  { title: 'Residential — Income Unit', place: 'Cape Town', imageUrl: '', link: '' },
  { title: 'Rezoning & As-Built', place: 'Western Cape', imageUrl: '', link: '' },
  { title: 'Multi-Unit Development', place: 'Cape Town', imageUrl: '', link: '' },
]

export default async function HomePage() {
  const settings = await getSiteSettings()
  const heroImageUrl = settings.hero_image_url && String(settings.hero_image_url).trim() ? String(settings.hero_image_url) : undefined
  const selectedWork = Array.isArray(settings.selected_work) && settings.selected_work.length > 0
    ? settings.selected_work
    : DEFAULT_PROJECTS

  return (
    <div className="min-h-screen">
      <Hero backgroundImage={heroImageUrl} />

      {/* Selected Work — project-led, from CMS */}
      <RevealSection className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B2A6B] mb-4 tracking-tight">
              Selected Work
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              A selection of projects where design and return on investment go hand in hand.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {selectedWork.map((project, index) => (
              <Link
                key={`${project.title}-${index}`}
                href={project.link && project.link.trim() ? project.link : '/contact'}
                className="group block rounded-2xl overflow-hidden bg-[#FAFAFA] border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                {project.imageUrl && project.imageUrl.trim() ? (
                  <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm font-medium">Project image</span>
                  </div>
                )}
                <div className="p-5 lg:p-6">
                  <h3 className="font-semibold text-[#1B2A6B] group-hover:text-[#F7941D] transition-colors">
                    {project.title || 'Untitled project'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{project.place || ''}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-10 text-center">
            <Link
              href="/contact"
              className="text-[#1B2A6B] font-medium hover:text-[#F7941D] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-offset-2 rounded"
            >
              Discuss your project →
            </Link>
          </p>
        </div>
      </RevealSection>
      
      {/* Problem/Solution Strip */}
      <RevealSection className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            {[
              { title: 'Untapped Value', body: "Most Cape Town properties have income potential that hasn't been activated yet.", accent: 'bg-[#1B2A6B]' },
              { title: 'Intelligent Design', body: 'We design for outcomes, not just aesthetics. Every decision is weighed against your financial return.', accent: 'bg-[#F7941D]' },
              { title: 'Full-Service Partnership', body: 'From first sketch to council approval — our team walks the whole journey with you.', accent: 'bg-[#5BC8E8]' },
            ].map((item) => (
              <div key={item.title} className="text-center p-8 rounded-2xl bg-[#FAFAFA] hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-100 transition-all duration-300">
                <div className={`w-12 h-1 ${item.accent} rounded-full mx-auto mb-6`} aria-hidden />
                <h3 className="text-xl font-bold text-[#1B2A6B] mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <StatsBar />

      {/* Products Section */}
      <RevealSection id="products" className="bg-[#FAFAFA] py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B2A6B] text-center mb-4 tracking-tight">
            Built Products. Proven Solutions.
          </h2>
          <p className="text-center max-w-3xl mx-auto mb-14 text-lg text-gray-600">
            We've turned decades of large-scale architectural experience into a suite of accessible, income-generating property products. Choose your starting point.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { title: 'Airbnb-Ready Design', description: 'Turn your home into a performing short-term asset.', comingSoon: false },
              { title: 'Sky Pod', description: 'A premium office addition that pays its way.', comingSoon: true },
              { title: 'The Flex', description: 'One footprint. Four income streams. Total flexibility.', comingSoon: true },
              { title: 'Rezoning & Densification', description: 'Unlock the value your zoning is hiding.', comingSoon: false },
            ].map((product) => (
              <div key={product.title} className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 relative group">
                {product.comingSoon && (
                  <span className="absolute top-4 right-4 bg-[#5BC8E8] text-[#1B2A6B] px-3 py-1 rounded-full text-xs font-semibold">
                    Coming Soon
                  </span>
                )}
                <h3 className="text-xl font-bold text-[#1B2A6B] mb-3 pr-20">{product.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
                <Link
                  href="/contact"
                  className="inline-block bg-[#F7941D] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#e6850a] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-offset-2"
                >
                  {product.comingSoon ? 'Get Notified →' : 'Learn More →'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Estate Agent Strip */}
      <section className="bg-[#1B2A6B] text-white py-20 lg:py-24 my-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Are You an Estate Agent?</h2>
          <p className="max-w-3xl mx-auto mb-10 text-lg opacity-90 leading-relaxed">
            Give your sellers something no other agent offers — professional plans and a 3D model as part of every listing. Let's build a referral partnership that works for both of us.
          </p>
          <Link
            href="/for-agents"
            className="inline-block bg-[#F7941D] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#e6850a] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B2A6B]"
          >
            Partner With DIGG
          </Link>
        </div>
      </section>
    </div>
  )
}
