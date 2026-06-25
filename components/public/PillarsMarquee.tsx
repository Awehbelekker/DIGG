'use client'

type Item = { word: string }

export default function PillarsMarquee({ items }: { items: Item[] }) {
  const words = items.length > 0 ? items : [
    { word: 'Develop' }, { word: 'Invest' }, { word: 'Grow' }, { word: 'Give' },
  ]
  const track = [...words, ...words]

  return (
    <div className="bg-[var(--color-ink)] text-[var(--color-bone)] py-3 sm:py-4 overflow-hidden">
      <div className="marquee-track inline-flex whitespace-nowrap animate-marquee">
        {track.map((item, i) => (
          <span key={i} className="mx-5 sm:mx-7 text-base sm:text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {item.word}
            <span className="text-[var(--color-coral)]">.</span>
          </span>
        ))}
      </div>
    </div>
  )
}
