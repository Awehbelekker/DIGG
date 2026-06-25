import PageWrap from '@/components/public/ui/PageWrap'

interface Stat {
  number: string
  label: string
}

function valueSizeClass(value: string): string {
  const v = value.trim()
  const len = v.length
  if (len <= 6) {
    return 'text-[clamp(1.35rem,4.5vw,2.625rem)] leading-none'
  }
  if (len <= 10) {
    return 'text-[clamp(1rem,3.2vw,2rem)] leading-tight tracking-tight'
  }
  if (len <= 14) {
    return 'text-[clamp(0.85rem,2.4vw,1.25rem)] leading-tight tracking-tight'
  }
  return 'text-[clamp(0.75rem,2vw,1.05rem)] leading-tight tracking-tight'
}

function StatValue({ value }: { value: string }) {
  const trimmed = value.trim()
  const pat = trimmed.match(/^(PAT)(\d+)$/i)

  if (pat) {
    return (
      <div
        className={`font-black text-white ${valueSizeClass(trimmed)}`}
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        <span className="block">{pat[1].toUpperCase()}</span>
        <span className="block text-[0.88em] font-bold tabular-nums tracking-normal">{pat[2]}</span>
      </div>
    )
  }

  const hasPlus = trimmed.includes('+')
  const display = trimmed.replace(/\+/g, '')

  return (
    <div
      className={`font-black text-white break-words ${valueSizeClass(trimmed)}`}
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      {display}
      {hasPlus && <span className="text-[var(--color-coral)]">+</span>}
    </div>
  )
}

export default function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section className="section-y-tight bg-[var(--color-bone)]">
      <PageWrap>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[var(--color-ink)] text-[var(--color-bone)] rounded-2xl sm:rounded-[20px] px-3 py-4 sm:px-4 sm:py-5 lg:px-5 lg:py-6 min-w-0 min-h-[5.75rem] sm:min-h-[6.5rem] lg:min-h-[7.25rem] flex flex-col items-center justify-center text-center overflow-hidden"
            >
              <StatValue value={stat.number} />
              <p className="text-[10px] sm:text-xs text-[var(--color-greige)] mt-2 sm:mt-2.5 leading-snug max-w-[14ch] sm:max-w-none">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </PageWrap>
    </section>
  )
}
