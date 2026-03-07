import Hero from '@/components/public/Hero'
import StatsBar from '@/components/public/StatsBar'
import RevealSection from '@/components/public/RevealSection'
import ImageWithPlaceholder from '@/components/public/ImageWithPlaceholder'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/site-settings'

// Placeholder images to preview layout (replace in Admin → Settings when you have real assets)
const PLACEHOLDER_HERO = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80'
const PLACEHOLDER_PROJECTS = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
]
const DEFAULT_PROJECTS = [
  { title: 'Residential — Income Unit', place: 'Cape Town', imageUrl: PLACEHOLDER_PROJECTS[0], link: '' },
  { title: 'Rezoning & As-Built', place: 'Western Cape', imageUrl: PLACEHOLDER_PROJECTS[1], link: '' },
  { title: 'Multi-Unit Development', place: 'Cape Town', imageUrl: PLACEHOLDER_PROJECTS[2], link: '' },
]

export default async function HomePage() {
  const settings = await getSiteSettings()
  const heroImageUrl = settings.hero_image_url && String(settings.hero_image_url).trim() ? String(settings.hero_image_url) : PLACEHOLDER_HERO
  const selectedWork = Array.isArray(settings.selected_work) && settings.selected_work.length > 0
    ? settings.selected_work
    : DEFAULT_PROJECTS

  const homepageProducts = Array.isArray(settings.homepage_products) && settings.homepage_products.length > 0
    ? settings.homepage_products
    : [
        { title: 'Airbnb-Ready Design', description: 'Turn your home into a performing short-term asset.', comingSoon: false, imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', link: '' },
        { title: 'Sky Pod', description: 'A premium office addition that pays its way.', comingSoon: true, imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', link: '' },
        { title: 'The Flex', description: 'One footprint. Four income streams. Total flexibility.', comingSoon: true, imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80', link: '' },
        { title: 'Rezoning & Densification', description: 'Unlock the value your zoning is hiding.', comingSoon: false, imageUrl: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&q=80', link: '' },
      ]

  const heroTitle = (settings.hero_title && String(settings.hero_title).trim()) || 'Your Property Should Be Working Harder.'
  const heroSubtitle = (settings.hero_subtitle && String(settings.hero_subtitle).trim()) || "DIGG is a Cape Town architecture practice built on one idea: great design should generate real returns. We help property owners, investors and developers unlock the financial potential sitting inside their buildings and land."
  const heroPrimaryCtaText = (settings.hero_primary_cta_text && String(settings.hero_primary_cta_text).trim()) || 'See What We Do'
  const heroPrimaryCtaHref = (settings.hero_primary_cta_href && String(settings.hero_primary_cta_href).trim()) || '#products'
  const heroSecondaryCtaText = (settings.hero_secondary_cta_text && String(settings.hero_secondary_cta_text).trim()) || 'Talk to Our Team'
  const heroSecondaryCtaHref = (settings.hero_secondary_cta_href && String(settings.hero_secondary_cta_href).trim()) || '/contact'
  const selectedWorkHeading = (settings.selected_work_heading && String(settings.selected_work_heading).trim()) || 'Selected Work'
  const selectedWorkIntro = (settings.selected_work_intro && String(settings.selected_work_intro).trim()) || 'A selection of projects where design and return on investment go hand in hand.'
  const selectedWorkCtaText = (settings.selected_work_cta_text && String(settings.selected_work_cta_text).trim()) || 'Discuss your project →'
  const productsHeading = (settings.products_heading && String(settings.products_heading).trim()) || 'Built Products. Proven Solutions.'
  const productsIntro = (settings.products_intro && String(settings.products_intro).trim()) || "We've turned decades of large-scale architectural experience into a suite of accessible, income-generating property products. Choose your starting point."
  const stripItems = Array.isArray(settings.homepage_strip) && settings.homepage_strip.length >= 3
    ? settings.homepage_strip
    : [
        { title: 'Untapped Value', body: "Most Cape Town properties have income potential that hasn't been activated yet." },
        { title: 'Intelligent Design', body: 'We design for outcomes, not just aesthetics. Every decision is weighed against your financial return.' },
        { title: 'Full-Service Partnership', body: 'From first sketch to council approval — our team walks the whole journey with you.' },
      ]
  const agentsHeading = (settings.agents_heading && String(settings.agents_heading).trim()) || 'Are You an Estate Agent?'
  const agentsIntro = (settings.agents_intro && String(settings.agents_intro).trim()) || "Give your sellers something no other agent offers — professional plans and a 3D model as part of every listing. Let's build a referral partnership that works for both of us."
  const agentsCtaText = (settings.agents_cta_text && String(settings.agents_cta_text).trim()) || 'Partner With DIGG'

  return (
    <div className="min-h-screen">
      <Hero
        title={heroTitle}
        subtitle={heroSubtitle}
        primaryCTA={{ text: heroPrimaryCtaText, href: heroPrimaryCtaHref }}
        secondaryCTA={{ text: heroSecondaryCtaText, href: heroSecondaryCtaHref }}
        backgroundImage={heroImageUrl}
      />

      {/* Selected Work — project-led, from CMS */}
      <RevealSection className="bg-white py-14 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B2A6B] mb-3 sm:mb-4 tracking-tight">
              {selectedWorkHeading}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {selectedWorkIntro}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {selectedWork.map((project, index) => (
              <Link
                key={`${project.title}-${index}`}
                href={project.link && project.link.trim() ? project.link : '/contact'}
                className="group block rounded-2xl overflow-hidden bg-[#FAFAFA] border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithPlaceholder
                    src={project.imageUrl}
                    alt={project.title || 'Project'}
                    aspectRatio="4/3"
                    placeholderLabel="Project image"
                    className="rounded-t-2xl"
                  />
                </div>
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
              {selectedWorkCtaText}
            </Link>
          </p>
        </div>
      </RevealSection>
      
      {/* Problem/Solution Strip */}
      <RevealSection className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            {[
              { ...stripItems[0], accent: 'bg-[#1B2A6B]' as const },
              { ...stripItems[1], accent: 'bg-[#F7941D]' as const },
              { ...stripItems[2], accent: 'bg-[#5BC8E8]' as const },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-[#FAFAFA] hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-100 transition-all duration-300">
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
            {productsHeading}
          </h2>
          <p className="text-center max-w-3xl mx-auto mb-14 text-lg text-gray-600">
            {productsIntro}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {homepageProducts.map((product) => (
              <Link
                key={product.title}
                href={(product.link && product.link.trim()) ? product.link : '/contact'}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 relative group block overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithPlaceholder
                    src={product.imageUrl}
                    alt={product.title}
                    aspectRatio="4/3"
                    placeholderLabel={product.title}
                    className="rounded-t-2xl object-cover w-full h-full"
                  />
                </div>
                <div className="p-6 lg:p-8">
                  {product.comingSoon && (
                    <span className="absolute top-4 right-4 bg-[#5BC8E8] text-[#1B2A6B] px-3 py-1 rounded-full text-xs font-semibold">
                      Coming Soon
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-[#1B2A6B] mb-3 pr-20">{product.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
                  <span className="inline-block bg-[#F7941D] text-white px-6 py-2.5 rounded-xl font-semibold group-hover:bg-[#e6850a] transition-all duration-200">
                    {product.comingSoon ? 'Get Notified →' : 'Learn More →'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Estate Agent Strip */}
      <section className="bg-[#1B2A6B] text-white py-20 lg:py-24 my-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">{agentsHeading}</h2>
          <p className="max-w-3xl mx-auto mb-10 text-lg opacity-90 leading-relaxed">
            {agentsIntro}
          </p>
          <Link
            href="/for-agents"
            className="inline-block bg-[#F7941D] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#e6850a] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B2A6B]"
          >
            {agentsCtaText}
          </Link>
        </div>
      </section>
    </div>
  )
}
