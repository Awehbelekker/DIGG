'use client'

import { useState, useEffect } from 'react'
import PageWrap from '@/components/public/ui/PageWrap'
import SectionHead from '@/components/public/ui/SectionHead'
import { pillarBg } from '@/lib/pillar-colors'

type Pillar = { letter: string; title: string; description: string; colorKey: string }

function PillarBlock({
  pillar,
  canHover,
  reducedMotion,
}: {
  pillar: Pillar
  canHover: boolean
  reducedMotion: boolean
}) {
  const [open, setOpen] = useState(false)
  const bg = pillarBg(pillar.colorKey)
  const expanded = canHover ? open : open

  return (
    <div
      className={`relative flex-1 min-w-0 rounded-[20px] p-5 sm:p-6 flex flex-col overflow-hidden transition-transform duration-300 ${
        canHover ? 'min-h-[280px] sm:min-h-[320px] justify-end cursor-default md:hover:scale-[1.02]' : 'min-h-0 cursor-pointer active:scale-[0.99]'
      }`}
      style={{ backgroundColor: bg }}
      onMouseEnter={() => canHover && !reducedMotion && setOpen(true)}
      onMouseLeave={() => canHover && !reducedMotion && setOpen(false)}
      onClick={() => !canHover && setOpen((o) => !o)}
      role={canHover ? undefined : 'button'}
      tabIndex={canHover ? undefined : 0}
      aria-expanded={canHover ? undefined : expanded}
      onKeyDown={(e) => {
        if (!canHover && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          setOpen((o) => !o)
        }
      }}
    >
      <span
        className={`font-black text-white transition-all duration-300 shrink-0 ${
          canHover
            ? expanded
              ? 'text-4xl mb-3 relative'
              : 'text-5xl sm:text-6xl lg:text-7xl absolute top-5 sm:top-6 left-5 sm:left-6'
            : 'text-3xl sm:text-4xl mb-2'
        }`}
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {pillar.letter}
      </span>

      {canHover ? (
        <div
          className={`text-white transition-all duration-300 ${
            expanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <h3 className="font-bold text-base sm:text-lg mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            {pillar.title}
          </h3>
          <p className="text-sm text-white/90 leading-relaxed">{pillar.description}</p>
        </div>
      ) : (
        <>
          <h3 className="font-bold text-base text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            {pillar.title}
          </h3>
          <div
            className={`text-white overflow-hidden transition-all duration-300 ${
              expanded ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-sm text-white/90 leading-relaxed pb-1">{pillar.description}</p>
          </div>
          {!expanded && (
            <p className="text-xs text-white/70 mt-2">Tap to read more</p>
          )}
        </>
      )}
    </div>
  )
}

function ConnectorLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
      viewBox="0 0 1000 320"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d="M125 160 Q250 80 375 160" fill="none" stroke="#E8624D" strokeWidth="3" opacity="0.7" />
      <path d="M375 160 Q500 240 625 160" fill="none" stroke="#B56244" strokeWidth="3" opacity="0.7" />
      <path d="M625 160 Q750 80 875 160" fill="none" stroke="#8A9A7B" strokeWidth="3" opacity="0.7" />
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
  const [canHover, setCanHover] = useState(true)

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => {
      setReducedMotion(motionMq.matches)
      setCanHover(hoverMq.matches)
    }
    sync()
    motionMq.addEventListener('change', sync)
    hoverMq.addEventListener('change', sync)
    return () => {
      motionMq.removeEventListener('change', sync)
      hoverMq.removeEventListener('change', sync)
    }
  }, [])

  return (
    <section className="py-12 sm:py-16 lg:py-[72px] bg-[var(--color-bone)]">
      <PageWrap>
        <SectionHead kick={kick} title={title} side={intro} />
        <div className="relative">
          <ConnectorLines />
          <div
            className={`relative z-10 gap-3 sm:gap-4 ${
              canHover
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                : 'flex flex-col'
            }`}
          >
            {items.map((p, i) => (
              <PillarBlock key={i} pillar={p} canHover={canHover} reducedMotion={reducedMotion} />
            ))}
          </div>
        </div>
      </PageWrap>
    </section>
  )
}
