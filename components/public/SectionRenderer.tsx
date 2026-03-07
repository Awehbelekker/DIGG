import Link from 'next/link'
import type { PageSection } from '@/lib/types/database'
import Hero from './Hero'
import StatsBar from './StatsBar'
import ContactForm from './ContactForm'
import AgentForm from './AgentForm'
import RevealSection from './RevealSection'

type SectionRendererProps = { section: PageSection }

export default function SectionRenderer({ section }: SectionRendererProps) {
  const { type, data } = section
  if (!data) return null

  if (type === 'hero') {
    return (
      <Hero
        title={(data.title as string) ?? ''}
        subtitle={(data.subtitle as string) ?? ''}
        primaryCTA={{
          text: (data.primaryCTAtext as string) || 'Learn more',
          href: (data.primaryCTAhref as string) || '#',
        }}
        secondaryCTA={{
          text: (data.secondaryCTAtext as string) || 'Contact',
          href: (data.secondaryCTAhref as string) || '/contact',
        }}
        backgroundImage={(data.backgroundImageUrl as string) || undefined}
      />
    )
  }

  if (type === 'text') {
    const alignment = (data.alignment as string) === 'center' ? 'text-center' : (data.alignment as string) === 'right' ? 'text-right' : 'text-left'
    return (
      <RevealSection className="bg-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={alignment}>
            {(data.heading as string) && (
              <h2 className="text-3xl font-bold text-[#1B2A6B] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                {data.heading as string}
              </h2>
            )}
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {(data.body as string) || ''}
            </div>
          </div>
        </div>
      </RevealSection>
    )
  }

  if (type === 'grid') {
    const title = (data.title as string) || ''
    const items = (data.items as { title: string; description: string; imageUrl?: string }[]) ?? []
    return (
      <RevealSection className="bg-[#FAFAFA] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {title && (
            <h2 className="text-3xl font-bold text-[#1B2A6B] mb-10 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
              {title}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                {item.imageUrl && (
                  <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#1B2A6B] mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>
    )
  }

  if (type === 'stats') {
    const items = (data.items as { label: string; value: string }[]) ?? []
    const stats = items.map(({ label, value }) => ({ number: value, label }))
    return <StatsBar stats={stats.length ? stats : undefined} />
  }

  if (type === 'products') {
    const title = (data.title as string) || ''
    const subtitle = (data.subtitle as string) || ''
    const items = (data.items as { title: string; description: string; link?: string; comingSoon?: boolean }[]) ?? []
    return (
      <RevealSection className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B2A6B] text-center mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {title}
            </h2>
          )}
          {subtitle && <p className="text-center text-lg text-gray-600 mb-10">{subtitle}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, i) => (
              <Link
                key={i}
                href={(item.link && item.link.trim()) ? item.link : '#'}
                className="bg-[#FAFAFA] p-6 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all relative block"
              >
                {item.comingSoon && (
                  <span className="absolute top-4 right-4 bg-[#5BC8E8] text-[#1B2A6B] px-3 py-1 rounded-full text-xs font-semibold">
                    Coming Soon
                  </span>
                )}
                <h3 className="text-xl font-bold text-[#1B2A6B] mb-3 pr-20">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </RevealSection>
    )
  }

  if (type === 'cta') {
    const title = (data.title as string) || ''
    const description = (data.description as string) || ''
    const buttonText = (data.buttonText as string) || 'Contact us'
    const buttonLink = (data.buttonLink as string) || '/contact'
    return (
      <RevealSection className="bg-[#1B2A6B] py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          {title && <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h2>}
          {description && <p className="text-lg opacity-90 mb-8">{description}</p>}
          <Link
            href={buttonLink}
            className="inline-block bg-[#F7941D] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#e6850a] transition-colors"
          >
            {buttonText}
          </Link>
        </div>
      </RevealSection>
    )
  }

  if (type === 'form') {
    const formType = (data.formType as string) || 'contact'
    return (
      <RevealSection className="bg-[#FAFAFA] py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {formType === 'agent' ? <AgentForm /> : <ContactForm />}
        </div>
      </RevealSection>
    )
  }

  return null
}
