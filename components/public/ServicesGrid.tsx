import PageWrap from '@/components/public/ui/PageWrap'
import SectionHead from '@/components/public/ui/SectionHead'

const ICON_BG = ['bg-[var(--color-lead)]', 'bg-[var(--color-sage)]', 'bg-[var(--color-navy)]', 'bg-[var(--color-coral)]']
const DEFAULT_ICONS = ['📐', '📊', '🏗️', '🔑']

type Item = { title: string; description: string; icon?: string }

export default function ServicesGrid({
  kick,
  title,
  side,
  items,
}: {
  kick?: string
  title: string
  side?: string
  items: Item[]
}) {
  return (
    <section className="py-12 sm:py-16 lg:py-[72px] bg-[var(--color-bone)]">
      <PageWrap>
        <SectionHead kick={kick} title={title} side={side} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-[18px] sm:rounded-[20px] p-5 sm:p-6 lg:p-7 border border-[var(--color-greige)]/50 md:hover:-translate-y-1 md:hover:shadow-lg transition-all duration-250"
            >
              <div
                className={`w-12 h-12 rounded-[14px] ${ICON_BG[i % ICON_BG.length]} flex items-center justify-center text-xl mb-4 text-white`}
              >
                {item.icon || DEFAULT_ICONS[i % DEFAULT_ICONS.length]}
              </div>
              <h3 className="font-bold text-[var(--color-ink)] mb-2 text-[17px]" style={{ fontFamily: 'var(--font-heading)' }}>
                {item.title}
              </h3>
              <p className="text-[var(--color-muted)] text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </PageWrap>
    </section>
  )
}
