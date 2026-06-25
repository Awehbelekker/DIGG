import PageWrap from '@/components/public/ui/PageWrap'
import SectionHead from '@/components/public/ui/SectionHead'
import ImageWithPlaceholder from '@/components/public/ImageWithPlaceholder'

const ICON_BG = ['bg-[var(--color-lead)]', 'bg-[var(--color-sage)]', 'bg-[var(--color-navy)]', 'bg-[var(--color-coral)]']
const DEFAULT_ICONS = ['📐', '📊', '🏗️', '🔑']

export type ServiceMediaMode = 'auto' | 'emoji' | 'image'
export type ServiceIconPosition = 'top' | 'left' | 'right'

export type ServiceGridItem = {
  title: string
  description: string
  icon?: string
  imageUrl?: string
  mediaMode?: ServiceMediaMode
  iconPosition?: ServiceIconPosition
}

type ServicesGridProps = {
  kick?: string
  title: string
  side?: string
  cardLayout?: ServiceIconPosition
  items: ServiceGridItem[]
}

function resolveMediaMode(item: ServiceGridItem): 'emoji' | 'image' {
  const mode = item.mediaMode ?? 'auto'
  if (mode === 'emoji') return 'emoji'
  if (mode === 'image') return 'image'
  return item.imageUrl?.trim() ? 'image' : 'emoji'
}

function ServiceIcon({ item, index }: { item: ServiceGridItem; index: number }) {
  const useImage = resolveMediaMode(item) === 'image'
  const image = item.imageUrl?.trim()

  if (useImage && image) {
    return (
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] overflow-hidden shrink-0">
        <ImageWithPlaceholder
          src={image}
          alt={item.title}
          aspectRatio="square"
          className="w-full h-full object-cover"
          placeholderLabel={item.title}
        />
      </div>
    )
  }

  return (
    <div
      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] ${ICON_BG[index % ICON_BG.length]} flex items-center justify-center text-xl sm:text-2xl text-white shrink-0`}
    >
      {item.icon || DEFAULT_ICONS[index % DEFAULT_ICONS.length]}
    </div>
  )
}

function cardPosition(item: ServiceGridItem, sectionLayout: ServiceIconPosition): ServiceIconPosition {
  return item.iconPosition ?? sectionLayout
}

export default function ServicesGrid({
  kick,
  title,
  side,
  cardLayout = 'top',
  items,
}: ServicesGridProps) {
  return (
    <section className="section-y bg-white">
      <PageWrap>
        <SectionHead kick={kick} title={title} side={side} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {items.map((item, i) => {
            const position = cardPosition(item, cardLayout)
            const isInline = position === 'left' || position === 'right'

            return (
              <div
                key={i}
                className={`bg-[var(--color-bone)] rounded-[18px] sm:rounded-[20px] p-5 sm:p-6 lg:p-7 border border-[var(--color-greige)]/50 md:hover:-translate-y-1 md:hover:shadow-lg transition-all duration-250 ${
                  isInline ? 'flex gap-4 items-start' : ''
                } ${position === 'right' ? 'flex-row-reverse text-right' : ''}`}
              >
                <div className={position === 'top' ? 'mb-4' : ''}>
                  <ServiceIcon item={item} index={i} />
                </div>
                <div className={isInline ? 'flex-1 min-w-0' : ''}>
                  <h3
                    className="font-bold text-[var(--color-ink)] mb-2 text-[17px]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[var(--color-muted)] text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </PageWrap>
    </section>
  )
}
