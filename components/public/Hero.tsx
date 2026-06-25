import PageWrap from '@/components/public/ui/PageWrap'
import Eyebrow from '@/components/public/ui/Eyebrow'
import { BtnPrimary, BtnGhost } from '@/components/public/ui/Buttons'

interface HeroProps {
  eyebrow?: string
  title?: string
  emphasisWord?: string
  subtitle?: string
  primaryCTA?: { text: string; href: string }
  secondaryCTA?: { text: string; href: string }
  backgroundImage?: string
}

export default function Hero({
  eyebrow = 'Property · Development · Architecture',
  title = 'We design buildings like the',
  emphasisWord = 'investments',
  subtitle = "DIGG is a Cape Town property development & architecture practice. Twelve years of experience, an investor's mindset, and a small team that actually does the work.",
  primaryCTA = { text: 'See our work →', href: '/insights' },
  secondaryCTA = { text: 'Meet the team', href: '/about' },
  backgroundImage,
}: HeroProps) {
  return (
    <section className="relative page-top pb-10 sm:pb-12 overflow-hidden bg-[var(--color-bone)]">
      {backgroundImage && (
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden
        />
      )}
      <PageWrap className="relative">
        {eyebrow && <Eyebrow className="mb-4 sm:mb-6">{eyebrow}</Eyebrow>}
        <h1
          className="text-[clamp(2.125rem,7.5vw,4.5rem)] font-black tracking-[-0.04em] leading-[0.95] text-[var(--color-ink)] max-w-[900px]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}{' '}
          {emphasisWord && (
            <span className="text-[var(--color-lead)]">
              {emphasisWord}
              <span className="text-[var(--color-coral)]">.</span>
            </span>
          )}
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-[#3a4654] mt-5 sm:mt-6 max-w-[560px] leading-relaxed">{subtitle}</p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-8 sm:mt-9 max-w-md sm:max-w-none">
          {primaryCTA.text && <BtnPrimary href={primaryCTA.href}>{primaryCTA.text}</BtnPrimary>}
          {secondaryCTA.text && <BtnGhost href={secondaryCTA.href}>{secondaryCTA.text}</BtnGhost>}
        </div>
      </PageWrap>
    </section>
  )
}
