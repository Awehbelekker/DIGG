'use client'

import { useState, useEffect } from 'react'
import PageWrap from '@/components/public/ui/PageWrap'
import SectionHead from '@/components/public/ui/SectionHead'
import { pillarBg } from '@/lib/pillar-colors'
import ImageWithPlaceholder from '@/components/public/ImageWithPlaceholder'

type Pillar = {
  letter: string
  title: string
  description: string
  colorKey: string
  imageUrl?: string
}

const TRANSITION = 'transition-[flex,min-height] duration-400 ease-out motion-reduce:transition-none'

function PillarBackground({ pillar, bg }: { pillar: Pillar; bg: string }) {
  const image = pillar.imageUrl?.trim()
  if (!image) {
    return <div className="absolute inset-0" style={{ backgroundColor: bg }} aria-hidden />
  }
  return (
    <>
      <ImageWithPlaceholder
        src={image}
        alt=""
        aspectRatio="auto"
        className="absolute inset-0 w-full h-full object-cover"
        placeholderLabel={pillar.title}
      />
      <div className="absolute inset-0 bg-black/45" style={{ backgroundColor: `${bg}cc` }} aria-hidden />
    </>
  )
}

function DesktopPillarRow({
  items,
  reducedMotion,
}: {
  items: Pillar[]
  reducedMotion: boolean
}) {
  const [active, setActive] = useState<number | null>(null)
  const showLines = active === null

  return (
    <div
      className="relative hidden lg:flex gap-3 items-stretch min-h-[140px]"
      onMouseLeave={() => setActive(null)}
    >
      {showLines && <ConnectorLines />}

      {items.map((pillar, i) => {
        const isActive = active === i
        const isDimmed = active !== null && !isActive
        const bg = pillarBg(pillar.colorKey)

        let flexClass = 'flex-1 min-h-[140px]'
        if (isActive) flexClass = 'flex-[2.75] min-h-[260px]'
        else if (isDimmed) flexClass = 'flex-[0.8] min-h-[140px]'

        return (
          <div
            key={i}
            className={`relative z-10 min-w-0 rounded-[20px] overflow-hidden cursor-default flex flex-col ${TRANSITION} ${flexClass}`}
            onMouseEnter={() => setActive(i)}
          >
            <PillarBackground pillar={pillar} bg={bg} />
            <div
              className={`relative z-10 flex flex-col h-full p-6 text-white ${reducedMotion ? '' : 'transition-all duration-400 ease-out'} ${
                isActive ? 'justify-start' : 'justify-center items-center text-center'
              }`}
            >
              <span
                className={`font-black shrink-0 max-w-full ${reducedMotion ? '' : 'transition-all duration-400 ease-out'} ${
                  isActive ? 'text-3xl sm:text-4xl mb-2 self-start text-left' : 'text-4xl xl:text-[3rem]'
                }`}
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {pillar.letter}
              </span>

              {!isActive && (
                <p
                  className={`font-bold text-xs sm:text-sm mt-2 max-w-full px-1 line-clamp-2 leading-snug ${reducedMotion ? '' : 'transition-opacity duration-300'}`}
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {pillar.title}
                </p>
              )}

              <div
                className={`w-full ${reducedMotion ? '' : 'transition-all duration-400 ease-out'} ${
                  isActive ? 'opacity-100 mt-1' : 'opacity-0 h-0 overflow-hidden pointer-events-none'
                }`}
              >
                <h3 className="font-bold text-lg mb-1.5 text-left" style={{ fontFamily: 'var(--font-heading)' }}>
                  {pillar.title}
                </h3>
                <p className="text-sm text-white/90 leading-relaxed text-left">{pillar.description}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MobilePillarStack({ items }: { items: Pillar[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-3 lg:hidden">
      {items.map((pillar, i) => {
        const open = openIndex === i
        const bg = pillarBg(pillar.colorKey)

        return (
          <div
            key={i}
            className="relative rounded-[20px] overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
            role="button"
            tabIndex={0}
            aria-expanded={open}
            onClick={() => setOpenIndex(open ? null : i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setOpenIndex(open ? null : i)
              }
            }}
          >
            <PillarBackground pillar={pillar} bg={bg} />
            <div className="relative z-10 p-5 text-white">
              <div className="flex items-start gap-3">
                <span
                  className="font-black text-3xl shrink-0 w-10 leading-none"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {pillar.letter}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base" style={{ fontFamily: 'var(--font-heading)' }}>
                    {pillar.title}
                  </h3>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      open ? 'max-h-56 opacity-100 mt-2' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-sm text-white/90 leading-relaxed">{pillar.description}</p>
                  </div>
                  {!open && <p className="text-xs text-white/60 mt-1.5">Tap for more</p>}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ConnectorLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-[140px] pointer-events-none z-0"
      viewBox="0 0 1000 140"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d="M125 70 Q250 30 375 70" fill="none" stroke="#E8624D" strokeWidth="3" opacity="0.65" />
      <path d="M375 70 Q500 110 625 70" fill="none" stroke="#B56244" strokeWidth="3" opacity="0.65" />
      <path d="M625 70 Q750 30 875 70" fill="none" stroke="#8A9A7B" strokeWidth="3" opacity="0.65" />
    </svg>
  )
}

export default function PillarsInteractive({
  kick,
  title,
  intro,
  items,
}: {
  kick?: string
  title: string
  intro?: string
  items: Pillar[]
}) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(motionMq.matches)
    sync()
    motionMq.addEventListener('change', sync)
    return () => motionMq.removeEventListener('change', sync)
  }, [])

  const pillars =
    items.length > 0
      ? items
      : [
          { letter: 'D', title: 'Develop', description: 'Development advisory and design.', colorKey: 'terra' },
          { letter: 'I', title: 'Invest', description: "An investor's lens on every decision.", colorKey: 'navy' },
          { letter: 'G', title: 'Grow', description: 'Long-term value for clients and community.', colorKey: 'sage' },
          { letter: 'G', title: 'Give', description: 'Contributing back beyond the balance sheet.', colorKey: 'coral' },
        ]

  return (
    <section className="section-y bg-[var(--color-bone)]">
      <PageWrap>
        <SectionHead kick={kick} title={title} side={intro} />
        <DesktopPillarRow items={pillars} reducedMotion={reducedMotion} />
        <MobilePillarStack items={pillars} />
      </PageWrap>
    </section>
  )
}
