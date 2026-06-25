'use client'

import { useState, useEffect } from 'react'
import PageWrap from '@/components/public/ui/PageWrap'
import SectionHead from '@/components/public/ui/SectionHead'
import { pillarBg } from '@/lib/pillar-colors'

type Pillar = { letter: string; title: string; description: string; colorKey: string }

const TRANSITION = 'transition-[flex,min-height] duration-400 ease-out motion-reduce:transition-none'

/** Desktop: compact row that grows width + height on hover */
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
      className="relative hidden lg:flex gap-3 items-stretch min-h-[128px]"
      onMouseLeave={() => setActive(null)}
    >
      {showLines && <ConnectorLines />}

      {items.map((pillar, i) => {
        const isActive = active === i
        const isDimmed = active !== null && !isActive
        const bg = pillarBg(pillar.colorKey)

        let flexClass = 'flex-1 min-h-[128px]'
        if (isActive) flexClass = 'flex-[2.75] min-h-[240px]'
        else if (isDimmed) flexClass = 'flex-[0.72] min-h-[128px]'

        return (
          <div
            key={i}
            className={`relative z-10 min-w-0 rounded-[20px] overflow-hidden cursor-default flex flex-col ${TRANSITION} ${flexClass}`}
            style={{ backgroundColor: bg }}
            onMouseEnter={() => setActive(i)}
          >
            <div
              className={`flex flex-col h-full p-5 ${reducedMotion ? '' : 'transition-all duration-400 ease-out'} ${
                isActive ? 'justify-start' : 'justify-center items-center'
              }`}
            >
              <span
                className={`font-black text-white shrink-0 ${reducedMotion ? '' : 'transition-all duration-400 ease-out'} ${
                  isActive ? 'text-4xl mb-3 self-start' : 'text-5xl xl:text-6xl self-center'
                }`}
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {pillar.letter}
              </span>

              <div
                className={`text-white w-full ${reducedMotion ? '' : 'transition-all duration-400 ease-out'} ${
                  isActive
                    ? 'opacity-100 max-h-[200px]'
                    : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'
                }`}
              >
                <h3 className="font-bold text-lg mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>
                  {pillar.title}
                </h3>
                <p className="text-sm text-white/90 leading-relaxed">{pillar.description}</p>
              </div>

              {!isActive && active === null && (
                <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] font-semibold uppercase tracking-wider text-white/50 pointer-events-none">
                  Hover
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Mobile / tablet: tap accordion stack */
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
            className="rounded-[20px] overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
            style={{ backgroundColor: bg }}
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
            <div className="p-5">
              <div className="flex items-start gap-3">
                <span
                  className="font-black text-3xl text-white shrink-0 w-10"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {pillar.letter}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                    {pillar.title}
                  </h3>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      open ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-sm text-white/90 leading-relaxed">{pillar.description}</p>
                  </div>
                  {!open && <p className="text-xs text-white/60 mt-1.5">Tap to read more</p>}
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
      className="absolute inset-0 w-full h-[128px] pointer-events-none z-0"
      viewBox="0 0 1000 128"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d="M125 64 Q250 24 375 64" fill="none" stroke="#E8624D" strokeWidth="3" opacity="0.65" />
      <path d="M375 64 Q500 104 625 64" fill="none" stroke="#B56244" strokeWidth="3" opacity="0.65" />
      <path d="M625 64 Q750 24 875 64" fill="none" stroke="#8A9A7B" strokeWidth="3" opacity="0.65" />
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
    <section className="py-12 sm:py-16 lg:py-[72px] bg-[var(--color-bone)]">
      <PageWrap>
        <SectionHead kick={kick} title={title} side={intro} />
        <DesktopPillarRow items={pillars} reducedMotion={reducedMotion} />
        <MobilePillarStack items={pillars} />
      </PageWrap>
    </section>
  )
}
