'use client'

import {
  type MarqueeDirection,
  type MarqueeItem,
  type MarqueeSpeed,
  MARQUEE_SPEED_SECONDS,
  buildMarqueeTrack,
} from '@/lib/marquee'

type PillarsMarqueeProps = {
  sequence: MarqueeItem[]
  speed?: MarqueeSpeed
  direction?: MarqueeDirection
  pauseOnHover?: boolean
}

function MarqueeWord({ text }: { text: string }) {
  return (
    <span
      className="inline-flex shrink-0 items-center mx-5 sm:mx-8 text-base sm:text-lg font-semibold"
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      {text}
      <span className="text-[var(--color-coral)]">.</span>
    </span>
  )
}

function MarqueePhrase({ text }: { text: string }) {
  return (
    <span className="inline-flex shrink-0 items-center mx-4 sm:mx-6 text-sm sm:text-base font-medium italic text-[var(--color-bone)]/75">
      {text}
    </span>
  )
}

export default function PillarsMarquee({
  sequence,
  speed = 'normal',
  direction = 'left',
  pauseOnHover = false,
}: PillarsMarqueeProps) {
  const track = buildMarqueeTrack(sequence)
  const duration = MARQUEE_SPEED_SECONDS[speed] ?? MARQUEE_SPEED_SECONDS.normal
  const animClass = direction === 'right' ? 'animate-marquee-right' : 'animate-marquee-left'

  return (
    <div
      className={`w-full bg-[var(--color-ink)] text-[var(--color-bone)] py-3 sm:py-4 overflow-hidden${pauseOnHover ? ' marquee-pause-hover' : ''}`}
      aria-hidden
    >
      <div
        className={`marquee-track flex w-max flex-nowrap ${animClass}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {track.map((item, i) =>
          item.kind === 'phrase' ? (
            <MarqueePhrase key={`${item.kind}-${item.text}-${i}`} text={item.text} />
          ) : (
            <MarqueeWord key={`${item.kind}-${item.text}-${i}`} text={item.text} />
          )
        )}
      </div>
    </div>
  )
}
