import Link from 'next/link'
import type { PageSection } from '@/lib/types/database'
import Hero from './Hero'
import StatsBar from './StatsBar'
import ContactForm from './ContactForm'
import AgentForm from './AgentForm'
import RevealSection from './RevealSection'
import ImageWithPlaceholder from './ImageWithPlaceholder'
import Testimonial from './Testimonial'
import VideoEmbed from './VideoEmbed'
import Gallery from './Gallery'
import TwoColumn from './TwoColumn'
import LogoBar from './LogoBar'
import FAQ from './FAQ'

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
          text: (data.secondaryCTAtext as string) || '',
          href: (data.secondaryCTAhref as string) || '/contact',
        }}
        backgroundImage={(data.backgroundImageUrl as string) || undefined}
      />
    )
  }

  if (type === 'text') {
    const alignment = (data.alignment as string) === 'center' ? 'text-center' : (data.alignment as string) === 'right' ? 'text-right' : 'text-left'
    return (
      <RevealSection className="bg-[var(--color-bone)] py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={alignment}>
            {(data.heading as string) && (
              <h2 className="text-3xl font-bold text-[var(--color-ink)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
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

  if (type === 'image') {
    const imageUrl = (data.imageUrl as string) || ''
    const alt = (data.alt as string) || ''
    const caption = (data.caption as string) || ''
    const layout = (data.layout as string) || 'contained'
    const isFullWidth = layout === 'full'
    return (
      <RevealSection className={isFullWidth ? '' : 'py-8 lg:py-12'}>
        <div className={isFullWidth ? 'w-full' : 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'}>
          <div className={isFullWidth ? '' : 'rounded-2xl overflow-hidden'}>
            <ImageWithPlaceholder
              src={imageUrl}
              alt={alt || 'Section image'}
              aspectRatio="auto"
              placeholderLabel="Image"
              className="w-full h-auto object-cover"
            />
          </div>
          {caption && (
            <p className="mt-3 text-center text-sm text-gray-500 max-w-3xl mx-auto">
              {caption}
            </p>
          )}
        </div>
      </RevealSection>
    )
  }

  if (type === 'two_column') {
    return (
      <TwoColumn
        heading={(data.heading as string) || ''}
        body={(data.body as string) || ''}
        imageUrl={(data.imageUrl as string) || ''}
        imageAlt={(data.imageAlt as string) || ''}
        reversed={!!data.reversed}
      />
    )
  }

  if (type === 'grid') {
    const title = (data.title as string) || ''
    const items = (data.items as { title: string; description: string; imageUrl?: string }[]) ?? []
    const colClass =
      items.length >= 4
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        : items.length === 2
          ? 'grid-cols-1 md:grid-cols-2'
          : 'grid-cols-1 md:grid-cols-3'
    return (
      <RevealSection className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {title && (
            <h2 className="text-3xl font-bold text-[var(--color-ink)] mb-3 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
              {title}
            </h2>
          )}
          {title === 'What we do' && (
            <p className="text-center text-[var(--color-muted)] mb-10 max-w-2xl mx-auto">
              Four services. Plain language. No jargon.
            </p>
          )}
          <div className={`grid ${colClass} gap-6 lg:gap-8`}>
            {items.map((item, i) => (
              <div
                key={i}
                className="bg-[var(--color-bone)] p-6 lg:p-8 rounded-2xl border border-[var(--color-greige)]/50 text-left"
              >
                {item.imageUrl?.trim() ? (
                  <div className="aspect-video rounded-xl overflow-hidden mb-4">
                    <ImageWithPlaceholder
                      src={item.imageUrl}
                      alt={item.title}
                      aspectRatio="video"
                      placeholderLabel="Image"
                      className="rounded-xl"
                    />
                  </div>
                ) : null}
                <h3 className="text-lg font-bold text-[var(--color-ink)] mb-2">{item.title}</h3>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>
    )
  }

  if (type === 'gallery') {
    const images = (data.images as { url: string; alt?: string }[]) ?? []
    return <Gallery title={(data.title as string) || ''} images={images} />
  }

  if (type === 'stats') {
    const items = (data.items as { label: string; value: string }[]) ?? []
    const stats = items.map(({ label, value }) => ({ number: value, label }))
    return <StatsBar stats={stats.length ? stats : undefined} />
  }

  if (type === 'products') {
    const title = (data.title as string) || ''
    const subtitle = (data.subtitle as string) || ''
    const items = (data.items as {
      title: string
      description: string
      link?: string
      comingSoon?: boolean
      status?: string
      imageUrl?: string
    }[]) ?? []
    return (
      <RevealSection className="bg-[var(--color-bone)] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-ink)] text-center mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {title}
            </h2>
          )}
          {subtitle && <p className="text-center text-lg text-[var(--color-muted)] mb-10 max-w-2xl mx-auto">{subtitle}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item, i) => {
              const href = item.link?.trim() || '#'
              const badge = item.status || (item.comingSoon ? 'Coming soon' : '')
              return (
                <Link
                  key={i}
                  href={href}
                  className="bg-white rounded-2xl border border-[var(--color-greige)]/50 hover:border-[var(--color-terracotta)]/40 hover:shadow-md transition-all relative block overflow-hidden group"
                >
                  {item.imageUrl?.trim() ? (
                    <div className="aspect-[4/3] overflow-hidden">
                      <ImageWithPlaceholder
                        src={item.imageUrl}
                        alt={item.title}
                        aspectRatio="4/3"
                        placeholderLabel={item.title}
                        className="rounded-t-2xl object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-2 bg-[var(--color-terracotta)]" aria-hidden />
                  )}
                  <div className="p-6">
                    {badge && (
                      <span className="inline-block mb-3 bg-[var(--color-sage)]/20 text-[var(--color-ink)] border border-[var(--color-sage)]/40 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                        {badge}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-terracotta)] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[var(--color-muted)] text-sm leading-relaxed">{item.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
          <p className="text-center mt-8">
            <Link href="/insights" className="text-[var(--color-terracotta)] font-semibold hover:text-[var(--color-terra-deep)] transition-colors">
              View all work →
            </Link>
          </p>
        </div>
      </RevealSection>
    )
  }

  if (type === 'testimonial') {
    return (
      <Testimonial
        quote={(data.quote as string) || ''}
        author={(data.author as string) || ''}
        role={(data.role as string) || ''}
        company={(data.company as string) || ''}
        photoUrl={(data.photoUrl as string) || ''}
      />
    )
  }

  if (type === 'video') {
    return (
      <VideoEmbed
        heading={(data.heading as string) || ''}
        videoUrl={(data.videoUrl as string) || ''}
        caption={(data.caption as string) || ''}
      />
    )
  }

  if (type === 'logos') {
    const logos = (data.logos as { name: string; imageUrl?: string }[]) ?? []
    return <LogoBar title={(data.title as string) || ''} logos={logos} />
  }

  if (type === 'faq') {
    const items = (data.items as { question: string; answer: string }[]) ?? []
    return <FAQ title={(data.title as string) || ''} items={items} />
  }

  if (type === 'cta') {
    const title = (data.title as string) || ''
    const description = (data.description as string) || ''
    const buttonText = (data.buttonText as string) || 'Contact us'
    const buttonLink = (data.buttonLink as string) || '/contact'
    return (
      <RevealSection className="bg-[var(--color-ink)] py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          {title && <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h2>}
          {description && <p className="text-lg opacity-90 mb-8">{description}</p>}
          <Link
            href={buttonLink}
            className="inline-block bg-[var(--color-terracotta)] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[var(--color-terra-deep)] transition-colors"
          >
            {buttonText}
          </Link>
        </div>
      </RevealSection>
    )
  }

  if (type === 'divider') {
    const size = (data.size as string) || 'md'
    const showLine = data.showLine !== false
    const py = size === 'sm' ? 'py-4' : size === 'lg' ? 'py-16' : 'py-8'
    return (
      <div className={py}>
        {showLine && <hr className="max-w-7xl mx-auto border-gray-200" />}
      </div>
    )
  }

  if (type === 'form') {
    const formType = (data.formType as string) || 'contact'
    return (
      <RevealSection className="bg-[var(--color-bone)] py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {formType === 'agent' ? <AgentForm /> : <ContactForm />}
        </div>
      </RevealSection>
    )
  }

  return null
}
