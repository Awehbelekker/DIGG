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
import ContactDirectDetails from './ContactDirectDetails'
import MarqueeSection from './MarqueeSection'
import ServicesGrid from './ServicesGrid'
import WorkCardGrid from './WorkCardGrid'
import CtaSection from './CtaSection'
import AboutHero from './AboutHero'
import TeamGrid from './TeamGrid'
import PillarsInteractive from './PillarsInteractive'
import PillarsPanel from './PillarsPanel'
import ContactLayout from './ContactLayout'
import type { SiteSettings } from '@/lib/site-settings'
import type { WorkCardItem } from './WorkCard'

type SectionRendererProps = { section: PageSection; siteSettings?: SiteSettings }

export default function SectionRenderer({ section, siteSettings }: SectionRendererProps) {
  const { type, data } = section
  if (!data) return null

  if (type === 'hero') {
    return (
      <Hero
        eyebrow={(data.eyebrow as string) || undefined}
        title={(data.title as string) ?? ''}
        emphasisWord={(data.emphasisWord as string) || undefined}
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

  if (type === 'marquee') {
    return <MarqueeSection data={data} />
  }

  if (type === 'services') {
    return (
      <ServicesGrid
        kick={(data.kick as string) || undefined}
        title={(data.title as string) || 'What we do'}
        side={(data.side as string) || undefined}
        items={(data.items as { title: string; description: string; icon?: string; imageUrl?: string }[]) ?? []}
      />
    )
  }

  if (type === 'work_cards') {
    return (
      <WorkCardGrid
        kick={(data.kick as string) || undefined}
        title={(data.title as string) || 'Recent work'}
        sideLinkText={(data.sideLinkText as string) || undefined}
        sideLinkHref={(data.sideLinkHref as string) || undefined}
        items={(data.items as WorkCardItem[]) ?? []}
        whiteBg={!!data.whiteBg}
      />
    )
  }

  if (type === 'about_hero') {
    return (
      <AboutHero
        kick={(data.kick as string) || undefined}
        title={(data.title as string) || ''}
        body={(data.body as string) || ''}
        portraitImageUrl={(data.portraitImageUrl as string) || undefined}
      />
    )
  }

  if (type === 'team') {
    return (
      <TeamGrid
        kick={(data.kick as string) || undefined}
        title={(data.title as string) || 'Team'}
        members={
          (data.members as {
            name: string
            role: string
            credential?: string
            photoUrl?: string
            initials?: string
          }[]) ?? []
        }
      />
    )
  }

  if (type === 'pillars_interactive') {
    return (
      <PillarsInteractive
        kick={(data.kick as string) || undefined}
        title={(data.title as string) || ''}
        intro={(data.intro as string) || undefined}
        items={
          (data.items as { letter: string; title: string; description: string; colorKey: string }[]) ?? []
        }
      />
    )
  }

  if (type === 'pillars_panel') {
    return (
      <PillarsPanel
        kick={(data.kick as string) || undefined}
        title={(data.title as string) || ''}
        body={(data.body as string) || ''}
      />
    )
  }

  if (type === 'contact_layout') {
    return (
      <ContactLayout
        kick={(data.kick as string) || undefined}
        title={(data.title as string) || ''}
        intro={(data.intro as string) || ''}
        siteSettings={siteSettings}
        submitText={(data.submitText as string) || undefined}
        reassurance={(data.reassurance as string) || undefined}
        formAnchorId={(data.formAnchorId as string) || 'contact-form'}
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
      <RevealSection className="bg-white section-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {title && (
            <h2 className="text-3xl font-bold text-[var(--color-ink)] mb-3 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
              {title}
            </h2>
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
    return stats.length ? <StatsBar stats={stats} /> : null
  }

  if (type === 'products') {
    const items = (data.items as WorkCardItem[]) ?? []
    return (
      <WorkCardGrid
        kick={(data.subtitle as string) ? undefined : (data.kick as string) || undefined}
        title={(data.title as string) || 'Recent work'}
        sideLinkText="View all work →"
        sideLinkHref="/insights"
        items={items.map((item) => ({
          title: item.title,
          description: item.description,
          link: item.link,
          status: item.status,
          imageUrl: item.imageUrl,
          gradientKey: item.gradientKey || 'terra',
        }))}
      />
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
    return (
      <CtaSection
        kick={(data.kick as string) || undefined}
        title={(data.title as string) || ''}
        description={(data.description as string) || undefined}
        buttonText={(data.buttonText as string) || 'Contact us'}
        buttonLink={(data.buttonLink as string) || '/contact'}
      />
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
    const anchorId = (data.anchorId as string) || undefined
    return (
      <RevealSection className="bg-[var(--color-bone)] py-16 lg:py-20" id={anchorId}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {formType === 'agent' ? <AgentForm /> : <ContactForm />}
        </div>
      </RevealSection>
    )
  }

  if (type === 'contact_details') {
    return <ContactDirectDetails siteSettings={siteSettings} />
  }

  return null
}
