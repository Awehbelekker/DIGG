import PageWrap from '@/components/public/ui/PageWrap'

interface Stat {
  number: string
  label: string
}

export default function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section className="section-y-tight bg-[var(--color-bone)]">
      <PageWrap>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, i) => {
            const len = stat.number.length
            const longValue = len > 8
            const veryLong = len > 10
            return (
            <div key={i} className="bg-[var(--color-ink)] text-[var(--color-bone)] rounded-2xl sm:rounded-[20px] p-4 sm:p-5 lg:p-6 min-w-0 overflow-hidden">
              <div
                className={`font-black leading-tight text-white ${
                  veryLong
                    ? 'text-[0.7rem] sm:text-xs md:text-sm tracking-tight break-all'
                    : longValue
                      ? 'text-[clamp(0.875rem,2.5vw,1.35rem)] tracking-tight break-words'
                      : 'text-[clamp(1.25rem,4.5vw,2.625rem)] leading-none'
                }`}
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {stat.number.replace('+', '')}
                {stat.number.includes('+') && <span className="text-[var(--color-coral)]">+</span>}
              </div>
              <p className="text-[11px] sm:text-[13px] text-[var(--color-greige)] mt-1.5 sm:mt-2 leading-snug">{stat.label}</p>
            </div>
            )
          })}
        </div>
      </PageWrap>
    </section>
  )
}
