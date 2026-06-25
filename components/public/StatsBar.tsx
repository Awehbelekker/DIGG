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
            const longValue = stat.number.length > 9
            return (
            <div key={i} className="bg-[var(--color-ink)] text-[var(--color-bone)] rounded-2xl sm:rounded-[20px] p-4 sm:p-6 lg:p-7 min-w-0 overflow-hidden">
              <div
                className={`font-black leading-none text-white break-words ${
                  longValue
                    ? 'text-[clamp(0.875rem,2.8vw,1.5rem)] tracking-tight'
                    : 'text-[clamp(1.25rem,4.5vw,2.625rem)]'
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
